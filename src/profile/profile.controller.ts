import {
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Patch,
  Put,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { TransformInterceptor } from '../common/interceptors/transformer.interceptor';
import { Response } from 'express';

@UseGuards(AuthGuard)
@UseInterceptors(TransformInterceptor)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  findUserProfile(@CurrentUser() user: User) {
    return this.profileService.findUserProfile(user.id);
  }

  @Put()
  @Patch()
  async updateUserProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      await this.findUserProfile(user);
      response.status(HttpStatus.OK);
    } catch (e) {
      if (e instanceof NotFoundException) {
        response.status(HttpStatus.CREATED);
      }
    }
    return this.profileService.updateUserProfile(user.id, updateProfileDto);
  }
}
