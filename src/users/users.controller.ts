import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { TransformInterceptor } from '../common/interceptors/transformer.interceptor';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { AuthService } from '../auth/auth.service';

@UseGuards(AuthGuard)
@UseInterceptors(TransformInterceptor)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Put('password')
  async updatePassword(
    @CurrentUser() user: User,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const passwordChecked = await this.authService.checkPassword(
      user.password,
      updatePasswordDto.currentPassword,
    );
    if (passwordChecked) {
      return this.usersService.changePassword(
        user,
        updatePasswordDto.newPassword,
      );
    } else {
      throw new UnauthorizedException('Current password is wrong');
    }
  }

  @Put('account')
  async updateAccount(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(user.id, updateUserDto);
  }
}
