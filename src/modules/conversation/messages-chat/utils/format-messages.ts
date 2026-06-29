export const formatMessages = (quantity: number): string => {
  quantity = Math.abs(Math.floor(quantity)); // работаем с целым неотрицательным числом
  const mod10 = quantity % 10;
  const mod100 = quantity % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return `${quantity} сообщение`;
  }
  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) {
    return `${quantity} сообщения`;
  }
  return `${quantity} сообщений`;
};

export const formatMessagesFile = (quantity: number): string => {
  quantity = Math.abs(Math.floor(quantity)); // работаем с целым неотрицательным числом
  if (quantity === 1) {
    return `${quantity} файл`;
  }
  if (quantity >= 2 && quantity <= 4) {
    return `${quantity} файла`;
  }
  return `${quantity} файлов`;
};

export const formatParticipantsChannel = (quantity: number): string => {
  quantity = Math.abs(Math.floor(quantity)); // работаем с целым неотрицательным числом
  const mod10 = quantity % 10;
  const mod100 = quantity % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return `${quantity} подписчик`;
  }
  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) {
    return `${quantity} подписчика`;
  }
  return `${quantity} подписчиков`;
};
export const formatParticipantsGroup = (quantity: number): string => {
  quantity = Math.abs(Math.floor(quantity)); // работаем с целым неотрицательным числом
  const mod10 = quantity % 10;
  const mod100 = quantity % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return `${quantity} участник`;
  }
  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) {
    return `${quantity} участника`;
  }
  return `${quantity} участников`;
};
