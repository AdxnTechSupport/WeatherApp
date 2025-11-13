const ErrorMessage = ({ message, isDay = true }) => {
  // Slightly brighter error styling for night mode
  const bgClass = isDay
    ? 'bg-red-500/20 border-red-300/30'
    : 'bg-red-500/30 border-red-400/40';

  return (
    <div className={`${bgClass} backdrop-blur-sm text-white px-5 py-4 rounded-2xl mb-4 transition-colors duration-500`}>
      <div className="flex items-center gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;
