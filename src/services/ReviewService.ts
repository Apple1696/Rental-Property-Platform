import api from '../config/api';

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdBy: string;
  createdAt: string;
}

export interface ReviewResponse {
  code: number;
  data: Review[];
  message: string;
}

export interface CreateReviewRequest {
  propertyId: string;
  comment: string;
  rating: number;
}

export interface CreateReviewResponse {
  code: number;
  data: Review;
  message: string;
}

export interface ReviewCountResponse {
  code: number;
  data: number;
  message: string;
}

export interface ReviewCountRequest {
  fromDate: string; // ISO format date string
  toDate: string;   // ISO format date string
}

class ReviewService {
  // ...existing code...

  /**
   * Gets the total count of reviews within a specified date range
   * @param params Object containing fromDate and toDate in ISO string format
   * @returns Promise with the count of reviews
   */
  static async getReviewsCount(params: ReviewCountRequest): Promise<number> {
    try {
      const { fromDate, toDate } = params;
      const response = await api.get<ReviewCountResponse>(
        'user-service/api/review/admin/reviews/count',
        { params: { fromDate, toDate } }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching review count:', error);
      throw error;
    }
  }
}

export default ReviewService;