const LoadingSpinner = ({ isDay = true }) => {
  // Different spinner color for day vs night
  const borderClass = isDay ? 'border-white' : 'border-purple-300';

  return (
    <div className="flex justify-center items-center py-12">
      <div className={`animate-spin rounded-full h-16 w-16 border-b-4 ${borderClass} transition-colors duration-500`}></div>
    </div>
  );
};

export default LoadingSpinner;
