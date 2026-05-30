import { MessagesListScreen } from 'modules/conversation/messages-chat/screens';
import { JSX } from 'react';

export default async function ContactsPage({
  params,
}: {
  params: Promise<{ user_uid: string }>;
}): Promise<JSX.Element> {
  const user_uid = (await params).user_uid;
  return (
    <>
      <MessagesListScreen user_uid={user_uid} currentUserId={' '} wsUrl={' '} />
    </>
  );
}
