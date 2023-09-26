import fs from 'fs';
import { promisify } from 'util';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileService {
  checkIfFileOrDirectoryExists = (path: string): boolean => {
    return fs.existsSync(path);
  };

  getFile = async (
    path: string,
    encoding?: BufferEncoding,
  ): Promise<string | Buffer> => {
    const readFile = promisify(fs.readFile);

    return encoding ? readFile(path, encoding) : readFile(path, {});
  };

  createFile = async (
    path: string,
    fileName: string,
    data: string,
  ): Promise<void> => {
    if (!this.checkIfFileOrDirectoryExists(path)) {
      fs.mkdirSync(path);
    }

    const writeFile = promisify(fs.writeFile);

    return await writeFile(`${path}/${fileName}`, data, 'utf8');
  };

  deleteFile = async (path: string): Promise<void> => {
    const unlink = promisify(fs.unlink);

    return await unlink(path);
  };
}
