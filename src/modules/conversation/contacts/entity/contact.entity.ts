export type Contact = {
  uid: string;
  firstName: string;
  lastName: string;
  nickname: string;
  chatId?: number;
  fullName: string;
  avatarUrl: string;
  isOnline: boolean;
  wasOnlineAt: number | null;
};
