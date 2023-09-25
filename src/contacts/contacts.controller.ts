import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { FilterMessage } from './dto/filter-message.dto';
import { TransformInterceptor } from '../common/interceptors/transformer.interceptor';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AllowGuest } from '../auth/decorators/allow-guest.decorator';
import { ReplyMessageDto } from './dto/reply-message.dto';

@UseGuards(AuthGuard)
@UseInterceptors(TransformInterceptor)
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactService: ContactsService) {}

  @Post()
  @AllowGuest()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.contactService.create(createMessageDto);
  }

  @Get()
  findAll(@Query() filters: FilterMessage) {
    return this.contactService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.contactService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number) {
    return this.contactService.remove(id);
  }

  @Post(':id/reply')
  @HttpCode(HttpStatus.OK)
  reply(@Param('id') id: number, @Body() replyMessage: ReplyMessageDto) {
    return this.contactService.reply(id, replyMessage);
  }
}
