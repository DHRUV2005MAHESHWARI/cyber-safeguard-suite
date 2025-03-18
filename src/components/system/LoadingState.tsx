
import React from 'react';
import { RefreshCw } from 'lucide-react';
import CardContainer from '@/components/CardContainer';
import AnimatedIcon from '@/components/AnimatedIcon';

interface LoadingStateProps {
  isScanning: boolean;
}

const LoadingState = ({ isScanning }: LoadingStateProps) => {
  return (
    <CardContainer className="p-12 text-center">
      <AnimatedIcon 
        icon={RefreshCw} 
        size={48}
        animation="spin"
        className="mx-auto mb-4 text-primary p-4"
      />
      <h3 className="text-xl font-semibold mb-2">Initializing System Monitor</h3>
      <p className="text-muted-foreground max-w-md mx-auto">
        {isScanning 
          ? "Scanning your system. This won't take long..." 
          : "Click 'Scan System' to begin monitoring your device."}
      </p>
    </CardContainer>
  );
};

export default LoadingState;
