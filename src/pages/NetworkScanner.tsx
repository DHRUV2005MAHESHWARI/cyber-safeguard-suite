
import React, { useState } from 'react';
import { Wifi, RefreshCw, Shield, AlertTriangle, X } from 'lucide-react';
import { useSecurity } from '@/context/SecurityContext';
import { useNetworkScan, NetworkDetails } from '@/hooks/useNetworkScan';
import CardContainer from '@/components/CardContainer';
import StatusBadge from '@/components/StatusBadge';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const NetworkScanner = () => {
  const { networkStatus } = useSecurity();
  const { networks, scanComplete, scanNetworks } = useNetworkScan();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  
  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
    
    // Call the scan function
    scanNetworks();
    
    // Finish the scan after 2 seconds
    setTimeout(() => {
      clearInterval(interval);
      setScanProgress(100);
      setIsScanning(false);
    }, 2000);
  };
  
  const getNetworkSecurityIcon = (network: NetworkDetails) => {
    switch (network.status) {
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
  
  const getEncryptionColor = (encryption: string) => {
    if (encryption === 'WPA3') return 'text-green-500';
    if (encryption === 'WPA2-PSK' || encryption === 'WPA2') return 'text-blue-500';
    if (encryption === 'WEP') return 'text-amber-500';
    if (encryption === 'Open') return 'text-red-500';
    return '';
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <NavBar />
      
      <main className="container max-w-5xl px-6 pt-32 animate-fade-in">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Wifi className="w-8 h-8 text-primary" />
              Network Scanner
            </h1>
            <p className="text-muted-foreground">
              Scan and analyze networks for security vulnerabilities.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <StatusBadge status={networkStatus} className="animate-fade-in" />
            <Button 
              onClick={startScan} 
              disabled={isScanning} 
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              {isScanning ? 'Scanning...' : 'Scan Networks'}
            </Button>
          </div>
        </div>
        
        {isScanning && (
          <CardContainer className="mb-6 p-6">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Scanning for networks...</span>
                <span>{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} className="w-full" />
            </div>
          </CardContainer>
        )}
        
        <div className="space-y-6">
          <CardContainer className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-6 py-4 text-left font-medium">Network Name</th>
                    <th className="px-6 py-4 text-left font-medium">Encryption</th>
                    <th className="px-6 py-4 text-left font-medium">Signal Strength</th>
                    <th className="px-6 py-4 text-left font-medium">Security</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {networks.length > 0 ? (
                    networks.map((network, index) => (
                      <tr key={index} className="hover:bg-muted/40 transition-colors animate-fade-in">
                        <td className="px-6 py-4">
                          <div className="font-medium">{network.ssid}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={getEncryptionColor(network.encryption)}>
                            {network.encryption}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-secondary rounded-full h-2 overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  network.strength > 70 ? 'bg-green-500' : 
                                  network.strength > 40 ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${network.strength}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">{network.strength}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getNetworkSecurityIcon(network)}
                            <StatusBadge status={network.status} />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                        {scanComplete ? 'No networks found.' : 'Start a scan to find networks.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContainer>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CardContainer className="p-6">
              <h3 className="text-lg font-semibold mb-4">Security Tips</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <Shield className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-500" />
                  <span>Use WPA3 encryption when available for best security.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-500" />
                  <span>Avoid connecting to open or WEP-encrypted networks.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-500" />
                  <span>Use a VPN when connecting to public WiFi networks.</span>
                </li>
              </ul>
            </CardContainer>
            
            <CardContainer className="p-6 md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Understanding Encryption</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 p-2 rounded bg-green-100 dark:bg-green-900/20">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <div>
                    <span className="font-medium text-green-700 dark:text-green-400">WPA3</span>
                    <p className="text-green-700/70 dark:text-green-400/70 text-xs mt-0.5">
                      Latest protocol with strongest security features.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-2 rounded bg-blue-100 dark:bg-blue-900/20">
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  <div>
                    <span className="font-medium text-blue-700 dark:text-blue-400">WPA2</span>
                    <p className="text-blue-700/70 dark:text-blue-400/70 text-xs mt-0.5">
                      Good security, but has some known vulnerabilities.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-2 rounded bg-amber-100 dark:bg-amber-900/20">
                  <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                  <div>
                    <span className="font-medium text-amber-700 dark:text-amber-400">WEP</span>
                    <p className="text-amber-700/70 dark:text-amber-400/70 text-xs mt-0.5">
                      Outdated and easily crackable, avoid if possible.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-2 rounded bg-red-100 dark:bg-red-900/20">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <div>
                    <span className="font-medium text-red-700 dark:text-red-400">Open</span>
                    <p className="text-red-700/70 dark:text-red-400/70 text-xs mt-0.5">
                      No encryption, all traffic can be intercepted.
                    </p>
                  </div>
                </div>
              </div>
            </CardContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NetworkScanner;
