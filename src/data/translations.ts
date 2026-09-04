export type Language = 'en' | 'mr';

export interface Translations {
  // Brand & Slogans
  brandName: string;
  brandTagline: string;
  subTagline: string;
  
  // Navigation
  navHome: string;
  navProducts: string;
  navVisitingCardStudio: string;
  navServices: string;
  navMachinery: string;
  navTrackOrder: string;
  navQuote: string;
  navAccount: string;
  navCart: string;
  navWishlist: string;
  
  // Top bar & Header
  topBarDelivery: string;
  topBarHelp: string;
  topBarLocation: string;
  topBarLanguage: string;
  searchPlaceholder: string;
  
  // Hero & Banners
  heroTitle: string;
  heroSubtitle: string;
  orderNow: string;
  getQuote: string;
  whatsappQuote: string;
  customizeVisitingCard: string;
  viewDetails: string;
  quickOrder: string;
  
  // Visiting Card Specific
  visitingCardStudioTitle: string;
  visitingCardStudioSubtitle: string;
  cardTypesTitle: string;
  classicMatte: string;
  velvetTouch: string;
  goldFoil: string;
  spotUv: string;
  frostedPvc: string;
  ecoKraft: string;
  embossed: string;
  magneticCard: string;
  frontSide: string;
  backSide: string;
  cornerStyle: string;
  squareCorners: string;
  roundedCorners: string;
  orientation: string;
  landscape: string;
  portrait: string;
  cardDetails: string;
  fullName: string;
  jobTitle: string;
  companyName: string;
  phoneNo: string;
  emailAddress: string;
  officeAddress: string;
  qrCodeType: string;
  uploadLogo: string;
  flipCard: string;
  
  // Sections
  allServices: string;
  brandingSolutions: string;
  commercialPrinting: string;
  bestSellers: string;
  highDemand: string;
  viewAll: string;
  whyChooseUs: string;
  clientReviews: string;
  trustBadge1: string;
  trustBadge2: string;
  trustBadge3: string;
  trustBadge4: string;
  
  // Actions & Rates
  startingFrom: string;
  addToCart: string;
  totalAmount: string;
  quantity: string;
  cardsCount: string;
  units: string;
  turnaroundTime: string;
  fastDelivery: string;
  taxInclusive: string;
  
  // Footer
  footerAbout: string;
  footerPrintingCatalog: string;
  footerCustomerDesk: string;
  footerContact: string;
  footerNewsletter: string;
  footerRights: string;
  subscribe: string;
  enterEmail: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    brandName: 'Proprint',
    brandTagline: 'Professional Commercial Printing & Visiting Card Specialist',
    subTagline: 'High quality, affordable, and 24-hour turnaround printing services in Chh. Sambhajinagar & Pan-Maharashtra',
    
    navHome: 'Home',
    navProducts: 'All Products',
    navVisitingCardStudio: 'Visiting Card Studio',
    navServices: 'Our Services',
    navMachinery: 'Machinery & Press',
    navTrackOrder: 'Track Order',
    navQuote: 'Bulk Quote',
    navAccount: 'My Account',
    navCart: 'Cart',
    navWishlist: 'Wishlist',
    
    topBarDelivery: '⚡ 24h Express Dispatch Across Maharashtra | GST Invoicing',
    topBarHelp: 'Direct Press Help:',
    topBarLocation: 'Chh. Sambhajinagar, Maharashtra',
    topBarLanguage: 'Language',
    searchPlaceholder: 'Search visiting cards, brochures, flyers, banners, boxes, stamps...',
    
    heroTitle: 'Commercial Printing & Luxe Visiting Cards',
    heroSubtitle: 'From single-piece prototyping to 50,000+ offset runs. Offset, Digital & Flex Printing under one roof.',
    orderNow: 'Order Now',
    getQuote: 'Get Instant Quote',
    whatsappQuote: 'Order on WhatsApp',
    customizeVisitingCard: 'Customize Visiting Card',
    viewDetails: 'View Details',
    quickOrder: 'Quick Order',
    
