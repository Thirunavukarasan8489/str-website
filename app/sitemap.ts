import { MetadataRoute } from 'next';
import { getEventsList, getNewsList, getGalleryAlbums } from '@/lib/contentService';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const [events, news, albums] = await Promise.all([
    getEventsList(),
    getNewsList(),
    getGalleryAlbums(),
  ]);

  const eventRoutes = events.map((event) => ({
    url: `${baseUrl}/events/${event.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  const newsRoutes = news.map((article) => ({
    url: `${baseUrl}/news/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const galleryRoutes = albums.map((album) => ({
    url: `${baseUrl}/gallery/${album.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...eventRoutes, ...newsRoutes, ...galleryRoutes];
}
