
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface AnimatedIconProps {
  icon: LucideIcon;
  className?: string;
  size?: number;
  animation?: 'pulse' | 'spin' | 'bounce' | 'none';
  color?: string;
}

const AnimatedIcon = ({ 
  icon: Icon, 
  className, 
  size = 24, 
  animation = 'none',
  color
}: AnimatedIconProps) => {
  
  const getAnimationClass = () => {
    switch (animation) {
      case 'pulse':
        return 'animate-pulse-slow';
      case 'spin':
        return 'animate-spin-slow';
      case 'bounce':
        return 'animate-bounce';
      default:
        return '';
    }
  };
  
  return (
    <div className={cn(
      'flex items-center justify-center rounded-full transition-all',
      getAnimationClass(),
      className
    )}>
      <Icon size={size} className={color ? `text-${color}` : ''} />
    </div>
  );
};

export default AnimatedIcon;
