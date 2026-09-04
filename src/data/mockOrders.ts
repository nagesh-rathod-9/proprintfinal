import { Order, QuoteRequest, User } from '../types';
import { PRODUCTS } from './products';

export const DEMO_USERS: User[] = [
  {
    id: 'user-admin-1',
    name: 'Admin Manager',
    email: 'admin@proprint.in',
    phone: '9322126863',
    role: 'admin',
    companyName: 'Proprint Solutions Pvt Ltd',
    gstNumber: '27AABCP1234F1Z8',
    shippingAddress: 'Industrial Area, Chikalthana, MIDC',
    city: 'Chhatrapati Sambhajinagar',
    pincode: '431001',
    addresses: [
      {
        id: 'addr-admin-1',
        label: 'Press & Headquarters',
        name: 'Admin Manager',
        phone: '9322126863',
        companyName: 'Proprint Solutions Pvt Ltd',
        gstNumber: '27AABCP1234F1Z8',
        addressLine: 'Plot 18, Industrial Estate, Chikalthana MIDC',
        city: 'Chhatrapati Sambhajinagar',
        state: 'Maharashtra',
        pincode: '431001',
        isDefault: true
      }
    ],
    createdAt: '01 Jan 2026'
  },
  {
    id: 'user-customer-1',
    name: 'Nagesh Rathod',
    email: 'nagesh.rathod@techprimelab.com',
    phone: '9876543210',
    role: 'customer',
    companyName: 'TechPrimeLab Software',
    gstNumber: '27ABCDE9876K1Z2',
    shippingAddress: 'Flat 402, Cyber Heights, Sector 5, CIDCO',
    city: 'Chhatrapati Sambhajinagar',
    pincode: '431003',
    addresses: [
      {
        id: 'addr-cust-1',
        label: 'Office / Company',
        name: 'Nagesh Rathod',
        phone: '9876543210',
        companyName: 'TechPrimeLab Software',
        gstNumber: '27ABCDE9876K1Z2',
        addressLine: 'Flat 402, Cyber Heights, Sector 5, CIDCO',
        city: 'Chhatrapati Sambhajinagar',
        state: 'Maharashtra',
        pincode: '431003',
        isDefault: true
      },
      {
        id: 'addr-cust-2',
        label: 'Residence / Home',
        name: 'Nagesh Rathod',
        phone: '9876543210',
        addressLine: 'House No. 14, Shivalaya Colony, N-4 CIDCO',
        city: 'Chhatrapati Sambhajinagar',
        state: 'Maharashtra',
        pincode: '431009',
        isDefault: false
      }
    ],
    createdAt: '15 Jan 2026'
  },
  {
    id: 'user-customer-2',
    name: 'Pooja Deshmukh',
    email: 'pooja.d@innovatedesign.co',
    phone: '9822001122',
    role: 'customer',
    companyName: 'Innovate Design Studio',
    shippingAddress: 'Shop 12, Cannaught Place, Town Center',
    city: 'Pune',
    pincode: '411005',
    addresses: [
      {
        id: 'addr-cust-3',
        label: 'Design Studio',
        name: 'Pooja Deshmukh',
        phone: '9822001122',
        companyName: 'Innovate Design Studio',
        addressLine: 'Shop 12, Cannaught Place, Town Center, CIDCO',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411005',
        isDefault: true
      }
    ],
    createdAt: '02 Feb 2026'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-today-1',
    orderNumber: 'PRP-90214',
    customerName: 'Nagesh Rathod',
    customerPhone: '9876543210',
    customerEmail: 'nagesh.rathod@techprimelab.com',
    shippingAddress: 'Flat 402, Cyber Heights, CIDCO',
    city: 'Chh. Sambhajinagar',
    pincode: '431003',
    items: [
      {
        cartItemId: 'item-today-1',
        product: PRODUCTS[0],
        customization: {
          quantity: 500,
          sizeId: 'std-in',
          finishId: 'velvet-400',
          corners: 'Rounded (6mm)',
          uploadedFileName: 'techprimelab_front_back_print.pdf',
          calculatedPrice: 1680,
          turnaroundDays: 2,
          specialInstructions: 'Spot UV on logo and velvet soft touch matte lamination.'
        },
        subtotal: 1680
      }
    ],
    subtotal: 1680,
    shippingFee: 0,
    tax: 302,
    total: 1982,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    status: 'Printing in Progress',
    createdAt: 'Today, 10:45 AM',
    estimatedDelivery: '19 Aug 2026',
    notes: 'Artwork proof verified. Cyan & Black registration calibrated.',
    timeline: [
      { title: 'Order Placed & Payment Confirmed', description: 'Paid ₹1,982 via Razorpay UPI.', date: 'Today, 10:45 AM', completed: true },
      { title: 'Design Proof Approved', description: 'Pre-flight check passed (300 DPI CMYK).', date: 'Today, 11:30 AM', completed: true },
      { title: 'Printing in Progress', description: 'Currently running on Heidelberg Speedmaster Press.', date: 'Today, 02:00 PM', completed: true, current: true },
      { title: 'Quality Inspection & Packaging', description: 'Edge trim and shrink packaging.', date: 'Expected: Tomorrow, 11:00 AM', completed: false },
      { title: 'Dispatched via Express Courier', description: 'Handover to Bluedart Express.', date: 'Expected: Tomorrow, 04:00 PM', completed: false },
      { title: 'Delivered', description: 'Delivery to doorstep.', date: 'Expected: 19 Aug 2026', completed: false }
    ]
  },
  {
    id: 'ord-today-2',
    orderNumber: 'PRP-90215',
    customerName: 'Pooja Deshmukh',
    customerPhone: '9822001122',
    customerEmail: 'pooja.d@innovatedesign.co',
    shippingAddress: 'Shop 12, Cannaught Place, Town Center',
    city: 'Pune',
    pincode: '411005',
    items: [
      {
        cartItemId: 'item-today-2',
        product: PRODUCTS[2] || PRODUCTS[0],
        customization: {
          quantity: 1000,
          sizeId: 'stk-2in',
          finishId: 'vinyl-gloss',
          corners: 'Standard Square',
          uploadedFileName: 'brand_stickers_sheet.ai',
          calculatedPrice: 1990,
          turnaroundDays: 1,
          specialInstructions: 'Waterproof die-cut stickers on roll/sheets.'
        },
        subtotal: 1990
      }
    ],
    subtotal: 1990,
    shippingFee: 0,
    tax: 358,
    total: 2348,
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    status: 'Design Proof Approved',
    createdAt: 'Today, 12:10 PM',
    estimatedDelivery: '18 Aug 2026',
    notes: 'Customer requested 50 extra sample stickers.',
    timeline: [
      { title: 'Order Placed & Payment Confirmed', description: 'Credit Card payment received.', date: 'Today, 12:10 PM', completed: true },
      { title: 'Design Proof Approved', description: 'Customer approved digital proof via email.', date: 'Today, 01:20 PM', completed: true, current: true },
      { title: 'Printing in Progress', description: 'Queueing for digital Roland eco-solvent plotter.', date: 'Expected: Today, 04:30 PM', completed: false },
      { title: 'Quality Inspection & Packaging', description: 'Precision die-cutting.', date: 'Expected: Tomorrow, 10:00 AM', completed: false },
      { title: 'Dispatched', description: 'Dispatch via DTDC Express.', date: 'Expected: Tomorrow, 02:00 PM', completed: false },
      { title: 'Delivered', description: 'Doorstep handover.', date: 'Expected: 18 Aug 2026', completed: false }
    ]
  },
  {
    id: 'ord-today-3',
    orderNumber: 'PRP-90216',
    customerName: 'Rahul Shinde',
    customerPhone: '9423118844',
    customerEmail: 'rahul.s@apextech.in',
    shippingAddress: 'Apex Towers, Sector 18, Vashi',
    city: 'Navi Mumbai',
    pincode: '400703',
    items: [
      {
        cartItemId: 'item-today-3',
        product: PRODUCTS[5] || PRODUCTS[0],
        customization: {
          quantity: 2,
          sizeId: 'standee-roll',
          finishId: 'flex-banner',
          corners: 'Standard Square',
          uploadedFileName: 'standee_expo_2026.pdf',
          calculatedPrice: 2317,
          turnaroundDays: 1,
          specialInstructions: 'Include heavy aluminium standee base.'
        },
        subtotal: 2317
      }
    ],
    subtotal: 2317,
    shippingFee: 0,
    tax: 417,
    total: 2734,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    status: 'Order Placed',
    createdAt: 'Today, 02:30 PM',
    estimatedDelivery: '20 Aug 2026',
    notes: 'Urgent event setup for weekend conference.',
    timeline: [
      { title: 'Order Placed & Payment Confirmed', description: 'Order received via online checkout.', date: 'Today, 02:30 PM', completed: true, current: true },
      { title: 'Design Proof Approved', description: 'Pre-flight checking artwork bleeds.', date: 'Pending Operator Review', completed: false },
      { title: 'Printing in Progress', description: 'Wide-format 10ft StarFlex printing.', date: 'Pending', completed: false },
      { title: 'Quality Inspection & Packaging', description: 'Eyelet punching and carry bag packing.', date: 'Pending', completed: false },
      { title: 'Dispatched', description: 'Handed to courier.', date: 'Pending', completed: false },
      { title: 'Delivered', description: 'Delivered to address.', date: 'Pending', completed: false }
    ]
  },
  {
    id: 'ord-yesterday-1',
    orderNumber: 'PRP-89940',
    customerName: 'Vikram Joshi',
    customerPhone: '9850123456',
    customerEmail: 'vikram.j@joshiassociates.org',
    shippingAddress: 'Plot 45, Golden City, Jalna Road',
    city: 'Chh. Sambhajinagar',
    pincode: '431005',
    items: [
      {
        cartItemId: 'item-yest-1',
        product: PRODUCTS[4] || PRODUCTS[0],
        customization: {
          quantity: 2500,
          sizeId: 'a5',
          finishId: 'gloss-170',
          corners: 'Standard Square',
          uploadedFileName: 'grand_opening_flyers_cmyk.pdf',
          calculatedPrice: 2495,
          turnaroundDays: 2,
          specialInstructions: 'Bundle in packs of 250 with paper bands.'
        },
        subtotal: 2495
      }
    ],
    subtotal: 2495,
    shippingFee: 0,
    tax: 449,
    total: 2944,
    paymentMethod: 'NetBanking',
    paymentStatus: 'Paid',
    status: 'Dispatched',
    createdAt: 'Yesterday, 11:15 AM',
    estimatedDelivery: '17 Aug 2026',
    notes: 'Tracking ID: BD748291048IN',
    timeline: [
      { title: 'Order Placed & Payment Confirmed', description: 'HDFC NetBanking paid.', date: 'Yesterday, 11:15 AM', completed: true },
      { title: 'Design Proof Approved', description: 'Artwork pre-flight passed.', date: 'Yesterday, 01:00 PM', completed: true },
      { title: 'Printing in Progress', description: 'High speed offset press completed.', date: 'Yesterday, 05:45 PM', completed: true },
      { title: 'Quality Inspection & Packaging', description: 'Cutting and packaging inspected.', date: 'Today, 08:30 AM', completed: true },
      { title: 'Dispatched via Express Courier', description: 'Bluedart Tracking #BD748291048IN.', date: 'Today, 10:00 AM', completed: true, current: true },
      { title: 'Delivered', description: 'Out for delivery tomorrow.', date: 'Expected: 17 Aug 2026', completed: false }
    ]
  }
];

