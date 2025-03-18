
import React from 'react';
import { Activity, RefreshCw } from 'lucide-react';
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
          Track system performance and security status.
        </p>
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
