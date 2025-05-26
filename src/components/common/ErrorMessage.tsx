import type { FC } from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorMessage: FC<ErrorMessageProps> = ({ message, onRetry, className = '' }) => {
  return (
    <div className={`text-center p-4 ${className}`}>
      <p className="text-red-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-blue-600 hover:text-blue-800"
        >
          다시 시도
        </button>
      )}
    </div>
  );
};

export default ErrorMessage; 