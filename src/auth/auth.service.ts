import {
  Injectable,
  UnauthorizedException,
  Logger,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../supabase/supabase.service';
import { RegisterDto } from './dto/register.dto';
import {
  LoginDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyEmailDto,
  ChangePasswordDto,
} from './dto/login.dto';
import {
  AuthResponse,
  TokenPayload,
  RefreshTokenPayload,
} from './interfaces/auth.interface';
import { UserProfile } from './interfaces/supabase.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private supabaseService: SupabaseService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const { data: existingUser } = await this.supabaseService.client
        .from('user_profiles')
        .select('user_id')
        .eq('email', registerDto.email)
        .single();

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      // Create user in Supabase Auth
      const { data, error } = await this.supabaseService.client.auth.signUp({
        email: registerDto.email,
        password: registerDto.password,
        options: {
          data: {
            full_name: registerDto.fullName,
            phone: registerDto.phone,
          },
        },
      });

      if (error) {
        this.logger.error('Registration failed:', error.message);
        throw new BadRequestException(error.message);
      }

      if (!data.user) {
        throw new BadRequestException('Registration failed');
      }

      // Create user profile in our custom table
      const { error: profileError } = await this.supabaseService.client
        .from('user_profiles')
        .insert({
          user_id: data.user.id,
          email: registerDto.email,
          full_name: registerDto.fullName,
          phone: registerDto.phone,
          user_type: registerDto.userType || 'customer',
          address: registerDto.address,
          coordinates: registerDto.coordinates,
          email_verified: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (profileError) {
        this.logger.error('Profile creation failed:', profileError.message);
        throw new BadRequestException('Failed to create user profile');
      }

      // Generate tokens
      const tokens = await this.generateTokens(
        data.user.id,
        registerDto.email,
        registerDto.userType || 'customer',
      );

      return {
        user: {
          id: data.user.id,
          email: registerDto.email,
          fullName: registerDto.fullName,
          phone: registerDto.phone,
          userType: registerDto.userType || 'customer',
          emailVerified: false,
          profile: {
            address: registerDto.address,
            coordinates: registerDto.coordinates,
          },
        },
        tokens,
      };
    } catch (error) {
      this.logger.error('Registration error:', error);
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Registration failed');
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    try {
      const { data, error } =
        await this.supabaseService.client.auth.signInWithPassword({
          email: loginDto.email,
          password: loginDto.password,
        });

      if (error) {
        this.logger.error('Login failed:', error.message);
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!data.user || !data.session) {
        throw new UnauthorizedException('Login failed');
      }

      // Get user profile from our custom table
      const { data: profile, error: profileError } =
        await this.supabaseService.client
          .from('user_profiles')
          .select('*')
          .eq('user_id', data.user.id)
          .single<UserProfile>();

      if (profileError || !profile) {
        this.logger.error('Profile fetch failed:', profileError?.message);
        throw new UnauthorizedException('User profile not found');
      }

      // Generate our own tokens
      const tokens = await this.generateTokens(
        data.user.id,
        data.user.email!,
        profile.user_type,
      );

      return {
        user: {
          id: data.user.id,
          email: data.user.email!,
          fullName: profile.full_name,
          phone: profile.phone,
          userType: profile.user_type,
          emailVerified: profile.email_verified || false,
          profile: {
            address: profile.address,
            coordinates: profile.coordinates,
          },
        },
        tokens,
      };
    } catch (error) {
      this.logger.error('Login error:', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Login failed');
    }
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string; expiresIn: number }> {
    try {
      const payload = this.jwtService.verify<RefreshTokenPayload>(
        refreshTokenDto.refreshToken,
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        },
      );

      // Verify refresh token exists in database
      const { data: tokenRecord, error } = await this.supabaseService.client
        .from('refresh_tokens')
        .select('*')
        .eq('token_id', payload.tokenId)
        .eq('user_id', payload.sub)
        .eq('is_active', true)
        .single<{
          token_id: string;
          user_id: string;
          is_active: boolean;
          expires_at: string;
        }>();

      if (error || !tokenRecord) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Get user details
      const { data: user, error: userError } = await this.supabaseService.client
        .from('user_profiles')
        .select('email, user_type')
        .eq('user_id', payload.sub)
        .single();

      if (userError || !user) {
        throw new UnauthorizedException('User not found');
      }

      // Generate new access token
      const accessToken = await this.generateAccessToken(
        payload.sub,
        (user as UserProfile).email,
        (user as UserProfile).user_type,
      );
      const expiresIn = parseInt(
        this.configService.get<string>('JWT_EXPIRES_IN', '3600'),
      );

      return { accessToken, expiresIn };
    } catch (error) {
      this.logger.error('Refresh token error:', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(
    userId: string,
    refreshToken?: string,
  ): Promise<{ message: string }> {
    try {
      // Invalidate refresh token if provided
      if (refreshToken) {
        try {
          const payload = this.jwtService.verify<RefreshTokenPayload>(
            refreshToken,
            {
              secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            },
          );
          if (payload && payload.tokenId) {
            await this.supabaseService.client
              .from('refresh_tokens')
              .update({
                is_active: false,
                updated_at: new Date().toISOString(),
              })
              .eq('token_id', payload.tokenId)
              .eq('user_id', userId);
          }
        } catch (error) {
          // Token might be invalid, ignore error for logout
          this.logger.warn('Invalid refresh token during logout:', error);
        }
      }

      // Invalidate all user's refresh tokens
      await this.supabaseService.client
        .from('refresh_tokens')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      return { message: 'Logged out successfully' };
    } catch (error) {
      this.logger.error('Logout error:', error);
      throw new BadRequestException('Logout failed');
    }
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    try {
      const { error } =
        await this.supabaseService.client.auth.resetPasswordForEmail(
          forgotPasswordDto.email,
          {
            redirectTo: `${this.configService.get<string>('FRONTEND_URL')}/reset-password`,
          },
        );

      if (error) {
        this.logger.error('Password reset failed:', error.message);
        // Don't reveal if email exists or not
        return {
          message: 'If the email exists, a password reset link has been sent',
        };
      }

      return {
        message: 'If the email exists, a password reset link has been sent',
      };
    } catch (error) {
      this.logger.error('Forgot password error:', error);
      return {
        message: 'If the email exists, a password reset link has been sent',
      };
    }
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    try {
      // Verify the reset token with Supabase
      const { data, error } = await this.supabaseService.client.auth.verifyOtp({
        token_hash: resetPasswordDto.token,
        type: 'recovery',
      });

      if (error || !data.user) {
        throw new BadRequestException('Invalid or expired reset token');
      }

      // Update password
      const { error: updateError } =
        await this.supabaseService.client.auth.updateUser({
          password: resetPasswordDto.password,
        });

      if (updateError) {
        throw new BadRequestException('Failed to update password');
      }

      return { message: 'Password reset successfully' };
    } catch (error) {
      this.logger.error('Reset password error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Password reset failed');
    }
  }

  async verifyEmail(
    verifyEmailDto: VerifyEmailDto,
  ): Promise<{ message: string }> {
    try {
      const { data, error } = await this.supabaseService.client.auth.verifyOtp({
        token_hash: verifyEmailDto.token,
        type: 'email',
      });

      if (error || !data.user) {
        throw new BadRequestException('Invalid or expired verification token');
      }

      // Update email verification status in our profile table
      await this.supabaseService.client
        .from('user_profiles')
        .update({
          email_verified: true,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', data.user.id);

      return { message: 'Email verified successfully' };
    } catch (error) {
      this.logger.error('Email verification error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Email verification failed');
    }
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    try {
      // First verify current password by attempting to sign in
      const { data: user } = await this.supabaseService.client
        .from('user_profiles')
        .select('email')
        .eq('user_id', userId)
        .single();

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const { error: signInError } =
        await this.supabaseService.client.auth.signInWithPassword({
          email: user.email as string,
          password: changePasswordDto.currentPassword,
        });

      if (signInError) {
        throw new BadRequestException('Current password is incorrect');
      }

      // Update password
      const { error: updateError } =
        await this.supabaseService.client.auth.updateUser({
          password: changePasswordDto.newPassword,
        });

      if (updateError) {
        throw new BadRequestException('Failed to update password');
      }

      return { message: 'Password changed successfully' };
    } catch (error) {
      this.logger.error('Change password error:', error);
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new BadRequestException('Password change failed');
    }
  }

  async validateUser(token: string) {
    try {
      this.jwtService.verify<TokenPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const user = await this.supabaseService.validateUser(token);
      return user;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private async generateTokens(
    userId: string,
    email: string,
    userType: string,
  ) {
    const tokenId = uuidv4();

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(userId, email, userType),
      this.generateRefreshToken(userId, tokenId),
    ]);

    // Store refresh token in database
    await this.supabaseService.client.from('refresh_tokens').insert({
      token_id: tokenId,
      user_id: userId,
      is_active: true,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      created_at: new Date().toISOString(),
    });

    const expiresIn = parseInt(
      this.configService.get<string>('JWT_EXPIRES_IN', '3600'),
    );

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  private async generateAccessToken(
    userId: string,
    email: string,
    userType: string,
  ): Promise<string> {
    const payload: TokenPayload = {
      sub: userId,
      email,
      userType,
    };

    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '1h'),
    });
  }

  private async generateRefreshToken(
    userId: string,
    tokenId: string,
  ): Promise<string> {
    const payload: RefreshTokenPayload = {
      sub: userId,
      tokenId,
    };

    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
    });
  }
}
