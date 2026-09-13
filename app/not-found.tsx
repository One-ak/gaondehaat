import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="not-found-page shell" id="main-content" tabIndex={-1}>
      <p>Gao Dehat · 404</p>
      <h1>This page could not be found.</h1>
      <p>The link may be incorrect or the page may have moved.</p>
      <Link className="button button-dark" href="/#products">Explore our products</Link>
    </main>
  );
}
