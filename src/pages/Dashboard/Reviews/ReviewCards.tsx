import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  StarIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  AlertCircleIcon,
  TrendingUpIcon,
  UserIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ReviewCardsProps {
  totalReviews: number;
  averageRating: number;
  pendingReviews: number;
  approvedReviews: number;
  flaggedReviews: number;
  newReviewsToday: number;
  newReviewsWeek: number;
}

export function ReviewCards({
  totalReviews,
  averageRating,
  pendingReviews,
  approvedReviews,
  flaggedReviews,
  newReviewsToday,
  newReviewsWeek
}: ReviewCardsProps) {
  // Calculate percentages for status distribution
  const pendingPercentage = Math.round((pendingReviews / totalReviews) * 100) || 0;
  const approvedPercentage = Math.round((approvedReviews / totalReviews) * 100) || 0;
  const flaggedPercentage = Math.round((flaggedReviews / totalReviews) * 100) || 0;

  // Format number with commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };
  
  // Generate star rating display
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={cn(
              "h-4 w-4 mr-0.5",
              i < fullStars ? "text-[var(--color-chart-5)] fill-[var(--color-chart-5)]" : 
              (i === fullStars && hasHalfStar) ? "text-[var(--color-chart-5)]" : 
              "text-muted stroke-muted-foreground"
            )}
          />
        ))}
      </div>
    );
  };

  return (
     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Reviews Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-2">
            <h3 className="text-sm font-medium tracking-tight text-muted-foreground">
              Total Reviews
            </h3>
            <div className="flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              <UserIcon className="mr-1 h-3 w-3" />
              <span>Last 30 Days</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold">
              {formatNumber(totalReviews)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total customer feedback received
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Average Rating Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-2">
            <h3 className="text-sm font-medium tracking-tight text-muted-foreground">
              Average Rating
            </h3>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">
                {averageRating.toFixed(1)}
                <span className="text-base font-medium text-muted-foreground">/5.0</span>
              </div>
              <div className="flex items-center text-[var(--color-chart-5)]">
                {renderStars(averageRating)}
              </div>
            </div>
            <Progress 
              value={averageRating * 20} 
              className={cn(
                "h-2 mt-2",
                "[&>div]:bg-[var(--color-chart-1)]",
                averageRating < 4 && averageRating >= 3 && "[&>div]:bg-[var(--color-chart-4)]",
                averageRating < 3 && "[&>div]:bg-destructive"
              )}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Based on {formatNumber(totalReviews)} reviews
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Review Status Distribution */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-medium tracking-tight text-muted-foreground">
              Review Status
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 mr-2 text-[var(--color-chart-1)]" />
                  <span className="text-sm">Approved</span>
                </div>
                <Badge variant="secondary" className="font-medium">
                  {formatNumber(approvedReviews)}
                </Badge>
              </div>
              <Progress value={approvedPercentage} className="h-1.5 [&>div]:bg-[var(--color-chart-1)]" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-2 text-[var(--color-chart-4)]" />
                  <span className="text-sm">Pending</span>
                </div>
                <Badge variant="secondary" className="font-medium">
                  {formatNumber(pendingReviews)}
                </Badge>
              </div>
              <Progress value={pendingPercentage} className="h-1.5 [&>div]:bg-[var(--color-chart-4)]" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertCircleIcon className="h-4 w-4 mr-2 text-destructive" />
                  <span className="text-sm">Flagged</span>
                </div>
                <Badge variant="secondary" className="font-medium">
                  {formatNumber(flaggedReviews)}
                </Badge>
              </div>
              <Progress value={flaggedPercentage} className="h-1.5 [&>div]:bg-destructive" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-3">
            <h3 className="text-sm font-medium tracking-tight text-muted-foreground">
              Recent Activity
            </h3>
            <div className="flex flex-col space-y-4 mt-2">
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUpIcon className="mr-2 h-4 w-4 text-[var(--color-chart-1)]" />
                    <span className="text-sm">Last 24 hours</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {formatNumber(newReviewsToday)}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1 ml-6">
                  New reviews today
                </div>
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUpIcon className="mr-2 h-4 w-4 text-[var(--color-chart-4)]" />
                    <span className="text-sm">Last 7 days</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {formatNumber(newReviewsWeek)}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1 ml-6">
                  New reviews this week
                </div>
              </div>
              
              <div className="rounded-lg bg-muted p-3 mt-2">
                <div className="text-xs text-muted-foreground">
                  Response Rate
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-medium">
                    {Math.round((approvedReviews + flaggedReviews) / totalReviews * 100)}%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Average response time: 8h
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}