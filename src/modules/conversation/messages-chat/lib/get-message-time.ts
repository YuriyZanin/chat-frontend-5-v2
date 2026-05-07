export const getMessageTime = (created_at: number): string => {
  const messageDate = new Date(created_at * 1000);
  const hours = messageDate.getHours();
  const minutes = messageDate.getMinutes();
  return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
};

export const getMessageTimeOrDate = (created_at: number): string => {
  const messageDate = new Date(created_at * 1000);
  const now = new Date();

  const isToday =
    messageDate.getFullYear() === now.getFullYear() &&
    messageDate.getMonth() === now.getMonth() &&
    messageDate.getDate() === now.getDate();

  if (isToday) {
    return getMessageTime(created_at);
  }

  const day = messageDate.getDate().toString().padStart(2, '0');
  const month = (messageDate.getMonth() + 1).toString().padStart(2, '0');
  const year = messageDate.getFullYear();

  return `${day}.${month}.${year}`;
};
