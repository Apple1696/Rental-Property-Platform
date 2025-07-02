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
}

export default ReviewService;