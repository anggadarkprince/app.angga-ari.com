import { Injectable, NotFoundException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { UploadResultDto } from './dto/upload-result.dto';
import * as S3 from 'aws-sdk/clients/s3';
import { Readable } from 'stream';

export type StorageType = 'local' | 's3';

interface UploadOptions {
  path?: string;
  driver?: StorageType;
  acl?: string;
}

@Injectable()
export class UploadService {
  public readonly basePath;
  private readonly s3;
  private defaultDriver;

  constructor(private configService: ConfigService) {
    this.basePath = this.configService.get('storage.dest');
    this.s3 = this.configService.get('storage.s3');
    this.defaultDriver = this.configService.get('storage.driver');
    if (this.defaultDriver == 's3') {
      this.basePath = this.s3.bucket;
    }
  }

  generateFileName(originalName: string) {
    const name = originalName.split('.')[0];
    const fileExtName = path.extname(originalName);
    const randomName = Array(4)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');

    return `${name}-${randomName}${fileExtName}`;
  }

  driver(driver?: StorageType) {
    if (!driver) {
      return this.defaultDriver;
    }
    this.defaultDriver = driver;
  }

  async storeTo(
    file: Express.Multer.File,
    uploadOptions: UploadOptions = {},
  ): Promise<UploadResultDto> {
    const options = Object.assign(
      {
        path: '',
        driver: this.defaultDriver,
        acl: 'public-read',
      },
      uploadOptions,
    );
    const fileName = this.generateFileName(file.originalname);
    const driver = options.driver || this.defaultDriver;

    if (driver === 's3') {
      const uploadPathFile = `${options.path || ''}/${fileName}`;
      const s3 = new S3({
        endpoint: this.s3.endpoint,
        accessKeyId: this.s3.accessKey,
        secretAccessKey: this.s3.secretKey,
      });
      const params = {
        Bucket: this.s3.bucket,
        Key: uploadPathFile,
        Body: file.buffer,
        ACL: options.acl,
        ContentType: file.mimetype,
        ContentDisposition: 'inline',
        CreateBucketConfiguration: {
          LocationConstraint: this.s3.region || 'ap-south-1',
        },
      };

      return new Promise(async function (resolve, reject) {
        try {
          const s3Response = await s3.upload(params).promise();
          resolve({
            uploadedPath: uploadPathFile,
            source: file,
            mimeType: file.mimetype,
            size: file.size,
            url: s3Response.Location,
            driver: driver,
          });
        } catch (e) {
          reject(e);
        }
      });
    } else if (driver === 'local') {
      const uploadPathFile = `${this.basePath}/${
        options.path || ''
      }/${fileName}`;
      return new Promise((resolve, reject) => {
        fs.writeFile(uploadPathFile, file.buffer, (err) => {
          if (err) reject(err);
          else
            resolve({
              uploadedPath: uploadPathFile,
              source: file,
              mimeType: file.mimetype,
              size: file.size,
              url: `${this.configService.get('app.url')}/${uploadPathFile}`,
              driver: driver,
            });
        });
      });
    } else {
      throw Error('Invalid storage driver, [s3, local] available');
    }
  }

  getUrl(path: string) {
    return this.basePath + '/' + path;
  }

  getStream(key: string) {
    const s3 = new S3({
      endpoint: this.s3.endpoint,
      accessKeyId: this.s3.accessKey,
      secretAccessKey: this.s3.secretKey,
    });
    const getObject = s3.getObject({
      Bucket: this.s3.bucket,
      Key: key,
    });
    return getObject.createReadStream();
  }
}
