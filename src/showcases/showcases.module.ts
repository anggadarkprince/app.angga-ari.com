import { Module } from '@nestjs/common';
import { ShowcasesController } from './showcases.controller';
import { ShowcasesService } from './showcases.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Showcase } from './entities/showcase.entity';
import { ShowcasePhoto } from './entities/showcase-photo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Showcase, ShowcasePhoto])],
  controllers: [ShowcasesController],
  providers: [ShowcasesService],
})
export class ShowcasesModule {}
