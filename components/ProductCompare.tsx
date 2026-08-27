'use client';

import { useState } from 'react';
import type { Product } from '../app/product-data';

function Copy({ en, hi }: { en: string; hi: string }) {
  return (
    <>
      <span className="copy-en">{en}</span>
      <span className="copy-hi" lang="hi">{hi}</span>
    </>
  );
}

export default function ProductCompare({ products }: { products: Product[] }) {
  const [firstSlug, setFirstSlug] = useState(products[0]?.slug ?? '');
  const [secondSlug, setSecondSlug] = useState(products[1]?.slug ?? '');
  const first = products.find((product) => product.slug === firstSlug) ?? products[0];
  const second = products.find((product) => product.slug === secondSlug) ?? products[1];

  if (!first || !second) return null;

  const productOption = (product: Product) => `${product.name} / ${product.nameHi}`;

  return (
    <section className="compare-section" id="compare-products" aria-label="Product comparison">
      <div className="compare-heading">
        <div>
          <p><Copy en="Quick comparison" hi="त्वरित तुलना" /></p>
          <h3><Copy en="Compare two products" hi="दो उत्पादों की तुलना करें" /></h3>
        </div>
        <span><Copy en="Compare key pack information before you enquire." hi="पूछताछ से पहले मुख्य पैक जानकारी की तुलना करें।" /></span>
      </div>

      <div className="compare-selectors">
        <label>
          <span><Copy en="First product" hi="पहला उत्पाद" /></span>
          <select value={firstSlug} onChange={(event) => setFirstSlug(event.target.value)}>
            {products.map((product) => <option value={product.slug} key={product.slug}>{productOption(product)}</option>)}
          </select>
        </label>
        <label>
          <span><Copy en="Second product" hi="दूसरा उत्पाद" /></span>
          <select value={secondSlug} onChange={(event) => setSecondSlug(event.target.value)}>
            {products.map((product) => <option value={product.slug} key={product.slug}>{productOption(product)}</option>)}
          </select>
        </label>
      </div>

      <div className="compare-table" role="table" aria-label="Selected product comparison">
        <div className="compare-row compare-product-head" role="row">
          <span role="columnheader"><Copy en="Details" hi="विवरण" /></span>
          <strong role="columnheader"><Copy en={first.name} hi={first.nameHi} /></strong>
          <strong role="columnheader"><Copy en={second.name} hi={second.nameHi} /></strong>
        </div>
        <div className="compare-row" role="row">
          <span role="rowheader"><Copy en="Product type" hi="उत्पाद प्रकार" /></span>
          <p role="cell"><Copy en={first.type} hi={first.typeHi} /></p>
          <p role="cell"><Copy en={second.type} hi={second.typeHi} /></p>
        </div>
        <div className="compare-row" role="row">
          <span role="rowheader"><Copy en="Packing" hi="पैकिंग" /></span>
          <p role="cell"><Copy en={first.pack} hi={first.packHi} /></p>
          <p role="cell"><Copy en={second.pack} hi={second.packHi} /></p>
        </div>
        <div className="compare-row" role="row">
          <span role="rowheader"><Copy en="Suitable for" hi="उपयुक्त" /></span>
          <p role="cell"><Copy en={first.suitable} hi={first.suitableHi} /></p>
          <p role="cell"><Copy en={second.suitable} hi={second.suitableHi} /></p>
        </div>
      </div>
    </section>
  );
}
