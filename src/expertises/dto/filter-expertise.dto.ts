import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterExpertise {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : null))
  section_id?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    return value.toString().toLowerCase() === 'true' || +value === 1;
  })
  group?: boolean;
}
