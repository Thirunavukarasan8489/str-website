import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Users,
  HeartHandshake,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import CTAButton from "@/components/shared/CTAButton";

export default function AboutPreview() {
  const pillars = [
    {
      icon: BookOpen,
      title: "Tamil Language & Literature",
      description:
        "Preserving classical Tamil literature, Thirukkural recitations, and running weekend language classes for children in Edinburgh, Glasgow, and Aberdeen.",
    },
    {
      icon: Sparkles,
      title: "Cultural Arts & Festivals",
      description:
        "Hosting vibrant festivals including Grand Pongal, Chithirai Tamil New Year Gala, Deepavali recitals, Bharatanatyam, and Parai Attam folk dance.",
    },
    {
      icon: Users,
      title: "Youth & Mentorship Network",
      description:
        "Empowering young Scottish Tamils with career mentorship, university leadership summits, STEM guidance, and professional networking.",
    },
    {
      icon: HeartHandshake,
      title: "Scottish Integration & Charity",
      description:
        "Fostering civic unity, participating in Highland charity walks, blood donation drives, and collaborating with local Scottish councils.",
    },
  ];

  return (
    <section className="py-20 bg-[#0A1440] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Who We Are"
          title="Bridging Ancient Tamil Heritage with Modern Scotland"
          subtitle="Scotland Tamils Raise is dedicated to nurturing cultural roots, supporting families, and enriching the vibrant multicultural tapestry of Scotland."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          {/* Visual Grid */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#1B3A6B] shadow-2xl">
              <div className="relative h-[340px] md:h-[400px] w-full">
                <Image
                  src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80"
                  alt="Cultural Performance by Scotland Tamils Raise"
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover"
                />
              </div>
              <div className="p-6 bg-[#121F54] border-t border-white/10">
                <h3 className="text-lg font-serif font-bold text-white mb-1">
                  Scottish Tamil Heritage Hub
                </h3>
                <p className="text-xs text-slate-300">
                  Building strong inter-generational bonds and celebrating
                  shared values across Scottish cities.
                </p>
              </div>
            </div>
          </div>

          {/* Pillars List */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#121F54] border border-[#1B3A6B] hover:border-[#C9A227]/50 rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 gold-glow-hover"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-[#1B3A6B] to-[#0A1440] border border-[#C9A227]/40 flex items-center justify-center text-[#E8C468] mb-4 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-white mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center">
          <CTAButton href="/about" variant="outline">
            <span>Read Our Full Story & History</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
