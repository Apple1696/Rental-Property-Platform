import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import PropertyService, { Property } from '@/services/PropertyService';
import { PlusCircle, ArrowUpDown, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';

const PropertyListing = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await PropertyService.getAllProperties();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, []);

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
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
 
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/hosting/properties/${row.original.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        )
      },
    },
  ];

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

      <DataTable
        columns={columns}
        data={properties}
        searchColumn="title"
      />

      {properties.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            You haven't listed any properties yet. Click the "Add Property" button to get started!
          </p>
        </div>
      )}
    </div>
  );
};

export default PropertyListing;
