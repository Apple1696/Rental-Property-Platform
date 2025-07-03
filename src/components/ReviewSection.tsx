import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Star, StarHalf, User, Mail } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import ReviewService, { Review, CreateReviewRequest } from '@/services/ReviewService';

interface ReviewSectionProps {
  propertyId: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ propertyId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);



  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const reviewsData = await ReviewService.getPropertyReviews(propertyId);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        toast.error('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [propertyId]);

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      setIsSubmitting(true);
      const reviewData: CreateReviewRequest = {
        propertyId,
        comment,
        rating
      };
      const response = await ReviewService.createReview(reviewData);
      const newReview = response;
      setReviews([...reviews, newReview]);
      setComment('');
      setRating(0);
      toast.success('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (value: number, interactive = false) => {
    const stars = [];
    const activeValue = interactive ? hoverRating || rating : value;

    for (let i = 1; i <= 5; i++) {
      if (interactive) {
        stars.push(
          <button
            key={i}
            type="button"
            className="text-amber-500 hover:scale-110 transition-transform"
            onMouseEnter={() => setHoverRating(i)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(i)}
          >
            {i <= activeValue ? (
              <Star className="w-6 h-6 fill-amber-500" />
            ) : (
              <Star className="w-6 h-6" />
            )}
          </button>
        );
      } else {
        stars.push(
          <span key={i} className="text-amber-500">
            {i <= activeValue ? (
              <Star className="w-5 h-5 fill-amber-500" />
            ) : i - 0.5 <= activeValue ? (
              <StarHalf className="w-5 h-5 fill-amber-500" />
            ) : (
              <Star className="w-5 h-5" />
            )}
          </span>
        );
      }
    }
    return stars;
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const getInitials = (email: string) => {
    if (!email) return '?';
    // Get first letter of name part of email
    const namePart = email.split('@')[0];
    return namePart.charAt(0).toUpperCase();
  };

  const formatEmail = (email: string) => {
    if (!email) return 'Guest';

    // Show only the first part of the email
    const namePart = email.split('@')[0];
    // Capitalize first letter
    return namePart.charAt(0).toUpperCase() + namePart.slice(1);
  };

  const averageRating = calculateAverageRating();

  return (
    <div className="my-8 w-full">
      <Card className="shadow-lg border-border">
        <CardHeader className="bg-card text-card-foreground">
          <CardTitle className="text-2xl flex items-center gap-3">
            Reviews
            {reviews.length > 0 && (
              <div className="flex items-center text-lg">
                <div className="flex">{renderStars(averageRating)}</div>
                <span className="ml-2 font-medium">
                  {averageRating.toFixed(1)} ({reviews.length})
                </span>
              </div>
            )}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Share your experience with this property
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 bg-background">
          {/* Write a review section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-lg font-medium text-foreground">Add Your Review</div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground mr-2">Your Rating:</span>
                <div className="flex gap-1">{renderStars(rating, true)}</div>
              </div>
            </div>
            <Textarea
              placeholder="Share your thoughts about this property..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-24 bg-input text-foreground"
            />
            <Button
              onClick={handleSubmitReview}
              disabled={isSubmitting || rating === 0}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>

          <Separator className="bg-border" />

          {/* Reviews list */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="space-y-2">
                  <div className="flex items-start gap-3">
                    <Avatar className="border border-border">
                      <AvatarFallback className="bg-accent text-accent-foreground">
                        {getInitials(review.createdBy)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center">
                        <div className="font-medium text-foreground flex items-center gap-1">
                          {formatEmail(review.createdBy)}
                        </div>
                        <Separator orientation="vertical" className="mx-2 h-4 bg-border" />
                        <div className="flex">{renderStars(review.rating)}</div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {review.createdAt && format(parseISO(review.createdAt), 'PPP')}
                      </p>
                      <p className="mt-2 text-foreground">{review.comment}</p>
                    </div>
                  </div>
                  <Separator className="my-4 bg-border" />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No reviews yet. Be the first to share your experience!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewSection;