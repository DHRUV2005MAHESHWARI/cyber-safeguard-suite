
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface SecurityScoreProps {
  score: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

const SecurityScore = ({ 
  score, 
  className, 
  size = 'md',
  showLabel = true,
  animated = true
}: SecurityScoreProps) => {
  const [displayScore, setDisplayScore] = useState(0);
  
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayScore(score);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setDisplayScore(score);
    }
  }, [score, animated]);

  const getScoreColor = () => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getScoreText = () => {
    if (score >= 80) return 'Excellent';
    if (score >= 50) return 'Moderate';
    return 'Poor';
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-1.5';
      case 'lg':
        return 'h-3';
      default:
        return 'h-2';
    }
  };

  return (
    <div className={cn('space-y-1.5', className)}>
      {showLabel && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Security Score
          </span>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold">
              {displayScore}%
            </span>
            <span className="text-xs text-muted-foreground">
              ({getScoreText()})
            </span>
          </div>
        </div>
      )}
      <Progress 
        value={displayScore} 
        className={cn(
          'w-full transition-all duration-1000 ease-out',
          getSizeClasses(),
          className
        )}
        indicatorClassName={getScoreColor()}
      />
    </div>
  );
};

export default SecurityScore;
