import { NextResponse } from 'next/server';
import { membershipSchema } from '@/lib/validators';
import { dbConnect } from '@/lib/db';
import Member from '@/models/Member';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = membershipSchema.parse(body);

    await dbConnect();

    const newMember = await Member.create(validatedData);

    return NextResponse.json({
      success: true,
      message: 'Membership registration received and saved successfully.',
      member: newMember,
    });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json(
        { success: false, message: 'Validation failed.', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Membership API Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to complete membership registration.' },
      { status: 500 }
    );
  }
}
