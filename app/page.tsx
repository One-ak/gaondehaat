const products = [
  {
    name: 'Green Force',
    type: 'Phosphate Rich Organic Manure',
    hindi: 'ग्रीन फोर्स',
    image: '/products/green-force.jpg',
    pack: '50 kg pack',
    className: 'green-force',
    note: 'PROM · 8% P₂O₅',
  },
  {
    name: 'Super Baan',
    type: 'Super Prime Granular / Powder PROM',
    hindi: 'सुपर बाण',
    image: '/products/super-baan.jpg',
    pack: '50 kg pack',
    className: 'super-baan',
    note: 'Granular & powder',
  },
  {
    name: 'DOP PROM',
    type: 'Phosphate Rich Organic Manure',
    hindi: 'डी ओ पी',
    image: '/products/dop-prom.jpg',
    pack: '50 kg pack',
    className: 'dop-prom',
    note: 'PROM · 8% P₂O₅',
  },
  {
    name: 'Potash',
    type: 'Dried Premium Molasses',
    hindi: 'पोटाश',
    image: '/products/potash.jpg',
    pack: '50 kg pack',
    className: 'potash',
    note: 'K₂O · 14.5%',
  },
  {
    name: 'Super Power Win',
    type: 'Plant Growth Promoter',
    hindi: 'सुपर पावर विन',
    image: '/products/super-power-win.jpg',
    pack: '0.3 L × 10 pack',
    className: 'power-win',
    note: 'For healthy plants & better yield',
  },
];

const practices = [
  ['01', 'Farmer first', 'Practical solutions made for stronger crops and better farm outcomes.'],
  ['02', 'Soil conscious', 'Organic and bio-based inputs that support long-term soil vitality.'],
  ['03', 'Quality focused', 'Reliable formulations, thoughtful packaging, and clear product information.'],
];

