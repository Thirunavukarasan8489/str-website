import { NextResponse } from 'next/server';
import { getEventsList } from '@/lib/contentService';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const category = searchParams.get('category');

  const allEvents = await getEventsList();
  let filtered = allEvents;

  if (city) {
    filtered = filtered.filter((e) => e.city.toLowerCase() === city.toLowerCase());
  }
  if (category) {
    filtered = filtered.filter((e) => e.category.toLowerCase() === category.toLowerCase());
  }

  return NextResponse.json({ events: filtered });
}
