import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import GalleryAlbum from '@/models/GalleryAlbum';
import GalleryItem from '@/models/GalleryItem';
import { GALLERY_ALBUMS_DATA } from '@/lib/data';

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET() {
  try {
    await dbConnect();
    const count = await GalleryAlbum.countDocuments();
    if (count === 0) {
      for (let i = 0; i < GALLERY_ALBUMS_DATA.length; i++) {
        const alb = GALLERY_ALBUMS_DATA[i];
        await GalleryAlbum.create({
          title: alb.title,
          slug: alb.slug,
          category: alb.category,
          description: alb.description,
          coverImage: alb.coverImage,
          date: alb.date,
          order: i,
          isPublished: true,
        });
      }
    }

    const [albums, photos] = await Promise.all([
      GalleryAlbum.find().sort({ order: 1, createdAt: -1 }).lean(),
      GalleryItem.find({}, 'albumSlug category').lean(),
    ]);

    const enriched = albums.map((alb: any) => {
      const albumPhotosCount = photos.filter(
        (p: any) =>
          p.albumSlug === alb.slug ||
          (!p.albumSlug && p.category?.toLowerCase() === alb.category?.toLowerCase())
      ).length;

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
      if (deletePhotos) {
        await GalleryItem.deleteMany({ albumSlug: album.slug });
      } else {
        // Unlink photos
        await GalleryItem.updateMany({ albumSlug: album.slug }, { $set: { albumSlug: '' } });
      }
      await GalleryAlbum.findByIdAndDelete(id);
    }

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
