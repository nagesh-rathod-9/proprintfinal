import { Category, Product, HeroSlide } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'visiting-cards',
    name: 'Visiting Cards',
    nameMr: 'व्हिजिटिंग कार्ड्स',
    shortName: 'Cards',
    iconName: 'CreditCard',
    image: 'https://i.pinimg.com/736x/a0/f2/48/a0f248a045d206198648621d77eb6426.jpg',
    itemCount: 16,
    featured: true,
    description: '350-400 GSM Matte, Velvet Touch, Spot UV & Foil Stamped Visiting Cards'
  },
  {
    id: 'brochures',
    name: 'Brochures & Catalogs',
    nameMr: 'ब्रोशर्स व कॅटलॉग',
    shortName: 'Brochures',
    iconName: 'BookOpen',
    image: 'https://i.pinimg.com/736x/4a/ff/87/4aff87c143b4ae3a828a989151e04844.jpg',
    itemCount: 18,
    featured: true,
    description: 'Tri-Fold, Bi-Fold & Multi-page Saddle Stitched Corporate Product Catalogs'
  },
  {
    id: 'packaging',
    name: 'Packaging & Boxes',
    nameMr: 'पॅकेजिंग बॉक्सेस',
    shortName: 'Packaging',
    iconName: 'Package',
    image: 'https://i.pinimg.com/736x/55/d7/5b/55d75bcfad0da6b4df44d19c9fe953b8.jpg',
    itemCount: 15,
    featured: true,
    description: 'E-commerce mailers, mono cartons, sweet boxes and custom corrugated boxes'
  },
  {
    id: 'stickers',
    name: 'Stickers & Labels',
    nameMr: 'स्टिकर्स व लेबल्स',
    shortName: 'Stickers',
    iconName: 'Tag',
    image: 'https://i.pinimg.com/1200x/72/c7/ec/72c7ec157835f3350324004879afa7b2.jpg',
    itemCount: 20,
    featured: true,
    description: '12x18 Waterproof Die-Cut Vinyl Sheets, Logo Stickers & Bottle Labels'
  },
  {
    id: 'letterheads',
    name: 'Letter Heads',
    nameMr: 'लेटरहेड्स व स्टेशनरी',
    shortName: 'Letterheads',
    iconName: 'FileText',
    image: 'https://i.pinimg.com/736x/69/09/86/690986cd9d97f35e6251a56a9acc0cb1.jpg',
    itemCount: 14,
    featured: true,
    description: 'Executive 100 GSM DO Bond & Alabaster Letterheads & Marketing Pamphlets'
  },
  {
    id: 'envelopes',
    name: 'Envelopes',
    nameMr: 'पाकिटे व कव्हर्स',
    shortName: 'Envelopes',
    iconName: 'Mail',
    image: 'https://i.pinimg.com/736x/61/63/d6/6163d61c7ad96f17dc96f7cb51994e9d.jpg',
    itemCount: 12,
    featured: true,
    description: '#10 Commercial, Window & Peel-and-Seal Custom Printed Envelopes'
  },
  {
    id: 'invitation-cards',
    name: 'Invitation Cards',
    nameMr: 'लग्न व समारंभ पत्रिका',
    shortName: 'Invitations',
    iconName: 'Sparkles',
    image: 'https://i.pinimg.com/736x/e1/35/8d/e1358d4dbbecea602cb7d686885a9b86.jpg',
    itemCount: 15,
    featured: true,
    description: 'Wedding, Inauguration & Corporate Event Invitation Cards with Gold Foil'
  },
  {
    id: 'project-files',
    name: 'Project Files',
    nameMr: 'प्रकल्प व ऑफिस फाईल्स',
    shortName: 'Project Files',
    iconName: 'FolderCheck',
    image: 'https://i.pinimg.com/736x/55/d7/5b/55d75bcfad0da6b4df44d19c9fe953b8.jpg',
    itemCount: 11,
    featured: true,
    description: 'Custom Printed Project Report Files, Index Strip Folders & Spring Folders'
  },
  {
    id: 'paper-board-files',
    name: 'Paper Board',
    nameMr: 'पेपर बोर्ड फाईल्स',
    shortName: 'Files',
    iconName: 'Layers',
    image: 'https://i.pinimg.com/1200x/40/2d/13/402d13d169defc55bb84b20ebe64a8aa.jpg',
    itemCount: 10,
    featured: true,
    description: '450 GSM Heavy Rigid Calico Pasted & Laminated Paper Board Folders'
  },
  {
    id: 'flyers',
    name: 'Flyers & Pamphlets',
    nameMr: 'हँडबिल्स व पत्रके',
    shortName: 'Flyers',
    iconName: 'FileText',
    image: 'https://i.pinimg.com/736x/c3/e3/fb/c3e3fb9111709c6c97fdfcd3a5db5a6b.jpg',
    itemCount: 12,
    featured: false,
    description: 'A5 & A4 promotional marketing flyers on 170-250 GSM art paper'
  },
  {
    id: 'banners',
    name: 'Banners & Standees',
    nameMr: 'फ्लेक्स बॅनर्स व स्टँडी',
    shortName: 'Banners',
    iconName: 'Image',
    image: 'https://i.pinimg.com/736x/08/d5/a9/08d5a9b44fab80be862cfdd636c77a6e.jpg',
    itemCount: 8,
    featured: false,
    description: 'Star flex banners, roll-up aluminum standees and outdoor signage'
  },
  {
    id: 'id-cards',
    name: 'ID Cards & Lanyards',
    nameMr: 'ओळखपत्र व लेस',
    shortName: 'ID Cards',
    iconName: 'Badge',
    image: 'https://i.pinimg.com/736x/1c/30/5f/1c305f62e62424063541afd2fba7cfce.jpg',
    itemCount: 10,
    featured: false,
    description: 'PVC employee identity cards, RFID chips and satin printed lanyards'
  },
  {
    id: 'paper-bags',
    name: 'Paper Bags',
    nameMr: 'पेपर बॅग्ज व पिशव्या',
    shortName: 'Bags',
    iconName: 'ShoppingBag',
    image: 'https://i.pinimg.com/1200x/1d/4d/42/1d4d42be124044f803ec36479559be53.jpg',
    itemCount: 10,
    featured: false,
    description: 'Natural brown kraft & luxury boutique laminated carry bags'
  },
  {
    id: 'apparel',
    name: 'Corporate Apparel',
    nameMr: 'टी-शर्ट्स व कपडे',
    shortName: 'Apparel',
    iconName: 'Shirt',
    image: 'https://i.pinimg.com/1200x/98/a4/b0/98a4b046560ce4b681bbd5c9e3daa18b.jpg',
    itemCount: 8,
    featured: false,
    description: 'Embroidered company polo t-shirts and promotional uniform wear'
  },
  {
    id: 'custom-merch',
    name: 'Custom Merch & Mugs',
    nameMr: 'मग्स व गिफ्ट्स',
    shortName: 'Merchandise',
    iconName: 'Coffee',
    image: 'https://i.pinimg.com/1200x/e8/bc/cb/e8bccba6d729e206049e49924e7b87a7.jpg',
    itemCount: 12,
    featured: false,
    description: 'Ceramic coffee mugs, magic mugs, bottles and customized gifts'
  }
];

