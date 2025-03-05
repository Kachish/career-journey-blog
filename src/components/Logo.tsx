
import { Link } from "react-router-dom";

interface LogoProps {
  variant?: "default" | "light";
  size?: "sm" | "md" | "lg";
}

const Logo = ({ variant = "default", size = "md" }: LogoProps) => {
  const textColorClass = variant === "light" ? "text-white" : "text-primary";
  
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };
  
  return (
    <Link to="/" className={`font-display font-semibold tracking-tight ${sizeClasses[size]}`}>
      <span className="sr-only">Career Canvas</span>
      <div className="flex items-center">
        <svg 
          width={size === "sm" ? "24" : size === "md" ? "32" : "40"} 
          height={size === "sm" ? "24" : size === "md" ? "32" : "40"} 
          viewBox="0 0 40 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="mr-2"
        >
          <path 
            d="M20 2C10.0589 2 2 10.0589 2 20C2 29.9411 10.0589 38 20 38C29.9411 38 38 29.9411 38 20C38 10.0589 29.9411 2 20 2Z" 
            stroke="currentColor" 
            strokeWidth="3" 
            fill="none"
          />
          <path 
            d="M12 14C12 12.8954 12.8954 12 14 12H26C27.1046 12 28 12.8954 28 14V26C28 27.1046 27.1046 28 26 28H14C12.8954 28 12 27.1046 12 26V14Z" 
            fill={variant === "light" ? "white" : "currentColor"} 
            fillOpacity="0.2"
          />
          <path 
            d="M17 20.5L20 23.5L23 20.5M20 23.5V16.5" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
        <span className={textColorClass}>Career</span>
        <span className={`${textColorClass} opacity-80`}>Canvas</span>
      </div>
    </Link>
  );
};

export default Logo;
