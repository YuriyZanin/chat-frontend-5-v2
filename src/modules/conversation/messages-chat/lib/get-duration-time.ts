export const getDurationTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString()}:${secs.toString().padStart(2, '0')}`;
};
