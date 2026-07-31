import { NextResponse } from 'next/server';
import { newsletterSchema } from '@/lib/validators';
import { dbConnect } from '@/lib/db';
import Subscriber from '@/models/Subscriber';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = newsletterSchema.parse(body);

    await dbConnect();

    const subscriber = await Subscriber.findOneAndUpdate(
      { email: validatedData.email.toLowerCase() },
      { email: validatedData.email.toLowerCase(), active: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Subscribed to newsletter successfully.',
      email: subscriber.email,
    });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json(
        { success: false, message: 'Invalid email address.', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Newsletter API Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to subscribe to newsletter.' },
      { status: 500 }
    );
  }
}
