import { parseJwtToken } from 'modules/conversation/messages-chat/utils/parse-jwt-token';
import { InviteMembersBlock } from 'modules/new-group/ui/invite-members-block';
import { cookies } from 'next/headers';
import { JSX } from 'react';

const BACKEND_WS = process.env.BACKEND_API_WS_URL!;

export default async function InviteMembersPage(): Promise<JSX.Element> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access')?.value;
  const wsUrl = `${BACKEND_WS}/ws/chat`;
  const payload = parseJwtToken(accessToken ?? '');
  return <InviteMembersBlock wsUrl={wsUrl} currentUserId={payload.user_id} />;
}
