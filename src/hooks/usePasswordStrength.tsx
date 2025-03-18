
import { useState, useEffect } from 'react';
import { useSecurity, SecurityStatus } from '@/context/SecurityContext';

export interface PasswordEntry {
  id: string;
  service: string;
  username: string;
  password: string;
  strength: number;
  status: SecurityStatus;
  lastUpdated: Date;
}

export const usePasswordStrength = () => {
  const { isScanning, updatePasswordStatus } = useSecurity();
  const [passwordEntries, setPasswordEntries] = useState<PasswordEntry[]>([]);
  const [scanComplete, setScanComplete] = useState(false);

  // Simulate password scan
  useEffect(() => {
    if (isScanning) {
      setScanComplete(false);
      
      // Simulate scanning delay
      const timer = setTimeout(() => {
        const mockPasswords: PasswordEntry[] = [
          {
            id: '1',
            service: 'Email Account',
            username: 'user@example.com',
            password: '●●●●●●●●●●●●',
            strength: 85,
            status: 'secure',
            lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
          },
          {
            id: '2',
            service: 'Banking',
            username: 'financial_user',
            password: '●●●●●●●●●●●●●●●',
            strength: 95,
            status: 'secure',
            lastUpdated: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
          },
          {
            id: '3',
            service: 'Social Media',
            username: 'social_user',
            password: '●●●●●●',
            strength: 45,
            status: 'warning',
            lastUpdated: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) // 180 days ago
          },
          {
            id: '4',
            service: 'Shopping',
            username: 'shop_user',
            password: '●●●●',
            strength: 20,
            status: 'critical',
            lastUpdated: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // 365 days ago
          },
        ];
        
        setPasswordEntries(mockPasswords);
        setScanComplete(true);
        
        // Determine overall password security
        const criticalPasswords = mockPasswords.filter(p => p.status === 'critical').length;
        const warningPasswords = mockPasswords.filter(p => p.status === 'warning').length;
        
        if (criticalPasswords > 0) {
          updatePasswordStatus('critical');
        } else if (warningPasswords > 0) {
          updatePasswordStatus('warning');
        } else {
          updatePasswordStatus('secure');
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isScanning, updatePasswordStatus]);

  // Generate a secure password
  const generatePassword = (length = 16, includeSymbols = true) => {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let chars = uppercaseChars + lowercaseChars + numberChars;
    if (includeSymbols) chars += symbolChars;
    
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    
    return password;
  };

  // Check password strength
  const checkPasswordStrength = (password: string): number => {
    if (!password) return 0;
    
    let score = 0;
    
    // Length check
    if (password.length >= 12) score += 25;
    else if (password.length >= 8) score += 15;
    else if (password.length >= 6) score += 5;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) score += 20; // uppercase
    if (/[a-z]/.test(password)) score += 20; // lowercase
    if (/[0-9]/.test(password)) score += 20; // numbers
    if (/[^A-Za-z0-9]/.test(password)) score += 20; // special characters
    
    // Penalize repetition and sequences
    if (/(.)\1{2,}/.test(password)) score -= 10; // repeating characters
    if (/(?:abc|bcd|cde|def|efg|123|234|345|456|567|678|789)/.test(password.toLowerCase())) {
      score -= 10; // common sequences
    }
    
    // Cap the score at 100
    return Math.max(0, Math.min(100, score));
  };

  // Get status from score
  const getStatusFromScore = (score: number): SecurityStatus => {
    if (score >= 70) return 'secure';
    if (score >= 40) return 'warning';
    return 'critical';
  };

  // Add a new password entry
  const addPasswordEntry = (service: string, username: string, password: string) => {
    const strength = checkPasswordStrength(password);
    const status = getStatusFromScore(strength);
    
    const newEntry: PasswordEntry = {
      id: Date.now().toString(),
      service,
      username,
      password: '●'.repeat(password.length), // Mask the actual password
      strength,
      status,
      lastUpdated: new Date()
    };
    
    setPasswordEntries([...passwordEntries, newEntry]);
    
    // Update overall status
    const allEntries = [...passwordEntries, newEntry];
    const criticalPasswords = allEntries.filter(p => p.status === 'critical').length;
    const warningPasswords = allEntries.filter(p => p.status === 'warning').length;
    
    if (criticalPasswords > 0) {
      updatePasswordStatus('critical');
    } else if (warningPasswords > 0) {
      updatePasswordStatus('warning');
    } else {
      updatePasswordStatus('secure');
    }
  };

  return { 
    passwordEntries, 
    scanComplete,
    generatePassword,
    checkPasswordStrength,
    getStatusFromScore,
    addPasswordEntry
  };
};
