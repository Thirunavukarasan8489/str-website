import { NextResponse } from 'next/server';
import { membershipSchema } from '@/lib/validators';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = membershipSchema.parse(body);

    // In production, integrate with database (e.g. MongoDB) or CRM
    return NextResponse.json({
      success: true,
      message: 'Membership registration received successfully.',
      member: validatedData,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Invalid registration payload.', details: error.errors },
      { status: 400 }
    );
  }
}
