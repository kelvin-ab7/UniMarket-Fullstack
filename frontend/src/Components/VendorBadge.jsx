import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMedal, 
  faCrown, 
  faGem, 
  faStar, 
  faAward 
} from '@fortawesome/free-solid-svg-icons';

const VendorBadge = ({ badge, size = "md", showTooltip = true }) => {
  const badgeConfig = {
    none: {
      icon: null,
      color: "text-gray-400",
      bgColor: "bg-gray-100",
      borderColor: "border-gray-300",
      label: "No Badge",
      description: "New vendor"
    },
    bronze: {
      icon: faMedal,
      color: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-300",
      label: "Bronze",
      description: "Reliable vendor"
    },
    silver: {
      icon: faMedal,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-400",
      label: "Silver",
      description: "Trusted vendor"
    },
    gold: {
      icon: faAward,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-400",
      label: "Gold",
      description: "Premium vendor"
    },
    platinum: {
      icon: faStar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-400",
      label: "Platinum",
      description: "Elite vendor"
    },
    diamond: {
      icon: faCrown,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-400",
      label: "Diamond",
      description: "Top-tier vendor"
    }
  };

  const config = badgeConfig[badge] || badgeConfig.none;
  
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2"
  };

  const iconSizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  if (badge === 'none') {
    return null;
  }

  return (
    <div className="relative group">
      <div className={`
        inline-flex items-center gap-1.5 rounded-full border-2 font-medium
        ${config.color} ${config.bgColor} ${config.borderColor} ${sizeClasses[size]}
        transition-all duration-200 hover:scale-105
      `}>
        {config.icon && (
          <FontAwesomeIcon 
            icon={config.icon} 
            className={iconSizeClasses[size]}
          />
        )}
        <span>{config.label}</span>
      </div>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
          {config.description}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export default VendorBadge;
