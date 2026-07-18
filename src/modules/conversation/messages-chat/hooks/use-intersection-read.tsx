import { useCallback, useEffect, useRef } from 'react';
import type { RestMessageApi } from '../model/messages-list';

export const READING_TIME = 100;
type UseIntersectionReadOptions = {
  threshold?: number; // default 0.6
  holdMs?: number; // default 100
  root?: Element | null;
  rootMargin?: string;
};
type UseIntersectionRead = {
  register: (el: Element | null, message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' }) => void;
};

export function useIntersectionRead(
  onRead: (message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' }) => void,
  options: UseIntersectionReadOptions = {},
): UseIntersectionRead {
  const { threshold = 0.6, holdMs = READING_TIME, root = null, rootMargin = '0px' } = options;

  const reportedRef = useRef<Set<string>>(new Set());
  const timersRef = useRef<Map<Element, ReturnType<typeof setTimeout>>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);
  // хранит соответствие element -> message
  const messageMapRef = useRef<WeakMap<Element, RestMessageApi>>(new WeakMap());

  const scheduleRead = useCallback(
    (el: Element) => {
      const message = messageMapRef.current.get(el);
      if (!message) return;
      const id = message.uid;
      if (!id) return;
      if (reportedRef.current.has(id)) return;
      if (timersRef.current.has(el)) return;

      const t = setTimeout(() => {
        timersRef.current.delete(el);
        if (reportedRef.current.has(id)) return;
        reportedRef.current.add(id);
        try {
          onRead(message);
        } catch (err) {
          console.error('onRead callback error', err);
        }
        // stop observing the element — we already reported it
        if (observerRef.current) {
          try {
            observerRef.current.unobserve(el);
          } catch (e) {
            // ignore
          }
        }
      }, holdMs);
      timersRef.current.set(el, t);
    },
    [holdMs, onRead],
  );

  const cancelScheduled = useCallback((el: Element) => {
    const t = timersRef.current.get(el);
    if (t !== undefined) {
      clearTimeout(t);
      timersRef.current.delete(el);
    }
  }, []);

  const handleIntersect: IntersectionObserverCallback = useCallback(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        // get message by element
        const message = messageMapRef.current.get(el);
        const id = message?.uid;
        if (!id) return;
        if (reportedRef.current.has(id)) {
          cancelScheduled(el);
          if (observerRef.current) {
            try {
              observerRef.current.unobserve(el);
            } catch (e) {
              // ignore
            }
          }
          return;
        }
        if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
          scheduleRead(el);
        } else {
          cancelScheduled(el);
        }
      });
    },
    [cancelScheduled, scheduleRead, threshold],
  );

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    const obs = new IntersectionObserver(handleIntersect, { root, rootMargin, threshold });
    observerRef.current = obs;
    return (): void => {
      obs.disconnect();
      observerRef.current = null;
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current.clear();
    };
  }, [handleIntersect, root, rootMargin, threshold]);

  const register = useCallback(
    (el: Element | null, message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' }) => {
      if (!el) return;
      if (!message?.uid) return;
      // store message in weak map
      messageMapRef.current.set(el, message);
      // if already reported — skip observing
      if (reportedRef.current.has(message.uid)) return;
      if (!observerRef.current) {
        observerRef.current = new IntersectionObserver(handleIntersect, { root, rootMargin, threshold });
      }
      observerRef.current.observe(el);
    },
    [handleIntersect, root, rootMargin, threshold],
  );

  return {
    register,
  };
}
