import  { useState, useEffect } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { ReviewCards } from './ReviewCards';
import ReviewTable from './ReviewTable';
import DashboardService from '@/services/DashboardService';
import ReviewService from '@/services/ReviewService';
import ReviewChart from './ReviewChart';

export default function ReviewsPage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [reviewsCount, setReviewsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  
  // Mock data for review-specific stats not included in DashboardService
  const [reviewStats] = useState({
    averageRating: 4.6,
    pendingReviews: 24,
    approvedReviews: 412,
    flaggedReviews: 15,
    newReviewsToday: 8,
    newReviewsWeek: 47
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get current date and 30 days ago for default view
        const toDate = new Date().toISOString().split('T')[0];
        const fromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0];

        // Fetch dashboard data
        const data = await DashboardService.getDashboardData(fromDate, toDate);
        setDashboardData(data);
        
        // Fetch reviews count using ReviewService
        const count = await ReviewService.getReviewsCount(fromDate, toDate);
        setReviewsCount(count);
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
          <h1 className="text-2xl font-bold">Reviews Overview</h1>
          <ReviewCards
            totalReviews={reviewsCount}
            averageRating={reviewStats.averageRating}
            pendingReviews={reviewStats.pendingReviews}
            approvedReviews={reviewStats.approvedReviews}
            flaggedReviews={reviewStats.flaggedReviews}
            newReviewsToday={reviewStats.newReviewsToday}
            newReviewsWeek={reviewStats.newReviewsWeek}
          />
          {/* Review Rating Distribution Chart */}
          <section className="mt-6">
            <ReviewChart />
          </section>
          {/* Review Management section with ReviewTable */}
          <section className="mt-6">
            <h2 className="mb-4 text-xl font-semibold">Review Management</h2>
            <ReviewTable />
          </section>
        </div>
      )}
    </AdminLayout>
  );
}