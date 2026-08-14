'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import CloudinaryUploader from './CloudinaryUploader';
import {
  Plus,
  Trash2,
  Edit2,
  Newspaper,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Calendar,
  User,
  Clock,
  Eye,
  EyeOff,
  Filter,
  Globe,
  FileText,
} from 'lucide-react';

import { notifyLiveContentUpdate } from '@/components/shared/LiveRouteRefresher';

interface NewsArticleData {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  date: string;
  author: string;
  category: string;
  image: string;
  readTime: string;
  isPublished?: boolean;
}

export default function NewsManager() {
  const [articles, setArticles] = useState<NewsArticleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticleData | null>(null);
  const [saving, setSaving] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Published' | 'Draft'>('All');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [form, setForm] = useState<NewsArticleData>({
    title: '',
    slug: '',
    summary: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    author: 'Editorial Team',
    category: 'Announcement',
    image:
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    readTime: '3 min read',
    isPublished: true,
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  // Lock background body scroll whenever modal is open
  useEffect(() => {
    if (showModal) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [showModal]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/news');
      const data = await res.json();
      if (res.ok && data.articles) {
        setArticles(data.articles);
      }
    } catch (err) {
      console.error('Failed to load news articles', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingArticle(null);
    setIsSlugManuallyEdited(false);
    setForm({
      title: '',
      slug: '',
      summary: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      author: 'Editorial Team',
      category: 'Announcement',
      image:
        'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
      readTime: '3 min read',
      isPublished: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (article: NewsArticleData) => {
    setEditingArticle(article);
    const generateSlug = (t: string) => t.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    setIsSlugManuallyEdited(article.slug !== generateSlug(article.title));
    setForm({
      id: article._id || article.id,
      title: article.title,
      slug: article.slug,
      summary: article.summary,
      content: article.content,
      date: article.date,
      author: article.author,
      category: article.category,
      image: article.image,
      readTime: article.readTime,
      isPublished: article.isPublished !== undefined ? Boolean(article.isPublished) : true,
    });
    setShowModal(true);
  };

  const handleTitleChange = (newTitle: string) => {
    setForm((prev) => {
      const autoSlug = !isSlugManuallyEdited
        ? newTitle
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '')
        : prev.slug;
      return { ...prev, title: newTitle, slug: autoSlug };
    });
  };

  // Quick toggle publishing status directly on card
  const handleTogglePublish = async (article: NewsArticleData) => {
    const articleId = article._id || article.id;
    if (!articleId) return;

    const newStatus = !article.isPublished;
    try {
      const res = await fetch('/api/admin/news', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: articleId,
          isPublished: newStatus,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setArticles(
          articles.map((a) =>
            (a._id || a.id) === articleId ? { ...a, isPublished: newStatus } : a
          )
        );
        setStatusMessage({
          type: 'success',
          text: newStatus
            ? `"${article.title}" is now Published live!`
            : `"${article.title}" set to Draft (Unpublished).`,
        });
        notifyLiveContentUpdate();
        setTimeout(() => setStatusMessage(null), 3500);
      }
    } catch (err) {
      console.error('Error toggling publish status', err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setStatusMessage({ type: 'error', text: 'Title and Content are required.' });
      return;
    }

    setSaving(true);
    setStatusMessage(null);

    try {
      const method = editingArticle ? 'PUT' : 'POST';
      const body = editingArticle ? { ...form, id: editingArticle._id || editingArticle.id } : form;

      const res = await fetch('/api/admin/news', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({
          type: 'success',
          text: editingArticle
            ? 'Article updated successfully!'
            : form.isPublished
            ? 'News article published live on website!'
            : 'News article saved as draft (unpublished)!',
        });
        notifyLiveContentUpdate();
        setShowModal(false);
        fetchArticles();
        setTimeout(() => setStatusMessage(null), 4000);
      } else {
        setStatusMessage({ type: 'error', text: data.message || 'Failed to save news article.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Network error saving article.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this news article?')) return;

    try {
      const res = await fetch(`/api/admin/news?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setArticles(articles.filter((a) => (a._id || a.id) !== id));
        setStatusMessage({ type: 'success', text: 'Article deleted successfully.' });
        notifyLiveContentUpdate();
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  const publishedCount = articles.filter((a) => a.isPublished !== false).length;
  const draftCount = articles.filter((a) => a.isPublished === false).length;

  const filteredArticles = articles.filter((a) => {
    if (statusFilter === 'Published') return a.isPublished !== false;
    if (statusFilter === 'Draft') return a.isPublished === false;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1B3A6B] pb-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            <span>News & Media Publications</span>
            <Newspaper className="w-5 h-5 text-[#E8C468]" />
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Publish or draft press releases, community stories, and Scottish Parliament announcements.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#C9A227] to-[#E8C468] text-[#0A1440] shadow-lg hover:brightness-110 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm ${
            statusMessage.type === 'success'
              ? 'bg-emerald-900/30 border border-emerald-500/50 text-emerald-300'
              : 'bg-[#8B1A2B]/30 border border-[#8B1A2B] text-[#E8C468]'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-[#8B1A2B] shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Status Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-semibold mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Status:
        </span>
        <button
          onClick={() => setStatusFilter('All')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            statusFilter === 'All'
              ? 'bg-[#C9A227] text-[#0A1440] font-bold shadow-md'
              : 'bg-[#121F54] text-slate-300 hover:text-white border border-white/10'
          }`}
        >
          All ({articles.length})
        </button>
        <button
          onClick={() => setStatusFilter('Published')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            statusFilter === 'Published'
              ? 'bg-emerald-500 text-[#0A1440] font-bold shadow-md'
              : 'bg-[#121F54] text-emerald-300 hover:text-white border border-emerald-500/30'
          }`}
        >
          <Globe className="w-3 h-3" />
          <span>Published ({publishedCount})</span>
        </button>
        <button
          onClick={() => setStatusFilter('Draft')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            statusFilter === 'Draft'
              ? 'bg-amber-500 text-[#0A1440] font-bold shadow-md'
              : 'bg-[#121F54] text-amber-300 hover:text-white border border-amber-500/30'
          }`}
        >
          <FileText className="w-3 h-3" />
          <span>Draft / Unpublished ({draftCount})</span>
        </button>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#C9A227] animate-spin mx-auto" />
          <p className="text-sm text-slate-300">Loading Articles...</p>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="py-16 text-center bg-[#121F54] border border-[#1B3A6B] rounded-2xl p-8 space-y-4">
          <Newspaper className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-serif font-bold text-white">No articles found in &quot;{statusFilter}&quot;</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click &quot;Write New Article&quot; to draft or publish an announcement.
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-[#C9A227] text-[#0A1440] font-bold text-xs rounded-lg"
          >
            Create Article
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => {
            const articleId = article._id || article.id;
            const isLive = article.isPublished !== false;

            return (
              <div
                key={articleId}
                className="bg-[#121F54] border border-[#1B3A6B] hover:border-[#C9A227]/60 rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold text-[#0A1440] bg-[#E8C468] rounded-full shadow-md">
                        {article.category}
                      </span>
                    </div>

                    {/* Published Status Pill */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2.5 py-0.5 text-[10px] uppercase font-bold rounded-full shadow-md backdrop-blur-md flex items-center gap-1 ${
                          isLive
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-400/50'
                            : 'bg-amber-950/80 text-amber-300 border border-amber-400/50'
                        }`}
                      >
                        {isLive ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            <span>Draft</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#C9A227]" />
                        {article.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#C9A227]" />
                        {article.readTime}
                      </span>
                    </div>

                    <h3 className="text-base font-serif font-bold text-white line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2">{article.summary}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-white/10 mt-3 flex items-center justify-between">
                  {/* Quick Toggle Status */}
                  <button
                    onClick={() => handleTogglePublish(article)}
                    title={isLive ? 'Click to unpublish' : 'Click to publish live'}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-colors ${
                      isLive
                        ? 'text-emerald-300 hover:text-emerald-200 border-emerald-500/30 bg-emerald-900/20'
                        : 'text-amber-300 hover:text-amber-200 border-amber-500/30 bg-amber-900/20'
                    }`}
                  >
                    {isLive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{isLive ? 'Live' : 'Draft'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(article)}
                      className="p-2 rounded-lg bg-[#1B3A6B] hover:bg-[#C9A227] hover:text-[#0A1440] text-slate-200 text-xs flex items-center gap-1 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(articleId)}
                      className="p-2 rounded-lg bg-[#8B1A2B]/40 hover:bg-[#8B1A2B] text-rose-300 hover:text-white text-xs flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md overflow-y-auto p-4 sm:p-6 md:p-8 flex justify-center items-start">
          <div className="relative bg-[#121F54] border border-[#C9A227]/50 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl gold-glow my-4 sm:my-8 max-h-none">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-[#E8C468]" />
                <span>{editingArticle ? 'Edit News Article' : 'Write New Article'}</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Publication Status Selector */}
              <div className="p-4 rounded-xl bg-[#0A1440] border border-[#C9A227]/40 space-y-2">
                <label className="block text-xs font-bold text-[#E8C468] uppercase tracking-wider">
                  Publication Status *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                      form.isPublished
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-[#121F54] border-white/10 text-slate-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="isPublished"
                      checked={form.isPublished === true}
                      onChange={() => setForm({ ...form, isPublished: true })}
                      className="hidden"
                    />
                    <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="block text-xs">Published (Live)</span>
                      <span className="text-[10px] font-normal text-slate-300">Visible on public website</span>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                      !form.isPublished
                        ? 'bg-amber-950/60 border-amber-500 text-amber-300 font-bold'
                        : 'bg-[#121F54] border-white/10 text-slate-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="isPublished"
                      checked={form.isPublished === false}
                      onChange={() => setForm({ ...form, isPublished: false })}
                      className="hidden"
                    />
                    <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="block text-xs">Draft (Unpublished)</span>
                      <span className="text-[10px] font-normal text-slate-300">Hidden from public</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Cover Photo */}
              <CloudinaryUploader
                currentImageUrl={form.image}
                onUploadSuccess={(url) => setForm({ ...form, image: url })}
                label="Article Cover Photo (Cloudinary)"
                folder="str-website/news"
              />

              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Scottish Parliament Motion Recognizes Tamil Heritage Month"
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0A1440] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C9A227]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                      URL Slug
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const synced = form.title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
                        setForm((prev) => ({ ...prev, slug: synced }));
                        setIsSlugManuallyEdited(false);
                      }}
                      className="text-[10px] font-semibold text-[#E8C468] hover:text-[#C9A227] flex items-center gap-1 transition-colors cursor-pointer"
                      title="Re-generate slug from title"
                    >
                      <Sparkles className="w-3 h-3 text-[#C9A227]" />
                      <span>Auto-slug</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => {
                      setIsSlugManuallyEdited(true);
                      setForm({ ...form, slug: e.target.value });
                    }}
                    placeholder="custom-url-slug"
                    className="w-full px-3 py-2 rounded-lg bg-[#0A1440] border border-white/10 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A1440] border border-white/10 text-white text-xs"
                  >
                    <option value="Press Release">Press Release</option>
                    <option value="Announcement">Announcement</option>
                    <option value="Community Story">Community Story</option>
                    <option value="Event Highlights">Event Highlights</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A1440] border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                  Article Summary (Brief Overview)
                </label>
                <textarea
                  rows={2}
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  placeholder="Short summary displayed on news cards and search previews..."
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0A1440] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C9A227]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                  Full Article Body Content *
                </label>
                <textarea
                  rows={6}
                  required
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Write the full news article details, press statements, and information..."
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0A1440] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C9A227]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-lg text-slate-300 hover:text-white bg-slate-800 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#C9A227] to-[#E8C468] text-[#0A1440] hover:brightness-110 disabled:opacity-70 flex items-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>
                    {saving
                      ? 'Saving...'
                      : editingArticle
                      ? 'Save Changes'
                      : form.isPublished
                      ? 'Publish Article Live'
                      : 'Save as Draft'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
