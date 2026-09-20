import { PrismaClient } from '@prisma/client';
import { products } from '../lib/catalog';

const prisma = new PrismaClient();

async function main() {
  for (const p of products) {
    const existing = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (existing) continue;

    await prisma.product.create({
      data: {
        slug: p.slug,
        name: p.name,
        description: p.description,
        category: p.category,
        type: p.signed ? 'SIGNED' : 'STANDARD',
        club: p.club ?? null,
        player: p.player ?? null,
        season: p.name.includes('Bayern') ? '1999' : p.name.includes('Black Training') ? '2026' : null,
        priceCents: Math.round(p.price * 100),
        currency: 'EUR',
        stock: 1,
        sizes: p.sizes ?? [],
        imageUrl: null,
        imageUrls: [],
        provenance: p.signed ? 'Demo catalog entry — replace with verified provenance before publication.' : null,
        signingProof: p.signed ? 'Demo catalog entry — replace with verified signing proof before publication.' : null,
        active: true,
      },
    });
  }

  console.log('Product bootstrap complete.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
