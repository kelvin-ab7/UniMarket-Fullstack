import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faClock, faIdCard } from "@fortawesome/free-solid-svg-icons";

export default function VerificationBadge({ status, size = "sm", showText = true }) {
  const getBadgeConfig = () => {
    switch (status) {
      case "verified":
        return {
          icon: faCheckCircle,
          text: "Verified Student",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          borderColor: "border-green-200",
          iconColor: "text-green-500"
        };
      case "pending":
        return {
          icon: faClock,
          text: "Verification Pending",
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          borderColor: "border-yellow-200",
          iconColor: "text-yellow-500"
        };
      case "unverified":
        return {
          icon: faIdCard,
          text: "Unverified",
          bgColor: "bg-gray-100",
          textColor: "text-gray-600",
          borderColor: "border-gray-200",
          iconColor: "text-gray-400"
        };
      default:
        return {
          icon: faIdCard,
          text: "Unverified",
          bgColor: "bg-gray-100",
          textColor: "text-gray-600",
          borderColor: "border-gray-200",
          iconColor: "text-gray-400"
        };
    }
  };

  const config = getBadgeConfig();

  const sizeClasses = {
    xs: "px-1.5 py-0.5 text-xs",
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-1.5 text-base",
    lg: "px-4 py-2 text-lg"
  };

  const iconSizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  return (
    <div className={`inline-flex items-center ${sizeClasses[size]} ${config.bgColor} ${config.textColor} ${config.borderColor} border rounded-full font-medium`}>
      <FontAwesomeIcon 
        icon={config.icon} 
        className={`mr-1.5 ${config.iconColor} ${iconSizeClasses[size]}`}
      />
      {showText && <span>{config.text}</span>}
    </div>
  );
}

// Compact version for small spaces
export function CompactVerificationBadge({ status, size = "sm" }) {
  return <VerificationBadge status={status} size={size} showText={false} />;
}

// Tooltip version with hover info
export function TooltipVerificationBadge({ status, size = "sm" }) {
  const getTooltipText = () => {
    switch (status) {
      case "verified":
        return "This user has been verified as a KNUST student";
      case "pending":
        return "Student ID verification is in progress";
      case "unverified":
        return "This user has not uploaded their student ID";
      default:
        return "Verification status unknown";
    }
  };

  return (
    <div className="group relative inline-block">
      <VerificationBadge status={status} size={size} />
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
        {getTooltipText()}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
}
