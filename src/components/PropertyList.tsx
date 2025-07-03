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
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

export default function PropertyList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProperties, setTotalProperties] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await PropertyService.getAllProperties(currentPage, pageSize);
        setProperties(data.properties);
        setTotalPages(data.totalPages);
        setTotalProperties(data.totalElements);
      } catch (err) {
        setError('Failed to fetch properties');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
    
    // Adjust start if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  if (loading && currentPage === 0) {
    return <div className="flex justify-center items-center min-h-[400px]">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-[400px] text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Available Properties</h1>
      
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">Loading...</div>
      ) : (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {properties.length} of {totalProperties} properties
          </div>
          
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
                      {property.currentDayPrice} VND <span className="text-sm font-normal">/ night</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      +{property.serviceFee} VND service fee
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    className={currentPage === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    aria-disabled={currentPage === 0}
                  />
                </PaginationItem>
                
                {getPageNumbers().map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink 
                      isActive={page === currentPage}
                      onClick={() => handlePageChange(page)}
                    >
                      {page + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    className={currentPage === totalPages - 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    aria-disabled={currentPage === totalPages - 1}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </div>
  );
}