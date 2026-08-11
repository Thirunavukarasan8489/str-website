'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { UploadCloud, Image as ImageIcon, CheckCircle2, AlertCircle, Loader2, X, Link as LinkIcon } from 'lucide-react';

interface CloudinaryUploaderProps {
  currentImageUrl?: string;
  onUploadSuccess: (url: string) => void;
  folder?: string;
  label?: string;
  recommendedSize?: string;
}

export default function CloudinaryUploader({
  currentImageUrl = '',
  onUploadSuccess,
  folder = 'str-website',
  label = 'Upload Photo',
  recommendedSize = 'Recommended: 1200 x 800 (Max 10MB)',
}: CloudinaryUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [directUrl, setDirectUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync preview when currentImageUrl changes
  React.useEffect(() => {
    if (currentImageUrl) {
      setPreviewUrl(currentImageUrl);
    }
  }, [currentImageUrl]);

  const handleFileChange = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image size exceeds 10MB limit.');
      return;
    }

    setError(null);
    setUploading(true);

    // Show temporary local preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success && (data.secure_url || data.url)) {
        const finalUrl = data.secure_url || data.url;
        setPreviewUrl(finalUrl);
        onUploadSuccess(finalUrl);
      } else {
        setError(data.message || 'Upload failed. Please check Cloudinary configuration.');
      }
    } catch (err: any) {
      console.error(err);
      setError('Network error during photo upload. You can also paste an image URL directly.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleApplyDirectUrl = () => {
    if (!directUrl.trim()) return;
    setPreviewUrl(directUrl.trim());
    onUploadSuccess(directUrl.trim());
    setShowUrlInput(false);
    setDirectUrl('');
    setError(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs text-[#E8C468] hover:text-[#C9A227] flex items-center gap-1 font-semibold transition-colors"
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>{showUrlInput ? 'Hide URL Input' : 'Or Paste Image URL'}</span>
        </button>
      </div>

      {showUrlInput && (
        <div className="p-3 bg-[#0A1440] border border-[#C9A227]/40 rounded-xl space-y-2">
          <label className="block text-[11px] text-slate-300 font-medium">
            Paste Direct Photo URL (Unsplash, Cloudinary, Web URL):
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://images.unsplash.com/... or https://res.cloudinary.com/..."
              value={directUrl}
              onChange={(e) => setDirectUrl(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-lg bg-[#121F54] border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-[#C9A227]"
            />
            <button
              type="button"
              onClick={handleApplyDirectUrl}
              className="px-4 py-2 bg-[#C9A227] hover:bg-[#E8C468] text-[#0A1440] font-bold text-xs rounded-lg transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Dropzone & Preview Box */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 overflow-hidden ${
          isDragOver
            ? 'border-[#C9A227] bg-[#1B3A6B]/50'
            : 'border-[#1B3A6B] hover:border-[#C9A227]/70 bg-[#0A1440]/60'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
          accept="image/*"
          className="hidden"
        />

        {previewUrl ? (
          <div className="relative group/img h-48 w-full max-w-sm mx-auto rounded-xl overflow-hidden border border-[#C9A227]/40 shadow-lg">
            <Image
              src={previewUrl}
              alt="Photo preview"
              fill
              className="object-cover group-hover/img:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2 p-4">
              <UploadCloud className="w-8 h-8 text-[#E8C468]" />
              <span className="text-xs font-bold text-[#E8C468]">Click or Drag to Replace Photo</span>
              <span className="text-[10px] text-slate-300">Uploads directly to Cloudinary</span>
            </div>

            {uploading && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white gap-2">
                <Loader2 className="w-8 h-8 text-[#C9A227] animate-spin" />
                <span className="text-xs font-bold text-[#E8C468]">Uploading to Cloudinary...</span>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#121F54] border border-[#C9A227]/40 text-[#E8C468] flex items-center justify-center mx-auto shadow-inner">
              {uploading ? (
                <Loader2 className="w-7 h-7 animate-spin text-[#C9A227]" />
              ) : (
                <UploadCloud className="w-7 h-7" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                {uploading ? 'Uploading Photo to Cloudinary...' : 'Click to Upload or Drag & Drop'}
              </p>
              <p className="text-xs text-slate-400 mt-1">{recommendedSize}</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-[#8B1A2B]/20 border border-[#8B1A2B] text-[#E8C468] text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#8B1A2B] shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
