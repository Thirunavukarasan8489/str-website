import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { dbConnect } from '@/lib/db';
import EventItem from '@/models/EventItem';
import { deleteCloudinaryImage } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function revalidateEventPages(slug?: string) {
  try {
    revalidatePath('/', 'page');
    revalidatePath('/');
    revalidatePath('/events', 'page');
    revalidatePath('/events');
    if (slug) {
      revalidatePath(`/events/${slug}`, 'page');
      revalidatePath(`/events/${slug}`);
    }
  } catch (err) {
    console.error('ISR Revalidation Error on Events:', err);
  }
}

// GET /api/admin/events — List all events (including past/upcoming)
export async function GET() {
  try {
    await dbConnect();
    const events = await EventItem.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, events });
  } catch (error: any) {
    console.error('Admin GET Events error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST /api/admin/events — Create new event
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const {
      title,
      slug,
      tagline,
      description,
      fullDescription,
      date,
      time,
      location,
      city,
      venue,
      category,
      image,
      isFeatured,
      isPast,
      registrationOpen,
      ticketLink,
      price,
      agenda,
      order,
    } = body;

    if (!title || !description || !date || !image) {
      return NextResponse.json(
        { success: false, message: 'Title, Description, Date, and Event Image are required.' },
        { status: 400 }
      );
    }

    const generatedSlug = (slug || title)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-');

    // Check duplicate slug
    const existing = await EventItem.findOne({ slug: generatedSlug });
    if (existing) {
      return NextResponse.json(
        { success: false, message: `An event with slug "${generatedSlug}" already exists.` },
        { status: 400 }
      );
    }

    const newEvent = await EventItem.create({
      title,
      slug: generatedSlug,
      tagline: tagline || '',
      description,
      fullDescription: fullDescription || description,
      date,
      time: time || '',
      location: location || '',
      city: city || 'Edinburgh',
      venue: venue || '',
      category: category || 'General',
      image,
      isFeatured: Boolean(isFeatured),
      isPast: Boolean(isPast),
      registrationOpen: registrationOpen !== false,
      ticketLink: ticketLink || '',
      price: price || '',
      agenda: Array.isArray(agenda) ? agenda : [],
      order: Number(order) || 0,
    });

    revalidateEventPages(newEvent.slug);

    return NextResponse.json({
      success: true,
      message: 'Event created successfully!',
      event: newEvent,
    });
  } catch (error: any) {
    console.error('Admin POST Event error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create event' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/events — Update event
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { id, _id, ...updateData } = body;
    const targetId = id || _id;

    if (!targetId) {
      return NextResponse.json(
        { success: false, message: 'Event ID is required for update.' },
        { status: 400 }
      );
    }

    if (updateData.title && !updateData.slug) {
      updateData.slug = updateData.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-');
    }

    const updatedEvent = await EventItem.findByIdAndUpdate(targetId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) {
      return NextResponse.json(
        { success: false, message: 'Event not found.' },
        { status: 404 }
      );
    }

    revalidateEventPages(updatedEvent.slug);

    return NextResponse.json({
      success: true,
      message: 'Event updated successfully!',
      event: updatedEvent,
    });
  } catch (error: any) {
    console.error('Admin PUT Event error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update event' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/events?id=... — Delete event and its image from Cloudinary
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Event ID is required.' },
        { status: 400 }
      );
    }

    const event = await EventItem.findById(id);
    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Event not found.' },
        { status: 404 }
      );
    }

    // Clean up image from Cloudinary CDN
    if (event.image && (event.image.includes('cloudinary.com') || event.image.includes('res.cloudinary'))) {
      await deleteCloudinaryImage(event.image);
    }

    await EventItem.findByIdAndDelete(id);

    revalidateEventPages(event.slug);

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully!',
    });
  } catch (error: any) {
    console.error('Admin DELETE Event error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete event' },
      { status: 500 }
    );
  }
}
