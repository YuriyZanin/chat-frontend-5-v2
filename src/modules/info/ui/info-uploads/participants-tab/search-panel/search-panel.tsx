import clsx from 'clsx';
import { JSX } from 'react';
import { ClearIcon, SearchIcon } from './icons';
import styles from './search-panel.module.scss';
import { SearchPanelProps } from './search-panel.props';

export const SearchPanel = ({ query, onChange, onClear }: SearchPanelProps): JSX.Element => {
  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <span className={clsx(styles.iconWrapper, styles.searchIcon)} aria-hidden>
          <SearchIcon />
        </span>

        <input
          type="search"
          className={styles.input}
          value={query}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              onClear?.();
            }
          }}
          placeholder="Поиск"
          aria-label="Поиск"
        />

        {query.length > 0 && onClear && (
          <button
            type="button"
            className={clsx(styles.iconWrapper, styles.clearIcon)}
            onClick={onClear}
            aria-label="Очистить поиск"
          >
            <ClearIcon className={styles.icon} />
          </button>
        )}
      </div>
    </div>
  );
};
