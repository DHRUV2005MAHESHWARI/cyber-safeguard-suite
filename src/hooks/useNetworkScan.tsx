
import { useState, useEffect } from 'react';
import { useSecurity, SecurityStatus } from '@/context/SecurityContext';

export interface NetworkDetails {
  ssid: string;
  encryption: string;
  strength: number;
  status: SecurityStatus;
}

export const useNetworkScan = () => {
  const { isScanning, updateNetworkStatus } = useSecurity();
  const [networks, setNetworks] = useState<NetworkDetails[]>([]);
  const [scanComplete, setScanComplete] = useState(false);

  // Simulate a network scan
  useEffect(() => {
    if (isScanning) {
      setScanComplete(false);
      setNetworks([]);
      
      // Simulate scanning delay
      const timer = setTimeout(() => {
        const mockNetworks: NetworkDetails[] = [
          {
            ssid: 'HomeNetwork_5G',
            encryption: 'WPA2-PSK',
            strength: 95,
            status: 'secure'
          },
          {
            ssid: 'Office_Network',
            encryption: 'WPA3',
            strength: 78,
            status: 'secure'
          },
          {
            ssid: 'GuestWiFi',
            encryption: 'WPA2',
            strength: 82,
            status: 'secure'
          },
          {
            ssid: 'CafeWiFi_FREE',
            encryption: 'Open',
            strength: 45,
            status: 'critical'
          },
          {
            ssid: 'Neighbor_Network',
            encryption: 'WEP',
            strength: 30,
            status: 'warning'
          },
        ];
        
        setNetworks(mockNetworks);
        setScanComplete(true);
        
        // Determine overall network security
        const criticalNetworks = mockNetworks.filter(n => n.status === 'critical').length;
        const warningNetworks = mockNetworks.filter(n => n.status === 'warning').length;
        
        if (criticalNetworks > 0) {
          updateNetworkStatus('critical');
        } else if (warningNetworks > 0) {
          updateNetworkStatus('warning');
        } else {
          updateNetworkStatus('secure');
        }
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, [isScanning, updateNetworkStatus]);

  // Function to start a manual scan
  const scanNetworks = () => {
    setScanComplete(false);
    setNetworks([]);
    updateNetworkStatus('scanning');
    
    // Simulate new scan
    setTimeout(() => {
      const updatedNetworks: NetworkDetails[] = [
        {
          ssid: 'HomeNetwork_5G',
          encryption: 'WPA2-PSK',
          strength: 92,
          status: 'secure'
        },
        {
          ssid: 'Office_Network',
          encryption: 'WPA3',
          strength: 75,
          status: 'secure'
        },
        {
          ssid: 'GuestWiFi',
          encryption: 'WPA2',
          strength: 84,
          status: 'secure'
        },
        {
          ssid: 'PublicWiFi',
          encryption: 'Open',
          strength: 40,
          status: 'critical'
        },
      ];
      
      setNetworks(updatedNetworks);
      setScanComplete(true);
      
      // Update overall status
      const criticalNetworks = updatedNetworks.filter(n => n.status === 'critical').length;
      const warningNetworks = updatedNetworks.filter(n => n.status === 'warning').length;
      
      if (criticalNetworks > 0) {
        updateNetworkStatus('critical');
      } else if (warningNetworks > 0) {
        updateNetworkStatus('warning');
      } else {
        updateNetworkStatus('secure');
      }
    }, 2000);
  };

  return { 
    networks, 
    scanComplete,
    scanNetworks
  };
};
