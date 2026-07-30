import React from 'react';
import Image from 'next/image';
import { Mail, MapPin } from 'lucide-react';
import { CommitteeMember } from '@/types';

interface MemberCardProps {
  member: CommitteeMember;
}

export default function MemberCard({ member }: MemberCardProps) {
  return (
    <div className="group bg-[#121F54] border border-[#1B3A6B] hover:border-[#C9A227]/60 rounded-xl p-6 text-center shadow-lg transition-all duration-300 hover:-translate-y-1.5 gold-glow-hover flex flex-col items-center">
      <div className="relative w-28 h-28 rounded-full overflow-hidden mb-4 border-2 border-[#C9A227] p-1 shadow-md group-hover:scale-105 transition-transform duration-300">
        <div className="relative w-full h-full rounded-full overflow-hidden">
          <Image
            src={member.imageUrl}
            alt={member.name}
            fill
            sizes="112px"
            className="object-cover"
          />
        </div>
      </div>

      <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-[#E8C468] bg-[#1B3A6B]/60 px-3 py-0.5 rounded-full mb-2 border border-[#C9A227]/30">
        {member.role}
      </span>

      <h3 className="text-lg font-serif font-bold text-white group-hover:text-[#E8C468] transition-colors mb-1">
        {member.name}
      </h3>

      <div className="flex items-center gap-1 text-xs text-slate-300 mb-3">
        <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
        <span>{member.city}, Scotland</span>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed max-w-xs">
        {member.bio}
      </p>

      {member.email && (
        <a
          href={`mailto:${member.email}`}
          className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#E8C468] hover:text-[#C9A227] transition-colors"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Contact Lead</span>
        </a>
      )}
    </div>
  );
}
