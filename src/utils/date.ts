export const formatDate = (date: Date, options: Intl.DateTimeFormatOptions = {}) => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  return date.toLocaleString('ko-KR', { ...defaultOptions, ...options });
};

export const formatDateTime = (date: Date) => {
  return formatDate(date, {
    hour: '2-digit',
    minute: '2-digit'
  });
}; 