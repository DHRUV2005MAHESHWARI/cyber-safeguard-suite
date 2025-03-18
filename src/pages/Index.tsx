
import React from 'react';
import { Shield, Wifi, Key, Activity, Clock, RefreshCw } from 'lucide-react';
import { useSecurity } from '@/context/SecurityContext';
import CardContainer from '@/components/CardContainer';
import SecurityScore from '@/components/SecurityScore';
import StatusBadge from '@/components/StatusBadge';
import AnimatedIcon from '@/components/AnimatedIcon';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';

const Index = () => {
  const navigate = useNavigate();
  const { 
    overallScore, 
    networkStatus, 
    passwordStatus, 
    systemStatus, 
    isScanning,
    lastScanDate, 
    startScan 
  } = useSecurity();

  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <NavBar />
      
      <main className="container max-w-5xl px-6 pt-32 animate-fade-in">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl"></div>
            <Shield className="w-20 h-20 text-primary relative z-10" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">CyberGuard Suite</h1>
          <p className="text-muted-foreground max-w-xl">
            Comprehensive security monitoring and protection for your digital life.
          </p>
        </div>
        
        <div className="mb-10">
          <CardContainer className="p-8 glass">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-6">Security Overview</h2>
                <div className="space-y-6">
                  <SecurityScore 
                    score={overallScore} 
                    size="lg" 
                    className="w-full" 
                    animated={!isScanning}
                  />
                  
                  <div className="flex flex-wrap gap-3">
                    <StatusBadge status={networkStatus} className="animate-fade-in" />
                    <StatusBadge status={passwordStatus} className="animate-fade-in" />
                    <StatusBadge status={systemStatus} className="animate-fade-in" />
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>Last scan: {formatDate(lastScanDate)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <Button 
                  size="lg" 
                  disabled={isScanning}
                  onClick={startScan} 
                  className="gap-2 relative overflow-hidden group"
                >
                  <RefreshCw className={`w-5 h-5 ${isScanning ? 'animate-spin' : 'group-hover:animate-spin'}`} />
                  {isScanning ? 'Scanning...' : 'Start New Scan'}
                </Button>
              </div>
            </div>
          </CardContainer>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardContainer 
            className="p-6 text-center"
            onClick={() => navigate('/network-scanner')}
          >
            <AnimatedIcon 
              icon={Wifi} 
              size={32}
              className="mx-auto mb-4 p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-full"
            />
            <h3 className="text-lg font-semibold mb-2">Network Scanner</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Scan and analyze your network for security vulnerabilities and threats.
            </p>
            <StatusBadge status={networkStatus} />
          </CardContainer>
          
          <CardContainer 
            className="p-6 text-center" 
            onClick={() => navigate('/password-manager')}
          >
            <AnimatedIcon 
              icon={Key} 
              size={32}
              className="mx-auto mb-4 p-4 bg-amber-100 dark:bg-amber-900/30 text-amber-500 rounded-full"
            />
            <h3 className="text-lg font-semibold mb-2">Password Manager</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Store and generate secure passwords, and check their strength.
            </p>
            <StatusBadge status={passwordStatus} />
          </CardContainer>
          
          <CardContainer 
            className="p-6 text-center"
            onClick={() => navigate('/system-monitor')}
          >
            <AnimatedIcon 
              icon={Activity} 
              size={32}
              className="mx-auto mb-4 p-4 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full"
            />
            <h3 className="text-lg font-semibold mb-2">System Monitor</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Track system performance and scan for potential threats.
            </p>
            <StatusBadge status={systemStatus} />
          </CardContainer>
        </div>
      </main>
    </div>
  );
};

export default Index;
