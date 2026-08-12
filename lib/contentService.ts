import { dbConnect } from "@/lib/db";
import HeroContent from "@/models/HeroContent";
import GalleryItem from "@/models/GalleryItem";
import GalleryAlbum from "@/models/GalleryAlbum";
import GalleryCategory from "@/models/GalleryCategory";
import NewsArticle from "@/models/NewsArticle";
import EventItem from "@/models/EventItem";
import EventCategory from "@/models/EventCategory";
import { NEWS_DATA } from "@/lib/data";
import {
  GalleryItem as GalleryItemType,
  GalleryAlbum as GalleryAlbumType,
  NewsArticle as NewsArticleType,
  EventItem as EventItemType,
  HeroData,
} from "@/types";

export const DEFAULT_HERO_DATA: HeroData = {
  badge: "Bridging Tamil Heritage & Scottish Culture",
  title: "Scotland Tamils",
  highlightTitle: "Raise Together",
  subtitle:
    "Empowering the Tamil community across Edinburgh, Glasgow, Aberdeen, and Dundee through language learning, cultural galas, youth mentorship, and civic unity.",
  primaryCtaText: "Join STR Membership",
  primaryCtaLink: "/membership/join",
  secondaryCtaText: "Explore Events",
  secondaryCtaLink: "/events",
  familiesCount: "100+",
  yearsCount: "1+ Yrs",
  cardBadge: "Flagship Event 2026",
  cardTitle: "Grand Tamil Pongal Vizha",
  cardSubtitle: "Edinburgh Assembly Rooms • Jan 17, 2026",
  imageUrl:
    "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1000&q=80",
  imageAlt: "Scotland Tamils Raise Pongal Festival Celebration",
};

export async function getHeroData(): Promise<HeroData> {
  try {
    await dbConnect();
    const hero = await HeroContent.findOne().lean();
    if (hero) {
      return {
        badge: hero.badge || DEFAULT_HERO_DATA.badge,
        title: hero.title || DEFAULT_HERO_DATA.title,
        highlightTitle: hero.highlightTitle || DEFAULT_HERO_DATA.highlightTitle,
        subtitle: hero.subtitle || DEFAULT_HERO_DATA.subtitle,
        primaryCtaText: hero.primaryCtaText || DEFAULT_HERO_DATA.primaryCtaText,
        primaryCtaLink: hero.primaryCtaLink || DEFAULT_HERO_DATA.primaryCtaLink,
        secondaryCtaText:
          hero.secondaryCtaText || DEFAULT_HERO_DATA.secondaryCtaText,
        secondaryCtaLink:
          hero.secondaryCtaLink || DEFAULT_HERO_DATA.secondaryCtaLink,
        familiesCount: hero.familiesCount || DEFAULT_HERO_DATA.familiesCount,
        yearsCount: hero.yearsCount || DEFAULT_HERO_DATA.yearsCount,
        cardBadge: hero.cardBadge || DEFAULT_HERO_DATA.cardBadge,
        cardTitle: hero.cardTitle || DEFAULT_HERO_DATA.cardTitle,
        cardSubtitle: hero.cardSubtitle || DEFAULT_HERO_DATA.cardSubtitle,
        imageUrl: hero.imageUrl || DEFAULT_HERO_DATA.imageUrl,
        imageAlt: hero.imageAlt || DEFAULT_HERO_DATA.imageAlt,
      };
    }
  } catch (error) {
    console.error("Error fetching Hero content from DB:", error);
  }
  return DEFAULT_HERO_DATA;
}

export async function getGalleryAlbums(): Promise<GalleryAlbumType[]> {
  try {
    await dbConnect();
    const [albums, photos] = await Promise.all([
      GalleryAlbum.find({ isPublished: true })
        .sort({ order: 1, createdAt: -1 })
        .lean(),
      GalleryItem.find().sort({ createdAt: -1, _id: -1 }).lean(),
    ]);

    return albums.map((alb: any) => {
      const albumPhotos = photos
        .filter((p: any) => p.albumSlug === alb.slug)
        .map((p: any) => ({
          id: p._id.toString(),
          title: p.title,
          category: p.category,
          albumSlug: p.albumSlug,
          imageUrl: p.imageUrl,
          alt: p.alt || p.title,
          caption: p.caption || "",
          date: p.date || "",
        }));

      return {
        id: alb._id.toString(),
        slug: alb.slug,
        title: alb.title,
        category: alb.category,
        coverImage: alb.coverImage,
        description: alb.description || "",
        date: alb.date || "",
        photoCount: albumPhotos.length,
        photos: albumPhotos,
      };
    });
  } catch (error) {
    console.error("Error fetching Gallery Albums from DB:", error);
    return [];
  }
}

export async function getGalleryAlbumBySlug(
  slug: string,
): Promise<GalleryAlbumType | null> {
  try {
    await dbConnect();
    const album = await GalleryAlbum.findOne({
      slug,
      isPublished: true,
    }).lean();

    if (!album) {
      return null;
    }

    const photos = await GalleryItem.find({ albumSlug: slug })
      .sort({ createdAt: -1, _id: -1 })
      .lean();

    const mappedPhotos = photos.map((p: any) => ({
      id: p._id.toString(),
      title: p.title,
      category: p.category,
      albumSlug: p.albumSlug || slug,
      imageUrl: p.imageUrl,
      alt: p.alt || p.title,
      caption: p.caption || "",
      date: p.date || "",
    }));

    return {
      id: (album as any)._id.toString(),
      slug: album.slug,
      title: album.title,
      category: album.category,
      coverImage: album.coverImage,
      description: album.description || "",
      date: album.date || "",
      photoCount: mappedPhotos.length,
      photos: mappedPhotos,
    };
  } catch (error) {
    console.error("Error fetching Gallery Album by slug from DB:", error);
    return null;
  }
}

