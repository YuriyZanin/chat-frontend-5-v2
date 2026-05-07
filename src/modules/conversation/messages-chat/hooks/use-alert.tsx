'use client';
import React, { JSX, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { RestMessageApi } from '../model/messages-list';
import { AlertAttachmentFiles } from '../ui/alert-components/alert-attachment-files/alert-attachment-files';
import { AlertAttachmentImages } from '../ui/alert-components/alert-attachment-images/alert-attachment-images';
import { AlertDelete } from '../ui/alert-components/alert-delete/alert-delete';
import { AlertForward } from '../ui/alert-components/alert-forward/alert-forward';
import { AlertOpenImages } from '../ui/alert-components/alert-open-images/alert-open-images';

export type AlertOptions = {
  id?: string | number;
  title?: string;
  message?: string;
  okText?: string;
  cancelText?: string;
  showCheckBox?: boolean;
  labelCheckBox?: string;
  closeOnScrim?: boolean;
  blurPage?: boolean;
  blurAmount?: number;
  onOk?: () => void;
  onCancel?: () => void;
  isMessageForwarding?: boolean;
  isAttachmentFiles?: boolean;
  isAttachmentImages?: boolean;
  openImages?: {
    isOpenImages: boolean;
    message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' };
  };
};

type AlertContextValue = {
  show: (opts: AlertOptions) => string | number;
  confirm: (opts: AlertOptions) => Promise<boolean>;
  hide: (id?: string | number) => void;
  hideAll: () => void;
};

const AlertContext = createContext<AlertContextValue | null>(null);

let idCounter = 1;
const genId = (): string => `alert_${idCounter++}`;

let defaultPortalRoot: HTMLElement | null = null;
if (typeof document !== 'undefined') {
  let r = document.getElementById('alert-portal-root');
  if (!r) {
    r = document.createElement('div');
    r.id = 'alert-portal-root';
    r.className = 'alert-portal-root';
    document.body.appendChild(r);
  }
  defaultPortalRoot = r;
}

export const AlertProvider = ({
  children,
  blurTargetSelector = null,
}: {
  children: React.ReactNode;
  blurTargetSelector?: string | null;
}): JSX.Element => {
  const [alerts, setAlerts] = useState<Array<AlertOptions & { id: string | number }>>([]);
  const resolversRef = useRef(new Map<string | number, (v: boolean) => void>());

  // portal root  — создаём единожды на клиенте
  const [portalRoot] = useState<HTMLElement | null>(defaultPortalRoot);

  const show = useCallback((opts: AlertOptions = {}) => {
    const id = opts.id ?? genId();
    setAlerts((s) => [...s, { ...opts, id }]);
    return id;
  }, []);

  const confirm = useCallback((opts: AlertOptions = {}) => {
    const id = opts.id ?? genId();
    return new Promise<boolean>((resolve) => {
      resolversRef.current.set(id, resolve);
      setAlerts((s) => [...s, { ...opts, id }]);
    });
  }, []);

  const hide = useCallback((id?: string | number) => {
    if (typeof id === 'undefined') {
      setAlerts((s) => (s.length > 0 ? s.slice(0, -1) : s));
      return;
    }
    setAlerts((s) => s.filter((a) => a.id !== id));
    const r = resolversRef.current.get(id);
    if (r) {
      r(false);
      resolversRef.current.delete(id);
    }
  }, []);

  const hideAll = useCallback(() => {
    setAlerts([]);
    resolversRef.current.forEach((res) => res(false));
    resolversRef.current.clear();
  }, []);

  const handleOk = useCallback((id: string | number) => {
    setAlerts((s) => {
      const a = s.find((x) => x.id === id);
      a?.onOk?.();
      return s.filter((x) => x.id !== id);
    });
    const r = resolversRef.current.get(id);
    if (r) {
      r(true);
      resolversRef.current.delete(id);
    }
  }, []);

  const handleCancel = useCallback((id: string | number) => {
    setAlerts((s) => {
      const a = s.find((x) => x.id === id);
      a?.onCancel?.();
      return s.filter((x) => x.id !== id);
    });
    const r = resolversRef.current.get(id);
    if (r) {
      r(false);
      resolversRef.current.delete(id);
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      show,
      confirm,
      hide,
      hideAll,
    }),
    [show, confirm, hide, hideAll],
  );

  // blur target handling: apply/remove blur class while any alert shown
  useEffect(() => {
    if (typeof document === 'undefined') return;

    // сначала пытаемся найти целевой элемент: селектор или #__next
    const blurEl = blurTargetSelector
      ? document.querySelector(blurTargetSelector)
      : document.querySelector('.protected-layout_root__lC8sb');

    if (!blurEl) {
      // намеренно НЕ используем document.body как fallback, чтобы не блурать портал
      // выводим предупреждение для разработчика
      if (alerts.length > 0) {
        console.warn(
          'AlertProvider: blur target not found (no element matching blurTargetSelector and no #__next). Skipping blur to avoid blurring the portal.',
        );
      }
      return;
    }
    if (alerts.length > 0) {
      blurEl.classList.add('app-alert-blurred');
    } else {
      blurEl.classList.remove('app-alert-blurred');
    }

    return (): void => {
      blurEl.classList.remove('app-alert-blurred');
    };
  }, [alerts.length, blurTargetSelector]);

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      {/* render portal only after mount to avoid hydration mismatch and only if portal root ready */}
      {portalRoot &&
        createPortal(
          <>
            {alerts.map((a) => (
              <div
                key={String(a.id)}
                className="alert-scrim"
                onClick={(e) => {
                  if (a.closeOnScrim !== false && e.target === e.currentTarget) {
                    handleCancel(a.id);
                  }
                }}
              >
                {a.isMessageForwarding ? (
                  <AlertForward onOk={() => handleOk(a.id)} onCancel={() => handleCancel(a.id)} />
                ) : a.isAttachmentFiles ? (
                  <AlertAttachmentFiles onOk={() => handleOk(a.id)} onCancel={() => handleCancel(a.id)} />
                ) : a.isAttachmentImages ? (
                  <AlertAttachmentImages onOk={() => handleOk(a.id)} onCancel={() => handleCancel(a.id)} />
                ) : a.openImages?.isOpenImages ? (
                  <AlertOpenImages
                    onOk={() => handleOk(a.id)}
                    onCancel={() => handleCancel(a.id)}
                    message={a.openImages?.message}
                  />
                ) : (
                  <AlertDelete
                    id={a.id}
                    title={a.title}
                    message={a.message}
                    okText={a.okText ?? 'Удалить'}
                    cancelText={a.cancelText ?? 'Отмена'}
                    showCheckBox={a.showCheckBox}
                    labelCheckBox={a.labelCheckBox}
                    onOk={() => handleOk(a.id)}
                    onCancel={() => handleCancel(a.id)}
                  />
                )}
              </div>
            ))}
          </>,
          portalRoot,
        )}
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextValue => {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlert must be used within AlertProvider');
  return ctx;
};
