import type { Metadata } from 'next';
import Link from 'next/link';
import SiteImage from '../../../components/SiteImage';
import { notFound } from 'next/navigation';
import LanguageToggle from '../../../components/LanguageToggle';
import MobileNav from '../../../components/MobileNav';
import SiteFooter from '../../../components/SiteFooter';
import ThemeToggle from '../../../components/ThemeToggle';
import { getProduct, products, standardUse } from '../../product-data';
import { createWhatsAppLink } from '../../site-contact';
import { absoluteUrl, serializeSchema } from '../../site-config';

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
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title,
      description: product.overview,
      url: absoluteUrl(`/products/${product.slug}`),
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

  const enquiryLink = createWhatsAppLink(
    `Hello Gao Dehat Team,\n\nI would like to enquire about ${product.name} (${product.nameHi}).\n\nPlease share product information, availability and pricing.\n\nThank you.`
  );
  const usage = product.usage ?? standardUse.en;
  const usageHi = product.usageHi ?? standardUse.hi;

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.overview,
    url: absoluteUrl(`/products/${product.slug}`),
    image: [absoluteUrl(product.image)],
    brand: { '@type': 'Brand', name: 'Gao Dehat' },
    manufacturer: { '@type': 'Organization', name: 'Gao Dehat Industries Pvt. Ltd.' },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Product type', value: product.type },
      { '@type': 'PropertyValue', name: 'Packing', value: product.pack },
      { '@type': 'PropertyValue', name: 'Suitable for', value: product.suitable },
    ],
  };

  return (
    <main className="product-page" id="main-content" tabIndex={-1}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema([productSchema, {
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Gao Dehat', item: absoluteUrl('/') },
          { '@type': 'ListItem', position: 2, name: product.name, item: absoluteUrl(`/products/${product.slug}`) },
        ],
      }]) }} />
      <nav className="detail-nav shell" aria-label="Product navigation">
        <Link className="brand" href="/" aria-label="Gao Dehat home">
          <SiteImage src="/gao-dehat-logo.jpeg" alt="Gao Dehat" sizes="80px" />
        </Link>
        <div className="detail-nav-links">
          <Link href="/"><Copy en="Home" hi="होम" /></Link>
          <Link href="/#products"><Copy en="All products" hi="सभी उत्पाद" /></Link>
        </div>
        <div className="nav-actions">
          <LanguageToggle />
          <ThemeToggle />
          <MobileNav />
          <a className="detail-enquiry" href={enquiryLink} target="_blank" rel="noreferrer"><Copy en="WhatsApp enquiry" hi="व्हाट्सऐप पूछताछ" /> <span>↗</span></a>
        </div>
      </nav>

      <section className="detail-hero">
        <div className="shell">
          <Link className="back-link" href="/#products">← <Copy en="Back to product catalogue" hi="उत्पाद सूची पर वापस" /></Link>
          <div className="detail-hero-grid">
            <div className={`detail-product-image ${product.className}`}>
              <SiteImage src={product.image} alt={`${product.name} product packaging`} loading="eager" fetchPriority="high" />
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
              <a className="button button-dark" href={enquiryLink} target="_blank" rel="noreferrer"><Copy en="Enquire on WhatsApp" hi="व्हाट्सऐप पर पूछताछ करें" /> <span>→</span></a>
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
            <p className="panel-intro"><Copy en="These pack-based guidance points make it easier to discuss the right application with the Gao Dehat team or a qualified crop advisor." hi="ये पैक-आधारित बिंदु गाँव देहात टीम या योग्य कृषि सलाहकार के साथ सही उपयोग पर चर्चा करना आसान बनाते हैं।" /></p>
            <ol className="use-list">
              {usage.map((instruction, index) => (
                <li key={instruction}>
                  <span className="step-number">{index + 1}</span>
                  <Copy en={instruction} hi={usageHi[index]} />
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
            <a className="button button-cream" href={enquiryLink} target="_blank" rel="noreferrer"><Copy en="Contact on WhatsApp" hi="व्हाट्सऐप पर संपर्क करें" /> <span>→</span></a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
