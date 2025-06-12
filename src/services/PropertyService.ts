import api from '../config/api';

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
  dayPrices: DayPrice[];
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
  imageUrl: string;
  amenities: any[];
  categories: any[];
}

export interface PropertyResponse {
  code: number;
  data: {
    properties: Property[];
  };
}

export interface DayPrice {
  dayOfWeek: number;
  price: number;
}

export interface CreatePropertyRequest {
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
  dayPrices: DayPrice[];
  serviceFee: number;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  checkInTime: string;
  checkOutTime: string;
  imageUrl: string;
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

  static async addProperty(propertyData: CreatePropertyRequest): Promise<Property> {
    try {
      const response = await api.post<{code: number; data: Property}>(
        '/booking-service/api/property/add',
        propertyData
      );
      return response.data.data;
    } catch (error) {
      console.error('Error adding property:', error);
      throw error;
    }
  }

  static async updateProperty(propertyData: CreatePropertyRequest): Promise<Property> {
    try {
      const response = await api.put<{code: number; data: Property}>(
        '/booking-service/api/property/update',
        propertyData
      );
      return response.data.data;
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  }
}

export default PropertyService;
