import {
  useGoToNextSearchMessageStore,
  useGoToPrevSearchMessageStore,
  useSearchIndicatorStore,
  useSearchMessagesStore,
} from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import { JSX, useEffect, useRef } from 'react';
import Close from './icons/close.svg';
import DownArrowActive from './icons/down-arrow-active.svg';
import DownArrow from './icons/down-arrow.svg';
import Search from './icons/search.svg';
import UpArrowActive from './icons/up-arrow-active.svg';
import UpArrow from './icons/up-arrow.svg';
import styles from './search-messages.module.scss';
import type { SearchMessagesProps } from './search-messages.props';

export const SearchMessages = ({ setSearchMessagesVisible }: SearchMessagesProps): JSX.Element => {
  const searchMessagesStore = useSearchMessagesStore((s) => s.searchMessages);
  const setSearchMessagesStore = useSearchMessagesStore((s) => s.setSearchMessages);
  const clearSearchMessagesStore = useSearchMessagesStore((s) => s.clearSearchMessages);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const clearGoToNextSearchMessageStore = useGoToNextSearchMessageStore((s) => s.clearGoToNextSearchMessage);
  const clearGoToPrevSearchMessageStore = useGoToPrevSearchMessageStore((s) => s.clearGoToPrevSearchMessage);
  const clearSearchIndicatorStore = useSearchIndicatorStore((s) => s.clearSearchIndicator);
  const goToNextSearchMessageStore = useGoToNextSearchMessageStore((s) => s.goToNextSearchMessage);
  const goToPrevSearchMessageStore = useGoToPrevSearchMessageStore((s) => s.goToPrevSearchMessage);
  const searchIndicatorStore = useSearchIndicatorStore((s) => s.searchIndicator);

  //устанавливае изначально фокус на <input> поиска
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  const handlerOnClickClose = (): void => {
    clearSearchMessagesStore();
    clearGoToNextSearchMessageStore();
    clearGoToPrevSearchMessageStore();
    clearSearchIndicatorStore();
    setSearchMessagesVisible(false);
  };
  const handleBlur = (e: React.FocusEvent): void => {
    const related = e.relatedTarget as Node | null;
    // Если focus ушёл внутри контейнера — не закрываем
    if (containerRef.current && related && containerRef.current.contains(related)) return;
    // Действия при потере фокуса
    handlerOnClickClose();
  };

  return (
    <div ref={containerRef} onBlur={handleBlur} tabIndex={-1} className={styles.wrapperSearch}>
      <div className={styles.iconSearch}>
        <div className={styles.iconSearch}>
          <Search />
        </div>
      </div>
      <input
        ref={inputRef}
        className={styles.inputSearch}
        value={searchMessagesStore}
        onChange={(e) => setSearchMessagesStore(e.target.value.trim())}
        maxLength={100}
        placeholder="Поиск в чате"
        aria-label="Поиск в чате"
      />
      {searchMessagesStore && searchIndicatorStore && (
        <div className={styles.navigateButton}>
          <div className={styles.iconSearch}>
            <button
              className={styles.iconSearch}
              onClick={goToNextSearchMessageStore ? goToNextSearchMessageStore : (): void => {}}
              disabled={searchIndicatorStore?.currentSearchIndex === searchIndicatorStore?.lastSearchIndex}
            >
              {searchIndicatorStore?.currentSearchIndex === searchIndicatorStore?.lastSearchIndex ? (
                <UpArrow />
              ) : (
                <UpArrowActive />
              )}
            </button>
          </div>
          <div className={styles.iconSearch}>
            <button
              className={styles.iconSearch}
              onClick={goToPrevSearchMessageStore ? goToPrevSearchMessageStore : (): void => {}}
              disabled={searchIndicatorStore?.currentSearchIndex === 1}
            >
              {searchIndicatorStore?.currentSearchIndex === 1 ? <DownArrow /> : <DownArrowActive />}
            </button>
          </div>
        </div>
      )}
      <div className={styles.iconSearch} onClick={handlerOnClickClose}>
        <div className={styles.iconSearch}>
          <Close className={styles.iconSearch} />
        </div>
      </div>
    </div>
  );
};