    visitingCardStudioTitle: 'Visiting Card 3D Studio & Customizer',
    visitingCardStudioSubtitle: 'Choose your card material, finish, typography, QR code, and preview in real-time 3D.',
    cardTypesTitle: 'Select Visiting Card Type',
    classicMatte: '350 GSM Royal Matte',
    velvetTouch: 'Velvet Soft-Touch Lamination',
    goldFoil: 'Metallic Raised Gold / Silver Foil',
    spotUv: 'Spot UV Gloss Selective Coating',
    frostedPvc: 'Translucent Frosted PVC Plastic',
    ecoKraft: 'Rustic Organic Kraft (400 GSM)',
    embossed: 'Letterpress Embossed Texture',
    magneticCard: 'Magnetic Executive Card',
    frontSide: 'Front Side',
    backSide: 'Back Side',
    cornerStyle: 'Corner Finish',
    squareCorners: 'Square (Standard 90°)',
    roundedCorners: 'Rounded (6mm Smooth)',
    orientation: 'Orientation',
    landscape: 'Landscape (Horizontal)',
    portrait: 'Portrait (Vertical)',
    cardDetails: 'Card Typography & Contact Info',
    fullName: 'Your Full Name',
    jobTitle: 'Designation / Profession',
    companyName: 'Business / Company Name',
    phoneNo: 'Phone / Mobile Number',
    emailAddress: 'Email Address',
    officeAddress: 'Office / Shop Address',
    qrCodeType: 'QR Code Link (VCard / WhatsApp)',
    uploadLogo: 'Upload Logo / Vector File',
    flipCard: 'Flip Card (Front / Back)',
    
    allServices: 'Complete Printing Services',
    brandingSolutions: 'Branding & Design Solutions',
    commercialPrinting: 'Commercial Printing & Packaging',
    bestSellers: 'Best Selling Products',
    highDemand: 'High Demand Favorites',
    viewAll: 'View All',
    whyChooseUs: 'Why Choose Proprint Workshop',
    clientReviews: 'Verified Client Reviews',
    trustBadge1: '24-48h Fast Dispatch',
    trustBadge2: 'Zero-Defect Heidelberg Press',
    trustBadge3: 'Lowest Wholesale Rates',
    trustBadge4: 'Direct WhatsApp Proofing',
    
    startingFrom: 'Starting price',
    addToCart: 'Add to Cart',
    totalAmount: 'Total Rate',
    quantity: 'Quantity',
    cardsCount: 'Cards',
    units: 'Units',
    turnaroundTime: 'Production Time',
    fastDelivery: 'Fast Dispatch',
    taxInclusive: 'All-inclusive GST Rate',
    
