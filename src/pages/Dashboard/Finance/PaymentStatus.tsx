import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DonutChart } from '@/components/DonutChart';

interface PaymentStatusProps {
  completedPayments: number;
  pendingPayments: number;
  totalPayments?: number; // Optional - will calculate if not provided
}

export function PaymentStatus({
  completedPayments,
  pendingPayments,
  totalPayments
}: PaymentStatusProps) {
  // Calculate total payments if not provided
  const calculatedTotalPayments = totalPayments || completedPayments + pendingPayments;
  
  // Calculate completion rate
  const completionRate = Math.round((completedPayments / calculatedTotalPayments) * 100) || 0;
  
  // Prepare data for donut chart
  const chartData = [
    { name: 'Completed', value: completedPayments, color: 'var(--color-chart-1)' },
    { name: 'Pending', value: pendingPayments, color: 'var(--color-chart-4)' },
  ];
  
  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0 // Vietnamese Dong typically doesn't use decimal places
    }).format(amount);
  };
  
  // Format number with commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  return (
    <div className="grid gap-4 md:grid-cols-7">
      {/* Chart Card - 3 columns */}
      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle className="text-lg">Payment Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center pb-6">
          <div className="h-60 w-60">
            <DonutChart
              data={chartData}
              category="value"
              index="name"
              valueFormatter={(value) => formatCurrency(value)}
              colors={['var(--color-chart-1)', 'var(--color-chart-4)']}
              className="h-full w-full"
            />
          </div>
          
          <div className="mt-6 grid w-full grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[var(--color-chart-1)]" />
              <span className="text-sm">Completed</span>
              <span className="ml-auto font-medium">{formatNumber(completedPayments)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[var(--color-chart-4)]" />
              <span className="text-sm">Pending</span>
              <span className="ml-auto font-medium">{formatNumber(pendingPayments)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Cards - 4 columns */}
      <Card className="md:col-span-4">
        <CardHeader>
          <CardTitle className="text-lg">Payment Completion Rate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Overall completion rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Overall Completion</span>
              <span className="font-medium">{completionRate}%</span>
            </div>
            <Progress 
              value={completionRate} 
              className="h-2"
              color={
                completionRate < 70 ? "destructive" : 
                completionRate < 90 ? "var(--color-chart-4)" : "var(--color-chart-1)"
              }
            />
          </div>
          
          {/* Status badges and details */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1 rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Completed Payments</h4>
                <Badge variant="default" className="bg-[var(--color-chart-1)]">
                  {formatNumber(completedPayments)}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Successfully processed payments</p>
            </div>
            
            <div className="flex flex-col gap-1 rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Pending Payments</h4>
                <Badge variant="outline" className="border-[var(--color-chart-4)] text-[var(--color-chart-4)]">
                  {formatNumber(pendingPayments)}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Awaiting payment processing</p>
            </div>
          </div>
          
          {/* Quick stats */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs text-muted-foreground">Total Transaction Value</p>
              <p className="text-xl font-bold">{formatCurrency(calculatedTotalPayments)}</p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs text-muted-foreground">Average Transaction</p>
              <p className="text-xl font-bold">{formatCurrency(Math.round(calculatedTotalPayments / (completedPayments + pendingPayments)))}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}