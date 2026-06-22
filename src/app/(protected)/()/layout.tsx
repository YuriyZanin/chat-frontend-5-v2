import { ProtectedLayout } from 'layouts/protected-layout';
import { Navigation } from 'layouts/protected-layout/navigation';
// import { ProfileBlock } from 'modules/profile';
import { parseJwtToken } from 'modules/conversation/messages-chat/utils/parse-jwt-token';
import { cookies } from 'next/headers';
import { JSX, ReactNode } from 'react';
import { QueryDevtools } from 'shared/query/query-devtools';
import { QueryProvider } from 'shared/query/query-provider';

const BACKEND_WS = process.env.BACKEND_API_WS_URL!;
const BACKEND_API = process.env.BACKEND_API_URL;

export default async function Layout({
  children,
  list,
  info,
}: {
  children: ReactNode;
  list: ReactNode;
  info: ReactNode;
}): Promise<JSX.Element> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access')?.value;
  const payload = parseJwtToken(accessToken ?? '');
  const wsUrl = `${BACKEND_WS}/ws/chat`;
  const refreshUrl = `${BACKEND_API}/api/v1/auth/login/refresh/token/`;
  return (
    <QueryProvider>
      <ProtectedLayout
        nav={<Navigation />}
        list={list}
        main={children}
        info={info}
        wsUrl={wsUrl}
        currentUserId={payload.user_id}
        refreshUrl={refreshUrl}
      />
      <QueryDevtools />
    </QueryProvider>
  );
}
