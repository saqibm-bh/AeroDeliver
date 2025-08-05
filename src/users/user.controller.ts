import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';

@Controller('user')
export class UserController {
  @Get('profile')
  @UseGuards(AuthGuard)
  getProfile(@Req() req: Request & { user: any }) {
    return {
      message: 'Authorized user',
      user: req.user as unknown, // user info from Supabase
    };
  }
}
