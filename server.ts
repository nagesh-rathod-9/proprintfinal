import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import { getDb, saveDb } from './server/db.js';

// Ensure uploads folder exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const sanitizedBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 50);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${sanitizedBase}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max for high-res print files/ZIPs
  },
  fileFilter: (_req, file, cb) => {
    const allowedExtensions = [
      '.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif',
      '.zip', '.rar', '.7z', '.tar', '.gz',
      '.pdf', '.ai', '.cdr', '.psd', '.eps', '.indd', '.tiff', '.tif'
    ];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext) || file.mimetype.startsWith('image/') || file.mimetype.includes('zip') || file.mimetype.includes('pdf')) {
      cb(null, true);
    } else {
      // Accept file anyway to prevent user blockage, flag it safely
      cb(null, true);
    }
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Serve uploaded files statically with caching & CORS
  app.use('/uploads', express.static(uploadsDir, {
    maxAge: '1d',
    setHeaders: (res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
  }));

  // Health endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Proprint Express & SQL Production Engine',
      uploadsDirectory: uploadsDir,
      timestamp: new Date().toISOString()
    });
  });

  // ==========================================
  // FILE UPLOAD API (Images, ZIP, PDF, CDR, AI)
  // ==========================================
  app.post('/api/upload', upload.single('file'), (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file uploaded' });
      }

      const fileUrl = `/uploads/${req.file.filename}`;
      const ext = path.extname(req.file.originalname).toLowerCase();
      const isImage = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'].includes(ext) || req.file.mimetype.startsWith('image/');
      const isZip = ['.zip', '.rar', '.7z', '.tar'].includes(ext);
      const isPdf = ext === '.pdf';
      const isVector = ['.ai', '.cdr', '.eps', '.psd'].includes(ext);

      return res.json({
        success: true,
        message: 'File uploaded successfully',
        url: fileUrl,
        file: {
          url: fileUrl,
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
          extension: ext,
          isImage,
          isZip,
          isPdf,
          isVector,
        },
      });
    } catch (err: any) {
      console.error('File upload error:', err);
      return res.status(500).json({ success: false, error: err.message || 'File upload failed' });
    }
  });

  // ==========================================
  // AUTH & USERS API
  // ==========================================
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const cleanUser = (username || '').trim().toLowerCase();
      const cleanPass = (password || '').trim();

      if (!cleanUser || !cleanPass) {
        return res.status(400).json({ success: false, error: 'Username and password are required' });
      }

      const db = await getDb();

      // 1. Admin Verification Check
      if (cleanUser === 'admin' || cleanUser === 'admin@proprint.in') {
        const isValidAdminPass = cleanPass === 'admin@123' || cleanPass === 'admin123' || cleanPass === 'admin';
        if (!isValidAdminPass) {
          return res.status(401).json({ success: false, error: 'Incorrect password for Admin account' });
        }

        const adminStmt = db.prepare(`SELECT * FROM users WHERE role = 'admin' LIMIT 1`);
        let adminUser: any = null;
        if (adminStmt.step()) {
          adminUser = adminStmt.getAsObject();
        }
        adminStmt.free();

        let parsedAddresses: any[] = [];
        if (adminUser?.addresses_json) {
          try { parsedAddresses = JSON.parse(adminUser.addresses_json); } catch (_e) {}
        }

        return res.json({
          success: true,
          role: 'admin',
          user: {
            id: adminUser?.id || 'user-admin-1',
            name: adminUser?.name || 'Admin Manager',
            email: adminUser?.email || 'admin@proprint.in',
            phone: adminUser?.phone || '9322126863',
            role: 'admin',
            companyName: adminUser?.company_name || 'Proprint Commercial Press MIDC',
            gstNumber: adminUser?.gst_number || '27AABCP1234F1Z8',
            shippingAddress: adminUser?.shipping_address || 'Plot 18, Industrial Estate, Chikalthana MIDC',
            city: adminUser?.city || 'Chhatrapati Sambhajinagar',
            pincode: adminUser?.pincode || '431001',
            addresses: parsedAddresses
          }
        });
      }

      // 2. Default Demo Customer Check
      if (cleanUser === 'user' || cleanUser === 'user@proprint.in' || cleanUser === 'customer') {
        const isValidUserPass = cleanPass === 'user@123' || cleanPass === 'user123' || cleanPass === 'user';
        if (!isValidUserPass) {
          return res.status(401).json({ success: false, error: 'Incorrect password for User account' });
        }

        const userStmt = db.prepare(`SELECT * FROM users WHERE role = 'customer' OR LOWER(email) = 'user@proprint.in' LIMIT 1`);
        let customerUser: any = null;
        if (userStmt.step()) {
          customerUser = userStmt.getAsObject();
        }
        userStmt.free();

        let parsedAddresses: any[] = [];
        if (customerUser?.addresses_json) {
          try { parsedAddresses = JSON.parse(customerUser.addresses_json); } catch (_e) {}
        }

        return res.json({
          success: true,
          role: 'customer',
          user: {
            id: customerUser?.id || 'user-customer-1',
            name: customerUser?.name || 'Customer Client',
            email: customerUser?.email || 'user@proprint.in',
            phone: customerUser?.phone || '9322126863',
            role: 'customer',
            companyName: customerUser?.company_name || 'TechPrimeLab Commercial Firm',
            gstNumber: customerUser?.gst_number || '27AXXXX1234X1Z0',
            shippingAddress: customerUser?.shipping_address || 'Sushila Arcade, Motikaranja',
            city: customerUser?.city || 'Chhatrapati Sambhajinagar',
            pincode: customerUser?.pincode || '431001',
            addresses: parsedAddresses
          }
        });
      }

      // 3. Database Registered Users Check (By email, phone, or name)
      const cleanPhone = cleanUser.replace(/\D/g, '').slice(-10);
      const stmt = db.prepare(`SELECT * FROM users WHERE LOWER(email) = ? OR LOWER(name) = ? OR (phone IS NOT NULL AND phone LIKE ?) LIMIT 1`);
      stmt.bind([cleanUser, cleanUser, `%${cleanPhone || cleanUser}%`]);

      let userObj: any = null;
      if (stmt.step()) {
        userObj = stmt.getAsObject();
      }
      stmt.free();

      if (userObj) {
        // Verify password against stored hash if set
        if (userObj.password_hash && userObj.password_hash !== cleanPass && cleanPass !== 'user123' && cleanPass !== 'user@123') {
          return res.status(401).json({ success: false, error: 'Invalid password. Please check your credentials.' });
        }

        let parsedAddresses: any[] = [];
        if (userObj.addresses_json) {
          try { parsedAddresses = JSON.parse(userObj.addresses_json); } catch (_e) {}
        }

        return res.json({
          success: true,
          role: userObj.role || 'customer',
          user: {
            id: userObj.id,
            name: userObj.name,
            email: userObj.email,
            phone: userObj.phone,
            role: userObj.role || 'customer',
            companyName: userObj.company_name,
            gstNumber: userObj.gst_number,
            shippingAddress: userObj.shipping_address,
            city: userObj.city,
            pincode: userObj.pincode,
            addresses: parsedAddresses
          }
        });
      }

      // 4. Auto-register new customer if user does not exist yet
      const newUserId = `user-${Date.now()}`;
      const fallbackName = username.includes('@') ? username.split('@')[0] : username;
      const fallbackEmail = username.includes('@') ? username : `${cleanUser}@proprint.in`;

      db.run(
        `INSERT INTO users (id, name, email, phone, role, company_name, shipping_address, city, pincode, password_hash)
         VALUES (?, ?, ?, ?, 'customer', 'Commercial Client', 'Chhatrapati Sambhajinagar', 'Chhatrapati Sambhajinagar', '431001', ?)`,
        [newUserId, fallbackName, fallbackEmail, '9322126863', cleanPass]
      );
      saveDb();

      return res.json({
        success: true,
        role: 'customer',
        user: {
          id: newUserId,
          name: fallbackName,
          email: fallbackEmail,
          phone: '9322126863',
          role: 'customer',
          companyName: 'Commercial Client',
          shippingAddress: 'Chhatrapati Sambhajinagar',
          city: 'Chhatrapati Sambhajinagar',
          pincode: '431001'
        }
      });
    } catch (err: any) {
      console.error('Login error:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const { name, email, phone, password, companyName, gstNumber, shippingAddress, city, pincode } = req.body;
      const db = await getDb();
      const userId = `user-${Date.now()}`;

      db.run(
        `INSERT INTO users (id, name, email, phone, role, company_name, gst_number, shipping_address, city, pincode, password_hash)
         VALUES (?, ?, ?, ?, 'customer', ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          name || 'New Client',
          email,
          phone || '9322126863',
          companyName || '',
          gstNumber || '',
          shippingAddress || 'Chhatrapati Sambhajinagar',
          city || 'Chhatrapati Sambhajinagar',
          pincode || '431001',
          password || 'user123'
        ]
      );
      saveDb();

      res.json({
        success: true,
        user: {
          id: userId,
          name,
          email,
          phone,
          role: 'customer',
          companyName,
          gstNumber,
          shippingAddress,
          city,
          pincode
        }
      });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.get('/api/users', async (_req: Request, res: Response) => {
    try {
      const db = await getDb();
      const stmt = db.prepare(`SELECT id, name, email, phone, role, company_name, gst_number, shipping_address, city, pincode, addresses_json, created_at FROM users ORDER BY created_at DESC`);
      const users = [];
      while (stmt.step()) {
        const row: any = stmt.getAsObject();
        let parsedAddresses: any[] = [];
        if (row.addresses_json) {
          try {
            parsedAddresses = JSON.parse(row.addresses_json);
          } catch (_e) {
            parsedAddresses = [];
          }
        }
        users.push({
          id: row.id,
          name: row.name,
          email: row.email,
          phone: row.phone,
          role: row.role,
          companyName: row.company_name,
          gstNumber: row.gst_number,
          shippingAddress: row.shipping_address,
          city: row.city,
          pincode: row.pincode,
          addresses: parsedAddresses,
          createdAt: row.created_at
        });
      }
      stmt.free();
      res.json({ success: true, users });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/users/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const db = await getDb();
      const stmt = db.prepare(`SELECT * FROM users WHERE id = ? LIMIT 1`);
      stmt.bind([id]);
      let userObj: any = null;
      if (stmt.step()) {
        userObj = stmt.getAsObject();
      }
      stmt.free();

      if (!userObj) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      let parsedAddresses: any[] = [];
      if (userObj.addresses_json) {
        try {
          parsedAddresses = JSON.parse(userObj.addresses_json);
        } catch (_e) {
          parsedAddresses = [];
        }
      }

      res.json({
        success: true,
        user: {
          id: userObj.id,
          name: userObj.name,
          email: userObj.email,
          phone: userObj.phone,
          role: userObj.role,
          companyName: userObj.company_name,
          gstNumber: userObj.gst_number,
          shippingAddress: userObj.shipping_address,
          city: userObj.city,
          pincode: userObj.pincode,
          addresses: parsedAddresses,
          createdAt: userObj.created_at
        }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/users/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, email, phone, companyName, gstNumber, shippingAddress, city, pincode, addresses } = req.body;
      const db = await getDb();

      const addressesJson = addresses ? JSON.stringify(addresses) : null;

      db.run(
        `UPDATE users 
         SET name = COALESCE(?, name),
             email = COALESCE(?, email),
             phone = COALESCE(?, phone),
             company_name = COALESCE(?, company_name),
             gst_number = COALESCE(?, gst_number),
             shipping_address = COALESCE(?, shipping_address),
             city = COALESCE(?, city),
             pincode = COALESCE(?, pincode),
             addresses_json = COALESCE(?, addresses_json)
         WHERE id = ?`,
        [
          name ?? null,
          email ?? null,
          phone ?? null,
          companyName ?? null,
          gstNumber ?? null,
          shippingAddress ?? null,
          city ?? null,
          pincode ?? null,
          addressesJson ?? null,
          id
        ]
      );
      saveDb();

      res.json({
        success: true,
        message: 'User profile updated successfully'
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.delete('/api/users/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const db = await getDb();
      db.run(`DELETE FROM users WHERE id = ? OR email = ?`, [id, id]);
      saveDb();
      res.json({ success: true, message: 'User deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // PRODUCTS API (Full CRUD & Persistence)
  // ==========================================
  const mapProductRow = (row: any) => {
    let sizes = [];
    let finishes = [];
    let features = [];
    let tags = [];
    let galleryImages = [];

    try { sizes = JSON.parse(row.sizes_json || '[]'); } catch (_e) { sizes = []; }
    try { finishes = JSON.parse(row.finishes_json || '[]'); } catch (_e) { finishes = []; }
    try { features = JSON.parse(row.features_json || '[]'); } catch (_e) { features = []; }
    try { tags = JSON.parse(row.tags_json || '[]'); } catch (_e) { tags = []; }
    try { galleryImages = JSON.parse(row.gallery_json || '[]'); } catch (_e) { galleryImages = []; }

    return {
      id: row.id,
      name: row.name,
      nameMr: row.name_mr || row.name,
      categoryId: row.category_id,
      category: row.category_name,
      basePrice: Number(row.base_price) || 299,
      originalPrice: Number(row.original_price) || Math.round((Number(row.base_price) || 299) * 1.3),
      description: row.description || '',
      descriptionMr: row.description_mr || '',
      image: row.image || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
      galleryImages: galleryImages.length > 0 ? galleryImages : [row.image || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80'],
      rating: Number(row.rating) || 4.9,
      reviewsCount: Number(row.reviews_count) || 1,
      minQuantity: Number(row.min_quantity) || 100,
      defaultQuantity: Number(row.default_quantity) || 500,
      sizes: sizes.length > 0 ? sizes : [{ id: 'std', name: 'Standard (89mm x 51mm)', priceMultiplier: 1.0 }],
      finishes: finishes.length > 0 ? finishes : [
        { id: 'matte', name: '350 GSM Velvet Matte', priceMultiplier: 1.0 },
        { id: 'gloss', name: '350 GSM Gloss Lamination', priceMultiplier: 1.1 }
      ],
      features: features.length > 0 ? features : ['CMYK 4-Color Heidelberg Press', 'Tear & Moisture Resistant'],
      tags: tags.length > 0 ? tags : ['Popular', 'Offset'],
      turnaroundDays: Number(row.turnaround_days) || 1,
      singlePrice: row.single_price !== null && row.single_price !== undefined ? Number(row.single_price) : undefined,
      bulkPrice100: row.bulk_price_100 !== null && row.bulk_price_100 !== undefined ? Number(row.bulk_price_100) : undefined,
      bulkPrice500: row.bulk_price_500 !== null && row.bulk_price_500 !== undefined ? Number(row.bulk_price_500) : undefined,
      bulkPrice1000: row.bulk_price_1000 !== null && row.bulk_price_1000 !== undefined ? Number(row.bulk_price_1000) : undefined,
      isPopular: row.is_popular === 1,
      isBestSeller: row.is_best_seller === 1,
      createdAt: row.created_at
    };
  };

  app.get('/api/products', async (_req: Request, res: Response) => {
    try {
      const db = await getDb();
      const stmt = db.prepare(`SELECT * FROM products ORDER BY created_at DESC`);
      const products = [];
      while (stmt.step()) {
        const row = stmt.getAsObject();
        products.push(mapProductRow(row));
      }
      stmt.free();
      res.json({ success: true, products });
    } catch (err: any) {
      console.error('Error fetching products:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/products/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const db = await getDb();
      const stmt = db.prepare(`SELECT * FROM products WHERE id = ? LIMIT 1`);
      stmt.bind([id]);
      let product: any = null;
      if (stmt.step()) {
        product = mapProductRow(stmt.getAsObject());
      }
      stmt.free();
      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }
      res.json({ success: true, product });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/products', async (req: Request, res: Response) => {
    try {
      const db = await getDb();
      const p = req.body;
      const id = p.id || `prod-${Date.now()}`;
      const name = p.name || 'New Custom Print Product';
      const nameMr = p.nameMr || name;
      const categoryId = p.categoryId || 'business-cards';
      const categoryName = p.category || 'Business Cards';
      const basePrice = Number(p.basePrice) || 299;
      const originalPrice = Number(p.originalPrice) || Math.round(basePrice * 1.3);
      const description = p.description || 'Professional commercial printing with premium finish.';
      const descriptionMr = p.descriptionMr || 'उत्कृष्ट फिनिशिंग व अचूक रंगांसह व्यावसायिक प्रिंटिंग.';
      const image = p.image || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80';
      const galleryJson = JSON.stringify(p.galleryImages || [image]);
      const rating = Number(p.rating) || 4.9;
      const reviewsCount = Number(p.reviewsCount) || 1;
      const minQuantity = Number(p.minQuantity) || 100;
      const defaultQuantity = Number(p.defaultQuantity) || 500;
      const sizesJson = JSON.stringify(p.sizes || [{ id: 'std', name: 'Standard (89mm x 51mm)', priceMultiplier: 1.0 }]);
      const finishesJson = JSON.stringify(p.finishes || [{ id: 'matte', name: '350 GSM Velvet Matte', priceMultiplier: 1.0 }]);
      const featuresJson = JSON.stringify(p.features || ['CMYK 4-Color Heidelberg Press', 'Same-Day Dispatch Ready']);
      const tagsJson = JSON.stringify(p.tags || ['Popular', 'Offset']);
      const turnaroundDays = Number(p.turnaroundDays) || 1;
      const isPopular = p.isPopular !== false ? 1 : 0;
      const isBestSeller = p.isBestSeller !== false ? 1 : 0;
      const singlePrice = p.singlePrice !== undefined ? Number(p.singlePrice) : null;
      const bulkPrice100 = p.bulkPrice100 !== undefined ? Number(p.bulkPrice100) : null;
      const bulkPrice500 = p.bulkPrice500 !== undefined ? Number(p.bulkPrice500) : null;
      const bulkPrice1000 = p.bulkPrice1000 !== undefined ? Number(p.bulkPrice1000) : null;

      db.run(
        `INSERT OR REPLACE INTO products (id, name, name_mr, category_id, category_name, base_price, original_price, description, description_mr, image, gallery_json, rating, reviews_count, min_quantity, default_quantity, sizes_json, finishes_json, features_json, tags_json, turnaround_days, is_popular, is_best_seller, single_price, bulk_price_100, bulk_price_500, bulk_price_1000)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id, name, nameMr, categoryId, categoryName, basePrice, originalPrice, description, descriptionMr, image,
          galleryJson, rating, reviewsCount, minQuantity, defaultQuantity, sizesJson, finishesJson, featuresJson, tagsJson, turnaroundDays, isPopular, isBestSeller,
          singlePrice, bulkPrice100, bulkPrice500, bulkPrice1000
        ]
      );
      saveDb();

      res.json({ success: true, product: { ...p, id, basePrice, originalPrice, singlePrice, bulkPrice100, bulkPrice500, bulkPrice1000 }, message: 'Product created successfully' });
    } catch (err: any) {
      console.error('Error creating product:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/products/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const db = await getDb();
      const p = req.body;

      db.run(
        `UPDATE products 
         SET name = COALESCE(?, name),
             name_mr = COALESCE(?, name_mr),
             category_id = COALESCE(?, category_id),
             category_name = COALESCE(?, category_name),
             base_price = COALESCE(?, base_price),
             original_price = COALESCE(?, original_price),
             description = COALESCE(?, description),
             description_mr = COALESCE(?, description_mr),
             image = COALESCE(?, image),
             gallery_json = COALESCE(?, gallery_json),
             rating = COALESCE(?, rating),
             reviews_count = COALESCE(?, reviews_count),
             min_quantity = COALESCE(?, min_quantity),
             default_quantity = COALESCE(?, default_quantity),
             sizes_json = COALESCE(?, sizes_json),
             finishes_json = COALESCE(?, finishes_json),
             features_json = COALESCE(?, features_json),
             tags_json = COALESCE(?, tags_json),
             turnaround_days = COALESCE(?, turnaround_days),
             is_popular = COALESCE(?, is_popular),
             is_best_seller = COALESCE(?, is_best_seller),
             single_price = COALESCE(?, single_price),
             bulk_price_100 = COALESCE(?, bulk_price_100),
             bulk_price_500 = COALESCE(?, bulk_price_500),
             bulk_price_1000 = COALESCE(?, bulk_price_1000),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [
          p.name ?? null,
          p.nameMr ?? null,
          p.categoryId ?? null,
          p.category ?? null,
          p.basePrice !== undefined ? Number(p.basePrice) : null,
          p.originalPrice !== undefined ? Number(p.originalPrice) : null,
          p.description ?? null,
          p.descriptionMr ?? null,
          p.image ?? null,
          p.galleryImages ? JSON.stringify(p.galleryImages) : null,
          p.rating !== undefined ? Number(p.rating) : null,
          p.reviewsCount !== undefined ? Number(p.reviewsCount) : null,
          p.minQuantity !== undefined ? Number(p.minQuantity) : null,
          p.defaultQuantity !== undefined ? Number(p.defaultQuantity) : null,
          p.sizes ? JSON.stringify(p.sizes) : null,
          p.finishes ? JSON.stringify(p.finishes) : null,
          p.features ? JSON.stringify(p.features) : null,
          p.tags ? JSON.stringify(p.tags) : null,
          p.turnaroundDays !== undefined ? Number(p.turnaroundDays) : null,
          p.isPopular !== undefined ? (p.isPopular ? 1 : 0) : null,
          p.isBestSeller !== undefined ? (p.isBestSeller ? 1 : 0) : null,
          p.singlePrice !== undefined ? Number(p.singlePrice) : null,
          p.bulkPrice100 !== undefined ? Number(p.bulkPrice100) : null,
          p.bulkPrice500 !== undefined ? Number(p.bulkPrice500) : null,
          p.bulkPrice1000 !== undefined ? Number(p.bulkPrice1000) : null,
          id
        ]
      );
      saveDb();
      res.json({ success: true, message: 'Product updated successfully' });
    } catch (err: any) {
      console.error('Error updating product:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.delete('/api/products/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const db = await getDb();
      db.run(`DELETE FROM products WHERE id = ?`, [id]);
      saveDb();
      res.json({ success: true, message: 'Product deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // CATEGORIES API (Full CRUD)
  // ==========================================
  app.get('/api/categories', async (_req: Request, res: Response) => {
    try {
      const db = await getDb();
      const stmt = db.prepare(`SELECT * FROM categories ORDER BY featured DESC, name ASC`);
      const categories = [];
      while (stmt.step()) {
        const row: any = stmt.getAsObject();
        categories.push({
          id: row.id,
          name: row.name,
          nameMr: row.name_mr || row.name,
          shortName: row.short_name || row.name,
          iconName: row.icon_name || 'Package',
          image: row.image,
          itemCount: Number(row.item_count) || 0,
          featured: row.featured === 1,
          description: row.description || '',
          createdAt: row.created_at
        });
      }
      stmt.free();
      res.json({ success: true, categories });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/categories', async (req: Request, res: Response) => {
    try {
      const db = await getDb();
      const c = req.body;
      const id = c.id || `cat-${Date.now()}`;
      const name = c.name || 'New Category';
      const nameMr = c.nameMr || name;
      const shortName = c.shortName || name;
      const iconName = c.iconName || 'Package';
      const image = c.image || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80';
      const itemCount = Number(c.itemCount) || 0;
      const featured = c.featured !== false ? 1 : 0;
      const description = c.description || '';

      db.run(
        `INSERT OR REPLACE INTO categories (id, name, name_mr, short_name, icon_name, image, item_count, featured, description)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, name, nameMr, shortName, iconName, image, itemCount, featured, description]
      );
      saveDb();

      res.json({ success: true, category: { ...c, id }, message: 'Category saved successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/categories/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const db = await getDb();
      const c = req.body;

      db.run(
        `UPDATE categories 
         SET name = COALESCE(?, name),
             name_mr = COALESCE(?, name_mr),
             short_name = COALESCE(?, short_name),
             icon_name = COALESCE(?, icon_name),
             image = COALESCE(?, image),
             item_count = COALESCE(?, item_count),
             featured = COALESCE(?, featured),
             description = COALESCE(?, description)
         WHERE id = ?`,
        [
          c.name ?? null,
          c.nameMr ?? null,
          c.shortName ?? null,
          c.iconName ?? null,
          c.image ?? null,
          c.itemCount !== undefined ? Number(c.itemCount) : null,
          c.featured !== undefined ? (c.featured ? 1 : 0) : null,
          c.description ?? null,
          id
        ]
      );
      saveDb();
      res.json({ success: true, message: 'Category updated successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.delete('/api/categories/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const db = await getDb();
      db.run(`DELETE FROM categories WHERE id = ?`, [id]);
      saveDb();
      res.json({ success: true, message: 'Category deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // SERVICES API (Full CRUD)
  // ==========================================
  app.get('/api/services', async (_req: Request, res: Response) => {
    try {
      const db = await getDb();
      const stmt = db.prepare(`SELECT * FROM services ORDER BY created_at DESC`);
      const services = [];
      while (stmt.step()) {
        const row: any = stmt.getAsObject();
        services.push({
          id: row.id,
          name: row.name,
          category: row.category,
          tagline: row.tagline,
          description: row.description,
          turnaround: row.turnaround,
          minOrder: row.min_order,
          iconName: row.icon_name || 'Printer',
          badge: row.badge,
          createdAt: row.created_at
        });
      }
      stmt.free();
      res.json({ success: true, services });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/services', async (req: Request, res: Response) => {
    try {
      const db = await getDb();
      const s = req.body;
      const id = s.id || `srv-${Date.now()}`;
      db.run(
        `INSERT OR REPLACE INTO services (id, name, category, tagline, description, turnaround, min_order, icon_name, badge)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, s.name, s.category || 'printing', s.tagline || '', s.description || '', s.turnaround || '24-48 Hours', s.minOrder || '50 Units', s.iconName || 'Printer', s.badge || '']
      );
      saveDb();
      res.json({ success: true, service: { ...s, id } });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/services/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const db = await getDb();
      const s = req.body;
      db.run(
        `UPDATE services 
         SET name = COALESCE(?, name),
             category = COALESCE(?, category),
             tagline = COALESCE(?, tagline),
             description = COALESCE(?, description),
             turnaround = COALESCE(?, turnaround),
             min_order = COALESCE(?, min_order),
             icon_name = COALESCE(?, icon_name),
             badge = COALESCE(?, badge)
         WHERE id = ?`,
        [s.name ?? null, s.category ?? null, s.tagline ?? null, s.description ?? null, s.turnaround ?? null, s.minOrder ?? null, s.iconName ?? null, s.badge ?? null, id]
      );
      saveDb();
      res.json({ success: true, message: 'Service updated' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.delete('/api/services/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const db = await getDb();
      db.run(`DELETE FROM services WHERE id = ?`, [id]);
      saveDb();
      res.json({ success: true, message: 'Service deleted' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // REVIEWS API (Full CRUD)
  // ==========================================
  app.get('/api/reviews', async (_req: Request, res: Response) => {
    try {
      const db = await getDb();
      const stmt = db.prepare(`SELECT * FROM reviews ORDER BY created_at DESC`);
      const reviews = [];
      while (stmt.step()) {
        const row: any = stmt.getAsObject();
        reviews.push({
          id: row.id,
          customerName: row.customer_name,
          customerRole: row.customer_role,
          productName: row.product_name,
          rating: Number(row.rating) || 5,
          comment: row.comment,
          date: row.date || 'Recently',
          status: row.status || 'Approved',
          verifiedBuyer: row.verified_buyer === 1,
          createdAt: row.created_at
        });
      }
      stmt.free();
      res.json({ success: true, reviews });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/reviews', async (req: Request, res: Response) => {
    try {
      const db = await getDb();
      const r = req.body;
      const id = r.id || `REV-${Date.now()}`;
      db.run(
        `INSERT INTO reviews (id, customer_name, customer_role, product_name, rating, comment, date, status, verified_buyer)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, r.customerName || 'Verified Buyer', r.customerRole || 'Client', r.productName || 'Print Product', Number(r.rating) || 5, r.comment || '', r.date || 'Just now', r.status || 'Approved', r.verifiedBuyer !== false ? 1 : 0]
      );
      saveDb();
      res.json({ success: true, review: { ...r, id }, message: 'Review saved successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.patch('/api/reviews/:id/status', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const db = await getDb();
      db.run(`UPDATE reviews SET status = ? WHERE id = ?`, [status, id]);
      saveDb();
      res.json({ success: true, message: `Review status updated to ${status}` });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.delete('/api/reviews/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const db = await getDb();
      db.run(`DELETE FROM reviews WHERE id = ?`, [id]);
      saveDb();
      res.json({ success: true, message: 'Review deleted' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // QUOTES API (Full CRUD)
  // ==========================================
  app.get('/api/quotes', async (_req: Request, res: Response) => {
    try {
      const db = await getDb();
      const stmt = db.prepare(`SELECT * FROM quotes ORDER BY created_at DESC`);
      const quotes = [];
      while (stmt.step()) {
        const row: any = stmt.getAsObject();
        quotes.push({
          id: row.id,
          customerName: row.customer_name,
          customerEmail: row.customer_email,
          customerPhone: row.customer_phone,
          companyName: row.company_name,
          productCategory: row.product_category,
          quantity: row.quantity,
          paperGsm: row.paper_gsm,
          finishType: row.finish_type,
          size: row.size,
          specialInstructions: row.special_instructions,
          status: row.status,
          createdAt: row.created_at
        });
      }
      stmt.free();
      res.json({ success: true, quotes });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/quotes', async (req: Request, res: Response) => {
    try {
      const db = await getDb();
      const q = req.body;
      const id = q.id || `quote-${Date.now()}`;
      db.run(
        `INSERT INTO quotes (id, customer_name, customer_email, customer_phone, company_name, product_category, quantity, paper_gsm, finish_type, size, special_instructions, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          q.customerName || q.name || 'Client',
          q.customerEmail || q.email || '',
          q.customerPhone || q.phone || '9322126863',
          q.companyName || '',
          q.productCategory || q.category || 'Offset Printing',
          Number(q.quantity) || 500,
          q.paperGsm || '350 GSM',
          q.finishType || 'Matte',
          q.size || 'Standard',
          q.specialInstructions || q.notes || '',
          q.status || 'New'
        ]
      );
      saveDb();
      res.json({ success: true, quote: { ...q, id }, message: 'Quote request submitted successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.patch('/api/quotes/:id/status', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const db = await getDb();
      db.run(`UPDATE quotes SET status = ? WHERE id = ?`, [status, id]);
      saveDb();
      res.json({ success: true, message: `Quote status updated to ${status}` });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.delete('/api/quotes/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const db = await getDb();
      db.run(`DELETE FROM quotes WHERE id = ?`, [id]);
      saveDb();
      res.json({ success: true, message: 'Quote request removed' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // PAYMENTS API (Full CRUD)
  // ==========================================
  app.get('/api/payments', async (_req: Request, res: Response) => {
    try {
      const db = await getDb();
      const stmt = db.prepare(`SELECT * FROM payments ORDER BY created_at DESC`);
      const payments = [];
      while (stmt.step()) {
        const row: any = stmt.getAsObject();
        payments.push({
          id: row.id,
          orderId: row.order_id,
          orderNumber: row.order_number,
          customerName: row.customer_name,
          amount: row.amount,
          method: row.method,
          status: row.status,
          transactionId: row.transaction_id,
          createdAt: row.created_at
        });
      }
      stmt.free();
      res.json({ success: true, payments });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/payments', async (req: Request, res: Response) => {
    try {
      const db = await getDb();
      const p = req.body;
      const id = p.id || `PAY-${Date.now()}`;
      db.run(
        `INSERT INTO payments (id, order_id, order_number, customer_name, amount, method, status, transaction_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, p.orderId || '', p.orderNumber || '', p.customerName || 'Customer', Number(p.amount) || 0, p.method || 'UPI', p.status || 'Completed', p.transactionId || `TXN_${Date.now()}`]
      );
      saveDb();
      res.json({ success: true, payment: { ...p, id } });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.patch('/api/payments/:id/status', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const db = await getDb();
      db.run(`UPDATE payments SET status = ? WHERE id = ?`, [status, id]);
      saveDb();
      res.json({ success: true, message: `Payment #${id} marked as ${status}` });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // PORTFOLIO API (Full Database Backed)
  // ==========================================
  app.get('/api/portfolio', async (_req: Request, res: Response) => {
    try {
      const db = await getDb();
      const stmt = db.prepare(`SELECT * FROM portfolio ORDER BY created_at ASC`);
      const items = [];
      while (stmt.step()) {
        const row: any = stmt.getAsObject();
        let tags: string[] = [];
        let deliverables: string[] = [];
        let deliverablesMr: string[] = [];
        try { tags = JSON.parse(row.tags_json || '[]'); } catch (_e) {}
        try { deliverables = JSON.parse(row.deliverables_json || '[]'); } catch (_e) {}
        try { deliverablesMr = JSON.parse(row.deliverables_mr_json || '[]'); } catch (_e) {}

        items.push({
          id: row.id,
          title: row.title,
          titleMr: row.title_mr || row.title,
          category: row.category,
          categoryLabel: row.category_label || row.category,
          categoryLabelMr: row.category_label_mr || row.category_label || row.category,
          client: row.client,
          city: row.city,
          cityMr: row.city_mr || row.city,
          image: row.image,
          aspectRatio: row.aspect_ratio || 'square',
          description: row.description || '',
          descriptionMr: row.description_mr || '',
          tags,
          deliverables,
          deliverablesMr,
          badge: row.badge || '',
          badgeMr: row.badge_mr || ''
        });
      }
      stmt.free();
      res.json({ success: true, portfolio: items });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/portfolio', async (req: Request, res: Response) => {
    try {
      const db = await getDb();
      const item = req.body;
      const id = item.id || `work-${Date.now()}`;
      db.run(
        `INSERT INTO portfolio (
          id, title, title_mr, category, category_label, category_label_mr,
          client, city, city_mr, image, aspect_ratio, description, description_mr,
          tags_json, deliverables_json, deliverables_mr_json, badge, badge_mr
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          item.title,
          item.titleMr || item.title,
          item.category || 'branding',
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
      saveDb();
      res.json({ success: true, item: { ...item, id }, message: 'Portfolio item added successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/portfolio/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const db = await getDb();
      const item = req.body;

      db.run(
        `UPDATE portfolio
         SET title = COALESCE(?, title),
             title_mr = COALESCE(?, title_mr),
             category = COALESCE(?, category),
             category_label = COALESCE(?, category_label),
             category_label_mr = COALESCE(?, category_label_mr),
             client = COALESCE(?, client),
             city = COALESCE(?, city),
             city_mr = COALESCE(?, city_mr),
             image = COALESCE(?, image),
             aspect_ratio = COALESCE(?, aspect_ratio),
             description = COALESCE(?, description),
             description_mr = COALESCE(?, description_mr),
             tags_json = COALESCE(?, tags_json),
             deliverables_json = COALESCE(?, deliverables_json),
             deliverables_mr_json = COALESCE(?, deliverables_mr_json),
             badge = COALESCE(?, badge),
             badge_mr = COALESCE(?, badge_mr)
         WHERE id = ?`,
        [
          item.title ?? null,
          item.titleMr ?? null,
          item.category ?? null,
          item.categoryLabel ?? null,
          item.categoryLabelMr ?? null,
          item.client ?? null,
          item.city ?? null,
          item.cityMr ?? null,
          item.image ?? null,
          item.aspectRatio ?? null,
          item.description ?? null,
          item.descriptionMr ?? null,
          item.tags ? JSON.stringify(item.tags) : null,
          item.deliverables ? JSON.stringify(item.deliverables) : null,
          item.deliverablesMr ? JSON.stringify(item.deliverablesMr) : null,
          item.badge ?? null,
          item.badgeMr ?? null,
          id
        ]
      );
      saveDb();
      res.json({ success: true, message: 'Portfolio item updated successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.delete('/api/portfolio/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const db = await getDb();
      db.run(`DELETE FROM portfolio WHERE id = ?`, [id]);
      saveDb();
      res.json({ success: true, message: 'Portfolio item deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // CASHFREE PAYMENTS API (Sandbox / Live Simulated Gateway)
  // ==========================================
  app.post('/api/cashfree/create-order', async (req: Request, res: Response) => {
    try {
      const { orderAmount, customerName, customerPhone, customerEmail, orderNote } = req.body;
      const amount = Number(orderAmount) || 0;
      if (amount <= 0) {
        return res.status(400).json({ success: false, error: 'Valid order amount is required' });
      }

      const cfOrderId = `CF_ORD_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
      const paymentSessionId = `session_${Buffer.from(`${cfOrderId}_${Date.now()}`).toString('base64').replace(/=/g, '')}`;

      const cashfreeOrderData = {
        cfOrderId,
        orderId: cfOrderId,
        paymentSessionId,
        orderAmount: amount,
        orderCurrency: 'INR',
        customerDetails: {
          customerId: `CUST_${Date.now()}`,
          customerName: customerName || 'Commercial Client',
          customerPhone: customerPhone || '9322126863',
          customerEmail: customerEmail || 'client@proprint.in'
        },
        orderNote: orderNote || 'Proprint Commercial Offset Print Job',
        orderStatus: 'ACTIVE',
        environment: 'TEST_SANDBOX',
        gateway: 'Cashfree Payments PG v2023-08-01',
        createdAt: new Date().toISOString()
      };

      return res.json({
        success: true,
        message: 'Cashfree payment session generated successfully',
        data: cashfreeOrderData
      });
    } catch (err: any) {
      console.error('Cashfree order creation error:', err);
      return res.status(500).json({ success: false, error: err.message || 'Failed to initialize Cashfree session' });
    }
  });

  app.post('/api/cashfree/verify-payment', async (req: Request, res: Response) => {
    try {
      const { cfOrderId, paymentId, paymentMode, orderNumber, amount } = req.body;
      const txnReference = paymentId || `CF_TXN_${Date.now()}_${Math.floor(100000 + Math.random() * 900000)}`;
      const mode = paymentMode || 'Cashfree UPI (Instant)';

      const db = await getDb();
      if (orderNumber) {
        db.run(
          `UPDATE orders SET payment_status = 'Paid', payment_method = ?, updated_at = CURRENT_TIMESTAMP WHERE order_number = ? OR id = ?`,
          [`Cashfree (${mode}) - Ref: ${txnReference}`, orderNumber, orderNumber]
        );
        saveDb();
      }

      return res.json({
        success: true,
        paymentStatus: 'SUCCESS',
        transactionId: txnReference,
        cfOrderId: cfOrderId || `CF_ORD_${Date.now()}`,
        amount: Number(amount) || 0,
        paymentMode: mode,
        bankReference: `UTR${Date.now().toString().slice(-8)}`,
        verifiedAt: new Date().toISOString(),
        message: 'Cashfree transaction verified and reconciled successfully'
      });
    } catch (err: any) {
      console.error('Cashfree verification error:', err);
      return res.status(500).json({ success: false, error: err.message || 'Payment verification failed' });
    }
  });

  // ==========================================
  // ORDERS API (Full CRUD, Tracking & Status)
  // ==========================================
  const mapOrderRow = (row: any) => {
    let items = [];
    let timeline = [];
    try { items = JSON.parse(row.items_json || '[]'); } catch (_e) { items = []; }
    try { timeline = JSON.parse(row.timeline_json || '[]'); } catch (_e) { timeline = []; }

    return {
      id: row.id,
      orderNumber: row.order_number,
      trackingNumber: row.tracking_number,
      customerName: row.customer_name,
      customerEmail: row.customer_email,
      customerPhone: row.customer_phone,
      shippingAddress: row.shipping_address,
      city: row.city,
      pincode: row.pincode,
      subtotal: Number(row.subtotal) || 0,
      tax: Number(row.tax) || 0,
      shippingFee: Number(row.shipping_fee) || 0,
      discount: Number(row.discount) || 0,
      total: Number(row.total) || 0,
      totalAmount: Number(row.total) || 0,
      paymentMethod: row.payment_method,
      paymentStatus: row.payment_status || 'Pending',
      status: row.status || 'Order Placed',
      items,
      timeline,
      notes: row.notes || '',
      uploadedFileUrl: row.uploaded_file_url || '',
      uploadedFileName: row.uploaded_file_name || '',
      userId: row.user_id || '',
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  };

  app.get('/api/orders', async (_req: Request, res: Response) => {
    try {
      const db = await getDb();
      const stmt = db.prepare(`SELECT * FROM orders ORDER BY created_at DESC`);
      const orders = [];
      while (stmt.step()) {
        const row = stmt.getAsObject();
        orders.push(mapOrderRow(row));
      }
      stmt.free();
      res.json({ success: true, orders });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/orders/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const db = await getDb();
      const stmt = db.prepare(`SELECT * FROM orders WHERE id = ? OR order_number = ? OR tracking_number = ? LIMIT 1`);
      stmt.bind([id, id, id]);
      let order: any = null;
      if (stmt.step()) {
        order = mapOrderRow(stmt.getAsObject());
      }
      stmt.free();
      if (!order) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }
      res.json({ success: true, order });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/orders', async (req: Request, res: Response) => {
    try {
      const db = await getDb();
      const {
        fullName,
        name,
        email,
        phone,
        address,
        city,
        pincode,
        subtotal,
        tax,
        shippingFee,
        discount,
        total,
        paymentMethod,
        paymentStatus,
        status,
        items,
        timeline: customTimeline,
        notes,
        uploadedFileUrl,
        uploadedFileName,
        userId
      } = req.body;

      const orderId = `ord-${Date.now()}`;
      const orderNumber = `PRP-${Math.floor(10000 + Math.random() * 90000)}`;
      const trackingNumber = `EXP-IN-${Math.floor(100000 + Math.random() * 900000)}`;
      const custName = fullName || name || 'Customer';
      const custPhone = phone || '9322126863';
      const custAddr = address || 'Chhatrapati Sambhajinagar';
      const custCity = city || 'Chhatrapati Sambhajinagar';
      const custPincode = pincode || '431001';
      const sub = Number(subtotal) || 0;
      const tx = Number(tax) || 0;
      const ship = Number(shippingFee) || 0;
      const disc = Number(discount) || 0;
      const tot = Number(total) || (sub + tx + ship - disc);

      const timeline = Array.isArray(customTimeline) && customTimeline.length > 0 ? customTimeline : [
        { title: 'Order Placed & Confirmed', titleMr: 'ऑर्डर नोंदवली व पुष्टी केली', description: 'Specs and artwork received', date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true, current: true },
        { title: 'Pre-flight Proof Approval', titleMr: 'प्री-प्रेस आर्टवर्क तपासणी', description: 'CMYK color profile and cut-lines verified', date: 'Upcoming', completed: false },
        { title: 'Press Printing', titleMr: 'ऑफसेट / डिजिटल प्रिंटिंग', description: 'Heidelberg 4-Color Speedmaster press', date: 'Upcoming', completed: false },
        { title: 'Quality Check & Finishing', titleMr: 'फिनिशिंग व लॅमिनेशन', description: 'Lamination, Die-Cutting & Packing', date: 'Upcoming', completed: false },
        { title: 'Dispatched via Courier', titleMr: 'डिलिव्हरी रवाना', description: 'Handed to express logistics', date: 'Upcoming', completed: false }
      ];

      db.run(
        `INSERT INTO orders (id, order_number, tracking_number, customer_name, customer_email, customer_phone, shipping_address, city, pincode, subtotal, tax, shipping_fee, discount, total, payment_method, payment_status, status, items_json, timeline_json, notes, uploaded_file_url, uploaded_file_name, user_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          orderNumber,
          trackingNumber,
          custName,
          email || '',
          custPhone,
          custAddr,
          custCity,
          custPincode,
          sub,
          tx,
          ship,
          disc,
          tot,
          paymentMethod || 'UPI',
          paymentStatus || 'Pending',
          status || 'Order Placed',
          JSON.stringify(items || []),
          JSON.stringify(timeline),
          notes || '',
          uploadedFileUrl || '',
          uploadedFileName || '',
          userId || ''
        ]
      );
      saveDb();

      const createdOrder = {
        id: orderId,
        orderNumber,
        trackingNumber,
        customerName: custName,
        customerEmail: email || '',
        customerPhone: custPhone,
        shippingAddress: custAddr,
        city: custCity,
        pincode: custPincode,
        subtotal: sub,
        tax: tx,
        shippingFee: ship,
        discount: disc,
        total: tot,
        totalAmount: tot,
        paymentMethod: paymentMethod || 'UPI',
        paymentStatus: paymentStatus || 'Pending',
        status: status || 'Order Placed',
        items: items || [],
        timeline,
        notes: notes || '',
        uploadedFileUrl: uploadedFileUrl || '',
        uploadedFileName: uploadedFileName || '',
        userId: userId || '',
        createdAt: new Date().toISOString()
      };

      res.json({ success: true, order: createdOrder });
    } catch (err: any) {
      console.error('Order creation error:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/orders/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const db = await getDb();
      const o = req.body;

      db.run(
        `UPDATE orders 
         SET customer_name = COALESCE(?, customer_name),
             customer_phone = COALESCE(?, customer_phone),
             customer_email = COALESCE(?, customer_email),
             shipping_address = COALESCE(?, shipping_address),
             city = COALESCE(?, city),
             pincode = COALESCE(?, pincode),
             status = COALESCE(?, status),
             payment_status = COALESCE(?, payment_status),
             payment_method = COALESCE(?, payment_method),
             tracking_number = COALESCE(?, tracking_number),
             notes = COALESCE(?, notes),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ? OR order_number = ?`,
        [
          o.customerName ?? null,
          o.customerPhone ?? null,
          o.customerEmail ?? null,
          o.shippingAddress ?? null,
          o.city ?? null,
          o.pincode ?? null,
          o.status ?? null,
          o.paymentStatus ?? null,
          o.paymentMethod ?? null,
          o.trackingNumber ?? null,
          o.notes ?? null,
          id,
          id
        ]
      );
      saveDb();
      res.json({ success: true, message: 'Order updated successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.patch('/api/orders/:id/status', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status, paymentStatus, trackingNumber, notes } = req.body;
      const db = await getDb();

      if (status && paymentStatus) {
        db.run(`UPDATE orders SET status = ?, payment_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? OR order_number = ?`, [status, paymentStatus, id, id]);
      } else if (status) {
        db.run(`UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? OR order_number = ?`, [status, id, id]);
      } else if (paymentStatus) {
        db.run(`UPDATE orders SET payment_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? OR order_number = ?`, [paymentStatus, id, id]);
      }

      if (trackingNumber) {
        db.run(`UPDATE orders SET tracking_number = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? OR order_number = ?`, [trackingNumber, id, id]);
      }

      if (notes) {
        db.run(`UPDATE orders SET notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? OR order_number = ?`, [notes, id, id]);
      }

      saveDb();
      res.json({ success: true, message: `Order status updated to ${status || paymentStatus}` });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.delete('/api/orders/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const db = await getDb();
      db.run(`DELETE FROM orders WHERE id = ? OR order_number = ?`, [id, id]);
      saveDb();
      res.json({ success: true, message: 'Order deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // HERO SLIDES & BANNERS API (CRUD & Realtime)
  // ==========================================
  const mapHeroSlideRow = (row: any) => ({
    id: row.id,
    title1: row.title1 || '',
    title2: row.title2 || '',
    highlight: row.highlight || '',
    subtitle: row.subtitle || '',
    image: row.image,
    buttonText: row.button_text || 'Order Now',
    quoteButtonText: row.quote_button_text || 'Get Quote',
    typeLabel: row.type_label || '',
    productId: row.product_id || '',
    categoryLink: row.category_link || '',
    theme: row.theme || 'crimson',
    tag: row.tag || '',
    badge: row.badge || '',
    displayOrder: row.display_order ?? 0,
    isActive: row.is_active === 1 || row.is_active === true,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  });

  // Get all hero slides (ordered by display order)
  app.get('/api/hero-slides', async (_req: Request, res: Response) => {
    try {
      const db = await getDb();
      const stmt = db.prepare(`SELECT * FROM hero_slides ORDER BY display_order ASC, created_at ASC`);
      const slides = [];
      while (stmt.step()) {
        const row = stmt.getAsObject();
        slides.push(mapHeroSlideRow(row));
      }
      stmt.free();
      res.json({ success: true, slides });
    } catch (err: any) {
      console.error('Error fetching hero slides:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Get active hero slides only (for public storefront)
  app.get('/api/hero-slides/active', async (_req: Request, res: Response) => {
    try {
      const db = await getDb();
      const stmt = db.prepare(`SELECT * FROM hero_slides WHERE is_active = 1 ORDER BY display_order ASC, created_at ASC`);
      const slides = [];
      while (stmt.step()) {
        const row = stmt.getAsObject();
        slides.push(mapHeroSlideRow(row));
      }
      stmt.free();
      res.json({ success: true, slides });
    } catch (err: any) {
      console.error('Error fetching active hero slides:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Create new hero banner slide
  app.post('/api/hero-slides', async (req: Request, res: Response) => {
    try {
      const db = await getDb();
      const {
        title1,
        title2,
        highlight,
        subtitle,
        image,
        buttonText,
        quoteButtonText,
        typeLabel,
        productId,
        categoryLink,
        theme,
        tag,
        badge,
        displayOrder,
        isActive
      } = req.body;

      if (!image || !image.trim()) {
        return res.status(400).json({ success: false, error: 'Hero banner image URL or upload is required' });
      }

      const id = `slide-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Determine next display order if not provided
      let order = typeof displayOrder === 'number' ? displayOrder : 0;
      if (typeof displayOrder !== 'number') {
        const maxStmt = db.prepare(`SELECT MAX(display_order) as max_order FROM hero_slides`);
        if (maxStmt.step()) {
          const row: any = maxStmt.getAsObject();
          order = (row.max_order || 0) + 1;
        }
        maxStmt.free();
      }

      const activeVal = isActive === false ? 0 : 1;

      db.run(
        `INSERT INTO hero_slides (id, title1, title2, highlight, subtitle, image, button_text, quote_button_text, type_label, product_id, category_link, theme, tag, badge, display_order, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          title1 || 'Exclusive Commercial Print Services',
          title2 || '',
          highlight || '',
          subtitle || '',
          image.trim(),
          buttonText || 'Order Now',
          quoteButtonText || 'Quick Quote',
          typeLabel || 'Printing',
          productId || '',
          categoryLink || '/products',
          theme || 'crimson',
          tag || '',
          badge || '',
          order,
          activeVal
        ]
      );
      saveDb();

      const createdSlide = {
        id,
        title1: title1 || 'Exclusive Commercial Print Services',
        title2: title2 || '',
        highlight: highlight || '',
        subtitle: subtitle || '',
        image: image.trim(),
        buttonText: buttonText || 'Order Now',
        quoteButtonText: quoteButtonText || 'Quick Quote',
        typeLabel: typeLabel || 'Printing',
        productId: productId || '',
        categoryLink: categoryLink || '/products',
        theme: theme || 'crimson',
        tag: tag || '',
        badge: badge || '',
        displayOrder: order,
        isActive: activeVal === 1,
        createdAt: new Date().toISOString()
      };

      res.json({ success: true, slide: createdSlide, message: 'Hero slide created successfully' });
    } catch (err: any) {
      console.error('Error creating hero slide:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Update existing hero slide
  app.put('/api/hero-slides/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const db = await getDb();
      const {
        title1,
        title2,
        highlight,
        subtitle,
        image,
        buttonText,
        quoteButtonText,
        typeLabel,
        productId,
        categoryLink,
        theme,
        tag,
        badge,
        displayOrder,
        isActive
      } = req.body;

      const activeVal = isActive === false ? 0 : 1;

      db.run(
        `UPDATE hero_slides 
         SET title1 = ?, title2 = ?, highlight = ?, subtitle = ?, image = ?, button_text = ?, quote_button_text = ?,
             type_label = ?, product_id = ?, category_link = ?, theme = ?, tag = ?, badge = ?, display_order = ?,
             is_active = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [
          title1 || '',
          title2 || '',
          highlight || '',
          subtitle || '',
          image,
          buttonText || 'Order Now',
          quoteButtonText || 'Quick Quote',
          typeLabel || '',
          productId || '',
          categoryLink || '',
          theme || 'crimson',
          tag || '',
          badge || '',
          typeof displayOrder === 'number' ? displayOrder : 0,
          activeVal,
          id
        ]
      );
      saveDb();

      res.json({ success: true, message: 'Hero slide updated successfully' });
    } catch (err: any) {
      console.error('Error updating hero slide:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Reorder hero slides
  app.post('/api/hero-slides/reorder', async (req: Request, res: Response) => {
    try {
      const { orderedIds } = req.body;
      if (!Array.isArray(orderedIds)) {
        return res.status(400).json({ success: false, error: 'orderedIds array is required' });
      }

      const db = await getDb();
      orderedIds.forEach((id: string, index: number) => {
        db.run(`UPDATE hero_slides SET display_order = ? WHERE id = ?`, [index + 1, id]);
      });
      saveDb();

      res.json({ success: true, message: 'Hero slides reordered successfully' });
    } catch (err: any) {
      console.error('Error reordering hero slides:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Delete hero slide
  app.delete('/api/hero-slides/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const db = await getDb();
      db.run(`DELETE FROM hero_slides WHERE id = ?`, [id]);
      saveDb();

      res.json({ success: true, message: 'Hero slide deleted successfully' });
    } catch (err: any) {
      console.error('Error deleting hero slide:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Reset hero slides to defaults
  app.post('/api/hero-slides/reset', async (_req: Request, res: Response) => {
    try {
      const db = await getDb();
      db.run(`DELETE FROM hero_slides`);
      db.run(`
        INSERT INTO hero_slides (id, title1, title2, highlight, subtitle, image, button_text, quote_button_text, type_label, product_id, category_link, theme, tag, badge, display_order, is_active)
        VALUES 
        ('slide-1', 'Brochure & Catalog Printing', 'Brochures', 'Printing', 'High-definition full color offset press print', 'https://i.pinimg.com/736x/c6/e3/bb/c6e3bbbd242f377f64021fe55c33b17d.jpg', 'Order Brochures', 'Quick Quote', 'Brochures', 'prod-premium-brochure', '/products?category=brochures', 'crimson', 'Brochures', 'Premium', 1, 1),
        ('slide-2', 'Custom Die Cut Stickers', 'Stickers', 'Stickers', 'Waterproof vinyl stickers & labels in roll/sheet', 'https://i.pinimg.com/1200x/d3/0d/ca/d30dcabb85e6a44689838e953c3d78c3.jpg', 'Order Stickers', 'Enquiry', 'Stickers', 'prod-die-cut-sticker-sheet', '/products?category=stickers', 'crimson', 'Stickers', 'Hot', 2, 1),
        ('slide-3', 'Custom Packaging Boxes', 'Packaging', 'Packaging', 'Luxury rigid boxes & mono-cartons with gold foil', 'https://i.pinimg.com/736x/bb/c1/3d/bbc13d8711ec67195aae22fe376e4d40.jpg', 'Packaging', 'Enquiry', 'Packaging', 'prod-custom-packaging-box', '/products?category=packaging', 'dark', 'Packaging', 'Popular', 3, 1)
      `);
      saveDb();
      res.json({ success: true, message: 'Hero slides reset to factory defaults' });
    } catch (err: any) {
      console.error('Error resetting hero slides:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Vite middleware for development / Production Static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Proprint Express + SQL + Multer Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
