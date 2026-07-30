import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Clock, ArrowRight, Ticket } from "lucide-react";
import { EventItem } from "@/types";
import { formatDate } from "@/lib/utils";

interface EventCardProps {
  event: EventItem;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="group relative bg-[#121F54] border border-[#1B3A6B] hover:border-[#C9A227]/60 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1.5 flex flex-col h-full gold-glow-hover">
      {/* Event Image Banner */}
      <div className="relative h-48 md:h-52 w-full overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121F54] via-[#121F54]/30 to-transparent" />

        {/* Category Tag */}
        <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold text-[#0A1440] bg-gradient-to-r from-[#C9A227] to-[#E8C468] rounded-full shadow-md">
          {event.category}
        </span>

        {/* Past Event Badge */}
        {event.isPast && (
          <span className="absolute top-3 right-3 px-3 py-1 text-xs font-semibold text-white bg-slate-800/80 backdrop-blur-sm rounded-full border border-white/10">
            Past Event
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#E8C468] font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#C9A227]" />
              {formatDate(event.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#C9A227]" />
              {event.time}
            </span>
          </div>

          <h3 className="text-xl font-serif font-bold text-white group-hover:text-[#E8C468] transition-colors leading-snug line-clamp-2">
            <Link href={`/events/${event.slug}`}>{event.title}</Link>
          </h3>

          <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 truncate">
            <MapPin className="w-4 h-4 text-[#C9A227] shrink-0" />
            <span className="truncate">
              {event.venue}, {event.city}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-semibold text-slate-300">
              {event.price || "Free Admission"}
            </span>
            <Link
              href={`/events/${event.slug}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#E8C468] group-hover:text-[#C9A227] hover:underline"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
