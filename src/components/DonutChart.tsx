import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { cn } from "@/lib/utils";

interface DonutChartProps {
  data: Array<{ name: string; value: number; color?: string }>;
  index: string;
  category: string;
  colors?: string[];
  valueFormatter?: (value: number) => string;
  className?: string;
}

export function DonutChart({
  data,
  index,
  category,
  colors,
  valueFormatter = (value) => `${value}`,
  className,
}: DonutChartProps) {
  return (
    <div className={cn("w-full h-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            innerRadius="60%"
            outerRadius="80%"
            dataKey={category}
            nameKey={index}
          >
            {data.map((entry, idx) => (
              <Cell 
                key={`cell-${idx}`} 
                fill={entry.color || colors?.[idx % (colors?.length || 1)] || `hsl(${idx * 45}, 70%, 50%)`} 
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={valueFormatter as any} 
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--background)'
            }}
          />
          <Legend 
            formatter={(value) => <span className="text-sm">{value}</span>}
            iconSize={8}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}