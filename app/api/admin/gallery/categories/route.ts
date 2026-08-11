import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import GalleryCategory from '@/models/GalleryCategory';
import GalleryItem from '@/models/GalleryItem';

const DEFAULT_CATEGORIES = ['Festivals', 'Culture', 'Youth', 'Community', 'Sports', 'Other'];

async function getCategoryListAndStats() {
  const [dbCategories, items] = await Promise.all([
    GalleryCategory.find().sort({ order: 1, createdAt: 1 }).lean(),
    GalleryItem.find({}, 'category').lean(),
  ]);

  const set = new Set<string>();
  DEFAULT_CATEGORIES.forEach((c) => set.add(c));
  dbCategories.forEach((c: any) => set.add(c.name));
  items.forEach((item: any) => item.category && set.add(item.category));

  const allCategories = Array.from(set);

  // Calculate counts per category
  const countMap: Record<string, number> = {};
  items.forEach((item: any) => {
    const cat = item.category || 'Other';
    countMap[cat] = (countMap[cat] || 0) + 1;
  });

  const categoryStats = allCategories.map((name) => ({
    name,
    count: countMap[name] || 0,
    isDefault: DEFAULT_CATEGORIES.includes(name),
  }));

  return { allCategories, categoryStats, totalPhotos: items.length };
}

export async function GET() {
  try {
    await dbConnect();

    const count = await GalleryCategory.countDocuments();
    if (count === 0) {
      for (let i = 0; i < DEFAULT_CATEGORIES.length; i++) {
        await GalleryCategory.create({ name: DEFAULT_CATEGORIES[i], order: i });
      }
    }

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
        { success: false, message: 'Both old and new category names are required' },
        { status: 400 }
      );
    }

    if (cleanOld === cleanNew) {
      return NextResponse.json({ success: true, message: 'No changes made' });
    }

    await dbConnect();

    // Update in GalleryCategory
    await GalleryCategory.findOneAndUpdate(
      { name: cleanOld },
      { name: cleanNew },
      { upsert: true }
    );

    // Update all photos currently using the old category name
    const updateResult = await GalleryItem.updateMany(
      { category: cleanOld },
      { $set: { category: cleanNew } }
    );

    const { allCategories, categoryStats } = await getCategoryListAndStats();

    return NextResponse.json({
      success: true,
      message: `Renamed category to "${cleanNew}" and updated ${updateResult.modifiedCount} photo(s)`,
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
    const name = searchParams.get('name');
    const deletePhotos = searchParams.get('deletePhotos') === 'true';
    const targetCategory = searchParams.get('targetCategory') || 'Other';

    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Category name is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Remove from category registry
    await GalleryCategory.findOneAndDelete({ name });

    let actionSummary = '';
    if (deletePhotos) {
      const delResult = await GalleryItem.deleteMany({ category: name });
      actionSummary = `Deleted category "${name}" and removed ${delResult.deletedCount} associated photo(s)`;
    } else {
      // Reassign to target category (e.g. 'Other')
      const reassignResult = await GalleryItem.updateMany(
        { category: name },
        { $set: { category: targetCategory } }
      );
      actionSummary = `Deleted category "${name}" and moved ${reassignResult.modifiedCount} photo(s) to "${targetCategory}"`;
    }

    const { allCategories, categoryStats } = await getCategoryListAndStats();

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
