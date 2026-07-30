import React from 'react';
import SectionHeading from '@/components/shared/SectionHeading';
import MemberCard from '@/components/cards/MemberCard';
import { COMMITTEE_MEMBERS } from '@/lib/data';

export default function CommitteeGrid() {
  return (
    <section className="py-20 bg-[#070D2B] border-t border-[#1B3A6B]/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Leadership & Governance"
          title="Executive Board & Regional Leads"
          subtitle="Dedicated community advocates leading civic programs, cultural preservation, and financial stewardship across Scotland."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {COMMITTEE_MEMBERS.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
