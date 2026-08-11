import { MetadataRoute } from 'next';
import { EVENTS_DATA, NEWS_DATA, GALLERY_ALBUMS_DATA } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://scotlandtamilsraise.org';

  const staticRoutes = [
    '',
    '/about',
    '/events',
    '/gallery',
    '/membership',
    '/membership/join',
    '/news',
    '/contact',
    '/donate',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const eventRoutes = EVENTS_DATA.map((event) => ({
    url: `${baseUrl}/events/${event.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  const newsRoutes = NEWS_DATA.map((article) => ({
    url: `${baseUrl}/news/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const galleryRoutes = GALLERY_ALBUMS_DATA.map((album) => ({
    url: `${baseUrl}/gallery/${album.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...eventRoutes, ...newsRoutes, ...galleryRoutes];
}
