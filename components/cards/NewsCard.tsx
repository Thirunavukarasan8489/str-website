import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { NewsArticle } from '@/types';
import { formatDate } from '@/lib/utils';

interface NewsCardProps {
  article: NewsArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
  return (
    <article className="group bg-[#121F54] border border-[#1B3A6B] hover:border-[#C9A227]/60 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1.5 flex flex-col h-full gold-glow-hover">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={article.image}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121F54] via-transparent to-transparent" />
        <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold text-white bg-[#1B3A6B]/80 backdrop-blur-sm border border-white/10 rounded-full">
          {article.category}
        </span>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-xs text-slate-400">
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

          <h3 className="text-lg font-serif font-bold text-white group-hover:text-[#E8C468] transition-colors leading-snug line-clamp-2">
            <Link href={`/news/${article.slug}`}>{article.title}</Link>
          </h3>

          <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed">
            {article.summary}
          </p>
        </div>

        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">By {article.author}</span>
          <Link
            href={`/news/${article.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#E8C468] hover:text-[#C9A227]"
          >
            <span>Read Story</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}
