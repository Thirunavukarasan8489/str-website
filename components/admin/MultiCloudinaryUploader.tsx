'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  UploadCloud,
  Images,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Layers,
  FileImage,
} from 'lucide-react';

interface FileQueueItem {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  size: string;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  uploadedUrl?: string;
  errorText?: string;
}

interface MultiCloudinaryUploaderProps {
  albums: { title: string; slug: string; category: string; date?: string }[];
  categories: string[];
  defaultCategory?: string;
  defaultAlbumSlug?: string;
  onUploadComplete: () => void;
  onClose: () => void;
}

export default function MultiCloudinaryUploader({
  albums,
  categories,
  defaultCategory = 'Festivals',
  defaultAlbumSlug = '',
  onUploadComplete,
  onClose,
}: MultiCloudinaryUploaderProps) {
  const [fileQueue, setFileQueue] = useState<FileQueueItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory);
  const [selectedAlbumSlug, setSelectedAlbumSlug] = useState<string>(defaultAlbumSlug);
  const [dateYear, setDateYear] = useState<string>(new Date().getFullYear().toString());
  const [titlePrefix, setTitlePrefix] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [globalError, setGlobalError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setGlobalError('Please select at least 1 image to upload.');
      return;
    }

    setUploading(true);
    setGlobalError(null);

    const uploadedRecords: Array<{
      title: string;
      category: string;
      albumSlug: string;
      imageUrl: string;
      alt: string;
      caption: string;
      date: string;
    }> = [];

    const total = fileQueue.length;
    let completedCount = 0;

    for (let idx = 0; idx < fileQueue.length; idx++) {
      const item = fileQueue[idx];
      setProgressText(`Uploading ${idx + 1} of ${total}: ${item.name}...`);

      setFileQueue((prev) =>
        prev.map((it, i) => (i === idx ? { ...it, status: 'uploading' } : it))
      );

      try {
        const formData = new FormData();
        formData.append('file', item.file);
        formData.append('folder', 'str-website/gallery');

        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        const uploadData = await uploadRes.json();

        if (uploadRes.ok && uploadData.success && (uploadData.secure_url || uploadData.url)) {
          const finalUrl = uploadData.secure_url || uploadData.url;
          completedCount++;

          setFileQueue((prev) =>
            prev.map((it, i) =>
              i === idx ? { ...it, status: 'completed', uploadedUrl: finalUrl } : it
            )
          );

          // Clean title generator
          const rawName = item.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ');
          const title = titlePrefix.trim()
            ? `${titlePrefix.trim()} #${idx + 1}`
            : rawName.charAt(0).toUpperCase() + rawName.slice(1);

          uploadedRecords.push({
            title,
            category: selectedCategory,
            albumSlug: selectedAlbumSlug,
            imageUrl: finalUrl,
            alt: title,
            caption: '',
            date: dateYear,
          });
        } else {
          setFileQueue((prev) =>
            prev.map((it, i) =>
              i === idx ? { ...it, status: 'error', errorText: uploadData.message || 'Upload failed' } : it
            )
          );
        }
      } catch (err: any) {
        setFileQueue((prev) =>
          prev.map((it, i) =>
            i === idx ? { ...it, status: 'error', errorText: 'Network upload error' } : it
          )
        );
      }
    }

    // Save all uploaded records in MongoDB
    if (uploadedRecords.length > 0) {
      setProgressText(`Saving ${uploadedRecords.length} photos to database...`);
      try {
        const dbRes = await fetch('/api/admin/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: uploadedRecords }),
        });

        const dbData = await dbRes.json();
        if (dbRes.ok && dbData.success) {
          setProgressText(`Done! Successfully uploaded and saved ${uploadedRecords.length} photos.`);
          setTimeout(() => {
            onUploadComplete();
          }, 1200);
        } else {
          setGlobalError(dbData.message || 'Error saving photos to database.');
        }
      } catch (err) {
        setGlobalError('Network error saving gallery items.');
      }
    } else {
      setGlobalError('No photos were successfully uploaded to Cloudinary.');
    }

    setUploading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#121F54] border border-[#C9A227]/50 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl gold-glow my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C9A227] to-[#E8C468] flex items-center justify-center text-[#0A1440] shadow-md">
              <Images className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-white">
                Multiple Photo Batch Uploader
              </h3>
              <p className="text-xs text-slate-300">
                Select multiple festival or event photos and upload them all in one click.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={uploading}
            className="text-slate-400 hover:text-white p-1 rounded-lg disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {globalError && (
          <div className="p-3.5 rounded-xl bg-[#8B1A2B]/20 border border-[#8B1A2B] text-[#E8C468] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#8B1A2B] shrink-0" />
            <span>{globalError}</span>
          </div>
        )}

        {/* Target Assignment Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#0A1440] p-4 rounded-2xl border border-white/10">
          <div>
            <label className="block text-[11px] font-bold text-slate-200 uppercase tracking-wider mb-1">
              Category *
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={uploading}
              className="w-full px-3 py-2 rounded-xl bg-[#121F54] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C9A227]"
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

          <div>
            <label className="block text-[11px] font-bold text-slate-200 uppercase tracking-wider mb-1">
              Assign to Album
            </label>
            <select
              value={selectedAlbumSlug}
              onChange={(e) => {
                const slug = e.target.value;
                setSelectedAlbumSlug(slug);
                const matched = albums.find((a) => a.slug === slug);
                if (matched) setSelectedCategory(matched.category);
              }}
              disabled={uploading}
              className="w-full px-3 py-2 rounded-xl bg-[#121F54] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C9A227]"
            >
              <option value="">-- No Specific Album --</option>
              {albums.map((alb) => (
                <option key={alb.slug} value={alb.slug}>
                  {alb.title}
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
            type="file"
            multiple
            ref={fileInputRef}
            onChange={(e) => handleFilesAdded(e.target.files)}
            accept="image/*"
            className="hidden"
          />

          <div className="space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#121F54] border border-[#C9A227]/40 text-[#E8C468] flex items-center justify-center mx-auto shadow-inner">
              <UploadCloud className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                Click to Select Multiple Photos or Drag & Drop Batch Here
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Select 5, 10, 20+ photos at once (JPG, PNG, WebP). Directly uploads to Cloudinary CDN.
              </p>
            </div>
          </div>
        </div>

        {/* Selected Photos Queue Preview Grid */}
        {fileQueue.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#E8C468] uppercase tracking-wider flex items-center gap-1.5">
                <FileImage className="w-3.5 h-3.5" />
                <span>Selected Photos Queue ({fileQueue.length})</span>
              </span>

              {!uploading && (
                <button
                  type="button"
                  onClick={() => setFileQueue([])}
                  className="text-[11px] text-rose-300 hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-56 overflow-y-auto p-2 bg-[#0A1440] rounded-2xl border border-white/10">
              {fileQueue.map((item) => (
                <div
                  key={item.id}
                  className="relative group rounded-xl overflow-hidden border border-white/10 bg-slate-900 h-24 flex flex-col justify-end p-1.5"
                >
                  <Image
                    src={item.previewUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

                  {/* Status Badges */}
                  <div className="absolute top-1.5 left-1.5 z-10">
                    {item.status === 'completed' && (
                      <span className="p-0.5 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {item.status === 'uploading' && (
                      <span className="p-0.5 rounded-full bg-amber-500 text-black flex items-center justify-center shadow">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      </span>
                    )}
                    {item.status === 'error' && (
                      <span className="p-0.5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow">
                        <AlertCircle className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  {!uploading && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveItem(item.id);
                      }}
                      className="absolute top-1.5 right-1.5 z-10 p-1 rounded-full bg-black/70 text-slate-300 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}

                  <span className="relative z-10 text-[9px] text-slate-200 truncate font-mono">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {uploading && (
          <div className="p-4 rounded-2xl bg-[#0A1440] border border-[#C9A227]/40 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#E8C468] font-semibold">
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#C9A227]" />
                {progressText}
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-[#C9A227] to-[#E8C468] h-2 rounded-full animate-pulse w-full" />
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            disabled={uploading}
            className="px-5 py-2.5 rounded-xl text-slate-300 hover:text-white bg-slate-800 text-xs font-semibold disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleStartBatchUpload}
            disabled={uploading || fileQueue.length === 0}
            className="px-7 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#C9A227] to-[#E8C468] text-[#0A1440] hover:brightness-110 shadow-xl disabled:opacity-50 flex items-center gap-2 transition-all"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <UploadCloud className="w-4 h-4" />
            )}
            <span>
              {uploading
                ? 'Uploading Photos...'
                : fileQueue.length > 0
                ? `Upload All ${fileQueue.length} Photos`
                : 'Select Photos to Upload'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
