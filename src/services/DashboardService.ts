import api from "../config/api";

// Define the type for dashboard data response
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

// Define the response interface
interface DashboardResponse {
  code: number;
  data: DashboardData;
  message: string;
}

/**
 * Service for handling dashboard-related API requests
 */
class DashboardService {
  /**
   * Fetch dashboard data based on date range
   * @param fromDate - Start date in YYYY-MM-DD format
   * @param toDate - End date in YYYY-MM-DD format
   * @returns Promise with dashboard data
   */
  async getDashboardData(fromDate: string, toDate: string): Promise<DashboardData> {
    try {
      const response = await api.get<DashboardResponse>(
        `/booking-service/api/admin/dashboard`,
        {
          params: { fromDate, toDate }
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export default new DashboardService();
