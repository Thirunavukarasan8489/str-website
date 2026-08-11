import { dbConnect } from '@/lib/db';
import HeroContent from '@/models/HeroContent';
import GalleryItem from '@/models/GalleryItem';
import GalleryAlbum from '@/models/GalleryAlbum';
import GalleryCategory from '@/models/GalleryCategory';
import NewsArticle from '@/models/NewsArticle';
import { GALLERY_DATA, GALLERY_ALBUMS_DATA, NEWS_DATA } from '@/lib/data';
import {
  GalleryItem as GalleryItemType,
  GalleryAlbum as GalleryAlbumType,
  NewsArticle as NewsArticleType,
  HeroData,
} from '@/types';

export const DEFAULT_HERO_DATA: HeroData = {
  badge: 'Bridging Tamil Heritage & Scottish Culture',
  title: 'Scotland Tamils',
  highlightTitle: 'Raise Together',
  subtitle:
    'Empowering the Tamil community across Edinburgh, Glasgow, Aberdeen, and Dundee through language learning, cultural galas, youth mentorship, and civic unity.',
  primaryCtaText: 'Join STR Membership',
  primaryCtaLink: '/membership/join',
  secondaryCtaText: 'Explore Events',
  secondaryCtaLink: '/events',
  familiesCount: '100+',
  yearsCount: '1+ Yrs',
  cardBadge: 'Flagship Event 2026',
  cardTitle: 'Grand Tamil Pongal Vizha',
  cardSubtitle: 'Edinburgh Assembly Rooms • Jan 17, 2026',
  imageUrl:
    'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1000&q=80',
  imageAlt: 'Scotland Tamils Raise Pongal Festival Celebration',
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
        secondaryCtaText: hero.secondaryCtaText || DEFAULT_HERO_DATA.secondaryCtaText,
        secondaryCtaLink: hero.secondaryCtaLink || DEFAULT_HERO_DATA.secondaryCtaLink,
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
    console.error('Error fetching Hero content from DB:', error);
  }
  return DEFAULT_HERO_DATA;
}

export async function getGalleryAlbums(): Promise<GalleryAlbumType[]> {
  try {
    await dbConnect();
    const albumCount = await GalleryAlbum.countDocuments();

    if (albumCount === 0) {
      // Seed default albums
      for (let i = 0; i < GALLERY_ALBUMS_DATA.length; i++) {
        const alb = GALLERY_ALBUMS_DATA[i];
        await GalleryAlbum.create({
          title: alb.title,
          slug: alb.slug,
          category: alb.category,
          description: alb.description,
          coverImage: alb.coverImage,
          date: alb.date,
          order: i,
          isPublished: true,
        });
      }
    }

    const itemCount = await GalleryItem.countDocuments();
    if (itemCount === 0) {
      for (let i = 0; i < GALLERY_DATA.length; i++) {
        const item = GALLERY_DATA[i];
        await GalleryItem.create({
          title: item.title,
          category: item.category,
          albumSlug: item.albumSlug || '',
          imageUrl: item.imageUrl,
          alt: item.alt,
          caption: item.caption,
          date: item.date,
          order: i,
        });
      }
    }

    const [albums, photos] = await Promise.all([
      GalleryAlbum.find({ isPublished: true }).sort({ order: 1, createdAt: -1 }).lean(),
      GalleryItem.find().sort({ order: 1, createdAt: -1 }).lean(),
    ]);

    if (albums.length > 0) {
      return albums.map((alb: any) => {
        const albumPhotos = photos
          .filter(
            (p: any) =>
              p.albumSlug === alb.slug ||
              (!p.albumSlug && p.category?.toLowerCase() === alb.category?.toLowerCase())
          )
          .map((p: any) => ({
            id: p._id.toString(),
            title: p.title,
            category: p.category,
            albumSlug: p.albumSlug || alb.slug,
            imageUrl: p.imageUrl,
            alt: p.alt || p.title,
            caption: p.caption || '',
            date: p.date || '',
          }));

        return {
          id: alb._id.toString(),
          slug: alb.slug,
          title: alb.title,
          category: alb.category,
          coverImage: alb.coverImage,
          description: alb.description || '',
          date: alb.date || '',
          photoCount: albumPhotos.length,
          photos: albumPhotos,
        };
      });
    }
  } catch (error) {
    console.error('Error fetching Gallery Albums from DB:', error);
  }

  // Fallback to static data
  return GALLERY_ALBUMS_DATA.map((alb) => {
    const albumPhotos = GALLERY_DATA.filter((p) => p.albumSlug === alb.slug);
    return {
      ...alb,
      photoCount: albumPhotos.length,
      photos: albumPhotos,
    };
  });
}

