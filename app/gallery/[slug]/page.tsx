import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Images, ArrowRight } from 'lucide-react';
import SEOSchema from '@/components/shared/SEOSchema';
import { getBreadcrumbSchema } from '@/lib/seo';
import { getGalleryAlbums, getGalleryAlbumBySlug } from '@/lib/contentService';
import SingleAlbumGalleryView from '@/components/gallery/SingleAlbumGalleryView';

export const revalidate = 60; // Refresh dynamic album every 60 seconds

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const albums = await getGalleryAlbums();
  return albums.map((alb) => ({
    slug: alb.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const album = await getGalleryAlbumBySlug(slug);

  if (!album) {
    return { title: 'Album Not Found | Scotland Tamils Raise' };
  }

  return {
    title: `${album.title} - Photo Gallery | Scotland Tamils Raise`,
    description:
      album.description ||
      `View photos and celebration moments from ${album.title} organized by Scotland Tamils Raise.`,
    openGraph: {
      title: `${album.title} | Scotland Tamils Raise`,
      description: album.description,
      images: [{ url: album.coverImage }],
    },
  };
}

export default async function SingleGalleryAlbumPage({ params }: Props) {
  const { slug } = await params;
  const [album, allAlbums] = await Promise.all([
    getGalleryAlbumBySlug(slug),
    getGalleryAlbums(),
  ]);

  if (!album) {
    notFound();
  }

  const otherAlbums = allAlbums.filter((a) => a.slug !== slug).slice(0, 3);

  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'Gallery', item: '/gallery' },
    { name: album.title, item: `/gallery/${album.slug}` },
  ]);

  return (
    <>
      <SEOSchema schema={breadcrumbs} />

      {/* Header Banner */}
      <section className="relative py-12 sm:py-16 bg-[#070D2B] tartan-pattern border-b border-[#1B3A6B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-1.5 text-xs text-[#E8C468] hover:text-[#C9A227] mb-6 transition-colors font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Gallery Collections
          </Link>

          <div className="max-w-4xl space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-block px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#0A1440] bg-[#E8C468] rounded-full shadow-md">
                {album.category}
              </span>
              <span className="text-xs text-slate-300 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#C9A227]" />
                {album.date}
              </span>
              <span className="text-xs text-slate-300 flex items-center gap-1">
                <Images className="w-3.5 h-3.5 text-[#C9A227]" />
                {album.photos?.length || 0} Photos in this Album
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-white leading-tight">
              {album.title}
            </h1>

            {album.description && (
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal pt-1">
                {album.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Main Album Photo Grid */}
      <section className="py-16 bg-[#0A1440]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <SingleAlbumGalleryView photos={album.photos || []} albumTitle={album.title} />

          {/* Related / Other Albums Section */}
          {otherAlbums.length > 0 && (
            <div className="pt-12 border-t border-white/10 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-white">
                    Explore Other <span className="gold-gradient-text">Photo Albums</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Discover more celebration and cultural memories across Scotland.
                  </p>
                </div>
                <Link
                  href="/gallery"
                  className="text-xs font-bold text-[#E8C468] hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>View All Albums</span>
                  <ArrowRight className="w-4 h-4 text-[#C9A227]" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherAlbums.map((other) => (
                  <Link
                    key={other.id || other.slug}
                    href={`/gallery/${other.slug}`}
                    className="group bg-[#121F54] border border-[#1B3A6B] hover:border-[#C9A227] rounded-xl overflow-hidden shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                      <Image
                        src={other.coverImage}
                        alt={other.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold text-[#0A1440] bg-[#E8C468] rounded-full">
                          {other.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 space-y-1">
                      <span className="text-[11px] text-slate-400">{other.date}</span>
                      <h4 className="text-sm font-serif font-bold text-white group-hover:text-[#E8C468] transition-colors line-clamp-1">
                        {other.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
