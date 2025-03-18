
import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';

export const useMobileDevice = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check if running on a native platform (Android/iOS)
    const isNativePlatform = Capacitor.isNativePlatform();
    setIsMobile(isNativePlatform);
  }, []);
  
  return { isMobile };
};
