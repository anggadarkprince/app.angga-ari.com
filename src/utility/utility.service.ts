import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class UtilityService {
  algorithm = 'aes-256-cbc';
  key = crypto.randomBytes(32);
  iv = crypto.randomBytes(16);

  encrypt(text: string) {
    const cipher = crypto.createCipheriv(
      this.algorithm,
      Buffer.from(this.key),
      this.iv,
    );
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {
      iv: this.iv.toString('hex'),
      encryptedData: encrypted.toString('hex'),
    };
  }

  decrypt(text: { iv: string; encryptedData: string }) {
    const iv = Buffer.from(text.iv, 'hex');
    const encryptedText = Buffer.from(text.encryptedData, 'hex');
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      Buffer.from(this.key),
      iv,
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}
