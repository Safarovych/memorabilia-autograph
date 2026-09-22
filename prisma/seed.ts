import { PrismaClient } from '@prisma/client';
import { products } from '../lib/catalog';

const prisma = new PrismaClient();

const ruNames:Record<string,string>={
  'Real Madrid Home Jersey':'Домашняя футболка Реал Мадрид',
  'FC Barcelona Home Jersey':'Домашняя футболка Барселоны',
  'Liverpool Home Jersey':'Домашняя футболка Ливерпуля',
  'Germany Home Jersey':'Футболка сборной Германии',
  'Bayern Retro Jersey':'Ретро-футболка Баварии',
  'Elite Black Training Top':'Чёрный тренировочный топ',
  'Lionel Messi Signed Argentina Jersey':'Футболка сборной Аргентины с автографом Лионеля Месси',
  'Eric Cantona Signed Manchester United Shirt':'Футболка Manchester United с автографом Эрика Кантона'
};

const ruDescriptions:Record<string,string>={
  'Premium replica jersey inspired by the current Real Madrid home collection.':'Премиальная реплика, вдохновлённая актуальной домашней коллекцией Реал Мадрид.',
  'Modern blaugrana home jersey with a classic football silhouette.':'Современная домашняя футболка в стиле blaugrana с классическим футбольным силуэтом.',
  'Premium Liverpool-inspired home jersey for collectors and fans.':'Премиальная футболка в стиле Ливерпуля для коллекционеров и болельщиков.',
  'Germany national-team inspired jersey for the modern collector.':'Футболка в стиле сборной Германии для современного коллекционера.',
  'A retro-inspired Bayern collector piece with classic styling.':'Коллекционный ретро-предмет Баварии в классическом стиле.',
  'Minimal premium training top with a modern athletic cut.':'Минималистичный премиальный тренировочный топ современного спортивного кроя.',
  'Example listing for a signed Argentina jersey with certificate and provenance record.':'Пример футболки сборной Аргентины с автографом, сертификатом и информацией о происхождении.',
  'Manchester United shirt signed by Eric Cantona. A unique collectible for football fans and memorabilia collectors. Certificate of authenticity included':'Футболка Manchester United с автографом Эрика Кантона. Уникальный коллекционный предмет для футбольных болельщиков и коллекционеров спортивной меморабилии. Сертификат подлинности входит в комплект.'
};

async function main() {
  for (const p of products) {
    const existing = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          nameRu: existing.nameRu || ruNames[p.name] || null,
          descriptionRu: existing.descriptionRu || ruDescriptions[p.description] || null,
        },
      });
      continue;
    }

    await prisma.product.create({
      data: {
        slug: p.slug,
        name: p.name,
        nameRu: ruNames[p.name] || null,
        description: p.description,
        descriptionRu: ruDescriptions[p.description] || null,
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

  // Backfill the bilingual text for an existing Cantona item if it was created manually.
  const cantona = await prisma.product.findFirst({ where: { name: 'Eric Cantona Signed Manchester United Shirt' } });
  if (cantona) {
    await prisma.product.update({
      where: { id: cantona.id },
      data: {
        nameRu: cantona.nameRu || ruNames[cantona.name],
        descriptionRu: cantona.descriptionRu || ruDescriptions[cantona.description] || 'Футболка Manchester United с автографом Эрика Кантона. Уникальный коллекционный предмет для футбольных болельщиков и коллекционеров спортивной меморабилии. Сертификат подлинности входит в комплект.',
      },
    });
  }

  console.log('Product bilingual bootstrap complete.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
