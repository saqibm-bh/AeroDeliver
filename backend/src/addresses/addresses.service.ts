import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getUserAddresses(userId: string): Promise<Address[]> {
    return this.supabaseService.getUserAddresses(userId);
  }

  async getAddressById(id: string, userId?: string): Promise<Address> {
    const address = await this.supabaseService.getAddressById(id);
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    if (userId && address.userId !== userId) {
      throw new ForbiddenException('Access denied to this address');
    }
    return address;
  }

  async createAddress(
    userId: string,
    createAddressDto: CreateAddressDto,
  ): Promise<Address> {
    return this.supabaseService.createAddress(userId, createAddressDto);
  }

  async updateAddress(
    id: string,
    userId: string,
    updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    // Validate ownership first
    await this.getAddressById(id, userId);
    return this.supabaseService.updateAddress(id, updateAddressDto);
  }

  async deleteAddress(id: string, userId: string): Promise<void> {
    await this.getAddressById(id, userId); // Check ownership
    await this.supabaseService.deleteAddress(id);
  }

  /**
   * Sets the specified address as default for the user, and unsets all others.
   * Throws if the address does not belong to the user.
   */
  async setDefaultAddress(id: string, userId: string): Promise<Address> {
    // Ensure the address belongs to the user
    await this.getAddressById(id, userId);
    // Unset all other default addresses for this user
    await this.supabaseService.removeDefaultAddresses(userId);
    // Set the specified address as default
    return this.supabaseService.updateAddress(id, { is_default: true });
  }
}
