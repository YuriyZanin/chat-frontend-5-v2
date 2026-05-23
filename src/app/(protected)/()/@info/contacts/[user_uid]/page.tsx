import { parseJwtToken } from 'modules/conversation/messages-chat/utils/parse-jwt-token';
import { InfoScreen } from 'modules/info/screens';
import { cookies } from 'next/headers';
import { JSX, Suspense } from 'react';

const BACKEND_WS = process.env.BACKEND_API_WS_URL!;

export default async function InfoContactBlockPage({
  params,
}: {
  params: Promise<{ user_uid: string }>;
}): Promise<JSX.Element> {
  const user_uid = (await params).user_uid;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access')?.value;
  const wsUrl = `${BACKEND_WS}/ws/chat`;
  const payload = parseJwtToken(accessToken ?? '');

  return (
    <Suspense>
      <InfoScreen uid={user_uid} wsUrl={wsUrl} currentUid={payload.user_id} />
    </Suspense>
  );
}
