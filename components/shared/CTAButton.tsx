import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'maroon';
  className?: string;
  external?: boolean;
}

export default function CTAButton({
  href,
  children,
  variant = 'primary',
  className = '',
  external = false,
}: CTAButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center px-6 py-3.5 text-sm md:text-base font-semibold rounded-lg transition-all duration-300 transform active:scale-95 shadow-md';

  const variants = {
    primary:
      'bg-gradient-to-r from-[#C9A227] to-[#E8C468] text-[#0A1440] hover:from-[#E8C468] hover:to-[#C9A227] hover:shadow-lg hover:shadow-[#C9A227]/25 font-bold',
    secondary:
      'bg-[#1B3A6B] text-white hover:bg-[#122c54] border border-[#C9A227]/30 hover:border-[#C9A227]',
    outline:
      'border-2 border-[#C9A227] text-[#E8C468] hover:bg-[#C9A227] hover:text-[#0A1440]',
    maroon:
      'bg-[#8B1A2B] text-white hover:bg-[#a31f33] hover:shadow-lg hover:shadow-[#8B1A2B]/30 font-bold',
  };

  const combinedClass = cn(baseStyles, variants[variant], className);

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={combinedClass}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={combinedClass}>
      {children}
    </Link>
  );
}
