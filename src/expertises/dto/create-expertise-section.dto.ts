import { PickType } from '@nestjs/mapped-types';
import { CreateExpertiseDto } from './create-expertise.dto';

export class CreateExpertiseSectionDto extends PickType(CreateExpertiseDto, [
  'title',
  'subtitle',
  'icon',
] as const) {}
