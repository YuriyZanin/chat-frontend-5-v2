import { useMemo, useState } from 'react';
import { RestMessageApi } from '../../model/messages-list';

type UseFixedTargetIndex = {
  targetIndex: number | null;
  setTargetIndex: (i: number | null) => void;
  lastIndex: number;
  currentFirstUnreadIncoming: number;
};

export const useFixedTargetIndex = (
  results: Record<string, RestMessageApi[]>,
  currentUserId: string,
): UseFixedTargetIndex => {
  // null — ещё не зафиксировано; иначе — индекс, который мы должны использовать
  const [targetIndex, setTargetIndex] = useState<number | null>(null);

  // вспомогательная функция: преобразовать results -> ordered (как в вашем коде)
  const ordered = useMemo(() => {
    const keys = Object.keys(results).reverse();
    const ordered: Array<RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' }> = [];
    keys.forEach((date) => {
      const msgs = results[date] ?? [];
      msgs
        .slice()
        .reverse()
        .forEach((m) => ordered.push(m));
    });
    return ordered;
  }, [results]);

  // текущий индекс первого непрочитанного входящего (в текущих данных)
  const currentFirstUnreadIncoming = useMemo((): number => {
    if (!ordered.length) return -1;
    return ordered.findIndex((m) => m.from_user?.uid !== currentUserId && m.from_user?.uid !== '' && m.new === true);
  }, [ordered, currentUserId]);

  // Обновление initialTargetIndex:
  // - если ещё не установлен, фиксируем начальный (first unread if any, else last)
  // - если установлен и в текущих данных нет непрочитанных входящих (currentFirstUnreadIncoming === -1),
  //   обновляем initialTargetIndex на текущий последний индекс

  const lastIndex = ordered.length ? ordered.length - 1 : -1;

  if (targetIndex === null) {
    // первый раз: фиксируем минимальный (первый непрочитанный входящий), иначе последний
    const startIndex = currentFirstUnreadIncoming !== -1 ? currentFirstUnreadIncoming : lastIndex;
    setTargetIndex(startIndex);
  }

  // initialTargetIndex уже зафиксирован ранее
  // если в текущих данных непрочитанных входящих нет — обновляем initialTargetIndex на последний
  if (targetIndex !== null && currentFirstUnreadIncoming === -1) {
    // обновляем только если последний индекс изменился (чтобы избежать лишних setState)
    if (targetIndex !== lastIndex) {
      setTargetIndex(lastIndex);
    }
  }
  // иначе (есть ещё непрочитанные) — НЕ меняем initialTargetIndex

  // Возвращаем зафиксированный индекс (если null — временно можно возвращать -1)
  return { targetIndex: targetIndex ?? -1, setTargetIndex, lastIndex, currentFirstUnreadIncoming };
};