export const PRODUCTS: Product[] = [
  // 1. BROCHURES
  {
    id: 'prod-premium-brochure',
    categoryId: 'brochures',
    name: 'Tri-Fold & Bi-Fold Promotional Brochure',
    tagline: 'Medical & corporate multi-panel promotional brochures • 1-Day Delivery',
    basePrice: 699,
    originalPrice: 999,
    image: 'https://i.pinimg.com/1200x/f7/44/c6/f744c6c200172e6937ead8bac3afc2f7.jpg',
    galleryImages: [
      'https://i.pinimg.com/736x/84/b5/50/84b55044919a7aac911d7d4269cc13b2.jpg',
      'https://i.pinimg.com/736x/90/15/d7/9015d7bd82c34fabb21d054055aee82c.jpg',
      'https://i.pinimg.com/1200x/98/db/52/98db52fe66866315c99946c27a461b9b.jpg'
    ],
    rating: 4.9,
    reviewsCount: 384,
    isBestSeller: true,
    isPopular: true,
    minQuantity: 100,
    defaultQuantity: 250,
    quantityOptions: [100, 250, 500, 1000, 2500, 5000],
    sizes: [
      { id: 'a4-trifold', name: 'A4 Tri-Fold (Open 297 x 210 mm, 6 Panels)', dimension: 'Folded 99 x 210 mm', priceMultiplier: 1.0 },
      { id: 'a4-bifold', name: 'A4 Bi-Fold (Open 297 x 420 mm, 4 Panels)', dimension: 'Folded 210 x 297 mm', priceMultiplier: 1.45 },
      { id: 'a5-bifold', name: 'A5 Bi-Fold (Open 210 x 148 mm)', dimension: 'Folded 105 x 148 mm', priceMultiplier: 0.8 }
    ],
    finishes: [
      { id: 'gloss-170', name: 'Gloss Art Paper 170 GSM', gsm: '170 GSM', description: 'Vivid color sheen bringing high-detail photography to life.', priceMultiplier: 1.0 },
      { id: 'silk-matte-250', name: 'Silk Matte Art Card 250 GSM', gsm: '250 GSM', description: 'Stiff, prestigious tactile texture with matte velvet lamination.', priceMultiplier: 1.25 },
      { id: 'spot-uv-300', name: 'Spot UV + Velvet 300 GSM', gsm: '300 GSM', description: 'Glossy raised tactile highlights on logo and cover headings.', priceMultiplier: 1.6 }
    ],
    cornerOptions: ['Standard Square'],
    features: [
      '⚡ One Day Delivery available in Chh. Sambhajinagar',
      'Precision machine scored with zero spine cracking',
      '2400 DPI photographic fidelity on Heidelberg offset press',
      'Order on WhatsApp available for custom sizes and large page counts'
    ],
    specifications: {
      'Paper Weight': '170 - 300 GSM Imported Art Board',
      'Color Space': 'CMYK / Pantone Spot Colors',
      'Folding Style': 'Tri-Fold (C-Fold / Z-Fold) or Bi-Fold',
      'Turnaround': 'Same Day / 24 Hours Dispatch'
    },
    templateAvailable: true
  },
  {
    id: 'prod-multi-page-catalog',
    categoryId: 'brochures',
    name: 'Multi-Page Product Catalog & Booklet (8-32 Pages)',
    tagline: 'Saddle-stitched corporate catalogs, industrial portfolios & lookbooks',
    basePrice: 1499,
    originalPrice: 2200,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=80'
    ],
    rating: 4.95,
    reviewsCount: 190,
    isBestSeller: false,
    isPopular: true,
    minQuantity: 50,
    defaultQuantity: 100,
    quantityOptions: [50, 100, 250, 500, 1000],
    sizes: [
      { id: 'a4-catalog-8p', name: 'A4 Size - 8 Pages Saddle Stitched', dimension: '210 x 297 mm Closed', priceMultiplier: 1.0 },
      { id: 'a4-catalog-16p', name: 'A4 Size - 16 Pages Saddle Stitched', dimension: '210 x 297 mm Closed', priceMultiplier: 1.75 },
      { id: 'a4-catalog-32p', name: 'A4 Size - 32 Pages Perfect Bound', dimension: '210 x 297 mm Closed', priceMultiplier: 3.1 },
      { id: 'a5-booklet-12p', name: 'A5 Size - 12 Pages Handy Booklet', dimension: '148 x 210 mm Closed', priceMultiplier: 1.2 }
    ],
    finishes: [
      { id: 'gloss-inner-matt-cover', name: '300 GSM Matt Cover + 170 GSM Gloss Inners', gsm: 'Multi-GSM', description: 'Heavy protective laminated cover with lightweight silky pages.', priceMultiplier: 1.0 },
      { id: 'full-gloss', name: 'All 170 GSM Gloss Art Paper', gsm: '170 GSM', description: 'Budget friendly uniform glossy booklet.', priceMultiplier: 0.85 }
    ],
    cornerOptions: ['Standard Square'],
    features: [
      'Industrial strength wire saddle-stitching or spine perfect binding',
      'Full bleed borderless color printing on imported Japanese paper',
      'For complex multi-page files, send directly via WhatsApp'
    ],
    specifications: {
      'Cover Stock': '250-350 GSM Art Card with Thermal Lamination',
      'Inner Stock': '130-170 GSM Gloss/Matte Art Paper',
      'Binding': 'Dual Stainless Steel Wire Saddle Stitch'
    },
    templateAvailable: true
  },
  {
    id: 'prod-gatefold-realestate',
    categoryId: 'brochures',
    name: 'Gate-Fold & Accordion Z-Fold Architectural Brochure',
    tagline: 'Wide panoramic foldouts for real estate townships, architects & resorts',
    basePrice: 999,
    originalPrice: 1450,
    image: 'https://i.pinimg.com/736x/90/15/d7/9015d7bd82c34fabb21d054055aee82c.jpg',
    galleryImages: [
      'https://i.pinimg.com/1200x/f7/44/c6/f744c6c200172e6937ead8bac3afc2f7.jpg'
    ],
    rating: 4.88,
    reviewsCount: 142,
    isBestSeller: false,
    isPopular: false,
    minQuantity: 100,
    defaultQuantity: 250,
    quantityOptions: [100, 250, 500, 1000, 2000],
    sizes: [
      { id: 'gatefold-open-630', name: 'Gatefold 8-Panel (Open 630 x 297 mm)', dimension: 'Folded 210 x 297 mm', priceMultiplier: 1.0 },
      { id: 'accordion-4panel', name: 'Accordion 4-Panel (Open 840 x 210 mm)', dimension: 'Panoramic Spread', priceMultiplier: 1.35 }
    ],
    finishes: [
      { id: 'velvet-300-gold', name: '300 GSM Velvet Matte + Gold Foil', gsm: '300 GSM', description: 'Ultra-luxurious feel for high-value property buyers.', priceMultiplier: 1.0 },
      { id: 'silk-250', name: '250 GSM Silk Coated Art Card', gsm: '250 GSM', description: 'Crisp crease resistance.', priceMultiplier: 0.85 }
    ],
    cornerOptions: ['Standard Square'],
    features: [
      'Panoramic 3D floor plan layout displays',
      'Laser-creased folds to prevent paper fiber cracking',
      'Direct WhatsApp upload for heavy architectural CAD/PDF files'
    ],
    specifications: {
      'Paper': '250 - 300 GSM Premium Board',
      'Folds': 'Double Gate-Fold / 4-Fold Accordion'
    },
    templateAvailable: true
  },

  // 2. PACKAGING BOXES
  {
    id: 'prod-custom-packaging-box',
    categoryId: 'packaging',
    name: 'Custom Printed Tuck-Top Corrugated Mailer Box',
    tagline: 'E-commerce shipping mailers & retail subscription boxes • 1-Day Delivery',
    basePrice: 899,
    originalPrice: 1350,
    image: 'https://i.pinimg.com/736x/55/d7/5b/55d75bcfad0da6b4df44d19c9fe953b8.jpg',
    galleryImages: [
      'https://i.pinimg.com/736x/3a/58/8c/3a588c1ba2affa84c8788fb9b1e44818.jpg',
      'https://i.pinimg.com/736x/42/f5/fb/42f5fb1dd7e4717b3b2718ac44139a3f.jpg',
      'https://i.pinimg.com/1200x/9a/b0/c5/9ab0c5eb69dcde68d501687f2775df40.jpg'
    ],
    rating: 4.95,
    reviewsCount: 290,
    isBestSeller: true,
    isPopular: true,
    minQuantity: 50,
    defaultQuantity: 100,
    quantityOptions: [50, 100, 250, 500, 1000, 2500],
    sizes: [
      { id: 'mailer-small', name: 'Small Mailer (7" x 5" x 2.5")', dimension: '18 x 13 x 6 cm', priceMultiplier: 1.0 },
      { id: 'mailer-medium', name: 'Medium Brand Box (9" x 6" x 3")', dimension: '23 x 15 x 8 cm', priceMultiplier: 1.35 },
      { id: 'mailer-large', name: 'Large Apparel Box (12" x 10" x 4")', dimension: '30 x 25 x 10 cm', priceMultiplier: 1.8 }
    ],
    finishes: [
      { id: 'corrugated-e', name: 'E-Flute White Top Corrugated Board', gsm: '350 GSM + Kraft Flute', description: 'Strong crush-resistant shipping box with vibrant exterior print.', priceMultiplier: 1.0 },
      { id: 'kraft-eco', name: 'Natural Brown Kraft Board 350 GSM', gsm: '350 GSM', description: 'Eco-friendly rustic organic packaging.', priceMultiplier: 0.9 }
    ],
    features: [
      '⚡ One Day Delivery options available in Chh. Sambhajinagar',
      'Full exterior wrap-around printing',
      'Custom box die-cut line and WhatsApp spec support'
    ],
    specifications: {
      'Material': 'E-Flute Corrugated Board / Duplex White Top',
      'Coating': 'Matte / Gloss Water Barrier',
      'Max Load': 'Up to 5 kg payload'
    },
    templateAvailable: true
  },
  {
    id: 'prod-food-gable-box',
    categoryId: 'packaging',
    name: 'Food Grade Gable Sweet Box & Cake Box (with Handle)',
    tagline: 'Grease-proof bakery boxes, sweet boxes & restaurant takeaway packs',
    basePrice: 599,
    originalPrice: 899,
    image: 'https://i.pinimg.com/1200x/40/2d/13/402d13d169defc55bb84b20ebe64a8aa.jpg',
    galleryImages: [
      'https://i.pinimg.com/736x/55/d7/5b/55d75bcfad0da6b4df44d19c9fe953b8.jpg'
    ],
    rating: 4.92,
    reviewsCount: 210,
    isBestSeller: false,
    isPopular: true,
    minQuantity: 100,
    defaultQuantity: 250,
    quantityOptions: [100, 250, 500, 1000, 2500],
    sizes: [
      { id: 'sweet-500g', name: '500 Grams Sweet Box (8" x 5" x 2")', dimension: 'Half KG Box', priceMultiplier: 1.0 },
      { id: 'sweet-1kg', name: '1 KG Premium Sweet Box (10" x 7" x 2.5")', dimension: '1 KG Capacity', priceMultiplier: 1.4 },
      { id: 'cake-half-kg', name: 'Cake Box 8x8x5" with Clear Window', dimension: 'Pastry Box', priceMultiplier: 1.6 }
    ],
    finishes: [
      { id: 'virgin-kraft-oil', name: 'Food Grade ITC Board + Oil Barrier', gsm: '320 GSM', description: 'Certified food contact safe, no chemical smell.', priceMultiplier: 1.0 },
      { id: 'gold-emboss-sweet', name: 'Gold Foil Stamped Festive Board', gsm: '350 GSM', description: 'Traditional metallic celebration design.', priceMultiplier: 1.45 }
    ],
    features: [
      '100% Certified Food Grade virgin paper board',
      'Oil, grease and moisture resistant interior lamination',
      'Easy snap lock bottom with self-locking handle'
    ],
    specifications: {
      'Board': 'ITC Cyber XLT 300-350 GSM',
      'Safety': 'Food Contact Compliant'
    },
    templateAvailable: true
  },
  {
    id: 'prod-mono-carton-pharma',
    categoryId: 'packaging',
    name: 'Cosmetic & Pharma Mono-Carton Product Box',
    tagline: 'Lightweight retail folding cartons for bottles, jars, tubes & tinctures',
    basePrice: 449,
    originalPrice: 650,
    image: 'https://i.pinimg.com/736x/3a/58/8c/3a588c1ba2affa84c8788fb9b1e44818.jpg',
    galleryImages: [
      'https://i.pinimg.com/1200x/40/2d/13/402d13d169defc55bb84b20ebe64a8aa.jpg'
    ],
    rating: 4.87,
    reviewsCount: 168,
    isBestSeller: false,
    isPopular: false,
    minQuantity: 250,
    defaultQuantity: 500,
    quantityOptions: [250, 500, 1000, 2500, 5000, 10000],
    sizes: [
      { id: 'bottle-box-30ml', name: '30ml Serum / Dropper Box (35x35x90mm)', dimension: 'Dropper Bottle', priceMultiplier: 1.0 },
      { id: 'bottle-box-100ml', name: '100ml Spray / Syrup Box (45x45x140mm)', dimension: 'Standard Bottle', priceMultiplier: 1.3 },
      { id: 'jar-cream-box', name: '50g Cream Jar Box (65x65x50mm)', dimension: 'Cosmetic Jar', priceMultiplier: 1.25 }
    ],
    finishes: [
      { id: 'fbb-board-matt', name: 'FBB (Folding Box Board) 300 GSM + Soft Matte', gsm: '300 GSM FBB', description: 'Pure white interior & exterior with crisp fold edges.', priceMultiplier: 1.0 },
      { id: 'metallic-silver-board', name: 'Met-PET Silver Mirror Substrate', gsm: '320 GSM', description: 'High-end holographic reflective cosmetic sheen.', priceMultiplier: 1.7 }
    ],
    features: [
      'Precision automatic gluing & creasing',
      'Supports embossed Braille lettering & security QR codes',
      'Direct WhatsApp assistance for custom die lines'
    ],
    specifications: {
      'Board': '300-350 GSM Bleached Virgin FBB Board',
      'Finishing': 'Matte / Gloss / Spot UV / Foil'
    },
    templateAvailable: true
  },

  // 3. DIE CUT STICKER SHEETS
  {
    id: 'prod-die-cut-sticker-sheet',
    categoryId: 'stickers',
    name: '12x18" Custom Shape Die Cut Sticker Sheet (₹79/Sheet)',
    tagline: 'Vibrant waterproof kiss-cut vinyl sticker sheets with custom shape contouring',
    basePrice: 79,
    originalPrice: 120,
    image: 'https://i.pinimg.com/1200x/72/c7/ec/72c7ec157835f3350324004879afa7b2.jpg',
    galleryImages: [
      'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80'
    ],
    rating: 4.98,
    reviewsCount: 520,
    isBestSeller: true,
    isPopular: true,
    minQuantity: 10,
    defaultQuantity: 25,
    quantityOptions: [10, 25, 50, 100, 250, 500, 1000],
    sizes: [
      { id: 'sheet-12x18', name: '12" x 18" Full Sheet (305 x 457 mm)', dimension: '12x18 inch Sheet', priceMultiplier: 1.0 },
      { id: 'sheet-13x19', name: '13" x 19" Super A3 Sheet', dimension: '13x19 inch Sheet', priceMultiplier: 1.2 }
    ],
    finishes: [
      { id: 'gloss-vinyl', name: 'Gloss Waterproof Vinyl (₹79/sheet)', gsm: '120 Micron', description: 'Weatherproof, UV-resistant permanent adhesive gloss vinyl.', priceMultiplier: 1.0 },
      { id: 'matte-vinyl', name: 'Silk Matte Vinyl', gsm: '120 Micron', description: 'Non-glare luxury finish, scratch resistant.', priceMultiplier: 1.1 },
      { id: 'clear-transparent', name: 'Crystal Clear Transparent Vinyl', gsm: '130 Micron', description: 'See-through background for jars, bottles, and glass windows.', priceMultiplier: 1.35 },
      { id: 'holographic-laser', name: 'Holographic Rainbow Foil', gsm: '150 Micron', description: 'Shimmering iridescent multi-color spectrum highlights.', priceMultiplier: 1.8 }
    ],
    features: [
      '🔥 Special Rate: Only ₹79 per 12x18" sheet',
      'Precision optical contour kiss-cutting to any custom shape',
      'Fit 20 to 60+ logos/stickers per sheet',
      '⚡ 1-Day Delivery & Express Dispatch'
    ],
    specifications: {
      'Sheet Size': '12 x 18 inches (305 x 457 mm)',
      'Adhesive': 'High-tack permanent acrylic adhesive',
      'Waterproof': '100% Washable, Scratch-Proof & Sun-Resistant'
    },
    templateAvailable: true
  },

  // 4. BUSINESS CARDS
  {
    id: 'prod-standard-biz-card',
    categoryId: 'visiting-cards',
    name: 'Velvet Soft Touch Business Cards',
    tagline: 'Premium 350-400 GSM luxury cards with raised gold foil & spot UV',
    basePrice: 249,
    originalPrice: 399,
    image: 'https://i.pinimg.com/736x/a7/56/49/a75649ec0f6fffd015dc90e0b0f0a844.jpg',
    galleryImages: [
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1616469829941-c7200edec809?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=80'
    ],
    rating: 4.9,
    reviewsCount: 460,
    isBestSeller: true,
    isPopular: true,
    minQuantity: 100,
    defaultQuantity: 100,
    quantityOptions: [100, 250, 500, 1000, 2000, 5000],
    sizes: [
      { id: 'std-in', name: 'Standard (3.5" x 2.0")', dimension: '89mm x 51mm', priceMultiplier: 1.0 },
      { id: 'sq-in', name: 'Square (2.5" x 2.5")', dimension: '65mm x 65mm', priceMultiplier: 1.15 },
      { id: 'euro-in', name: 'Euro Slim (3.3" x 2.1")', dimension: '85mm x 55mm', priceMultiplier: 1.1 }
    ],
    finishes: [
      { id: 'velvet-400', name: 'Velvet Soft Touch Matte', gsm: '400 GSM', description: 'Ultra-luxurious velvety tactile feel with non-tear water barrier.', priceMultiplier: 1.0 },
      { id: 'gold-foil', name: 'Raised Metallic Gold Foil', gsm: '400 GSM', description: 'Striking metallic highlights on logo and text accents.', priceMultiplier: 1.5 },
      { id: 'matte-350', name: 'Standard Matte Finish', gsm: '350 GSM', description: 'Crisp corporate finish with anti-glare lamination.', priceMultiplier: 0.9 }
    ],
    cornerOptions: ['Standard Square', 'Rounded (6mm)'],
    features: [
      'Ultra-thick 350-400 GSM imported virgin art board',
      'Double-sided HD offset printing with rich black saturation',
      'Precision edge cutting with zero burrs',
      'Delivered in heavy-duty clear acrylic storage case'
    ],
    specifications: {
      'Paper Weight': '350 - 400 GSM Art Board',
      'Turnaround': '24-48 Business Hours',
      'Bleed Size': '92mm x 54mm (2mm bleed)'
    },
    templateAvailable: true
  },

  // 5. MARKETING FLYERS
  {
    id: 'prod-glossy-flyers',
    categoryId: 'flyers',
    name: 'High-Impact Promotional Flyers',
    tagline: 'Vibrant glossy 170 GSM & matte 250 GSM flyers for events & door drops',
    basePrice: 499,
    originalPrice: 750,
    image: 'https://i.pinimg.com/736x/c3/e3/fb/c3e3fb9111709c6c97fdfcd3a5db5a6b.jpg',
    galleryImages: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=80'
    ],
    rating: 4.85,
    reviewsCount: 310,
    isBestSeller: true,
    isPopular: true,
    minQuantity: 250,
    defaultQuantity: 500,
    quantityOptions: [250, 500, 1000, 2500, 5000, 10000],
    sizes: [
      { id: 'a5', name: 'A5 Standard (148 x 210 mm)', dimension: '5.8" x 8.3"', priceMultiplier: 1.0 },
      { id: 'a4', name: 'A4 Large (210 x 297 mm)', dimension: '8.3" x 11.7"', priceMultiplier: 1.6 },
      { id: 'dl', name: 'DL Pamphlet (99 x 210 mm)', dimension: '3.9" x 8.3"', priceMultiplier: 0.85 }
    ],
    finishes: [
      { id: 'gloss-170', name: 'Gloss Art Paper 170 GSM', gsm: '170 GSM', description: 'Vibrant shine, perfect for high volume hand-outs and drops.', priceMultiplier: 1.0 },
      { id: 'matte-250', name: 'Heavy Silk Card 250 GSM', gsm: '250 GSM', description: 'Sturdy card stock with elegant non-glare finish.', priceMultiplier: 1.28 }
    ],
    cornerOptions: ['Standard Square'],
    features: [
      'Crystal-clear 2400 DPI offset printing',
      'Single or double-sided printing option',
      'Eco-friendly vegetable-based inks'
    ],
    specifications: {
      'Paper Weight': '170 - 250 GSM Art Paper',
      'Turnaround': '1 to 2 Working Days'
    },
    templateAvailable: true
  },

  // 6. FLEX BANNERS & STANDEES
  {
    id: 'prod-vinyl-banner',
    categoryId: 'banners',
    name: 'Star Flex Outdoor Banner & Roll-Up Standee',
    tagline: 'Heavy-duty weather-resistant outdoor banners & aluminum pull-up standees',
    basePrice: 599,
    originalPrice: 950,
    image: 'https://i.pinimg.com/736x/08/d5/a9/08d5a9b44fab80be862cfdd636c77a6e.jpg',
    galleryImages: [
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=900&q=80'
    ],
    rating: 4.9,
    reviewsCount: 220,
    isBestSeller: true,
    isPopular: true,
    minQuantity: 1,
    defaultQuantity: 1,
    quantityOptions: [1, 2, 5, 10, 20, 50],
    sizes: [
      { id: 'banner-6x3', name: '6 ft x 3 ft (Medium Display)', dimension: '180cm x 90cm', priceMultiplier: 1.0 },
      { id: 'standee-roll', name: 'Roll-up Standee (2.5ft x 6ft) + Aluminum Stand', dimension: '80cm x 180cm', priceMultiplier: 1.45 },
      { id: 'banner-8x4', name: '8 ft x 4 ft (Large Backdrop)', dimension: '240cm x 120cm', priceMultiplier: 1.6 }
    ],
    finishes: [
      { id: 'flex-banner', name: 'Star Flex Heavy Duty', gsm: '440 GSM', description: 'Tear-resistant PVC vinyl banner with brass eyelets and heat welded edges.', priceMultiplier: 1.0 },
      { id: 'non-tear-standee', name: 'Non-Tearable Matte Film (Standee)', gsm: '300 Micron', description: 'Curl-free photographic matte film for aluminum roll-up stands.', priceMultiplier: 1.3 }
    ],
    features: [
      'UV-resistant fade-proof inks guaranteed for 2+ years outdoor',
      'Reinforced welded perimeter borders with metal brass eyelets',
      'Standees include luxury padded carry bag'
    ],
    specifications: {
      'Material': '440 GSM Star Flex / Non-tearable PET Film',
      'Finishing': 'Welded Hemming + Metal Eyelets or Aluminum Base',
      'Usage': 'Indoor & Outdoor'
    },
    templateAvailable: true
  },

  // 7. ID CARDS & LANYARDS
  {
    id: 'prod-id-cards',
    categoryId: 'id-cards',
    name: 'PVC Employee ID Cards & Sublimation Lanyards',
    tagline: 'Smart RFID plastic cards and 20mm satin multi-color lanyards with dog hook',
    basePrice: 199,
    originalPrice: 320,
    image: 'https://i.pinimg.com/736x/1c/30/5f/1c305f62e62424063541afd2fba7cfce.jpg',
    galleryImages: [
      'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=900&q=80'
    ],
    rating: 4.88,
    reviewsCount: 195,
    isBestSeller: false,
    isPopular: true,
    minQuantity: 10,
    defaultQuantity: 25,
    quantityOptions: [10, 25, 50, 100, 250, 500],
    sizes: [
      { id: 'cr80-std', name: 'CR80 Standard (85.6 x 54 mm)', dimension: 'ATM Card Size', priceMultiplier: 1.0 },
      { id: 'cr80-lanyard-set', name: 'ID Card + 20mm Satin Lanyard + Holder', dimension: 'Full Executive Set', priceMultiplier: 1.8 }
    ],
    finishes: [
      { id: 'pvc-gloss', name: 'HD Thermal PVC Gloss', gsm: '760 Micron (30 Mil)', description: 'Rigid durable PVC card with scratch resistant gloss overlay.', priceMultiplier: 1.0 },
      { id: 'rfid-smart', name: 'RFID 13.56MHz Contactless Smart Card', gsm: '800 Micron', description: 'Built-in RFID chip for biometric attendance and door access.', priceMultiplier: 1.6 }
    ],
    cornerOptions: ['Rounded (6mm)'],
    features: [
      'True HD thermal retransfer printing',
      'Fade-proof and waterproof solid PVC',
      'Barcode / QR code & magnetic stripe encoding supported'
    ],
    specifications: {
      'Card Thickness': '0.76mm (30 mil) standard CR80',
      'Lanyard Width': '16mm or 20mm premium satin'
    },
    templateAvailable: true
  },

  // 8. LETTERHEADS & STATIONERY
  {
    id: 'prod-executive-letterhead',
    categoryId: 'letterheads',
    name: 'Executive Bond Letterheads & Envelopes',
    tagline: 'Alabaster & 100 GSM DO bond stationery for official corporate correspondence',
    basePrice: 399,
    originalPrice: 599,
    image: 'https://i.pinimg.com/736x/61/63/d6/6163d61c7ad96f17dc96f7cb51994e9d.jpg',
    galleryImages: [
      'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=900&q=80'
    ],
    rating: 4.9,
    reviewsCount: 160,
    isBestSeller: false,
    isPopular: true,
    minQuantity: 100,
    defaultQuantity: 500,
    quantityOptions: [100, 250, 500, 1000, 2500],
    sizes: [
      { id: 'a4-letterhead', name: 'A4 Standard (210 x 297 mm)', dimension: '21 x 29.7 cm', priceMultiplier: 1.0 },
      { id: 'letterhead-envelope-combo', name: 'A4 Letterhead + Matching #10 Envelopes', dimension: 'Combo Kit', priceMultiplier: 1.7 }
    ],
    finishes: [
      { id: 'bond-100', name: 'Executive Bond 100 GSM', gsm: '100 GSM', description: 'Crisp bright white smooth bond paper compatible with all laser/inkjet printers.', priceMultiplier: 1.0 },
      { id: 'alabaster-120', name: 'Superfine Alabaster 120 GSM', gsm: '120 GSM', description: 'Ultra-luxurious textured natural white paper.', priceMultiplier: 1.35 }
    ],
    cornerOptions: ['Standard Square'],
    features: [
      'Laser & Inkjet printer guaranteed non-jamming',
      'Razor sharp micro-typography reproduction',
      'Matching peel-and-seal window and non-window envelopes available'
    ],
    specifications: {
      'Paper': '100 GSM DO Bond / 120 GSM Alabaster',
      'Size': 'A4 (210 x 297 mm)'
    },
    templateAvailable: true
  },

  // 9. CUSTOM MERCH & COFFEE MUGS
  {
    id: 'prod-custom-mug',
    categoryId: 'custom-merch',
    name: 'Custom Ceramic Coffee Mugs & Magic Mugs',
    tagline: 'High gloss 330ml ceramic mugs with wrap-around full color sublimation printing',
    basePrice: 199,
    originalPrice: 349,
    image: 'https://i.pinimg.com/1200x/e8/bc/cb/e8bccba6d729e206049e49924e7b87a7.jpg',
    galleryImages: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80'
    ],
    rating: 4.92,
    reviewsCount: 280,
    isBestSeller: true,
    isPopular: true,
    minQuantity: 1,
    defaultQuantity: 6,
    quantityOptions: [1, 6, 12, 24, 50, 100, 250],
    sizes: [
      { id: 'mug-11oz', name: '11 oz Standard White Ceramic (330ml)', dimension: '80mm Dia x 95mm Height', priceMultiplier: 1.0 },
      { id: 'mug-magic-11oz', name: '11 oz Magic Heat-Color Changing Black Mug', dimension: 'Reveals photo with hot coffee', priceMultiplier: 1.45 },
      { id: 'bottle-sipper', name: 'Stainless Steel Temperature Display Sipper (500ml)', dimension: 'Insulated Bottle', priceMultiplier: 2.1 }
    ],
    finishes: [
      { id: 'gloss-ceramic', name: 'Gloss White Premium Ceramic', gsm: 'AAA Grade', description: 'Dishwasher and microwave safe high-gloss coating.', priceMultiplier: 1.0 },
      { id: 'matte-black', name: 'Matte Black Exterior / White Interior', gsm: 'Luxury Finish', description: 'Sleek modern matte look.', priceMultiplier: 1.25 }
    ],
    features: [
      '100% Dishwasher and microwave safe',
      'Edge-to-edge vibrant dye sublimation print',
      'Packed individually in protective corrugated gift box'
    ],
    specifications: {
      'Capacity': '330 ml (11 oz)',
      'Material': 'AAA Grade Ceramic'
    },
    templateAvailable: true
  },

  // 10. CORPORATE POLO APPAREL
  {
    id: 'prod-corporate-polo',
    categoryId: 'apparel',
    name: 'Custom Embroidered & Printed Polo T-Shirts',
    tagline: '100% Combed Cotton 220 GSM bio-washed polo t-shirts with embroidered logo',
    basePrice: 349,
    originalPrice: 599,
    image: 'https://i.pinimg.com/1200x/98/a4/b0/98a4b046560ce4b681bbd5c9e3daa18b.jpg',
    galleryImages: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'
    ],
    rating: 4.88,
    reviewsCount: 175,
    isBestSeller: false,
    isPopular: true,
    minQuantity: 5,
    defaultQuantity: 10,
    quantityOptions: [5, 10, 25, 50, 100, 250],
    sizes: [
      { id: 'polo-m', name: 'Size M (Chest 38-40")', dimension: 'Medium', priceMultiplier: 1.0 },
      { id: 'polo-l', name: 'Size L (Chest 40-42")', dimension: 'Large', priceMultiplier: 1.0 },
      { id: 'polo-xl', name: 'Size XL (Chest 42-44")', dimension: 'Extra Large', priceMultiplier: 1.0 },
      { id: 'polo-xxl', name: 'Size XXL (Chest 44-46")', dimension: 'Double XL', priceMultiplier: 1.1 }
    ],
    finishes: [
      { id: 'embroidery-chest', name: 'High-Density Thread Embroidery', gsm: '220 GSM Matty', description: 'Premium Japanese Tajima embroidery on left chest.', priceMultiplier: 1.0 },
      { id: 'dtf-full-color', name: 'DTF Full Color Screen Transfer', gsm: '220 GSM', description: 'Vivid multi-color photographic prints front & back.', priceMultiplier: 1.15 }
    ],
    features: [
      '100% Combed ringspun cotton pique matty fabric',
      'Pre-shrunk, bio-washed, zero color bleeding',
      'Reinforced collar ribs and dual button placket'
    ],
    specifications: {
      'Fabric': '220 GSM 100% Combed Cotton Matty',
      'Colors Available': 'Black, Navy Blue, White, Crimson Red, Royal Blue'
    },
    templateAvailable: true
  },

  // 11. KRAFT & LUXURY PAPER BAGS
  {
    id: 'prod-kraft-paper-bag',
    categoryId: 'paper-bags',
    name: 'Custom Printed Kraft & Retail Carry Bags',
    tagline: 'Eco-friendly brown kraft & bleached white luxury retail shopping bags',
    basePrice: 19,
    originalPrice: 35,
    image: 'https://i.pinimg.com/1200x/1d/4d/42/1d4d42be124044f803ec36479559be53.jpg',
    galleryImages: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80'
    ],
    rating: 4.9,
    reviewsCount: 140,
    isBestSeller: false,
    isPopular: true,
    minQuantity: 100,
    defaultQuantity: 250,
    quantityOptions: [100, 250, 500, 1000, 2500, 5000],
    sizes: [
      { id: 'bag-medium', name: 'Medium Retail (8" x 10" x 4")', dimension: '20 x 25 x 10 cm', priceMultiplier: 1.0 },
      { id: 'bag-large', name: 'Large Boutique (12" x 16" x 5")', dimension: '30 x 40 x 12 cm', priceMultiplier: 1.45 }
    ],
    finishes: [
      { id: 'kraft-brown', name: 'Virgin Natural Brown Kraft 150 GSM', gsm: '150 GSM', description: '100% Biodegradable with twisted paper cord handle.', priceMultiplier: 1.0 },
      { id: 'art-paper-laminated', name: 'Luxury White Art Board + Matt Lam', gsm: '250 GSM', description: 'Boutique quality with satin ribbon handle and foil stamping.', priceMultiplier: 1.7 }
    ],
    features: [
      'Heavy-duty bottom reinforcement cardboard insert',
      'Supports up to 6 kg payload',
      'Full exterior branding with eco-friendly water-based inks'
    ],
    specifications: {
      'Handle': 'Twisted Paper Cord / Cotton Rope / Ribbon',
      'Material': '150 GSM Kraft / 250 GSM Art Board'
    },
    templateAvailable: true
  },

  // 13. PROJECT FILES (Changed from PP Files)
  {
    id: 'prod-custom-project-files',
    categoryId: 'project-files',
    name: 'Custom Printed Project Report Files & Strip Folders',
    tagline: 'High-durability laminated project files, college submission folders & spring clips',
    basePrice: 45,
    originalPrice: 75,
    image: 'https://i.pinimg.com/736x/55/d7/5b/55d75bcfad0da6b4df44d19c9fe953b8.jpg',
    galleryImages: [
      'https://i.pinimg.com/736x/3a/58/8c/3a588c1ba2affa84c8788fb9b1e44818.jpg',
      'https://i.pinimg.com/1200x/40/2d/13/402d13d169defc55bb84b20ebe64a8aa.jpg'
    ],
    rating: 4.9,
    reviewsCount: 148,
    isBestSeller: true,
    isPopular: true,
    minQuantity: 50,
    defaultQuantity: 100,
    quantityOptions: [50, 100, 200, 500, 1000],
    sizes: [
      { id: 'a4-project-file', name: 'A4 Standard Report File (220 x 310 mm)', dimension: 'Fits up to 100 A4 sheets', priceMultiplier: 1.0 },
      { id: 'fs-project-file', name: 'Legal / Foolscap File (235 x 350 mm)', dimension: 'Fits up to 150 Legal sheets', priceMultiplier: 1.25 }
    ],
    finishes: [
      { id: 'gloss-lam-project', name: '350 GSM Art Board + Gloss Thermal Lamination', gsm: '350 GSM', description: 'Vibrant glossy front & back cover with heavy duty 2-hole spring clip.', priceMultiplier: 1.0 },
      { id: 'matt-lam-project', name: '350 GSM Velvet Matt Lamination', gsm: '350 GSM', description: 'Non-scratch corporate matte finish with inner pocket.', priceMultiplier: 1.15 }
    ],
    features: [
      '⚡ Fast 1-Day dispatch across Maharashtra',
      'Heavy-duty stainless steel spring mechanism or cobra clip',
      'Internal transparent business card slot & document pouch',
      'Custom college, company & architecture project branding'
    ],
    specifications: {
      'Board Quality': '350 GSM Virgin Cardboard',
      'Clip Mechanism': 'Stainless Steel 2-Prong Spring / Cobra Clip',
      'Capacity': '50 - 150 Sheets'
    },
    templateAvailable: true
  },

  // 14. PAPER BOARD FILES
  {
    id: 'prod-heavy-paper-board-files',
    categoryId: 'paper-board-files',
    name: 'Executive Calico Pasted Paper Board Files',
    tagline: 'Heavy 450-600 GSM duplex rigid files with cloth calico spine reinforcement',
    basePrice: 65,
    originalPrice: 95,
    image: 'https://i.pinimg.com/1200x/40/2d/13/402d13d169defc55bb84b20ebe64a8aa.jpg',
    galleryImages: [
      'https://i.pinimg.com/736x/55/d7/5b/55d75bcfad0da6b4df44d19c9fe953b8.jpg'
    ],
    rating: 4.88,
    reviewsCount: 112,
    isBestSeller: true,
    isPopular: false,
    minQuantity: 50,
    defaultQuantity: 100,
    quantityOptions: [50, 100, 200, 500, 1000],
    sizes: [
      { id: 'board-a4', name: 'A4 Board File (230 x 315 mm)', dimension: 'Standard Executive File', priceMultiplier: 1.0 },
      { id: 'board-legal', name: 'Legal / Ledger Board (240 x 360 mm)', dimension: 'Court & Office Document Size', priceMultiplier: 1.2 }
    ],
    finishes: [
      { id: 'calico-cloth-spine', name: '450 GSM Hard Board + Reinforced Cloth Spine', gsm: '450 GSM', description: 'Tear-proof fabric spine for 10+ years archival life.', priceMultiplier: 1.0 },
      { id: 'laminated-hard-box', name: '600 GSM Extra Heavy Pasted Board', gsm: '600 GSM', description: 'Rigid protective folder with steel lever arch clip.', priceMultiplier: 1.4 }
    ],
    features: [
      'Reinforced calico fabric spine preventing edge splits',
      'Multi-color screen or offset printed cover',
      'Heavy-duty lever arch or lace fastener fitting'
    ],
    specifications: {
      'Board Thickness': '1.8mm - 2.5mm Straw/Duplex Board',
      'Spine Reinforcement': 'Cotton Calico Cloth Strip'
    },
    templateAvailable: true
  },

  // 15. ENVELOPES
  {
    id: 'prod-custom-envelopes',
    categoryId: 'envelopes',
    name: 'Custom Printed Commercial & Letter Envelopes',
    tagline: '#10 Business, Window, 9x4" & A4 Document Envelopes with Peel-and-Seal Strip',
    basePrice: 199,
    originalPrice: 320,
    image: 'https://i.pinimg.com/736x/61/63/d6/6163d61c7ad96f17dc96f7cb51994e9d.jpg',
    galleryImages: [
      'https://i.pinimg.com/736x/69/09/86/690986cd9d97f35e6251a56a9acc0cb1.jpg'
    ],
    rating: 4.92,
    reviewsCount: 230,
    isBestSeller: true,
    isPopular: true,
    minQuantity: 100,
    defaultQuantity: 500,
    quantityOptions: [100, 250, 500, 1000, 2500, 5000],
    sizes: [
      { id: 'env-9x4', name: '9.5" x 4.25" Standard Office (#10)', dimension: '241 x 108 mm', priceMultiplier: 1.0 },
      { id: 'env-a4-cloth', name: '10" x 12" A4 Document Folder Envelope', dimension: '254 x 305 mm', priceMultiplier: 1.8 },
      { id: 'env-square', name: '7" x 7" Square Invitation Envelope', dimension: '178 x 178 mm', priceMultiplier: 1.3 }
    ],
    finishes: [
      { id: 'env-100-bond', name: '100 GSM Super White Bond + Peel & Seal', gsm: '100 GSM', description: 'Self-adhesive release liner strip for instant clean seal.', priceMultiplier: 1.0 },
      { id: 'env-120-executive', name: '120 GSM Royal DO Bond / Alabaster', gsm: '120 GSM', description: 'Luxe fine-grain paper for top executive stationery.', priceMultiplier: 1.3 }
    ],
    features: [
      'Crisp full-color offset flap and face printing',
      'Peel-and-Seal adhesive strip - no water/glue needed',
      'Optional clear address window available'
    ],
    specifications: {
      'Paper Weight': '100 - 120 GSM Imported Bond',
      'Adhesive': 'Pressure-Sensitive Peel & Stick Strip'
    },
    templateAvailable: true
  },

  // 16. INVITATION CARDS
  {
    id: 'prod-wedding-invitations',
    categoryId: 'invitation-cards',
    name: 'Luxury Wedding & Ceremony Invitation Cards',
    tagline: 'Multi-layer wedding cards, metallic hot foil stamping, embossing & laser cutting',
    basePrice: 599,
    originalPrice: 899,
    image: 'https://i.pinimg.com/736x/e1/35/8d/e1358d4dbbecea602cb7d686885a9b86.jpg',
    galleryImages: [
      'https://i.pinimg.com/736x/a0/f2/48/a0f248a045d206198648621d77eb6426.jpg'
    ],
    rating: 4.98,
    reviewsCount: 340,
    isBestSeller: true,
    isPopular: true,
    minQuantity: 50,
    defaultQuantity: 100,
    quantityOptions: [50, 100, 200, 300, 500, 1000],
    sizes: [
      { id: 'inv-7x5', name: '7" x 5" Royal Invite (178 x 127 mm)', dimension: 'With matching designer envelope', priceMultiplier: 1.0 },
      { id: 'inv-8x6-gatefold', name: '8" x 6" Gatefold Box Card (203 x 152 mm)', dimension: 'Includes inserts + gold tassel', priceMultiplier: 1.6 }
    ],
    finishes: [
      { id: 'inv-foil-emboss', name: '350 GSM Metallic Card + Gold Foil Stamping', gsm: '350 GSM', description: 'Gleaming real metallic foil on Sanskrit shlokas & monogram.', priceMultiplier: 1.0 },
      { id: 'inv-acrylic-clear', name: '2mm Crystal Clear Laser Engraved Acrylic', gsm: '2mm Cast Acrylic', description: 'Glass-like ultra luxury invitation card.', priceMultiplier: 2.2 }
    ],
    features: [
      'Custom Marathi, Hindi, English wedding typography',
      'Free matching decorative envelopes included',
      'Direct WhatsApp design proofing within 2 hours'
    ],
    specifications: {
      'Card Stock': '350 GSM Handmade / Metallic Sheet / Cast Acrylic',
      'Finishing': 'Hot Stamping Foil / Blind Embossing / Die-Cut Window'
    },
    templateAvailable: true
  }
];

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    title1: 'Premium Quality',
    title2: 'Brochure',
    highlight: 'Printing',
    subtitle: 'Tri-fold & Bi-Fold multi-panel corporate & medical brochures. Fast turnaround and crisp 2400 DPI fidelity.',
    buttonText: 'Order Brochures',
    quoteButtonText: 'Quick Quote',
    theme: 'crimson',
    tag: '1-Day Delivery in Chh. Sambhajinagar',
    stats: 'Fast turnaround • 2400 DPI fidelity',
    badge: 'Same Day Dispatch',
    image: 'https://i.pinimg.com/1200x/f7/44/c6/f744c6c200172e6937ead8bac3afc2f7.jpg',
    typeImage: 'https://i.pinimg.com/736x/84/b5/50/84b55044919a7aac911d7d4269cc13b2.jpg',
    typeLabel: 'Brochures & Catalogs',
    productId: 'prod-premium-brochure',
    categoryLink: '/products?category=brochures'
  },
  {
    id: 3,
    title1: 'Custom Shape',
    title2: 'Die Cut Stickers',
    highlight: '₹79/- per Sheet',
    subtitle: '12x18 inch waterproof vinyl sheets. Precision contour kiss-cutting for logos, jars, packaging & events.',
    buttonText: 'Order ₹79 Sheets',
    quoteButtonText: 'Bulk Enquiry',
    theme: 'crimson',
    tag: '12x18" Sheet at ₹79/-',
    stats: 'Vibrant UV Inks • Waterproof Vinyl',
    badge: 'Best Value',
    image: 'https://i.pinimg.com/1200x/72/c7/ec/72c7ec157835f3350324004879afa7b2.jpg',
    typeImage: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=400&q=80',
    typeLabel: 'Die-Cut Stickers (₹79)',
    productId: 'prod-die-cut-sticker-sheet',
    categoryLink: '/products?category=stickers'
  },
  {
    id: 2,
    title1: 'Make Your Product Stand Out',
    title2: 'Custom Packaging',
    highlight: 'Boxes & Food Boxes',
    subtitle: 'Custom branded corrugated shipping boxes, food takeaway boxes & luxury rigid packaging solutions.',
    buttonText: 'Explore Packaging',
    quoteButtonText: 'Custom Box Size',
    theme: 'dark',
    tag: 'Heavy Duty & Food Grade',
    stats: 'Shop No. 1, Sushila Arcade, Motikaranja',
    badge: 'Proprint Packaging',
    image: 'https://i.pinimg.com/736x/55/d7/5b/55d75bcfad0da6b4df44d19c9fe953b8.jpg',
    typeImage: 'https://i.pinimg.com/736x/3a/58/8c/3a588c1ba2affa84c8788fb9b1e44818.jpg',
    typeLabel: 'Packaging & Food Boxes',
    productId: 'prod-custom-packaging-box',
    categoryLink: '/products?category=packaging'
  }
];
