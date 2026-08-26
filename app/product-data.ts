export type Product = {
  slug: string;
  className: string;
  name: string;
  nameHi: string;
  type: string;
  typeHi: string;
  image: string;
  pack: string;
  packHi: string;
  note: string;
  noteHi: string;
  overview: string;
  overviewHi: string;
  benefits: string[];
  benefitsHi: string[];
  suitable: string;
  suitableHi: string;
};

export const standardUse = {
  en: [
    'Read the product label completely before use.',
    'Use only at the crop stage, dose and application method recommended on the pack or by a qualified crop advisor.',
    'Keep the pack sealed, dry and away from direct sunlight after use.',
  ],
  hi: [
    'उपयोग से पहले उत्पाद के लेबल को ध्यान से पढ़ें।',
    'उत्पाद का उपयोग केवल पैक पर दिए गए फसल चरण, मात्रा और विधि के अनुसार या योग्य कृषि सलाहकार की सलाह से करें।',
    'उपयोग के बाद पैक को बंद, सूखी जगह और सीधी धूप से दूर रखें।',
  ],
};

export const products: Product[] = [
  {
    slug: 'super-calcium-gold', className: 'calcium-gold', name: 'Super Calcium Gold', nameHi: 'सुपर कैल्शियम गोल्ड',
    type: 'Calcium, magnesium & nutrient elements', typeHi: 'कैल्शियम, मैग्नीशियम एवं पोषक तत्व',
    image: '/products/super-calcium-gold.png', pack: '30 kg pack', packHi: '30 किग्रा पैक',
    note: 'Better growth, stronger crops', noteHi: 'बेहतर वृद्धि, मजबूत फसल',
    overview: 'A calcium, magnesium and nutrient-element product presented for stronger crop growth.',
    overviewHi: 'कैल्शियम, मैग्नीशियम और पोषक तत्वों से युक्त उत्पाद, जो बेहतर वृद्धि और मजबूत फसल के लिए प्रस्तुत किया गया है।',
    benefits: ['Calcium, magnesium and nutrient elements', 'Better growth', 'Stronger crops'],
    benefitsHi: ['कैल्शियम, मैग्नीशियम एवं पोषक तत्व', 'बेहतर वृद्धि', 'मजबूत फसल'],
    suitable: 'Use according to the product label and crop-advisor guidance.', suitableHi: 'पैक के लेबल और कृषि सलाहकार की सलाह के अनुसार उपयोग करें।',
  },
  {
    slug: 'gipl-24-karat', className: 'gipl', name: 'GIPL 24 Karat', nameHi: 'जीआईपीएल 24 कैरट',
    type: 'Gibberellic Acid 0.001% SL · Plant growth regulator', typeHi: 'जिबरेलिक एसिड 0.001% एसएल · पादप वृद्धि नियामक',
    image: '/products/gipl-24-karat.jpeg', pack: '100 ml', packHi: '100 मि.ली.',
    note: 'Plant growth regulator', noteHi: 'पादप वृद्धि नियामक',
    overview: 'A Gibberellic Acid 0.001% SL plant growth regulator in a 100 ml presentation.',
    overviewHi: '100 मि.ली. प्रस्तुति में जिबरेलिक एसिड 0.001% एसएल पादप वृद्धि नियामक।',
    benefits: ['Supports plant growth', 'Supports flowering and fruit setting', 'Supports fruit size, yield and quality'],
    benefitsHi: ['पौधों की वृद्धि में सहायक', 'फूल आने और फल सेटिंग में सहायक', 'फल के आकार, उपज और गुणवत्ता में सहायक'],
    suitable: 'Label-listed crops and crop programmes.', suitableHi: 'लेबल पर दी गई फसलों और फसल कार्यक्रमों के लिए।',
  },
  {
    slug: 'green-force', className: 'green-force', name: 'Green Force', nameHi: 'ग्रीन फोर्स',
    type: 'Phosphate Rich Organic Manure', typeHi: 'फॉस्फेट समृद्ध जैविक खाद',
    image: '/products/green-force-packshot.png', pack: '50 kg pack', packHi: '50 किग्रा पैक',
    note: 'PROM · 8% P₂O₅', noteHi: 'पीआरओएम · 8% पी₂ओ₅',
    overview: 'Phosphate Rich Organic Manure presented for soil-nutrition programmes.',
    overviewHi: 'मिट्टी पोषण कार्यक्रमों के लिए प्रस्तुत फॉस्फेट समृद्ध जैविक खाद।',
    benefits: ['Phosphate-rich organic manure', 'Supports soil-nutrition programmes', '50 kg pack'],
    benefitsHi: ['फॉस्फेट समृद्ध जैविक खाद', 'मिट्टी पोषण कार्यक्रमों में सहायक', '50 किग्रा पैक'],
    suitable: 'Field and horticulture crop programmes, as directed on the label.', suitableHi: 'लेबल के निर्देशानुसार खेत और बागवानी फसल कार्यक्रमों के लिए।',
  },
  {
    slug: 'super-baan', className: 'super-baan', name: 'Super Baan', nameHi: 'सुपर बाण',
    type: 'Super Prime Granular / Powder PROM', typeHi: 'सुपर प्राइम दानेदार / पाउडर पीआरओएम',
    image: '/products/super-baan-packshot.png', pack: '50 kg pack', packHi: '50 किग्रा पैक',
    note: 'Granular & powder', noteHi: 'दानेदार और पाउडर',
    overview: 'A Super Prime PROM offered in granular and powder forms.',
    overviewHi: 'दानेदार और पाउडर रूप में उपलब्ध सुपर प्राइम पीआरओएम।',
    benefits: ['Granular and powder formats', 'PROM crop-nutrition input', '50 kg pack'],
    benefitsHi: ['दानेदार और पाउडर रूप', 'पीआरओएम फसल-पोषण इनपुट', '50 किग्रा पैक'],
    suitable: 'Crop programmes as directed on the label.', suitableHi: 'लेबल के निर्देशानुसार फसल कार्यक्रमों के लिए।',
  },
  {
    slug: 'dop-prom', className: 'dop-prom', name: 'DOP PROM', nameHi: 'डी ओ पी पीआरओएम',
    type: 'Phosphate Rich Organic Manure', typeHi: 'फॉस्फेट समृद्ध जैविक खाद',
    image: '/products/dop-prom-packshot.png', pack: '50 kg pack', packHi: '50 किग्रा पैक',
    note: 'PROM · 8% P₂O₅', noteHi: 'पीआरओएम · 8% पी₂ओ₅',
    overview: 'A Phosphate Rich Organic Manure in a 50 kg pack.',
    overviewHi: '50 किग्रा पैक में फॉस्फेट समृद्ध जैविक खाद।',
    benefits: ['PROM crop-nutrition input', 'Phosphate-rich formulation', '50 kg pack'],
    benefitsHi: ['पीआरओएम फसल-पोषण इनपुट', 'फॉस्फेट समृद्ध फॉर्मूलेशन', '50 किग्रा पैक'],
    suitable: 'Field and horticulture crop programmes, as directed on the label.', suitableHi: 'लेबल के निर्देशानुसार खेत और बागवानी फसल कार्यक्रमों के लिए।',
  },
  {
    slug: 'potash', className: 'potash', name: 'Potash', nameHi: 'पोटाश',
    type: 'Dried Premium Molasses · K₂O 14.5%', typeHi: 'ड्राइड प्रीमियम मोलासेस · के₂ओ 14.5%',
    image: '/products/potash-packshot.png', pack: '50 kg pack', packHi: '50 किग्रा पैक',
    note: 'K₂O · 14.5%', noteHi: 'के₂ओ · 14.5%',
    overview: 'A dried premium molasses fertilizer for agricultural use, labelled K₂O 14.5%.',
    overviewHi: 'कृषि उपयोग के लिए ड्राइड प्रीमियम मोलासेस उर्वरक, जिस पर के₂ओ 14.5% अंकित है।',
    benefits: ['K₂O 14.5%', 'For agricultural use only', '50 kg pack'],
    benefitsHi: ['के₂ओ 14.5%', 'केवल कृषि उपयोग के लिए', '50 किग्रा पैक'],
    suitable: 'Agricultural crop programmes as directed on the label.', suitableHi: 'लेबल के निर्देशानुसार कृषि फसल कार्यक्रमों के लिए।',
  },
  {
    slug: 'surya-super-zinc', className: 'surya-zinc', name: 'Surya Super Zinc', nameHi: 'सूर्या सुपर जिंक',
    type: 'Water-soluble fertilizer for foliar spray', typeHi: 'फोलियर स्प्रे के लिए जल में घुलनशील उर्वरक',
    image: '/products/surya-super-zinc.jpeg', pack: '250 g', packHi: '250 ग्राम',
    note: '100% water soluble', noteHi: '100% जल में घुलनशील',
    overview: 'A 100% water-soluble fertilizer presented for foliar spray.',
    overviewHi: 'फोलियर स्प्रे के लिए प्रस्तुत 100% जल में घुलनशील उर्वरक।',
    benefits: ['100% water soluble', 'For foliar spray', '250 g pack'],
    benefitsHi: ['100% जल में घुलनशील', 'फोलियर स्प्रे के लिए', '250 ग्राम पैक'],
    suitable: 'Foliar applications only as directed on the pack.', suitableHi: 'केवल पैक के निर्देशानुसार फोलियर उपयोग के लिए।',
  },
  {
    slug: 'zinc-super-gold', className: 'zinc-gold', name: 'Zinc Super Gold', nameHi: 'जिंक सुपर गोल्ड',
    type: 'Micronutrients fertilizer · Micronutrients + Sulphur', typeHi: 'सूक्ष्म पोषक उर्वरक · सूक्ष्म पोषक तत्व + सल्फर',
    image: '/products/zinc-super-gold.jpeg', pack: 'Crop & flower yield', packHi: 'फसल और फूल उपज',
    note: 'Micronutrients + sulphur', noteHi: 'सूक्ष्म पोषक तत्व + सल्फर',
    overview: 'A micronutrients and sulphur fertilizer presented for crop and flower programmes.',
    overviewHi: 'फसल और फूल कार्यक्रमों के लिए प्रस्तुत सूक्ष्म पोषक तत्व और सल्फर उर्वरक।',
    benefits: ['Micronutrients and sulphur', 'For crop and flower programmes', 'Gold series product'],
    benefitsHi: ['सूक्ष्म पोषक तत्व और सल्फर', 'फसल और फूल कार्यक्रमों के लिए', 'गोल्ड सीरीज़ उत्पाद'],
    suitable: 'Crop and flower programmes as directed on the label.', suitableHi: 'लेबल के निर्देशानुसार फसल और फूल कार्यक्रमों के लिए।',
  },
  {
    slug: 'mono-zinc', className: 'mono-zinc', name: 'Mono Zinc', nameHi: 'मोनो जिंक',
    type: 'Zinc Sulphate Monohydrate · Zn 33% min · S 15% min', typeHi: 'जिंक सल्फेट मोनोहाइड्रेट · जिंक 33% न्यूनतम · सल्फर 15% न्यूनतम',
    image: '/products/mono-zinc.jpeg', pack: 'Agriculture grade', packHi: 'कृषि ग्रेड',
    note: 'Zinc sulphate monohydrate', noteHi: 'जिंक सल्फेट मोनोहाइड्रेट',
    overview: 'An agriculture-grade Zinc Sulphate Monohydrate product.',
    overviewHi: 'कृषि ग्रेड जिंक सल्फेट मोनोहाइड्रेट उत्पाद।',
    benefits: ['Zn 33% min', 'S 15% min', 'Agriculture grade'],
    benefitsHi: ['जिंक 33% न्यूनतम', 'सल्फर 15% न्यूनतम', 'कृषि ग्रेड'],
    suitable: 'Agricultural crop programmes as directed on the label.', suitableHi: 'लेबल के निर्देशानुसार कृषि फसल कार्यक्रमों के लिए।',
  },
  {
    slug: 'magnesium-gold', className: 'magnesium-gold', name: 'Magnesium Gold', nameHi: 'मैग्नीशियम गोल्ड',
    type: 'Magnesium 9.5% · Sulphate 12%', typeHi: 'मैग्नीशियम 9.5% · सल्फेट 12%',
    image: '/products/magnesium-gold.jpeg', pack: 'Crop & flower yield', packHi: 'फसल और फूल उपज',
    note: 'Magnesium + sulphate', noteHi: 'मैग्नीशियम + सल्फेट',
    overview: 'A magnesium and sulphate product for crop and flower programmes.',
    overviewHi: 'फसल और फूल कार्यक्रमों के लिए मैग्नीशियम और सल्फेट उत्पाद।',
    benefits: ['Magnesium 9.5%', 'Sulphate 12%', 'Gold series product'],
    benefitsHi: ['मैग्नीशियम 9.5%', 'सल्फेट 12%', 'गोल्ड सीरीज़ उत्पाद'],
    suitable: 'Crop and flower programmes as directed on the label.', suitableHi: 'लेबल के निर्देशानुसार फसल और फूल कार्यक्रमों के लिए।',
  },
  {
    slug: 'fertile-blossom-high-zinc', className: 'blossom-zinc', name: 'Fertile Blossom High Zinc', nameHi: 'फर्टाइल ब्लॉसम हाई जिंक',
    type: 'Micronutrients fertilizer · Micronutrients + Sulphur', typeHi: 'सूक्ष्म पोषक उर्वरक · सूक्ष्म पोषक तत्व + सल्फर',
    image: '/products/fertile-blossom-high-zinc.jpeg', pack: 'Crop & flower yield', packHi: 'फसल और फूल उपज',
    note: 'Micronutrients + sulphur', noteHi: 'सूक्ष्म पोषक तत्व + सल्फर',
    overview: 'A micronutrients and sulphur fertilizer in the Fertile Blossom range.',
    overviewHi: 'फर्टाइल ब्लॉसम रेंज में सूक्ष्म पोषक तत्व और सल्फर उर्वरक।',
    benefits: ['Micronutrients and sulphur', 'For crop and flower programmes', 'High-zinc range product'],
    benefitsHi: ['सूक्ष्म पोषक तत्व और सल्फर', 'फसल और फूल कार्यक्रमों के लिए', 'हाई-जिंक रेंज उत्पाद'],
    suitable: 'Crop and flower programmes as directed on the label.', suitableHi: 'लेबल के निर्देशानुसार फसल और फूल कार्यक्रमों के लिए।',
  },
  {
    slug: 'boron-gold', className: 'boron-gold', name: 'Boron Gold', nameHi: 'बोरॉन गोल्ड',
    type: 'Sodium Tetraborate · Boron (B) 10.5% w/w min', typeHi: 'सोडियम टेट्राबोरेट · बोरॉन (बी) 10.5% w/w न्यूनतम',
    image: '/products/boron-gold.jpeg', pack: 'For soil application', packHi: 'मृदा अनुप्रयोग के लिए',
    note: 'Micronutrient fertilizer', noteHi: 'सूक्ष्म पोषक उर्वरक',
    overview: 'A Sodium Tetraborate micronutrient fertilizer for soil application.',
    overviewHi: 'मृदा अनुप्रयोग के लिए सोडियम टेट्राबोरेट सूक्ष्म पोषक उर्वरक।',
    benefits: ['Boron 10.5% w/w min', 'For soil application', 'Micronutrient fertilizer'],
    benefitsHi: ['बोरॉन 10.5% w/w न्यूनतम', 'मृदा अनुप्रयोग के लिए', 'सूक्ष्म पोषक उर्वरक'],
    suitable: 'Soil application only as directed on the pack.', suitableHi: 'केवल पैक के निर्देशानुसार मृदा अनुप्रयोग के लिए।',
  },
  {
    slug: 'micro-force', className: 'micro-force', name: 'Micro Force', nameHi: 'माइक्रो फोर्स',
    type: 'Ferrous Sulphate · 19%', typeHi: 'फेरस सल्फेट · 19%',
    image: '/products/micro-force.jpeg', pack: 'Micronutrient fertilizer', packHi: 'सूक्ष्म पोषक उर्वरक',
    note: 'Ferrous sulphate', noteHi: 'फेरस सल्फेट',
    overview: 'A Ferrous Sulphate 19% micronutrient fertilizer.',
    overviewHi: 'फेरस सल्फेट 19% सूक्ष्म पोषक उर्वरक।',
    benefits: ['Ferrous Sulphate 19%', 'Micronutrient fertilizer', 'Gold series product'],
    benefitsHi: ['फेरस सल्फेट 19%', 'सूक्ष्म पोषक उर्वरक', 'गोल्ड सीरीज़ उत्पाद'],
    suitable: 'Agricultural crop programmes as directed on the label.', suitableHi: 'लेबल के निर्देशानुसार कृषि फसल कार्यक्रमों के लिए।',
  },
  {
    slug: 'black-gold', className: 'black-gold', name: 'Black Gold', nameHi: 'ब्लैक गोल्ड',
    type: 'Organic growth stimulator · Humic 98% w/w', typeHi: 'जैविक वृद्धि प्रवर्तक · ह्यूमिक 98% w/w',
    image: '/products/black-gold.jpeg', pack: 'Organic crop support', packHi: 'जैविक फसल सहायता',
    note: 'Humic 98% w/w', noteHi: 'ह्यूमिक 98% w/w',
    overview: 'An organic growth stimulator labelled Humic 98% w/w.',
    overviewHi: 'ह्यूमिक 98% w/w अंकित जैविक वृद्धि प्रवर्तक।',
    benefits: ['Organic growth stimulator', 'Humic 98% w/w', 'Gold series product'],
    benefitsHi: ['जैविक वृद्धि प्रवर्तक', 'ह्यूमिक 98% w/w', 'गोल्ड सीरीज़ उत्पाद'],
    suitable: 'Crop programmes as directed on the label.', suitableHi: 'लेबल के निर्देशानुसार फसल कार्यक्रमों के लिए।',
  },
  {
    slug: 'bhumi-pakar', className: 'bhumihar', name: 'Bhumi Pakar', nameHi: 'भूमि पकार',
    type: 'Nitro 35% + Humic Acid 15% + Amino Acid 10%', typeHi: 'नाइट्रो 35% + ह्यूमिक एसिड 15% + अमीनो एसिड 10%',
    image: '/products/bhumihar.jpeg', pack: 'Biostimulant product', packHi: 'बायोस्टिमुलेंट उत्पाद',
    note: 'Biostimulant', noteHi: 'बायोस्टिमुलेंट',
    overview: 'A biostimulant product with Nitro, Humic Acid and Amino Acid as shown on the pack.',
    overviewHi: 'पैक पर अंकित नाइट्रो, ह्यूमिक एसिड और अमीनो एसिड युक्त बायोस्टिमुलेंट उत्पाद।',
    benefits: ['Nitro 35%', 'Humic Acid 15%', 'Amino Acid 10%'],
    benefitsHi: ['नाइट्रो 35%', 'ह्यूमिक एसिड 15%', 'अमीनो एसिड 10%'],
    suitable: 'Crop programmes as directed on the label.', suitableHi: 'लेबल के निर्देशानुसार फसल कार्यक्रमों के लिए।',
  },
  {
    slug: 'haryali-gold', className: 'haryali-gold', name: 'Haryali Gold', nameHi: 'हरियाली गोल्ड',
    type: 'Chelated Iron as Fe-EDTA 12%', typeHi: 'फी-ईडीटीए 12% के रूप में चेलेटेड आयरन',
    image: '/products/haryali-gold.jpeg', pack: 'Drip & foliar application', packHi: 'ड्रिप और फोलियर अनुप्रयोग',
    note: 'Chelated iron', noteHi: 'चेलेटेड आयरन',
    overview: 'A chelated iron micronutrient fertilizer for drip and foliar application.',
    overviewHi: 'ड्रिप और फोलियर अनुप्रयोग के लिए चेलेटेड आयरन सूक्ष्म पोषक उर्वरक।',
    benefits: ['Fe-EDTA 12%', 'For drip and foliar application', 'Chelated iron'],
    benefitsHi: ['फी-ईडीटीए 12%', 'ड्रिप और फोलियर अनुप्रयोग के लिए', 'चेलेटेड आयरन'],
    suitable: 'Drip and foliar application only as directed on the pack.', suitableHi: 'केवल पैक के निर्देशानुसार ड्रिप और फोलियर अनुप्रयोग के लिए।',
  },
  {
    slug: 'super-power-win', className: 'power-win', name: 'Super Power Win', nameHi: 'सुपर पावर विन',
    type: 'Plant Growth Promoter', typeHi: 'पादप वृद्धि प्रवर्तक',
    image: '/products/super-power-win.jpg', pack: '0.3 L × 10 pack', packHi: '0.3 ली. × 10 पैक',
    note: 'Healthy plant, better yield', noteHi: 'स्वस्थ पौधे, बेहतर उपज',
    overview: 'A plant growth promoter presented for healthy plants and better yield.',
    overviewHi: 'स्वस्थ पौधों और बेहतर उपज के लिए प्रस्तुत पादप वृद्धि प्रवर्तक।',
    benefits: ['Supports plant growth and development', 'Supports stronger roots', 'Supports flowers, fruits, yield and quality'],
    benefitsHi: ['पौधों की वृद्धि और विकास में सहायक', 'जड़ों को मजबूत बनाने में सहायक', 'फूल, फल, उपज और गुणवत्ता में सहायक'],
    suitable: 'All crops, as directed on the label.', suitableHi: 'लेबल के निर्देशानुसार सभी फसलों के लिए।',
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}
