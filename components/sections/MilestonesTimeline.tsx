import React from 'react';
import { Calendar, Award, Globe, Heart, ShieldCheck } from 'lucide-react';
import SectionHeading from '@/components/shared/SectionHeading';

export default function MilestonesTimeline() {
  const milestones = [
    {
      year: '2010',
      title: 'Founding of Scottish Tamil Circle',
      description: 'Established in Edinburgh by founding doctors, engineers, and families to organize annual Pongal gatherings and weekend language circles.',
      icon: Calendar,
    },
    {
      year: '2015',
      title: 'Formalization as Scotland Tamils Raise',
      description: 'Expanded across Edinburgh, Glasgow, and Aberdeen with over 500 active member families and OSCR charity recognition.',
      icon: ShieldCheck,
    },
    {
      year: '2020',
      title: 'Launch of Tamil Academy & Digital Classes',
      description: 'Pioneered online Tamil language learning, carnatic music, and Thirukkural recitations during global lock-downs for youth across the UK.',
      icon: Globe,
    },
    {
      year: '2025',
      title: 'Scottish Parliament Motion & Civic Hubs',
      description: 'Scottish Parliament passed a motion honoring Tamil Heritage Month. Expanded nodes in Dundee and Stirling.',
      icon: Award,
    },
    {
      year: '2026',
      title: 'Youth Leadership & High Impact Legacy',
      description: 'Hosting Scotland-wide STEM summits, career mentorship, and launching regional cultural centers across Scottish cities.',
      icon: Heart,
    },
  ];

  return (
    <section className="py-20 bg-[#070D2B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Our Journey"
          title="Milestones of Tamil Heritage in Scotland"
          subtitle="Over 15 years of community growth, cultural preservation, and civic contribution."
        />

        <div className="relative max-w-4xl mx-auto mt-12">
          {/* Vertical Center Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#C9A227] via-[#1B3A6B] to-[#C9A227] -translate-x-1/2" />

          <div className="space-y-12">
            {milestones.map((item, index) => {
              const Icon = item.icon;
              const isEven = index % 2 === 0;
              return (
                <div
                  key={index}
                  className={`relative flex flex-col md:flex-row items-center ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Badge Dot */}
                  <div className="absolute left-4 md:left-1/2 top-0 md:top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-gradient-to-tr from-[#C9A227] to-[#E8C468] border-2 border-[#0A1440] flex items-center justify-center text-[#0A1440] shadow-lg font-bold">
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Content Box */}
                  <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <div className="bg-[#121F54] border border-[#1B3A6B] hover:border-[#C9A227]/50 rounded-xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 gold-glow-hover">
                      <span className="inline-block px-3 py-1 text-xs font-bold text-[#0A1440] bg-gradient-to-r from-[#C9A227] to-[#E8C468] rounded-full mb-2">
                        {item.year}
                      </span>
                      <h3 className="text-xl font-serif font-bold text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
