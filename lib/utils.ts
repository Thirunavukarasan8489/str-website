import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return d.toLocaleDateString('en-GB', options);
}

export interface TicketTier {
  name: string;
  price: string;
}

export function parseTicketTiers(
  priceString?: string,
  ticketTiers?: TicketTier[]
): TicketTier[] {
  if (ticketTiers && Array.isArray(ticketTiers) && ticketTiers.length > 0) {
    const valid = ticketTiers.filter((t) => t.name.trim() || t.price.trim());
    if (valid.length > 0) return valid;
  }

  if (!priceString || !priceString.trim()) {
    return [];
  }

  // Split string by commas, newlines, or semicolons
  const parts = priceString
    .split(/[,;\n]+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const parsed: TicketTier[] = [];

  for (const part of parts) {
    // Look for separator like ' - ', '-', ':', '—'
    const match = part.match(/^(.+?)\s*[-:—]\s*(.+)$/);
    if (match) {
      const rawName = match[1].trim();
      let rawPrice = match[2].trim();

      // If price is purely numeric e.g. "15", format as "£15"
      if (/^\d+(\.\d+)?$/.test(rawPrice)) {
        rawPrice = `£${rawPrice}`;
      }

      parsed.push({ name: rawName, price: rawPrice });
    } else {
      parsed.push({ name: part, price: '' });
    }
  }

  return parsed;
}
