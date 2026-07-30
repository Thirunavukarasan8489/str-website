import { EventItem } from '@/types';

export const SITE_URL = 'https://scotlandtamilsraise.org';
export const SITE_NAME = 'Scotland Tamils Raise';

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      'Scotland Tamils Raise is the premier Tamil community organization in Scotland, promoting Tamil language, cultural heritage, integration, and youth empowerment across Edinburgh, Glasgow, Aberdeen, and Dundee.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Edinburgh',
      addressRegion: 'Scotland',
      addressCountry: 'UK',
    },
    sameAs: [
      'https://facebook.com/ScotlandTamilsRaise',
      'https://instagram.com/ScotlandTamilsRaise',
      'https://twitter.com/TamilsScotland',
    ],
  };
}

export function getEventSchema(event: EventItem) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    startDate: `${event.date}T${event.time.split(' - ')[0] || '10:00'}`,
    endDate: `${event.date}T${event.time.split(' - ')[1] || '17:00'}`,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.venue,
      address: {
        '@type': 'PostalAddress',
        addressLocality: event.city,
        addressRegion: 'Scotland',
        addressCountry: 'UK',
      },
    },
    image: [event.image],
    organizer: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function getBreadcrumbSchema(items: { name: string; item: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((element, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: element.name,
      item: `${SITE_URL}${element.item}`,
    })),
  };
}

export function getFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
