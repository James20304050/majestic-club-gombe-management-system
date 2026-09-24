import { 
  StaffMember, 
  Refrigerator, 
  Product, 
  Location, 
  StockBalance, 
  StockTransaction, 
  StockTransfer, 
  WastageRecord, 
  ComplimentaryItem, 
  Sale, 
  DailyStockCountReport, 
  SnookerTable, 
  SnookerBooking, 
  EventBooking, 
  HotelRoom,
  HotelBooking,
  AuditLog, 
  BusinessConfig,
  Role,
  PaymentMethod,
  WastageReason
} from '../types';

// STORAGE KEYS
const STORAGE_PREFIX = 'majestic_club_gombe_';

// Initial Locations
export const INITIAL_LOCATIONS: Location[] = [
  { id: 'loc_main_store', name: 'Main Central Store', code: 'LOC-STORE', type: 'main_store', description: 'Central bulk warehouse' },
  { id: 'loc_main_bar', name: 'Main Hall Bar', code: 'LOC-MAINBAR', type: 'main_bar', description: 'Ground floor main entertainment bar' },
  { id: 'loc_club_bar', name: 'Club Floor Bar', code: 'LOC-CLUBBAR', type: 'club_bar', description: 'Nightclub dancefloor bar station' },
  { id: 'loc_vip_bar', name: 'VIP Lounge Bar', code: 'LOC-VIPBAR', type: 'vip_bar', description: 'Mezzanine VIP luxury bar' },
];

// Initial Products
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_life',
    code: 'LIFE-001',
    name: 'Life Continental Lager',
    category: 'BEER',
    brand: 'Life',
    unit: 'Bottle',
    purchasePrice: 900,
    sellingPrice: 1200,
    minStockLevel: 50,
    maxStockLevel: 1000,
    qrCode: 'LIFE-001',
    barcode: '61511000101',
    isActive: true,
    volume: '60cl',
    createdAt: '2026-01-01',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod_legend',
    code: 'LEGD-001',
    name: 'Legend Extra Stout',
    category: 'BEER',
    brand: 'Legend',
    unit: 'Bottle',
    purchasePrice: 1050,
    sellingPrice: 1400,
    minStockLevel: 40,
    maxStockLevel: 800,
    qrCode: 'LEGD-001',
    barcode: '61511000202',
    isActive: true,
    volume: '60cl',
    createdAt: '2026-01-01',
    image: 'https://images.unsplash.com/photo-1518176258769-f227c798150e?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod_tiger',
    code: 'TIGR-001',
    name: 'Tiger Crystal Beer',
    category: 'BEER',
    brand: 'Tiger',
    unit: 'Bottle',
    purchasePrice: 950,
    sellingPrice: 1300,
    minStockLevel: 40,
    maxStockLevel: 800,
    qrCode: 'TIGR-001',
    barcode: '61511000303',
    isActive: true,
    volume: '60cl',
    createdAt: '2026-01-01',
    image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod_origin',
    code: 'ORGN-001',
    name: 'Orijin Bitters Herb Blend',
    category: 'BEER',
    brand: 'Orijin',
    unit: 'Bottle',
    purchasePrice: 950,
    sellingPrice: 1300,
    minStockLevel: 50,
    maxStockLevel: 800,
    qrCode: 'ORGN-001',
    barcode: '61511000404',
    isActive: true,
    volume: '60cl',
    createdAt: '2026-01-01',
    image: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod_water',
    code: 'WATR-001',
    name: 'Table Water Premium (Eva)',
    category: 'WATER',
    brand: 'Eva Water',
    unit: 'Bottle',
    purchasePrice: 250,
    sellingPrice: 500,
    minStockLevel: 100,
    maxStockLevel: 1500,
    qrCode: 'WATR-001',
    barcode: '61511000505',
    isActive: true,
    volume: '75cl',
    createdAt: '2026-01-01',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod_33export',
    code: 'EXP33-001',
    name: '33 Export Lager Beer',
    category: 'BEER',
    brand: '33 Export',
    unit: 'Bottle',
    purchasePrice: 850,
    sellingPrice: 1100,
    minStockLevel: 40,
    maxStockLevel: 800,
    qrCode: 'EXP33-001',
    barcode: '61511000606',
    isActive: true,
    volume: '60cl',
    createdAt: '2026-01-01',
    image: 'https://images.unsplash.com/photo-1575037614876-c38a4d44f5b8?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod_heineken',
    code: 'HEIN-001',
    name: 'Heineken Lager Premium',
    category: 'BEER',
    brand: 'Heineken',
    unit: 'Bottle',
    purchasePrice: 1350,
    sellingPrice: 1800,
    minStockLevel: 50,
    maxStockLevel: 1000,
    qrCode: 'HEIN-001',
    barcode: '61511000707',
    isActive: true,
    volume: '60cl',
    createdAt: '2026-01-01',
    image: 'https://images.unsplash.com/photo-1618885472179-5e474019f2a9?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod_gulder',
    code: 'GULD-001',
    name: 'Gulder Ultimate Lager',
    category: 'BEER',
    brand: 'Gulder',
    unit: 'Bottle',
    purchasePrice: 900,
    sellingPrice: 1200,
    minStockLevel: 40,
    maxStockLevel: 800,
    qrCode: 'GULD-001',
    barcode: '61511000808',
    isActive: true,
    volume: '60cl',
    createdAt: '2026-01-01',
    image: 'https://images.unsplash.com/photo-1584225064785-c62a8b43d148?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod_coke',
    code: 'COKE-001',
    name: 'Coca-Cola Classic',
    category: 'SOFT DRINKS',
    brand: 'Coca-Cola',
    unit: 'Bottle',
    purchasePrice: 400,
    sellingPrice: 700,
    minStockLevel: 50,
    maxStockLevel: 800,
    qrCode: 'COKE-001',
    barcode: '61511000909',
    isActive: true,
    volume: '50cl',
    createdAt: '2026-01-01',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod_fanta',
    code: 'FANT-001',
    name: 'Fanta Orange Soda',
    category: 'SOFT DRINKS',
    brand: 'Fanta',
    unit: 'Bottle',
    purchasePrice: 400,
    sellingPrice: 700,
    minStockLevel: 40,
    maxStockLevel: 600,
    qrCode: 'FANT-001',
    barcode: '61511001010',
    isActive: true,
    volume: '50cl',
    createdAt: '2026-01-01',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod_pepsi',
    code: 'PEPS-001',
    name: 'Pepsi Cola Chilled',
    category: 'SOFT DRINKS',
    brand: 'Pepsi',
    unit: 'Bottle',
    purchasePrice: 400,
    sellingPrice: 700,
    minStockLevel: 40,
    maxStockLevel: 600,
    qrCode: 'PEPS-001',
    barcode: '61511001111',
    isActive: true,
    volume: '50cl',
    createdAt: '2026-01-01',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod_sprite',
    code: 'SPRT-001',
    name: 'Sprite Lemon Lime',
    category: 'SOFT DRINKS',
    brand: 'Sprite',
    unit: 'Bottle',
    purchasePrice: 400,
    sellingPrice: 700,
    minStockLevel: 40,
    maxStockLevel: 600,
    qrCode: 'SPRT-001',
    barcode: '61511001212',
    isActive: true,
    volume: '50cl',
    createdAt: '2026-01-01',
    image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod_hennessy',
    code: 'HENN-001',
    name: 'Hennessy Very Special Cognac',
    category: 'SPIRITS',
    brand: 'Hennessy',
    unit: 'Bottle',
    purchasePrice: 58000,
    sellingPrice: 75000,
    minStockLevel: 10,
    maxStockLevel: 80,
    qrCode: 'HENN-001',
    barcode: '61511001313',
    isActive: true,
    volume: '70cl',
    createdAt: '2026-01-01',
    image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod_jameson',
    code: 'JMSN-001',
    name: 'Jameson Irish Whiskey Black Barrel',
    category: 'SPIRITS',
    brand: 'Jameson',
    unit: 'Bottle',
    purchasePrice: 26000,
    sellingPrice: 35000,
    minStockLevel: 15,
    maxStockLevel: 100,
    qrCode: 'JMSN-001',
    barcode: '61511001414',
    isActive: true,
    volume: '75cl',
    createdAt: '2026-01-01',
    image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod_moet',
    code: 'MOET-001',
    name: 'Moët & Chandon Impérial Brut',
    category: 'WINE',
    brand: 'Moët & Chandon',
    unit: 'Bottle',
    purchasePrice: 90000,
    sellingPrice: 120000,
    minStockLevel: 6,
    maxStockLevel: 40,
    qrCode: 'MOET-001',
    barcode: '61511001515',
    isActive: true,
    volume: '75cl',
    createdAt: '2026-01-01',
    image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod_redbull',
    code: 'RDBL-001',
    name: 'Red Bull Energy Drink',
    category: 'OTHER DRINKS',
    brand: 'Red Bull',
    unit: 'Can',
    purchasePrice: 1600,
    sellingPrice: 2200,
    minStockLevel: 40,
    maxStockLevel: 500,
    qrCode: 'RDBL-001',
    barcode: '61511001616',
    isActive: true,
    volume: '25cl',
    createdAt: '2026-01-01',
    image: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=600&auto=format&fit=crop&q=80'
  }
];

