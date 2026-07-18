import { pluralize } from 'shared/libs/index';

// UX-логика по дизайну:
// в сети = онлайн
// был(а) только что = менее 1 минуты назад
// был(а) 22 минуты назад = от 1 минуты до 59 минут
// был(а) 22 часа назад = от 1 часа до 23 часов
// был(а) вчера в 21:15 = от 24 часов до 47 ч. 59 мин
// был(а) 02.04.24 = от 48 часов до бесконечности, отображается всегда

export const getLastSeenLabel = (wasOnlineAt: number | null): string => {
  if (wasOnlineAt === 0) return 'в сети';
  if (wasOnlineAt === null) return 'соединение...';

  const now = Math.floor(Date.now() / 1000);
  const diff = now - wasOnlineAt;

  // < 1 мин
  if (diff < 60) {
    return 'был(а) только что';
  }

  // 1–59 мин
  if (diff < 3600) {
    const minutes = Math.floor(diff / 60);
    return `был(а) ${minutes} ${pluralize(minutes, 'minutes')} назад`;
  }

  // 1–23 часа
  if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `был(а) ${hours} ${pluralize(hours, 'hours')} назад`;
  }

  // 24–47:59 часов → "вчера"
  if (diff < 172800) {
    const date = new Date(wasOnlineAt * 1000);
    const time = date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return `был(а) вчера в ${time}`;
  }

  // ≥ 48 часов
  const date = new Date(wasOnlineAt * 1000);
  return `был(а) ${date.toLocaleDateString('ru-RU')}`;
};
