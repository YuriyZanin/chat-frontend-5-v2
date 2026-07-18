'use client';
import { JSX, useLayoutEffect, useRef, useState } from 'react';
import { addRecentEmodji } from '../../utils/recent-emodji-array';
import { useRecentEmojiStore } from '../../zustand-store/zustand-store';
import { AutosizeTextarea } from '../autosize-textarea/autosize-textarea';
import { EmodjiBlock } from '../emodji-block/emodji-block';
import SmailIcon from './icon/smail.svg';
import VioletSmailIcon from './icon/violet-smail.svg';
import styles from './message-input.module.scss';
import type { ButtonSmailProps, MessageInputProps } from './message-input.props';

export const MessageInput = ({ textInput, setTextInput, inputRef }: MessageInputProps): JSX.Element => {
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [pickerPos, setPickerPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const recentEmojisStore = useRecentEmojiStore((s) => s.recentEmojis);
  const setRecentEmojisStore = useRecentEmojiStore((s) => s.setRecentEmojis);

  const handleEmojiSelect = (emoji: string): void => {
    setShowEmojiPicker(false);
    setRecentEmojisStore(addRecentEmodji(emoji));
    setTextInput(textInput + emoji);
    inputRef.current?.focus();
  };
  const openEmojiPicker = (): void => {
    if (buttonRef.current) {
      const { y, x } = buttonRef.current.getBoundingClientRect();
      const heightPicker = 535;
      const widthPicker = 472;
      const adjustedX = x + widthPicker + 295 - window.innerWidth > 0 ? x - widthPicker + 45 : x;
      const adjustedY = y - heightPicker - 15;
      setPickerPos({ x: adjustedX, y: adjustedY });
    }
    setShowEmojiPicker(true);
  };

  const closeEmojiPicker = (): void => {
    setShowEmojiPicker(false);
  };

  //эффект для расчета позиции <ButtonSmail> внутри <AutosizeTextarea> в зависимости от размера экрана
  const [pos, setPos] = useState({ right: 0, bottom: 0 });
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const updatePos = (): void => {
      const rect = wrapperRef.current?.getBoundingClientRect();
      if (!rect) return;
      // расстояние от правого края контейнера до правого края окна
      const gapRight = Math.max(12, window.innerWidth - (rect.left + rect.width) + 15);
      const gapBottom = Math.max(12, Math.max(12, window.innerHeight - (rect.top + rect.height) + 8));
      setPos({ right: gapRight, bottom: gapBottom });
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

  return (
    <div className={styles.inputWrapper} ref={wrapperRef}>
      <div className={styles.form}>
        <AutosizeTextarea
          id="text"
          name="text"
          placeholder="Cообщение"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          maxHeight={472}
          inputRef={inputRef}
          isScroll={true}
        />
      </div>
      <ButtonSmail
        buttonRef={buttonRef}
        showEmojiPicker={showEmojiPicker}
        openEmojiPicker={openEmojiPicker}
        pos={pos}
        aria-label="Кнопка смаилов"
      />
      <div onMouseLeave={closeEmojiPicker}>
        {showEmojiPicker && (
          <EmodjiBlock
            handleEmojiSelect={handleEmojiSelect}
            recentEmojisStore={recentEmojisStore}
            position={pickerPos}
          />
        )}
      </div>
    </div>
  );
};

const ButtonSmail = ({ buttonRef, showEmojiPicker, openEmojiPicker, pos }: ButtonSmailProps): JSX.Element => {
  return (
    <div
      className={styles.icon}
      ref={buttonRef}
      style={{
        position: 'fixed',
        right: `${pos.right}px`,
        bottom: `${pos.bottom}px`,
      }}
    >
      {showEmojiPicker ? <VioletSmailIcon /> : <SmailIcon onMouseEnter={openEmojiPicker} />}
    </div>
  );
};