// Generate 20 Sales Staff
export const INITIAL_STAFF: StaffMember[] = [
  // 20 Sales Staff (SG-001 to SG-020 assigned to FR-001 to FR-020)
  ...Array.from({ length: 20 }, (_, i) => {
    const num = (i + 1).toString().padStart(2, '0');
    return {
      id: `staff_sg_${num}`,
      staffCode: `SG-${num}`,
      name: `Sales Girl ${num}`,
      role: 'sales_staff' as Role,
      assignedRefrigeratorId: `FR-${(i + 1).toString().padStart(3, '0')}`,
      phone: `+234 803 555 ${1000 + i}`,
      email: `salesgirl${num}@majesticclubgombe.ng`,
      active: true,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=SalesGirl${num}&backgroundColor=111827`
    };
  }),
  // Management & Key Personnel
  {
    id: 'staff_owner',
    staffCode: 'OWN-001',
    name: 'Alh. Danladi Gombe',
    role: 'owner',
    phone: '+234 803 123 4567',
    email: 'owner@majesticclubgombe.ng',
    active: true,
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Danladi&backgroundColor=111827'
  },
  {
    id: 'staff_board',
    staffCode: 'DIR-001',
    name: 'Chief Buba Ibrahim',
    role: 'board_director',
    phone: '+234 802 987 6543',
    email: 'director@majesticclubgombe.ng',
    active: true,
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Buba&backgroundColor=111827'
  },
  {
    id: 'staff_gm',
    staffCode: 'GM-001',
    name: 'Mr. Emmanuel Vance',
    role: 'general_manager',
    phone: '+234 805 456 7890',
    email: 'gm@majesticclubgombe.ng',
    active: true,
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Emmanuel&backgroundColor=111827'
  },
  {
    id: 'staff_stock_mgr',
    staffCode: 'SM-001',
    name: 'Mallam Sani Yakubu',
    role: 'stock_manager',
    phone: '+234 807 333 4444',
    email: 'stock@majesticclubgombe.ng',
    active: true,
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sani&backgroundColor=111827'
  },
  {
    id: 'staff_bar_mgr',
    staffCode: 'BM-001',
    name: 'Mr. Tariq Okon',
    role: 'bar_manager',
    phone: '+234 809 111 2222',
    email: 'bar@majesticclubgombe.ng',
    active: true,
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Tariq&backgroundColor=111827'
  },
  {
    id: 'staff_snooker_mgr',
    staffCode: 'SNK-001',
    name: 'Victor Gambo',
    role: 'snooker_manager',
    phone: '+234 812 777 8888',
    email: 'snooker@majesticclubgombe.ng',
    active: true,
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Victor&backgroundColor=111827'
  },
  {
    id: 'staff_auditor',
    staffCode: 'AUD-001',
    name: 'Mrs. Aisha Bello, FCA',
    role: 'auditor',
    phone: '+234 814 222 9999',
    email: 'auditor@majesticclubgombe.ng',
    active: true,
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Aisha&backgroundColor=111827'
  },
  {
    id: 'staff_admin',
    staffCode: 'ADM-001',
    name: 'Admin Aliyu',
    role: 'system_admin',
    phone: '+234 803 000 1111',
    email: 'admin@majesticclubgombe.ng',
    active: true,
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Admin&backgroundColor=111827'
  }
];

// Generate 20 Refrigerators FR-001 to FR-020
export const INITIAL_REFRIGERATORS: Refrigerator[] = Array.from({ length: 20 }, (_, i) => {
  const idNum = (i + 1).toString().padStart(3, '0');
  const staffNum = (i + 1).toString().padStart(2, '0');
  const zones = [
    'Club Dancefloor - Left Station',
    'Club Dancefloor - Right Station',
    'Main Hall Bar - West',
    'Main Hall Bar - East',
    'VIP Balcony - Station A',
    'VIP Balcony - Station B',
    'Snooker Lounge Station 1',
    'Snooker Lounge Station 2',
    'Garden Terrace Area',
    'Outdoor Poolside Bar',
    'Central Mezzanine',
    'Presidential Suite Bar',
    'Club Backstage Booth',
    'Executive Corner North',
    'Executive Corner South',
    'Stage Front Left',
    'Stage Front Right',
    'Cocktail Terrace Station',
    'High-Top Table Zone 1',
    'High-Top Table Zone 2'
  ];
  return {
    id: `FR-${idNum}`,
    name: `Refrigerator ${idNum}`,
    assignedStaffId: `staff_sg_${staffNum}`,
    assignedStaffName: `Sales Girl ${staffNum}`,
    location: zones[i % zones.length],
    capacity: 500,
    status: 'active',
    temperature: `${(2.8 + (i * 0.1) % 2).toFixed(1)}°C`,
    lastCleaned: '2026-09-22 06:00'
  };
});

// Snooker Tables
export const INITIAL_SNOOKER_TABLES: SnookerTable[] = [
  { id: 'snk_01', name: 'Snooker Table 01 (Tournament Star)', type: 'snooker', hourlyPrice: 5000, status: 'available' },
  { id: 'snk_02', name: 'Snooker Table 02 (Riley Executive)', type: 'snooker', hourlyPrice: 5000, status: 'in_play', currentSessionStart: '18:15', currentCustomer: 'Barrister Yakubu' },
  { id: 'pool_01', name: 'Pool Table 01 (American 9-Ball)', type: 'pool', hourlyPrice: 3000, status: 'available' },
  { id: 'pool_02', name: 'Pool Table 02 (Diamond Pro-Am)', type: 'pool', hourlyPrice: 3000, status: 'available' },
];

export const INITIAL_BUSINESS_CONFIG: BusinessConfig = {
  clubName: 'Majestic Club Gombe',
  tagline: 'Entertainment • Nightlife • Events • Snooker • VIP Experience',
  address: 'Plot 14, Commercial Boulevard, GRA Phase II, Gombe',
  state: 'Gombe State',
  country: 'Nigeria',
  phone: '+234 803 555 7777',
  whatsapp: '+2348035557777',
  email: 'info@majesticclubgombe.ng',
  currency: 'NGN',
  currencySymbol: '₦',
  taxRate: 7.5,
  licenseNumber: 'GM/LIQ/2026/894-MAJ',
  operatingHours: 'Tues - Sun: 4:00 PM till Dawn',
  onlineOrderingActive: true,
  onlinePaymentActive: false, // Regulatory safe by default: Paystack mock/test enabled
  allowNegativeStock: false
};

// Seed 500 items per refrigerator as specified:
// Life - 50, Legend - 50, Tiger - 50, Origin - 50, Table Water - 50, 33 Export - 50, Heineken - 50, Gulder - 50
// Coca-Cola - 25, Fanta - 25, Pepsi - 25, Sprite - 25 = 500 items total!
const INITIAL_FRIDGE_ITEMS: { [productId: string]: number } = {
  prod_life: 50,
  prod_legend: 50,
  prod_tiger: 50,
  prod_origin: 50,
  prod_water: 50,
  prod_33export: 50,
  prod_heineken: 50,
  prod_gulder: 50,
  prod_coke: 25,
  prod_fanta: 25,
  prod_pepsi: 25,
  prod_sprite: 25,
};

// Generate Stock Balances for all locations
function generateInitialStockBalances(): StockBalance[] {
  const balances: StockBalance[] = [];
  const now = '2026-09-23 08:00:00';

  // 1. 20 Refrigerators with 500 items each
  for (let i = 1; i <= 20; i++) {
    const fridgeId = `FR-${i.toString().padStart(3, '0')}`;
    for (const [prodId, qty] of Object.entries(INITIAL_FRIDGE_ITEMS)) {
      const prod = INITIAL_PRODUCTS.find(p => p.id === prodId)!;
      balances.push({
        id: `bal_${fridgeId}_${prodId}`,
        locationId: fridgeId,
        productId: prodId,
        productName: prod.name,
        category: prod.category,
        quantity: qty,
        lastUpdated: now
      });
    }
  }

  // 2. Main Store (Bulk warehouse)
  const storeStock: { [productId: string]: number } = {
    prod_life: 1500,
    prod_legend: 1200,
    prod_tiger: 1000,
    prod_origin: 1000,
    prod_water: 2500,
    prod_33export: 900,
    prod_heineken: 1600,
    prod_gulder: 800,
    prod_coke: 1200,
    prod_fanta: 900,
    prod_pepsi: 800,
    prod_sprite: 800,
    prod_hennessy: 45,
    prod_jameson: 60,
    prod_moet: 25,
    prod_redbull: 400
  };

  for (const [prodId, qty] of Object.entries(storeStock)) {
    const prod = INITIAL_PRODUCTS.find(p => p.id === prodId);
    if (prod) {
      balances.push({
        id: `bal_loc_main_store_${prodId}`,
        locationId: 'loc_main_store',
        productId: prodId,
        productName: prod.name,
        category: prod.category,
        quantity: qty,
        lastUpdated: now
      });
    }
  }

  // 3. Bars (Main Bar, Club Bar, VIP Bar)
  const bars = ['loc_main_bar', 'loc_club_bar', 'loc_vip_bar'];
  bars.forEach(barId => {
    INITIAL_PRODUCTS.forEach(p => {
      balances.push({
        id: `bal_${barId}_${p.id}`,
        locationId: barId,
        productId: p.id,
        productName: p.name,
        category: p.category,
        quantity: barId === 'loc_vip_bar' && (p.category === 'SPIRITS' || p.category === 'WINE') ? 15 : 60,
        lastUpdated: now
      });
    });
  });

  return balances;
}

// Generate Realistic Seed Sales
function generateInitialSales(): Sale[] {
  const sales: Sale[] = [];
  const times = ['19:15', '19:40', '20:05', '20:30', '21:10', '21:45', '22:15'];
  const tables = ['TABLE-005', 'TABLE-012', 'TABLE-025', 'VIP-CABANA-1', 'SNOOKER-T1', 'TABLE-008', 'TABLE-019'];
  const paymentMethods: PaymentMethod[] = ['POS_TRANSFER', 'CASH', 'POS_TRANSFER', 'CARD', 'POS_TRANSFER', 'CASH', 'POS_TRANSFER'];

  // Few initial sales from Sales Girl 07 (FR-007) and others
  for (let i = 0; i < times.length; i++) {
    const staffIdx = (i * 3) % 20 + 1;
    const staffNum = staffIdx.toString().padStart(2, '0');
    const fridgeId = `FR-${staffIdx.toString().padStart(3, '0')}`;
    const p1 = INITIAL_PRODUCTS[i % 5];
    const p2 = INITIAL_PRODUCTS[(i + 4) % INITIAL_PRODUCTS.length];
    const qty1 = 2 + (i % 3);
    const qty2 = 1 + (i % 2);

    sales.push({
      id: `sale_${1000 + i}`,
      reference: `SAL-20260923-${(100 + i).toString()}`,
      timestamp: `2026-09-23T${times[i]}:00.000Z`,
      date: '2026-09-23',
      time: times[i],
      staffId: `staff_sg_${staffNum}`,
      staffName: `Sales Girl ${staffNum}`,
      refrigeratorId: fridgeId,
      refrigeratorName: `Refrigerator ${fridgeId.replace('FR-', '')}`,
      tableNumber: tables[i],
      customerName: i === 3 ? 'Senator B. Aliyu' : `Guest ${10 + i}`,
      items: [
        {
          productId: p1.id,
          productCode: p1.code,
          productName: p1.name,
          category: p1.category,
          quantity: qty1,
          unitPrice: p1.sellingPrice,
          totalPrice: qty1 * p1.sellingPrice
        },
        {
          productId: p2.id,
          productCode: p2.code,
          productName: p2.name,
          category: p2.category,
          quantity: qty2,
          unitPrice: p2.sellingPrice,
          totalPrice: qty2 * p2.sellingPrice
        }
      ],
      totalQuantity: qty1 + qty2,
      totalAmount: (qty1 * p1.sellingPrice) + (qty2 * p2.sellingPrice),
      paymentMethod: paymentMethods[i],
      paymentReference: `PAY-MAJ-${2026092300 + i}`,
      paymentStatus: 'PAID',
      notes: `Served at ${tables[i]}`
    });
  }
  return sales;
}

// Generate Initial Audit Logs
function generateInitialAuditLogs(): AuditLog[] {
  return [
    {
      id: 'log_01',
      timestamp: '2026-09-23T08:00:00.000Z',
      date: '2026-09-23',
      time: '08:00',
      userId: 'staff_stock_mgr',
      userName: 'Mallam Sani Yakubu',
      userRole: 'stock_manager',
      action: 'Opened daily stock register and verified 20 refrigerators load-out.',
      location: 'Main Central Store',
      transactionReference: 'REG-20260923-01',
      ipDevice: '192.168.1.10 (Store Desktop)'
    },
    {
      id: 'log_02',
      timestamp: '2026-09-23T14:30:00.000Z',
      date: '2026-09-23',
      time: '14:30',
      userId: 'staff_stock_mgr',
      userName: 'Mallam Sani Yakubu',
      userRole: 'stock_manager',
      action: 'Stock Manager transferred 50 Life bottles from Main Store to FR-007.',
      product: 'Life Continental Lager',
      quantity: 50,
      location: 'FR-007',
      transactionReference: 'TRF-20260923-001',
      ipDevice: '192.168.1.10 (Store Desktop)'
    },
    {
      id: 'log_03',
      timestamp: '2026-09-23T19:15:00.000Z',
      date: '2026-09-23',
      time: '19:15',
      userId: 'staff_sg_07',
      userName: 'Sales Girl 07',
      userRole: 'sales_staff',
      action: 'Sales Girl 07 recorded sale of 3 Life bottles and 1 Heineken.',
      product: 'Life Continental Lager',
      quantity: 3,
      location: 'FR-007',
      transactionReference: 'SAL-20260923-100',
      ipDevice: '192.168.1.45 (Tecno Camon 20 Pro)'
    },
    {
      id: 'log_04',
      timestamp: '2026-09-23T20:00:00.000Z',
      date: '2026-09-23',
      time: '20:00',
      userId: 'staff_bar_mgr',
      userName: 'Mr. Tariq Okon',
      userRole: 'bar_manager',
      action: 'Manager approved 2 damaged bottles as wastage on Refrigerator 03.',
      product: 'Heineken Lager Premium',
      quantity: 2,
      location: 'FR-003',
      transactionReference: 'WST-20260923-001',
      ipDevice: '192.168.1.25 (Manager iPad)'
    }
  ];
}

// Generate Initial Snooker Bookings
export const INITIAL_SNOOKER_BOOKINGS: SnookerBooking[] = [
  {
    id: 'snk_book_01',
    reference: 'SNK-BK-901',
    customerName: 'Barrister Yakubu',
    phone: '+234 803 777 1234',
    tableId: 'snk_02',
    tableName: 'Snooker Table 02 (Riley Executive)',
    date: '2026-09-23',
    timeSlot: '18:15 - 20:15',
    durationHours: 2,
    numberOfPlayers: 2,
    totalAmount: 10000,
    paymentStatus: 'PAID',
    status: 'active',
    createdAt: '2026-09-23 17:45'
  },
  {
    id: 'snk_book_02',
    reference: 'SNK-BK-902',
    customerName: 'Engr. Farouk',
    phone: '+234 802 444 8888',
    tableId: 'snk_01',
    tableName: 'Snooker Table 01 (Tournament Star)',
    date: '2026-09-23',
    timeSlot: '21:00 - 23:00',
    durationHours: 2,
    numberOfPlayers: 4,
    totalAmount: 10000,
    paymentStatus: 'DEPOSIT_PAID',
    status: 'confirmed',
    createdAt: '2026-09-23 16:10'
  }
];

// Initial VIP & Event Bookings
export const INITIAL_EVENT_BOOKINGS: EventBooking[] = [
  {
    id: 'ev_01',
    reference: 'EVT-MAJ-301',
    type: 'VIP_TABLE',
    customerName: 'Alh. Mustapha Jalo',
    phone: '+234 803 111 9999',
    email: 'jalo@investments.ng',
    date: '2026-09-23',
    time: '21:30',
    package: 'Presidential Diamond VIP Cabana',
    numberOfPeople: 8,
    tableArea: 'VIP Mezzanine Suite 1',
    amount: 350000,
    depositAmount: 150000,
    paymentStatus: 'DEPOSIT_PAID',
    status: 'confirmed',
    notes: 'Requires 2 bottles of Hennessy VS and Moët Brut on ice.',
    createdAt: '2026-09-22 14:00'
  },
  {
    id: 'ev_02',
    reference: 'EVT-MAJ-302',
    type: 'BIRTHDAY_PARTY',
    customerName: 'Dr. Fatima Shehu',
    phone: '+234 806 888 2233',
    date: '2026-09-25',
    time: '20:00',
    package: 'Gold Birthday VIP Celebration',
    numberOfPeople: 15,
    tableArea: 'Club Lounge Section B',
    amount: 500000,
    depositAmount: 250000,
    paymentStatus: 'DEPOSIT_PAID',
    status: 'confirmed',
    notes: 'Custom DJ shoutout and celebration fireworks.',
    createdAt: '2026-09-21 11:30'
  }
];

// Initial Grand Ville Hotel & Majestic Suites
export const INITIAL_HOTEL_ROOMS: HotelRoom[] = [
  {
    id: 'room_std_101',
    roomNumber: 'Room 101',
    name: 'Classic Standard Room',
    category: 'STANDARD',
    pricePerNight: 25000,
    capacity: 2,
    bedType: 'Queen Orthopedic Bed',
    floor: '1st Floor - West Wing',
    amenities: [
      'High-Speed Wi-Fi',
      'Air Conditioning',
      'En-Suite Hot Shower',
      'Smart LED TV & Satellite',
      'Complimentary Bottled Water',
      '24/7 Room Service Call'
    ],
    description: 'Crisp, comfortable retreat ideal for evening club-goers and business travelers seeking quiet relaxation in Gombe.',
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'available',
    isPopular: false
  },
  {
    id: 'room_del_201',
    roomNumber: 'Room 201',
    name: 'Deluxe Courtyard King',
    category: 'DELUXE',
    pricePerNight: 45000,
    capacity: 2,
    bedType: 'California King Bed',
    floor: '2nd Floor - Fountain Courtyard View',
    amenities: [
      'Private Fountain View Balcony',
      'Chilled Mini Fridge / Minibar',
      'Plush Bathrobes & Slippers',
      '55" 4K Smart TV with Netflix',
      'Electronic Safe Box',
      'Complimentary Breakfast for 1',
      'Soundproof Acoustic Windows'
    ],
    description: 'Elevated luxury overlooking the Majestic illuminated fountain courtyard. Complete with private minibar and plush king bedding.',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'available',
    isPopular: true
  },
  {
    id: 'room_exec_301',
    roomNumber: 'Room 301',
    name: 'Executive Diplomatic Suite',
    category: 'EXECUTIVE',
    pricePerNight: 75000,
    capacity: 3,
    bedType: 'Super King Bed + Chesterfield Sofa Bed',
    floor: '3rd Floor - Executive Mezzanine',
    amenities: [
      'Separate Living Lounge & Dining Desk',
      'Full Marble Bathroom & Soaking Tub',
      'Stocked Wine & Spirits Minibar',
      'VIP Club Priority Access Pass',
      'Complimentary Breakfast for 2',
      'Espresso Coffee Machine',
      'Dedicated Butler / Concierge Line'
    ],
    description: 'Spacious dual-chamber executive retreat designed for dignitaries, executives, and VIP guests wanting seamless transitions between nightclub entertainment and private solace.',
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'available',
    isPopular: true
  },
  {
    id: 'room_pres_401',
    roomNumber: 'Penthouse 401',
    name: 'Presidential Royal Penthouse Suite',
    category: 'PRESIDENTIAL_SUITE',
    pricePerNight: 150000,
    capacity: 4,
    bedType: 'Grand Emperor Bed + Guest King Room',
    floor: '4th Floor - Exclusive Penthouse Level',
    amenities: [
      'Panoramic Gombe Cityline & Fountain View',
      'Private Champagne Lounge & Wet Bar',
      'Jacuzzi Hydro-massage Bathtub',
      'Personal VIP Security Guard at Suite Entry',
      'Free VIP Diamond Cabana Access at Majestic',
      'Full Gourmet Room Dining Service 24/7',
      'Private High-speed Starlink Connectivity'
    ],
    description: 'The pinnacle of luxury in Gombe. Two master bedrooms, grand private reception salon, wet bar, jacuzzi spa bath, and round-the-clock personal steward.',
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'available',
    isPopular: false
  }
];

export const INITIAL_HOTEL_BOOKINGS: HotelBooking[] = [
  {
    id: 'htl_book_01',
    reference: 'HTL-MAJ-801',
    roomId: 'room_del_201',
    roomName: 'Deluxe Courtyard King',
    roomCategory: 'DELUXE',
    customerName: 'Chief Kenneth Nwosu',
    phone: '+234 803 555 4321',
    email: 'k.nwosu@consulting.ng',
    checkInDate: '2026-09-23',
    checkOutDate: '2026-09-25',
    numberOfNights: 2,
    numberOfGuests: 2,
    pricePerNight: 45000,
    totalAmount: 90000,
    paymentStatus: 'PAID',
    status: 'confirmed',
    specialRequests: 'Late check-in at 23:00 after club party. Extra pillows.',
    createdAt: '2026-09-22 16:30'
  },
  {
    id: 'htl_book_02',
    reference: 'HTL-MAJ-802',
    roomId: 'room_exec_301',
    roomName: 'Executive Diplomatic Suite',
    roomCategory: 'EXECUTIVE',
    customerName: 'Hon. Bello Garba',
    phone: '+234 812 999 1100',
    email: 'bello.garba@gov.ng',
    checkInDate: '2026-09-24',
    checkOutDate: '2026-09-26',
    numberOfNights: 2,
    numberOfGuests: 2,
    pricePerNight: 75000,
    totalAmount: 150000,
    paymentStatus: 'DEPOSIT_PAID',
    status: 'confirmed',
    specialRequests: 'Chilled bottle of Glenfiddich in suite minibar upon arrival.',
    createdAt: '2026-09-23 10:15'
  }
];

// Central Store State Interface
export interface AppStoreState {
  currentUser: StaffMember;
  staff: StaffMember[];
  refrigerators: Refrigerator[];
  products: Product[];
  locations: Location[];
  stockBalances: StockBalance[];
  sales: Sale[];
  stockTransfers: StockTransfer[];
  wastageRecords: WastageRecord[];
  complimentaryItems: ComplimentaryItem[];
  stockCounts: DailyStockCountReport[];
  snookerTables: SnookerTable[];
  snookerBookings: SnookerBooking[];
  eventBookings: EventBooking[];
  hotelRooms: HotelRoom[];
  hotelBookings: HotelBooking[];
  auditLogs: AuditLog[];
  businessConfig: BusinessConfig;
}

// Helpers for localStorage persistence
export function getSavedState(): AppStoreState {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}state_v1`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse saved state:', e);
  }

  // Default state: Logged in initially as Sales Girl 07 for fast inspection, or GM
  const defaultState: AppStoreState = {
    currentUser: INITIAL_STAFF.find(s => s.staffCode === 'SG-07') || INITIAL_STAFF[6],
    staff: INITIAL_STAFF,
    refrigerators: INITIAL_REFRIGERATORS,
    products: INITIAL_PRODUCTS,
    locations: INITIAL_LOCATIONS,
    stockBalances: generateInitialStockBalances(),
    sales: generateInitialSales(),
    stockTransfers: [
      {
        id: 'trf_01',
        reference: 'TRF-20260923-001',
        fromLocationId: 'loc_main_store',
        fromLocationName: 'Main Central Store',
        toLocationId: 'FR-007',
        toLocationName: 'Refrigerator 007',
        productId: 'prod_life',
        productName: 'Life Continental Lager',
        quantity: 50,
        authorizedBy: 'Mallam Sani Yakubu (Stock Manager)',
        receivedBy: 'Sales Girl 07',
        date: '2026-09-23',
        time: '14:30',
        timestamp: '2026-09-23T14:30:00.000Z',
        status: 'received',
        notes: 'Evening peak prep restock'
      }
    ],
    wastageRecords: [
      {
        id: 'wst_01',
        reference: 'WST-20260923-001',
        productId: 'prod_heineken',
        productName: 'Heineken Lager Premium',
        quantity: 2,
        unitPrice: 1800,
        totalLoss: 3600,
        reason: 'Broken bottle',
        staffId: 'staff_sg_03',
        staffName: 'Sales Girl 03',
        locationId: 'FR-003',
        locationName: 'Refrigerator 003',
        date: '2026-09-23',
        time: '20:00',
        timestamp: '2026-09-23T20:00:00.000Z',
        status: 'approved',
        approvedBy: 'Mr. Tariq Okon (Bar Manager)',
        approvedAt: '2026-09-23 20:05',
        notes: 'Slipped during restocking'
      }
    ],
    complimentaryItems: [
      {
        id: 'cmp_01',
        reference: 'CMP-20260923-001',
        productId: 'prod_hennessy',
        productName: 'Hennessy Very Special Cognac',
        quantity: 1,
        unitPrice: 75000,
        totalValue: 75000,
        beneficiary: 'Celebrity Guest Artist (Davido Tour Party)',
        staffId: 'staff_gm',
        staffName: 'Mr. Emmanuel Vance',
        locationId: 'loc_vip_bar',
        locationName: 'VIP Lounge Bar',
        date: '2026-09-23',
        time: '22:00',
        approvedBy: 'Alh. Danladi Gombe (Owner)',
        notes: 'VIP Artist Hospitality'
      }
    ],
    stockCounts: [],
    snookerTables: INITIAL_SNOOKER_TABLES,
    snookerBookings: INITIAL_SNOOKER_BOOKINGS,
    eventBookings: INITIAL_EVENT_BOOKINGS,
    hotelRooms: INITIAL_HOTEL_ROOMS,
    hotelBookings: INITIAL_HOTEL_BOOKINGS,
    auditLogs: generateInitialAuditLogs(),
    businessConfig: INITIAL_BUSINESS_CONFIG
  };

  saveState(defaultState);
  return defaultState;
}

export function saveState(state: AppStoreState): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}state_v1`, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state to localStorage:', e);
  }
}

export function resetToFactoryDemo(): AppStoreState {
  localStorage.removeItem(`${STORAGE_PREFIX}state_v1`);
  return getSavedState();
}

// Role permission checker
export function hasPermission(role: Role, action: string): boolean {
  switch (role) {
    case 'owner':
    case 'system_admin':
      return true;
    case 'board_director':
      return ['view_reports', 'view_executive', 'view_audits', 'view_dashboard', 'view_sales'].includes(action);
    case 'general_manager':
      return !['delete_system_configs'].includes(action);
    case 'stock_manager':
      return ['view_stock', 'view_transfers', 'create_transfers', 'receive_transfers', 'view_locations', 'view_products', 'add_stock'].includes(action);
    case 'bar_manager':
      return ['view_stock', 'view_transfers', 'approve_transfers', 'view_wastage', 'approve_wastage', 'view_closing_counts', 'approve_closing_counts', 'view_refrigerators', 'view_sales'].includes(action);
    case 'sales_staff':
      return ['pos_sale', 'view_my_stock', 'view_my_sales', 'submit_closing_count'].includes(action);
    case 'snooker_manager':
      return ['manage_snooker', 'book_snooker', 'view_snooker'].includes(action);
    case 'auditor':
      return ['view_reports', 'view_audits', 'view_variance', 'view_sales', 'view_stock', 'view_executive', 'export_reports'].includes(action);
    default:
      return false;
  }
}

// Master MajesticStore singleton
export const MajesticStore = {
  getState(): AppStoreState {
    return getSavedState();
  },

  getStaff(): StaffMember[] {
    return getSavedState().staff;
  },

  getProducts(): Product[] {
    return getSavedState().products;
  },

  getLocations(): Location[] {
    return getSavedState().locations;
  },

  getRefrigerators(): Refrigerator[] {
    return getSavedState().refrigerators;
  },

  getStockBalances(): StockBalance[] {
    return getSavedState().stockBalances;
  },

  getSales(): Sale[] {
    return getSavedState().sales;
  },

  getTransfers(): StockTransfer[] {
    return getSavedState().stockTransfers;
  },

  getWastage(): WastageRecord[] {
    return getSavedState().wastageRecords;
  },

  getComplimentary(): ComplimentaryItem[] {
    return getSavedState().complimentaryItems;
  },

  getStockReports(): DailyStockCountReport[] {
    return getSavedState().stockCounts;
  },

  getSnookerTables(): SnookerTable[] {
    return getSavedState().snookerTables;
  },

  getSnookerBookings(): SnookerBooking[] {
    return getSavedState().snookerBookings;
  },

  getEventBookings(): EventBooking[] {
    return getSavedState().eventBookings;
  },

  getHotelRooms(): HotelRoom[] {
    const state = getSavedState();
    if (!state.hotelRooms || state.hotelRooms.length === 0) {
      state.hotelRooms = INITIAL_HOTEL_ROOMS;
      saveState(state);
    }
    return state.hotelRooms;
  },

  getHotelBookings(): HotelBooking[] {
    const state = getSavedState();
    if (!state.hotelBookings) {
      state.hotelBookings = INITIAL_HOTEL_BOOKINGS;
      saveState(state);
    }
    return state.hotelBookings;
  },

  recordHotelBooking(booking: HotelBooking): void {
    const state = getSavedState();
    if (!state.hotelBookings) {
      state.hotelBookings = [];
    }
    state.hotelBookings.push(booking);

    // Audit log
    state.auditLogs.push({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      userId: 'public_customer',
      userName: booking.customerName,
      userRole: 'customer',
      action: `Hotel Room Reservation: ${booking.roomName} (${booking.checkInDate} to ${booking.checkOutDate})`,
      location: 'Grand Ville Hotel & Suites Gombe',
      transactionReference: booking.reference,
      ipDevice: 'Web Hotel Portal'
    });

    saveState(state);
  },

  updateHotelRoomStatus(roomId: string, status: HotelRoom['status']): void {
    const state = getSavedState();
    const room = state.hotelRooms.find(r => r.id === roomId);
    if (room) {
      room.status = status;
      saveState(state);
    }
  },

  getAuditLogs(): AuditLog[] {
    return getSavedState().auditLogs;
  },

  getBusinessConfig(): BusinessConfig {
    return getSavedState().businessConfig;
  },

  recordSale(sale: Sale): void {
    const state = getSavedState();
    state.sales.push(sale);

    // Deduct stock from the refrigerator
    sale.items.forEach(item => {
      const balance = state.stockBalances.find(
        b => b.locationId === sale.refrigeratorId && b.productId === item.productId
      );
      if (balance) {
        balance.quantity = Math.max(0, balance.quantity - item.quantity);
        balance.lastUpdated = `${sale.date} ${sale.time}`;
      }

      // Add audit log
      state.auditLogs.push({
        id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString(),
        date: sale.date,
        time: sale.time,
        userId: sale.staffId,
        userName: sale.staffName,
        userRole: 'sales_staff',
        action: 'POS Sale Executed',
        product: item.productName,
        quantity: item.quantity,
        location: sale.refrigeratorId,
        transactionReference: sale.reference,
        ipDevice: 'Android POS Handheld (Terminal 07)'
      });
    });

    saveState(state);
  },

  submitClosingCount(report: DailyStockCountReport): void {
    const state = getSavedState();
    const idx = state.stockCounts.findIndex(r => r.id === report.id);
    if (idx >= 0) {
      state.stockCounts[idx] = report;
    } else {
      state.stockCounts.push(report);
    }

    state.auditLogs.push({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      date: report.date,
      time: report.submittedAt.split(' ')[1] || '23:59',
      userId: report.staffId,
      userName: report.staffName,
      userRole: 'sales_staff',
      action: 'Submitted End-of-Day Physical Closing Count',
      location: report.refrigeratorId,
      transactionReference: report.reference,
      ipDevice: 'Staff Mobile Terminal'
    });

    saveState(state);
  },

  approveClosingCount(reportId: string, managerName: string): void {
    const state = getSavedState();
    const report = state.stockCounts.find(r => r.id === reportId);
    if (report) {
      report.status = 'approved';
      report.approvedBy = managerName;
      report.approvedAt = new Date().toISOString();

      state.auditLogs.push({
        id: `aud_${Date.now()}`,
        timestamp: new Date().toISOString(),
        date: report.date,
        time: 'Audit Time',
        userId: 'mgr',
        userName: managerName,
        userRole: 'bar_manager',
        action: 'Approved & Permanently Locked Daily Closing Count',
        location: report.refrigeratorId,
        transactionReference: report.reference,
        ipDevice: 'Manager Workstation'
      });

      saveState(state);
    }
  },

  createTransfer(transfer: StockTransfer): void {
    const state = getSavedState();
    state.stockTransfers.push(transfer);

    // Move stock if approved/received
    const fromBal = state.stockBalances.find(b => b.locationId === transfer.fromLocationId && b.productId === transfer.productId);
    const toBal = state.stockBalances.find(b => b.locationId === transfer.toLocationId && b.productId === transfer.productId);

    if (fromBal) {
      fromBal.quantity = Math.max(0, fromBal.quantity - transfer.quantity);
      fromBal.lastUpdated = `${transfer.date} ${transfer.time}`;
    }

    if (toBal) {
      toBal.quantity += transfer.quantity;
      toBal.lastUpdated = `${transfer.date} ${transfer.time}`;
    } else {
      // create new balance entry
      const prod = state.products.find(p => p.id === transfer.productId);
      if (prod) {
        state.stockBalances.push({
          id: `bal_${Date.now()}`,
          locationId: transfer.toLocationId,
          productId: transfer.productId,
          productName: prod.name,
          category: prod.category,
          quantity: transfer.quantity,
          lastUpdated: `${transfer.date} ${transfer.time}`
        });
      }
    }

    state.auditLogs.push({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      date: transfer.date,
      time: transfer.time,
      userId: 'auth',
      userName: transfer.authorizedBy,
      userRole: 'stock_manager',
      action: `Stock Transfer: ${transfer.fromLocationName} -> ${transfer.toLocationName}`,
      product: transfer.productName,
      quantity: transfer.quantity,
      location: transfer.toLocationId,
      transactionReference: transfer.reference,
      ipDevice: 'Stock Management Tablet'
    });

    saveState(state);
  },

  updateTransferStatus(transferId: string, status: StockTransfer['status'], receiverName?: string): void {
    const state = getSavedState();
    const trf = state.stockTransfers.find(t => t.id === transferId);
    if (trf) {
      trf.status = status;
      if (receiverName) trf.receivedBy = receiverName;
      saveState(state);
    }
  },

  approveWastage(wastageId: string, managerName: string): void {
    const state = getSavedState();
    const wst = state.wastageRecords.find(w => w.id === wastageId);
    if (wst) {
      wst.status = 'approved';
      wst.approvedBy = managerName;
      wst.approvedAt = new Date().toISOString();

      // Deduct from location stock
      const bal = state.stockBalances.find(b => b.locationId === wst.locationId && b.productId === wst.productId);
      if (bal) {
        bal.quantity = Math.max(0, bal.quantity - wst.quantity);
      }

      state.auditLogs.push({
        id: `aud_${Date.now()}`,
        timestamp: new Date().toISOString(),
        date: wst.date,
        time: wst.time,
        userId: 'mgr',
        userName: managerName,
        userRole: 'bar_manager',
        action: `Approved Wastage/Damage (${wst.reason})`,
        product: wst.productName,
        quantity: wst.quantity,
        location: wst.locationName,
        transactionReference: wst.reference,
        ipDevice: 'Bar Manager Terminal'
      });

      saveState(state);
    }
  },

  updateProductPrice(productId: string, newPrice: number, managerName: string): void {
    const state = getSavedState();
    const prod = state.products.find(p => p.id === productId);
    if (prod) {
      const oldPrice = prod.sellingPrice;
      prod.sellingPrice = newPrice;

      state.auditLogs.push({
        id: `aud_${Date.now()}`,
        timestamp: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        userId: 'mgr',
        userName: managerName,
        userRole: 'general_manager',
        action: `Price Update: ${prod.name} changed from ₦${oldPrice} to ₦${newPrice}`,
        product: prod.name,
        location: 'All Outlets',
        ipDevice: 'Executive Workstation'
      });

      saveState(state);
    }
  },

  recordSnookerBooking(booking: SnookerBooking): void {
    const state = getSavedState();
    state.snookerBookings.push(booking);
    saveState(state);
  },

  recordEventBooking(booking: EventBooking): void {
    const state = getSavedState();
    state.eventBookings.push(booking);
    saveState(state);
  },

  resetToFactoryDemo(): void {
    localStorage.removeItem(`${STORAGE_PREFIX}state_v1`);
    getSavedState();
  }
};

