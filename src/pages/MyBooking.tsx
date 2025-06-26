import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar, Clock, Home, Users } from "lucide-react";
import PropertyService, { MyBooking } from "@/services/PropertyService";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const statusColorMap: Record<string, { color: string; label: string }> = {
  PENDING: { color: "bg-yellow-500", label: "Pending" },
  CONFIRMED: { color: "bg-green-500", label: "Confirmed" },
  CANCELLED: { color: "bg-red-500", label: "Cancelled" },
  COMPLETED: { color: "bg-blue-500", label: "Completed" },
};

const BookingCard = ({ booking }: { booking: MyBooking }) => {
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const propertyData = await PropertyService.getPropertyById(booking.propertyId);
        setProperty(propertyData);
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [booking.propertyId]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="gap-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/4" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const status = statusColorMap[booking.bookingStatus] || { 
    color: "bg-gray-500", 
    label: booking.bookingStatus 
  };

  return (
    <Card className="w-full transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            {property?.title || "Property Title"}
          </CardTitle>
          <Badge className={`${status.color} text-white`}>
            {status.label}
          </Badge>
        </div>
        <CardDescription>
          {property?.address || "Property Address"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {format(new Date(booking.checkInDate), "MMM dd, yyyy")} -{" "}
              {format(new Date(booking.checkOutDate), "MMM dd, yyyy")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{booking.totalNight} night(s)</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{booking.guestsCount} guest(s)</span>
          </div>
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4 text-muted-foreground" />
            <span>${booking.pricePerNight} per night</span>
          </div>
        </div>
        <div className="mt-4 border-t pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{booking.subtotalAmount || (booking.pricePerNight * booking.totalNight)} VND</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">VAT ({booking.vat}%)</span>
            <span>{(booking.totalAmount - (booking.subtotalAmount || 0)).toFixed(2)} VND</span>
          </div>
          <div className="mt-2 flex justify-between font-medium">
            <span>Total</span>
            <span>{booking.totalAmount} VND</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MyBookingPage = () => {
  const [bookings, setBookings] = useState<MyBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await PropertyService.getMyBookings();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filterBookings = (status: string) => {
    return bookings.filter((booking) => booking.bookingStatus === status);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[300px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">My Bookings</h1>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </TabsContent>
        <TabsContent value="pending" className="space-y-4">
          {filterBookings("PENDING").map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </TabsContent>
        <TabsContent value="confirmed" className="space-y-4">
          {filterBookings("CONFIRMED").map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          {filterBookings("COMPLETED").map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </TabsContent>
        <TabsContent value="cancelled" className="space-y-4">
          {filterBookings("CANCELLED").map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </TabsContent>
      </Tabs>
      {bookings.length === 0 && (
        <div className="mt-8 text-center">
          <h2 className="text-xl font-semibold text-gray-600">No bookings found</h2>
          <p className="text-muted-foreground">
            When you book a property, your bookings will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default MyBookingPage;
