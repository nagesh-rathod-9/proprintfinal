import { Database } from 'sql.js';
import { CATEGORIES, PRODUCTS } from '../src/data/products.js';
import { PROPRINT_SERVICES } from '../src/data/services.js';
import { INITIAL_ORDERS, INITIAL_QUOTES, DEMO_USERS, INITIAL_PAYMENTS, INITIAL_REVIEWS } from '../src/data/mockOrders.js';
import { GRAPHIC_DESIGN_WORKS } from '../src/data/portfolio.js';

export function seedDatabaseIfEmpty(db: Database) {
  // 1. Seed Categories if empty or incomplete
  const catStmt = db.prepare(`SELECT count(*) as count FROM categories`);
  let catCount = 0;
  if (catStmt.step()) {
    catCount = (catStmt.getAsObject() as any).count || 0;
  }
  catStmt.free();

  if (catCount < CATEGORIES.length) {
    for (const cat of CATEGORIES) {
      db.run(
        `INSERT OR REPLACE INTO categories (id, name, name_mr, short_name, icon_name, image, item_count, featured, description)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          cat.id,
          cat.name,
          cat.nameMr || cat.name,
          cat.shortName || cat.name,
          cat.iconName || 'Tag',
          cat.image,
          cat.itemCount || 10,
          cat.featured ? 1 : 0,
          cat.description || ''
        ]
      );
    }
    console.log(`✅ Seeded ${CATEGORIES.length} real categories into database`);
  }

  // 2. Seed Products if empty
  const prodStmt = db.prepare(`SELECT count(*) as count FROM products`);
  let prodCount = 0;
  if (prodStmt.step()) {
    prodCount = (prodStmt.getAsObject() as any).count || 0;
  }
  prodStmt.free();

  if (prodCount === 0) {
    for (const p of PRODUCTS) {
      const galleryJson = JSON.stringify(p.galleryImages || [p.image]);
      const sizesJson = JSON.stringify(p.sizes || []);
      const finishesJson = JSON.stringify(p.finishes || []);
      const featuresJson = JSON.stringify(p.features || []);
      const tagsJson = JSON.stringify(p.tags || []);

      db.run(
        `INSERT OR REPLACE INTO products (
          id, name, name_mr, category_id, category_name, base_price, original_price, 
          description, description_mr, image, gallery_json, rating, reviews_count, 
          min_quantity, default_quantity, sizes_json, finishes_json, features_json, 
          tags_json, turnaround_days, is_popular, is_best_seller
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          p.id,
          p.name,
          p.nameMr || p.name,
          p.categoryId,
          p.category || p.categoryId,
          p.basePrice || 299,
          p.originalPrice || Math.round((p.basePrice || 299) * 1.3),
          p.description || '',
          p.descriptionMr || '',
          p.image,
          galleryJson,
          p.rating || 4.9,
          p.reviewsCount || 15,
          p.minQuantity || 100,
          p.defaultQuantity || 500,
          sizesJson,
          finishesJson,
          featuresJson,
          tagsJson,
          p.turnaroundDays || 1,
          p.isPopular ? 1 : 0,
          p.isBestSeller ? 1 : 0
        ]
      );
    }
    console.log(`✅ Seeded ${PRODUCTS.length} real products into database`);
  }

  // 3. Seed Services if empty
  const srvStmt = db.prepare(`SELECT count(*) as count FROM services`);
  let srvCount = 0;
  if (srvStmt.step()) {
    srvCount = (srvStmt.getAsObject() as any).count || 0;
  }
  srvStmt.free();

  if (srvCount === 0) {
    for (const s of PROPRINT_SERVICES) {
      db.run(
        `INSERT OR REPLACE INTO services (id, name, category, tagline, description, turnaround, min_order, icon_name, badge)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          s.id,
          s.name,
          s.category,
          s.tagline || '',
          s.description || '',
          s.turnaround || '24-48 Hours',
          s.minOrder || '1 Concept',
          s.iconName || 'Palette',
          s.badge || ''
        ]
      );
    }
    console.log(`✅ Seeded ${PROPRINT_SERVICES.length} real services into database`);
  }

  // 4. Seed Reviews if empty
  const revStmt = db.prepare(`SELECT count(*) as count FROM reviews`);
  let revCount = 0;
  if (revStmt.step()) {
    revCount = (revStmt.getAsObject() as any).count || 0;
  }
  revStmt.free();

  if (revCount === 0) {
    for (const r of INITIAL_REVIEWS) {
      db.run(
        `INSERT OR REPLACE INTO reviews (id, customer_name, customer_role, product_name, rating, comment, date, status, verified_buyer)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          r.id,
          r.customerName,
          r.customerRole || 'Verified Client',
          r.productName,
          r.rating || 5,
          r.comment,
          r.date || 'Recently',
          r.status || 'Approved',
          r.verifiedBuyer ? 1 : 0
        ]
      );
    }
    console.log(`✅ Seeded ${INITIAL_REVIEWS.length} real customer reviews into database`);
  }

  // 5. Seed Quotes if empty
  const qStmt = db.prepare(`SELECT count(*) as count FROM quotes`);
  let qCount = 0;
  if (qStmt.step()) {
    qCount = (qStmt.getAsObject() as any).count || 0;
  }
  qStmt.free();

  if (qCount === 0) {
    for (const q of (INITIAL_QUOTES as any[])) {
      db.run(
        `INSERT OR REPLACE INTO quotes (id, customer_name, customer_email, customer_phone, company_name, product_category, quantity, paper_gsm, finish_type, size, special_instructions, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          q.id,
          q.name || q.customerName || 'Client',
          q.email || q.customerEmail || '',
          q.phone || q.customerPhone || '9322126863',
          q.companyName || '',
          q.category || q.productCategory || q.service || 'Brochures',
          typeof q.quantity === 'number' ? q.quantity : 1000,
          q.paperGsm || '300 GSM',
          q.finishType || 'Matte Lamination',
          q.size || 'A4',
          q.specifications || q.specialInstructions || q.notes || '',
          q.status || 'New'
        ]
      );
    }
    console.log(`✅ Seeded initial quotes into database`);
  }

  // 6. Seed Payments if empty
  const payStmt = db.prepare(`SELECT count(*) as count FROM payments`);
  let payCount = 0;
  if (payStmt.step()) {
    payCount = (payStmt.getAsObject() as any).count || 0;
  }
  payStmt.free();

  if (payCount === 0) {
    for (const pay of (INITIAL_PAYMENTS as any[])) {
      db.run(
        `INSERT OR REPLACE INTO payments (id, order_id, order_number, customer_name, amount, method, status, transaction_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          pay.id,
          pay.orderId || '',
          pay.orderNumber || pay.invoiceNumber || `ORD-${pay.id}`,
          pay.customerName,
          pay.amount,
          pay.method,
          pay.status,
          pay.transactionId || `TXN-${Date.now()}`
        ]
      );
    }
    console.log(`✅ Seeded initial payments into database`);
  }

  // 7. Seed Orders if empty
  const ordStmt = db.prepare(`SELECT count(*) as count FROM orders`);
  let ordCount = 0;
  if (ordStmt.step()) {
    ordCount = (ordStmt.getAsObject() as any).count || 0;
  }
  ordStmt.free();

  if (ordCount === 0) {
    for (const ord of (INITIAL_ORDERS as any[])) {
      db.run(
        `INSERT OR REPLACE INTO orders (
          id, order_number, tracking_number, customer_name, customer_email, customer_phone,
          shipping_address, city, pincode, subtotal, tax, shipping_fee, discount, total,
          payment_method, payment_status, status, items_json, timeline_json, notes, user_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          ord.id,
          ord.orderNumber,
          ord.trackingNumber || `EXP-${ord.orderNumber}`,
          ord.customerName,
          ord.customerEmail || '',
          ord.customerPhone,
          ord.shippingAddress,
          ord.city || 'Chhatrapati Sambhajinagar',
          ord.pincode || '431001',
          ord.subtotal,
          ord.tax,
          ord.shippingFee || 0,
          ord.discount || 0,
          ord.total,
          ord.paymentMethod,
          ord.paymentStatus,
          ord.status,
          JSON.stringify(ord.items || []),
          JSON.stringify(ord.timeline || []),
          ord.notes || '',
          ord.userId || ''
        ]
      );
    }
    console.log(`✅ Seeded initial orders into database`);
  }

  // 8. Seed Users if empty
  const uStmt = db.prepare(`SELECT count(*) as count FROM users`);
  let uCount = 0;
  if (uStmt.step()) {
    uCount = (uStmt.getAsObject() as any).count || 0;
  }
  uStmt.free();

  if (uCount === 0) {
    for (const u of DEMO_USERS) {
      db.run(
        `INSERT OR REPLACE INTO users (id, name, email, phone, role, company_name, gst_number, shipping_address, city, pincode, password_hash)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          u.id,
          u.name,
          u.email,
          u.phone || '9322126863',
          u.role,
          u.companyName || '',
          u.gstNumber || '',
          u.shippingAddress || '',
          u.city || '',
          u.pincode || '',
          u.role === 'admin' ? 'admin@123' : 'user@123'
        ]
      );
    }
    console.log(`✅ Seeded users into database`);
  }

  // 9. Seed Portfolio if empty
  const portStmt = db.prepare(`SELECT count(*) as count FROM portfolio`);
  let portCount = 0;
  if (portStmt.step()) {
    portCount = (portStmt.getAsObject() as any).count || 0;
  }
  portStmt.free();

  if (portCount === 0) {
    for (const item of (GRAPHIC_DESIGN_WORKS as any[])) {
      db.run(
        `INSERT OR REPLACE INTO portfolio (
          id, title, title_mr, category, category_label, category_label_mr,
          client, city, city_mr, image, aspect_ratio, description, description_mr,
          tags_json, deliverables_json, deliverables_mr_json, badge, badge_mr
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          item.title,
          item.titleMr || item.title,
          item.category,
          item.categoryLabel || item.category,
          item.categoryLabelMr || item.categoryLabel || item.category,
          item.client || '',
          item.city || 'Chh. Sambhajinagar',
          item.cityMr || 'छत्रपती संभाजीनगर',
          item.image,
          item.aspectRatio || 'square',
          item.description || '',
          item.descriptionMr || '',
          JSON.stringify(item.tags || []),
          JSON.stringify(item.deliverables || []),
          JSON.stringify(item.deliverablesMr || []),
          item.badge || '',
          item.badgeMr || ''
        ]
      );
    }
    console.log(`✅ Seeded portfolio items into database`);
  }
}
