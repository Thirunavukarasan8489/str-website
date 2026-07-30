import { NextResponse } from 'next/server';
import { EVENTS_DATA } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const category = searchParams.get('category');

  let filtered = EVENTS_DATA;
  if (city) {
    filtered = filtered.filter((e) => e.city.toLowerCase() === city.toLowerCase());
  }
  if (category) {
    filtered = filtered.filter((e) => e.category.toLowerCase() === category.toLowerCase());
  }

  return NextResponse.json({ events: filtered });
}
