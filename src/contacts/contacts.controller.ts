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
  UseInterceptors,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { FilterMessage } from './dto/filter-message.dto';
import { TransformInterceptor } from '../common/interceptors/transformer.interceptor';

@UseInterceptors(TransformInterceptor)
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactService: ContactsService) {}

  @Post()
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
}