export const INITIAL_QUOTES: QuoteRequest[] = [
  {
    id: 'quote-101',
    name: 'Santosh Mahajan',
    email: 'santosh@mahajangroup.in',
    phone: '9422009988',
    category: 'custom-merch',
    estimatedQuantity: '2000 diaries + 500 gift sets',
    specifications: 'Custom corporate embossed leather diaries with pen sets and brass metal logo badge for annual dealer conference in October.',
    deliveryCity: 'Chh. Sambhajinagar',
    createdAt: 'Today, 09:30 AM',
    status: 'New'
  },
  {
    id: 'quote-102',
    name: 'Dr. Meera Patwardhan',
    email: 'meera@lifecarehospital.org',
    phone: '9823114455',
    category: 'brochures',
    estimatedQuantity: '10,000 health pamphlets',
    specifications: 'A4 Tri-Fold pamphlets in 4 local languages (Marathi, Hindi, English) on 170 GSM gloss paper.',
    deliveryCity: 'Pune',
    createdAt: 'Yesterday, 04:15 PM',
    status: 'Contacted'
  }
];

export const INITIAL_PAYMENTS = [
  {
    id: 'PAY-8921',
    orderId: 'PRP-90214',
    customerName: 'Nagesh Rathod',
    amount: 1475,
    method: 'UPI',
    status: 'Completed',
    transactionId: 'UPI/2026/892182049102',
    date: 'Today, 10:45 AM',
    invoiceNumber: 'INV-2026-0412'
  },
  {
    id: 'PAY-8920',
    orderId: 'PRP-90213',
    customerName: 'Pooja Deshmukh',
    amount: 2944,
    method: 'NetBanking',
    status: 'Completed',
    transactionId: 'HDFC/TXN/849201948',
    date: 'Yesterday, 11:15 AM',
    invoiceNumber: 'INV-2026-0411'
  },
  {
    id: 'PAY-8919',
    orderId: 'PRP-90212',
    customerName: 'Vikram Joshi',
    amount: 850,
    method: 'Card',
    status: 'Completed',
    transactionId: 'VISA/9201849210',
    date: '15 Aug 2026',
    invoiceNumber: 'INV-2026-0410'
  },
  {
    id: 'PAY-8918',
    orderId: 'PRP-90211',
    customerName: 'Anand Kulkarni',
    amount: 4200,
    method: 'UPI',
    status: 'Pending',
    transactionId: 'UPI/PEND/74829104',
    date: '14 Aug 2026',
    invoiceNumber: 'INV-2026-0409'
  }
];

