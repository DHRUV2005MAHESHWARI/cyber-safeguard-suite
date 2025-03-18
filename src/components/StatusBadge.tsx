
import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export type SecurityStatus = 'secure' | 'warning' | 'critical' | 'scanning';

interface StatusBadgeProps {
  status: SecurityStatus;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'secure':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      case 'warning':
        return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      case 'scanning':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800 animate-pulse-slow';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'secure':
        return 'Secure';
      case 'warning':
        return 'Warning';
      case 'critical':
        return 'Critical';
      case 'scanning':
        return 'Scanning...';
      default:
        return 'Unknown';
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        'font-medium border px-2.5 py-0.5 text-xs rounded-full transition-colors',
        getStatusStyles(),
        className
      )}
    >
      {getStatusText()}
    </Badge>
  );
};

export default StatusBadge;
