import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PaymentFail = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Payment Failed
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            We're sorry, but your payment could not be processed. Please try again or contact support if the problem persists.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center gap-4">
          <Button
            onClick={() => navigate(-1)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Try Again
          </Button>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="border-border hover:bg-accent hover:text-accent-foreground"
          >
            Return Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentFail;
