
import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { useMobileDevice } from '@/hooks/useMobileDevice';

// Types
export type SecurityStatus = 'secure' | 'warning' | 'critical' | 'scanning';

interface SecurityState {
  overallScore: number;
  lastScanDate: Date | null;
  networkStatus: SecurityStatus;
  passwordStatus: SecurityStatus;
  systemStatus: SecurityStatus;
  isScanning: boolean;
  isMobileDevice: boolean;
}

type SecurityAction = 
  | { type: 'SET_OVERALL_SCORE'; payload: number }
  | { type: 'SET_LAST_SCAN_DATE'; payload: Date }
  | { type: 'SET_NETWORK_STATUS'; payload: SecurityStatus }
  | { type: 'SET_PASSWORD_STATUS'; payload: SecurityStatus }
  | { type: 'SET_SYSTEM_STATUS'; payload: SecurityStatus }
  | { type: 'SET_SCANNING'; payload: boolean }
  | { type: 'SET_IS_MOBILE_DEVICE'; payload: boolean }
  | { type: 'RESET_STATE' };

interface SecurityContextType extends SecurityState {
  startScan: () => void;
  updateNetworkStatus: (status: SecurityStatus) => void;
  updatePasswordStatus: (status: SecurityStatus) => void;
  updateSystemStatus: (status: SecurityStatus) => void;
  calculateOverallScore: () => void;
}

// Initial state
const initialState: SecurityState = {
  overallScore: 0,
  lastScanDate: null,
  networkStatus: 'scanning',
  passwordStatus: 'scanning',
  systemStatus: 'scanning',
  isScanning: false,
  isMobileDevice: false,
};

// Reducer
const securityReducer = (state: SecurityState, action: SecurityAction): SecurityState => {
  switch (action.type) {
    case 'SET_OVERALL_SCORE':
      return { ...state, overallScore: action.payload };
    case 'SET_LAST_SCAN_DATE':
      return { ...state, lastScanDate: action.payload };
    case 'SET_NETWORK_STATUS':
      return { ...state, networkStatus: action.payload };
    case 'SET_PASSWORD_STATUS':
      return { ...state, passwordStatus: action.payload };
    case 'SET_SYSTEM_STATUS':
      return { ...state, systemStatus: action.payload };
    case 'SET_SCANNING':
      return { ...state, isScanning: action.payload };
    case 'SET_IS_MOBILE_DEVICE':
      return { ...state, isMobileDevice: action.payload };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
};

// Create context
const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

// Provider component
export const SecurityProvider = ({ children }: { children: ReactNode }) => {
  const { isMobile } = useMobileDevice();
  const [state, dispatch] = useReducer(securityReducer, initialState);

  // Update mobile device status
  useEffect(() => {
    dispatch({ type: 'SET_IS_MOBILE_DEVICE', payload: isMobile });
  }, [isMobile]);

  // Calculate overall security score based on individual statuses
  const calculateOverallScore = () => {
    const scoreMap = {
      secure: 100,
      warning: 50,
      critical: 0,
      scanning: 0
    };

    const networkScore = scoreMap[state.networkStatus];
    const passwordScore = scoreMap[state.passwordStatus];
    const systemScore = scoreMap[state.systemStatus];

    // Only calculate if we have all scores
    if (state.networkStatus !== 'scanning' && 
        state.passwordStatus !== 'scanning' && 
        state.systemStatus !== 'scanning') {
      const avgScore = Math.round((networkScore + passwordScore + systemScore) / 3);
      dispatch({ type: 'SET_OVERALL_SCORE', payload: avgScore });
    }
  };

  useEffect(() => {
    calculateOverallScore();
  }, [state.networkStatus, state.passwordStatus, state.systemStatus]);

  // Start a new security scan
  const startScan = () => {
    dispatch({ type: 'SET_SCANNING', payload: true });
    dispatch({ type: 'SET_NETWORK_STATUS', payload: 'scanning' });
    dispatch({ type: 'SET_PASSWORD_STATUS', payload: 'scanning' });
    dispatch({ type: 'SET_SYSTEM_STATUS', payload: 'scanning' });
    
    // Simulate scan completion
    setTimeout(() => {
      dispatch({ type: 'SET_LAST_SCAN_DATE', payload: new Date() });
      dispatch({ type: 'SET_SCANNING', payload: false });
    }, 3000);
  };

  // Update individual security statuses
  const updateNetworkStatus = (status: SecurityStatus) => {
    dispatch({ type: 'SET_NETWORK_STATUS', payload: status });
  };

  const updatePasswordStatus = (status: SecurityStatus) => {
    dispatch({ type: 'SET_PASSWORD_STATUS', payload: status });
  };

  const updateSystemStatus = (status: SecurityStatus) => {
    dispatch({ type: 'SET_SYSTEM_STATUS', payload: status });
  };

  // Run initial scan when app loads
  useEffect(() => {
    startScan();
  }, []);

  const value = {
    ...state,
    startScan,
    updateNetworkStatus,
    updatePasswordStatus,
    updateSystemStatus,
    calculateOverallScore,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

// Custom hook for accessing context
export const useSecurity = (): SecurityContextType => {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};
