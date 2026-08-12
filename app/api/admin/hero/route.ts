import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { dbConnect } from '@/lib/db';
import HeroContent from '@/models/HeroContent';
import { DEFAULT_HERO_DATA } from '@/lib/contentService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await dbConnect();
    let hero = await HeroContent.findOne();
    if (!hero) {
      hero = await HeroContent.create(DEFAULT_HERO_DATA);
    }
    return NextResponse.json({ success: true, hero });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch hero content' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    await dbConnect();

    const hero = await HeroContent.findOneAndUpdate(
      {},
      { $set: data },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // Immediate on-demand ISR cache purge for homepage
    try {
      revalidatePath('/', 'page');
      revalidatePath('/');
    } catch (revalidateErr) {
      console.warn('Revalidation error:', revalidateErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Hero section updated successfully',
      hero,
    });
  } catch (error: any) {
    console.error('Hero update error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update hero content' },
      { status: 500 }
    );
  }
}
