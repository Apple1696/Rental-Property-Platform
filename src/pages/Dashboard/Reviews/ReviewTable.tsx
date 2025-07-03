import  { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  StarHalf,
  Filter 
} from "lucide-react";
import ReviewService, { Review } from '@/services/ReviewService';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ReviewTable = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ratingFilter, setRatingFilter] = useState<string>("all");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await ReviewService.getAllReviews();
        // Sort reviews by createdAt in descending order (newest first)
        const sortedReviews = [...data].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setReviews(sortedReviews);
        setFilteredReviews(sortedReviews);
        setError(null);
      } catch (err) {
        setError('Failed to load reviews');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Apply filter when rating filter changes
  useEffect(() => {
    if (ratingFilter === "all") {
      setFilteredReviews(reviews);
    } else {
      const rating = parseInt(ratingFilter);
      const filtered = reviews.filter(review => Math.round(review.rating) === rating);
      setFilteredReviews(filtered);
    }
  }, [ratingFilter, reviews]);

  // Render stars based on rating
  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="inline h-4 w-4 fill-primary text-primary" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="inline h-4 w-4 text-primary" />);
    }

    return <div className="flex gap-0.5">{stars}</div>;
  };

  // Handle filter change
  const handleRatingFilterChange = (value: string) => {
    setRatingFilter(value);
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 flex items-center justify-center">
          <div className="text-muted-foreground">Loading reviews...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 flex items-center justify-center">
          <div className="text-destructive">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Reviews</CardTitle>
            <CardDescription className="mt-1.5">
              {filteredReviews.length} {filteredReviews.length === 1 ? 'review' : 'reviews'} found
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={ratingFilter} onValueChange={handleRatingFilterChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No reviews found with the selected filter
                </TableCell>
              </TableRow>
            ) : (
              filteredReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    {renderRating(review.rating)}
                  </TableCell>
                  <TableCell className="font-medium max-w-xs truncate">
                    {review.comment}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {review.createdBy}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {format(new Date(review.createdAt), 'MMM d, yyyy')}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ReviewTable;