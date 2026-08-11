import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft, User } from 'lucide-react';
import SEOSchema from '@/components/shared/SEOSchema';
import { getBreadcrumbSchema } from '@/lib/seo';
import { getNewsList, getNewsArticleBySlug } from '@/lib/contentService';
import { formatDate } from '@/lib/utils';

export const revalidate = 60; // ISR revalidate every 60 seconds

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await getNewsList();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsArticleBySlug(slug);
  if (!article) return { title: 'Article Not Found' };

  return {
    title: `${article.title} | Scotland Tamils Raise`,
    description: article.summary,
    openGraph: {
      title: `${article.title} | Scotland Tamils Raise`,
      description: article.summary,
      images: [{ url: article.image }],
    },
  };
}

export default async function SingleNewsPage({ params }: Props) {
  const { slug } = await params;
  const article = await getNewsArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'News', item: '/news' },
    { name: article.title, item: `/news/${article.slug}` },
  ]);

  return (
    <>
      <SEOSchema schema={breadcrumbs} />

      {/* Header */}
      <section className="relative py-12 bg-[#070D2B] tartan-pattern border-b border-[#1B3A6B]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-xs text-[#E8C468] hover:text-[#C9A227] mb-6 transition-colors font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to News
          </Link>

          <div className="space-y-4">
            <span className="inline-block px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#0A1440] bg-[#E8C468] rounded-full">
              {article.category}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-white leading-tight">
              {article.title}
            </h1>

            <div className="flex items-center gap-4 text-xs text-slate-300 pt-2">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#C9A227]" />
                {article.author}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#C9A227]" />
                {formatDate(article.date)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#C9A227]" />
                {article.readTime}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content Body */}
      <section className="py-16 bg-[#0A1440]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="relative h-[360px] sm:h-[450px] rounded-2xl overflow-hidden border border-[#C9A227]/40 shadow-2xl gold-glow">
            <Image
              src={article.image}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 900px"
              className="object-cover"
            />
          </div>

          <div className="bg-[#121F54] border border-[#1B3A6B] rounded-2xl p-8 sm:p-10 text-slate-200 space-y-6 text-base sm:text-lg leading-relaxed">
            <p className="font-semibold text-white text-xl leading-snug border-l-4 border-[#C9A227] pl-4 py-1">
              {article.summary}
            </p>
            <div className="whitespace-pre-wrap leading-relaxed">{article.content}</div>
            <p>
              Scotland Tamils Raise continues to work closely with local government representatives, Scottish cultural heritage trusts, and educational bodies to ensure Tamil traditions remain a vibrant part of Scotland’s multicultural landscape.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
