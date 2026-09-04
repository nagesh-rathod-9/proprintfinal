export interface ServiceItem {
  id: string;
  name: string;
  category: 'branding' | 'printing';
  tagline: string;
  description: string;
  turnaround: string;
  minOrder: string;
  iconName: string;
  badge?: string;
}

export const PROPRINT_SERVICES: ServiceItem[] = [
  // --- Design & Branding & Media (Top of visiting card) ---
  {
    id: 'graphic-design',
    name: 'Graphic Design',
    category: 'branding',
    tagline: 'Brand Identity & Pre-Press Artwork',
    description: 'Logo creation, brand style guides, marketing collateral, vector conversion & pre-press color-calibrated layout design.',
    turnaround: '24 - 48 Hours',
    minOrder: '1 Concept',
    iconName: 'Palette',
    badge: 'Design Desk'
  },
  {
    id: 'onsite-branding',
    name: 'Onsite Branding',
    category: 'branding',
    tagline: 'Retail Shop Facades & Showroom Graphics',
    description: 'Complete store facade branding, 3D acrylic LED channel letters, vinyl frosting, in-store display pillars & retail fit-outs.',
    turnaround: '2 - 4 Days',
    minOrder: 'Custom Site',
    iconName: 'Store',
    badge: 'Installation'
  },
  {
    id: 'wedding-branding',
    name: 'Wedding Branding',
    category: 'branding',
    tagline: 'Luxury Invitations & Event Stationary',
    description: 'Bespoke wedding card suites, laser-cut acrylic invites, welcome standees, gold-foil favor boxes & personalized guest stationary.',
    turnaround: '3 - 5 Days',
    minOrder: '50 Sets',
    iconName: 'Heart',
    badge: 'Luxury'
  },
  {
    id: 'media-radio-hoarding',
    name: 'Media - Radio - Hoarding',
    category: 'branding',
    tagline: 'Outdoor Billboards & Transit Ads',
    description: 'Prime outdoor highway hoarding displays, gantry billboards, city transit bus branding & local FM radio commercial campaigns.',
    turnaround: 'Custom Schedule',
    minOrder: '1 Location',
    iconName: 'Radio',
    badge: 'Outdoor Media'
  },
  {
    id: 'corporate-events',
    name: 'Corporate Events',
    category: 'branding',
    tagline: 'Conference Backdrops & Delegate Kits',
    description: 'High-impact conference backdrops, stage banners, satin lanyards with RFID badges, podium signage & corporate souvenir kits.',
    turnaround: '24 - 48 Hours',
    minOrder: '25 Kits',
    iconName: 'Briefcase',
    badge: 'B2B Priority'
  },
  {
    id: 'brand-activations',
    name: 'Brand Activations',
    category: 'branding',
    tagline: 'Promotional Kiosks & Pop-Up Canopies',
    description: 'Custom pop-up promotion canopies, sampling booth counters, portable roll-up standees, promotional flags & roadshow setup.',
    turnaround: '2 - 3 Days',
    minOrder: '1 Unit',
    iconName: 'Sparkles',
    badge: 'Promo Kits'
  },

  // --- Printing & Packaging (Bottom grid of visiting card) ---
  {
    id: 'digital-printing',
    name: 'Digital Printing',
    category: 'printing',
    tagline: 'Fast 24-Hour Short Run Color Prints',
    description: 'High-definition digital press output for instant certificates, menu cards, personalized variable data & low-quantity flyers.',
    turnaround: 'Same Day / 24h',
    minOrder: '10 Sheets',
    iconName: 'Printer',
    badge: 'Express'
  },
  {
    id: 'offset-printing',
    name: 'Offset Printing',
    category: 'printing',
    tagline: 'High-Volume Commercial Press Runs',
    description: 'Heavy-duty 4-color offset press runs for cost-effective visiting cards, multi-page company brochures, product catalogs & books.',
    turnaround: '2 - 3 Days',
    minOrder: '500 Units',
    iconName: 'Layers',
    badge: 'Bulk Value'
  },
  {
    id: 'screen-printing',
    name: 'Screen Printing',
    category: 'printing',
    tagline: 'Vibrant Spot Colors on Special Substrates',
    description: 'Rich opaque ink screen printing for specialty paper, textile canvas, non-woven bags, PVC folders & metallic wedding cards.',
    turnaround: '2 - 3 Days',
    minOrder: '100 Units',
    iconName: 'Stamp',
  },
  {
    id: 'office-stationery',
    name: 'Office Stationery',
    category: 'printing',
    tagline: 'Corporate Letterheads, Envelopes & Pads',
    description: 'Executive executive bond letterheads, window envelopes, carbonless duplicate bill books, voucher pads & file folders.',
    turnaround: '1 - 2 Days',
    minOrder: '100 Pcs',
    iconName: 'FileCheck',
  },
  {
    id: 'labels-stickers',
    name: 'Labels / Stickers',
    category: 'printing',
    tagline: 'Custom Product Packaging & Roll Labels',
    description: 'Waterproof vinyl labels, chrome foil stickers, transparent bottle labels, paper price tags & tamper-evident barcode seals.',
    turnaround: '1 - 2 Days',
    minOrder: '100 Pcs',
    iconName: 'Tag',
  },
  {
    id: 'calendar-poster',
    name: 'Calendar / Poster',
    category: 'printing',
    tagline: 'Desk Calendars & Promotional Wall Posters',
    description: 'Spiral-bound corporate desk calendars, glossy wall calendars, retail promotional posters & high-density art paper prints.',
    turnaround: '2 - 3 Days',
    minOrder: '50 Pcs',
    iconName: 'Calendar',
  },
  {
    id: 'box-packaging',
    name: 'Box Packaging',
    category: 'printing',
    tagline: 'Custom Corrugated & Mono-Carton Boxes',
    description: 'Rigid luxury gift packaging boxes, e-commerce corrugated mailers, food grade boxes, pharma packaging & product sleeves.',
    turnaround: '3 - 5 Days',
    minOrder: '100 Boxes',
    iconName: 'Package',
    badge: 'Custom Die'
  },
  {
    id: 'die-cut-stickers',
    name: 'Die Cut Stickers',
    category: 'printing',
    tagline: 'Contour-Cut Vinyl Stickers with Peel Back',
    description: 'Precision digital laser die-cut stickers shaped around your exact artwork contours. UV-laminated and weatherproof.',
    turnaround: '24 Hours',
    minOrder: '50 Pcs',
    iconName: 'Scissors',
  },
  {
    id: 'gold-silver-foil',
    name: 'Gold / Silver Foil',
    category: 'printing',
    tagline: 'Metallic Hot Foil Stamping & Raised Spot UV',
    description: 'Luxurious reflective gold, copper, silver & holographic foil stamping for premium visiting cards, certificate seals & box covers.',
    turnaround: '2 - 3 Days',
    minOrder: '100 Pcs',
    iconName: 'Award',
    badge: 'Premium'
  },
  {
    id: 'vinyl-printing',
    name: 'Vinyl Printing',
    category: 'printing',
    tagline: 'Self-Adhesive Cast Vinyl & One-Way Vision',
    description: 'Self-adhesive matte/gloss vinyl prints, frosted glass films, one-way vision window graphics & sunboard mounting.',
    turnaround: '24 Hours',
    minOrder: '10 Sq. Ft.',
    iconName: 'Image',
  },
  {
    id: 'flex-printing',
    name: 'Flex Printing',
    category: 'printing',
    tagline: 'Frontlit & Backlit Weatherproof Banners',
    description: 'Durable eco-solvent flex banners, star flex hoardings, exhibition backdrop banners, backlit glow signage & eyeleted drops.',
    turnaround: 'Same Day / 24h',
    minOrder: '1 Banner',
    iconName: 'Maximize',
  },
  {
    id: 'fabric-printing',
    name: 'Fabric Printing',
    category: 'printing',
    tagline: 'Direct-to-Film & Sublimation on Textiles',
    description: 'Vibrant DTF & sublimation prints on corporate polo t-shirts, promotional caps, canvas tote bags, custom flags & table cloths.',
    turnaround: '2 - 3 Days',
    minOrder: '10 Units',
    iconName: 'Shirt',
  },
];
