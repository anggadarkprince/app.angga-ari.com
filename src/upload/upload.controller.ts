import {Body, Controller, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {UploadService} from "./upload.service";
import {UploadDto} from "./dto/upload.dto";

@Controller('upload')
export class UploadController {

    constructor(private uploadService: UploadService) {
    }

    @Post('file')
    @UseInterceptors(FileInterceptor('file'/*, {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
                const uploadService = new UploadService();
                callback(null, uploadService.generateFileName(file.originalname));
            },
        }),
    }*/))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body: UploadDto) {
        const result = await this.uploadService.storeTo(file, {path: 'temp', driver: body.driver});
        return {
            title: body.title || file.originalname,
            uploadedPath: result.uploadedPath,
            storage: result.driver,
            mimeType: file.mimetype,
            originalName: file.originalname,
            size: file.size,
            url: result.url,
        };
    }
}