export const INITIAL_REVIEWS = [
  {
    id: 'REV-1',
    customerName: 'Nagesh Rathod',
    customerRole: 'TechPrimeLab Founder',
    productName: 'Luxury Velvet Touch Business Card',
    rating: 5,
    comment: 'The velvet lamination with gold foil and spot UV is exceptional! Best printing press in Sambhajinagar with fast 24-hr turnaround.',
    date: '12 Aug 2026',
    status: 'Approved',
    verifiedBuyer: true
  },
  {
    id: 'REV-2',
    customerName: 'Pooja Deshmukh',
    customerRole: 'Creative Director',
    productName: 'Custom Die-Cut Vinyl Stickers',
    rating: 5,
    comment: 'Super crisp colors, clean laser kiss-cut edges and waterproof vinyl. Highly recommended for packaging labels.',
    date: '10 Aug 2026',
    status: 'Approved',
    verifiedBuyer: true
  },
  {
    id: 'REV-3',
    customerName: 'Rajesh Shinde',
    customerRole: 'Retail Store Owner',
    productName: 'Rigid Monocarton Packaging Boxes',
    rating: 4,
    comment: 'Sturdy 350 GSM board with window die cut. Excellent print consistency across 2,000 units batch.',
    date: '08 Aug 2026',
    status: 'Approved',
    verifiedBuyer: true
  },
  {
    id: 'REV-4',
    customerName: 'Sneha Patil',
    customerRole: 'Events Coordinator',
    productName: 'Star Flex Heavy Duty Banner',
    rating: 5,
    comment: 'Vibrant outdoor banner with brass eyelets. Shipped safely packed in PVC tube.',
    date: '05 Aug 2026',
    status: 'Pending',
    verifiedBuyer: false
  }
];

