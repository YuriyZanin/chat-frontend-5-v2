'use client';
import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { RestMessageApi } from '../model/messages-list';
import { useMessagesListScreen } from '../screens';
import { useMessagesListSearchScreen } from '../screens/use-messages-list-search-screen';
import { smoothScrollElementIntoView } from '../utils/smooth-scroll';
import {
  useGoToNextSearchMessageStore,
  useGoToPrevSearchMessageStore,
  useSearchIndicatorStore,
  useUserIdStore,
} from '../zustand-store/zustand-store';
import { READING_TIME } from './use-intersection-read';

type UseSearchAndNavigateSortedMessagesReturn = {
  searchMessagesStore: string;
  availableSearchUids: string[];
  setMessageRef: (uid: string) => (el: HTMLDivElement | null) => void;
  targetSearchUid: string | null;
};

type UseSearchAndNavigateSortedMessagesProps = {
  flatList: Array<{
    date: string;
    message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' };
  }>;
  wrapperRef: RefObject<HTMLDivElement | null>;
};

export const useSearchAndNavigateSortedMessages = ({
  flatList,
  wrapperRef,
}: UseSearchAndNavigateSortedMessagesProps): UseSearchAndNavigateSortedMessagesReturn => {
  const userIdStore = useUserIdStore((s) => s.userId);
  const userId = userIdStore.startsWith('group_')
    ? userIdStore.replace('group_', '')
    : userIdStore.startsWith('channel_')
      ? userIdStore.replace('channel_', '')
      : userIdStore;

  //хук для получения с сервера списка всех сообщений чата
  const { messagesList, fetchNextPage, hasNextPage } = useMessagesListScreen(userId);
  // хук для получения с сервера списка сообщений чата, текст которых содержит значение "searchMessagesStore"
  const { searchMessagesStore, uidMessagesSearch } = useMessagesListSearchScreen(userId);

  // Создаём Map для быстрого поиска uid -> индекс в flatList
  const uidToIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    flatList.forEach((item, idx) => {
      map.set(item.message.uid, idx);
    });
    return map;
  }, [flatList]);

  // Фильтруем uidMessagesSearch, оставляя только те, которые есть в текущем чате
  const availableSearchUids = useMemo(() => {
    return uidMessagesSearch.filter((uid) => uidToIndexMap.has(uid));
  }, [uidMessagesSearch, uidToIndexMap]);

  // Инициализируем состояние с правильным начальным значением
  const [currentSearchIndex, setCurrentSearchIndex] = useState<number | null>(() => {
    if (searchMessagesStore && availableSearchUids.length > 0) {
      return 0;
    }
    return null;
  });

  //Используем useRef для отслеживания предыдущих значений
  const prevSearchMessagesStoreRef = useRef(searchMessagesStore);
  const prevAvailableUidsLengthRef = useRef(availableSearchUids.length);

  // Эффект только для синхронизации с внешними изменениями
  useEffect(() => {
    const searchStarted = searchMessagesStore && !prevSearchMessagesStoreRef.current;
    const searchCleared = !searchMessagesStore && prevSearchMessagesStoreRef.current;
    const resultsChanged = searchMessagesStore && availableSearchUids.length !== prevAvailableUidsLengthRef.current;

    if (searchStarted || (resultsChanged && availableSearchUids.length > 0)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentSearchIndex(0);
    } else if (searchCleared) {
      setCurrentSearchIndex(null);
    }

    prevSearchMessagesStoreRef.current = searchMessagesStore;
    prevAvailableUidsLengthRef.current = availableSearchUids.length;
  }, [searchMessagesStore, availableSearchUids.length]);

  // Вычисляем targetSearchUid на основе currentSearchIndex (без отдельного состояния)
  const targetSearchUid = useMemo(() => {
    if (!searchMessagesStore || availableSearchUids.length === 0 || currentSearchIndex === null) {
      return null;
    }
    return availableSearchUids[currentSearchIndex];
  }, [searchMessagesStore, availableSearchUids, currentSearchIndex]);

  // Мапа uid -> ref DOM-элемента
  const messageRefs = useRef(new Map<string, HTMLDivElement>());

  // Убираем wrapperRef из зависимостей useCallback
  const setMessageRef = useCallback(
    (uid: string) =>
      (el: HTMLDivElement | null): void => {
        if (el) {
          messageRefs.current.set(uid, el);
        } else {
          messageRefs.current.delete(uid);
        }
      },
    [],
  );

  // Проверяем, загружено ли сообщение с нужным id в текущий чат
  const isMessageLoaded = useCallback(
    (uid: string): boolean => {
      return messagesList.some((m) => m.uid === uid);
    },
    [messagesList],
  );

  // функция прокрутки скролла до элемента с uid
  const scrollToMessageByUid = useCallback(
    (uid: string) => {
      const el = messageRefs.current.get(uid);
      if (el && wrapperRef.current) {
        smoothScrollElementIntoView(wrapperRef.current, el, READING_TIME, 'end');
      }
    },
    [wrapperRef],
  );

  // Догрузка страниц, пока нужное сообщение не появится
  const ensureMessageLoadedAndScroll = useCallback(
    async (uid: string): Promise<boolean> => {
      // Если уже есть — сразу скроллим
      if (isMessageLoaded(uid)) {
        scrollToMessageByUid(uid);
        return true;
      }

      // Сохраняем текущую позицию скролла
      const previousScrollHeight = wrapperRef.current?.scrollHeight || 0;
      const previousScrollTop = wrapperRef.current?.scrollTop || 0;

      // Загружаем страницы, пока не найдём сообщение или не кончатся страницы
      let attempts = 0;
      const maxAttempts = 50;

      while (hasNextPage && !isMessageLoaded(uid) && attempts < maxAttempts) {
        await fetchNextPage();
        attempts++;
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Восстанавливаем позицию скролла после загрузки
      if (wrapperRef.current && !isMessageLoaded(uid)) {
        const newScrollHeight = wrapperRef.current.scrollHeight;
        const heightDiff = newScrollHeight - previousScrollHeight;
        wrapperRef.current.scrollTop = previousScrollTop + heightDiff;
      }

      // Теперь прокручиваем к нужному сообщению
      if (isMessageLoaded(uid)) {
        scrollToMessageByUid(uid);
        return true;
      }

      console.warn(`Message with uid ${uid} not found in chat`);
      return false;
    },
    [isMessageLoaded, scrollToMessageByUid, hasNextPage, fetchNextPage, wrapperRef],
  );

  // Следим за изменением targetSearchUid и выполняем прокрутку
  useEffect(() => {
    if (!targetSearchUid) return;

    const scrollToTarget = async (): Promise<void> => {
      await ensureMessageLoadedAndScroll(targetSearchUid);
    };

    scrollToTarget();
  }, [targetSearchUid, ensureMessageLoadedAndScroll]);

  // Навигация: следующее сообщение
  const goToNextSearchMessage = useCallback(() => {
    if (!searchMessagesStore || availableSearchUids.length === 0) return;

    const nextIndex = currentSearchIndex === null ? 0 : (currentSearchIndex + 1) % availableSearchUids.length;

    setCurrentSearchIndex(nextIndex);
    // targetSearchUid вычислится автоматически через useMemo
  }, [searchMessagesStore, availableSearchUids, currentSearchIndex]);

  // Навигация: предыдущее сообщение
  const goToPrevSearchMessage = useCallback(() => {
    if (!searchMessagesStore || availableSearchUids.length === 0) return;

    const prevIndex =
      currentSearchIndex === null
        ? availableSearchUids.length - 1
        : (currentSearchIndex - 1 + availableSearchUids.length) % availableSearchUids.length;

    setCurrentSearchIndex(prevIndex);
    // targetSearchUid вычислится автоматически через useMemo
  }, [searchMessagesStore, availableSearchUids, currentSearchIndex]);

  // Показываем индикатор текущего результата поиска
  const searchIndicator = useMemo(() => {
    if (!searchMessagesStore || availableSearchUids.length === 0 || currentSearchIndex === null) {
      return null;
    }
    return {
      currentSearchIndex: currentSearchIndex + 1,
      lastSearchIndex: availableSearchUids.length,
    };
  }, [searchMessagesStore, availableSearchUids, currentSearchIndex]);

  const setGoToNextSearchMessageStore = useGoToNextSearchMessageStore((s) => s.setGoToNextSearchMessage);
  const setGoToPrevSearchMessageStore = useGoToPrevSearchMessageStore((s) => s.setGoToPrevSearchMessage);
  const setSearchIndicatorStore = useSearchIndicatorStore((s) => s.setSearchIndicator);
  setGoToNextSearchMessageStore(goToNextSearchMessage);
  setGoToPrevSearchMessageStore(goToPrevSearchMessage);
  setSearchIndicatorStore(searchIndicator);
  return {
    searchMessagesStore,
    availableSearchUids,
    setMessageRef,
    targetSearchUid,
  };
};
