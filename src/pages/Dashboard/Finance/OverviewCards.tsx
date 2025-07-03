import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUpIcon, ArrowDownIcon, AlertCircleIcon, CheckCircleIcon, TrendingUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface OverviewCardsProps {
  totalRevenue: number;
  revenueGrowthRate: number;
  completedPayments: number;
  pendingPayments: number;
  totalPayments?: number; // Optional - will calculate if not provided
}

export function OverviewCards({
  totalRevenue,
  revenueGrowthRate,
  completedPayments,
  pendingPayments,
  totalPayments
}: OverviewCardsProps) {
  // Calculate total payments if not provided
  const calculatedTotalPayments = totalPayments || completedPayments + pendingPayments;
  
  // Calculate payment success rate
  const paymentSuccessRate = Math.round((completedPayments / calculatedTotalPayments) * 100) || 0;
  
  // Determine if success rate is concerning (less than 80%)
  const isSuccessRateConcerning = paymentSuccessRate < 80;
  
  // Calculate percentages for completed and pending payments
  const completedPaymentsPercentage = Math.round((completedPayments / calculatedTotalPayments) * 100) || 0;
  const pendingPaymentsPercentage = Math.round((pendingPayments / calculatedTotalPayments) * 100) || 0;
  
    const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0 // Vietnamese Dong typically doesn't use decimal places
    }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Revenue Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-2">
            <h3 className="text-sm font-medium tracking-tight text-muted-foreground">
              Total Revenue
            </h3>
            <div className={cn(
              "flex items-center rounded-md px-2 py-1 text-xs font-medium",
              revenueGrowthRate >= 0 
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            )}>
              {revenueGrowthRate >= 0 ? (
                <ArrowUpIcon className="mr-1 h-3 w-3" />
              ) : (
                <ArrowDownIcon className="mr-1 h-3 w-3" />
              )}
              {Math.abs(revenueGrowthRate)}%
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              vs previous period
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Completed Payments Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-2">
            <h3 className="text-sm font-medium tracking-tight text-muted-foreground">
              Completed Payments
            </h3>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {(completedPayments)}
              </div>
              <div className="flex items-center text-green-600 dark:text-green-400">
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">{completedPaymentsPercentage}%</span>
              </div>
            </div>
            <Progress value={completedPaymentsPercentage} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {completedPaymentsPercentage}% of total payments
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pending Payments Card */}
      <Card className={cn(
        pendingPaymentsPercentage > 30 ? "border-destructive/40" : ""
      )}>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium tracking-tight text-muted-foreground">
                Pending Payments
              </h3>
              {pendingPaymentsPercentage > 30 && (
                <AlertCircleIcon className="h-4 w-4 text-destructive" />
              )}
            </div>
            <div className="text-2xl font-bold">
              {(pendingPayments)}
            </div>
            <Progress 
              value={pendingPaymentsPercentage} 
              className={cn(
                "h-2 mt-2",
                pendingPaymentsPercentage > 30 ? "bg-destructive/20" : ""
              )}
              // Apply styles to the indicator using CSS variables or check Progress component API
            />
            <p className={cn(
              "text-xs mt-1",
              pendingPaymentsPercentage > 30 
                ? "text-destructive font-medium" 
                : "text-muted-foreground"
            )}>
              {pendingPaymentsPercentage}% of total payments
              {pendingPaymentsPercentage > 30 && " - Requires attention"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Success Rate Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-2">
            <h3 className="text-sm font-medium tracking-tight text-muted-foreground">
              Payment Success Rate
            </h3>
            <div className="flex items-center justify-between">
              <div className={cn(
                "text-2xl font-bold",
                isSuccessRateConcerning ? "text-destructive" : ""
              )}>
                {paymentSuccessRate}%
              </div>
              <div className={cn(
                "flex items-center rounded-md px-2 py-1 text-xs font-medium",
                isSuccessRateConcerning
                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              )}>
                <TrendingUpIcon className="mr-1 h-3 w-3" />
                <span>Trend</span>
              </div>
            </div>
            <Progress 
              value={paymentSuccessRate} 
              className={cn(
                "h-2 mt-2",
                isSuccessRateConcerning ? "data-[value]:bg-destructive" : "data-[value]:bg-primary"
              )}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {isSuccessRateConcerning 
                ? "Below target - action needed" 
                : "On target - performing well"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}