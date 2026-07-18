// Функция плавного скролла к элементу за заданное время (ms)
// smoothScroll.ts
type CancelHandle = { cancel: () => void };

const _rafHandles = new WeakMap<HTMLElement, CancelHandle>();

/**
 * Анимирует изменение container.scrollTop до targetScrollTop за duration миллисекунд.
 * Возвращает Promise, который резолвится после завершения (или отмены).
 */
export function smoothScrollTo(container: HTMLElement, targetScrollTop: number, duration = 500): Promise<void> {
  return new Promise((resolve) => {
    if (!container) return resolve();

    // отменяем предыдущую анимацию для этого контейнера (если есть)
    const prev = _rafHandles.get(container);
    if (prev) prev.cancel();

    const startScrollTop = container.scrollTop;
    const change = targetScrollTop - startScrollTop;

    if (change === 0 || duration <= 0) {
      container.scrollTop = targetScrollTop;
      return resolve();
    }

    const startTime = performance.now();
    let rafId = 0;
    let cancelled = false;

    const easeInOutQuad = (t: number): number => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

    function step(now: number): void {
      if (cancelled) {
        resolve();
        return;
      }
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = easeInOutQuad(t);
      container.scrollTop = startScrollTop + change * eased;
      if (t < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        _rafHandles.delete(container);
        resolve();
      }
    }

    const cancel = (): void => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      _rafHandles.delete(container);
      resolve();
    };

    _rafHandles.set(container, { cancel });
    rafId = requestAnimationFrame(step);
  });
}

/**
 * Плавно прокручивает контейнер так, чтобы элемент `el` оказался выровнен по центру видимой области.
 * duration в миллисекундах (по умолчанию 100).
 */
export const smoothScrollElementIntoView = (
  container: HTMLDivElement | null,
  el: HTMLDivElement | null,
  duration = 100,
  block: 'start' | 'center' | 'end' = 'center', // Добавляем параметр выравнивания
): Promise<void> => {
  if (!container || !el) return Promise.resolve();

  const containerRect = container.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();

  let offset: number;

  switch (block) {
    case 'center':
      // Центрируем элемент в контейнере
      const containerCenter = containerRect.height / 2;
      const elCenter = elRect.height / 2;
      offset = elRect.top + elCenter - (containerRect.top + containerCenter);
      break;
    case 'end':
      // Выравниваем по низу контейнера
      offset = elRect.bottom - containerRect.bottom + 50; //50px смещение относительно низа вверх
      break;
    case 'start':
    default:
      // Выравниваем по верху контейнера (исходное поведение)
      offset = elRect.top - containerRect.top + 50; //50px смещение относительно вверха в низ
      break;
  }

  const targetScrollTop = container.scrollTop + offset;

  return smoothScrollTo(container, targetScrollTop, duration);
};