export async function getGalleryList(
  limit?: number,
): Promise<GalleryItemType[]> {
  try {
    await dbConnect();
    let query = GalleryItem.find().sort({ createdAt: -1, _id: -1 });
    if (limit && limit > 0) {
      query = query.limit(limit);
    }
    const items = await query.lean();

    return items.map((item: any) => ({
      id: item._id.toString(),
      title: item.title,
      category: item.category,
      albumSlug: item.albumSlug || "",
      imageUrl: item.imageUrl,
      alt: item.alt || item.title,
      caption: item.caption || "",
      date: item.date || "",
    }));
  } catch (error) {
    console.error("Error fetching Gallery items from DB:", error);
    return [];
  }
}

export async function getLatestGalleryPhotos(
  limit = 6,
): Promise<GalleryItemType[]> {
  return getGalleryList(limit);
}

export async function getGalleryCategories(): Promise<string[]> {
  try {
    await dbConnect();
    const [dbCategories, itemCategories, albumCategories] = await Promise.all([
      GalleryCategory.find().sort({ order: 1, createdAt: 1 }).lean(),
      GalleryItem.distinct("category"),
      GalleryAlbum.distinct("category"),
    ]);

    const set = new Set<string>();
    set.add("All");
    dbCategories.forEach((c: any) => c.name && set.add(c.name.trim()));
    itemCategories.forEach((c: string) => c && set.add(c.trim()));
    albumCategories.forEach((c: string) => c && set.add(c.trim()));

    return Array.from(set);
  } catch (error) {
    console.error("Error fetching gallery categories:", error);
    return ["All"];
  }
}

export async function getNewsList(): Promise<NewsArticleType[]> {
  try {
    await dbConnect();
    const articles = await NewsArticle.find({ isPublished: true })
      .sort({ date: -1, createdAt: -1 })
      .lean();
    return articles.map((a: any) => ({
      id: a._id.toString(),
      slug: a.slug,
      title: a.title,
      summary: a.summary,
      content: a.content,
      date: a.date,
      author: a.author,
      category: a.category,
      image: a.image,
      readTime: a.readTime,
    }));
  } catch (error) {
    console.error("Error fetching News articles from DB:", error);
    return [];
  }
}

export async function getNewsArticleBySlug(
  slug: string,
): Promise<NewsArticleType | null> {
  try {
    await dbConnect();
    const article = await NewsArticle.findOne({
      slug,
      isPublished: true,
    }).lean();
    if (article) {
      return {
        id: (article as any)._id.toString(),
        slug: article.slug,
        title: article.title,
        summary: article.summary,
        content: article.content,
        date: article.date,
        author: article.author,
        category: article.category,
        image: article.image,
        readTime: article.readTime,
      };
    }
  } catch (error) {
    console.error("Error fetching News article by slug from DB:", error);
  }
  return null;
}

export async function getEventsList(): Promise<EventItemType[]> {
  try {
    await dbConnect();
    const events = await EventItem.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();
    if (events && events.length > 0) {
      return events.map((e: any) => ({
        id: e._id.toString(),
        slug: e.slug,
        title: e.title,
        tagline: e.tagline || "",
        description: e.description,
        fullDescription: e.fullDescription || "",
        date: e.date,
        time: e.time || "",
        location: e.location || "",
        city: e.city || "",
        venue: e.venue || "",
        category: e.category || "General",
        image: e.image,
        isFeatured: Boolean(e.isFeatured),
        isPast: Boolean(e.isPast),
        ticketLink: e.ticketLink || "",
        registrationOpen: e.registrationOpen !== false,
        price: e.price || "",
        agenda: e.agenda || [],
      }));
    }
  } catch (error) {
    console.error("Error fetching Events from DB:", error);
  }
  return [];
}

export async function getEventBySlug(
  slug: string,
): Promise<EventItemType | null> {
  try {
    await dbConnect();
    const event = await EventItem.findOne({ slug }).lean();
    if (event) {
      return {
        id: (event as any)._id.toString(),
        slug: event.slug,
        title: event.title,
        tagline: event.tagline || "",
        description: event.description,
        fullDescription: event.fullDescription || "",
        date: event.date,
        time: event.time || "",
        location: event.location || "",
        city: event.city || "Edinburgh",
        venue: event.venue || "",
        category: event.category || "General",
        image: event.image,
        isFeatured: Boolean(event.isFeatured),
        isPast: Boolean(event.isPast),
        ticketLink: event.ticketLink || "",
        registrationOpen: event.registrationOpen !== false,
        price: event.price || "",
        agenda: event.agenda || [],
      };
    }
  } catch (error) {
    console.error("Error fetching Event by slug from DB:", error);
  }
  return null;
}

export async function getEventCategories(): Promise<string[]> {
  try {
    await dbConnect();
    const [dbCategories, eventCategories] = await Promise.all([
      EventCategory.find().sort({ order: 1, createdAt: 1 }).lean(),
      EventItem.distinct("category"),
    ]);

    const set = new Set<string>();
    set.add("All");
    dbCategories.forEach((c: any) => c.name && set.add(c.name.trim()));
    eventCategories.forEach((c: string) => c && set.add(c.trim()));

    return Array.from(set);
  } catch (error) {
    console.error("Error fetching event categories:", error);
    return ["All"];
  }
}
