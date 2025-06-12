import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import PropertyService, { Property } from '@/services/PropertyService';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

const daysOfWeek = {
  2: 'Monday',
  3: 'Tuesday',
  4: 'Wednesday',
  5: 'Thursday',
  6: 'Friday',
  7: 'Saturday',
  8: 'Sunday',
};

const ViewDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        if (!id) return;
        const data = await PropertyService.getPropertyById(id);
        setProperty(data);
      } catch (error) {
        toast.error('Failed to fetch property details');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 max-w-5xl">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto py-8 max-w-5xl">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Property not found</h2>
          <Button 
            variant="link" 
            onClick={() => navigate('/hosting')}
            className="mt-4"
          >
            Back to Properties
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <Toaster />
      
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-4"
          onClick={() => navigate('/hosting')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Properties
        </Button>
        <h1 className="text-2xl font-semibold">Property Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Property Image */}
        <div className="col-span-full">
          <img 
            src={property.imageUrl} 
            alt={property.title}
            className="w-full h-[400px] object-cover rounded-lg"
          />
        </div>

        {/* Basic Information */}
        <div className="space-y-6 col-span-full bg-card p-6 rounded-lg shadow-sm">
          <div>
            <h2 className="text-xl font-semibold mb-2">{property.title}</h2>
            <p className="text-muted-foreground">{property.description}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Property Type</p>
              <p className="font-medium">{property.propertyType}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Room Type</p>
              <p className="font-medium">{property.roomType}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Max Guests</p>
              <p className="font-medium">{property.maxGuests}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Service Fee</p>
              <p className="font-medium">${property.serviceFee}</p>
            </div>
          </div>
        </div>

        {/* Room Details */}
        <div className="space-y-4 bg-card p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold">Room Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Bedrooms</p>
              <p className="font-medium">{property.bedrooms}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Beds</p>
              <p className="font-medium">{property.beds}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bathrooms</p>
              <p className="font-medium">{property.bathrooms}</p>
            </div>
          </div>
        </div>

        {/* Check-in/out Times */}
        <div className="space-y-4 bg-card p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold">Check-in/out Times</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Check-in Time</p>
              <p className="font-medium">{property.checkInTime}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Check-out Time</p>
              <p className="font-medium">{property.checkOutTime}</p>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="col-span-full bg-card p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">{property.address}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Zip Code</p>
              <p className="font-medium">{property.zipCode}</p>
            </div>
          </div>
        </div>

        {/* Day Prices */}
        <div className="col-span-full bg-card p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Pricing</h3>
          
          {/* Current Day Price */}
          <div className="mb-6">
            <h4 className="text-md font-medium mb-2">Current Day Price</h4>
            <div className="inline-block bg-primary/10 text-primary font-semibold px-4 py-2 rounded-lg">
              ${property.currentDayPrice}
            </div>
          </div>

          {/* Day-specific Prices */}
          <div>
            <h4 className="text-md font-medium mb-4">Day-specific Prices</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(property.dayPrices || []).map((dayPrice) => (
                <div 
                  key={dayPrice.dayOfWeek} 
                  className="p-4 bg-muted/20 rounded-lg border border-border/50"
                >
                  <p className="text-sm font-medium mb-1">
                    {daysOfWeek[dayPrice.dayOfWeek as keyof typeof daysOfWeek]}
                  </p>
                  <p className="text-lg font-semibold text-primary">
                    ${dayPrice.price}
                  </p>
                </div>
              ))}
              {(!property.dayPrices || property.dayPrices.length === 0) && (
                <div className="col-span-full text-center py-4 text-muted-foreground">
                  No day-specific prices set
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDetail;
