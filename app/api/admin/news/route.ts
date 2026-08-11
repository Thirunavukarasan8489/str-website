import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import NewsArticle from '@/models/NewsArticle';
import { NEWS_DATA } from '@/lib/data';

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
    const articles = await NewsArticle.find().sort({ date: -1, createdAt: -1 });
    return NextResponse.json({ success: true, articles });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch news articles' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.title || !data.content) {
      return NextResponse.json(
        { success: false, message: 'Title and content are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const slug = data.slug ? generateSlug(data.slug) : generateSlug(data.title);
    const existing = await NewsArticle.findOne({ slug });
    const finalSlug = existing ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

    const newArticle = await NewsArticle.create({
      title: data.title,
      slug: finalSlug,
      summary: data.summary || data.content.slice(0, 160) + '...',
      content: data.content,
      date: data.date || new Date().toISOString().split('T')[0],
      author: data.author || 'Editorial Team',
      category: data.category || 'Announcement',
      image:
        data.image ||
        'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
      readTime: data.readTime || '3 min read',
      isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
    });

    return NextResponse.json({
      success: true,
      message: 'News article published successfully',
      article: newArticle,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create news article' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, _id, ...updateData } = data;
    const articleId = id || _id;

    if (!articleId) {
      return NextResponse.json(
        { success: false, message: 'Article ID is required for update' },
        { status: 400 }
      );
    }

    if (updateData.slug) {
      updateData.slug = generateSlug(updateData.slug);
    }

    await dbConnect();
    const updated = await NewsArticle.findByIdAndUpdate(articleId, { $set: updateData }, { new: true });

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'News article updated successfully',
      article: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update news article' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Article ID is required for deletion' },
        { status: 400 }
      );
    }

    await dbConnect();
    await NewsArticle.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'News article deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete news article' },
      { status: 500 }
    );
  }
}
