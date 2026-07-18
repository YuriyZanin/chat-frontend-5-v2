import { addRecentEmodji } from 'modules/conversation/messages-chat/utils/recent-emodji-array';
import { useRecentEmojiStore } from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import { JSX, useEffect, useRef, useState } from 'react';
import { AutosizeTextarea } from '../../autosize-textarea/autosize-textarea';
import { EmodjiBlock } from '../../emodji-block/emodji-block';
import SmailIcon from '../../message-input/icon/smail.svg';
import VioletSmailIcon from '../../message-input/icon/violet-smail.svg';
import styles from './alert-message-input.module.scss';
import type { AlertButtonSmailProps, AlertMessageInputProps } from './alert-message-input.props';

export const AlertMessageInput = ({ textInput, setTextInput }: AlertMessageInputProps): JSX.Element => {
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [pickerPos, setPickerPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const recentEmojisStore = useRecentEmojiStore((s) => s.recentEmojis);
  const setRecentEmojisStore = useRecentEmojiStore((s) => s.setRecentEmojis);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
  return (
    <div className={styles.headerBottomInputBlock}>
      <AutosizeTextarea
        id="text"
        name="text"
        placeholder="Добавить подпись"
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        maxHeight={172}
        inputRef={inputRef}
        isScroll={false}
      />
      <ButtonSmail
        buttonRef={buttonRef}
        showEmojiPicker={showEmojiPicker}
        openEmojiPicker={openEmojiPicker}
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

const ButtonSmail = ({ buttonRef, showEmojiPicker, openEmojiPicker }: AlertButtonSmailProps): JSX.Element => {
  return (
    <div className={styles.icon} ref={buttonRef}>
      {showEmojiPicker ? <VioletSmailIcon /> : <SmailIcon onMouseEnter={openEmojiPicker} />}
    </div>
  );
};
