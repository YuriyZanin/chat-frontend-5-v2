import { parseJwtToken } from 'modules/conversation/messages-chat/utils/parse-jwt-token';
import { InviteMembersBlock } from 'modules/new-group/ui/invite-members-block';
import { cookies } from 'next/headers';
import { JSX } from 'react';

const BACKEND_WS = process.env.BACKEND_API_WS_URL!;
const BACKEND_API = process.env.BACKEND_API_URL;

export default async function InviteMembersPage(): Promise<JSX.Element> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access')?.value;
  const payload = parseJwtToken(accessToken ?? '');
  const wsUrl = `${BACKEND_WS}/ws/chat`;
  const refreshUrl = `${BACKEND_API}/api/v1/auth/login/refresh/token/`;

  return <InviteMembersBlock wsUrl={wsUrl} currentUserId={payload.user_id} refreshUrl={refreshUrl} />;
}
