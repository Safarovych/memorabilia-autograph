import type { MetadataRoute } from 'next';
import { prisma } from '../lib/prisma';
import { siteUrl } from '../lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, auctions] = await Promise.all([
    prisma.product.findMany({
      where: { active: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.auction.findMany({
      where: { status: { in: ['LIVE', 'DRAFT'] } },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${siteUrl}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    ...products.map((p) => ({
      url: `${siteUrl}/product/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
    ...auctions.map((a) => ({
      url: `${siteUrl}/auction/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    })),
  ];
}
