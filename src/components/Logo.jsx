import farmlinkLogo from '../assets/farmlink logo.png';

const Logo = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  return (
    <img 
      src={farmlinkLogo} 
      alt="FarmLink Logo" 
      className={`${sizeClasses[size]} object-contain`}
    />
  );
};

export default Logo;
