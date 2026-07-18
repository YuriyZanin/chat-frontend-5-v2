export type EmodjiBlockProps = {
  handleEmojiSelect: (emoji: string) => void;
  recentEmojisStore: string[];
  position: { x: number; y: number };
};
