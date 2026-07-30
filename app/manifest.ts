import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Scotland Tamils Raise',
    short_name: 'STR Scotland',
    description: 'Bridging Tamil Heritage & Scottish Culture across Edinburgh, Glasgow, Aberdeen & Dundee.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A1440',
    theme_color: '#0A1440',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
