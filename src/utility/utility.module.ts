import { Global, Module } from '@nestjs/common';
import { UtilityService } from './utility.service';
import { FileService } from './file.service';

@Global()
@Module({
  providers: [UtilityService, FileService],
  exports: [UtilityService, FileService],
})
export class UtilityModule {}
