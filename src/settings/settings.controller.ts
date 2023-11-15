import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingDto } from './dto/setting.dto';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingService: SettingsService) {}

  @Get()
  findAll() {
    return this.settingService.findAll();
  }

  @Patch()
  update(@Param('id') id: string, @Body() settingDto: SettingDto) {
    return this.settingService.update(settingDto);
  }
}
