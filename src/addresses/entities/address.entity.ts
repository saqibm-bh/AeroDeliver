export interface Address {
  id: string;
  userId: string;
  label?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressResponse {
  success: boolean;
  message: string;
  address?: Address;
}

export interface UpdateAddressResponse {
  success: boolean;
  message: string;
  address?: Address;
}

export interface DeleteAddressResponse {
  success: boolean;
  message: string;
}
