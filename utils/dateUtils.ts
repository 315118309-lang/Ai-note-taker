export const formatTodayHeader = (date: Date): string => {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'short',
    day: 'numeric',
    weekday: 'long'
  }).format(date);
};

export const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('zh-CN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false
  }).format(date);
};

export const formatJournalDate = (date: Date): { day: string, month: string } => {
  // Extract parts to allow custom styling if needed, or simply use formatting
  // For "24 Oct", in Chinese "10月 24日" usually better.
  // The UI has Day big and Month small. 
  // Day: "24", Month: "10月"
  return {
    day: date.getDate().toString(),
    month: new Intl.DateTimeFormat('zh-CN', { month: 'short' }).format(date)
  };
};

export const isSameDay = (d1: Date, d2: Date): boolean => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};