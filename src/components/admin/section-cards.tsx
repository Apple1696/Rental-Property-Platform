import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import DashboardService from "@/services/DashboardService"

// Interface for dashboard data
interface DashboardData {
  totalProperties: number;
  newUsers: number;
  totalHosts: number;
  totalReviews: number;
  totalRevenue: number;
  completedPayments: number;
  pendingPayments: number;
  fromDate: string;
  toDate: string;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  userGrowthRate: number;
  revenueGrowthRate: number;
}

export function SectionCards() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get current date and 6 months ago for default date range
  const getCurrentDateAndSixMonthsAgo = () => {
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    // Format dates as YYYY-MM-DD
    const formatDate = (date: Date) => {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };
    
    return {
      fromDate: formatDate(sixMonthsAgo),
      toDate: formatDate(today)
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { fromDate, toDate } = getCurrentDateAndSixMonthsAgo();
        const data = await DashboardService.getDashboardData(fromDate, toDate);
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'VND',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (loading) {
    return <div className="p-6">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {dashboardData ? formatCurrency(dashboardData.totalRevenue) : '$0.00'}
          </CardTitle>
          <CardAction>
            <Badge variant={dashboardData?.revenueGrowthRate && dashboardData.revenueGrowthRate >= 0 ? "outline" : "destructive"}>
              {dashboardData?.revenueGrowthRate && dashboardData.revenueGrowthRate >= 0 ? 
                <IconTrendingUp /> : <IconTrendingDown />}
              {dashboardData?.revenueGrowthRate ? `${dashboardData.revenueGrowthRate}%` : '0%'}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {dashboardData?.revenueGrowthRate && dashboardData.revenueGrowthRate >= 0 ? (
              <>Trending up <IconTrendingUp className="size-4" /></>
            ) : (
              <>Trending down <IconTrendingDown className="size-4" /></>
            )}
          </div>
          <div className="text-muted-foreground">
            Revenue for the last 6 months
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>New Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {dashboardData?.newUsers || 0}
          </CardTitle>
          <CardAction>
            <Badge variant={dashboardData?.userGrowthRate && dashboardData.userGrowthRate >= 0 ? "outline" : "destructive"}>
              {dashboardData?.userGrowthRate && dashboardData.userGrowthRate >= 0 ? 
                <IconTrendingUp /> : <IconTrendingDown />}
              {dashboardData?.userGrowthRate ? `${dashboardData.userGrowthRate}%` : '0%'}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {dashboardData?.userGrowthRate && dashboardData.userGrowthRate >= 0 ? (
              <>User growth trending up <IconTrendingUp className="size-4" /></>
            ) : (
              <>User growth trending down <IconTrendingDown className="size-4" /></>
            )}
          </div>
          <div className="text-muted-foreground">
            New user acquisition rate
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Properties</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {dashboardData?.totalProperties || 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Properties available <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Total listed properties</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Hosts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {dashboardData?.totalHosts || 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Registered hosts <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Active property owners</div>
        </CardFooter>
      </Card>
    </div>
  )
}
