export type SearchInputProps = {
  query: string;
  onChange: (value: string) => void;
  onClear?: () => void;
};
