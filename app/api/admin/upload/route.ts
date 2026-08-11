import { NextResponse } from 'next/server';
import { uploadImageBuffer } from '@/lib/cloudinary';

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';

    let secureUrl = '';
    let publicId = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      const folder = (formData.get('folder') as string) || 'str-website';

      if (!file) {
        return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await uploadImageBuffer(buffer, folder);
      secureUrl = result.secure_url;
      publicId = result.public_id;
    } else {
      const body = await request.json();
      const { imageBase64, folder = 'str-website' } = body;

      if (!imageBase64) {
        return NextResponse.json({ success: false, message: 'No image data provided' }, { status: 400 });
      }

      const result = await uploadImageBuffer(imageBase64, folder);
      secureUrl = result.secure_url;
      publicId = result.public_id;
    }

    return NextResponse.json({
      success: true,
      url: secureUrl,
      secure_url: secureUrl,
      public_id: publicId,
    });
  } catch (error: any) {
    console.error('Cloudinary Upload Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to upload photo to Cloudinary.',
      },
      { status: 500 }
    );
  }
}
