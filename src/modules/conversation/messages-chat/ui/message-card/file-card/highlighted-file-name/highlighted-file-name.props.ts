export type HighlightedTextProps = {
  text: string;
  search: string;
  caseSensitive?: boolean;
};

export type HighlightedFileNameProps = {
  fileName: string;
  search: string;
  maxWidth?: number;
  caseSensitive?: boolean;
};
