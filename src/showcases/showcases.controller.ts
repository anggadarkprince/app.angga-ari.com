import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {ShowcasesService} from "./showcases.service";
import {CreateShowcaseDto} from "./dto/create-showcase.dto";
import {UpdateShowcaseDto} from "./dto/update-showcase.dto";

@Controller('showcases')
export class ShowcasesController {
    constructor(private showcaseService: ShowcasesService) {
    }

    @Post()
    async create(@Body() createShowcaseDto: CreateShowcaseDto) {
        return this.showcaseService.create(createShowcaseDto, null);
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
    update(@Param('id') id: string, @Body() updateShowcaseDto: UpdateShowcaseDto) {
        return this.showcaseService.update(+id, updateShowcaseDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.showcaseService.remove(+id);
    }
}
