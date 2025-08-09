import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { UpdateUserDto, CreateUserDto } from './dto/user.dto';
import { UserProfile } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getAllUsers(): Promise<UserProfile[]> {
    return this.supabaseService.getAllUsers();
  }

  async getUserById(id: string): Promise<UserProfile> {
    const user = await this.supabaseService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<UserProfile> {
    const user = await this.supabaseService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserProfile> {
    return this.supabaseService.createUser({
      ...createUserDto,
      password: 'temp-password', // This should be handled differently in production
      role: createUserDto.role || 'customer',
    });
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserProfile> {
    const existingUser = await this.getUserById(id);

    const updatedUser = await this.supabaseService.updateUser(id, {
      ...existingUser,
      ...updateUserDto,
    });

    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    await this.getUserById(id); // Check if user exists
    await this.supabaseService.deleteUser(id);
  }

  async getUsersByRole(role: string): Promise<UserProfile[]> {
    return this.supabaseService.getUsersByRole(role);
  }
}
