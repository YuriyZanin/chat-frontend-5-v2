import { MessagesListScreen } from 'modules/conversation/messages-chat/screens';
import { parseJwtToken } from 'modules/conversation/messages-chat/utils/parse-jwt-token';
import { cookies } from 'next/headers';
import { JSX, Suspense } from 'react';

const BACKEND_WS = process.env.BACKEND_API_WS_URL!;
const BACKEND_API = process.env.BACKEND_API_URL;

export default async function MessagesPage({
  params,
}: {
  params: Promise<{ user_uid: string }>;
}): Promise<JSX.Element | undefined> {
  try {
    const user_uid = (await params).user_uid;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access')?.value;
    const payload = parseJwtToken(accessToken ?? '');
    const wsUrl = `${BACKEND_WS}/ws/chat`;
    const refreshUrl = `${BACKEND_API}/api/v1/auth/login/refresh/token/`;
    return (
      <>
        <Suspense>
          <MessagesListScreen
            user_uid={user_uid}
            wsUrl={wsUrl}
            currentUserId={payload.user_id}
            refreshUrl={refreshUrl}
          />
        </Suspense>
      </>
    );
  } catch (error) {
    console.error(error);
  }
}
