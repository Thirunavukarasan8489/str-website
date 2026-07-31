import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validators';
import { dbConnect } from '@/lib/db';
import ContactMessage from '@/models/ContactMessage';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    await dbConnect();

    const newMessage = await ContactMessage.create(validatedData);

    return NextResponse.json({
      success: true,
      message: 'Contact query submitted and saved successfully.',
      data: newMessage,
    });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json(
        { success: false, message: 'Validation failed.', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to submit contact query.' },
      { status: 500 }
    );
  }
}
