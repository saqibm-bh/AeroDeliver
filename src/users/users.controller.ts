import {
  Controller,
  Get,
  Put,
  Delete,
  Post,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto, UpdatePasswordDto } from './dto';
import {
  UserProfile,
  UpdateUserResponse,
  DeleteUserResponse,
  UploadProfilePictureResponse,
} from './interfaces';
import { AuthGuard } from '../auth/auth.guard';
import { AuthenticatedRequest } from '../auth/interfaces/request.interface';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: Object,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getProfile(@Request() req: AuthenticatedRequest): Promise<UserProfile> {
    return this.usersService.getProfile(req.user.id);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: Object,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserResponse> {
    return this.usersService.updateProfile(req.user.id, updateUserDto);
  }

  @Put('password')
  @ApiOperation({ summary: 'Update user password' })
  @ApiResponse({
    status: 200,
    description: 'Password updated successfully',
    type: Object,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updatePassword(
    @Request() req: AuthenticatedRequest,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<UpdateUserResponse> {
    return this.usersService.updatePassword(req.user.id, updatePasswordDto);
  }

  @Post('profile/picture')
  @ApiOperation({ summary: 'Upload profile picture' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Profile picture file',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Profile picture uploaded successfully',
    type: Object,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(
    @Request() req: AuthenticatedRequest,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /^image\/(jpeg|jpg|png|gif)$/ }),
        ],
      }),
    )
    file: any, // Express.Multer.File - using any due to type inference issues
  ): Promise<UploadProfilePictureResponse> {
    // Properly cast the file to the expected type
    const multerFile = file as {
      originalname: string;
      buffer: Buffer;
      mimetype: string;
    };

    const fileData = {
      originalname: multerFile.originalname,
      buffer: multerFile.buffer,
      mimetype: multerFile.mimetype,
    };
    return this.usersService.uploadProfilePicture(req.user.id, fileData);
  }

  @Delete('profile')
  @ApiOperation({ summary: 'Delete user account' })
  @ApiResponse({
    status: 200,
    description: 'Account deleted successfully',
    type: Object,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteAccount(
    @Request() req: AuthenticatedRequest,
  ): Promise<DeleteUserResponse> {
    return this.usersService.deleteAccount(req.user.id);
  }
}
