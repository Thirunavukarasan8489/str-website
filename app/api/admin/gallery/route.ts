import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { dbConnect } from '@/lib/db';
import GalleryItem from '@/models/GalleryItem';
import { deleteCloudinaryImage } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function revalidateGalleryPages() {
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
    const items = await GalleryItem.find().sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ success: true, items });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch gallery items' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await dbConnect();

    // 1. Bulk Batch Photo Insertion
    if (Array.isArray(data.items) && data.items.length > 0) {
      const itemsToInsert = data.items.map((item: any, idx: number) => ({
        title: item.title || `Photo #${idx + 1}`,
        category: item.category || 'General',
        albumSlug: (item.albumSlug || '').trim(),
        imageUrl: item.imageUrl,
        alt: item.alt || item.title || 'Gallery Photo',
        caption: item.caption || '',
        date: item.date || new Date().getFullYear().toString(),
        order: item.order !== undefined ? item.order : idx,
        isFeatured: Boolean(item.isFeatured),
      }));

      const inserted = await GalleryItem.insertMany(itemsToInsert);
      revalidateGalleryPages();

      return NextResponse.json({
        success: true,
        message: `Successfully uploaded ${inserted.length} photos!`,
        count: inserted.length,
        items: inserted,
      });
    }

    // 2. Single Photo Insertion
    if (!data.title || !data.imageUrl) {
      return NextResponse.json(
        { success: false, message: 'Title and Image URL are required' },
        { status: 400 }
      );
    }

    const newItem = await GalleryItem.create({
      title: data.title,
      category: data.category || 'General',
      albumSlug: (data.albumSlug || '').trim(),
      imageUrl: data.imageUrl,
      alt: data.alt || data.title,
      caption: data.caption || '',
      date: data.date || new Date().getFullYear().toString(),
      order: data.order || 0,
      isFeatured: Boolean(data.isFeatured),
    });

    revalidateGalleryPages();

    return NextResponse.json({
      success: true,
      message: 'Gallery item added successfully',
      item: newItem,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to add gallery item' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const itemId = data.id || data._id;

    if (!itemId) {
      return NextResponse.json(
        { success: false, message: 'Item ID is required for update' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Clean update fields to avoid modifying immutable fields like _id
    const updateFields: Record<string, any> = {};
    if (data.title !== undefined) updateFields.title = data.title;
    if (data.category !== undefined) updateFields.category = data.category;
    if (data.albumSlug !== undefined) updateFields.albumSlug = (data.albumSlug || '').trim();
    if (data.imageUrl !== undefined) updateFields.imageUrl = data.imageUrl;
    if (data.alt !== undefined) updateFields.alt = data.alt;
    if (data.caption !== undefined) updateFields.caption = data.caption;
    if (data.date !== undefined) updateFields.date = data.date;
    if (data.order !== undefined) updateFields.order = data.order;
    if (data.isFeatured !== undefined) updateFields.isFeatured = Boolean(data.isFeatured);

    const updated = await GalleryItem.findByIdAndUpdate(
      itemId,
      { $set: updateFields },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Photo not found' }, { status: 404 });
    }

    revalidateGalleryPages();

    return NextResponse.json({
      success: true,
      message: 'Gallery photo updated successfully',
      item: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update gallery photo' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const ids = searchParams.get('ids');

    await dbConnect();

    // Bulk deletion
    if (ids) {
      const idList = ids.split(',').map((s) => s.trim()).filter(Boolean);
      const itemsToDelete = await GalleryItem.find({ _id: { $in: idList } });

      // Delete each image from Cloudinary
      for (const item of itemsToDelete) {
        if (item.imageUrl) {
          await deleteCloudinaryImage(item.imageUrl);
        }
      }

      const res = await GalleryItem.deleteMany({ _id: { $in: idList } });
      revalidateGalleryPages();

      return NextResponse.json({
        success: true,
        message: `Deleted ${res.deletedCount} photo(s) and cleaned from Cloudinary successfully`,
      });
    }

    // Single item deletion
    if (id) {
      const item = await GalleryItem.findById(id);
      if (item && item.imageUrl) {
        await deleteCloudinaryImage(item.imageUrl);
      }
      await GalleryItem.findByIdAndDelete(id);
      revalidateGalleryPages();

      return NextResponse.json({
        success: true,
        message: 'Gallery photo deleted and cleaned from Cloudinary successfully',
      });
    }

    return NextResponse.json(
      { success: false, message: 'Item ID or IDs list is required for deletion' },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete gallery item' },
      { status: 500 }
    );
  }
}
