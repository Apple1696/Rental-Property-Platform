import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Legend, PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import ReviewService from '@/services/ReviewService';

interface RatingData {
  name: string;
  value: number;
  color: string;
}

export function ReviewChart() {
  const [reviewData, setReviewData] = useState<RatingData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Chart colors from CSS variables
  const chartColors = [
    'var(--color-chart-1)',
    'var(--color-chart-2)',
    'var(--color-chart-3)',
    'var(--color-chart-4)',
    'var(--color-chart-5)'
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const reviews = await ReviewService.getAllReviews();
        
        // Count reviews by rating
        const ratingCounts = [0, 0, 0, 0, 0]; // Ratings 1-5
        
        reviews.forEach(review => {
          if (review.rating >= 1 && review.rating <= 5) {
            ratingCounts[review.rating - 1]++;
          }
        });
        
        // Format data for pie chart
        const chartData = ratingCounts.map((count, index) => ({
          name: `${index + 1} Star${index + 1 > 1 ? 's' : ''}`,
          value: count,
          color: chartColors[index]
        }));
        
        setReviewData(chartData);
      } catch (err) {
        setError('Failed to load review data');
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover p-2 rounded-md shadow-md border border-border">
          <p className="text-sm font-medium">{`${payload[0].name}: ${payload[0].value} reviews`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Reviews by Rating</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading chart data...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64 text-destructive">
            {error}
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reviewData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {reviewData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ReviewChart;