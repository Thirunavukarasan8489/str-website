import React from 'react';
import type { Metadata } from 'next';
import NewsCard from '@/components/cards/NewsCard';
import SectionHeading from '@/components/shared/SectionHeading';
import SEOSchema from '@/components/shared/SEOSchema';
import { getBreadcrumbSchema } from '@/lib/seo';
import { getNewsList } from '@/lib/contentService';

export const revalidate = 60; // Refresh news articles from DB every 60 seconds

export const metadata: Metadata = {
  title: 'News & Announcements | Scotland Tamils Raise',
  description:
    'Read the latest press releases, Scottish Parliament motions, Tamil Academy announcements, and community stories.',
};

export default async function NewsPage() {
  const articles = await getNewsList();

  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'News', item: '/news' },
  ]);

  return (
    <>
      <SEOSchema schema={breadcrumbs} />

      {/* Header Banner */}
      <section className="relative py-16 bg-[#070D2B] tartan-pattern border-b border-[#1B3A6B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3.5 py-1 mb-3 text-xs font-semibold uppercase tracking-wider text-[#E8C468] bg-[#1B3A6B]/50 border border-[#C9A227]/30 rounded-full">
            Press & Media
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-white">
            News & <span className="gold-gradient-text">Announcements</span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-slate-300 max-w-2xl mx-auto">
            Stay updated with organization milestones, Scottish Parliament motions, educational academy expansions, and civic highlights.
          </p>
        </div>
      </section>

      <section className="py-16 bg-[#0A1440]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {articles.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              No news articles published at this time.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <NewsCard key={article.id || article.slug} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
