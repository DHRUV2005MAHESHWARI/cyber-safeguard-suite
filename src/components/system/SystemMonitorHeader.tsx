
import React from 'react';
import { Activity, RefreshCw, Shield, Lock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/StatusBadge';
import { SecurityStatus } from '@/context/SecurityContext';

interface SystemMonitorHeaderProps {
  systemStatus: SecurityStatus;
  isScanning: boolean;
  startScan: () => void;
}

const SystemMonitorHeader = ({ systemStatus, isScanning, startScan }: SystemMonitorHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Activity className="w-8 h-8 text-primary" />
          System Monitor
        </h1>
        <p className="text-muted-foreground">
          Track system performance, security, and optimize your device.
        </p>
        
        <div className="flex gap-6 mt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-primary" />
            Security Tools
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="w-4 h-4 text-primary" />
            Password Checker
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="w-4 h-4 text-primary" />
            Performance Boost
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <StatusBadge status={systemStatus} className="animate-fade-in" />
        <Button 
          onClick={startScan} 
          disabled={isScanning}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? 'Scanning...' : 'Scan System'}
        </Button>
      </div>
    </div>
  );
};

export default SystemMonitorHeader;
