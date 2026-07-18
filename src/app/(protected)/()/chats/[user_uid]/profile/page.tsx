import { cookies } from 'next/headers';
import { JSX, Suspense } from 'react';

import { parseJwtToken } from 'modules/conversation/messages-chat/utils/parse-jwt-token';

import { InfoScreen } from 'modules/info/screens';

const BACKEND_WS = process.env.BACKEND_API_WS_URL!;
const BACKEND_API = process.env.BACKEND_API_URL;

export default async function MobileProfilePage({
  params,
}: {
  params: Promise<{ user_uid: string }>;
}): Promise<JSX.Element> {
  const { user_uid } = await params;

  const cookieStore = await cookies();

  const accessToken = cookieStore.get('access')?.value;

  const payload = parseJwtToken(accessToken ?? '');

  const wsUrl = `${BACKEND_WS}/ws/chat`;

  const refreshUrl = `${BACKEND_API}/api/v1/auth/login/refresh/token/`;

  return (
    <Suspense>
      <InfoScreen uid={user_uid} currentUid={payload.user_id} />
    </Suspense>
  );
}
