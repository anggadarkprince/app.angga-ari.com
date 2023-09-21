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
} from '@nestjs/common';
import { ExpertisesService } from './expertises.service';
import { CreateExpertiseDto } from './dto/create-expertise.dto';
import { UpdateExpertiseDto } from './dto/update-expertise.dto';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { FilterExpertise } from './dto/filter-expertise.dto';

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
  async findOne(@Param('id') id: string) {
    const expertise = await this.expertisesService.findOne(+id);

    if (expertise === undefined) {
      throw new NotFoundException('Expertise not found');
    }

    return expertise;
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
