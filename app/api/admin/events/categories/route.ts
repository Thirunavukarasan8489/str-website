import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { dbConnect } from '@/lib/db';
import EventCategory from '@/models/EventCategory';
import EventItem from '@/models/EventItem';

async function getEventCategoryListAndStats() {
  const [dbCategories, events] = await Promise.all([
    EventCategory.find().sort({ order: 1, createdAt: 1 }).lean(),
    EventItem.find({}, 'category').lean(),
  ]);

  const set = new Set<string>();
  dbCategories.forEach((c: any) => c.name && set.add(c.name.trim()));
  events.forEach((item: any) => item.category && set.add(item.category.trim()));

  const allCategories = Array.from(set).filter(Boolean);

  // Calculate event counts per category
  const countMap: Record<string, number> = {};
  events.forEach((item: any) => {
    const cat = (item.category || '').trim();
    if (cat) {
      countMap[cat] = (countMap[cat] || 0) + 1;
    }
  });

  const categoryStats = allCategories.map((name) => ({
    name,
    count: countMap[name] || 0,
  }));

  return { allCategories, categoryStats, totalEvents: events.length };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function revalidateEventPages() {
  try {
    revalidatePath('/', 'page');
    revalidatePath('/');
    revalidatePath('/events', 'page');
    revalidatePath('/events');
    revalidatePath('/events/[slug]', 'page');
  } catch (err) {
    console.warn('Revalidation warning:', err);
  }
}

// GET /api/admin/events/categories
export async function GET() {
  try {
    await dbConnect();
    const { allCategories, categoryStats, totalEvents } = await getEventCategoryListAndStats();

    return NextResponse.json({
      success: true,
      categories: allCategories,
      categoryStats,
      totalEvents,
    });
  } catch (error: any) {
    console.error('Error fetching event categories:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch event categories' },
      { status: 500 }
    );
  }
}

// POST /api/admin/events/categories
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
    await EventCategory.findOneAndUpdate(
      { name: cleanName },
      { name: cleanName },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const { allCategories, categoryStats } = await getEventCategoryListAndStats();
    revalidateEventPages();

    return NextResponse.json({
      success: true,
      message: `Event category "${cleanName}" created successfully`,
      category: cleanName,
      categories: allCategories,
      categoryStats,
    });
  } catch (error: any) {
    console.error('Error creating event category:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create event category' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/events/categories
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
    await EventCategory.findOneAndUpdate(
      { name: cleanOld },
      { name: cleanNew },
      { upsert: true }
    );

    // Update all events currently using the old category name
    await EventItem.updateMany({ category: cleanOld }, { $set: { category: cleanNew } });

    const { allCategories, categoryStats } = await getEventCategoryListAndStats();
    revalidateEventPages();

    return NextResponse.json({
      success: true,
      message: `Renamed event category to "${cleanNew}"`,
      categories: allCategories,
      categoryStats,
    });
  } catch (error: any) {
    console.error('Error renaming event category:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to rename event category' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/events/categories
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name')?.trim();
    const targetCategory = searchParams.get('targetCategory')?.trim() || '';

    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Category name is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Remove from category registry
    await EventCategory.deleteMany({ name });

    let actionSummary = '';
    if (targetCategory) {
      await EventItem.updateMany({ category: name }, { $set: { category: targetCategory } });
      actionSummary = `Deleted category "${name}" and reassigned events to "${targetCategory}".`;
    } else {
      await EventItem.updateMany({ category: name }, { $set: { category: 'General' } });
      actionSummary = `Deleted category "${name}".`;
    }

    const { allCategories, categoryStats } = await getEventCategoryListAndStats();
    revalidateEventPages();

    return NextResponse.json({
      success: true,
      message: actionSummary,
      categories: allCategories,
      categoryStats,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete event category' },
      { status: 500 }
    );
  }
}
