import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  HttpCode,
  HttpStatus,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ExpertisesService } from './expertises.service';
import { CreateExpertiseDto } from './dto/create-expertise.dto';
import { UpdateExpertiseDto } from './dto/update-expertise.dto';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { FilterExpertise } from './dto/filter-expertise.dto';
import { TransformInterceptor } from '../common/interceptors/transformer.interceptor';

@UseInterceptors(TransformInterceptor)
@Controller('expertises')
export class ExpertisesController {
  constructor(private readonly expertisesService: ExpertisesService) {}

  @Post()
  create(
    @Body() createExpertiseDto: CreateExpertiseDto,
    @CurrentUser() user: User,
  ) {
    return this.expertisesService.create(createExpertiseDto, user);
  }

  @Get()
  findAll(@Query() filter: FilterExpertise) {
    return this.expertisesService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expertisesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExpertiseDto: UpdateExpertiseDto,
  ) {
    return this.expertisesService.update(+id, updateExpertiseDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.expertisesService.remove(+id);
  }
}
