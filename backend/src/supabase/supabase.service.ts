import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { Address } from '../addresses/entities/address.entity';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  public client: SupabaseClient;

  constructor(private config: ConfigService) {
    this.client = createClient(
      config.get<string>('SUPABASE_URL')!,
      config.get<string>('SUPABASE_SERVICE_ROLE_KEY')!,
    );
  }

  // User Management Methods
  async createUser(userData: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    role: string;
  }): Promise<any> {
    const { data, error } = await this.client
      .from('users')
      .insert({
        email: userData.email,
        password: userData.password,
        full_name: userData.fullName,
        phone: userData.phone,
        role: userData.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }

    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      phone: data.phone,
      role: data.role,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }

  async getUserById(id: string): Promise<any> {
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }

    if (!data) return null;

    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      phone: data.phone,
      role: data.role,
      password: data.password,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }

  async getUserByEmail(email: string): Promise<any> {
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }

    if (!data) return null;

    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      phone: data.phone,
      role: data.role,
      password: data.password,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }

  async getAllUsers(): Promise<any[]> {
    const { data, error } = await this.client
      .from('users')
      .select('id, email, full_name, phone, role, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    return (data || []).map((user) => ({
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      phone: user.phone,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }));
  }

  async updateUser(id: string, userData: any): Promise<any> {
    const { data, error } = await this.client
      .from('users')
      .update({
        full_name: userData.fullName,
        phone: userData.phone,
        role: userData.role,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }

    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      phone: data.phone,
      role: data.role,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }

  async deleteUser(id: string): Promise<void> {
    const { error } = await this.client.from('users').delete().eq('id', id);

    if (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  async getUsersByRole(role: string): Promise<any[]> {
    const { data, error } = await this.client
      .from('users')
      .select('id, email, full_name, phone, role, created_at, updated_at')
      .eq('role', role)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch users by role: ${error.message}`);
    }

    return (data || []).map((user) => ({
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      phone: user.phone,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }));
  }

  // Address Management Methods
  async getUserAddresses(userId: string): Promise<Address[]> {
    const { data, error } = await this.client
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get user addresses: ${error.message}`);
    }

    return (data || []).map((addr) => ({
      id: addr.id,
      userId: addr.user_id,
      label: addr.label,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postal_code,
      country: addr.country,
      latitude: addr.latitude,
      longitude: addr.longitude,
      instructions: addr.instructions,
      isDefault: addr.is_default,
      createdAt: addr.created_at,
      updatedAt: addr.updated_at,
    }));
  }

  async getAddressById(id: string): Promise<Address | null> {
    const { data, error } = await this.client
      .from('addresses')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get address: ${error.message}`);
    }

    if (!data) return null;

    return {
      id: data.id,
      userId: data.user_id,
      label: data.label,
      street: data.street,
      city: data.city,
      state: data.state,
      postalCode: data.postal_code,
      country: data.country,
      latitude: data.latitude,
      longitude: data.longitude,
      instructions: data.instructions,
      isDefault: data.is_default,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async createAddress(userId: string, addressData: any): Promise<Address> {
    const { data, error } = await this.client
      .from('addresses')
      .insert({
        user_id: userId,
        label: addressData.label,
        street: addressData.street,
        city: addressData.city,
        state: addressData.state,
        postal_code: addressData.postalCode,
        country: addressData.country,
        latitude: addressData.latitude,
        longitude: addressData.longitude,
        instructions: addressData.instructions,
        is_default: addressData.isDefault || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create address: ${error.message}`);
    }

    return {
      id: data.id,
      userId: data.user_id,
      label: data.label,
      street: data.street,
      city: data.city,
      state: data.state,
      postalCode: data.postal_code,
      country: data.country,
      latitude: data.latitude,
      longitude: data.longitude,
      instructions: data.instructions,
      isDefault: data.is_default,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async updateAddress(id: string, addressData: any): Promise<Address> {
    const { data, error } = await this.client
      .from('addresses')
      .update(addressData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update address: ${error.message}`);
    }

    // Map DB fields to Address interface
    return {
      id: data.id,
      userId: data.user_id,
      label: data.label,
      street: data.street,
      city: data.city,
      state: data.state,
      postalCode: data.postal_code,
      country: data.country,
      latitude: data.latitude,
      longitude: data.longitude,
      instructions: data.instructions,
      isDefault: data.is_default,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async deleteAddress(id: string): Promise<void> {
    const { error } = await this.client.from('addresses').delete().eq('id', id);

    if (error) {
      throw new Error(`Failed to delete address: ${error.message}`);
    }
  }

  async removeDefaultAddresses(userId: string): Promise<void> {
    const { error } = await this.client
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to remove default addresses: ${error.message}`);
    }
  }

  /**
   * Validates a Supabase Auth JWT and returns the user if valid.
   * Throws UnauthorizedException if invalid.
   */
  async validateUser(token: string): Promise<any> {
    try {
      const { data: user, error } = await this.client.auth.getUser(token);

      if (error || !user) {
        throw new UnauthorizedException('Invalid or missing Supabase token');
      }

      const { data: profile, error: profileError } = await this.client
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.user?.id)
        .single();

      if (profileError) {
        this.logger.warn(`Profile not found for user ${user.user?.id}`);
      }

      return {
        id: user.user?.id,
        email: user.user?.email as string,
        phone: user.user?.phone,
        user_type: profile?.user_type || 'customer',
        profile: {
          full_name: profile?.full_name || '',
          address: profile?.address,
          coordinates: profile?.coordinates,
        },
      };
    } catch (error) {
      this.logger.error('Token validation failed:', error);
      throw new UnauthorizedException('Invalid or expired Supabase token');
    }
  }
}
