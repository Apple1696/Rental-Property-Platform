import AdminLayout from '@/layouts/AdminLayout';
import { OverviewCards } from './OverviewCards';
import { PaymentStatus } from './PaymentStatus';
import DashboardService from '@/services/DashboardService';
import { useState, useEffect } from 'react';

export default function FinancePage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current date and 30 days ago for default view
        const toDate = new Date().toISOString().split('T')[0];
        const fromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0];

        const data = await DashboardService.getDashboardData(fromDate, toDate);
        setDashboardData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <AdminLayout>
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      ) : !dashboardData ? (
        <div className="flex items-center justify-center py-10">
          <div className="text-muted-foreground">No data available</div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 px-4">
          <h1 className="text-2xl font-bold">Financial Overview</h1>
          <OverviewCards
            totalRevenue={dashboardData.totalRevenue}
            revenueGrowthRate={dashboardData.revenueGrowthRate}
            completedPayments={dashboardData.completedPayments}
            pendingPayments={dashboardData.pendingPayments}
          />
          <section className="mt-6">
            <h2 className="mb-4 text-xl font-semibold">Payment Status</h2>
            <PaymentStatus
              completedPayments={dashboardData.completedPayments}
              pendingPayments={dashboardData.pendingPayments}
            />
          </section>
        </div>
      )}
    </AdminLayout>
  );
}