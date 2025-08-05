import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { UpdateUserDto, UpdatePasswordDto } from './dto';
import {
  UserProfile,
  UpdateUserResponse,
  DeleteUserResponse,
  UploadProfilePictureResponse,
} from './interfaces';
import * as bcrypt from 'bcryptjs';

// Database interfaces
interface UserDbRecord {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  profile_picture_url?: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

interface UploadFile {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
}

// Interface for user database row
interface UserRow {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  profile_picture_url?: string;
  password_hash?: string;
  created_at: string;
  updated_at: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getProfile(userId: string): Promise<UserProfile> {
    try {
      const response = await this.supabaseService.client
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (response.error || !response.data) {
        throw new NotFoundException('User not found');
      }

      const data = response.data as UserDbRecord;

      return {
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zip_code,
        profilePictureUrl: data.profile_picture_url,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch user profile');
    }
  }

  async updateProfile(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserResponse> {
    try {
      const updateData: Record<string, any> = {};

      if (updateUserDto.firstName !== undefined) {
        updateData.first_name = updateUserDto.firstName;
      }
      if (updateUserDto.lastName !== undefined) {
        updateData.last_name = updateUserDto.lastName;
      }
      if (updateUserDto.email !== undefined) {
        updateData.email = updateUserDto.email;
      }
      if (updateUserDto.phone !== undefined) {
        updateData.phone = updateUserDto.phone;
      }
      if (updateUserDto.address !== undefined) {
        updateData.address = updateUserDto.address;
      }
      if (updateUserDto.city !== undefined) {
        updateData.city = updateUserDto.city;
      }
      if (updateUserDto.state !== undefined) {
        updateData.state = updateUserDto.state;
      }
      if (updateUserDto.zipCode !== undefined) {
        updateData.zip_code = updateUserDto.zipCode;
      }

      updateData.updated_at = new Date().toISOString();

      const response = await this.supabaseService.client
        .from('users')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

      if (response.error || !response.data) {
        throw new BadRequestException('Failed to update profile');
      }

      const data = response.data as UserDbRecord;

      const updatedUser: UserProfile = {
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zip_code,
        profilePictureUrl: data.profile_picture_url,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      return {
        success: true,
        message: 'Profile updated successfully',
        user: updatedUser,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update profile');
    }
  }

  async updatePassword(
    userId: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UpdateUserResponse> {
    try {
      // Get current user data
      const { data: userData, error: userError } =
        await this.supabaseService.client
          .from('users')
          .select('password_hash')
          .eq('id', userId)
          .single();

      if (userError || !userData) {
        throw new NotFoundException('User not found');
      }

      const userRow = userData as UserRow;

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(
        updatePasswordDto.currentPassword,
        userRow.password_hash || '',
      );

      if (!isCurrentPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      // Hash new password
      const saltRounds = 12;
      const hashedNewPassword = await bcrypt.hash(
        updatePasswordDto.newPassword,
        saltRounds,
      );

      // Update password
      const { error } = await this.supabaseService.client
        .from('users')
        .update({
          password_hash: hashedNewPassword,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        throw new BadRequestException('Failed to update password');
      }

      return {
        success: true,
        message: 'Password updated successfully',
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update password');
    }
  }

  async uploadProfilePicture(
    userId: string,
    file: UploadFile,
  ): Promise<UploadProfilePictureResponse> {
    try {
      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = file.originalname.split('.').pop() || 'jpg';
      const fileName = `profile-${userId}-${timestamp}.${fileExtension}`;
      const filePath = `profiles/${fileName}`;

      // Upload file to Supabase storage
      const { error: uploadError } = await this.supabaseService.client.storage
        .from('avatars')
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (uploadError) {
        throw new BadRequestException('Failed to upload profile picture');
      }

      // Get public URL
      const { data: urlData } = this.supabaseService.client.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const profilePictureUrl = urlData.publicUrl;

      // Update user profile with new picture URL
      const { error: updateError } = await this.supabaseService.client
        .from('users')
        .update({
          profile_picture_url: profilePictureUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (updateError) {
        throw new BadRequestException('Failed to update profile picture URL');
      }

      return {
        success: true,
        message: 'Profile picture uploaded successfully',
        profilePictureUrl,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to upload profile picture',
      );
    }
  }

  async deleteAccount(userId: string): Promise<DeleteUserResponse> {
    try {
      // First, delete the user's profile picture from storage if it exists
      const { data: userData } = await this.supabaseService.client
        .from('users')
        .select('profile_picture_url')
        .eq('id', userId)
        .single();

      if (userData?.profile_picture_url) {
        // Extract file path from URL
        const userRow = userData as UserRow;
        const url = new URL(userRow.profile_picture_url || '');
        const pathSegments = url.pathname.split('/');
        const filePath = pathSegments.slice(-2).join('/'); // Get last two segments

        await this.supabaseService.client.storage
          .from('avatars')
          .remove([filePath]);
      }

      // Delete user record
      const { error } = await this.supabaseService.client
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) {
        throw new BadRequestException('Failed to delete account');
      }

      return {
        success: true,
        message: 'Account deleted successfully',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete account');
    }
  }
}
