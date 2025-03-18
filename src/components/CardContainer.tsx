
import React from 'react';
import { cn } from '@/lib/utils';

interface CardContainerProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const CardContainer = ({ children, className, onClick }: CardContainerProps) => {
  return (
    <div 
      className={cn(
        "security-card animate-scale-in", 
        onClick ? "cursor-pointer hover:translate-y-[-2px]" : "",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default CardContainer;