export async function getGalleryAlbumBySlug(slug: string): Promise<GalleryAlbumType | null> {
  try {
    await dbConnect();
    const album = await GalleryAlbum.findOne({ slug, isPublished: true }).lean();

    if (album) {
      const photos = await GalleryItem.find({
        $or: [{ albumSlug: slug }, { category: album.category, albumSlug: { $in: ['', null] } }],
      })
        .sort({ order: 1, createdAt: -1 })
        .lean();

      const mappedPhotos = photos.map((p: any) => ({
        id: p._id.toString(),
        title: p.title,
        category: p.category,
        albumSlug: p.albumSlug || slug,
        imageUrl: p.imageUrl,
        alt: p.alt || p.title,
        caption: p.caption || '',
        date: p.date || '',
      }));

      return {
        id: (album as any)._id.toString(),
        slug: album.slug,
        title: album.title,
        category: album.category,
        coverImage: album.coverImage,
        description: album.description || '',
        date: album.date || '',
        photoCount: mappedPhotos.length,
        photos: mappedPhotos,
      };
    }
  } catch (error) {
    console.error('Error fetching Gallery Album by slug from DB:', error);
  }

  const fallback = GALLERY_ALBUMS_DATA.find((a) => a.slug === slug);
  if (fallback) {
    const photos = GALLERY_DATA.filter((p) => p.albumSlug === slug);
    return {
      ...fallback,
      photoCount: photos.length,
      photos,
    };
  }

  return null;
}

export async function getGalleryList(): Promise<GalleryItemType[]> {
  try {
    await dbConnect();
    const count = await GalleryItem.countDocuments();
    if (count === 0) {
      for (let i = 0; i < GALLERY_DATA.length; i++) {
        const item = GALLERY_DATA[i];
        await GalleryItem.create({
          title: item.title,
          category: item.category,
          albumSlug: item.albumSlug || '',
          imageUrl: item.imageUrl,
          alt: item.alt,
          caption: item.caption,
          date: item.date,
          order: i,
        });
      }
    }

    const items = await GalleryItem.find().sort({ order: 1, createdAt: -1 }).lean();
    if (items.length > 0) {
      return items.map((item: any) => ({
        id: item._id.toString(),
        title: item.title,
        category: item.category,
        albumSlug: item.albumSlug || '',
        imageUrl: item.imageUrl,
        alt: item.alt || item.title,
        caption: item.caption || '',
        date: item.date || '',
      }));
    }
  } catch (error) {
    console.error('Error fetching Gallery items from DB:', error);
  }
  return GALLERY_DATA;
}

export async function getGalleryCategories(): Promise<string[]> {
  const DEFAULT_CATEGORIES = ['All', 'Culture', 'Festivals', 'Youth', 'Community', 'Sports'];
  try {
    await dbConnect();
    const [dbCategories, itemCategories, albumCategories] = await Promise.all([
      GalleryCategory.find().sort({ order: 1, createdAt: 1 }).lean(),
      GalleryItem.distinct('category'),
      GalleryAlbum.distinct('category'),
    ]);

    const set = new Set<string>();
    DEFAULT_CATEGORIES.forEach((c) => set.add(c));
    dbCategories.forEach((c: any) => set.add(c.name));
    itemCategories.forEach((c: string) => c && set.add(c));
    albumCategories.forEach((c: string) => c && set.add(c));

    return Array.from(set);
  } catch (error) {
    console.error('Error fetching gallery categories:', error);
    return DEFAULT_CATEGORIES;
  }
}

export async function getNewsList(): Promise<NewsArticleType[]> {
  try {
    await dbConnect();
    const count = await NewsArticle.countDocuments();
    if (count === 0) {
      for (const article of NEWS_DATA) {
        await NewsArticle.create({
          title: article.title,
          slug: article.slug,
          summary: article.summary,
          content: article.content,
          date: article.date,
          author: article.author,
          category: article.category,
          image: article.image,
          readTime: article.readTime,
          isPublished: true,
        });
      }
    }

    const articles = await NewsArticle.find({ isPublished: true }).sort({ date: -1, createdAt: -1 }).lean();
    if (articles.length > 0) {
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
    }
  } catch (error) {
    console.error('Error fetching News articles from DB:', error);
  }
  return NEWS_DATA;
}

export async function getNewsArticleBySlug(slug: string): Promise<NewsArticleType | null> {
  try {
    await dbConnect();
    const article = await NewsArticle.findOne({ slug, isPublished: true }).lean();
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
    console.error('Error fetching News article by slug from DB:', error);
  }

  const fallback = NEWS_DATA.find((a) => a.slug === slug);
  return fallback || null;
}
