export type AutosizeTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  maxHeight?: number;
  onInput?: React.FormEventHandler<HTMLTextAreaElement>;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  isScroll: boolean;
};
