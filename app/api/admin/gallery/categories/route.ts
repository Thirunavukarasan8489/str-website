import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { dbConnect } from '@/lib/db';
import GalleryCategory from '@/models/GalleryCategory';
import GalleryItem from '@/models/GalleryItem';
import GalleryAlbum from '@/models/GalleryAlbum';
import { deleteCloudinaryImage } from '@/lib/cloudinary';

async function getCategoryListAndStats() {
  const [dbCategories, items, albumCategories] = await Promise.all([
    GalleryCategory.find().sort({ order: 1, createdAt: 1 }).lean(),
    GalleryItem.find({}, 'category imageUrl').lean(),
    GalleryAlbum.distinct('category'),
  ]);

  const set = new Set<string>();
  dbCategories.forEach((c: any) => c.name && set.add(c.name.trim()));
  items.forEach((item: any) => item.category && set.add(item.category.trim()));
  albumCategories.forEach((cat: string) => cat && set.add(cat.trim()));

  const allCategories = Array.from(set).filter(Boolean);

  // Calculate photo counts per category
  const countMap: Record<string, number> = {};
  items.forEach((item: any) => {
    const cat = (item.category || '').trim();
    if (cat) {
      countMap[cat] = (countMap[cat] || 0) + 1;
    }
  });

  const categoryStats = allCategories.map((name) => ({
    name,
    count: countMap[name] || 0,
    isDefault: false,
  }));

  return { allCategories, categoryStats, totalPhotos: items.length };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function revalidateCategoryPages() {
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
    const { allCategories, categoryStats, totalPhotos } = await getCategoryListAndStats();

    return NextResponse.json({
      success: true,
      categories: allCategories,
      categoryStats,
      totalPhotos,
    });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    const cleanName = name?.trim();

    if (!cleanName) {
      return NextResponse.json(
        { success: false, message: 'Category name cannot be empty' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Upsert category in DB
    await GalleryCategory.findOneAndUpdate(
      { name: cleanName },
      { name: cleanName },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const { allCategories, categoryStats } = await getCategoryListAndStats();
    revalidateCategoryPages();

    return NextResponse.json({
      success: true,
      message: `Category "${cleanName}" created successfully`,
      category: cleanName,
      categories: allCategories,
      categoryStats,
    });
  } catch (error: any) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create category' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { oldName, newName } = await request.json();
    const cleanOld = oldName?.trim();
    const cleanNew = newName?.trim();

    if (!cleanOld || !cleanNew) {
      return NextResponse.json(
        { success: false, message: 'Old and new category names are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Update in category registry
    await GalleryCategory.findOneAndUpdate(
      { name: cleanOld },
      { name: cleanNew },
      { upsert: true }
    );

    // Update all photos currently using the old category name
    const [itemUpdate, albumUpdate] = await Promise.all([
      GalleryItem.updateMany({ category: cleanOld }, { $set: { category: cleanNew } }),
      GalleryAlbum.updateMany({ category: cleanOld }, { $set: { category: cleanNew } }),
    ]);

    const { allCategories, categoryStats } = await getCategoryListAndStats();
    revalidateCategoryPages();

    return NextResponse.json({
      success: true,
      message: `Renamed category to "${cleanNew}"`,
      categories: allCategories,
      categoryStats,
    });
  } catch (error: any) {
    console.error('Error renaming category:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to rename category' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name')?.trim();
    const deletePhotos = searchParams.get('deletePhotos') === 'true';
    const targetCategory = searchParams.get('targetCategory')?.trim() || '';

    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Category name is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Remove from category registry
    await GalleryCategory.deleteMany({ name });

    let actionSummary = '';
    if (deletePhotos) {
      const photosToDelete = await GalleryItem.find({ category: name });
      for (const p of photosToDelete) {
        if (p.imageUrl) {
          await deleteCloudinaryImage(p.imageUrl);
        }
      }
      const delResult = await GalleryItem.deleteMany({ category: name });
      actionSummary = `Deleted category "${name}" and removed ${delResult.deletedCount} photo(s) from database and Cloudinary.`;
    } else {
      if (targetCategory) {
        await Promise.all([
          GalleryItem.updateMany({ category: name }, { $set: { category: targetCategory } }),
          GalleryAlbum.updateMany({ category: name }, { $set: { category: targetCategory } }),
        ]);
        actionSummary = `Deleted category "${name}" and reassigned items to "${targetCategory}".`;
      } else {
        // Just remove category from items
        await Promise.all([
          GalleryItem.updateMany({ category: name }, { $set: { category: 'General' } }),
          GalleryAlbum.updateMany({ category: name }, { $set: { category: 'General' } }),
        ]);
        actionSummary = `Deleted category "${name}".`;
      }
    }

    const { allCategories, categoryStats } = await getCategoryListAndStats();
    revalidateCategoryPages();

    return NextResponse.json({
      success: true,
      message: actionSummary,
      categories: allCategories,
      categoryStats,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete category' },
      { status: 500 }
    );
  }
}
