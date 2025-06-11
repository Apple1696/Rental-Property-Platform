import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const RegisterConfirm = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Registration Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            Your account has been successfully verified. You can now close this window and log in to your account.
          </p>
          {/* <Button
            onClick={() => window.close()}
            className="w-full"
          >
            Close Window
          </Button> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterConfirm;
