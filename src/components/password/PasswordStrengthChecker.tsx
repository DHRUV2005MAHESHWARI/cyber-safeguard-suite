
import React, { useState, useEffect } from 'react';
import { Lock, AlertTriangle, Shield, Check } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CardContainer from '@/components/CardContainer';
import StatusBadge from '@/components/StatusBadge';
import { SecurityStatus } from '@/context/SecurityContext';
import { toast } from 'sonner';

interface PasswordStrengthCheckerProps {
  onPasswordCheck?: (score: number) => void;
}

const PasswordStrengthChecker = ({ onPasswordCheck }: PasswordStrengthCheckerProps) => {
  const [password, setPassword] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>('secure');

  // Check password strength whenever password changes
  useEffect(() => {
    if (!password) {
      setScore(0);
      setFeedback([]);
      setSecurityStatus('secure');
      return;
    }
    
    const strength = checkPasswordStrength(password);
    setScore(strength.score);
    setFeedback(strength.feedback);
    setSecurityStatus(strength.status);
    
    if (onPasswordCheck) {
      onPasswordCheck(strength.score);
    }
  }, [password, onPasswordCheck]);

  // Function to check password strength
  const checkPasswordStrength = (pass: string): { score: number; feedback: string[]; status: SecurityStatus } => {
    const feedback = [];
    let score = 0;
    
    // Length check
    if (pass.length >= 12) {
      score += 25;
    } else if (pass.length >= 8) {
      score += 15;
      feedback.push('Consider using a longer password (12+ characters)');
    } else if (pass.length >= 6) {
      score += 5;
      feedback.push('Password is too short (aim for 12+ characters)');
    } else {
      feedback.push('Password is extremely short and easily crackable');
    }
    
    // Character variety checks
    if (/[A-Z]/.test(pass)) {
      score += 20;
    } else {
      feedback.push('Add uppercase letters');
    }
    
    if (/[a-z]/.test(pass)) {
      score += 20;
    } else {
      feedback.push('Add lowercase letters');
    }
    
    if (/[0-9]/.test(pass)) {
      score += 20;
    } else {
      feedback.push('Add numbers');
    }
    
    if (/[^A-Za-z0-9]/.test(pass)) {
      score += 20;
    } else {
      feedback.push('Add special characters (!@#$%^&*)');
    }
    
    // Penalize repetition and sequences
    if (/(.)\1{2,}/.test(pass)) {
      score -= 10;
      feedback.push('Avoid repeated characters (e.g., "aaa")');
    }
    
    if (/(?:abc|bcd|cde|def|efg|123|234|345|456|567|678|789)/.test(pass.toLowerCase())) {
      score -= 10;
      feedback.push('Avoid sequential characters (e.g., "abc", "123")');
    }
    
    // Common passwords check
    const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'welcome', 'password123'];
    if (commonPasswords.includes(pass.toLowerCase())) {
      score = 0;
      feedback.push('This is a commonly used password');
    }
    
    // Cap the score at 100
    score = Math.max(0, Math.min(100, score));
    
    // Determine security status
    let status: SecurityStatus = 'secure';
    if (score < 40) status = 'critical';
    else if (score < 70) status = 'warning';
    
    return { score, feedback, status };
  };

  // Get the score color based on the score
  const getScoreColor = () => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  // Get the appropriate icon based on the score
  const ScoreIcon = () => {
    if (score >= 70) return <Shield className="w-5 h-5 text-green-500" />;
    if (score >= 40) return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    return <Lock className="w-5 h-5 text-red-500" />;
  };

  // Reset password field
  const handleReset = () => {
    setPassword('');
  };

  // Copy recommendations to clipboard
  const handleCopyRecommendations = () => {
    if (feedback.length === 0) {
      toast.info('No recommendations to copy');
      return;
    }
    
    const text = `Password Strength: ${score}%\nRecommendations:\n${feedback.map(f => `- ${f}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    toast.success('Recommendations copied to clipboard');
  };

  return (
    <CardContainer>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary" />
          Password Strength Checker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Enter Password to Check</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a password to check its strength"
              className="mb-2"
            />
            
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <ScoreIcon />
                <span className="font-medium text-sm">Strength: {score}%</span>
              </div>
              <StatusBadge status={securityStatus} />
            </div>
            
            <Progress 
              value={score} 
              className="h-2 w-full"
              indicatorClassName={getScoreColor()}
            />
          </div>
          
          {feedback.length > 0 && (
            <div className="bg-muted/40 rounded-md p-3 space-y-2">
              <h4 className="font-medium text-sm">Recommendations:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {feedback.map((item, index) => (
                  <li key={index} className="flex gap-2 items-start">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={handleReset} className="flex-1">
              Reset
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopyRecommendations} 
              className="flex-1"
              disabled={feedback.length === 0}
            >
              Copy Recommendations
            </Button>
          </div>
        </div>
      </CardContent>
    </CardContainer>
  );
};

export default PasswordStrengthChecker;
