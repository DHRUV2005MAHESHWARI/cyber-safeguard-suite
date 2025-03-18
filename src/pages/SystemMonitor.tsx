
import React from 'react';
import { useSecurity } from '@/context/SecurityContext';
import { useSystemMonitor } from '@/hooks/useSystemMonitor';
import NavBar from '@/components/NavBar';
import SystemMonitorHeader from '@/components/system/SystemMonitorHeader';
import SystemResourcesCard from '@/components/system/SystemResourcesCard';
import PerformanceChart from '@/components/system/PerformanceChart';
import SecurityIssuesList from '@/components/system/SecurityIssuesList';
import PasswordStrengthChecker from '@/components/password/PasswordStrengthChecker';
import VulnerabilityScanner from '@/components/system/VulnerabilityScanner';
import PerformanceBooster from '@/components/system/PerformanceBooster';
import LoadingState from '@/components/system/LoadingState';

const SystemMonitor = () => {
  const { systemStatus, startScan, isScanning } = useSecurity();
  const { systemInfo, securityIssues, resolveIssue } = useSystemMonitor();
  
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
        <SystemMonitorHeader 
          systemStatus={systemStatus}
          isScanning={isScanning}
          startScan={startScan}
        />
        
        {systemInfo ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SystemResourcesCard systemInfo={systemInfo} />
              <PerformanceChart performanceData={performanceData} />
            </div>
            
            <SecurityIssuesList 
              securityIssues={securityIssues}
              resolveIssue={resolveIssue}
            />
            
            {/* New Components */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PasswordStrengthChecker />
              <PerformanceBooster />
            </div>
            
            <VulnerabilityScanner />
          </div>
        ) : (
          <LoadingState isScanning={isScanning} />
        )}
      </main>
    </div>
  );
};

export default SystemMonitor;
