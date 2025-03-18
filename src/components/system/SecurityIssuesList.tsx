
import React from 'react';
import { Shield, AlertTriangle, X } from 'lucide-react';
import CardContainer from '@/components/CardContainer';
import StatusBadge from '@/components/StatusBadge';
import AnimatedIcon from '@/components/AnimatedIcon';
import { Button } from '@/components/ui/button';
import { SecurityIssue } from '@/hooks/useSystemMonitor';
import { SecurityStatus } from '@/context/SecurityContext';

interface SecurityIssuesListProps {
  securityIssues: SecurityIssue[];
  resolveIssue: (id: string) => void;
}

const SecurityIssuesList = ({ securityIssues, resolveIssue }: SecurityIssuesListProps) => {
  const getStatusIcon = (severity: SecurityStatus) => {
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

  return (
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
  );
};

export default SecurityIssuesList;
