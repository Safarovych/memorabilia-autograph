import type { MetadataRoute } from 'next';

const siteUrl = 'https://memorabilia-autograph.com';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: 'daily', priority: 1 },
    { url: `${siteUrl}/shop`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/auctions`, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${siteUrl}/login`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${siteUrl}/register`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${siteUrl}/cart`, changeFrequency: 'weekly', priority: 0.3 },
  ];
}
