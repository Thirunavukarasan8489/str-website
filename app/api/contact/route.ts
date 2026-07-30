import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validators';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    return NextResponse.json({
      success: true,
      message: 'Contact query submitted successfully.',
      data: validatedData,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Invalid contact form payload.', details: error.errors },
      { status: 400 }
    );
  }
}
