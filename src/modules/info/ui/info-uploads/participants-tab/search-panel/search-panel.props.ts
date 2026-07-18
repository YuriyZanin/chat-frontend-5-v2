export type SearchPanelProps = {
  query: string;
  onChange: (value: string) => void;
  onClear?: () => void;
};
