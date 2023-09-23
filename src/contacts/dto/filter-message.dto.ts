import { IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from '../../common/dto/page-options.dto';

export class FilterMessage extends PageOptionsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  project?: string;
}
