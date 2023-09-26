import {
  Body,
  Controller,
  Delete,
  Get, Header,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res, StreamableFile,
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
import { createReadStream } from 'fs';

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

  @Get('export')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="contacts.csv"')
  async exportToCsv(@Query() filters: FilterMessage) {
    const path = await this.contactService.exportToCsv(filters);
    const file = createReadStream(path);
    return new StreamableFile(file);
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

  @Patch(':id/reject')
  reject(@Param('id') id: number) {
    return this.contactService.reject(id);
  }

  @Patch(':id/hold')
  hold(@Param('id') id: number) {
    return this.contactService.hold(id);
  }
}
