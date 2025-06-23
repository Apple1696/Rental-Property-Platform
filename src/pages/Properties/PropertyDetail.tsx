import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Bed, Bath, Clock, Star, Wifi, Car, Coffee } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { toast } from 'sonner';
import PropertyService, { Property, BookingRequest } from '../../services/PropertyService';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [guests, setGuests] = useState(1);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const propertyData = await PropertyService.getPropertyById(id);
        setProperty(propertyData);
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const getDayOfWeekPrice = (dayOfWeek: number) => {
    if (!property) return 0;
    if (!property.dayPrices) return property.currentDayPrice;
    
    const dayPrice = property.dayPrices.find(dp => dp.dayOfWeek === dayOfWeek);
    return dayPrice ? dayPrice.price : property.currentDayPrice;
  };

  const calculateTotalPrice = () => {
    if (!checkInDate || !checkOutDate || !property) return 0;
    
    const days = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    let totalPrice = 0;
    
    for (let i = 0; i < days; i++) {
      const currentDate = new Date(checkInDate);
      currentDate.setDate(checkInDate.getDate() + i);
      const dayOfWeek = currentDate.getDay();
      totalPrice += getDayOfWeekPrice(dayOfWeek);
    }
    
    return totalPrice;
  };

  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi') || amenityLower.includes('internet')) return <Wifi className="w-4 h-4" />;
    if (amenityLower.includes('parking') || amenityLower.includes('car')) return <Car className="w-4 h-4" />;
    if (amenityLower.includes('pool') || amenityLower.includes('swimming')) return <Star className="w-4 h-4" />;
    if (amenityLower.includes('coffee') || amenityLower.includes('kitchen')) return <Coffee className="w-4 h-4" />;
    return <Star className="w-4 h-4" />;
  };

  const handleBooking = async () => {
    if (!property || !checkInDate || !checkOutDate) return;

    const totalNights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = calculateTotalPrice();
    const vat = 10; // Assuming 10% VAT
    const subtotal = totalPrice + property.serviceFee;
    const tax =subtotal*0.1;
    const total = subtotal + tax;

    navigate('/payment/checkout', {
      state: {
        propertyId: property.id,
        propertyImage: property.imageUrl,
        propertyTitle: property.title,
        checkInDate,
        checkOutDate,
        guests,
        pricePerNight: property.currentDayPrice,
        serviceFee: property.serviceFee,
        totalNights,
        subtotalAmount: subtotal,
        vat,
        totalAmount: total,
        paymentMethod: 'PAYOS'
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property not found</h2>
          <p className="text-gray-600">The property you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const totalPrice = calculateTotalPrice();
  const nights = checkInDate && checkOutDate ? 
    Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="w-full px-4 lg:px-8 pt-6">
        <div className="w-full h-96 lg:h-[500px] relative overflow-hidden">
          <img
            src={property.imageUrl}
            alt={property.title}
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              e.currentTarget.src = '/images/HomePage/LuxuryApartment.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30 rounded-lg" />
          <div className="absolute bottom-6 left-6 text-white">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">{property.title}</h1>
            <div className="flex items-center text-lg">
              <MapPin className="w-5 h-5 mr-2" />
              {property.address}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-7 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">{property.title}</CardTitle>
                    <div className="flex items-center gap-4 text-gray-600 mb-4">
                      <Badge variant="secondary" className="text-sm">
                        {property.propertyType}
                      </Badge>
                      <Badge variant="outline" className="text-sm">
                        {property.roomType}
                      </Badge>
                      <Badge 
                        variant={property.status === 'ACTIVE' ? 'default' : 'destructive'}
                        className="text-sm"
                      >
                        {property.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Property Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Guests</p>
                      <p className="font-semibold">{property.maxGuests}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Bed className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Bedrooms</p>
                      <p className="font-semibold">{property.bedrooms}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Bed className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Beds</p>
                      <p className="font-semibold">{property.beds}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Bath className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Bathrooms</p>
                      <p className="font-semibold">{property.bathrooms}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <h3 className="text-xl font-semibold mb-3">About this place</h3>
                  <p className="text-gray-700 leading-relaxed">{property.description}</p>
                </div>

                <Separator />

                {/* Check-in/out Times */}
                <div>
                  <h3 className="text-xl font-semibold mb-3">Check-in & Check-out</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Clock className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">Check-in</p>
                        <p className="font-semibold">{property.checkInTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Clock className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="text-sm text-gray-600">Check-out</p>
                        <p className="font-semibold">{property.checkOutTime}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Amenities */}
                {property.amenities && property.amenities.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Amenities</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {property.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2 p-2">
                          {getAmenityIcon(amenity.name || amenity)}
                          <span className="text-gray-700">{amenity.name || amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Categories */}
                {property.categories && property.categories.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Categories</h3>
                      <div className="flex flex-wrap gap-2">
                        {property.categories.map((category, index) => (
                          <Badge key={index} variant="outline" className="text-sm">
                            {category.name || category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg sticky top-8">
              <CardHeader>
                <CardTitle className="text-2xl">
                  <span className="text-3xl font-bold">{property.currentDayPrice} VND</span>
                  <span className="text-lg text-gray-600 font-normal"> / night</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Date Selection */}
                <div className="grid grid-cols-2 gap-2">
                  <Popover>
                    <PopoverTrigger>
                      <div>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <Calendar className="mr-2 h-4 w-4" />
                          {checkInDate ? format(checkInDate, "PPP") : "Check-in"}
                        </Button>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={checkInDate}
                        onSelect={setCheckInDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger>
                      <div>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <Calendar className="mr-2 h-4 w-4" />
                          {checkOutDate ? format(checkOutDate, "PPP") : "Check-out"}
                        </Button>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={checkOutDate}
                        onSelect={setCheckOutDate}
                        disabled={(date) => date < (checkInDate || new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Guests Selection */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Guests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      disabled={guests <= 1}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{guests}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setGuests(Math.min(property.maxGuests, guests + 1))}
                      disabled={guests >= property.maxGuests}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Price Breakdown */}
                {checkInDate && checkOutDate && (
                  <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between">
                      <span>{property.currentDayPrice} VND × {nights} nights</span>
                      <span>{totalPrice} VND</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service fee</span>
                      <span>{property.serviceFee} VND</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{totalPrice + property.serviceFee} VND</span>
                    </div>
                  </div>
                )}

                {/* Reserve Button */}
                <Button 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-lg"
                  disabled={!checkInDate || !checkOutDate || guests > property.maxGuests || isBooking}
                  onClick={handleBooking}
                >
                  {isBooking ? 'Processing...' : 'Reserve Now'}
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  You won't be charged yet
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;