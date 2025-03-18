
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CardContainer from '@/components/CardContainer';

interface PerformanceData {
  time: string;
  cpu: number;
  memory: number;
}

interface PerformanceChartProps {
  performanceData: PerformanceData[];
}

const PerformanceChart = ({ performanceData }: PerformanceChartProps) => {
  return (
    <CardContainer className="p-6 md:col-span-2">
      <h3 className="text-lg font-semibold mb-4">Performance History</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={performanceData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" stroke="#888888" fontSize={12} />
            <YAxis stroke="#888888" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                border: 'none'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="cpu" 
              name="CPU Usage" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              dot={{ r: 4 }} 
              activeDot={{ r: 6 }} 
            />
            <Line 
              type="monotone" 
              dataKey="memory" 
              name="Memory Usage" 
              stroke="#a855f7" 
              strokeWidth={2} 
              dot={{ r: 4 }} 
              activeDot={{ r: 6 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardContainer>
  );
};

export default PerformanceChart;
