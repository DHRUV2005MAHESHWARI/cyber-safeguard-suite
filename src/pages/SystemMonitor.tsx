
import React from 'react';
import { Activity, RefreshCw, Shield, AlertTriangle, X, Cpu, Memory, HardDrive, Battery, Thermometer, Server } from 'lucide-react';
import { useSecurity } from '@/context/SecurityContext';
import { useSystemMonitor } from '@/hooks/useSystemMonitor';
import CardContainer from '@/components/CardContainer';
import StatusBadge from '@/components/StatusBadge';
import AnimatedIcon from '@/components/AnimatedIcon';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SystemMonitor = () => {
  const { systemStatus, startScan, isScanning } = useSecurity();
  const { systemInfo, securityIssues, resolveIssue } = useSystemMonitor();
  
  const getMetricColor = (value: number, thresholds: { high: number, medium: number }) => {
    if (value >= thresholds.high) return 'bg-red-500';
    if (value >= thresholds.medium) return 'bg-amber-500';
    return 'bg-green-500';
  };
  
  const getStatusIcon = (severity: string) => {
    switch (severity) {
      case 'secure':
        return <Shield className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'critical':
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };
  
  // Sample performance data for chart
  const performanceData = [
    { time: '2m ago', cpu: 15, memory: 40 },
    { time: '1.5m ago', cpu: 25, memory: 42 },
    { time: '1m ago', cpu: 18, memory: 45 },
    { time: '30s ago', cpu: 22, memory: 48 },
    { time: 'now', cpu: systemInfo?.cpuUsage || 0, memory: systemInfo?.memoryUsage || 0 },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <NavBar />
      
      <main className="container max-w-5xl px-6 pt-32 animate-fade-in">
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
        
        {systemInfo ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                          <Memory className="w-4 h-4 text-purple-500" />
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
              
              <CardContainer className="p-6 md:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Performance History</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={performanceData}
                      margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="time" stroke="#888888" fontSize={12} />
                      <YAxis stroke="#888888" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          border: 'none'
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="cpu" 
                        name="CPU Usage" 
                        stroke="#3b82f6" 
                        strokeWidth={2} 
                        dot={{ r: 4 }} 
                        activeDot={{ r: 6 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="memory" 
                        name="Memory Usage" 
                        stroke="#a855f7" 
                        strokeWidth={2} 
                        dot={{ r: 4 }} 
                        activeDot={{ r: 6 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContainer>
            </div>
            
            <CardContainer>
              <div className="p-6 pb-4">
                <h3 className="text-lg font-semibold">Security Issues</h3>
              </div>
              
              {securityIssues.length > 0 ? (
                <div className="divide-y">
                  {securityIssues.map((issue) => (
                    <div key={issue.id} className="p-6 flex flex-col md:flex-row gap-4 justify-between animate-fade-in">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(issue.severity)}
                          <h4 className="font-semibold">{issue.title}</h4>
                          <StatusBadge status={issue.severity} />
                        </div>
                        <p className="text-muted-foreground text-sm">{issue.description}</p>
                        <div className="text-xs text-muted-foreground">
                          Detected: {issue.detected.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <Button 
                          onClick={() => resolveIssue(issue.id)} 
                          size="sm" 
                          variant={issue.severity === 'critical' ? 'default' : 'outline'}
                        >
                          Resolve Issue
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <AnimatedIcon 
                    icon={Shield} 
                    size={48}
                    className="mx-auto mb-4 p-4 text-green-500"
                  />
                  <h4 className="text-lg font-semibold mb-2">All Clear!</h4>
                  <p className="text-muted-foreground">
                    No security issues were detected on your system.
                  </p>
                </div>
              )}
            </CardContainer>
          </div>
        ) : (
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
        )}
      </main>
    </div>
  );
};

export default SystemMonitor;
