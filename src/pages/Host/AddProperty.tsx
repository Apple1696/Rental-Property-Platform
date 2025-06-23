import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import PropertyService, { CreatePropertyRequest, DayPrice } from '@/services/PropertyService';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

const propertyTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'cabin', label: 'Cabin' },
  { value: 'resort', label: 'Resort' },
];

const daysOfWeek = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 7, label: 'Sunday' },
];

const AddProperty = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<CreatePropertyRequest>>({
    hostId: '28cbd45f-e5b3-454c-87f4-432944509c10', // This should be set from your auth context
    title: '',
    description: '',
    propertyType: '',
    address: '',
    zipCode: '',
    serviceFee: 0,
    maxGuests: 0,
    bedrooms: 0,
    beds: 0,
    bathrooms: 0,
    checkInTime: '14:00',
    checkOutTime: '11:00',
    imageUrl: '',
    dayPrices: [], // Initialize as empty array
  });

  const handleInputChange = (field: keyof CreatePropertyRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDayPriceAdd = () => {
    setFormData((prev) => ({
      ...prev,
      dayPrices: [...(prev.dayPrices || []), { dayOfWeek: 2, price: 0 }],
    }));
  };

  const handleDayPriceChange = (index: number, field: keyof DayPrice, value: number) => {
    setFormData((prev) => {
      const newDayPrices = [...(prev.dayPrices || [])];
      newDayPrices[index] = { ...newDayPrices[index], [field]: value };
      return { ...prev, dayPrices: newDayPrices };
    });
  };

  const handleDayPriceRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      dayPrices: (prev.dayPrices || []).filter((_, i) => i !== index),
    }));
  };

  const getAvailableDays = (currentIndex: number) => {
    const usedDays = formData.dayPrices
      ?.filter((_, index) => index !== currentIndex)
      .map(dp => dp.dayOfWeek) || [];
    return daysOfWeek.filter(day => !usedDays.includes(day.value));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.dayPrices?.length) {
        toast.error('Please add at least one day price');
        return;
      }

      // Add default values for required fields not in the form
      const propertyData: CreatePropertyRequest = {
        ...formData,
        roomType: 'standard', // Default value
        provinceId: '1', // Default value
        districtId: '1', // Default value
        wardId: '1', // Default value
        latitude: 0, // Default value
        longitude: 0, // Default value
      } as CreatePropertyRequest;

      await PropertyService.addProperty(propertyData);
      toast.success('Property has been created successfully');
      navigate('/hosting');
    } catch (error) {
      toast.error('Failed to create property. Please try again.');
    }
  };

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
        <h1 className="text-2xl font-semibold">Add New Property</h1>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <Label htmlFor="title">Property Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter property title"
            />
          </div>

          <div className="col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your property"
              className="h-32"
            />
          </div>

          <div className="col-span-1">
            <Label htmlFor="propertyType">Property Type</Label>
            <Select
              value={formData.propertyType}
              onValueChange={(value) => handleInputChange('propertyType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2">
            <div className="flex items-center justify-between mb-4">
              <Label>Day Prices</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDayPriceAdd}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Day Price
              </Button>
            </div>
            
            <div className="space-y-4">
              {formData.dayPrices?.map((dayPrice, index) => (
                <div key={index} className="flex items-end gap-4 bg-muted/20 p-4 rounded-lg">
                  <div className="flex-1">
                    <Label>Day of Week</Label>
                    <Select
                      value={dayPrice.dayOfWeek.toString()}
                      onValueChange={(value) => handleDayPriceChange(index, 'dayOfWeek', Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableDays(index).map((day) => (
                          <SelectItem key={day.value} value={day.value.toString()}>
                            {day.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label>Price ($)</Label>
                    <Input
                      type="number"
                      value={dayPrice.price}
                      onChange={(e) => handleDayPriceChange(index, 'price', Number(e.target.value))}
                      placeholder="Enter price"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDayPriceRemove(index)}
                    className="text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {formData.dayPrices?.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No day prices added. Click "Add Day Price" to set prices for specific days.
                </div>
              )}
            </div>
          </div>

          <div className="col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter property address"
            />
          </div>

          <div>
            <Label htmlFor="zipCode">Zip Code</Label>
            <Input
              id="zipCode"
              value={formData.zipCode}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
              placeholder="Enter zip code"
            />
          </div>

          <div>
            <Label htmlFor="serviceFee">Service Fee ($)</Label>
            <Input
              id="serviceFee"
              type="number"
              value={formData.serviceFee}
              onChange={(e) => handleInputChange('serviceFee', Number(e.target.value))}
              placeholder="Enter service fee"
            />
          </div>

          <div>
            <Label htmlFor="maxGuests">Max Guests</Label>
            <Input
              id="maxGuests"
              type="number"
              value={formData.maxGuests}
              onChange={(e) => handleInputChange('maxGuests', Number(e.target.value))}
              placeholder="Enter max guests"
            />
          </div>

          <div>
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input
              id="bedrooms"
              type="number"
              value={formData.bedrooms}
              onChange={(e) => handleInputChange('bedrooms', Number(e.target.value))}
              placeholder="Enter number of bedrooms"
            />
          </div>

          <div>
            <Label htmlFor="beds">Beds</Label>
            <Input
              id="beds"
              type="number"
              value={formData.beds}
              onChange={(e) => handleInputChange('beds', Number(e.target.value))}
              placeholder="Enter number of beds"
            />
          </div>

          <div>
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input
              id="bathrooms"
              type="number"
              value={formData.bathrooms}
              onChange={(e) => handleInputChange('bathrooms', Number(e.target.value))}
              placeholder="Enter number of bathrooms"
            />
          </div>

          <div>
            <Label htmlFor="checkInTime">Check-in Time</Label>
            <Input
              id="checkInTime"
              type="time"
              value={formData.checkInTime}
              onChange={(e) => handleInputChange('checkInTime', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="checkOutTime">Check-out Time</Label>
            <Input
              id="checkOutTime"
              type="time"
              value={formData.checkOutTime}
              onChange={(e) => handleInputChange('checkOutTime', e.target.value)}
            />
          </div>

          <div className="col-span-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              placeholder="Enter property image URL"
            />
          </div>

          <div className="col-span-2 flex justify-end gap-4 mt-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/hosting/properties')}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Create Property
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;
