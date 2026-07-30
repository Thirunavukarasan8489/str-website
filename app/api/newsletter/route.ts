import { NextResponse } from 'next/server';
import { newsletterSchema } from '@/lib/validators';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = newsletterSchema.parse(body);

    return NextResponse.json({
      success: true,
      message: 'Subscribed to newsletter.',
      email: validatedData.email,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Invalid email address.', details: error.errors },
      { status: 400 }
    );
  }
}