export default function Home() {
  return (
    <main>
      <section className="hero" id="home">
        <nav className="nav shell" aria-label="Main navigation">
          <a className="brand" href="#home" aria-label="Gao Dehat home">
            <img src="/gao-dehat-logo.jpeg" alt="Gao Dehat" />
          </a>
          <div className="nav-links">
            <a href="#about">Our purpose</a>
            <a href="#products">Products</a>
            <a href="#contact">Connect</a>
          </div>
          <a className="nav-cta" href="#products">Explore products <span>↗</span></a>
        </nav>

        <div className="hero-grid shell">
          <div className="hero-copy">
            <p className="eyebrow"><span /> From the fields, for the fields</p>
            <h1>Healthy soil.<br /><em>Abundant</em> harvests.</h1>
            <p className="hero-text">Gao Dehat brings dependable organic and bio-based agricultural inputs to the people growing India&apos;s future.</p>
            <div className="hero-actions">
              <a className="button button-dark" href="#products">See our range <span>↓</span></a>
              <a className="text-link" href="#about">The Gao Dehat way <span>→</span></a>
            </div>
            <div className="hero-proof">
              <div className="mini-seal">GD</div>
              <p><strong>ग्राम्य पोषण, समृद्ध किसान</strong><br />Nourishing the soil. Empowering the farmer.</p>
            </div>
          </div>
          <div className="hero-art" aria-label="A Gao Dehat farm product collection">
            <div className="sun" />
            <div className="farm-lines line-one" />
            <div className="farm-lines line-two" />
            <div className="farm-lines line-three" />
            <div className="field-tag tag-top">Sustainable inputs <i>✦</i></div>
            <div className="field-tag tag-bottom">Made for Indian farms <i>✦</i></div>
            <div className="hero-product-card">
              <img src="/products/super-power-win.jpg" alt="Super Power Win plant growth promoter" />
              <div><small>Featured solution</small><strong>Super Power Win</strong></div>
            </div>
            <div className="hero-logo-badge"><img src="/gao-dehat-logo.jpeg" alt="" /></div>
          </div>
        </div>
        <div className="hero-bottom shell">
          <p>Growing with purpose <span>●</span> Nurturing every acre</p>
          <a href="#about">Scroll to discover <span>↓</span></a>
        </div>
      </section>

      <section className="intro-section shell" id="about">
        <div className="section-label"><span>01</span> Our purpose</div>
        <div className="intro-copy">
          <p className="intro-kicker">A proud part of Vansh Group</p>
          <h2>Rooted in the belief that <em>every farmer deserves to grow with confidence.</em></h2>
          <p>Gao Dehat is an agro-input company from Barabanki, Uttar Pradesh, focused on sustainable farming and farmer prosperity. Our portfolio is designed to support soil fertility, crop performance and a more self-reliant farming future.</p>
        </div>
      </section>

      <section className="principles">
        <div className="shell">
          <div className="section-heading">
            <div className="section-label light"><span>02</span> Our approach</div>
            <h2>Good farming begins<br />with <em>good care.</em></h2>
          </div>
          <div className="practice-grid">
            {practices.map(([number, title, copy]) => (
              <article className="practice" key={number}>
                <span className="practice-number">{number}</span>
                <div className="practice-mark">✦</div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="products-section" id="products">
        <div className="shell">
          <div className="products-heading">
            <div>
              <div className="section-label"><span>03</span> Our products</div>
              <h2>A better season starts<br />with the right <em>input.</em></h2>
            </div>
            <p>Five focused solutions for soil nourishment, crop support and healthy plant development.</p>
          </div>

          <div className="product-grid">
            {products.map((product, index) => (
              <article className={`product-card ${product.className}`} key={product.name}>
                <div className="product-image-wrap">
                  <span className="product-index">0{index + 1}</span>
                  <img src={product.image} alt={`${product.name} product packaging`} />
                  <span className="product-note">{product.note}</span>
                </div>
                <div className="product-details">
                  <p className="product-hindi">{product.hindi}</p>
                  <h3>{product.name}</h3>
                  <p>{product.type}</p>
                  <div><span>{product.pack}</span><span className="arrow">↗</span></div>
                </div>
              </article>
            ))}
          </div>
          <p className="product-footnote">* Product specifications are as shown on the respective product pack. Please use only as directed.</p>
        </div>
      </section>

      <section className="growth-section">
        <div className="shell growth-wrap">
          <div className="growth-copy">
            <p className="eyebrow pale"><span /> Healthy plant, better yield</p>
            <h2>Small drops.<br /><em>Real growth.</em></h2>
            <p>Super Power Win is our plant growth promoter, made to support plant growth and development, stronger roots, more flowers and fruits, and improved yield and quality.</p>
            <a className="button button-cream" href="#contact">Ask about this product <span>→</span></a>
          </div>
          <div className="growth-visual">
            <img src="/products/super-power-win.jpg" alt="Super Power Win product range" />
            <div className="round-copy">Natural<br /><b>crop care</b><br />for every acre</div>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="shell contact-grid">
          <div>
            <div className="section-label"><span>04</span> Connect with us</div>
            <h2>Let&apos;s grow<br /><em>together.</em></h2>
          </div>
          <div className="contact-details">
            <p>For product, dealer or customer-care enquiries, reach our team.</p>
            <a className="email-link" href="mailto:info.safalshakti@gmail.com">info.safalshakti@gmail.com <span>↗</span></a>
            <address>Gaon Dehat Industries Pvt. Ltd.<br />Gata No. 5, Palia Masoodpur Par Dew,<br />Barabanki, Uttar Pradesh — 225001</address>
          </div>
        </div>
      </section>

      <footer>
        <div className="shell footer-inner">
          <a className="footer-brand" href="#home"><img src="/gao-dehat-logo.jpeg" alt="Gao Dehat" /></a>
          <p>© {new Date().getFullYear()} Gao Dehat Industries Pvt. Ltd.<br />A Vansh Group company.</p>
          <p className="footer-phrase">ग्राम्य पोषण, समृद्ध किसान</p>
        </div>
      </footer>
    </main>
  );
}
