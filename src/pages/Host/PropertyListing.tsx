import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import PropertyService, { Property } from '@/services/PropertyService';
import { PlusCircle, ArrowUpDown, Eye, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from 'date-fns';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PropertyListing = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProperties, setTotalProperties] = useState(0);
  const pageSize = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await PropertyService.getAllProperties(currentPage, pageSize);
        setProperties(data.properties);
        setTotalPages(data.totalPages);
        setTotalProperties(data.totalElements);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setLoading(false);
      }
    };

    fetchProperties();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

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

  const handleViewDetails = (property: Property) => {
    navigate(`/hosting/properties/${property.id}`);
  };

  const columns: ColumnDef<Property>[] = [
    {
      accessorKey: "imageUrl",
      header: "Image",
      cell: ({ row }) => (
        <div className="relative w-20 h-20">
          <img
            src={row.getValue("imageUrl")}
            alt={row.getValue("title")}
            className="object-cover w-full h-full rounded-md"
          />
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "propertyType",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.getValue("propertyType")}
        </Badge>
      ),
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate">
          {row.getValue("address")}
        </div>
      ),
    },
   {
      accessorKey: "currentDayPrice",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price/Night
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("currentDayPrice"))
        const formatted = amount.toLocaleString() + " VND"
 
        return formatted
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.getValue("status") === "ACTIVE" ? "default" : "secondary"}>
          {row.getValue("status")}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleViewDetails(row.original)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/hosting/properties/${row.original.id}/edit`)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ];

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'PPP');
  };

  return (
     <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Properties</h1>
        <Button 
          onClick={() => navigate('/hosting/add-property')}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </div>

      {loading && properties.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Loading properties...</p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            {totalProperties > 0 ? (
              <>Showing {properties.length} of {totalProperties} properties</>
            ) : (
              <>No properties found</>
            )}
          </div>

          <DataTable
            columns={columns}
            data={properties}
            searchColumn="title"
          />

          {properties.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                You haven't listed any properties yet. Click the "Add Property" button to get started!
              </p>
            </div>
          )}
          
          {/* Only keeping this pagination section, removing the duplicates */}
          {properties.length > 0 && (
            <div className="mt-8 flex justify-center">
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
          )}
        </>
      )}

      <Dialog open={!!selectedProperty} onOpenChange={() => setSelectedProperty(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {selectedProperty?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedProperty && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="col-span-2">
                <img
                  src={selectedProperty.imageUrl}
                  alt={selectedProperty.title}
                  className="w-full h-[300px] object-cover rounded-lg"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Property Type</h3>
                  <p className="mt-1">{selectedProperty.propertyType}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                  <p className="mt-1">{selectedProperty.address}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Price Details</h3>
                  <div className="mt-1 space-y-1">
                    <p>Daily Rate: ${selectedProperty.currentDayPrice}</p>
                    <p>Service Fee: ${selectedProperty.serviceFee}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Check-in/Check-out</h3>
                  <div className="mt-1 space-y-1">
                    <p>Check-in: {selectedProperty.checkInTime}</p>
                    <p>Check-out: {selectedProperty.checkOutTime}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Capacity</h3>
                  <div className="mt-1 space-y-1">
                    <p>Max Guests: {selectedProperty.maxGuests}</p>
                    <p>Bedrooms: {selectedProperty.bedrooms}</p>
                    <p>Beds: {selectedProperty.beds}</p>
                    <p>Bathrooms: {selectedProperty.bathrooms}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <Badge className="mt-1" variant={selectedProperty.status === 'ACTIVE' ? 'default' : 'secondary'}>
                    {selectedProperty.status}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                  <p className="mt-1 text-sm">{selectedProperty.description}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Dates</h3>
                  <div className="mt-1 space-y-1 text-sm">
                    <p>Created: {formatDate(selectedProperty.createdAt)}</p>
                    <p>Last Updated: {formatDate(selectedProperty.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertyListing;