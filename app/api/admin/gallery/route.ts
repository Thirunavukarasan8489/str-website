import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import GalleryItem from '@/models/GalleryItem';
import { GALLERY_DATA } from '@/lib/data';

const CATEGORY_DEFAULT_SLUGS: Record<string, string> = {
  Festivals: 'scotland-tamil-pongal-vizha-2026',
  Culture: 'tamil-traditional-arts-and-culture',
  Youth: 'youth-leadership-and-arts-academy',
  Community: 'community-grand-banquet-glasgow',
  Sports: 'scottish-highland-walk-and-sports',
};

export async function GET() {
  try {
    await dbConnect();
    const count = await GalleryItem.countDocuments();
    if (count === 0) {
      // Seed default items
      for (let i = 0; i < GALLERY_DATA.length; i++) {
        const item = GALLERY_DATA[i];
        await GalleryItem.create({
          title: item.title,
          category: item.category,
          albumSlug: item.albumSlug || CATEGORY_DEFAULT_SLUGS[item.category] || '',
          imageUrl: item.imageUrl,
          alt: item.alt,
          caption: item.caption,
          date: item.date,
          order: i,
        });
      }
    } else {
      // Backfill any photos with missing or empty albumSlug
      const itemsWithoutSlug = await GalleryItem.find({
        $or: [{ albumSlug: { $exists: false } }, { albumSlug: '' }, { albumSlug: null }],
      });

      if (itemsWithoutSlug.length > 0) {
        for (const item of itemsWithoutSlug) {
          const matchedData = GALLERY_DATA.find((g) => g.title === item.title || g.imageUrl === item.imageUrl);
          const slug = matchedData?.albumSlug || CATEGORY_DEFAULT_SLUGS[item.category] || '';
          if (slug) {
            await GalleryItem.updateOne({ _id: item._id }, { $set: { albumSlug: slug } });
          }
        }
      }
    }

    const items = await GalleryItem.find().sort({ order: 1, createdAt: -1 });
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
        category: item.category || 'Festivals',
        albumSlug: item.albumSlug || CATEGORY_DEFAULT_SLUGS[item.category] || '',
        imageUrl: item.imageUrl,
        alt: item.alt || item.title || 'Gallery Photo',
        caption: item.caption || '',
        date: item.date || new Date().getFullYear().toString(),
        order: item.order !== undefined ? item.order : idx,
        isFeatured: Boolean(item.isFeatured),
      }));

      const inserted = await GalleryItem.insertMany(itemsToInsert);

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
      category: data.category || 'Festivals',
      albumSlug: data.albumSlug || CATEGORY_DEFAULT_SLUGS[data.category] || '',
      imageUrl: data.imageUrl,
      alt: data.alt || data.title,
      caption: data.caption || '',
      date: data.date || new Date().getFullYear().toString(),
      order: data.order || 0,
      isFeatured: Boolean(data.isFeatured),
    });

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
    const { id, _id, ...updateData } = data;
    const itemId = id || _id;

    if (!itemId) {
      return NextResponse.json(
        { success: false, message: 'Item ID is required for update' },
        { status: 400 }
      );
    }

    await dbConnect();
    const updated = await GalleryItem.findByIdAndUpdate(itemId, { $set: updateData }, { new: true });

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Gallery item updated successfully',
      item: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update gallery item' },
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
      const res = await GalleryItem.deleteMany({ _id: { $in: idList } });
      return NextResponse.json({
        success: true,
        message: `Deleted ${res.deletedCount} photo(s) successfully`,
      });
    }

    // Single item deletion
    if (id) {
      await GalleryItem.findByIdAndDelete(id);
      return NextResponse.json({
        success: true,
        message: 'Gallery photo deleted successfully',
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
