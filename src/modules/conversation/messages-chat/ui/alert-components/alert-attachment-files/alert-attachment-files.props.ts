import { RefObject } from 'react';
export type AlertAttachmentFilesProps = {
  onOk: () => void;
  onCancel: () => void;
};

export type AlertMessageInputProps = {
  textInput: string;
  setTextInput: (text: string) => void;
};
export type AlertButtonSmailProps = {
  buttonRef: RefObject<HTMLDivElement | null>;
  showEmojiPicker: boolean;
  openEmojiPicker: () => void;
};

export type AlertAutosizeTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  maxHeight?: number;
  onInput?: React.FormEventHandler<HTMLTextAreaElement>;
};
