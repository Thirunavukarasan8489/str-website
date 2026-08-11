import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true,
});

export default cloudinary;

/**
 * Extracts the Cloudinary public_id from a secure URL
 */
export function extractPublicId(imageUrl: string): string | null {
  if (!imageUrl || !imageUrl.includes('cloudinary.com')) return null;
  try {
    const parts = imageUrl.split('/upload/');
    if (parts.length < 2) return null;
    const afterUpload = parts[1];
    // Remove version prefix if present e.g. v1700000000/
    const withoutVersion = afterUpload.replace(/^v\d+\//, '');
    // Remove file extension e.g. .jpg, .png, .webp
    const publicId = withoutVersion.substring(0, withoutVersion.lastIndexOf('.')) || withoutVersion;
    return publicId;
  } catch {
    return null;
  }
}

/**
 * Deletes an image from Cloudinary by URL or public_id
 */
export async function deleteCloudinaryImage(imageUrlOrPublicId: string): Promise<boolean> {
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiKey || !apiSecret) return false;

  try {
    const publicId = imageUrlOrPublicId.includes('cloudinary.com')
      ? extractPublicId(imageUrlOrPublicId)
      : imageUrlOrPublicId;

    if (!publicId) return false;

    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return false;
  }
}

/**
 * Uploads a base64 string or buffer to Cloudinary
 */
export async function uploadImageBuffer(
  fileBuffer: Buffer | string,
  folder = 'str-website'
): Promise<{ url: string; public_id: string; secure_url: string }> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      'Cloudinary credentials are missing. Please configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file.'
    );
  }

  return new Promise((resolve, reject) => {
    if (typeof fileBuffer === 'string' && fileBuffer.startsWith('data:')) {
      // Data URI / Base64 upload
      cloudinary.uploader.upload(
        fileBuffer,
        {
          folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Cloudinary upload returned null.'));
          resolve({
            url: result.url,
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );
    } else {
      // Buffer upload stream
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Cloudinary upload returned null.'));
          resolve({
            url: result.url,
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );

      uploadStream.end(fileBuffer);
    }
  });
}
