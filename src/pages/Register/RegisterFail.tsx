// import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";
// import { Link } from "react-router-dom";

const RegisterFail = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold">Registration Failed</CardTitle>
          <CardDescription className="mt-2">
            We encountered an error while verifying your registration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            This could be because the verification link has expired or is invalid.
            Please try registering again or contact support if the problem persists.
          </p>
          {/* <div className="flex justify-center gap-4">
            <Button variant="default" asChild>
              <Link to="/register">Register Again</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/">Go to Home</Link>
            </Button>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterFail;
