import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import User from '../services/auth/models/User';
import Product from '../services/inventory/models/Product';

const PRODUCTS = [
  { name: 'Butter Croissant', category: 'Bakery', price: 3.50, cost: 1.20, sku: 'BKY-001', barcode: '1000001', stockQuantity: 85, minStockLevel: 20, description: 'Flaky golden butter croissant', isBakeryItem: true },
  { name: 'Blueberry Muffin', category: 'Bakery', price: 4.00, cost: 1.50, sku: 'BKY-002', barcode: '1000002', stockQuantity: 42, minStockLevel: 15, description: 'Moist muffin with blueberries', isBakeryItem: true },
  { name: 'Sourdough Loaf', category: 'Bakery', price: 6.00, cost: 2.00, sku: 'BKY-003', barcode: '1000003', stockQuantity: 30, minStockLevel: 10, description: 'Artisan sourdough bread', isBakeryItem: true },
  { name: 'Cappuccino', category: 'Beverages', price: 4.50, cost: 1.00, sku: 'BEV-001', barcode: '2000001', stockQuantity: 200, minStockLevel: 50, description: 'Rich espresso with steamed milk foam', isBakeryItem: false },
  { name: 'Café Latte', category: 'Beverages', price: 5.00, cost: 1.10, sku: 'BEV-002', barcode: '2000002', stockQuantity: 200, minStockLevel: 50, description: 'Smooth espresso with velvety steamed milk', isBakeryItem: false },
  { name: 'Caesar Salad', category: 'Food', price: 12.00, cost: 4.50, sku: 'FOD-001', barcode: '3000001', stockQuantity: 25, minStockLevel: 10, description: 'Classic Caesar with parmesan', isBakeryItem: false },
  { name: 'Margherita Pizza', category: 'Food', price: 14.00, cost: 5.00, sku: 'FOD-002', barcode: '3000002', stockQuantity: 18, minStockLevel: 8, description: 'Wood-fired with fresh mozzarella', isBakeryItem: false },
  { name: 'Club Sandwich', category: 'Food', price: 11.00, cost: 3.80, sku: 'FOD-003', barcode: '3000003', stockQuantity: 22, minStockLevel: 10, description: 'Triple-decker with turkey, bacon, avocado', isBakeryItem: false },
];

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant_pos';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  // Seed admin user
  const exists = await User.findOne({ email: 'admin@bakery.com' });
  if (!exists) {
    await new User({ username: 'Admin', email: 'admin@bakery.com', password: 'password123', role: 'admin', permissions: ['create_order', 'view_reports', 'edit_inventory', 'manage_users'] }).save();
    console.log('✅ Admin user created: admin@bakery.com / password123');
  } else { console.log('Admin user already exists'); }

  // Seed products
  for (const p of PRODUCTS) {
    const ex = await Product.findOne({ sku: p.sku });
    if (!ex) { await new Product(p).save(); console.log(`  + ${p.name}`); }
  }
  console.log('✅ Products seeded');

  await mongoose.disconnect();
  console.log('Done!');
}

seed().catch(err => { console.error(err); process.exit(1); });
