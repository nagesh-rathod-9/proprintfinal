import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { seedDatabaseIfEmpty } from './seedData.js';

let dbInstance: Database | null = null;
const DB_FILE_PATH = path.join(process.cwd(), 'proprint_database.sqlite');

export async function getDb(): Promise<Database> {
  if (dbInstance) {
    return dbInstance;
  }

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_FILE_PATH)) {
    const filebuffer = fs.readFileSync(DB_FILE_PATH);
    dbInstance = new SQL.Database(filebuffer);
    initSchema(dbInstance);
    seedDatabaseIfEmpty(dbInstance);
    saveDb();
  } else {
    dbInstance = new SQL.Database();
    initSchema(dbInstance);
    seedDatabaseIfEmpty(dbInstance);
    saveDb();
  }

  return dbInstance;
}

export function saveDb() {
  if (dbInstance) {
    const data = dbInstance.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_FILE_PATH, buffer);
  }
}

function initSchema(db: Database) {
  // 1. Users Table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      role TEXT NOT NULL DEFAULT 'customer',
      company_name TEXT,
      gst_number TEXT,
      shipping_address TEXT,
      city TEXT,
      pincode TEXT,
      addresses_json TEXT,
      password_hash TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Orders Table
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      tracking_number TEXT,
      customer_name TEXT NOT NULL,
      customer_email TEXT,
      customer_phone TEXT NOT NULL,
      shipping_address TEXT NOT NULL,
      city TEXT,
      pincode TEXT,
      subtotal REAL NOT NULL,
      tax REAL NOT NULL,
      shipping_fee REAL DEFAULT 0,
      discount REAL DEFAULT 0,
      total REAL NOT NULL,
      payment_method TEXT NOT NULL,
      payment_status TEXT NOT NULL DEFAULT 'Pending',
      status TEXT NOT NULL DEFAULT 'Order Placed',
      items_json TEXT NOT NULL,
      timeline_json TEXT,
      notes TEXT,
      uploaded_file_url TEXT,
      uploaded_file_name TEXT,
      user_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Products Table
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      name_mr TEXT,
      category_id TEXT NOT NULL,
      category_name TEXT,
      base_price REAL NOT NULL,
      original_price REAL,
      description TEXT,
      description_mr TEXT,
      image TEXT,
      gallery_json TEXT,
      rating REAL DEFAULT 4.9,
      reviews_count INTEGER DEFAULT 1,
      min_quantity INTEGER DEFAULT 100,
      default_quantity INTEGER DEFAULT 500,
      sizes_json TEXT,
      finishes_json TEXT,
      features_json TEXT,
      tags_json TEXT,
      turnaround_days INTEGER DEFAULT 1,
      single_price REAL,
      bulk_price_100 REAL,
      bulk_price_500 REAL,
      bulk_price_1000 REAL,
      is_popular INTEGER DEFAULT 1,
      is_best_seller INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 4. Categories Table
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      name_mr TEXT,
      short_name TEXT,
      icon_name TEXT DEFAULT 'Package',
      image TEXT,
      item_count INTEGER DEFAULT 0,
      featured INTEGER DEFAULT 1,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 5. Hero Banner Slides Table
  db.run(`
    CREATE TABLE IF NOT EXISTS hero_slides (
      id TEXT PRIMARY KEY,
      title1 TEXT NOT NULL,
      title2 TEXT,
      highlight TEXT,
      subtitle TEXT,
      image TEXT NOT NULL,
      button_text TEXT,
      quote_button_text TEXT,
      type_label TEXT,
      product_id TEXT,
      category_link TEXT,
      theme TEXT DEFAULT 'crimson',
      tag TEXT,
      badge TEXT,
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 6. Services Table
  db.run(`
    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      tagline TEXT,
      description TEXT,
      turnaround TEXT,
      min_order TEXT,
      icon_name TEXT DEFAULT 'Printer',
      badge TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 7. Reviews Table
  db.run(`
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      customer_role TEXT,
      product_name TEXT,
      rating REAL DEFAULT 5,
      comment TEXT NOT NULL,
      date TEXT,
      status TEXT DEFAULT 'Approved',
      verified_buyer INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 8. Quotes Table
  db.run(`
    CREATE TABLE IF NOT EXISTS quotes (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      customer_email TEXT,
      customer_phone TEXT NOT NULL,
      company_name TEXT,
      product_category TEXT,
      quantity INTEGER,
      paper_gsm TEXT,
      finish_type TEXT,
      size TEXT,
      special_instructions TEXT,
      status TEXT DEFAULT 'New',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 9. Payments Table
  db.run(`
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      order_id TEXT,
      order_number TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      amount REAL NOT NULL,
      method TEXT NOT NULL,
      status TEXT DEFAULT 'Completed',
      transaction_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 10. Portfolio Table
  db.run(`
    CREATE TABLE IF NOT EXISTS portfolio (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      title_mr TEXT,
      category TEXT NOT NULL,
      category_label TEXT,
      category_label_mr TEXT,
      client TEXT,
      city TEXT,
      city_mr TEXT,
      image TEXT NOT NULL,
      aspect_ratio TEXT DEFAULT 'square',
      description TEXT,
      description_mr TEXT,
      tags_json TEXT,
      deliverables_json TEXT,
      deliverables_mr_json TEXT,
      badge TEXT,
      badge_mr TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Safe schema migrations for existing SQLite databases
  const safeAlter = (sql: string) => {
    try {
      db.run(sql);
    } catch (_e) {
      // Column already exists or table ready
    }
  };

  safeAlter(`ALTER TABLE users ADD COLUMN addresses_json TEXT;`);
  safeAlter(`ALTER TABLE orders ADD COLUMN uploaded_file_url TEXT;`);
  safeAlter(`ALTER TABLE orders ADD COLUMN uploaded_file_name TEXT;`);
  safeAlter(`ALTER TABLE orders ADD COLUMN user_id TEXT;`);
  safeAlter(`ALTER TABLE orders ADD COLUMN shipping_fee REAL DEFAULT 0;`);
  safeAlter(`ALTER TABLE orders ADD COLUMN discount REAL DEFAULT 0;`);
  safeAlter(`ALTER TABLE products ADD COLUMN single_price REAL;`);
  safeAlter(`ALTER TABLE products ADD COLUMN bulk_price_100 REAL;`);
  safeAlter(`ALTER TABLE products ADD COLUMN bulk_price_500 REAL;`);
  safeAlter(`ALTER TABLE products ADD COLUMN bulk_price_1000 REAL;`);

  // Seed default admin and customer user records if not exists
  db.run(`
    INSERT OR IGNORE INTO users (id, name, email, phone, role, company_name, gst_number, shipping_address, city, pincode, password_hash)
    VALUES 
    ('user-admin-1', 'Admin Manager', 'admin@proprint.in', '9322126863', 'admin', 'Proprint Commercial Press MIDC', '27AABCP1234F1Z8', 'Plot 18, Industrial Estate, Chikalthana MIDC', 'Chhatrapati Sambhajinagar', '431001', 'admin@123'),
    ('user-customer-1', 'Customer Client', 'user@proprint.in', '9322126863', 'customer', 'TechPrimeLab Commercial Firm', '27AXXXX1234X1Z0', 'Sushila Arcade, Motikaranja', 'Chhatrapati Sambhajinagar', '431001', 'user@123');
  `);

  // Seed default hero banner slides
  db.run(`
    INSERT OR IGNORE INTO hero_slides (id, title1, title2, highlight, subtitle, image, button_text, quote_button_text, type_label, product_id, category_link, theme, tag, badge, display_order, is_active)
    VALUES 
    ('slide-1', 'Brochure & Catalog Printing', 'Brochures', 'Printing', 'High-definition full color offset press print', 'https://i.pinimg.com/736x/c6/e3/bb/c6e3bbbd242f377f64021fe55c33b17d.jpg', 'Order Brochures', 'Quick Quote', 'Brochures', 'prod-premium-brochure', '/products?category=brochures', 'crimson', 'Brochures', 'Premium', 1, 1),
    ('slide-2', 'Custom Die Cut Stickers', 'Stickers', 'Stickers', 'Waterproof vinyl stickers & labels in roll/sheet', 'https://i.pinimg.com/1200x/d3/0d/ca/d30dcabb85e6a44689838e953c3d78c3.jpg', 'Order Stickers', 'Enquiry', 'Stickers', 'prod-die-cut-sticker-sheet', '/products?category=stickers', 'crimson', 'Stickers', 'Hot', 2, 1),
    ('slide-3', 'Custom Packaging Boxes', 'Packaging', 'Packaging', 'Luxury rigid boxes & mono-cartons with gold foil', 'https://i.pinimg.com/736x/bb/c1/3d/bbc13d8711ec67195aae22fe376e4d40.jpg', 'Packaging', 'Enquiry', 'Packaging', 'prod-custom-packaging-box', '/products?category=packaging', 'dark', 'Packaging', 'Popular', 3, 1);
  `);

  // Seed default categories
  db.run(`
    INSERT OR IGNORE INTO categories (id, name, name_mr, short_name, icon_name, image, item_count, featured, description)
    VALUES 
    ('visiting-cards', 'Visiting Cards', 'व्हिजिटिंग कार्ड्स', 'Cards', 'CreditCard', 'https://i.pinimg.com/736x/a0/f2/48/a0f248a045d206198648621d77eb6426.jpg', 16, 1, '350-400 GSM Matte, Velvet Touch, Spot UV & Foil Stamped Visiting Cards'),
    ('brochures', 'Brochures & Catalogs', 'ब्रोशर्स व कॅटलॉग', 'Brochures', 'BookOpen', 'https://i.pinimg.com/736x/4a/ff/87/4aff87c143b4ae3a828a989151e04844.jpg', 18, 1, 'Tri-Fold, Bi-Fold & Multi-page Saddle Stitched Corporate Product Catalogs'),
    ('packaging', 'Packaging & Boxes', 'पॅकेजिंग बॉक्सेस', 'Packaging', 'Package', 'https://i.pinimg.com/736x/55/d7/5b/55d75bcfad0da6b4df44d19c9fe953b8.jpg', 15, 1, 'E-commerce mailers, mono cartons, sweet boxes and custom corrugated boxes'),
    ('stickers', 'Stickers & Labels', 'स्टिकर्स व लेबल्स', 'Stickers', 'Tag', 'https://i.pinimg.com/1200x/72/c7/ec/72c7ec157835f3350324004879afa7b2.jpg', 20, 1, '12x18 Waterproof Die-Cut Vinyl Sheets, Logo Stickers & Bottle Labels'),
    ('letterheads', 'Letter Heads', 'लेटरहेड्स व स्टेशनरी', 'Letterheads', 'FileText', 'https://i.pinimg.com/736x/69/09/86/690986cd9d97f35e6251a56a9acc0cb1.jpg', 14, 1, 'Executive 100 GSM DO Bond & Alabaster Letterheads & Marketing Pamphlets');
  `);

  // Seed sample initial order
  const sampleItems = JSON.stringify([
    {
      id: 'item-1',
      cartItemId: 'item-1',
      product: {
        id: 'prod-standard-biz-card',
        name: '350 GSM Velvet Matte Visiting Cards',
        category: 'Business Cards',
        basePrice: 299,
        image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
        unit: 'cards'
      },
      customization: {
        quantity: 500,
        sizeId: 'Standard',
        finishId: 'Velvet Matte',
        corners: 'Rounded Corners (6mm)',
        calculatedPrice: 899,
        uploadedFileName: 'brand_visiting_card.pdf'
      },
      subtotal: 899
    }
  ]);

  const sampleTimeline = JSON.stringify([
    { title: 'Order Placed', titleMr: 'ऑर्डर नोंदवली', description: 'Specifications verified', date: 'Just now', completed: true, current: true },
    { title: 'Pre-flight Proof Approval', titleMr: 'प्री-प्रेस आर्टवर्क तपासणी', description: 'CMYK proof confirmed', date: 'Upcoming', completed: false },
    { title: 'Press Printing', titleMr: 'प्रिंटिंग सुरु', description: 'Offset Heidelberg press', date: 'Upcoming', completed: false },
    { title: 'Dispatched', titleMr: 'डिलिव्हरी रवाना', description: 'Tracking generated', date: 'Upcoming', completed: false }
  ]);

  db.run(`
    INSERT OR IGNORE INTO orders (id, order_number, tracking_number, customer_name, customer_email, customer_phone, shipping_address, city, pincode, subtotal, tax, total, payment_method, payment_status, status, items_json, timeline_json)
    VALUES 
    ('ord-init-1', 'PRP-84920', 'EXP-IN-739201', 'Nagesh Rathod', 'nagesh.rathod@techprimelab.com', '9322126863', 'Sushila Arcade, Motikaranja', 'Chhatrapati Sambhajinagar', '431001', 899, 161, 1060, 'UPI', 'Paid', 'Confirmed', '${sampleItems.replace(/'/g, "''")}', '${sampleTimeline.replace(/'/g, "''")}');
  `);
}

