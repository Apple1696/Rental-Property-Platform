import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Bed,
  Bath,
  Users,
  Clock,
  MapPin,
  Home,
  Star,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import PropertyService, { Property } from '@/services/PropertyService';

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dates, setDates] = useState<Date[] | undefined>();

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      try {
        const data = await PropertyService.getPropertyById(id);
        setProperty(data);
      } catch (err) {
        setError('Failed to fetch property details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error || !property) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error || 'Property not found'}</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Property Title Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
        <div className="flex items-center gap-2 text-gray-600">
          <Star className="w-4 h-4" />
          <span>4.9</span>
          <span>·</span>
          <MapPin className="w-4 h-4" />
          <span>{property.address}, {property.wardId}, {property.districtId}</span>
        </div>
      </div>

      {/* Property Images */}
      <div className="mb-8">
        <AspectRatio ratio={16 / 9}>
          {property.imageUrl ? (
            <img
              src={property.imageUrl}
              alt={property.title}
              className="rounded-lg object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
              No Image Available
            </div>
          )}
        </AspectRatio>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Host and Property Type Info */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl">
                    {property.propertyType} hosted by Host Name
                  </h2>
                  <div className="flex gap-4 text-gray-600 mt-2">
                    <span>{property.maxGuests} guests</span>
                    <span>·</span>
                    <span>{property.bedrooms} bedrooms</span>
                    <span>·</span>
                    <span>{property.beds} beds</span>
                    <span>·</span>
                    <span>{property.bathrooms} bathrooms</span>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Key Features */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What this place offers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  <span>{property.roomType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5" />
                  <span>{property.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-5 h-5" />
                  <span>{property.bathrooms} Bathrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>Up to {property.maxGuests} guests</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>Check-in: {property.checkInTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>Check-out: {property.checkOutTime}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>About this space</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                {property.description}
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Booking Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="flex justify-between items-baseline">
                <span>${property.currentDayPrice} Per Night</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dates && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dates?.length === 0 ? (
                          <span>Pick your dates</span>
                        ) : dates?.length === 1 ? (
                          format(dates[0], "LLL dd, y")
                        ) : dates?.length === 2 ? (
                          <>
                            {format(dates[0], "LLL dd, y")} - {format(dates[1], "LLL dd, y")}
                          </>
                        ) : (
                          <span>Pick your dates</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={new Date()}
                        numberOfMonths={2}
                        selected={dates}
                        onSelect={setDates}
                        className="rounded-md border"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Guests</label>
                  <div className="flex items-center gap-2 border rounded-lg p-2">
                    <Users className="w-4 h-4" />
                    <span>Add guests</span>
                  </div>
                </div>
              </div>
              <Button className="w-full mb-4">Reserve now</Button>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>${property.currentDayPrice} × {dates?.length === 2 ? Math.ceil((dates[1].getTime() - dates[0].getTime()) / (1000 * 60 * 60 * 24)) : 1} night{dates?.length === 2 && Math.ceil((dates[1].getTime() - dates[0].getTime()) / (1000 * 60 * 60 * 24)) > 1 ? 's' : ''}</span>
                  <span>${property.currentDayPrice * (dates?.length === 2 ? Math.ceil((dates[1].getTime() - dates[0].getTime()) / (1000 * 60 * 60 * 24)) : 1)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>${property.serviceFee}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${(property.currentDayPrice * (dates?.length === 2 ? Math.ceil((dates[1].getTime() - dates[0].getTime()) / (1000 * 60 * 60 * 24)) : 1)) + property.serviceFee}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
