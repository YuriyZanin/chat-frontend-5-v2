'use client';
import { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from '@tanstack/react-query';
import type { ChatListApiResponse } from 'modules/conversation/chats/model/chat';
import type { UserContactApiResponse } from 'modules/conversation/contacts/model/contact';
import { RefObject, useEffect, useRef } from 'react';
import type { MessagesListApiResponse } from '../model/messages-list';
type UseInfiniteScrollReturn = {
  wrapperRef: RefObject<HTMLDivElement | null>;
  sentinelRef: RefObject<HTMLDivElement | null>;
};

export const useInfiniteScroll = ({
  isFetchingNextPage,
  fetchNextPage,
  hasNextPage,
  arrayLenght,
  scrollType,
}: {
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  arrayLenght: number;
  scrollType: 'down' | 'up';
  fetchNextPage: (
    options?: FetchNextPageOptions,
  ) => Promise<
    InfiniteQueryObserverResult<
      InfiniteData<MessagesListApiResponse | ChatListApiResponse | UserContactApiResponse>,
      unknown
    >
  >;
}): UseInfiniteScrollReturn => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  // локальная блокировка, чтобы избежать параллельных вызовов fetchNextPage
  const fetchingRef = useRef(false);
  // ---- Функция для безопасного вызова fetchNextPage с сохранением позиции при prepend ----
  // Эта функция вызывается при пересечении sentinel (вверху) — у вас может потребоваться триггерить fetchNextPage
  // и логика ниже также может быть использована при прокрутке вверх (если вы подгружаете старые).
  const fetchOlder = async (): Promise<void> => {
    const el = wrapperRef.current;
    if (!el) return;
    if (!hasNextPage) return;
    if (isFetchingNextPage || fetchingRef.current) return;
    // Сохраним текущие параметры прокрутки
    const previousScrollTop = el.scrollTop;
    const previousScrollHeight = el.scrollHeight;
    fetchingRef.current = true;
    try {
      await fetchNextPage();
      // После того, как новые (старые) сообщения были добавлены в DOM, реактивно обновится results,
      // и в этот момент браузер ещё может не законить рендер — сделаем requestAnimationFrame.
      requestAnimationFrame(() => {
        // Новая высота
        const newScrollHeight = el.scrollHeight;
        // Хотим сохранить визуальную позицию: выставляем scrollTop так, чтобы
        // элемент, который был внизу видимой области, оставался на том же месте.
        // Формула:
        // newScrollTop = newScrollHeight - previousScrollHeight + previousScrollTop
        const newScrollTop =
          scrollType === 'up'
            ? newScrollHeight - previousScrollHeight + previousScrollTop
            : previousScrollHeight - (newScrollHeight - previousScrollHeight) / 6;
        // Устанавливаем значение (защищаем от отрицательных)
        el.scrollTop = Math.max(0, newScrollTop);
      });
    } catch (e) {
      console.error('fetchNextPage failed', e);
    } finally {
      fetchingRef.current = false;
    }
  };
  // IntersectionObserver для бесконечной подгрузки:
  //  - наблюдаем sentinelRef.current (который рендерится в верху списка)
  useEffect((): (() => void) => {
    const sentinelEl = sentinelRef.current;
    if (!sentinelEl) {
      return () => {};
    }

    const onIntersect: IntersectionObserverCallback = (entries) => {
      const entry = entries[0];
      if (!entry) return;
      if (entry.isIntersecting) {
        // Если sentinel пересёкся — вызовем безопасный fetchOlder
        fetchOlder();
      }
    };

    const observer = new IntersectionObserver(onIntersect, {
      root: null,
      rootMargin: '200px',
      threshold: 0,
    });

    observer.observe(sentinelEl);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, arrayLenght]);
  return { wrapperRef, sentinelRef };
};
