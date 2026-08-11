'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CloudinaryUploader from './CloudinaryUploader';
import MultiCloudinaryUploader from './MultiCloudinaryUploader';
import {
  Plus,
  Trash2,
  Edit2,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Filter,
  Settings2,
  Search,
  CheckSquare,
  Square,
  AlertTriangle,
  Folder,
  Images,
  ExternalLink,
  Layers,
  FolderPlus,
  Save,
  UploadCloud,
  Zap,
  RotateCcw,
} from 'lucide-react';

interface GalleryAlbumData {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  coverImage: string;
  date: string;
  order?: number;
  photoCount?: number;
}

interface GalleryItemData {
  _id?: string;
  id?: string;
  title: string;
  category: string;
  albumSlug?: string;
  imageUrl: string;
  alt: string;
  caption: string;
  date: string;
  order: number;
}

interface CategoryStat {
  name: string;
  count: number;
  isDefault: boolean;
}

export default function GalleryManager() {
  const [subTab, setSubTab] = useState<'albums' | 'photos' | 'categories'>('albums');
  const [albums, setAlbums] = useState<GalleryAlbumData[]>([]);
  const [photos, setPhotos] = useState<GalleryItemData[]>([]);
  const [categories, setCategories] = useState<string[]>(['All', 'Festivals', 'Culture', 'Youth', 'Community', 'Sports', 'Other']);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [activeAlbumCategory, setActiveAlbumCategory] = useState<string>('All');
  const [activeAlbumFilter, setActiveAlbumFilter] = useState<string>('All');
  const [activePhotoCategory, setActivePhotoCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showMultiUploadModal, setShowMultiUploadModal] = useState(false);
  const [multiUploadTarget, setMultiUploadTarget] = useState<{ category: string; albumSlug: string }>({
    category: 'Festivals',
    albumSlug: '',
  });

  const [editingAlbum, setEditingAlbum] = useState<GalleryAlbumData | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<GalleryItemData | null>(null);

  // Category CRUD
  const [newCatName, setNewCatName] = useState('');
  const [editingCategoryName, setEditingCategoryName] = useState<string | null>(null);
  const [renameCatValue, setRenameCatValue] = useState('');
  const [deleteTargetCat, setDeleteTargetCat] = useState<CategoryStat | null>(null);
  const [deleteCatAction, setDeleteCatAction] = useState<'reassign' | 'delete_photos'>('reassign');
  const [reassignToCat, setReassignToCat] = useState('Other');

  // Multi-select bulk deletion
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);
  const [bulkMode, setBulkMode] = useState(false);

  // Action states
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Forms
  const [albumForm, setAlbumForm] = useState<GalleryAlbumData>({
    title: '',
    slug: '',
    category: 'Festivals',
    description: '',
    coverImage: '',
    date: new Date().getFullYear().toString(),
  });

  const [photoForm, setPhotoForm] = useState<GalleryItemData>({
    title: '',
    category: 'Festivals',
    albumSlug: '',
    imageUrl: '',
    alt: '',
    caption: '',
    date: new Date().getFullYear().toString(),
    order: 0,
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [albumsRes, photosRes, catsRes] = await Promise.all([
        fetch('/api/admin/gallery/albums'),
        fetch('/api/admin/gallery'),
        fetch('/api/admin/gallery/categories'),
      ]);

      const albumsData = await albumsRes.json();
      const photosData = await photosRes.json();
      const catsData = await catsRes.json();

      if (albumsRes.ok && albumsData.albums) setAlbums(albumsData.albums);
      if (photosRes.ok && photosData.items) setPhotos(photosData.items);
      if (catsRes.ok && catsData.categories) {
        setCategories(Array.from(new Set(['All', ...catsData.categories])));
        if (catsData.categoryStats) setCategoryStats(catsData.categoryStats);
      }
    } catch (err) {
      console.error('Failed to load gallery data', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Helper to calculate photos per album
  const getAlbumPhotoCount = (albSlug: string, albCategory?: string) => {
    return photos.filter((p) => {
      if (p.albumSlug && p.albumSlug === albSlug) return true;
      if (!p.albumSlug && albCategory && p.category?.toLowerCase() === albCategory.toLowerCase()) return true;
      return false;
    }).length;
  };

  // --- Multi Photo Batch Upload Handler ---

  const handleOpenMultiUpload = (category = 'Festivals', albumSlug = '') => {
    const targetCat = category !== 'All' ? category : 'Festivals';
    const targetSlug = albumSlug || (albums.find((a) => a.category === targetCat)?.slug || albums[0]?.slug || '');

    setMultiUploadTarget({
      category: targetCat,
      albumSlug: targetSlug,
    });
    setShowMultiUploadModal(true);
  };

  // --- Album Handlers ---

  const handleOpenAddAlbum = () => {
    setEditingAlbum(null);
    setAlbumForm({
      title: '',
      slug: '',
      category: activeAlbumCategory !== 'All' ? activeAlbumCategory : 'Festivals',
      description: '',
      coverImage: '',
      date: new Date().getFullYear().toString(),
    });
    setShowAlbumModal(true);
  };

  const handleOpenEditAlbum = (alb: GalleryAlbumData) => {
    setEditingAlbum(alb);
    setAlbumForm({
      id: alb._id || alb.id,
      title: alb.title,
      slug: alb.slug,
      category: alb.category,
      description: alb.description || '',
      coverImage: alb.coverImage,
      date: alb.date,
    });
    setShowAlbumModal(true);
  };

  const handleSaveAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumForm.title.trim() || !albumForm.coverImage.trim()) {
      showToast('error', 'Album Title and Cover Photo are required.');
      return;
    }

    setSaving(true);
    try {
      const method = editingAlbum ? 'PUT' : 'POST';
      const body = editingAlbum ? { ...albumForm, id: editingAlbum._id || editingAlbum.id } : albumForm;

      const res = await fetch('/api/admin/gallery/albums', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', editingAlbum ? 'Album updated successfully!' : 'New Album created!');
        setShowAlbumModal(false);
        fetchAllData();
      } else {
        showToast('error', data.message || 'Failed to save album.');
      }
    } catch {
      showToast('error', 'Network error saving album.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAlbum = async (alb: GalleryAlbumData) => {
    const albId = alb._id || alb.id;
    if (!albId) return;

    const deletePhotos = confirm(
      `Delete album "${alb.title}"?\n\nClick OK to also delete all photos in this album, or Cancel if you wish to stop.`
    );
    if (!deletePhotos && !confirm(`Do you want to delete ONLY the album and keep the photos in 'Other'?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/gallery/albums?id=${albId}&deletePhotos=${deletePhotos ? 'true' : 'false'}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', 'Album deleted successfully.');
        fetchAllData();
      } else {
        showToast('error', data.message || 'Failed to delete album');
      }
    } catch {
      showToast('error', 'Error deleting album.');
    }
  };

  // --- Single Photo Handlers ---

  const handleOpenAddPhoto = (targetAlbumSlug?: string) => {
    setEditingPhoto(null);
    const chosenSlug = targetAlbumSlug || (activeAlbumFilter !== 'All' ? activeAlbumFilter : albums[0]?.slug || '');
    const matchedAlbum = albums.find((a) => a.slug === chosenSlug);

    setPhotoForm({
      title: '',
      category: matchedAlbum ? matchedAlbum.category : activePhotoCategory !== 'All' ? activePhotoCategory : 'Festivals',
      albumSlug: chosenSlug,
      imageUrl: '',
      alt: '',
      caption: '',
      date: matchedAlbum ? matchedAlbum.date : new Date().getFullYear().toString(),
      order: photos.length,
    });
    setShowPhotoModal(true);
  };

  const handleOpenEditPhoto = (photo: GalleryItemData) => {
    setEditingPhoto(photo);
    setPhotoForm({
      id: photo._id || photo.id,
      title: photo.title,
      category: photo.category,
      albumSlug: photo.albumSlug || '',
      imageUrl: photo.imageUrl,
      alt: photo.alt,
      caption: photo.caption,
      date: photo.date,
      order: photo.order || 0,
    });
    setShowPhotoModal(true);
  };

  const handleSavePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoForm.title.trim() || !photoForm.imageUrl.trim()) {
      showToast('error', 'Photo Title and Image are required.');
      return;
    }

    setSaving(true);
    try {
      const method = editingPhoto ? 'PUT' : 'POST';
      const body = editingPhoto ? { ...photoForm, id: editingPhoto._id || editingPhoto.id } : photoForm;

      const res = await fetch('/api/admin/gallery', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', editingPhoto ? 'Photo updated successfully!' : 'Photo added to album!');
        setShowPhotoModal(false);
        fetchAllData();
      } else {
        showToast('error', data.message || 'Failed to save photo.');
      }
    } catch {
      showToast('error', 'Network error saving photo.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSinglePhoto = async (id?: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      const res = await fetch(`/api/admin/gallery?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', 'Photo deleted successfully.');
        fetchAllData();
      }
    } catch {
      showToast('error', 'Error deleting photo.');
    }
  };

  const handleBulkDeletePhotos = async () => {
    if (selectedPhotoIds.length === 0) return;
    if (!confirm(`Permanently delete ${selectedPhotoIds.length} selected photo(s)?`)) return;

    try {
      const res = await fetch(`/api/admin/gallery?ids=${selectedPhotoIds.join(',')}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', data.message || `Deleted ${selectedPhotoIds.length} photo(s).`);
        setSelectedPhotoIds([]);
        setBulkMode(false);
        fetchAllData();
      }
    } catch {
      showToast('error', 'Error during bulk deletion.');
    }
  };

  // --- Category Handlers ---

  const handleCreateCategory = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = newCatName.trim();
    if (!clean) return;

    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/gallery/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: clean }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCategories(Array.from(new Set(['All', ...data.categories])));
        if (data.categoryStats) setCategoryStats(data.categoryStats);
        setNewCatName('');
        showToast('success', `Category "${clean}" created successfully!`);
      }
    } catch {
      showToast('error', 'Error creating category.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveRenameCategory = async (oldName: string) => {
    const cleanNew = renameCatValue.trim();
    if (!cleanNew || cleanNew === oldName) {
      setEditingCategoryName(null);
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/gallery/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldName, newName: cleanNew }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCategories(Array.from(new Set(['All', ...data.categories])));
        if (data.categoryStats) setCategoryStats(data.categoryStats);
        setEditingCategoryName(null);
        showToast('success', data.message || `Renamed category to "${cleanNew}"`);
        fetchAllData();
      }
    } catch {
      showToast('error', 'Error renaming category.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDeleteCategory = async () => {
    if (!deleteTargetCat) return;

    setActionLoading(true);
    try {
      const params = new URLSearchParams({
        name: deleteTargetCat.name,
        deletePhotos: deleteCatAction === 'delete_photos' ? 'true' : 'false',
        targetCategory: reassignToCat,
      });

      const res = await fetch(`/api/admin/gallery/categories?${params.toString()}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setCategories(Array.from(new Set(['All', ...data.categories])));
        if (data.categoryStats) setCategoryStats(data.categoryStats);
        setDeleteTargetCat(null);
        showToast('success', data.message || `Category deleted.`);
        fetchAllData();
      }
    } catch {
      showToast('error', 'Error deleting category.');
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered lists
  const filteredAlbums = albums.filter((alb) => {
    const matchCat = activeAlbumCategory === 'All' || alb.category === activeAlbumCategory;
    const matchSearch =
      !searchQuery.trim() ||
      alb.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alb.slug.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredPhotos = photos.filter((p) => {
    // 1. Album matching
    let matchAlbum = true;
    if (activeAlbumFilter !== 'All') {
      const selectedAlb = albums.find((a) => a.slug === activeAlbumFilter);
      matchAlbum =
        p.albumSlug === activeAlbumFilter ||
        Boolean(!p.albumSlug && selectedAlb && (p.category || '').toLowerCase() === (selectedAlb.category || '').toLowerCase());
    }

    // 2. Category matching
    let matchCat = true;
    if (activePhotoCategory !== 'All') {
      matchCat = (p.category || '').toLowerCase() === activePhotoCategory.toLowerCase();
    }

    // 3. Search matching
    const matchSearch =
      !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.albumSlug && p.albumSlug.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchAlbum && matchCat && matchSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1B3A6B] pb-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            <span>Photo & Album Gallery Suite</span>
            <ImageIcon className="w-5 h-5 text-[#E8C468]" />
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Create slug-based event albums, bulk-upload multiple photos to Festival or other categories via Cloudinary.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Multi-Upload Button */}
          <button
            onClick={() => handleOpenMultiUpload(activePhotoCategory !== 'All' ? activePhotoCategory : 'Festivals', activeAlbumFilter !== 'All' ? activeAlbumFilter : '')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#C9A227] to-[#E8C468] text-[#0A1440] shadow-lg hover:brightness-110 transition-all transform hover:scale-[1.02]"
          >
            <Zap className="w-4 h-4" />
            <span>Multiple Photo Upload</span>
          </button>

          <button
            onClick={handleOpenAddAlbum}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#121F54] hover:bg-[#1B3A6B] text-[#E8C468] border border-[#C9A227]/40 shadow-md transition-all"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Create New Album</span>
          </button>

          <button
            onClick={() => handleOpenAddPhoto()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#0A1440] text-slate-200 hover:text-white border border-white/10 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Single Photo</span>
          </button>
        </div>
      </div>

      {/* Toast Alert */}
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

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-white/10 gap-4 text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setSubTab('albums')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            subTab === 'albums'
              ? 'border-[#C9A227] text-[#E8C468]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Folder className="w-4 h-4" />
          <span>Albums & Collections ({albums.length})</span>
        </button>

        <button
          onClick={() => setSubTab('photos')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            subTab === 'photos'
              ? 'border-[#C9A227] text-[#E8C468]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Images className="w-4 h-4" />
          <span>All Photos ({photos.length})</span>
        </button>

        <button
          onClick={() => setSubTab('categories')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            subTab === 'categories'
              ? 'border-[#C9A227] text-[#E8C468]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Settings2 className="w-4 h-4" />
          <span>Category Settings ({categories.filter((c) => c !== 'All').length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: ALBUMS & COLLECTIONS (SLUG-BASED GALLERIES) */}
      {/* ========================================================================= */}
      {subTab === 'albums' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121F54]/70 border border-[#1B3A6B] p-4 rounded-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-[#C9A227]" /> Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveAlbumCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    activeAlbumCategory === cat
                      ? 'bg-[#C9A227] text-[#0A1440] font-bold shadow-md'
                      : 'bg-[#0A1440] text-slate-300 hover:text-white border border-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search albums..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#0A1440] border border-white/10 text-white text-xs placeholder-slate-400 focus:outline-none focus:border-[#C9A227]"
              />
            </div>
          </div>

          {/* Albums Grid */}
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-[#C9A227] animate-spin mx-auto" />
              <p className="text-sm text-slate-300">Loading albums...</p>
            </div>
          ) : filteredAlbums.length === 0 ? (
            <div className="py-16 text-center bg-[#121F54] border border-[#1B3A6B] rounded-2xl p-8 space-y-4">
              <Folder className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-lg font-serif font-bold text-white">No gallery albums found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Create an album or use Multiple Photo Upload to add photos directly.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => handleOpenMultiUpload('Festivals')}
                  className="px-4 py-2 bg-[#C9A227] text-[#0A1440] font-bold text-xs rounded-lg"
                >
                  Upload Multiple Photos
                </button>
                <button
                  onClick={handleOpenAddAlbum}
                  className="px-4 py-2 bg-slate-800 text-white font-bold text-xs rounded-lg"
                >
                  Create Album
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAlbums.map((alb) => {
                const albId = alb._id || alb.id;
                const count = getAlbumPhotoCount(alb.slug, alb.category);

                return (
                  <div
                    key={albId}
                    className="bg-[#121F54] border border-[#1B3A6B] hover:border-[#C9A227]/60 rounded-2xl overflow-hidden shadow-xl transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Cover Photo */}
                      <div className="relative h-48 w-full bg-slate-900 overflow-hidden group">
                        <Image
                          src={alb.coverImage}
                          alt={alb.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold text-[#0A1440] bg-[#E8C468] rounded-full shadow-md">
                            {alb.category}
                          </span>
                        </div>

                        <div className="absolute top-3 right-3">
                          <span className="px-2.5 py-0.5 text-[10px] font-bold text-white bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-1 shadow-md">
                            <Images className="w-3 h-3 text-[#E8C468]" />
                            <span>{count} Photos</span>
                          </span>
                        </div>
                      </div>

                      <div className="p-5 space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>{alb.date}</span>
                          <span className="text-[#E8C468] font-mono text-[11px]">/gallery/{alb.slug}</span>
                        </div>

                        <h3 className="text-base font-serif font-bold text-white line-clamp-1">
                          {alb.title}
                        </h3>
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          {alb.description || 'No description provided.'}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0 border-t border-white/10 mt-3 flex items-center justify-between gap-2">
                      <Link
                        href={`/gallery/${alb.slug}`}
                        target="_blank"
                        className="text-xs font-semibold text-slate-300 hover:text-[#E8C468] flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#E8C468]" />
                        <span>View Live</span>
                      </Link>

                      <div className="flex items-center gap-2">
                        {/* Quick Multi-Upload into this specific album */}
                        <button
                          onClick={() => handleOpenMultiUpload(alb.category, alb.slug)}
                          className="p-2 rounded-lg bg-[#0A1440] hover:bg-[#1B3A6B] text-[#E8C468] border border-white/10 text-xs flex items-center gap-1 font-semibold"
                          title="Upload multiple photos directly to this album"
                        >
                          <Zap className="w-3.5 h-3.5 text-[#C9A227]" />
                          <span>Batch Upload</span>
                        </button>
                        <button
                          onClick={() => handleOpenEditAlbum(alb)}
                          className="p-2 rounded-lg bg-[#1B3A6B] hover:bg-[#C9A227] hover:text-[#0A1440] text-slate-200 text-xs transition-colors"
                          title="Edit album"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteAlbum(alb)}
                          className="p-2 rounded-lg bg-[#8B1A2B]/40 hover:bg-[#8B1A2B] text-rose-300 hover:text-white text-xs transition-colors"
                          title="Delete album"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: ALL PHOTOS LIST (WITH BULK SELECTION & ALBUM FILTERS) */}
      {/* ========================================================================= */}
      {subTab === 'photos' && (
        <div className="space-y-6">
          <div className="bg-[#121F54]/70 border border-[#1B3A6B] p-4 sm:p-5 rounded-2xl space-y-4">
            {/* Filter controls row */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Album & Category Selectors */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Album filter dropdown */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-300 font-semibold flex items-center gap-1">
                    <Folder className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>Filter by Album:</span>
                  </span>
                  <select
                    value={activeAlbumFilter}
                    onChange={(e) => setActiveAlbumFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-[#0A1440] border border-[#C9A227]/40 text-white text-xs font-semibold focus:outline-none focus:border-[#C9A227] max-w-[260px] truncate"
                  >
                    <option value="All">All Albums ({photos.length})</option>
                    {albums.map((alb) => {
                      const count = getAlbumPhotoCount(alb.slug, alb.category);
                      return (
                        <option key={alb.slug} value={alb.slug}>
                          {alb.title} ({count})
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Category filter dropdown */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-300 font-semibold flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5 text-[#E8C468]" />
                    <span>Category:</span>
                  </span>
                  <select
                    value={activePhotoCategory}
                    onChange={(e) => setActivePhotoCategory(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-[#0A1440] border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-[#C9A227]"
                  >
                    {categories.map((cat) => {
                      const count =
                        cat === 'All'
                          ? photos.length
                          : photos.filter((p) => p.category?.toLowerCase() === cat.toLowerCase()).length;
                      return (
                        <option key={cat} value={cat}>
                          {cat} ({count})
                        </option>
                      );
                    })}
                  </select>
                </div>

                {(activeAlbumFilter !== 'All' || activePhotoCategory !== 'All' || searchQuery) && (
                  <button
                    onClick={() => {
                      setActiveAlbumFilter('All');
                      setActivePhotoCategory('All');
                      setSearchQuery('');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors"
                    title="Reset all filters"
                  >
                    <RotateCcw className="w-3 h-3 text-[#E8C468]" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Search Box */}
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search photo titles..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0A1440] border border-white/10 text-white text-xs placeholder-slate-400 focus:outline-none focus:border-[#C9A227]"
                />
              </div>
            </div>

            {/* Batch mode bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setBulkMode(!bulkMode);
                    if (bulkMode) setSelectedPhotoIds([]);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                    bulkMode
                      ? 'bg-[#E8C468] text-[#0A1440]'
                      : 'bg-[#0A1440] text-slate-300 hover:text-white border border-white/10'
                  }`}
                >
                  {bulkMode ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                  <span>{bulkMode ? 'Exit Batch Mode' : 'Batch Select Photos'}</span>
                </button>

                {bulkMode && (
                  <button
                    onClick={() => {
                      if (selectedPhotoIds.length === filteredPhotos.length) setSelectedPhotoIds([]);
                      else setSelectedPhotoIds(filteredPhotos.map((p) => (p._id || p.id) as string));
                    }}
                    className="text-slate-300 hover:text-[#E8C468] underline font-medium"
                  >
                    {selectedPhotoIds.length === filteredPhotos.length ? 'Deselect All' : 'Select All Filtered'}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-slate-400 text-xs">
                  Showing <strong className="text-[#E8C468]">{filteredPhotos.length}</strong> of {photos.length} photos
                </span>

                {bulkMode && selectedPhotoIds.length > 0 && (
                  <button
                    onClick={handleBulkDeletePhotos}
                    className="px-3.5 py-1.5 rounded-lg bg-[#8B1A2B] hover:bg-rose-700 text-white font-bold flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Selected ({selectedPhotoIds.length})</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Photos Grid */}
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-[#C9A227] animate-spin mx-auto" />
              <p className="text-sm text-slate-300">Loading photos...</p>
            </div>
          ) : filteredPhotos.length === 0 ? (
            <div className="py-16 text-center bg-[#121F54] border border-[#1B3A6B] rounded-2xl p-8 space-y-4">
              <ImageIcon className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-lg font-serif font-bold text-white">No photos match the current filter</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {activeAlbumFilter !== 'All'
                  ? `No photos found in selected album. Use Batch Upload to add photos directly.`
                  : `No photos available.`}
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => handleOpenMultiUpload(activePhotoCategory !== 'All' ? activePhotoCategory : 'Festivals', activeAlbumFilter !== 'All' ? activeAlbumFilter : '')}
                  className="px-4 py-2 bg-[#C9A227] text-[#0A1440] font-bold text-xs rounded-lg flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Upload Multiple Photos</span>
                </button>
                {(activeAlbumFilter !== 'All' || activePhotoCategory !== 'All' || searchQuery) && (
                  <button
                    onClick={() => {
                      setActiveAlbumFilter('All');
                      setActivePhotoCategory('All');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 bg-slate-800 text-white font-bold text-xs rounded-lg"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPhotos.map((photo) => {
                const photoId = (photo._id || photo.id) as string;
                const isSelected = selectedPhotoIds.includes(photoId);
                const matchedAlbum = albums.find((a) => a.slug === photo.albumSlug);

                return (
                  <div
                    key={photoId}
                    onClick={() => {
                      if (bulkMode) {
                        if (isSelected) setSelectedPhotoIds(selectedPhotoIds.filter((i) => i !== photoId));
                        else setSelectedPhotoIds([...selectedPhotoIds, photoId]);
                      }
                    }}
                    className={`bg-[#121F54] border rounded-2xl overflow-hidden shadow-lg transition-all group flex flex-col justify-between relative ${
                      isSelected
                        ? 'border-[#C9A227] ring-2 ring-[#C9A227]/50 bg-[#1B3A6B]/50'
                        : 'border-[#1B3A6B] hover:border-[#C9A227]/60'
                    }`}
                  >
                    {bulkMode && (
                      <div className="absolute top-3 right-3 z-20 p-1 rounded-lg bg-black/60 backdrop-blur-md">
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-[#E8C468]" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    )}

                    <div>
                      <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                        <Image
                          src={photo.imageUrl}
                          alt={photo.alt || photo.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold text-[#0A1440] bg-[#E8C468] rounded-full shadow-md">
                            {photo.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>{photo.date}</span>
                          <span className="text-[#E8C468] text-[10px] truncate max-w-[150px] font-mono" title={photo.albumSlug}>
                            {matchedAlbum?.title || photo.albumSlug || 'Unassigned'}
                          </span>
                        </div>
                        <h3 className="text-sm font-serif font-bold text-white line-clamp-1">
                          {photo.title}
                        </h3>
                        {photo.caption && (
                          <p className="text-xs text-slate-300 line-clamp-2">{photo.caption}</p>
                        )}
                      </div>
                    </div>

                    <div className="p-4 pt-0 border-t border-white/10 mt-3 flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditPhoto(photo);
                        }}
                        className="p-2 rounded-lg bg-[#1B3A6B] hover:bg-[#C9A227] hover:text-[#0A1440] text-slate-200 text-xs flex items-center gap-1 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSinglePhoto(photoId);
                        }}
                        className="p-2 rounded-lg bg-[#8B1A2B]/40 hover:bg-[#8B1A2B] text-rose-300 hover:text-white text-xs flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: CATEGORY SETTINGS & CRUD */}
      {/* ========================================================================= */}
      {subTab === 'categories' && (
        <div className="max-w-3xl space-y-6">
          {/* Create category box */}
          <div className="bg-[#121F54] border border-[#1B3A6B] p-5 rounded-2xl space-y-3 shadow-xl">
            <h3 className="text-sm font-serif font-bold text-white flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-[#E8C468]" />
              <span>Create New Category</span>
            </h3>
            <form onSubmit={handleCreateCategory} className="flex gap-3">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Tamil New Year 2026, Highland Excursion..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#0A1440] border border-white/10 text-white text-xs placeholder-slate-400 focus:outline-none focus:border-[#C9A227]"
              />
              <button
                type="submit"
                disabled={actionLoading || !newCatName.trim()}
                className="px-5 py-2.5 bg-[#C9A227] hover:bg-[#E8C468] text-[#0A1440] font-bold text-xs rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </form>
          </div>

          {/* Existing Categories Table */}
          <div className="bg-[#121F54] border border-[#1B3A6B] rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-serif font-bold text-white">
              Category Registry ({categories.filter((c) => c !== 'All').length})
            </h3>

            <div className="divide-y divide-white/10 border border-white/10 rounded-xl bg-[#0A1440]">
              {categories
                .filter((cat) => cat !== 'All')
                .map((cat) => {
                  const stat = categoryStats.find((s) => s.name === cat);
                  const count = stat?.count || photos.filter((p) => p.category === cat).length;
                  const isEditing = editingCategoryName === cat;

                  return (
                    <div
                      key={cat}
                      className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#121F54]/50 transition-colors"
                    >
                      {isEditing ? (
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            type="text"
                            value={renameCatValue}
                            autoFocus
                            onChange={(e) => setRenameCatValue(e.target.value)}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-[#0A1440] border border-[#C9A227] text-white text-xs focus:outline-none"
                          />
                          <button
                            onClick={() => handleSaveRenameCategory(cat)}
                            disabled={actionLoading}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingCategoryName(null)}
                            className="px-2.5 py-1.5 bg-slate-700 text-slate-200 rounded-lg text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-xs sm:text-sm text-white">{cat}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1B3A6B] text-[#E8C468] font-bold">
                              {count} photos
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingCategoryName(cat);
                                setRenameCatValue(cat);
                              }}
                              className="p-1.5 rounded-lg bg-[#1B3A6B] hover:bg-[#C9A227] hover:text-[#0A1440] text-slate-300 text-xs transition-colors"
                              title="Rename category"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setDeleteTargetCat({
                                  name: cat,
                                  count,
                                  isDefault: false,
                                });
                                setReassignToCat(categories.find((c) => c !== 'All' && c !== cat) || 'Other');
                              }}
                              className="p-1.5 rounded-lg bg-[#8B1A2B]/30 hover:bg-[#8B1A2B] text-rose-300 hover:text-white text-xs transition-colors"
                              title="Delete category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Delete Category Confirmation Dialog */}
          {deleteTargetCat && (
            <div className="p-5 rounded-2xl bg-[#8B1A2B]/20 border border-[#8B1A2B] space-y-3 shadow-xl">
              <div className="flex items-center gap-2 text-[#E8C468] text-xs font-bold uppercase">
                <AlertTriangle className="w-4 h-4 text-[#8B1A2B]" />
                <span>Delete Category &quot;{deleteTargetCat.name}&quot;</span>
              </div>

              <p className="text-xs text-slate-300">
                This category has <strong className="text-white">{deleteTargetCat.count} photo(s)</strong>. Choose an action:
              </p>

              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                  <input
                    type="radio"
                    name="deleteCategoryAction"
                    checked={deleteCatAction === 'reassign'}
                    onChange={() => setDeleteCatAction('reassign')}
                  />
                  <span>Reassign photos to:</span>
                  <select
                    value={reassignToCat}
                    onChange={(e) => setReassignToCat(e.target.value)}
                    className="px-2 py-1 rounded bg-[#0A1440] border border-white/20 text-white text-xs"
                  >
                    {categories
                      .filter((c) => c !== 'All' && c !== deleteTargetCat.name)
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-rose-300">
                  <input
                    type="radio"
                    name="deleteCategoryAction"
                    checked={deleteCatAction === 'delete_photos'}
                    onChange={() => setDeleteCatAction('delete_photos')}
                  />
                  <span>Delete category and ALL its {deleteTargetCat.count} photo(s)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setDeleteTargetCat(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDeleteCategory}
                  disabled={actionLoading}
                  className="px-4 py-1.5 rounded-lg bg-[#8B1A2B] hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  <span>Confirm Delete</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: MULTIPLE PHOTO BATCH UPLOADER */}
      {/* ========================================================================= */}
      {showMultiUploadModal && (
        <MultiCloudinaryUploader
          albums={albums}
          categories={categories}
          defaultCategory={multiUploadTarget.category || 'Festivals'}
          defaultAlbumSlug={multiUploadTarget.albumSlug}
          onUploadComplete={() => {
            setShowMultiUploadModal(false);
            showToast('success', 'Batch photo upload completed successfully!');
            fetchAllData();
          }}
          onClose={() => setShowMultiUploadModal(false)}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CREATE / EDIT ALBUM */}
      {/* ========================================================================= */}
      {showAlbumModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#121F54] border border-[#C9A227]/50 rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl gold-glow my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-[#E8C468]" />
                <span>{editingAlbum ? 'Edit Gallery Album' : 'Create New Gallery Album'}</span>
              </h3>
              <button
                onClick={() => setShowAlbumModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAlbum} className="space-y-4">
              {/* Cover Photo */}
              <CloudinaryUploader
                currentImageUrl={albumForm.coverImage}
                onUploadSuccess={(url) => setAlbumForm({ ...albumForm, coverImage: url })}
                label="Album Cover Photo (Cloudinary / URL) *"
                folder="str-website/albums"
              />

              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                  Album Title *
                </label>
                <input
                  type="text"
                  required
                  value={albumForm.title}
                  onChange={(e) => {
                    const val = e.target.value;
                    const autoSlug = !editingAlbum
                      ? val
                          .toLowerCase()
                          .trim()
                          .replace(/[^\w\s-]/g, '')
                          .replace(/[\s_-]+/g, '-')
                      : albumForm.slug;
                    setAlbumForm({ ...albumForm, title: val, slug: autoSlug });
                  }}
                  placeholder="e.g. Scotland Grand Tamil Pongal Vizha 2026"
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0A1440] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C9A227]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={albumForm.slug}
                    onChange={(e) => setAlbumForm({ ...albumForm, slug: e.target.value })}
                    placeholder="scotland-tamil-pongal-2026"
                    className="w-full px-3 py-2 rounded-lg bg-[#0A1440] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C9A227]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Path: /gallery/{albumForm.slug || '...'}</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={albumForm.category}
                    onChange={(e) => setAlbumForm({ ...albumForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A1440] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C9A227]"
                  >
                    {categories
                      .filter((c) => c !== 'All')
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                  Date / Year
                </label>
                <input
                  type="text"
                  value={albumForm.date}
                  onChange={(e) => setAlbumForm({ ...albumForm, date: e.target.value })}
                  placeholder="e.g. Jan 2026"
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0A1440] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C9A227]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                  Album Description
                </label>
                <textarea
                  rows={3}
                  value={albumForm.description}
                  onChange={(e) => setAlbumForm({ ...albumForm, description: e.target.value })}
                  placeholder="Describe the occasion, highlights, city, or event details..."
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0A1440] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C9A227]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAlbumModal(false)}
                  className="px-4 py-2.5 rounded-lg text-slate-300 hover:text-white bg-slate-800 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#C9A227] to-[#E8C468] text-[#0A1440] hover:brightness-110 disabled:opacity-70 flex items-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{saving ? 'Saving...' : editingAlbum ? 'Save Updates' : 'Create Album'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: UPLOAD / EDIT INDIVIDUAL PHOTO */}
      {/* ========================================================================= */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#121F54] border border-[#C9A227]/50 rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl gold-glow my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#E8C468]" />
                <span>{editingPhoto ? 'Edit Photo' : 'Upload New Photo'}</span>
              </h3>
              <button
                onClick={() => setShowPhotoModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePhoto} className="space-y-4">
              <CloudinaryUploader
                currentImageUrl={photoForm.imageUrl}
                onUploadSuccess={(url) => setPhotoForm({ ...photoForm, imageUrl: url })}
                label="Photo File (Cloudinary / URL) *"
                folder="str-website/gallery"
              />

              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                  Photo Title *
                </label>
                <input
                  type="text"
                  required
                  value={photoForm.title}
                  onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
                  placeholder="e.g. Grand Pongal Pot Preparation"
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0A1440] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C9A227]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                    Assign to Album / Collection
                  </label>
                  <select
                    value={photoForm.albumSlug}
                    onChange={(e) => {
                      const slug = e.target.value;
                      const matched = albums.find((a) => a.slug === slug);
                      setPhotoForm({
                        ...photoForm,
                        albumSlug: slug,
                        category: matched ? matched.category : photoForm.category,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A1440] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C9A227]"
                  >
                    <option value="">-- No Specific Album (Loose Photo) --</option>
                    {albums.map((alb) => (
                      <option key={alb.slug} value={alb.slug}>
                        {alb.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={photoForm.category}
                    onChange={(e) => setPhotoForm({ ...photoForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A1440] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C9A227]"
                  >
                    {categories
                      .filter((c) => c !== 'All')
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                  Photo Caption
                </label>
                <textarea
                  rows={3}
                  value={photoForm.caption}
                  onChange={(e) => setPhotoForm({ ...photoForm, caption: e.target.value })}
                  placeholder="Describe this photo occasion, performers, city..."
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0A1440] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C9A227]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowPhotoModal(false)}
                  className="px-4 py-2.5 rounded-lg text-slate-300 hover:text-white bg-slate-800 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#C9A227] to-[#E8C468] text-[#0A1440] hover:brightness-110 disabled:opacity-70 flex items-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{saving ? 'Saving...' : editingPhoto ? 'Save Photo' : 'Upload Photo'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
