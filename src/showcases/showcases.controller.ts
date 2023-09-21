import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ShowcasesService } from './showcases.service';
import { CreateShowcaseDto } from './dto/create-showcase.dto';
import { UpdateShowcaseDto } from './dto/update-showcase.dto';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('showcases')
export class ShowcasesController {
  constructor(private showcaseService: ShowcasesService) {}

  @Post()
  async create(
    @Body() createShowcaseDto: CreateShowcaseDto,
    @CurrentUser() user,
  ) {
    return this.showcaseService.create(createShowcaseDto, user);
  }

  @Get()
  findAll() {
    return this.showcaseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.showcaseService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateShowcaseDto: UpdateShowcaseDto,
  ) {
    return this.showcaseService.update(+id, updateShowcaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.showcaseService.remove(+id);
  }
}