    footerAbout: 'Proprint – For all printing solutions. Premium offset, digital, outdoor flex, and custom visiting card manufacturing workshop in Chh. Sambhajinagar.',
    footerPrintingCatalog: 'Printing Catalog',
    footerCustomerDesk: 'Customer Desk',
    footerContact: 'Workshop Contact',
    footerNewsletter: 'Newsletter & Offers',
    footerRights: 'All rights reserved. Proprint Media Tech.',
    subscribe: 'Subscribe',
    enterEmail: 'Enter work email'
  },
  mr: {
    brandName: 'प्रोप्रींट',
    brandTagline: 'व्यावसायिक प्रिंटिंग व व्हिजिटिंग कार्ड विशेषज्ञ',
    subTagline: 'सर्वोच्च गुणवत्ता, परवडणारे दर आणि २४ तासांत जलद डिलिव्हरी - छत्रपती संभाजीनगर व संपूर्ण महाराष्ट्र',
    
    navHome: 'मुख्यपृष्ठ',
    navProducts: 'सर्व उत्पादने',
    navVisitingCardStudio: 'व्हिजिटिंग कार्ड स्टुडिओ',
    navServices: 'आमच्या सेवा',
    navMachinery: 'प्रिंटिंग मशनरी व प्रेस',
    navTrackOrder: 'ऑर्डर ट्रॅक करा',
    navQuote: 'मोठ्या ऑर्डरसाठी कोटेशन',
    navAccount: 'माझे खाते',
    navCart: 'कार्ट',
    navWishlist: 'आवडती यादी',
    
    topBarDelivery: '⚡ २४ तासांत संपूर्ण महाराष्ट्रात एक्स्प्रेस डिस्पॅच | GST बिल उपलब्ध',
    topBarHelp: 'थेट संपर्क मदत:',
    topBarLocation: 'छत्रपती संभाजीनगर, महाराष्ट्र',
    topBarLanguage: 'भाषा',
    searchPlaceholder: 'व्हिजिटिंग कार्ड, ब्रोशर, पॅम्प्लेट, बॅनर, बॉक्सेस, स्टिकर्स शोधा...',
    
    heroTitle: 'व्यावसायिक प्रिंटिंग व लक्झरी व्हिजिटिंग कार्ड्स',
    heroSubtitle: '१ नमुन्यापासून ५०,०००+ मोठ्या ऑर्डर्सपर्यंत. ऑफसेट, डिजिटल आणि फ्लेक्स प्रिंटिंग एकाच छताखाली.',
    orderNow: 'आता ऑर्डर करा',
    getQuote: 'दरपत्रक मिळवा',
    whatsappQuote: 'व्हॉट्सॲपवर ऑर्डर करा',
    customizeVisitingCard: 'व्हिजिटिंग कार्ड कस्टमायझ करा',
    viewDetails: 'तपशील पहा',
    quickOrder: 'थेट ऑर्डर',
    
    visitingCardStudioTitle: 'व्हिजिटिंग कार्ड ३D स्टुडिओ व कस्टमायझर',
    visitingCardStudioSubtitle: 'कार्ड प्रकार, फिनिश, नाव, संपर्क माहिती, QR कोड निवडा आणि थेट ३D मध्ये पहा.',
    cardTypesTitle: 'व्हिजिटिंग कार्डचा प्रकार निवडा',
    classicMatte: '३५० GSM रॉयल मॅट कार्ड',
    velvetTouch: 'मखमली वेल्वेट सॉफ्ट-टच लेमिनेशन',
    goldFoil: 'रॉयल मेटॅलिक गोल्ड / सिल्व्हर फॉइल',
    spotUv: 'स्पॉट UV ग्लॉस चकचकीत कोटिंग',
    frostedPvc: 'पारदर्शक वॉटरप्रूफ PVC प्लास्टिक कार्ड',
    ecoKraft: 'ऑरगॅनिक क्राफ्ट विंटेज बोर्ड (४०० GSM)',
    embossed: 'उठावदार एम्बॉस्ड / लेटरप्रेस टेक्सचर',
    magneticCard: 'मॅग्नेटिक एक्झिक्युटिव्ह कार्ड',
    frontSide: 'पुढची बाजू (Front)',
    backSide: 'मागची बाजू (Back)',
    cornerStyle: 'कोपऱ्यांचा आकार (Corners)',
    squareCorners: 'चौकोनी (Standard 90°)',
    roundedCorners: 'गोल कोपरे (6mm Rounded)',
    orientation: 'दिशानिर्देश (Orientation)',
    landscape: 'आडवे (Horizontal)',
    portrait: 'उभे (Vertical)',
    cardDetails: 'कार्डवरील नाव व संपर्क तपशील',
    fullName: 'पूर्ण नाव',
    jobTitle: 'पदनाम / व्यवसाय',
    companyName: 'कंपनी / दुकानाचे नाव',
    phoneNo: 'फोन / मोबाईल नंबर',
    emailAddress: 'ईमेल पत्ता',
    officeAddress: 'पत्ता / ऑफिस लोकेशन',
    qrCodeType: 'QR कोड लिंक (VCard / WhatsApp / Google Maps)',
    uploadLogo: 'लोगो / डिझाईन फाईल अपलोड करा',
    flipCard: 'कार्ड उलटा (Front / Back)',
    
    allServices: 'आमच्या सर्व प्रिंटिंग सेवा',
    brandingSolutions: 'ब्रँडिंग व डिझायनिंग सोल्यूशन्स',
    commercialPrinting: 'कमर्शियल प्रिंटिंग व पॅकेजिंग',
    bestSellers: 'सर्वाधिक विकली जाणारी उत्पादने',
    highDemand: 'ग्राहकांची पहिली पसंती',
    viewAll: 'सर्व पहा',
    whyChooseUs: 'प्रोप्रींट का निवडावे?',
    clientReviews: 'समाधानी ग्राहकांचे अभिप्राय',
    trustBadge1: '२४-४८ तासांत जलद डिलिव्हरी',
    trustBadge2: 'हायडेलबर्ग हाय-प्रिसिजन प्रेस',
    trustBadge3: 'थेट कारखान्याचे घाऊक दर',
    trustBadge4: 'व्हॉट्सॲपवर त्वरित प्रुफ तपासणी',
    
    startingFrom: 'किमान दर',
    addToCart: 'कार्टमध्ये जोडा',
    totalAmount: 'एकूण रक्कम',
    quantity: 'संख्या (Quantity)',
    cardsCount: 'कार्ड्स',
    units: 'नग',
    turnaroundTime: 'तयार होण्याचा वेळ',
    fastDelivery: 'जलद डिस्पॅच',
    taxInclusive: 'सर्व करांसह एकूण दर',
    
    footerAbout: 'प्रोप्रींट – सर्व प्रिंटिंग गरजांसाठी एकमेव विश्वासू नाव. हाय-क्वालिटी ऑफसेट, डिजिटल आणि लक्झरी व्हिजिटिंग कार्ड निर्मिती कारखाना, छत्रपती संभाजीनगर.',
    footerPrintingCatalog: 'प्रिंटिंग कॅटलॉग',
    footerCustomerDesk: 'ग्राहक सेवा कक्ष',
    footerContact: 'कारखाना संपर्क पत्ता',
    footerNewsletter: 'ऑफर्स व अपडेट्स मिळवा',
    footerRights: 'सर्व हक्क राखीव. प्रोप्रींट मीडिया टेक.',
    subscribe: 'सबस्क्राईब करा',
    enterEmail: 'आपला ईमेल टाका'
  }
};
