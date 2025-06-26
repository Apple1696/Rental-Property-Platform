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

export interface UpdatePropertyRequest extends CreatePropertyRequest {
  id: string;
}
export interface BookingRequest {
  propertyId: string;
  checkInDate: string;
  checkOutDate: string;
  guestsCount: number;
  totalNight: number;
  pricePerNight: number;
  vat: number;
  totalAmount: number;
  subtotalAmount?: number | null;
  specialRequests?: string | null;
  paymentMethod: string;
}

export interface BookingResponse {
  code: number;
  data: {
    paymentUrl: string;
  };
  message: string;
}

export interface MyBooking {
  id: string;
  propertyId: string;
  checkInDate: string;
  checkOutDate: string;
  guestsCount: number;
  totalNight: number;
  pricePerNight: number;
  vat: number;
  subtotalAmount: number | null;
  totalAmount: number;
  expiresAt: string;
  bookingStatus: string;
  specialRequests: string | null;
  paymentMethod: string | null;
  paymentStatus: string | null;
  paymentAmount: number | null;
}

export interface MyBookingsResponse {
  code: number;
  data: MyBooking[];
  message: string;
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
      const response = await api.get<{ code: number; data: Property }>(`/booking-service/api/property/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching property with id ${id}:`, error);
      throw error;
    }
  }

  static async addProperty(propertyData: CreatePropertyRequest): Promise<Property> {
    try {
      const response = await api.post<{ code: number; data: Property }>(
        '/booking-service/api/property/add',
        propertyData
      );
      return response.data.data;
    } catch (error) {
      console.error('Error adding property:', error);
      throw error;
    }
  }

  static async updateProperty(propertyData: UpdatePropertyRequest): Promise<Property> {
    try {
      const response = await api.post<{ code: number; data: Property }>(
        '/booking-service/api/property/update',
        propertyData
      );
      return response.data.data;
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  }

  static async createBooking(bookingData: BookingRequest): Promise<BookingResponse> {
    try {
      const response = await api.post<BookingResponse>(
        '/booking-service/api/booking',
        bookingData
      );
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  static async getMyBookings(): Promise<MyBooking[]> {
    try {
      const response = await api.get<MyBookingsResponse>('/booking-service/api/booking/my-bookings');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching my bookings:', error);
      throw error;
    }
  }
}

export default PropertyService;
