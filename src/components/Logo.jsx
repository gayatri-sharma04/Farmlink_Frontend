const Logo = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl',
  };

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center shadow-lg`}>
      <span className="text-white font-bold">🌾</span>
    </div>
  );
};

export default Logo;
