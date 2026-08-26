import Link from 'next/link';
import LanguageToggle from '../components/LanguageToggle';
import { products } from './product-data';

function Copy({ en, hi }: { en: string; hi: string }) {
  return (
    <>
      <span className="copy-en">{en}</span>
      <span className="copy-hi" lang="hi">{hi}</span>
    </>
  );
}

const practices = [
  {
    number: '01',
    title: 'Quality-led inputs',
    titleHi: 'गुणवत्ता-केंद्रित इनपुट',
    copy: 'Clear product information and dependable agricultural inputs designed around farm needs.',
    copyHi: 'खेत की जरूरतों के अनुरूप स्पष्ट उत्पाद जानकारी और भरोसेमंद कृषि इनपुट।',
  },
  {
    number: '02',
    title: 'Field understanding',
    titleHi: 'खेतों की समझ',
    copy: 'Soil nutrition, crop performance and practical application guidance in one focused range.',
    copyHi: 'मिट्टी पोषण, फसल प्रदर्शन और व्यावहारिक उपयोग सलाह—एक केंद्रित रेंज में।',
  },
  {
    number: '03',
    title: 'Partner support',
    titleHi: 'साझेदार सहयोग',
    copy: 'Product and bulk-supply enquiries for farmers, dealers and distribution partners.',
    copyHi: 'किसानों, डीलरों और वितरण साझेदारों के लिए उत्पाद व बल्क-सप्लाई सहायता।',
  },
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
            <a href="#about"><Copy en="Our purpose" hi="हमारा उद्देश्य" /></a>
            <a href="#products"><Copy en="Products" hi="उत्पाद" /></a>
            <a href="#contact"><Copy en="Connect" hi="संपर्क" /></a>
          </div>
          <div className="nav-actions">
            <LanguageToggle />
            <a className="nav-cta" href="#products"><Copy en="Explore products" hi="उत्पाद देखें" /> <span>↗</span></a>
          </div>
        </nav>

        <div className="hero-grid shell">
          <div className="hero-copy">
            <p className="eyebrow"><span /> <Copy en="From the fields, for the fields" hi="खेतों से, खेतों के लिए" /></p>
            <h1><Copy en="Healthy soil." hi="स्वस्थ मिट्टी।" /><br /><em><Copy en="Abundant" hi="समृद्ध" /></em> <Copy en="harvests." hi="फसलें।" /></h1>
            <p className="hero-text"><Copy en="Gao Dehat brings dependable crop nutrition and agricultural inputs to the people growing India’s future." hi="गाँव देहात भारत के भविष्य को उगाने वाले किसानों के लिए भरोसेमंद फसल-पोषण और कृषि इनपुट लाता है।" /></p>
            <div className="hero-actions">
              <a className="button button-dark" href="#products"><Copy en="See our range" hi="हमारी रेंज देखें" /> <span>↓</span></a>
              <a className="text-link" href="#about"><Copy en="The Gao Dehat way" hi="गाँव देहात की सोच" /> <span>→</span></a>
            </div>
            <div className="hero-proof">
              <div className="mini-seal">GD</div>
              <p><strong>ग्राम्य पोषण, समृद्ध किसान</strong><br /><Copy en="Nourishing the soil. Empowering the farmer." hi="मिट्टी को पोषण, किसान को समृद्धि।" /></p>
            </div>
          </div>
          <div className="hero-art" aria-label="A Gao Dehat farm product collection">
            <div className="sun" />
            <div className="farm-lines line-one" />
            <div className="farm-lines line-two" />
            <div className="farm-lines line-three" />
            <div className="field-tag tag-top"><Copy en="Sustainable inputs" hi="सतत इनपुट" /> <i>✦</i></div>
            <div className="field-tag tag-bottom"><Copy en="Made for Indian farms" hi="भारतीय खेतों के लिए" /> <i>✦</i></div>
            <div className="hero-product-card">
              <img src="/products/super-power-win.jpg" alt="Super Power Win plant growth promoter" />
              <div><small><Copy en="Featured solution" hi="प्रमुख उत्पाद" /></small><strong><Copy en="Super Power Win" hi="सुपर पावर विन" /></strong></div>
            </div>
            <div className="hero-logo-badge"><img src="/gao-dehat-logo.jpeg" alt="" /></div>
          </div>
        </div>
        <div className="hero-bottom shell">
          <p><Copy en="Growing with purpose" hi="उद्देश्य के साथ विकास" /> <span>●</span> <Copy en="Nurturing every acre" hi="हर एकड़ का पोषण" /></p>
          <a href="#about"><Copy en="Scroll to discover" hi="जानने के लिए देखें" /> <span>↓</span></a>
        </div>
      </section>

      <section className="intro-section shell" id="about">
        <div className="section-label"><span>01</span> <Copy en="Our purpose" hi="हमारा उद्देश्य" /></div>
        <div className="intro-copy">
          <p className="intro-kicker"><Copy en="A Vansh Group company" hi="वंश ग्रुप की एक कंपनी" /></p>
          <h2><Copy en="Rooted in the belief that " hi="इस विश्वास पर आधारित कि " /><em><Copy en="every farmer deserves to grow with confidence." hi="हर किसान को आत्मविश्वास के साथ आगे बढ़ना चाहिए।" /></em></h2>
          <p><Copy en="Gao Dehat is the agricultural-input and soil-health brand of Vansh Group, based in Barabanki, Uttar Pradesh. Alongside the group’s agro-input, animal-nutrition and bio-agro businesses, we support a more practical and self-reliant farming future." hi="गाँव देहात, बाराबंकी (उत्तर प्रदेश) स्थित वंश ग्रुप का कृषि-इनपुट और मिट्टी-स्वास्थ्य ब्रांड है। ग्रुप के कृषि-इनपुट, पशु-पोषण और बायो-एग्रो व्यवसायों के साथ मिलकर हम अधिक व्यावहारिक और आत्मनिर्भर खेती के भविष्य को सहयोग देते हैं।" /></p>
        </div>
      </section>

      <section className="principles">
        <div className="shell">
          <div className="section-heading">
            <div className="section-label light"><span>02</span> <Copy en="Our approach" hi="हमारा दृष्टिकोण" /></div>
            <h2><Copy en="Good farming begins" hi="अच्छी खेती शुरू होती है" /><br /><Copy en="with " hi="" /><em><Copy en="good care." hi="सही देखभाल से।" /></em></h2>
          </div>
          <div className="practice-grid">
            {practices.map((practice) => (
              <article className="practice" key={practice.number}>
                <span className="practice-number">{practice.number}</span>
                <div className="practice-mark">✦</div>
                <h3><Copy en={practice.title} hi={practice.titleHi} /></h3>
                <p><Copy en={practice.copy} hi={practice.copyHi} /></p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="products-section" id="products">
        <div className="shell">
          <div className="products-heading">
            <div>
              <div className="section-label"><span>03</span> <Copy en="Our products" hi="हमारे उत्पाद" /></div>
              <h2><Copy en="A better season starts" hi="बेहतर मौसम शुरू होता है" /><br /><Copy en="with the right " hi="सही " /><em><Copy en="input." hi="इनपुट से।" /></em></h2>
            </div>
            <p><Copy en="Seventeen focused solutions for soil nourishment, crop support and healthy plant development. Open any product to view its information, key benefits and label-guided use." hi="मिट्टी पोषण, फसल सहयोग और स्वस्थ पौध विकास के लिए 17 केंद्रित समाधान। किसी भी उत्पाद को खोलकर उसकी जानकारी, लाभ और लेबल-आधारित उपयोग देखें।" /></p>
          </div>

          <div className="product-grid">
            {products.map((product, index) => (
              <Link className={`product-card ${product.className}`} href={`/products/${product.slug}`} key={product.slug} aria-label={`View ${product.name} details`}>
                <div className="product-image-wrap">
                  <span className="product-index">{String(index + 1).padStart(2, '0')}</span>
                  <img src={product.image} alt={`${product.name} product packaging`} />
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
          <p className="product-footnote"><Copy en="* Product specifications are as shown on the respective product pack. Please use only as directed." hi="* उत्पाद की विशिष्टताएँ संबंधित उत्पाद पैक के अनुसार हैं। कृपया केवल निर्देशानुसार उपयोग करें।" /></p>
        </div>
      </section>

      <section className="group-section">
        <div className="shell group-grid">
          <div>
            <div className="section-label"><span>04</span> <Copy en="The Vansh Group network" hi="वंश ग्रुप नेटवर्क" /></div>
            <h2><Copy en="One group. " hi="एक ग्रुप। " /><em><Copy en="Practical support." hi="व्यावहारिक सहयोग।" /></em></h2>
          </div>
          <div className="group-copy">
            <p><Copy en="Gao Dehat carries Vansh Group’s field-first approach into crop nutrition and soil health. We work alongside the group’s wider capabilities in agro inputs, animal nutrition and bio-agro solutions." hi="गाँव देहात वंश ग्रुप के फील्ड-फर्स्ट दृष्टिकोण को फसल पोषण और मिट्टी स्वास्थ्य में आगे बढ़ाता है। हम ग्रुप की कृषि-इनपुट, पशु-पोषण और बायो-एग्रो समाधान क्षमताओं के साथ काम करते हैं।" /></p>
            <div className="group-points">
              <span><Copy en="Agro inputs & soil health" hi="कृषि इनपुट और मिट्टी स्वास्थ्य" /></span>
              <span><Copy en="Animal nutrition" hi="पशु पोषण" /></span>
              <span><Copy en="Bio-agro solutions" hi="बायो-एग्रो समाधान" /></span>
            </div>
          </div>
        </div>
      </section>

      <section className="growth-section">
        <div className="shell growth-wrap">
          <div className="growth-copy">
            <p className="eyebrow pale"><span /> <Copy en="Healthy plant, better yield" hi="स्वस्थ पौधा, बेहतर उपज" /></p>
            <h2><Copy en="Small drops." hi="छोटी बूंदें।" /><br /><em><Copy en="Real growth." hi="सच्ची वृद्धि।" /></em></h2>
            <p><Copy en="Super Power Win is our plant growth promoter, presented to support plant growth and development, stronger roots, more flowers and fruits, and improved yield and quality." hi="सुपर पावर विन हमारा पादप वृद्धि प्रवर्तक है, जो पौधों की वृद्धि व विकास, मजबूत जड़ों, अधिक फूल व फलों, तथा बेहतर उपज व गुणवत्ता के लिए प्रस्तुत किया गया है।" /></p>
            <Link className="button button-cream" href="/products/super-power-win"><Copy en="View product details" hi="उत्पाद विवरण देखें" /> <span>→</span></Link>
          </div>
          <div className="growth-visual">
            <img src="/products/super-power-win.jpg" alt="Super Power Win product packaging" />
            <div className="round-copy"><Copy en="Healthy plant" hi="स्वस्थ पौधा" /><br /><b><Copy en="Better yield" hi="बेहतर उपज" /></b></div>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="shell contact-grid">
          <div>
            <div className="section-label"><span>05</span> <Copy en="Let’s grow together" hi="आइए साथ बढ़ें" /></div>
            <h2><Copy en="For product, dealer or" hi="उत्पाद, डीलर या" /><br /><em><Copy en="bulk supply enquiries." hi="बल्क सप्लाई जानकारी के लिए।" /></em></h2>
          </div>
          <div className="contact-details">
            <p><Copy en="Connect with the Gao Dehat team for product information and partnership enquiries." hi="उत्पाद जानकारी और साझेदारी संबंधी पूछताछ के लिए गाँव देहात टीम से संपर्क करें।" /></p>
            <a className="email-link" href="mailto:info.safalshakti@gmail.com">info.safalshakti@gmail.com <span>↗</span></a>
            <address>Gata No. 5, Palia Masoodpur Par Dew,<br />Barabanki, Uttar Pradesh – 225001</address>
          </div>
        </div>
      </section>

      <footer>
        <div className="shell footer-inner">
          <div className="footer-brand"><img src="/gao-dehat-logo.jpeg" alt="Gao Dehat" /></div>
          <p>© {new Date().getFullYear()} Gao Dehat Industries Pvt. Ltd.<br /><Copy en="A Vansh Group company" hi="वंश ग्रुप की एक कंपनी" /></p>
          <p className="footer-phrase">ग्राम्य पोषण, समृद्ध किसान</p>
        </div>
      </footer>
    </main>
  );
}
