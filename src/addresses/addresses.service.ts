import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateAddressDto, UpdateAddressDto } from './dto';
import {
  Address,
  CreateAddressResponse,
  UpdateAddressResponse,
  DeleteAddressResponse,
} from './entities';

// Database interfaces
interface AddressDbRecord {
  id: string;
  user_id: string;
  label?: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  is_default: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  created_at: string;
  updated_at: string;
}

@Injectable()
export class AddressesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async createAddress(
    userId: string,
    createAddressDto: CreateAddressDto,
  ): Promise<CreateAddressResponse> {
    try {
      // If this is being set as default, first unset all other defaults
      if (createAddressDto.isDefault) {
        await this.unsetAllDefaults(userId);
      }

      const addressData = {
        user_id: userId,
        label: createAddressDto.label,
        street: createAddressDto.street,
        city: createAddressDto.city,
        state: createAddressDto.state,
        zip_code: createAddressDto.zipCode,
        country: createAddressDto.country || 'USA',
        is_default: createAddressDto.isDefault || false,
        coordinates: createAddressDto.coordinates,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const response = await this.supabaseService.client
        .from('addresses')
        .insert(addressData)
        .select()
        .single();

      if (response.error || !response.data) {
        throw new BadRequestException('Failed to create address');
      }

      const data = response.data as AddressDbRecord;
      const address = this.mapDbRecordToAddress(data);

      return {
        success: true,
        message: 'Address created successfully',
        address,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create address');
    }
  }

  async getUserAddresses(userId: string): Promise<Address[]> {
    try {
      const response = await this.supabaseService.client
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (response.error) {
        throw new InternalServerErrorException('Failed to fetch addresses');
      }

      const addresses = response.data as AddressDbRecord[];
      return addresses.map(record => this.mapDbRecordToAddress(record));
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch addresses');
    }
  }

  async updateAddress(
    userId: string,
    addressId: string,
    updateAddressDto: UpdateAddressDto,
  ): Promise<UpdateAddressResponse> {
    try {
      // First verify the address belongs to the user
      await this.verifyAddressOwnership(userId, addressId);

      const updateData: Partial<AddressDbRecord> = {};

      if (updateAddressDto.label !== undefined) {
        updateData.label = updateAddressDto.label;
      }
      if (updateAddressDto.street !== undefined) {
        updateData.street = updateAddressDto.street;
      }
      if (updateAddressDto.city !== undefined) {
        updateData.city = updateAddressDto.city;
      }
      if (updateAddressDto.state !== undefined) {
        updateData.state = updateAddressDto.state;
      }
      if (updateAddressDto.zipCode !== undefined) {
        updateData.zip_code = updateAddressDto.zipCode;
      }
      if (updateAddressDto.country !== undefined) {
        updateData.country = updateAddressDto.country;
      }
      if (updateAddressDto.coordinates !== undefined) {
        updateData.coordinates = updateAddressDto.coordinates;
      }

      updateData.updated_at = new Date().toISOString();

      const response = await this.supabaseService.client
        .from('addresses')
        .update(updateData)
        .eq('id', addressId)
        .eq('user_id', userId)
        .select()
        .single();

      if (response.error || !response.data) {
        throw new BadRequestException('Failed to update address');
      }

      const data = response.data as AddressDbRecord;
      const address = this.mapDbRecordToAddress(data);

      return {
        success: true,
        message: 'Address updated successfully',
        address,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update address');
    }
  }

  async deleteAddress(
    userId: string,
    addressId: string,
  ): Promise<DeleteAddressResponse> {
    try {
      // First verify the address belongs to the user
      await this.verifyAddressOwnership(userId, addressId);

      const response = await this.supabaseService.client
        .from('addresses')
        .delete()
        .eq('id', addressId)
        .eq('user_id', userId);

      if (response.error) {
        throw new BadRequestException('Failed to delete address');
      }

      return {
        success: true,
        message: 'Address deleted successfully',
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete address');
    }
  }

  async setDefaultAddress(
    userId: string,
    addressId: string,
  ): Promise<UpdateAddressResponse> {
    try {
      // First verify the address belongs to the user
      await this.verifyAddressOwnership(userId, addressId);

      // Unset all other defaults first
      await this.unsetAllDefaults(userId);

      // Set the specified address as default
      const response = await this.supabaseService.client
        .from('addresses')
        .update({
          is_default: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', addressId)
        .eq('user_id', userId)
        .select()
        .single();

      if (response.error || !response.data) {
        throw new BadRequestException('Failed to set default address');
      }

      const data = response.data as AddressDbRecord;
      const address = this.mapDbRecordToAddress(data);

      return {
        success: true,
        message: 'Default address set successfully',
        address,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to set default address');
    }
  }

  private async verifyAddressOwnership(
    userId: string,
    addressId: string,
  ): Promise<void> {
    const response = await this.supabaseService.client
      .from('addresses')
      .select('id, user_id')
      .eq('id', addressId)
      .single();

    if (response.error || !response.data) {
      throw new NotFoundException('Address not found');
    }

    const data = response.data as { id: string; user_id: string };
    if (data.user_id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this address',
      );
    }
  }

  private async unsetAllDefaults(userId: string): Promise<void> {
    await this.supabaseService.client
      .from('addresses')
      .update({
        is_default: false,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('is_default', true);
  }

  private mapDbRecordToAddress(record: AddressDbRecord): Address {
    return {
      id: record.id,
      userId: record.user_id,
      label: record.label,
      street: record.street,
      city: record.city,
      state: record.state,
      zipCode: record.zip_code,
      country: record.country,
      isDefault: record.is_default,
      coordinates: record.coordinates,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    };
  }
}
