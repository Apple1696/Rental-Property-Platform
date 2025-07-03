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

class ReviewService {
  /**
   * Fetches all reviews for a specific property
   * @param propertyId The ID of the property to get reviews for
   * @returns Promise with an array of reviews
   */
  static async getPropertyReviews(propertyId: string): Promise<Review[]> {
    try {
      const response = await api.get<ReviewResponse>(`user-service/api/review/property/${propertyId}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching reviews for property ${propertyId}:`, error);
      throw error;
    }
  }

  /**
   * Creates a new review for a property
   * @param reviewData The review data to submit
   * @returns Promise with the created review
   */
  static async createReview(reviewData: CreateReviewRequest): Promise<Review> {
    try {
      const response = await api.post<CreateReviewResponse>('user-service/api/review', reviewData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  /**
   * Fetches all reviews
   * @returns Promise with an array of all reviews
   */
  static async getAllReviews(): Promise<Review[]> {
    try {
      const response = await api.get<ReviewResponse>('user-service/api/review');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching all reviews:', error);
      throw error;
    }
  }

  /**
   * Gets the count of reviews within a date range
   * @param fromDate The start date in ISO format (YYYY-MM-DD)
   * @param toDate The end date in ISO format (YYYY-MM-DD)
   * @returns Promise with the count of reviews
   */
  static async getReviewsCount(fromDate: string, toDate: string): Promise<number> {
    try {
      const response = await api.get<ReviewCountResponse>(
        'user-service/api/review/admin/reviews/count',
        { params: { fromDate, toDate } }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching reviews count:', error);
      throw error;
    }
  }
}

export default ReviewService;