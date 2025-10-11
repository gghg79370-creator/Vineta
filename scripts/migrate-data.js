#!/usr/bin/env node

/**
 * Data Migration Script
 * 
 * This script migrates mock data from src/data/ to your Supabase database.
 * 
 * Usage:
 *   1. Ensure .env.local is configured with Supabase credentials
 *   2. Install dotenv: npm install dotenv
 *   3. Run: node scripts/migrate-data.js
 * 
 * Note: This is a Node.js script that uses CommonJS modules for compatibility
 */

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase credentials not found in .env.local');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Mock data to migrate (simplified examples)
const mockProducts = [
  {
    name: 'فستان صيفي أنيق',
    brand: 'Vineta',
    price: '299.00',
    old_price: '399.00',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1988&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1988&auto=format&fit=crop'],
    description: 'فستان صيفي أنيق مثالي لجميع المناسبات',
    colors: ['#FFD700', '#FF69B4', '#87CEEB'],
    sizes: ['S', 'M', 'L', 'XL'],
    tags: ['صيفي', 'أنيق', 'جديد'],
    category: 'women',
    badges: [{ text: 'جديد', type: 'new' }],
    rating: 4.5,
    review_count: 10,
    sku: 'VIN-DRESS-001',
    availability: 'متوفر',
    items_left: 25,
    sold_in_24h: 5,
    viewing_now: 12
  },
  // Add more products as needed
];

async function migrateProducts() {
  console.log('🚀 Starting products migration...');
  
  for (const product of mockProducts) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();
      
      if (error) {
        console.error(`❌ Error inserting product ${product.name}:`, error.message);
      } else {
        console.log(`✅ Migrated product: ${product.name} (ID: ${data.id})`);
      }
    } catch (err) {
      console.error(`❌ Unexpected error:`, err);
    }
  }
  
  console.log('✅ Products migration complete!');
}

async function migrateCategories() {
  console.log('🚀 Starting categories migration...');
  
  const categories = [
    { name: 'ملابس نسائية', description: 'كل ما يتعلق بالملابس النسائية', status: 'Visible', parent_id: null },
    { name: 'ملابس رجالية', description: 'كل ما يتعلق بالملابس الرجالية', status: 'Visible', parent_id: null },
    { name: 'إكسسوارات', description: 'إكسسوارات عصرية', status: 'Visible', parent_id: null },
  ];
  
  for (const category of categories) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select()
        .single();
      
      if (error) {
        console.error(`❌ Error inserting category ${category.name}:`, error.message);
      } else {
        console.log(`✅ Migrated category: ${category.name} (ID: ${data.id})`);
      }
    } catch (err) {
      console.error(`❌ Unexpected error:`, err);
    }
  }
  
  console.log('✅ Categories migration complete!');
}

async function migrateAnnouncements() {
  console.log('🚀 Starting announcements migration...');
  
  const announcements = [
    {
      content: 'شحن مجاني للطلبات فوق 500 ج.م',
      status: 'Active',
      start_date: new Date().toISOString(),
      end_date: null
    },
    {
      content: 'تخفيضات الصيف حتى 50%!',
      status: 'Active',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
  
  for (const announcement of announcements) {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .insert([announcement])
        .select()
        .single();
      
      if (error) {
        console.error(`❌ Error inserting announcement:`, error.message);
      } else {
        console.log(`✅ Migrated announcement: ${announcement.content}`);
      }
    } catch (err) {
      console.error(`❌ Unexpected error:`, err);
    }
  }
  
  console.log('✅ Announcements migration complete!');
}

async function main() {
  console.log('🎯 Vineta Data Migration Tool');
  console.log('================================\n');
  
  // Test connection
  console.log('🔍 Testing Supabase connection...');
  const { data, error } = await supabase.from('products').select('count', { count: 'exact', head: true });
  
  if (error) {
    console.error('❌ Failed to connect to Supabase:', error.message);
    process.exit(1);
  }
  
  console.log('✅ Connected to Supabase successfully!\n');
  
  // Run migrations
  await migrateCategories();
  console.log('');
  
  await migrateProducts();
  console.log('');
  
  await migrateAnnouncements();
  console.log('');
  
  console.log('🎉 All migrations complete!');
  console.log('\nNote: You can run this script multiple times safely.');
  console.log('Duplicate entries will be prevented by unique constraints.');
}

main().catch(console.error);
