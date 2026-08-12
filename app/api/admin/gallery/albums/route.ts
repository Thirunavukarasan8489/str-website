import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { dbConnect } from '@/lib/db';
import GalleryAlbum from '@/models/GalleryAlbum';
import GalleryItem from '@/models/GalleryItem';
import { GALLERY_ALBUMS_DATA } from '@/lib/data';
import { deleteCloudinaryImage } from '@/lib/cloudinary';

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function revalidateAlbumPages() {
  try {
    revalidatePath('/');
    revalidatePath('/gallery');
    revalidatePath('/gallery/[slug]', 'page');
  } catch (err) {
    console.warn('Revalidation warning:', err);
  }
}

export async function GET() {
  try {
    await dbConnect();

    const [albums, photos] = await Promise.all([
      GalleryAlbum.find().sort({ order: 1, createdAt: -1 }).lean(),
      GalleryItem.find({}, 'albumSlug category').lean(),
    ]);

    const enriched = albums.map((alb: any) => {
      const albumPhotosCount = photos.filter((p: any) => p.albumSlug === alb.slug).length;

      return {
        ...alb,
        id: alb._id.toString(),
        photoCount: albumPhotosCount,
      };
    });

    return NextResponse.json({ success: true, albums: enriched });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch albums' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.title || !data.coverImage) {
      return NextResponse.json(
        { success: false, message: 'Album Title and Cover Photo are required' },
        { status: 400 }
      );
    }

    await dbConnect();
    const slug = data.slug ? generateSlug(data.slug) : generateSlug(data.title);
    const existing = await GalleryAlbum.findOne({ slug });
    const finalSlug = existing ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

    const newAlbum = await GalleryAlbum.create({
      title: data.title,
      slug: finalSlug,
      category: data.category || 'Festivals',
      description: data.description || '',
      coverImage: data.coverImage,
      date: data.date || new Date().getFullYear().toString(),
      order: data.order || 0,
      isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
    });

    revalidateAlbumPages();

    return NextResponse.json({
      success: true,
      message: `Album "${newAlbum.title}" created successfully!`,
      album: newAlbum,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create album' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, _id, ...updateData } = data;
    const albumId = id || _id;

    if (!albumId) {
      return NextResponse.json(
        { success: false, message: 'Album ID is required for update' },
        { status: 400 }
      );
    }

    if (updateData.slug) {
      updateData.slug = generateSlug(updateData.slug);
    }

    await dbConnect();
    const oldAlbum = await GalleryAlbum.findById(albumId);
    const updated = await GalleryAlbum.findByIdAndUpdate(
      albumId,
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Album not found' }, { status: 404 });
    }

    // If slug changed, update all photos under the old slug
    if (oldAlbum && updateData.slug && oldAlbum.slug !== updateData.slug) {
      await GalleryItem.updateMany(
        { albumSlug: oldAlbum.slug },
        { $set: { albumSlug: updateData.slug } }
      );
    }

    revalidateAlbumPages();

    return NextResponse.json({
      success: true,
      message: 'Album updated successfully',
      album: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update album' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const deletePhotos = searchParams.get('deletePhotos') === 'true';

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Album ID is required for deletion' },
        { status: 400 }
      );
    }

    await dbConnect();
    const album = await GalleryAlbum.findById(id);

    if (album) {
      // Delete album cover from Cloudinary
      if (album.coverImage) {
        await deleteCloudinaryImage(album.coverImage);
      }

      if (deletePhotos) {
        // Find all photos belonging to this album and delete them from Cloudinary
        const photosToDelete = await GalleryItem.find({ albumSlug: album.slug });
        for (const p of photosToDelete) {
          if (p.imageUrl) {
            await deleteCloudinaryImage(p.imageUrl);
          }
        }
        // Delete photo records from MongoDB
        await GalleryItem.deleteMany({ albumSlug: album.slug });
      } else {
        // Unlink photos (keep in database & Cloudinary)
        await GalleryItem.updateMany({ albumSlug: album.slug }, { $set: { albumSlug: '' } });
      }

      // Delete album from MongoDB
      await GalleryAlbum.findByIdAndDelete(id);
    }

    revalidateAlbumPages();

    return NextResponse.json({
      success: true,
      message: 'Gallery album deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete album' },
      { status: 500 }
    );
  }
}
