import { Chat } from '../../chat.entity';

export type ChatCardModalProps = {
  chat: Chat;
  onSelectHandler: () => void;
};
