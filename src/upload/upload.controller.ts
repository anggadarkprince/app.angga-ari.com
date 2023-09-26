import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import * as path from 'path';
import * as mime from 'mime-types';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { UploadDto } from './dto/upload.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { TransformInterceptor } from '../common/interceptors/transformer.interceptor';

@UseGuards(AuthGuard)
@UseInterceptors(TransformInterceptor)
@Controller()
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor(
      'file' /*, {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
                const uploadService = new UploadService();
                callback(null, uploadService.generateFileName(file.originalname));
            },
        }),
    }*/,
    ),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadDto,
  ) {
    const result = await this.uploadService.storeTo(file, {
      path: 'temp',
      driver: body.driver,
    });
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

  @Get('storage')
  async getUploadedFile(@Query() query, @Res() res) {
    let { key, driver } = query;
    if (!driver) {
      driver = this.uploadService.driver();
    }

    try {
      if (driver === 's3') {
        res.set({
          'Content-Disposition': `inline; filename="${path.basename(key)}"`,
          'Content-Type': mime.lookup(key) || 'application/octet-stream',
        });
        const stream = this.uploadService.getStream(key);

        return stream.pipe(res);
      } else {
        return res.sendFile(path, { root: this.uploadService.basePath });
      }
    } catch (e) {
      throw new NotFoundException();
    }
  }
}
