'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Product } from '../app/product-data';

type Category = 'all' | 'soil' | 'growth' | 'micro';

const categories: Array<{ id: Category; en: string; hi: string }> = [
  { id: 'all', en: 'All products', hi: 'सभी उत्पाद' },
  { id: 'soil', en: 'Soil health', hi: 'मिट्टी स्वास्थ्य' },
  { id: 'growth', en: 'Plant growth', hi: 'पौध वृद्धि' },
  { id: 'micro', en: 'Micronutrients', hi: 'सूक्ष्म पोषक तत्व' },
];

const soilProducts = new Set(['green-force', 'super-baan', 'dop-prom', 'potash', 'black-gold', 'bhumi-pakar']);
const growthProducts = new Set(['super-calcium-gold', 'gipl-24-karat', 'super-power-win']);

function categoryForProduct(product: Product): Exclude<Category, 'all'> {
  if (soilProducts.has(product.slug)) return 'soil';
  if (growthProducts.has(product.slug)) return 'growth';
  return 'micro';
}

function Copy({ en, hi }: { en: string; hi: string }) {
  return (
    <>
      <span className="copy-en">{en}</span>
      <span className="copy-hi" lang="hi">{hi}</span>
    </>
  );
}

export default function ProductCatalogue({ products }: { products: Product[] }) {
  const [category, setCategory] = useState<Category>('all');
  const [query, setQuery] = useState('');

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return products.filter((product) => {
      const matchesCategory = category === 'all' || categoryForProduct(product) === category;
      const searchableText = `${product.name} ${product.nameHi} ${product.type} ${product.typeHi}`.toLocaleLowerCase();
      return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [category, products, query]);

  return (
    <>
      <div className="product-toolbar" aria-label="Product filters">
        <div className="product-filters" role="group" aria-label="Product categories">
          {categories.map((item) => (
            <button
              type="button"
              className={category === item.id ? 'active' : ''}
              key={item.id}
              aria-pressed={category === item.id}
              onClick={() => setCategory(item.id)}
            >
              <Copy en={item.en} hi={item.hi} />
            </button>
          ))}
        </div>
        <label className="product-search">
          <span className="sr-only">Search products</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products / उत्पाद खोजें"
          />
          <span aria-hidden="true">⌕</span>
        </label>
      </div>

      <p className="product-count" aria-live="polite">
        <Copy en={`${filteredProducts.length} products shown`} hi={`${filteredProducts.length} उत्पाद दिखाए गए`} />
      </p>

      <div className="product-grid" data-scroll-reveal="stagger">
        {filteredProducts.map((product, index) => (
          <Link className={`product-card ${product.className}`} href={`/products/${product.slug}`} key={product.slug} aria-label={`View ${product.name} details`}>
            <div className="product-image-wrap">
              <span className="product-index">{String(index + 1).padStart(2, '0')}</span>
              <img
                src={product.image}
                alt={`${product.name} product packaging`}
                loading={index < 3 ? 'eager' : 'lazy'}
                fetchPriority={index < 3 ? 'high' : 'auto'}
                decoding="async"
              />
              <span className="product-note"><Copy en={product.note} hi={product.noteHi} /></span>
            </div>
            <div className="product-details">
              <p className="product-hindi"><Copy en={product.nameHi} hi="उत्पाद विवरण" /></p>
              <h3><Copy en={product.name} hi={product.nameHi} /></h3>
              <p><Copy en={product.type} hi={product.typeHi} /></p>
              <div><span><Copy en={product.pack} hi={product.packHi} /></span><span className="arrow">↗</span></div>
            </div>
          </Link>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="no-products">
          <strong><Copy en="No matching products found." hi="कोई मिलान उत्पाद नहीं मिला।" /></strong>
          <p><Copy en="Try another product name or category." hi="कोई अन्य उत्पाद नाम या श्रेणी चुनें।" /></p>
        </div>
      )}
    </>
  );
}
