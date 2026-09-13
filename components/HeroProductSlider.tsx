'use client';

import Link from 'next/link';
import SiteImage from './SiteImage';
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

function ProductSlide({ product, motionClass }: { product: Product; motionClass: string }) {
  return (
    <div className={`hero-slider-card ${product.className} ${motionClass}`}>
      <div className="hero-slider-pack">
        <SiteImage src={product.image} alt={`${product.name} product pack`} loading="eager" fetchPriority="high" />
        <span><Copy en="Actual product pack" hi="वास्तविक उत्पाद पैक" /></span>
      </div>
      <div className="hero-slider-content">
        <p className="hero-slider-name-hi" lang="hi">{product.nameHi}</p>
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
  );
}

export default function HeroProductSlider({ products, fullBleed = false }: { products: Product[]; fullBleed?: boolean }) {
  const featured = useMemo(
    () => featuredSlugs.map((slug) => products.find((product) => product.slug === slug)).filter(Boolean) as Product[],
    [products],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);

  useEffect(() => {
    if (featured.length < 2 || paused || interacting) return undefined;
    const timer = window.setInterval(() => {
      if (document.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      setActiveIndex((current) => (current + 1) % featured.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [featured.length, paused, interacting]);

  if (featured.length === 0) return null;
  const product = featured[activeIndex];

  const selectProduct = (index: number) => {
    setPaused(true);
    if (index === activeIndex) return;
    setActiveIndex(index);
  };

  return (
    <div className={`hero-slider${fullBleed ? ' hero-slider--full' : ''}`} role="region" aria-roledescription="carousel" aria-label="Featured Gao Dehat products"
      onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)}
      onFocusCapture={(event) => {
        if (!(event.target as HTMLElement).closest('.hero-pause')) setPaused(true);
      }}>
      <div className="hero-slider-topline">
        <p><span /> <Copy en="Hero products" hi="प्रमुख उत्पाद" /></p>
        <button className="hero-pause" type="button" onClick={() => setPaused((value) => !value)} aria-label={paused ? 'Resume product slideshow' : 'Pause product slideshow'}>
          <Copy en={paused ? 'Play slides' : 'Pause slides'} hi={paused ? 'स्लाइड चलाएँ' : 'स्लाइड रोकें'} />
        </button>
        <span>{String(activeIndex + 1).padStart(2, '0')} / {String(featured.length).padStart(2, '0')}</span>
      </div>
      <div className="hero-slider-stage" aria-live={paused ? 'polite' : 'off'} aria-atomic="true">
        <ProductSlide key={product.slug} product={product} motionClass="hero-slider-card--active" />
      </div>
      <div className="hero-slider-controls" role="group" aria-label="Choose a featured product">
        {featured.map((item, index) => (
          <button
            type="button"
            key={item.slug}
            className={index === activeIndex ? 'active' : ''}
            onClick={() => selectProduct(index)}
            aria-label={`Show ${item.name}`}
            aria-pressed={index === activeIndex}
          >
            <SiteImage src={item.image} alt="" sizes="44px" />
            <span>{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
