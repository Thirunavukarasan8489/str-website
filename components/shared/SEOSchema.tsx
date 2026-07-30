import React from 'react';

interface SEOSchemaProps {
  schema: Record<string, unknown>;
}

export default function SEOSchema({ schema }: SEOSchemaProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
