import { parseJwtToken } from 'modules/conversation/messages-chat/utils/parse-jwt-token';
import { InfoScreen } from 'modules/info/screens';
import { cookies } from 'next/headers';
import { JSX, Suspense } from 'react';

export default async function InfoBlockPage({
  params,
}: {
  params: Promise<{ user_uid: string }>;
}): Promise<JSX.Element> {
  const user_uid = (await params).user_uid;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access')?.value;
  const payload = parseJwtToken(accessToken ?? '');

  return (
    <Suspense>
      <InfoScreen uid={user_uid} currentUid={payload.user_id} />
    </Suspense>
  );
}
