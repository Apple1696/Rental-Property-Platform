import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Calendar, Users, CreditCard, Wallet, Loader2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import PropertyService, { BookingRequest } from '@/services/PropertyService';

interface CheckoutProps {
  propertyId: string;
  propertyImage: string;
  propertyTitle: string;
  checkInDate: Date;
  checkOutDate: Date;
  guests: number;
  pricePerNight: number;
  serviceFee: number;
  totalNights: number;
  subtotalAmount: number;
  vat: number;
  totalAmount: number;
}

const CheckOut = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails = location.state as CheckoutProps;
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('card');

  const handlePayment = async (method: string) => {
    if (!bookingDetails) return;

    try {
      setIsProcessing(true);

      const bookingData: BookingRequest = {
        propertyId: bookingDetails.propertyId,
        checkInDate: format(bookingDetails.checkInDate, 'dd-MM-yyyy'),
        checkOutDate: format(bookingDetails.checkOutDate, 'dd-MM-yyyy'),
        guestsCount: bookingDetails.guests,
        totalNight: bookingDetails.totalNights,
        pricePerNight: bookingDetails.pricePerNight,
        vat: bookingDetails.vat,
        totalAmount: bookingDetails.totalAmount,
        subtotalAmount: bookingDetails.subtotalAmount || null,
        specialRequests: null,
        paymentMethod: 'PAYOS'
      };

      const response = await PropertyService.createBooking(bookingData);
      
      if (response.code === 201 && response.data.paymentUrl) {
        // Redirect to PayOS payment URL
        window.location.href = response.data.paymentUrl;
      } else {
        toast.error('Failed to initialize payment. Please try again.');
      }
    } catch (error) {
      console.error('Payment initialization failed:', error);
      toast.error('Failed to initialize payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!bookingDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid checkout session</h2>
          <p className="text-gray-600 mb-4">Please start your booking process again.</p>
          <Button onClick={() => navigate('/properties')}>
            Browse Properties
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen container mx-auto py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Payment Methods */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  defaultValue="card" 
                  className="space-y-4"
                  value={selectedMethod}
                  onValueChange={setSelectedMethod}
                >
                  <div className="flex items-center space-x-4 rounded-lg border p-4 cursor-pointer hover:bg-accent">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Credit/Debit Card</p>
                          <p className="text-sm text-muted-foreground">Pay securely with your card</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-4 rounded-lg border p-4 cursor-pointer hover:bg-accent">
                    <RadioGroupItem value="ewallet" id="ewallet" />
                    <Label htmlFor="ewallet" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">E-Wallet</p>
                          <p className="text-sm text-muted-foreground">Pay with your preferred e-wallet</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                <Button 
                  className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => handlePayment(selectedMethod)}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Proceed to Payment'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Summary */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Property Preview */}
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden">
                    <img
                      src={bookingDetails.propertyImage}
                      alt={bookingDetails.propertyTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{bookingDetails.propertyTitle}</h3>
                  </div>
                </div>

                <Separator />

                {/* Booking Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Check-in</p>
                      <p className="font-medium">{format(bookingDetails.checkInDate, 'PPP')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Check-out</p>
                      <p className="font-medium">{format(bookingDetails.checkOutDate, 'PPP')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Guests</p>
                      <p className="font-medium">{bookingDetails.guests} guests</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      ${bookingDetails.pricePerNight} × {bookingDetails.totalNights} nights
                    </span>
                    <span>${bookingDetails.pricePerNight * bookingDetails.totalNights}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service fee</span>
                    <span>${bookingDetails.serviceFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">VAT</span>
                    <span>${bookingDetails.vat}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${bookingDetails.totalAmount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
