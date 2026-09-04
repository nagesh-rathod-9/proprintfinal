export interface PortfolioItem {
  id: string;
  title: string;
  titleMr: string;
  category: 'logo' | 'social' | 'packaging' | 'brochure' | 'outdoor' | 'stationery' | 'branding';
  categoryLabel: string;
  categoryLabelMr: string;
  client: string;
  city: string;
  cityMr: string;
  image: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape';
  description: string;
  descriptionMr: string;
  tags: string[];
  deliverables: string[];
  deliverablesMr: string[];
  badge?: string;
  badgeMr?: string;
}

export const GRAPHIC_DESIGN_WORKS: PortfolioItem[] = [
  {
    id: 'work-1',
    title: 'Maharaja Royal Spices & Foods',
    titleMr: 'महाराजा रॉयल मसाले व फूड्स',
    category: 'packaging',
    categoryLabel: 'Packaging & Pouch Design',
    categoryLabelMr: 'पॅकेजिंग व पाऊच डिझाईन',
    client: 'Maharaja Agro Foods Ltd',
    city: 'Chh. Sambhajinagar',
    cityMr: 'छत्रपती संभाजीनगर',
    image: 'https://i.pinimg.com/736x/97/a5/60/97a56053f14f546f4cc5d187b0d2c115.jpg',
    aspectRatio: 'square',
    description: 'Complete metallic foil pouch packaging series with nutritional typography, custom Devanagari calligraphy logo, and barcode integration.',
    descriptionMr: 'मेटॅलिक फॉइल पाऊच पॅकेजिंग, आकर्षक देवनागरी कॅलिग्राफी लोगो, घटकांची माहिती व बारकोडसह संपूर्ण ब्रँडिंग डिझाईन.',
    tags: ['Metallic Pouch', 'Food Grade', 'Devanagari Calligraphy', 'FSSAI Standard'],
    deliverables: ['Vector Master File (AI)', 'High-Res PDF for Flexo Print', '3D Photorealistic Pouch Mockups'],
    deliverablesMr: ['मूळ व्हेक्टर फाईल (AI)', 'हाय-रेझोल्यूशन प्रिंट PDF', '३D रिअलिस्टिक प्रॉडक्ट मॉकअप'],
    badge: 'Trending Packaging',
    badgeMr: 'लोकप्रिय पॅकेजिंग'
  },
  {
    id: 'work-2',
    title: 'Siddhivinayak Healthcare & Multispeciality',
    titleMr: 'सिद्धिविनायक मल्टिस्पेशालिटी हॉस्पिटल',
    category: 'logo',
    categoryLabel: 'Brand Identity & Logo',
    categoryLabelMr: 'ब्रँड ओळख व लोगो डिझाईन',
    client: 'Dr. Rahul Shinde (MD)',
    city: 'Kranti Chowk, Sambhajinagar',
    cityMr: 'क्रांती चौक, संभाजीनगर',
    image: 'https://i.pinimg.com/736x/21/53/1d/21531dbdea9c75d4ac0f98ed3c699191.jpg',
    aspectRatio: 'landscape',
    description: 'Modern medical cross combined with healing leaf vectors, complete corporate brand guidelines, prescription pad & visiting card layout.',
    descriptionMr: 'आधुनिक मेडिकल क्रॉस व पानांचे सुबक संयोजन, अधिकृत प्रिस्क्रिप्शन पॅड, आयडी कार्ड्स व व्हिजिटिंग कार्ड डिझाईन.',
    tags: ['Medical Iconography', 'Golden Ratio', 'Hospital Collateral', 'Stationery Suite'],
    deliverables: ['Vector Logo (AI, EPS, SVG)', 'Brand Style Guide', 'Hospital Stationery Template'],
    deliverablesMr: ['मूळ व्हेक्टर लोगो', 'ब्रँड कलर गाईड', 'प्रिस्क्रिप्शन व स्टेशनरी फॉरमॅट्स'],
    badge: 'Healthcare Identity',
    badgeMr: 'वैद्यकीय ब्रँडिंग'
  },
  {
    id: 'work-3',
    title: 'Aroma Artisan Cafe & Bakery',
    titleMr: 'अरोमा आर्टिसन कॅफे व बेकरी',
    category: 'branding',
    categoryLabel: 'Branding & Menu Design',
    categoryLabelMr: 'रेस्टॉरंट मेनू व ब्रँडिंग',
    client: 'Aroma Hospitality Group',
    city: 'Connaught Place, Cidco',
    cityMr: 'सिडको, छत्रपती संभाजीनगर',
    image: 'https://i.pinimg.com/736x/e7/b3/d9/e7b3d997bd2627c848a790c4fbf71d93.jpg',
    aspectRatio: 'portrait',
    description: 'Hardbound luxury cafe menu booklet, embossed coffee bean logo, kraft paper take-away packaging, and table standees.',
    descriptionMr: 'हार्डबाऊंड लक्झरी कॅफे मेनू कार्ड, क्राफ्ट पेपर पार्सल बॉक्सेस, कॉफी कप ब्रँडिंग आणि टेबल स्टँडी डिझाईन.',
    tags: ['Kraft Texture', 'Cafe Menu', 'Takeaway Box', 'Hardbound Foil'],
    deliverables: ['Multi-Page Menu Book', 'Coffee Cup Die-Cut', 'Table QR Standees'],
    deliverablesMr: ['मल्टि-पेज मेनू बुक', 'कॉफी कप डिझाईन', 'टेबल QR स्टँडी डिझाईन'],
    badge: 'Luxury Hospitality',
    badgeMr: 'रेस्टॉरंट ब्रँडिंग'
  },
  {
    id: 'work-4',
    title: 'Diwali & Festive Social Media Campaign',
    titleMr: 'दिवाळी व सणासुदीची सोशल मीडिया मोहीम',
    category: 'social',
    categoryLabel: 'Social Media Creatives',
    categoryLabelMr: 'सोशल मीडिया पोस्ट व जाहिरात',
    client: 'Kothari Jewellers & Sons',
    city: 'Sarafa Bazaar, Sambhajinagar',
    cityMr: 'सराफा बाजार, संभाजीनगर',
    image: 'https://i.pinimg.com/1200x/09/90/37/099037dedd888ec6b1aede0e2b0c6aee.jpg',
    aspectRatio: 'square',
    description: '15 High-converting Marathi & English Instagram carousels, gold jewelry showcase flyers, festival greetings, and promotional reels covers.',
    descriptionMr: '१५ आकर्षक मराठी व इंग्रजी इन्स्टाग्राम पोस्ट्स, सोने-चांदी दागिने ऑफर बॅनर्स, सणाच्या शुभेच्छा व प्रमोशनल क्रिएटिव्ह्ज.',
    tags: ['Instagram Post', 'Jewellery Showcase', 'Marathi Typography', 'Offer Banner'],
    deliverables: ['15 Feed Posts (1080x1080)', '10 Story Ads (1080x1920)', 'Animated Reels Intro'],
    deliverablesMr: ['१५ फीड पोस्ट्स', '१० स्टोरी जाहिराती', 'व्हॉट्सॲप ब्रॉडकास्ट बॅनर्स'],
    badge: 'Viral Engagement',
    badgeMr: 'सोशल मीडिया हिट'
  },
  {
    id: 'work-5',
    title: 'Highway Mega Billboard & Shop Facade',
    titleMr: 'हायवे भव्य होर्डिंग व शोरूम फ्रंट बोर्ड',
    category: 'outdoor',
    categoryLabel: 'Outdoor Flex & Hoarding',
    categoryLabelMr: 'आऊटडोअर होर्डिंग व बॅनर',
    client: 'Shree Sai Real Estate & Infra',
    city: 'Jalna Road Highway, Sambhajinagar',
    cityMr: 'जालना रोड हायवे, संभाजीनगर',
    image: 'https://i.pinimg.com/1200x/45/b7/46/45b7466573839e7f64cfe580f0317970.jpg',
    aspectRatio: 'landscape',
    description: 'High-visibility 40ft x 20ft highway hoarding design with bold bilingual Marathi-English typography, project 3D architectural render styling, and spot lighting contrast.',
    descriptionMr: '४० × २० फूट भव्य हायवे होर्डिंग, स्पष्ट व ठळक मराठी अक्षरे, ३D प्रोजेक्ट रेंडर व रात्री चमकणारे हाय-कॉन्ट्रास्ट डिझाईन.',
    tags: ['40x20ft Flex', 'Highway Visibility', '3D Architecture', 'Backlit Ready'],
    deliverables: ['Large Scale TIFF Print File', 'Glow Sign Vector Artwork', 'Site Elevation Visualizer'],
    deliverablesMr: ['मोठ्या आकाराची TIFF प्रिंट फाईल', 'ग्लो-साइन व्हिज्युअल आर्टवर्क', 'साईट मॉकअप व्ह्यू'],
    badge: 'Large Format 40ft',
    badgeMr: '४० फूट हायवे होर्डिंग'
  },
  {
    id: 'work-6',
    title: 'Velvet Soft-Touch Foil Business Cards',
    titleMr: 'रॉयल वेल्वेट गोल्ड फॉइल व्हिजिटिंग कार्ड्स',
    category: 'stationery',
    categoryLabel: 'Luxury Stationery & Cards',
    categoryLabelMr: 'लक्झरी व्हिजिटिंग कार्ड्स व स्टेशनरी',
    client: 'Advocate V. S. Deshmukh & Associates',
    city: 'High Court Bench, Sambhajinagar',
    cityMr: 'हायकोर्ट बेंच, संभाजीनगर',
    image: 'https://i.pinimg.com/1200x/86/5c/46/865c464b42bf2a2b815675dac58f879b.jpg',
    aspectRatio: 'square',
    description: '450 GSM velvet matte card with raised 3D spot UV and royal gold foil emblem on deep obsidian black card stock.',
    descriptionMr: '४५० GSM वेल्वेट मॅट फिनिश, एम्बॉस्ड ३D स्पॉट UV आणि राजेशाही गोल्ड फॉइल एम्बलेम असलेले प्रीमियम कार्ड.',
    tags: ['450 GSM Card', 'Raised Spot UV', 'Gold Hot Foil', 'QR Integration'],
    deliverables: ['Pre-Press Ready CMYK PDF', 'Gold Foil Mask Layer', 'Spot UV Varnish Layer'],
    deliverablesMr: ['प्रिंट-रेडी CMYK PDF', 'गोल्ड फॉइल मास्क लेयर', 'स्पॉट UV वॉर्निश लेयर'],
    badge: 'Signature Luxury',
    badgeMr: 'प्रीमियम लक्झरी'
  },
  {
    id: 'work-7',
    title: 'Organic Agro Seed & Fertilizer Label Suite',
    titleMr: 'सेंद्रिय कृषी बियाणे व खते बॉटल लेबल्स',
    category: 'packaging',
    categoryLabel: 'Packaging & Labels',
    categoryLabelMr: 'पॅकेजिंग व लेबल्स',
    client: 'Kisan Shakti Biotech Pvt Ltd',
    city: 'MIDC Waluj, Sambhajinagar',
    cityMr: 'MIDC वाळूज, संभाजीनगर',
    image: 'https://i.pinimg.com/1200x/ed/05/1e/ed051ef917edede8666d47695ee6d3d4.jpg',
    aspectRatio: 'portrait',
    description: 'Weatherproof metallic chrome vinyl bottle labels with chemical composition tables, clear crop usage icons, and holographic tamper seal.',
    descriptionMr: 'वॉटरप्रूफ मेटॅलिक क्रोम बॉटल लेबल्स, वापराचे सचित्र नियम, रासायनिक घटक चार्ट व होलोग्राम सिक्युरिटी सील.',
    tags: ['Roll Label', 'Waterproof Chrome', 'Agri Tech', 'Crop Vector Icons'],
    deliverables: ['Continuous Roll Die-Line', 'Pantone Color Codes', 'Barcode Verification File'],
    deliverablesMr: ['कंटिन्युअस रोल डाय-लाईन', 'पॅन्टोन कलर कोड्स', 'बारकोड पडताळणी फाईल']
  },
  {
    id: 'work-8',
    title: 'Industrial Machinery Catalog & Tri-Fold Brochure',
    titleMr: 'इंडस्ट्रियल मशिनरी कॅटलॉग व ब्रोशर',
    category: 'brochure',
    categoryLabel: 'Brochures & Catalogs',
    categoryLabelMr: 'ब्रोशर्स व प्रॉडक्ट कॅटलॉग',
    client: 'Apex CNC Automation Engineering',
    city: 'Shendra DMIC, Sambhajinagar',
    cityMr: 'शेंद्रा DMIC, संभाजीनगर',
    image: 'https://i.pinimg.com/1200x/2e/58/50/2e5850293b7ff80680b5bfcd5ca7cb39.jpg',
    aspectRatio: 'landscape',
    description: '12-Page comprehensive industrial machinery catalog with technical spec grids, exploded diagram vector graphics, and pocket-folder cover.',
    descriptionMr: '१२ पानांचा इंडस्ट्रियल मशिनरी कॅटलॉग, तांत्रिक वैशिष्ट्यांचे तक्ते, व्हेक्टर आकृत्या आणि पॉकेट-फोल्डर कव्हर डिझाईन.',
    tags: ['12-Page Catalog', 'Technical Grids', 'Industrial Vector', 'Pocket Folder'],
    deliverables: ['Multi-Page Pre-Press PDF', 'Digital Flipbook Version', 'All Raw Vector Illustrations'],
    deliverablesMr: ['मल्टी-पेज प्री-प्रेस PDF', 'डिजिटल ई-कॅटलॉग', 'सर्व मूळ व्हेक्टर इलस्ट्रेशन्स']
  }
];
