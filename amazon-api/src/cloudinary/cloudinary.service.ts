import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'streamifier';

cloudinary.config({
  cloud_name: 'djdygr0y7',
  api_key: '324775453454815',
  api_secret: 'yLqT5nP4HvXIpYgq_j6OQ57kz0Q',
});

@Injectable()
export class CloudinaryService {
  async uploadImage(buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'avatars' },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error('Error al subir imagen'));
          }
          resolve(result.secure_url);
        }
      );
      Readable.from(buffer).pipe(stream);
    });
  }
}
