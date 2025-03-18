
import React from 'react';
import { RefreshCw, Shield, Lock, Zap } from 'lucide-react';
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
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        {isScanning 
          ? "Scanning your system. This won't take long..." 
          : "Click 'Scan System' to begin monitoring your device."}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mt-8">
        <div className="p-4 rounded-lg border bg-card/30">
          <Shield className="w-8 h-8 mx-auto mb-2 text-primary/80" />
          <h4 className="font-medium mb-1">Security Scanner</h4>
          <p className="text-xs text-muted-foreground">Monitors system for security threats</p>
        </div>
        
        <div className="p-4 rounded-lg border bg-card/30">
          <Lock className="w-8 h-8 mx-auto mb-2 text-primary/80" />
          <h4 className="font-medium mb-1">Password Checker</h4>
          <p className="text-xs text-muted-foreground">Analyzes password strength</p>
        </div>
        
        <div className="p-4 rounded-lg border bg-card/30">
          <Zap className="w-8 h-8 mx-auto mb-2 text-primary/80" />
          <h4 className="font-medium mb-1">Performance Booster</h4>
          <p className="text-xs text-muted-foreground">Optimizes system performance</p>
        </div>
      </div>
    </CardContainer>
  );
};

export default LoadingState;
