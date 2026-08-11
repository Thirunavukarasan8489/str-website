import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('str_admin_session');

  if (session && session.value === 'authenticated') {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false });
}

export async function POST(request: Request) {
  try {
    const { password, action } = await request.json();
    const cookieStore = await cookies();

    if (action === 'logout') {
      cookieStore.delete('str_admin_session');
      return NextResponse.json({ success: true, message: 'Logged out successfully' });
    }

    if (password === ADMIN_PASSWORD) {
      cookieStore.set('str_admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return NextResponse.json({ success: true, message: 'Authentication successful' });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid admin credentials' },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Authentication error' },
      { status: 500 }
    );
  }
}
