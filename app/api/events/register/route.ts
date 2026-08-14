import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import EventRegistration from '@/models/EventRegistration';
import EventItem from '@/models/EventItem';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// POST: Public endpoint to register for an event ticket
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { eventSlug, fullName, email, phone, ticketType, quantity = 1, notes = '' } = body;

    if (!fullName || !fullName.trim()) {
      return NextResponse.json({ success: false, message: 'Full Name is required.' }, { status: 400 });
    }
    if (!email || !email.trim() || !email.includes('@')) {
      return NextResponse.json({ success: false, message: 'Valid Email address is required.' }, { status: 400 });
    }
    if (!phone || !phone.trim()) {
      return NextResponse.json({ success: false, message: 'UK Mobile Number is required.' }, { status: 400 });
    }
    if (!eventSlug || !eventSlug.trim()) {
      return NextResponse.json({ success: false, message: 'Target Event is required.' }, { status: 400 });
    }

    // Lookup Event details
    let eventTitle = 'Community Event';
    let eventDate = '';
    let eventTime = '';
    let eventVenue = '';

    try {
      const eventDoc = await EventItem.findOne({ slug: eventSlug }).lean();
      if (eventDoc) {
        eventTitle = eventDoc.title;
        eventDate = eventDoc.date;
        eventTime = eventDoc.time || '';
        eventVenue = `${eventDoc.venue}, ${eventDoc.city}`;
      }
    } catch (e) {
      console.warn('Could not fetch event doc for title, proceeding with fallback title', e);
    }

    // Generate unique booking reference code
    const uniqueSuffix = Date.now().toString(36).toUpperCase().slice(-5);
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `STR-EVT-${uniqueSuffix}-${randomDigits}`;

    const numQty = Math.max(1, parseInt(String(quantity), 10) || 1);

    const registration = await EventRegistration.create({
      bookingId,
      eventSlug,
      eventTitle,
      eventDate,
      eventTime,
      eventVenue,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      ticketType: ticketType || 'Standard Entry',
      quantity: numQty,
      totalPrice: ticketType ? `${ticketType} (x${numQty})` : 'Confirmed',
      notes: notes ? notes.trim() : '',
      status: 'Confirmed',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Ticket reservation confirmed successfully!',
        bookingId: registration.bookingId,
        registration,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error registering for event:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to complete registration.' },
      { status: 500 }
    );
  }
}

// GET: Fetch all event registrations (Admin CMS)
export async function GET() {
  try {
    await dbConnect();
    const registrations = await EventRegistration.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, registrations }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching event registrations:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch registrations.' },
      { status: 500 }
    );
  }
}

// PUT: Update registration status (Admin CMS)
export async function PUT(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, message: 'ID and Status are required.' }, { status: 400 });
    }

    const updated = await EventRegistration.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Registration record not found.' }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: `Registration status updated to ${status}.`, registration: updated },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating registration status:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update status.' },
      { status: 500 }
    );
  }
}

// DELETE: Remove registration (Admin CMS)
export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Registration ID required.' }, { status: 400 });
    }

    await EventRegistration.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Registration record deleted successfully.' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting registration record:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete record.' },
      { status: 500 }
    );
  }
}
