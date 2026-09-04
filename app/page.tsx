import Link from 'next/link';
import LanguageToggle from '../components/LanguageToggle';
import MobileNav from '../components/MobileNav';
import ProductCompare from '../components/ProductCompare';
import ProductCatalogue from '../components/ProductCatalogue';
import ScrollEffects from '../components/ScrollEffects';
import SiteFooter from '../components/SiteFooter';
import HeroProductSlider from '../components/HeroProductSlider';
import ThemeToggle from '../components/ThemeToggle';
import { products } from './product-data';
import { COMPANY_EMAIL, generalWhatsAppLink, WHATSAPP_DISPLAY_NUMBER } from './site-contact';

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
      <ScrollEffects />
      <section className="hero hero-product-landing" id="home">
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
            <ThemeToggle />
            <MobileNav />
            <a className="nav-cta" href="#products"><Copy en="Explore products" hi="उत्पाद देखें" /> <span>↗</span></a>
          </div>
        </nav>

        <div className="hero-full-product shell" aria-label="Gao Dehat featured product collection">
          <HeroProductSlider products={products} fullBleed />
        </div>
        <div className="hero-bottom shell">
          <p><Copy en="Soil health" hi="मिट्टी स्वास्थ्य" /> <span>●</span> <Copy en="Plant growth" hi="पौध वृद्धि" /> <span>●</span> <Copy en="Micronutrient support" hi="सूक्ष्म पोषक सहयोग" /></p>
          <a href="#about"><Copy en="Scroll to discover" hi="जानने के लिए देखें" /> <span>↓</span></a>
        </div>
      </section>

      <section className="intro-section shell" id="about" data-scroll-reveal>
        <div className="section-label"><span>01</span> <Copy en="Our purpose" hi="हमारा उद्देश्य" /></div>
        <div className="intro-copy">
          <p className="intro-kicker"><Copy en="A Vansh Group company" hi="वंश ग्रुप की एक कंपनी" /></p>
          <h2><Copy en="Rooted in the belief that " hi="इस विश्वास पर आधारित कि " /><em><Copy en="every farmer deserves to grow with confidence." hi="हर किसान को आत्मविश्वास के साथ आगे बढ़ना चाहिए।" /></em></h2>
          <p><Copy en="Gao Dehat is the agricultural-input and soil-health brand of Vansh Group, based in Barabanki, Uttar Pradesh. Alongside the group’s agro-input, animal-nutrition and bio-agro businesses, we support a more practical and self-reliant farming future." hi="गाँव देहात, बाराबंकी (उत्तर प्रदेश) स्थित वंश ग्रुप का कृषि-इनपुट और मिट्टी-स्वास्थ्य ब्रांड है। ग्रुप के कृषि-इनपुट, पशु-पोषण और बायो-एग्रो व्यवसायों के साथ मिलकर हम अधिक व्यावहारिक और आत्मनिर्भर खेती के भविष्य को सहयोग देते हैं।" /></p>
        </div>
      </section>

      <section className="principles">
        <div className="shell" data-scroll-reveal>
          <div className="section-heading">
            <div className="section-label light"><span>02</span> <Copy en="Our approach" hi="हमारा दृष्टिकोण" /></div>
            <h2><Copy en="Good farming begins" hi="अच्छी खेती शुरू होती है" /><br /><Copy en="with " hi="" /><em><Copy en="good care." hi="सही देखभाल से।" /></em></h2>
          </div>
          <div className="practice-grid" data-scroll-reveal="stagger">
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
          <div className="products-heading" data-scroll-reveal>
            <div>
              <div className="section-label"><span>03</span> <Copy en="Our products" hi="हमारे उत्पाद" /></div>
              <h2><Copy en="A better season starts" hi="बेहतर मौसम शुरू होता है" /><br /><Copy en="with the right " hi="सही " /><em><Copy en="input." hi="इनपुट से।" /></em></h2>
            </div>
            <p><Copy en="Seventeen focused solutions for soil nourishment, crop support and healthy plant development. Open any product to view its information, key benefits and label-guided use." hi="मिट्टी पोषण, फसल सहयोग और स्वस्थ पौध विकास के लिए 17 केंद्रित समाधान। किसी भी उत्पाद को खोलकर उसकी जानकारी, लाभ और लेबल-आधारित उपयोग देखें।" /></p>
          </div>

          <ProductCatalogue products={products} />
          <p className="product-footnote"><Copy en="* Product specifications are as shown on the respective product pack. Please use only as directed." hi="* उत्पाद की विशिष्टताएँ संबंधित उत्पाद पैक के अनुसार हैं। कृपया केवल निर्देशानुसार उपयोग करें।" /></p>
          <div className="catalogue-cta">
            <div>
              <p><Copy en="17 dedicated product profiles" hi="17 समर्पित उत्पाद प्रोफाइल" /></p>
              <strong><Copy en="Benefits, packing and label-guided use for every product." hi="हर उत्पाद के लिए लाभ, पैकिंग और लेबल-आधारित उपयोग।" /></strong>
            </div>
            <a href="/gao-dehat-product-catalogue.pdf" download><Copy en="Download catalogue" hi="कैटलॉग डाउनलोड करें" /> <span>↓</span></a>
          </div>
          <ProductCompare products={products} />
        </div>
      </section>

      <section className="group-section">
        <div className="shell group-grid" data-scroll-reveal>
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

      <section className="crop-guide-section" id="crop-guides">
        <div className="shell">
          <div className="crop-guide-heading" data-scroll-reveal>
            <div>
              <div className="section-label"><span>05</span> <Copy en="Crop-focus guide" hi="फसल-केंद्रित मार्गदर्शिका" /></div>
              <h2><Copy en="Find support for the" hi="अपनी फसल के लिए सही" /><br /><em><Copy en="way you grow." hi="सहयोग चुनें।" /></em></h2>
            </div>
            <p><Copy en="Start with your crop focus, then use the exact product label and a qualified crop advisor for final application guidance." hi="अपनी फसल की आवश्यकता से शुरुआत करें, फिर अंतिम उपयोग मार्गदर्शन के लिए उत्पाद लेबल और योग्य कृषि सलाहकार की सलाह लें।" /></p>
          </div>
          <div className="crop-guide-grid" data-scroll-reveal="stagger">
            <article className="crop-guide-card soil-guide">
              <p className="crop-guide-number">01</p>
              <h3><Copy en="Soil nourishment" hi="मिट्टी पोषण" /></h3>
              <p><Copy en="For field preparation and soil-nutrition programmes." hi="खेत की तैयारी और मिट्टी-पोषण कार्यक्रमों के लिए।" /></p>
              <div><span>Green Phoss</span><span>सुपर बाण</span><span>D O P</span></div>
              <Link href="/products/green-force"><Copy en="Explore soil support" hi="मिट्टी पोषण देखें" /> <span>→</span></Link>
            </article>
            <article className="crop-guide-card growth-guide">
              <p className="crop-guide-number">02</p>
              <h3><Copy en="Plant development" hi="पौध विकास" /></h3>
              <p><Copy en="For healthy plant development and crop-growth programmes." hi="स्वस्थ पौध विकास और फसल वृद्धि कार्यक्रमों के लिए।" /></p>
              <div><span>GIPL 24 Karat</span><span>Super Power Win</span></div>
              <Link href="/products/super-power-win"><Copy en="Explore growth support" hi="वृद्धि सहयोग देखें" /> <span>→</span></Link>
            </article>
            <article className="crop-guide-card micro-guide">
              <p className="crop-guide-number">03</p>
              <h3><Copy en="Micronutrient balance" hi="सूक्ष्म पोषक संतुलन" /></h3>
              <p><Copy en="For label-guided nutrient support across crop and flower programmes." hi="फसल और फूल कार्यक्रमों में लेबल-आधारित पोषक सहयोग के लिए।" /></p>
              <div><span>Zinc Super Gold</span><span>Magnesium Gold</span><span>Boron Gold</span></div>
              <Link href="/products/zinc-super-gold"><Copy en="Explore micronutrients" hi="सूक्ष्म पोषक देखें" /> <span>→</span></Link>
            </article>
          </div>
        </div>
      </section>

      <section className="trust-section" id="quality">
        <div className="shell">
          <div className="trust-heading" data-scroll-reveal>
            <div>
              <div className="section-label light"><span>06</span> <Copy en="Quality and care" hi="गुणवत्ता और देखभाल" /></div>
              <h2><Copy en="Clear product information." hi="स्पष्ट उत्पाद जानकारी।" /><br /><em><Copy en="Practical support." hi="व्यावहारिक सहयोग।" /></em></h2>
            </div>
            <p><Copy en="Every Gao Dehat product page keeps the pack, benefits and label-guided use information together, so farmers can make a more informed enquiry." hi="हर गाँव देहात उत्पाद पृष्ठ पर पैक, लाभ और लेबल-आधारित उपयोग जानकारी एक साथ दी जाती है, ताकि किसान सही जानकारी के साथ पूछताछ कर सकें।" /></p>
          </div>
          <div className="trust-grid" data-scroll-reveal="stagger">
            <article className="trust-card">
              <span>01</span>
              <h3><Copy en="Pack-first information" hi="पैक-आधारित जानकारी" /></h3>
              <p><Copy en="Product details are presented from the information visible on the respective product pack." hi="उत्पाद विवरण संबंधित उत्पाद पैक पर उपलब्ध जानकारी के आधार पर प्रस्तुत किए जाते हैं।" /></p>
            </article>
            <article className="trust-card">
              <span>02</span>
              <h3><Copy en="Label-guided use" hi="लेबल-आधारित उपयोग" /></h3>
              <p><Copy en="For safe application, follow the printed label and take crop-specific advice from a qualified advisor." hi="सुरक्षित उपयोग के लिए छपे लेबल का पालन करें और फसल-विशिष्ट सलाह योग्य सलाहकार से लें।" /></p>
            </article>
            <article className="trust-card">
              <span>03</span>
              <h3><Copy en="A Vansh Group company" hi="वंश ग्रुप की कंपनी" /></h3>
              <p><Copy en="Gao Dehat brings Vansh Group's practical, field-first approach to crop nutrition and soil health." hi="गाँव देहात वंश ग्रुप के व्यावहारिक, फील्ड-फर्स्ट दृष्टिकोण को फसल पोषण और मिट्टी स्वास्थ्य तक पहुंचाता है।" /></p>
            </article>
          </div>
        </div>
      </section>

      <section className="growth-section">
        <div className="shell growth-wrap" data-scroll-reveal>
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
        <div className="shell contact-grid" data-scroll-reveal>
          <div>
            <div className="section-label"><span>07</span> <Copy en="Let’s grow together" hi="आइए साथ बढ़ें" /></div>
            <h2><Copy en="For product, dealer or" hi="उत्पाद, डीलर या" /><br /><em><Copy en="bulk supply enquiries." hi="बल्क सप्लाई जानकारी के लिए।" /></em></h2>
          </div>
          <div className="contact-details">
            <p><Copy en="Connect with the Gao Dehat team for product information and partnership enquiries." hi="उत्पाद जानकारी और साझेदारी संबंधी पूछताछ के लिए गाँव देहात टीम से संपर्क करें।" /></p>
            <a className="email-link whatsapp-link" href={generalWhatsAppLink} target="_blank" rel="noreferrer"><Copy en={`WhatsApp: ${WHATSAPP_DISPLAY_NUMBER}`} hi={`व्हाट्सऐप: ${WHATSAPP_DISPLAY_NUMBER}`} /> <span>↗</span></a>
            <a className="contact-email" href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a>
            <address>Gata No. 5, Palia Masoodpur Par Dew,<br />Barabanki, Uttar Pradesh – 225001</address>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
