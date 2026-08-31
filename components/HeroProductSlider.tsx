'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { Product } from '../app/product-data';

function Copy({ en, hi }: { en: string; hi: string }) {
  return (
    <>
      <span className="copy-en">{en}</span>
      <span className="copy-hi" lang="hi">{hi}</span>
    </>
  );
}

const featuredSlugs = ['super-power-win', 'bhumi-pakar', 'fertile-blossom-high-zinc', 'boron-gold'];

export default function HeroProductSlider({ products }: { products: Product[] }) {
  const featured = useMemo(
    () => featuredSlugs.map((slug) => products.find((product) => product.slug === slug)).filter(Boolean) as Product[],
    [products],
  );
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (featured.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % featured.length);
    }, 4600);
    return () => window.clearInterval(timer);
  }, [featured.length]);

  if (featured.length === 0) return null;
  const product = featured[activeIndex];

  return (
    <div className="hero-slider" aria-label="Featured Gao Dehat products">
      <div className="hero-slider-topline">
        <p><span /> <Copy en="Hero products" hi="प्रमुख उत्पाद" /></p>
        <span>{String(activeIndex + 1).padStart(2, '0')} / {String(featured.length).padStart(2, '0')}</span>
      </div>
      <div className={`hero-slider-card ${product.className}`}>
        <div className="hero-slider-pack">
          <img src={product.image} alt={`${product.name} product pack`} />
          <span><Copy en="Actual product pack" hi="वास्तविक उत्पाद पैक" /></span>
        </div>
        <div className="hero-slider-content">
          <p className="hero-slider-name-hi">{product.nameHi}</p>
          <h2>{product.name}</h2>
          <p className="hero-slider-type"><Copy en={product.type} hi={product.typeHi} /></p>
          <div className="hero-slider-fact">
            <span><Copy en="Pack insight" hi="पैक जानकारी" /></span>
            <strong><Copy en={product.benefits[0]} hi={product.benefitsHi[0]} /></strong>
          </div>
          <p className="hero-slider-use"><Copy en={product.usage?.[0] ?? product.suitable} hi={product.usageHi?.[0] ?? product.suitableHi} /></p>
          <Link href={`/products/${product.slug}`}><Copy en="View product details" hi="उत्पाद विवरण देखें" /> <span>↗</span></Link>
        </div>
      </div>
      <div className="hero-slider-controls" role="tablist" aria-label="Choose a featured product">
        {featured.map((item, index) => (
          <button
            type="button"
            key={item.slug}
            className={index === activeIndex ? 'active' : ''}
            onClick={() => setActiveIndex(index)}
            aria-label={`Show ${item.name}`}
            aria-selected={index === activeIndex}
            role="tab"
          >
            <img src={item.image} alt="" />
            <span>{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
