
import React from 'react';
import { Cpu, Database, HardDrive, Battery, Thermometer, Server } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import CardContainer from '@/components/CardContainer';
import { SystemInfo } from '@/hooks/useSystemMonitor';

interface SystemResourcesCardProps {
  systemInfo: SystemInfo;
}

const SystemResourcesCard = ({ systemInfo }: SystemResourcesCardProps) => {
  const getMetricColor = (value: number, thresholds: { high: number, medium: number }) => {
    if (value >= thresholds.high) return 'bg-red-500';
    if (value >= thresholds.medium) return 'bg-amber-500';
    return 'bg-green-500';
  };
  
  return (
    <CardContainer className="p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">System Resources</h3>
          <span className="text-xs text-muted-foreground">
            Last updated: {systemInfo.lastUpdated.toLocaleTimeString()}
          </span>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-500" />
                <span className="text-sm">CPU Usage</span>
              </div>
              <span className="text-sm font-medium">{systemInfo.cpuUsage}%</span>
            </div>
            <Progress 
              value={systemInfo.cpuUsage} 
              className="h-2 w-full"
              indicatorClassName={getMetricColor(systemInfo.cpuUsage, { high: 80, medium: 50 })}
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-500" />
                <span className="text-sm">Memory Usage</span>
              </div>
              <span className="text-sm font-medium">{systemInfo.memoryUsage}%</span>
            </div>
            <Progress 
              value={systemInfo.memoryUsage} 
              className="h-2 w-full"
              indicatorClassName={getMetricColor(systemInfo.memoryUsage, { high: 85, medium: 60 })}
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-amber-500" />
                <span className="text-sm">Disk Usage</span>
              </div>
              <span className="text-sm font-medium">{systemInfo.diskUsage}%</span>
            </div>
            <Progress 
              value={systemInfo.diskUsage} 
              className="h-2 w-full"
              indicatorClassName={getMetricColor(systemInfo.diskUsage, { high: 90, medium: 70 })}
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <div className="flex items-center gap-2">
                <Battery className="w-4 h-4 text-green-500" />
                <span className="text-sm">Battery Level</span>
              </div>
              <span className="text-sm font-medium">{systemInfo.batteryLevel}%</span>
            </div>
            <Progress 
              value={systemInfo.batteryLevel} 
              className="h-2 w-full"
              indicatorClassName={
                systemInfo.batteryLevel <= 20 ? 'bg-red-500' : 
                systemInfo.batteryLevel <= 50 ? 'bg-amber-500' : 
                'bg-green-500'
              }
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-red-500" />
                <span className="text-sm">Temperature</span>
              </div>
              <span className="text-sm font-medium">{systemInfo.temperature}°C</span>
            </div>
            <Progress 
              value={(systemInfo.temperature / 100) * 100} 
              className="h-2 w-full"
              indicatorClassName={getMetricColor(systemInfo.temperature, { high: 70, medium: 50 })}
            />
          </div>
          
          <div className="flex justify-between text-sm pt-2">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-500" />
              <span>Processes Running</span>
            </div>
            <div className="flex gap-1">
              <span className="font-medium">{systemInfo.runningProcesses}</span>
              {systemInfo.suspiciousProcesses > 0 && (
                <span className="text-red-500">
                  ({systemInfo.suspiciousProcesses} suspicious)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </CardContainer>
  );
};

export default SystemResourcesCard;
