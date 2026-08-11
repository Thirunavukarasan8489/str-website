import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Member from '@/models/Member';
import ContactMessage from '@/models/ContactMessage';
import Subscriber from '@/models/Subscriber';

export async function GET() {
  try {
    await dbConnect();

    const [members, messages, subscribers] = await Promise.all([
      Member.find().sort({ createdAt: -1 }),
      ContactMessage.find().sort({ createdAt: -1 }),
      Subscriber.find().sort({ createdAt: -1 }),
    ]);

    const stats = {
      totalMembers: members.length,
      totalMessages: messages.length,
      totalSubscribers: subscribers.length,
      totalLeads: members.length + messages.length + subscribers.length,
    };

    return NextResponse.json({
      success: true,
      stats,
      members,
      messages,
      subscribers,
    });
  } catch (error: any) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json(
        { success: false, message: 'Type and ID are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    if (type === 'member') {
      await Member.findByIdAndDelete(id);
    } else if (type === 'message') {
      await ContactMessage.findByIdAndDelete(id);
    } else if (type === 'subscriber') {
      await Subscriber.findByIdAndDelete(id);
    } else {
      return NextResponse.json({ success: false, message: 'Invalid lead type' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `${type} record deleted successfully`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete record' },
      { status: 500 }
    );
  }
}
