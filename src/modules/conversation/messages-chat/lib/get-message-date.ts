export const getMessageDate = (created_at: number): string => {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - created_at;
  if (diff < 86400) {
    return 'сегодня';
  }
  const monthsInRussian = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ];
  const messageDate = new Date(created_at * 1000);
  const currentDate = new Date();
  if (messageDate.getFullYear() === currentDate.getFullYear()) {
    return `${messageDate.getDate()} ${monthsInRussian[messageDate.getMonth()]}`;
  } else {
    return `${messageDate.getDate()} ${monthsInRussian[messageDate.getMonth()]} ${messageDate.getFullYear()}`;
  }
};
