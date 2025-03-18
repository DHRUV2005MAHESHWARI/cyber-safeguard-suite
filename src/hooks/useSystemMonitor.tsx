
import { useState, useEffect } from 'react';
import { useSecurity, SecurityStatus } from '@/context/SecurityContext';

export interface SystemInfo {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  batteryLevel: number;
  temperature: number;
  runningProcesses: number;
  suspiciousProcesses: number;
  lastUpdated: Date;
  status: SecurityStatus;
}

export interface SecurityIssue {
  id: string;
  title: string;
  description: string;
  severity: SecurityStatus;
  detected: Date;
}

export const useSystemMonitor = () => {
  const { isScanning, updateSystemStatus } = useSecurity();
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [securityIssues, setSecurityIssues] = useState<SecurityIssue[]>([]);
  const [scanComplete, setScanComplete] = useState(false);

  // Simulate system scan
  useEffect(() => {
    if (isScanning) {
      setScanComplete(false);
      setSystemInfo(null);
      
      // Simulate scanning delay
      const timer = setTimeout(() => {
        const mockSystemInfo: SystemInfo = {
          cpuUsage: Math.floor(Math.random() * 30) + 10, // 10-40%
          memoryUsage: Math.floor(Math.random() * 40) + 30, // 30-70%
          diskUsage: 65,
          batteryLevel: 78,
          temperature: 42,
          runningProcesses: 72,
          suspiciousProcesses: 1,
          lastUpdated: new Date(),
          status: 'warning'
        };
        
        const mockIssues: SecurityIssue[] = [
          {
            id: '1',
            title: 'Operating System Update Required',
            description: 'Your operating system is missing important security updates. Update your system to ensure protection against the latest vulnerabilities.',
            severity: 'warning',
            detected: new Date()
          },
          {
            id: '2',
            title: 'Suspicious Process Detected',
            description: 'The process "background_service.exe" is showing unusual behavior and may be malicious. Consider scanning your system with an antivirus.',
            severity: 'critical',
            detected: new Date()
          },
          {
            id: '3',
            title: 'High Resource Usage',
            description: 'Your system is experiencing higher than normal resource usage, which could indicate malware activity or inefficient applications.',
            severity: 'warning',
            detected: new Date()
          },
        ];
        
        setSystemInfo(mockSystemInfo);
        setSecurityIssues(mockIssues);
        setScanComplete(true);
        
        // Determine overall system security
        const criticalIssues = mockIssues.filter(i => i.severity === 'critical').length;
        const warningIssues = mockIssues.filter(i => i.severity === 'warning').length;
        
        if (criticalIssues > 0) {
          updateSystemStatus('critical');
        } else if (warningIssues > 0) {
          updateSystemStatus('warning');
        } else {
          updateSystemStatus('secure');
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isScanning, updateSystemStatus]);

  // Get real-time system updates
  useEffect(() => {
    if (systemInfo && scanComplete) {
      const interval = setInterval(() => {
        // Simulate fluctuating system metrics
        setSystemInfo(prev => {
          if (!prev) return null;
          
          return {
            ...prev,
            cpuUsage: Math.max(5, Math.min(95, prev.cpuUsage + (Math.random() * 10 - 5))),
            memoryUsage: Math.max(20, Math.min(90, prev.memoryUsage + (Math.random() * 6 - 3))),
            lastUpdated: new Date()
          };
        });
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [systemInfo, scanComplete]);

  // Function to resolve a security issue
  const resolveIssue = (issueId: string) => {
    setSecurityIssues(prev => prev.filter(issue => issue.id !== issueId));
    
    // Update overall status
    setTimeout(() => {
      const updatedIssues = securityIssues.filter(issue => issue.id !== issueId);
      const criticalIssues = updatedIssues.filter(i => i.severity === 'critical').length;
      const warningIssues = updatedIssues.filter(i => i.severity === 'warning').length;
      
      if (criticalIssues > 0) {
        updateSystemStatus('critical');
      } else if (warningIssues > 0) {
        updateSystemStatus('warning');
      } else {
        updateSystemStatus('secure');
      }
    }, 300);
  };

  return { 
    systemInfo, 
    securityIssues,
    scanComplete,
    resolveIssue
  };
};
