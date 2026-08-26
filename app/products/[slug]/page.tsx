import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LanguageToggle from '../../../components/LanguageToggle';
import { getProduct, products, standardUse } from '../../product-data';

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

function Copy({ en, hi }: { en: string; hi: string }) {
  return (
    <>
      <span className="copy-en">{en}</span>
      <span className="copy-hi" lang="hi">{hi}</span>
    </>
  );
}

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return { title: 'Product not found | Gao Dehat' };
  }

  const title = `${product.name} | Gao Dehat`;
  return {
    title,
    description: product.overview,
    openGraph: {
      title,
      description: product.overview,
      images: [{ url: product.image, alt: `${product.name} product packaging` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: product.overview,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  const enquiryLink = `mailto:info.safalshakti@gmail.com?subject=${encodeURIComponent(`Product enquiry — ${product.name}`)}`;

  return (
    <main className="product-page">
      <nav className="detail-nav shell" aria-label="Product navigation">
        <a className="brand" href="/" aria-label="Gao Dehat home">
          <img src="/gao-dehat-logo.jpeg" alt="Gao Dehat" />
        </a>
        <div className="detail-nav-links">
          <a href="/"><Copy en="Home" hi="होम" /></a>
          <a href="/#products"><Copy en="All products" hi="सभी उत्पाद" /></a>
        </div>
        <div className="nav-actions">
          <LanguageToggle />
          <a className="detail-enquiry" href={enquiryLink}><Copy en="Send enquiry" hi="पूछताछ भेजें" /> <span>↗</span></a>
        </div>
      </nav>

      <section className="detail-hero">
        <div className="shell">
          <a className="back-link" href="/#products">← <Copy en="Back to product catalogue" hi="उत्पाद सूची पर वापस" /></a>
          <div className="detail-hero-grid">
            <div className={`detail-product-image ${product.className}`}>
              <img src={product.image} alt={`${product.name} product packaging`} />
            </div>
            <div className="detail-copy">
              <p className="detail-kicker"><Copy en="Gao Dehat product" hi="गाँव देहात उत्पाद" /></p>
              <p className="detail-name-hi" lang="hi">{product.nameHi}</p>
              <h1><Copy en={product.name} hi={product.nameHi} /></h1>
              <p className="detail-type"><Copy en={product.type} hi={product.typeHi} /></p>
              <p className="detail-overview"><Copy en={product.overview} hi={product.overviewHi} /></p>
              <div className="detail-jump-links" aria-label="Product information links">
                <a href="#overview"><Copy en="Overview" hi="जानकारी" /></a>
                <a href="#benefits"><Copy en="Key benefits" hi="मुख्य लाभ" /></a>
                <a href="#how-to-use"><Copy en="How to use" hi="कैसे उपयोग करें" /></a>
              </div>
              <a className="button button-dark" href={enquiryLink}><Copy en="Enquire about this product" hi="इस उत्पाद के लिए पूछताछ करें" /> <span>→</span></a>
            </div>
          </div>
        </div>
      </section>

      <section className="detail-facts-section" id="overview">
        <div className="shell detail-facts">
          <article>
            <span>01</span>
            <p><Copy en="Packing" hi="पैकिंग" /></p>
            <strong><Copy en={product.pack} hi={product.packHi} /></strong>
          </article>
          <article>
            <span>02</span>
            <p><Copy en="Product type" hi="उत्पाद का प्रकार" /></p>
            <strong><Copy en={product.type} hi={product.typeHi} /></strong>
          </article>
          <article>
            <span>03</span>
            <p><Copy en="Suitable for" hi="उपयुक्त" /></p>
            <strong><Copy en={product.suitable} hi={product.suitableHi} /></strong>
          </article>
        </div>
      </section>

      <section className="detail-content shell">
        <div className="detail-section-head">
          <div className="section-label"><span>01</span> <Copy en="Product information" hi="उत्पाद जानकारी" /></div>
          <h2><Copy en="The details that help" hi="सही जानकारी, सही" /><br /><em><Copy en="you choose with care." hi="चुनाव में सहायक।" /></em></h2>
        </div>

        <div className="detail-info-grid">
          <article className="detail-panel" id="benefits">
            <p className="panel-kicker"><Copy en="Key benefits" hi="मुख्य लाभ" /></p>
            <ul className="benefit-list">
              {product.benefits.map((benefit, index) => (
                <li key={benefit}>
                  <span className="benefit-number">0{index + 1}</span>
                  <Copy en={benefit} hi={product.benefitsHi[index]} />
                </li>
              ))}
            </ul>
          </article>

          <article className="detail-panel use-panel" id="how-to-use">
            <p className="panel-kicker"><Copy en="How to use" hi="कैसे उपयोग करें" /></p>
            <p className="panel-intro"><Copy en="For the safest and most effective result, use the printed product label as the primary instruction." hi="सबसे सुरक्षित और प्रभावी उपयोग के लिए, उत्पाद पर छपे लेबल को प्राथमिक निर्देश मानें।" /></p>
            <ol className="use-list">
              {standardUse.en.map((instruction, index) => (
                <li key={instruction}>
                  <span className="step-number">{index + 1}</span>
                  <Copy en={instruction} hi={standardUse.hi[index]} />
                </li>
              ))}
            </ol>
          </article>
        </div>
      </section>

      <section className="detail-assurance">
        <div className="shell assurance-grid">
          <div>
            <div className="section-label light"><span>02</span> <Copy en="Vansh Group approach" hi="वंश ग्रुप का दृष्टिकोण" /></div>
            <h2><Copy en="Made for the field." hi="खेतों के लिए बना।" /><br /><em><Copy en="Supported with care." hi="देखभाल के साथ सहयोग।" /></em></h2>
          </div>
          <div className="assurance-points">
            <p><Copy en="Product information that is clear, practical and grounded in the product pack." hi="स्पष्ट, व्यावहारिक और उत्पाद पैक पर आधारित जानकारी।" /></p>
            <p><Copy en="For dealer, distribution or bulk-supply requirements, contact the Gao Dehat team." hi="डीलर, वितरण या बल्क-सप्लाई की आवश्यकता के लिए गाँव देहात टीम से संपर्क करें।" /></p>
            <a className="button button-cream" href={enquiryLink}><Copy en="Contact Gao Dehat" hi="गाँव देहात से संपर्क करें" /> <span>→</span></a>
          </div>
        </div>
      </section>

      <footer>
        <div className="shell footer-inner">
          <div className="footer-brand"><img src="/gao-dehat-logo.jpeg" alt="Gao Dehat" /></div>
          <p>© {new Date().getFullYear()} Gao Dehat Industries Pvt. Ltd.<br /><Copy en="A Vansh Group company" hi="वंश ग्रुप की एक कंपनी" /></p>
          <a className="footer-phrase" href="/#products"><Copy en="View all products" hi="सभी उत्पाद देखें" /> ↗</a>
        </div>
      </footer>
    </main>
  );
}
