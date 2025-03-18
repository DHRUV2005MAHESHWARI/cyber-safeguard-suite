
import React, { useState, useEffect } from 'react';
import { Zap, RefreshCw, Check, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CardContainer from '@/components/CardContainer';
import AnimatedIcon from '@/components/AnimatedIcon';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface OptimizationItem {
  id: string;
  name: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  completed: boolean;
}

const PerformanceBooster = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [optimizationItems, setOptimizationItems] = useState<OptimizationItem[]>([]);
  
  // Initialize with default optimization items
  useEffect(() => {
    const defaultItems: OptimizationItem[] = [
      {
        id: 'opt-1',
        name: 'Clear Cache Files',
        description: 'Remove temporary files that slow down your system',
        impact: 'high',
        completed: false
      },
      {
        id: 'opt-2',
        name: 'Optimize Startup Programs',
        description: 'Disable unnecessary startup applications',
        impact: 'medium',
        completed: false
      },
      {
        id: 'opt-3',
        name: 'Clean Registry',
        description: 'Fix registry errors and remove obsolete entries',
        impact: 'medium',
        completed: false
      },
      {
        id: 'opt-4',
        name: 'Disk Defragmentation',
        description: 'Reorganize file fragments to improve disk performance',
        impact: 'high',
        completed: false
      },
      {
        id: 'opt-5',
        name: 'Remove Temporary Files',
        description: 'Delete temporary files that consume disk space',
        impact: 'low',
        completed: false
      }
    ];
    
    setOptimizationItems(defaultItems);
  }, []);
  
  // Get impact color
  const getImpactColor = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high': return 'text-green-500';
      case 'medium': return 'text-amber-500';
      case 'low': return 'text-muted-foreground';
    }
  };
  
  // Get impact icon
  const ImpactIcon = ({impact}: {impact: 'high' | 'medium' | 'low'}) => {
    switch (impact) {
      case 'high': return <Zap className={`w-4 h-4 ${getImpactColor(impact)}`} />;
      case 'medium': return <AlertTriangle className={`w-4 h-4 ${getImpactColor(impact)}`} />;
      case 'low': return <Check className={`w-4 h-4 ${getImpactColor(impact)}`} />;
    }
  };
  
  // Get completed percent
  const getCompletedPercent = () => {
    if (optimizationItems.length === 0) return 0;
    const completed = optimizationItems.filter(item => item.completed).length;
    return Math.round((completed / optimizationItems.length) * 100);
  };
  
  // Start optimization
  const startOptimization = () => {
    setIsOptimizing(true);
    setProgress(0);
    
    // Reset completed status
    setOptimizationItems(prev => 
      prev.map(item => ({...item, completed: false}))
    );
    
    // Simulate optimization progress
    let currentItem = 0;
    const interval = setInterval(() => {
      if (currentItem >= optimizationItems.length) {
        clearInterval(interval);
        setIsOptimizing(false);
        toast.success('Performance optimization complete!');
        return;
      }
      
      setProgress(prev => {
        const increment = Math.floor(Math.random() * 15) + 5;
        const newProgress = Math.min(100, prev + increment);
        
        // If progress reaches next threshold, mark item as completed
        if (newProgress >= ((currentItem + 1) / optimizationItems.length) * 100) {
          setOptimizationItems(prev => 
            prev.map((item, idx) => idx === currentItem ? {...item, completed: true} : item)
          );
          currentItem++;
        }
        
        return newProgress;
      });
    }, 800);
  };
  
  return (
    <CardContainer>
      <div className="p-6 pb-4 flex justify-between items-center border-b">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Performance Booster
        </h3>
        <Button 
          onClick={startOptimization} 
          disabled={isOptimizing}
          size="sm"
          className="gap-2"
        >
          {isOptimizing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Optimizing...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              Optimize System
            </>
          )}
        </Button>
      </div>
      
      {isOptimizing ? (
        <div className="p-6">
          <div className="mb-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Optimization progress</span>
              <span>{progress}%</span>
            </div>
            <Progress 
              value={progress} 
              className="h-2"
              indicatorClassName="bg-primary"
            />
          </div>
          
          <div className="space-y-4">
            {optimizationItems.map((item, index) => {
              const isActive = progress >= (index / optimizationItems.length) * 100 &&
                              progress < ((index + 1) / optimizationItems.length) * 100;
              
              return (
                <div 
                  key={item.id} 
                  className={`p-4 rounded-md border ${
                    isActive ? 'bg-muted/50 border-primary/30' : 
                    item.completed ? 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-900' : 
                    'border-muted-foreground/20'
                  } transition-all duration-300`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {item.completed ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : isActive ? (
                        <RefreshCw className="w-5 h-5 text-primary animate-spin" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{item.name}</h4>
                        <span className={`text-xs flex items-center gap-1 ${getImpactColor(item.impact)}`}>
                          <ImpactIcon impact={item.impact} />
                          {item.impact} impact
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="divide-y">
          <div className="p-4 bg-muted/30">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Optimizations</span>
              <div className="flex items-center gap-2">
                <Progress 
                  value={getCompletedPercent()} 
                  className="h-2 w-24"
                  indicatorClassName="bg-green-500"
                />
                <span className="text-sm">{getCompletedPercent()}%</span>
              </div>
            </div>
          </div>
          
          {optimizationItems.length > 0 ? (
            <div className="divide-y">
              {optimizationItems.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {item.completed ? (
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Check className="w-5 h-5 text-green-500" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <X className="w-5 h-5 text-muted-foreground/60" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`text-xs flex items-center gap-1 ${getImpactColor(item.impact)}`}>
                      <ImpactIcon impact={item.impact} />
                      {item.impact} impact
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <AnimatedIcon 
                icon={Zap} 
                size={48}
                className="mx-auto mb-4 p-4 text-primary"
              />
              <h4 className="text-lg font-semibold mb-2">Boost Performance</h4>
              <p className="text-muted-foreground">
                Optimize your system to improve performance and responsiveness.
              </p>
            </div>
          )}
        </div>
      )}
    </CardContainer>
  );
};

export default PerformanceBooster;
