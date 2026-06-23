import { HeaderBottom } from 'modules/conversation/messages-chat/ui/header-bottom';
import { HeaderTop } from 'modules/conversation/messages-chat/ui/header-top';
import styles from 'modules/conversation/messages-chat/ui/messages-list-layout/messages-list-layout.module.scss';
import { parseJwtToken } from 'modules/conversation/messages-chat/utils/parse-jwt-token';
import { cookies } from 'next/headers';
import { Suspense } from 'react';

export default async function MessagesLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ user_uid: string }>;
}): Promise<React.ReactNode> {
  try {
    const user_uid = (await params).user_uid;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access')?.value;
    const payload = parseJwtToken(accessToken ?? '');

    return (
      <main className={styles.wrapper}>
        <Suspense>
          <HeaderTop user_uid={user_uid} currentUid={payload.user_id} chatOrContact="chat" />
        </Suspense>
        {children}
        <Suspense>
          <HeaderBottom currentUserId={payload.user_id} />
        </Suspense>
      </main>
    );
  } catch (error) {
    console.error(error);
  }
}
