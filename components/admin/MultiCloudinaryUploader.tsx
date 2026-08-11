'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  UploadCloud,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Folder,
  Images,
  Trash2,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';

interface FileQueueItem {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  size: string;
  status: 'pending' | 'uploading' | 'done' | 'error';
  progress?: number;
  uploadedUrl?: string;
  error?: string;
}

interface MultiCloudinaryUploaderProps {
  albums: Array<{ slug: string; title: string; category: string; date?: string }>;
  categories: string[];
  defaultCategory?: string;
  defaultAlbumSlug?: string;
  onUploadComplete: () => void;
  onClose: () => void;
}

export default function MultiCloudinaryUploader({
  albums,
  categories,
  defaultCategory,
  defaultAlbumSlug = '',
  onUploadComplete,
  onClose,
}: MultiCloudinaryUploaderProps) {
  const [fileQueue, setFileQueue] = useState<FileQueueItem[]>([]);

  // Find initial matching album (prioritizes defaultAlbumSlug -> category match -> first available album)
  const initialMatchedAlbum =
    (defaultAlbumSlug ? albums.find((a) => a.slug === defaultAlbumSlug) : null) ||
    (defaultCategory ? albums.find((a) => (a.category || '').toLowerCase() === defaultCategory.toLowerCase()) : null) ||
    albums[0];

  const resolvedInitialSlug = defaultAlbumSlug || initialMatchedAlbum?.slug || '';
  const resolvedInitialCat =
    initialMatchedAlbum?.category ||
    defaultCategory ||
    categories.find((c) => c !== 'All') ||
    'General';

  const [selectedAlbumSlug, setSelectedAlbumSlug] = useState<string>(resolvedInitialSlug);
  const [selectedCategory, setSelectedCategory] = useState<string>(resolvedInitialCat);
  const [dateYear, setDateYear] = useState<string>(
    initialMatchedAlbum?.date || new Date().getFullYear().toString()
  );
  const [titlePrefix, setTitlePrefix] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [globalError, setGlobalError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize category & date when selectedAlbumSlug changes
  useEffect(() => {
    if (selectedAlbumSlug) {
      const matched = albums.find((a) => a.slug === selectedAlbumSlug);
      if (matched) {
        if (matched.category) setSelectedCategory(matched.category);
        if (matched.date) setDateYear(matched.date);
      }
    }
  }, [selectedAlbumSlug, albums]);

  const handleAlbumChange = (slug: string) => {
    setSelectedAlbumSlug(slug);
    if (!slug) return;
    const matched = albums.find((a) => a.slug === slug);
    if (matched) {
      if (matched.category) setSelectedCategory(matched.category);
      if (matched.date) setDateYear(matched.date);
    }
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    // If the currently selected album does not match this category, switch to the first album in this category
    const currentAlbum = albums.find((a) => a.slug === selectedAlbumSlug);
    if (!currentAlbum || (currentAlbum.category || '').toLowerCase() !== cat.toLowerCase()) {
      const firstAlbumInCat = albums.find((a) => (a.category || '').toLowerCase() === cat.toLowerCase());
      if (firstAlbumInCat) {
        setSelectedAlbumSlug(firstAlbumInCat.slug);
        if (firstAlbumInCat.date) setDateYear(firstAlbumInCat.date);
      } else if (albums.length > 0) {
        setSelectedAlbumSlug(albums[0].slug);
      }
    }
  };

  // Compile list of all distinct available categories
  const allDropdownCategories = Array.from(
    new Set([
      ...categories.filter((c) => c && c !== 'All'),
      ...albums.map((a) => a.category).filter(Boolean),
      selectedCategory,
    ])
  ).filter(Boolean);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFilesAdded = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setGlobalError(null);
    const newItems: FileQueueItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        continue;
      }
      newItems.push({
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        name: file.name,
        size: formatFileSize(file.size),
        status: 'pending',
      });
    }

    if (newItems.length === 0) {
      setGlobalError('Please select valid image files (JPG, PNG, WebP).');
      return;
    }

    setFileQueue((prev) => [...prev, ...newItems]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  const handleRemoveItem = (id: string) => {
    setFileQueue((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const handleStartBatchUpload = async () => {
    if (fileQueue.length === 0) {
      setGlobalError('Please add at least one photo to upload.');
      return;
    }

    // Ensure we always have an assigned album slug
    const targetAlbumSlug = selectedAlbumSlug || (albums.length > 0 ? albums[0].slug : '');
    const matchedAlbum = albums.find((a) => a.slug === targetAlbumSlug);
    const resolvedCat = selectedCategory || matchedAlbum?.category || 'General';

    if (!targetAlbumSlug && albums.length > 0) {
      setGlobalError('Please select an album to assign these photos.');
      return;
    }

    setUploading(true);
    setGlobalError(null);

    const uploadedResults: Array<{
      title: string;
      category: string;
      albumSlug: string;
      imageUrl: string;
      date: string;
      order: number;
    }> = [];

    for (let i = 0; i < fileQueue.length; i++) {
      const item = fileQueue[i];
      setProgressText(`Uploading photo ${i + 1} of ${fileQueue.length}: ${item.name}...`);

      setFileQueue((prev) =>
        prev.map((it, idx) => (idx === i ? { ...it, status: 'uploading' } : it))
      );

      try {
        const formData = new FormData();
        formData.append('file', item.file);
        formData.append('folder', `str-website/${targetAlbumSlug || resolvedCat.toLowerCase()}`);

        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok || !uploadData.url) {
          throw new Error(uploadData.message || 'Upload failed');
        }

        // Clean auto title from filename or prefix
        const rawBase = item.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        const cleanName = rawBase.charAt(0).toUpperCase() + rawBase.slice(1);
        const finalTitle = titlePrefix.trim()
          ? `${titlePrefix.trim()} #${i + 1}`
          : matchedAlbum
          ? `${matchedAlbum.title} - ${cleanName}`
          : cleanName;

        uploadedResults.push({
          title: finalTitle,
          category: resolvedCat,
          albumSlug: targetAlbumSlug,
          imageUrl: uploadData.url,
          date: dateYear.trim() || matchedAlbum?.date || new Date().getFullYear().toString(),
          order: i,
        });

        setFileQueue((prev) =>
          prev.map((it, idx) =>
            idx === i ? { ...it, status: 'done', uploadedUrl: uploadData.url } : it
          )
        );
      } catch (err: any) {
        setFileQueue((prev) =>
          prev.map((it, idx) =>
            idx === i ? { ...it, status: 'error', error: err.message } : it
          )
        );
      }
    }

    if (uploadedResults.length > 0) {
      setProgressText(`Saving ${uploadedResults.length} photos to album "${matchedAlbum?.title || targetAlbumSlug}"...`);
      try {
        const saveRes = await fetch('/api/admin/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: uploadedResults }),
        });

        const saveData = await saveRes.json();
        if (saveRes.ok && saveData.success) {
          setTimeout(() => {
            onUploadComplete();
          }, 800);
          return;
        } else {
          setGlobalError(saveData.message || 'Failed to save photo records in database.');
        }
      } catch {
        setGlobalError('Network error while saving photos to database.');
      }
    }

    setUploading(false);
  };

  const doneCount = fileQueue.filter((i) => i.status === 'done').length;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#121F54] border border-[#C9A227]/50 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl gold-glow my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-[#C9A227] to-[#E8C468] text-[#0A1440] shadow-md">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-white">Multiple Photo Batch Uploader</h3>
              <p className="text-xs text-slate-300">
                Select multiple photos and batch upload directly to Cloudinary &amp; your chosen album.
              </p>
            </div>
          </div>

          {!uploading && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Global Error Banner */}
        {globalError && (
          <div className="p-3.5 rounded-xl bg-[#8B1A2B]/30 border border-[#8B1A2B] text-[#E8C468] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#8B1A2B] shrink-0" />
            <span>{globalError}</span>
          </div>
        )}

        {/* Target Assignment Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#0A1440] p-4 rounded-2xl border border-white/10">
          <div>
            <label className="block text-[11px] font-bold text-slate-200 uppercase tracking-wider mb-1">
              Assign to Album *
            </label>
            <select
              value={selectedAlbumSlug}
              onChange={(e) => handleAlbumChange(e.target.value)}
              disabled={uploading}
              className="w-full px-3 py-2 rounded-xl bg-[#121F54] border border-[#C9A227]/40 text-white text-xs font-semibold focus:outline-none focus:border-[#C9A227]"
            >
              {albums.length > 0 ? (
                albums.map((alb) => (
                  <option key={alb.slug} value={alb.slug}>
                    {alb.title} ({alb.category})
                  </option>
                ))
              ) : (
                <option value="">-- No Albums Created Yet --</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-200 uppercase tracking-wider mb-1">
              Category *
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              disabled={uploading}
              className="w-full px-3 py-2 rounded-xl bg-[#121F54] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C9A227]"
            >
              {allDropdownCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-200 uppercase tracking-wider mb-1">
              Event Date / Year
            </label>
            <input
              type="text"
              value={dateYear}
              onChange={(e) => setDateYear(e.target.value)}
              disabled={uploading}
              placeholder="e.g. Jan 2026"
              className="w-full px-3 py-2 rounded-xl bg-[#121F54] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C9A227]"
            />
          </div>
        </div>

        {/* Multi-Photo Dropzone Area */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragOver
              ? 'border-[#C9A227] bg-[#1B3A6B]/50 scale-[1.01]'
              : 'border-[#1B3A6B] hover:border-[#C9A227]/70 bg-[#0A1440]/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFilesAdded(e.target.files)}
            className="hidden"
          />

          <div className="w-14 h-14 rounded-full bg-[#121F54] border border-[#C9A227]/40 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <UploadCloud className="w-7 h-7 text-[#E8C468]" />
          </div>

          <p className="text-sm font-semibold text-white">
            Click to Select Multiple Photos or Drag &amp; Drop Batch Here
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Select 5, 10, 20+ photos at once (JPG, PNG, WebP). Directly uploads to Cloudinary CDN.
          </p>
        </div>

        {/* Selected Photos Queue List */}
        {fileQueue.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Images className="w-4 h-4 text-[#E8C468]" />
                <span>
                  Selected Queue ({fileQueue.length} photos) • {doneCount} uploaded
                </span>
              </span>

              {!uploading && (
                <button
                  onClick={() => setFileQueue([])}
                  className="text-rose-400 hover:text-rose-300 underline text-xs"
                >
                  Clear Queue
                </button>
              )}
            </div>

            <div className="max-h-56 overflow-y-auto pr-1 space-y-2 divide-y divide-white/5 border border-white/10 rounded-2xl bg-[#0A1440] p-2">
              {fileQueue.map((item) => (
                <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between gap-3 p-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-900 border border-white/10">
                      <Image src={item.previewUrl} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-400">{item.size}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.status === 'pending' && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        Ready
                      </span>
                    )}
                    {item.status === 'uploading' && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#1B3A6B] text-[#E8C468] flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Uploading
                      </span>
                    )}
                    {item.status === 'done' && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Uploaded
                      </span>
                    )}
                    {item.status === 'error' && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#8B1A2B]/40 text-rose-300 flex items-center gap-1" title={item.error}>
                        <AlertCircle className="w-3 h-3" />
                        Failed
                      </span>
                    )}

                    {!uploading && (
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-white/5"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Progress Status */}
        {uploading && (
          <div className="p-4 rounded-2xl bg-[#0A1440] border border-[#C9A227]/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span className="flex items-center gap-2 text-[#E8C468]">
                <Loader2 className="w-4 h-4 animate-spin text-[#C9A227]" />
                <span>{progressText}</span>
              </span>
              <span>{Math.round((doneCount / (fileQueue.length || 1)) * 100)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#C9A227] to-[#E8C468] transition-all duration-300"
                style={{ width: `${(doneCount / (fileQueue.length || 1)) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            disabled={uploading}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleStartBatchUpload}
            disabled={uploading || fileQueue.length === 0}
            className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#C9A227] to-[#E8C468] text-[#0A1440] shadow-lg hover:brightness-110 disabled:opacity-50 flex items-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading ({doneCount}/{fileQueue.length})...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Upload {fileQueue.length > 0 ? `${fileQueue.length} Photos` : 'Batch Now'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
