import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, XCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const PaymentFail = () => {
  const navigate = useNavigate();

  return (
    <div className="container max-w-lg mx-auto py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <Card className="w-full border-2 border-destructive/20 shadow-lg">
          <CardHeader className="text-center pb-6">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="flex justify-center mb-6"
            >
              <XCircle className="h-20 w-20 text-destructive" />
            </motion.div>
            <CardTitle className="text-3xl font-bold text-destructive">
              Payment Failed
            </CardTitle>
            <CardDescription className="text-lg mt-3">
              Your payment could not be processed
            </CardDescription>
          </CardHeader>

          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              We encountered an issue with your payment. Please try again or use a different payment method.
            </p>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 items-center">
            {/* <Button 
              size="lg"
              className="w-full sm:w-auto px-8"
              onClick={() => navigate("/checkout")}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Try again
            </Button> */}
            
            <Button 
              variant="ghost" 
              className="flex items-center gap-2"
              onClick={() => navigate("/")}
            >
              <ArrowLeft size={16} />
              Return to home
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentFail;