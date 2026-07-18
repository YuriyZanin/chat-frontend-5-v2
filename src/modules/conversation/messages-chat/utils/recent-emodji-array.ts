const maxSize = 11;
let array: string[] = [];

export const addRecentEmodji = (newElement: string): string[] => {
  array.unshift(newElement);
  const uniqueArray = [...new Set(array)];
  if (uniqueArray.length > maxSize) {
    uniqueArray.splice(uniqueArray.length - 1, uniqueArray.length - maxSize);
  }
  array = [...uniqueArray];
  return uniqueArray;
};
