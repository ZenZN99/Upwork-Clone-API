import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import streamifier from 'streamifier';
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export const uploadToCloudinary = (
  file: Express.Multer.File,
  folder: string,
) => {
  return new Promise<any>((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { folder },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      },
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};