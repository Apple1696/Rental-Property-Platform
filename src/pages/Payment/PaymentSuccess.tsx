import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Get PayOS callback parameters
    const code = searchParams.get('code');
    const orderId = searchParams.get('id');
    const status = searchParams.get('status');
    const orderCode = searchParams.get('orderCode');

    // If we don't have the expected parameters, redirect to home
    if (!code || !orderId || !status || !orderCode) {
      navigate('/');
      return;
    }

    // Verify payment status
    if (code !== '00' || status !== 'PAID') {
      navigate('/payment-failed');
      return;
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Payment Successful!
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Thank you for your payment. Your transaction has been completed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button
            onClick={() => navigate("/my-bookings")}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            View My Bookings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
