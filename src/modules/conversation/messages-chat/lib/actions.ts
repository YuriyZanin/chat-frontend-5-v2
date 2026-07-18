'use server';
import { revalidatePath } from 'next/cache';
import { serializerRequestCreatingMessageApiSchema } from '../model/messages-list';

export async function createTextMessage(
  formData: FormData,
  {
    params,
  }: {
    params: Promise<{ user_uid: string }>;
  },
): Promise<void> {
  const user_uid = (await params).user_uid;
  const message = {
    action: 'create_text_message',
    object: {
      to_user_uid: user_uid,
      chat_key: '',
      content: formData.get('message'),
      status: 'publish',
      files: [
        {
          filename: 'document.pdf',
          data: 'UERGLTEuNCBmaWxlIGNvbnRlbnQ=',
        },
      ],
      replied_messages: [],
      forwarded_messages: [],
    },
  };

  const validatedFields = serializerRequestCreatingMessageApiSchema.safeParse(message);

  if (validatedFields.success) {
    const socket = new WebSocket('/api/web-socket/proxy');
    socket.send(JSON.stringify(message));
    socket.close();
  }
  revalidatePath(`/api/proxy/api/v1/chat/message/text/${user_uid}/`);
}
