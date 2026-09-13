import Image from 'next/image';
import type { ImageProps } from 'next/image';

// Real asset dimensions reserve layout space; Next serves responsive WebP/AVIF
// variants on the Node deployment. Original packaging files remain unchanged.
const dimensions: Record<string, [number, number]> = {
  '/gao-dehat-logo.jpeg': [1254, 1254],
  '/directors/mayank-mathur.png': [1122, 1402],
  '/directors/lavanya-mathur.png': [1122, 1402],
  '/products/bhumihar.jpeg': [1192, 1600],
  '/products/black-gold.jpeg': [1192, 1600],
  '/products/boron-gold.jpeg': [1192, 1600],
  '/products/dop-prom-packshot.png': [1058, 1487],
  '/products/fertile-blossom-high-zinc.jpeg': [1192, 1600],
  '/products/gipl-24-karat.jpeg': [1536, 1024],
  '/products/green-force-packshot.png': [992, 1586],
  '/products/haryali-gold.jpeg': [1192, 1600],
  '/products/magnesium-gold.jpeg': [1192, 1600],
  '/products/micro-force.jpeg': [1192, 1600],
  '/products/mono-zinc.jpeg': [1192, 1600],
  '/products/potash-packshot.png': [992, 1586],
  '/products/super-baan-packshot.png': [1072, 1467],
  '/products/super-calcium-gold.png': [1015, 1549],
  '/products/super-power-win.jpg': [1600, 900],
  '/products/surya-super-zinc.jpeg': [1086, 1448],
  '/products/zinc-super-gold.jpeg': [1192, 1600],
};

export default function SiteImage({ src, alt, sizes = '(max-width: 800px) 90vw, 40vw', ...props }: Omit<ImageProps, 'src'> & { src: string }) {
  const [width, height] = dimensions[src] ?? [1600, 1600];
  return <Image src={src} alt={alt} width={width} height={height} sizes={sizes} {...props} />;
}
