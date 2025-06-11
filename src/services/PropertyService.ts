import api from '../config/api';

export interface PropertyImage {
  id: string;
  propertyId: string;
  imageUrl: string;
  caption: string | null;
  isPrimary: boolean;
  displayOrder: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface DayPrice {
  id: string;
  propertyId: string;
  dayOfWeek: number;
  price: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface Property {
  id: string;
  hostId: string;
  title: string;
  description: string;
  propertyType: string;
  roomType: string;
  address: string;
  provinceId: string;
  districtId: string;
  wardId: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  currentDayPrice: number;
  serviceFee: number;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  checkInTime: string;
  checkOutTime: string;
  status: string;
  createdAt: string | null;
  createdBy: string;
  updatedAt: string;
  updatedBy: string | null;
  images: PropertyImage[];
  amenities: any[];
  categories: any[];
  dayPrices: DayPrice[];
}

export interface PropertyResponse {
  code: number;
  data: {
    properties: Property[];
  };
}

class PropertyService {
  static async getAllProperties(): Promise<Property[]> {
    try {
      const response = await api.get<PropertyResponse>('/booking-service/api/property');
      return response.data.data.properties;
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  }

  static async getPropertyById(id: string): Promise<Property> {
    try {
      const response = await api.get<{code: number; data: Property}>(`/booking-service/api/property/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching property with id ${id}:`, error);
      throw error;
    }
  }
}

export default PropertyService;
