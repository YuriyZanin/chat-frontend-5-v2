import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { BlacklistedUser, BlacklistResponse, getBlacklist, GetBlacklistParams } from '../api/blacklist.api';

/**
 * Хук для получения черного списка (заблокированных пользователей).
 * @param params - Параметры запроса (ordering, page, page_size)
 * @returns UseQueryResult<BlacklistedUser[], unknown> - Возвращает массив пользователей
 */
export const useGetBlacklist = (params?: GetBlacklistParams): UseQueryResult<BlacklistedUser[], unknown> => {
  return useQuery({
    queryKey: ['blacklist', params],
    queryFn: () => {
      console.log('Выполняется запрос getBlacklist');
      return getBlacklist(params);
    },
    select: (response: BlacklistResponse) => {
      console.log('Вызов select в useGetBlacklist, response:', response);

      const result = response.results.map((item) => item.blocked_user);
      console.log('Результат select (blacklistUsers):', result);
      return result;
    },
  });
};
