import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import PropertyService, { Property } from '@/services/PropertyService';
import { Bed, Bath, Users } from 'lucide-react';

export default function PropertyList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await PropertyService.getAllProperties();
        setProperties(data);
      } catch (err) {
        setError('Failed to fetch properties');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-[400px]">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-[400px] text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Available Properties</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Link 
            key={property.id} 
            to={`/properties/${property.id}`}
            className="block transition-transform hover:scale-[1.02] hover:shadow-lg"
          >
            <Card className="overflow-hidden h-full p-0">
              <CardHeader className="p-0">
                <AspectRatio ratio={16 / 9}>
                  {property.imageUrl ? (
                    <img
                      src={property.imageUrl}
                      alt={property.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      No Image Available
                    </div>
                  )}
                </AspectRatio>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-xl mb-2">{property.title}</CardTitle>
                <CardDescription className="mb-4">
                  {property.description.length > 150
                    ? `${property.description.substring(0, 150)}...`
                    : property.description}
                </CardDescription>
                <div className="flex gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Bed className="w-4 h-4" />
                    <span>{property.bedrooms} Beds</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="w-4 h-4" />
                    <span>{property.bathrooms} Baths</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>Up to {property.maxGuests}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <div className="text-lg font-bold">
                  ${property.currentDayPrice} <span className="text-sm font-normal">/ night</span>
                </div>
                <div className="text-sm text-gray-600">
                  +${property.serviceFee} service fee
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
} 