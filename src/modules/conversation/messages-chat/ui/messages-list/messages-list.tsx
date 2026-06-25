'use client';
import { JSX, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { READING_TIME, useIntersectionRead } from '../../hooks/use-intersection-read';
import { useSearchAndNavigateSortedMessages } from '../../hooks/use-search-and-navigate-sorted-messages';
import { handlerMessagesList } from '../../lib/handler-messages-list';
import type { RestMessageApi } from '../../model/messages-list';
import { smoothScrollElementIntoView } from '../../utils/smooth-scroll';
import { useMessagesChatStore, useToastVisibleStore } from '../../zustand-store/zustand-store';
import { DateCard } from '../date-card/date-card';
import { IncomingAudioCard } from '../message-card/audio-card/incoming-audio-card/incoming-audio-card';
import { OutgoingAudioCard } from '../message-card/audio-card/outgoing-audio-card/outgoing-audio-card';
import { IncomingFileCard } from '../message-card/file-card/incoming-file-card/incoming-file-card';
import { OutgoingFileCard } from '../message-card/file-card/outgoing-file-card/outgoing-file-card';
import { IncomingImagesCard } from '../message-card/images-card/incoming-images-card/incoming-images-card';
import { OutgoingImagesCard } from '../message-card/images-card/outgoing-images-card/outgoing-images-card';
import { IncomingMessagesCard } from '../message-card/incoming-message-card/incoming-message-card';
import { IncomingInformationForGroupCard } from '../message-card/information-card-for-group/incoming-information-card-for-group/incoming-information-card-for-group';
import { OutgoingInformationForGroupCard } from '../message-card/information-card-for-group/outgoing-information-card-for-group/outgoing-information-card-for-group';
import { NotificationCopyCard } from '../message-card/notification-copy-card/notification-copy-card';
import { OutgoingMessagesCard } from '../message-card/outgoing-message-card/outgoing-message-card';
import { IncomingPhoneCallCard } from '../message-card/phone-call-cards/incoming-phone-call-card/incoming-phone-call-card';
import { OutgoingPhoneCallCard } from '../message-card/phone-call-cards/outgoing-phone-call-card/outgoing-phone-call-card';
import { IncomingProfileLinkCard } from '../message-card/profile-link-card/incoming-profile-link-card/incoming-profile-link-card';
import { OutgoingProfileLinkCard } from '../message-card/profile-link-card/outgoing-profile-link-card/outgoing-profile-link-card';
import { ScrollButton } from '../scroll-button/scroll-button';
import styles from './message-list.module.scss';
import type { MessageListProps } from './message-list.props';
import { useFixedTargetIndex } from './use-fixed-target-index';
export const MessagesList = ({
  messagesList,
  currentUserId,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  sendChangeStatusReadMessage,
  sendDeleteMessage,
  userIdStore,
}: MessageListProps): JSX.Element => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const targetItemRef = useRef<HTMLDivElement | null>(null);
  const lastItemRef = useRef<HTMLDivElement | null>(null);
  const messagesByUser = useMessagesChatStore((s) => s.messagesByUser[userIdStore]);
  const setMessagesForUser = useMessagesChatStore((s) => s.setMessagesForUser);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!userIdStore) return;
    const normalized = messagesList.map((m) => ({ ...m, status: 'sent' as const }));
    setMessagesForUser(userIdStore, normalized);
  }, [messagesList, userIdStore, setMessagesForUser]);

  const { results, messagesLength } = useMemo(() => {
    const messagesStore = messagesByUser ?? [];
    // убираем дублирования сообщений если это явление имеется есть
    const messages = Array.from(new Map(messagesStore.map((mg) => [mg.uid, mg])).values());
    return { results: handlerMessagesList(messages), messagesLength: messages.length };
  }, [messagesByUser]);
  // Соберём flat-список в порядке рендера
  const dateKeysInRenderOrder = Object.keys(results).reverse();
  const flatList: Array<{
    date: string;
    message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' };
  }> = [];
  dateKeysInRenderOrder.forEach((date) => {
    const msgs = results[date] ?? [];
    msgs
      .slice()
      .reverse()
      .forEach((m) => flatList.push({ date, message: m }));
  });
  //вычисляем targetIndex: первого непрочитанного входящего, иначе последний элемент
  const { targetIndex, setTargetIndex, lastIndex, currentFirstUnreadIncoming } = useFixedTargetIndex(
    results,
    currentUserId,
  );
  // хук ws + hook для определения прочтения видимости
  const { register } = useIntersectionRead(sendChangeStatusReadMessage);

  // Состояние для отслеживания положения скролла
  const [isAtBottom, setIsAtBottom] = useState(true);
  // Эффект для отслеживания позиции скролла
  useEffect(() => {
    const container = wrapperRef.current;
    if (!container) return;

    const handleScroll = (): void => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      // Проверяем, находится ли пользователь внизу (с допуском в 10px)
      const atBottom = scrollHeight - scrollTop - clientHeight < 5;
      setIsAtBottom(atBottom);
    };

    container.addEventListener('scroll', handleScroll);
    // Вызываем сразу, чтобы установить начальное состояние
    handleScroll();

    return (): void => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);
  // Эффект прокрутки к targetIndex (если есть)
  useEffect(() => {
    if (targetIndex === -1) return;
    if (
      currentFirstUnreadIncoming !== -1 &&
      targetIndex !== null &&
      currentFirstUnreadIncoming - 1 > targetIndex &&
      currentFirstUnreadIncoming - 1 < lastIndex
    )
      return;
    const el = targetItemRef.current;
    if (!el) return;
    el.scrollIntoView({ behavior: 'auto', block: 'start' });
    //размонтируем targetIndex
    if (targetIndex === lastIndex) setTargetIndex(null);
  }, [results, messagesLength, targetIndex, lastIndex, currentFirstUnreadIncoming, targetItemRef, setTargetIndex]);

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
        const newScrollTop = newScrollHeight - previousScrollHeight + previousScrollTop;
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
        if (currentFirstUnreadIncoming === -1) fetchOlder();
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
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, results, messagesLength]);

  // подгружаем когда пользователь приблизится к 1 элементу от вверха
  const triggerIndex = 1;

  //эффект для расчета позиции <ScrollButton /> <NotificationCopyCard /> внутри <MessagesList> в зависимости от размера экрана
  const [pos, setPos] = useState({ right: 0, bottom: 0 });
  const [posCopy, setPosCopy] = useState({ left: 0, top: 0 });

  useLayoutEffect(() => {
    const updatePos = (): void => {
      const rect = wrapperRef.current?.getBoundingClientRect();
      if (!rect) return;
      // расстояние от правого края контейнера до правого края окна
      const gapRight = Math.max(12, window.innerWidth - (rect.left + rect.width) + 5);
      const gapBottom = Math.max(12, window.innerHeight - (rect.top + rect.height) + 1);
      setPos({ right: gapRight, bottom: gapBottom });
      const gapLeftCopy = rect.left + (rect.width - 360) / 2;
      const gapTopCopy = rect.top + 20;
      setPosCopy({ left: gapLeftCopy, top: gapTopCopy });
    };

    updatePos();
    window.addEventListener('resize', updatePos);
    // опционально: ResizeObserver для контейнера
    const ro = new ResizeObserver(updatePos);
    if (wrapperRef.current) ro.observe(wrapperRef.current);

    return (): void => {
      window.removeEventListener('resize', updatePos);
      ro.disconnect();
    };
  }, []);

  // обработчик события onClick для компонента  <ScrollButton /> медленно скролит в низ до первого сообщения
  const onClickScrollButton = (): void => {
    if (targetIndex === lastIndex) {
      const el = targetItemRef.current;
      if (!el) return;
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      const el = lastItemRef.current;
      const container = wrapperRef.current;
      if (!el || !container || !targetIndex) return;
      smoothScrollElementIntoView(container, el, (lastIndex - targetIndex) * READING_TIME, 'start');
    }
  };

  // показывать <NotificationCopyCard/> в DOM либо нет
  const toastVisibleStore = useToastVisibleStore((s) => s.toastVisible);

  //хук для серверного поиска сообщений и осуществления клиенской навигации по данным сообщениям,
  // текст которых содержит значение из поисковой строки окна чата
  const { searchMessagesStore, availableSearchUids, setMessageRef, targetSearchUid } =
    useSearchAndNavigateSortedMessages({ flatList, wrapperRef });
  // текущий домен
  const baseUrl = window.location.origin;
  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      {/* Если список пуст, всё равно рендерим sentinel чтобы observer был стабилен */}
      {flatList.length === 0 && <div ref={sentinelRef} style={{ width: 1, height: 1 }} />}

      {dateKeysInRenderOrder.map<JSX.Element>((date: string) => (
        <div key={date}>
          <DateCard date={date} />
          {results[date]
            .slice()
            .reverse()
            .map<JSX.Element>(
              (message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' }, index) => {
                // вычисляем globalIndex
                const dateIndex = dateKeysInRenderOrder.indexOf(date);
                let globalIndex = 0;
                for (let i = 0; i < dateIndex; i++) {
                  const d = dateKeysInRenderOrder[i];
                  globalIndex += (results[d] ?? []).length;
                }
                globalIndex += index;

                const isTarget = globalIndex === targetIndex;
                const isSentinel = globalIndex === triggerIndex;
                const isLast = globalIndex === lastIndex;
                // Подсветка для найденного сообщения
                const isSearchMatch = searchMessagesStore && availableSearchUids.includes(message.uid);

                return (
                  <div
                    key={message.uid}
                    tabIndex={-1}
                    ref={(el) => {
                      // Применяем оба рефа
                      setMessageRef(message.uid)(el);
                      if (isTarget) targetItemRef.current = el;
                      if (isSentinel) sentinelRef.current = el;
                      if (isLast) lastItemRef.current = el;
                    }}
                  >
                    {!!targetIndex &&
                      globalIndex === targetIndex &&
                      lastIndex - targetIndex > 14 &&
                      (message.from_user.uid !== currentUserId || message.from_user.uid !== '') && (
                        <div className={styles.text}>непрочитанные сообщения</div>
                      )}
                    {message.from_user.uid === currentUserId || message.from_user.uid === '' ? (
                      message.files_list.length || message.forwarded_messages[0]?.files_list.length ? (
                        (message.files_list[0]?.media_kind === 'voice' &&
                          message.files_list[0]?.file_type?.includes('audio')) ||
                        (message.forwarded_messages[0]?.files_list[0].media_kind === 'voice' &&
                          message.forwarded_messages[0]?.files_list[0].file_type?.includes('audio')) ? (
                          <OutgoingAudioCard
                            message={message}
                            sendDeleteMessage={sendDeleteMessage}
                            search={searchMessagesStore}
                            isHighlighted={isSearchMatch && message.uid === targetSearchUid}
                            currentUserId={currentUserId}
                          />
                        ) : (message.files_list[0]?.file_type?.includes('image') ||
                            message.forwarded_messages[0]?.files_list[0].file_type?.includes('image')) &&
                          (message.content !== message.files_list[0]?.download_name ||
                            message.forwarded_messages[0]?.content !==
                              message.forwarded_messages[0]?.files_list[0].download_name) ? (
                          <OutgoingImagesCard
                            message={message}
                            sendDeleteMessage={sendDeleteMessage}
                            search={searchMessagesStore}
                            isHighlighted={isSearchMatch && message.uid === targetSearchUid}
                            currentUserId={currentUserId}
                          />
                        ) : (
                          <OutgoingFileCard
                            message={message}
                            sendDeleteMessage={sendDeleteMessage}
                            search={searchMessagesStore}
                            isHighlighted={isSearchMatch && message.uid === targetSearchUid}
                            currentUserId={currentUserId}
                          />
                        )
                      ) : message.message_rtc && message.content === ' ' ? (
                        <OutgoingPhoneCallCard
                          message={message}
                          sendDeleteMessage={sendDeleteMessage}
                          search={searchMessagesStore}
                          isHighlighted={isSearchMatch && message.uid === targetSearchUid}
                          currentUserId={currentUserId}
                          status={
                            message.message_rtc?.status === 'unreceived' ? 'Отменённый звонок' : 'Исходящий звонок'
                          }
                        />
                      ) : message.content && message.content.split(' ')[0] === '@@@' ? (
                        <OutgoingInformationForGroupCard message={message} />
                      ) : message.content && message.content.includes(baseUrl) && message.content.startsWith('http') ? (
                        <OutgoingProfileLinkCard
                          message={message}
                          sendDeleteMessage={sendDeleteMessage}
                          search={searchMessagesStore}
                          isHighlighted={isSearchMatch && message.uid === targetSearchUid}
                          currentUserId={currentUserId}
                        />
                      ) : (
                        <OutgoingMessagesCard
                          message={message}
                          sendDeleteMessage={sendDeleteMessage}
                          search={searchMessagesStore}
                          isHighlighted={isSearchMatch && message.uid === targetSearchUid}
                          currentUserId={currentUserId}
                        />
                      )
                    ) : message.files_list.length || message.forwarded_messages[0]?.files_list.length ? (
                      (message.files_list[0]?.media_kind === 'voice' &&
                        message.files_list[0]?.file_type?.includes('audio')) ||
                      (message.forwarded_messages[0]?.files_list[0].media_kind === 'voice' &&
                        message.forwarded_messages[0]?.files_list[0].file_type?.includes('audio')) ? (
                        <IncomingAudioCard
                          message={message}
                          register={register}
                          sendDeleteMessage={sendDeleteMessage}
                          search={searchMessagesStore}
                          isHighlighted={isSearchMatch && message.uid === targetSearchUid}
                          currentUserId={currentUserId}
                        />
                      ) : (message.files_list[0]?.file_type?.includes('image') ||
                          message.forwarded_messages[0]?.files_list[0].file_type?.includes('image')) &&
                        (message.content !== message.files_list[0]?.download_name ||
                          message.forwarded_messages[0]?.content !==
                            message.forwarded_messages[0]?.files_list[0].download_name) ? (
                        <IncomingImagesCard
                          message={message}
                          register={register}
                          sendDeleteMessage={sendDeleteMessage}
                          search={searchMessagesStore}
                          isHighlighted={isSearchMatch && message.uid === targetSearchUid}
                          currentUserId={currentUserId}
                        />
                      ) : (
                        <IncomingFileCard
                          message={message}
                          register={register}
                          sendDeleteMessage={sendDeleteMessage}
                          search={searchMessagesStore}
                          isHighlighted={isSearchMatch && message.uid === targetSearchUid}
                          currentUserId={currentUserId}
                        />
                      )
                    ) : message.message_rtc && message.content === ' ' ? (
                      <IncomingPhoneCallCard
                        message={message}
                        register={register}
                        sendDeleteMessage={sendDeleteMessage}
                        search={searchMessagesStore}
                        isHighlighted={isSearchMatch && message.uid === targetSearchUid}
                        currentUserId={currentUserId}
                        status={message.message_rtc?.status === 'unreceived' ? 'Пропущенный звонок' : 'Входящий звонок'}
                      />
                    ) : message.content && message.content.split(' ')[0] === '@@@' ? (
                      <IncomingInformationForGroupCard message={message} register={register} />
                    ) : message.content && message.content.includes(baseUrl) && message.content.startsWith('http') ? (
                      <IncomingProfileLinkCard
                        message={message}
                        register={register}
                        sendDeleteMessage={sendDeleteMessage}
                        search={searchMessagesStore}
                        isHighlighted={isSearchMatch && message.uid === targetSearchUid}
                        currentUserId={currentUserId}
                      />
                    ) : (
                      <IncomingMessagesCard
                        message={message}
                        register={register}
                        sendDeleteMessage={sendDeleteMessage}
                        search={searchMessagesStore}
                        isHighlighted={isSearchMatch && message.uid === targetSearchUid}
                        currentUserId={currentUserId}
                      />
                    )}
                  </div>
                );
              },
            )}
        </div>
      ))}
      {wrapperRef.current && wrapperRef.current.scrollHeight > wrapperRef.current.clientHeight && !isAtBottom && (
        <button
          style={{
            position: 'fixed',
            right: `${pos.right}px`,
            bottom: `${pos.bottom}px`,
          }}
          onClick={onClickScrollButton}
          aria-label="Скролл вниз"
        >
          <ScrollButton quantity={currentFirstUnreadIncoming !== -1 ? lastIndex - currentFirstUnreadIncoming + 1 : 0} />
        </button>
      )}
      {toastVisibleStore && <NotificationCopyCard posCopy={{ top: posCopy.top, left: posCopy.left }} />}
    </div>
  );
};
