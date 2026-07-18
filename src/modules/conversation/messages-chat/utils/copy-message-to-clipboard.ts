export const copyMessageToClipboard = async (
  messageText: string,
  setToastVisible: (t: boolean) => void,
): Promise<void> => {
  try {
    const showToast = (): void => {
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2000);
    };
    await navigator.clipboard.writeText(messageText);
    showToast();
  } catch (err) {
    console.error('Ошибка при копировании сообщения, ', err);
  }
};
