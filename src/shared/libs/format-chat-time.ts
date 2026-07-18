const WEEK_DAYS = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];

export const formatChatTime = (timestamp: number | undefined): string => {
  if (!timestamp) return '';

  // поддержка секунд и миллисекунд
  const date = new Date(timestamp < 1e12 ? timestamp * 1000 : timestamp);
  const now = new Date();

  // начало сегодняшнего дня (00:00)
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // начало "недельного окна": вчера 23:59
  const startOfWeekWindow = new Date(startOfToday.getTime() - 60 * 1000);

  // Сегодня → HH:mm
  if (date >= startOfToday) {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // В пределах недели → день недели
  if (date >= startOfWeekWindow) {
    return WEEK_DAYS[date.getDay()];
  }

  // Старше недели → DD.MM.YY
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
};
