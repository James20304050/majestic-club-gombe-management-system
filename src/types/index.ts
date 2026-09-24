export type Role = 
  | 'owner'
  | 'board_director'
  | 'general_manager'
  | 'stock_manager'
  | 'bar_manager'
  | 'sales_staff'
  | 'snooker_manager'
  | 'auditor'
  | 'system_admin';

export type ProductCategory = 
  | 'BEER'
  | 'WATER'
  | 'SOFT DRINKS'
  | 'WINE'
  | 'SPIRITS'
  | 'OTHER DRINKS';

export type LocationType = 
  | 'main_store'
  | 'main_bar'
  | 'club_bar'
  | 'vip_bar'
  | 'refrigerator';

export interface Location {
  id: string;
  name: string;
  code: string;
  type: LocationType;
  description?: string;
}

export interface Product {
  id: string;
  code: string; // e.g. LIFE-001
  name: string;
  category: ProductCategory;
  brand: string;
  unit: string; // 'Bottle', 'Can', 'Pack'
  purchasePrice: number;
  sellingPrice: number;
  minStockLevel: number;
  maxStockLevel: number;
  qrCode: string;
  barcode?: string;
  isActive: boolean;
  createdAt: string;
  image?: string;
  volume?: string; // '60cl', '33cl', '75cl'
}

export interface Refrigerator {
  id: string; // FR-001 ... FR-020
  name: string;
  assignedStaffId: string;
  assignedStaffName: string;
  location: string; // e.g., 'Club Floor Left', 'Main Bar A'
  capacity: number; // approx 500
  status: 'active' | 'maintenance' | 'offline';
  temperature?: string; // e.g. '3.2°C'
  lastCleaned?: string;
}

export interface StaffMember {
  id: string;
  staffCode: string; // e.g. SG-001 to SG-020, GM-001, etc.
  name: string;
  role: Role;
  assignedRefrigeratorId?: string; // e.g. FR-007
  phone: string;
  email: string;
  active: boolean;
  avatar?: string;
}

export type MovementType = 
  | 'OPENING_STOCK'
  | 'STOCK_RECEIVED'
  | 'STOCK_TRANSFER'
  | 'SALE'
  | 'RETURN'
  | 'WASTAGE'
  | 'COMPLIMENTARY'
  | 'ADJUSTMENT'
  | 'CLOSING_COUNT';

export interface StockBalance {
  id: string;
  locationId: string; // could be Location ID or Refrigerator ID (e.g. FR-001)
  productId: string;
  productName: string;
  category: ProductCategory;
  quantity: number;
  lastUpdated: string;
}

export interface StockTransaction {
  id: string;
  reference: string; // e.g. TX-20260923-001
  timestamp: string;
  date: string;
  time: string;
  userId: string;
  userName: string;
  userRole: Role;
  type: MovementType;
  locationId: string;
  locationName: string;
  productId: string;
  productName: string;
  quantity: number; // positive or negative
  unitPrice: number;
  totalPrice: number;
  reason?: string;
  notes?: string;
  batchReference?: string;
  ipDevice?: string;
}

export type TransferStatus = 'pending' | 'approved' | 'received' | 'cancelled';

export interface StockTransfer {
  id: string;
  reference: string;
  fromLocationId: string;
  fromLocationName: string;
  toLocationId: string;
  toLocationName: string;
  productId: string;
  productName: string;
  quantity: number;
  authorizedBy: string;
  receivedBy?: string;
  date: string;
  time: string;
  timestamp: string;
  status: TransferStatus;
  notes?: string;
}

export type WastageReason = 
  | 'Broken bottle'
  | 'Damaged product'
  | 'Spoiled product'
  | 'Spillage'
  | 'Other approved reason';

export interface WastageRecord {
  id: string;
  reference: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalLoss: number;
  reason: WastageReason;
  staffId: string;
  staffName: string;
  locationId: string;
  locationName: string;
  date: string;
  time: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
}

export interface ComplimentaryItem {
  id: string;
  reference: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  beneficiary: string; // VIP Customer / Artist / Dignitary
  staffId: string;
  staffName: string;
  locationId: string;
  locationName: string;
  date: string;
  time: string;
  approvedBy: string;
  notes?: string;
}

export interface SaleItem {
  productId: string;
  productCode: string;
  productName: string;
  category: ProductCategory;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type PaymentMethod = 'CASH' | 'POS_TRANSFER' | 'CARD' | 'VIP_TAB';

export interface Sale {
  id: string;
  reference: string;
  timestamp: string;
  date: string;
  time: string;
  staffId: string;
  staffName: string;
  refrigeratorId: string;
  refrigeratorName: string;
  items: SaleItem[];
  totalQuantity: number;
  totalAmount: number;
  tableNumber: string; // or 'Walk-in Bar'
  customerName?: string;
  paymentMethod: PaymentMethod;
  paymentReference: string;
  paymentStatus: 'PAID' | 'PENDING';
  notes?: string;
}

export interface StockCountItem {
  productId: string;
  productCode: string;
  productName: string;
  category: ProductCategory;
  openingStock: number;
  stockReceived: number;
  stockTransferred: number;
  sales: number;
  wastage: number;
  complimentary: number;
  expectedClosingStock: number;
  physicalClosingStock: number;
  variance: number; // physical - expected
  unitPrice: number;
  varianceValue: number; // variance * unitPrice
  notes?: string;
}

export interface DailyStockCountReport {
  id: string;
  reference: string;
  date: string;
  refrigeratorId: string;
  refrigeratorName: string;
  staffId: string;
  staffName: string;
  submittedAt: string;
  items: StockCountItem[];
  totalExpected: number;
  totalPhysical: number;
  totalVariance: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  managerNotes?: string;
}

export interface SnookerTable {
  id: string;
  name: string; // e.g. 'Snooker Table 01', 'Pool Table 01'
  type: 'snooker' | 'pool';
  hourlyPrice: number; // e.g. ₦3,000 / hr
  status: 'available' | 'in_play' | 'reserved' | 'maintenance';
  currentSessionStart?: string;
  currentCustomer?: string;
}

export interface SnookerBooking {
  id: string;
  reference: string;
  customerName: string;
  phone: string;
  tableId: string;
  tableName: string;
  date: string;
  timeSlot: string; // e.g. '18:00 - 19:30'
  durationHours: number;
  numberOfPlayers: number;
  totalAmount: number;
  paymentStatus: 'PAID' | 'PENDING' | 'DEPOSIT_PAID';
  status: 'confirmed' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface EventBooking {
  id: string;
  reference: string;
  type: 'VIP_TABLE' | 'BIRTHDAY_PARTY' | 'PRIVATE_EVENT' | 'CORPORATE_EVENT' | 'CLUB_EVENT';
  customerName: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  package: string; // e.g. 'Majestic VIP Diamond', 'Gold Birthday Bash'
  numberOfPeople: number;
  tableArea?: string; // e.g. 'VIP Cabana 3'
  amount: number;
  depositAmount: number;
  paymentStatus: 'PAID' | 'DEPOSIT_PAID' | 'PENDING';
  status: 'confirmed' | 'in_review' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface HotelRoom {
  id: string;
  roomNumber: string;
  name: string; // e.g. 'Deluxe King Room', 'Executive Suite'
  category: 'STANDARD' | 'DELUXE' | 'EXECUTIVE' | 'PRESIDENTIAL_SUITE';
  pricePerNight: number;
  capacity: number; // max guests
  bedType: string; // e.g. 'King Bed', 'Queen Bed', '2 Double Beds'
  floor: string;
  amenities: string[];
  description: string;
  images: string[];
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  isPopular?: boolean;
}

export interface HotelBooking {
  id: string;
  reference: string; // e.g. HTL-2026-001
  roomId: string;
  roomName: string;
  roomCategory: 'STANDARD' | 'DELUXE' | 'EXECUTIVE' | 'PRESIDENTIAL_SUITE';
  customerName: string;
  phone: string;
  email?: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfNights: number;
  numberOfGuests: number;
  pricePerNight: number;
  totalAmount: number;
  paymentStatus: 'PAID' | 'DEPOSIT_PAID' | 'PENDING';
  status: 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  specialRequests?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  date: string;
  time: string;
  userId: string;
  userName: string;
  userRole: Role;
  action: string;
  product?: string;
  quantity?: number;
  location?: string;
  transactionReference?: string;
  oldValue?: string;
  newValue?: string;
  ipDevice: string;
}

export interface BusinessConfig {
  clubName: string;
  tagline: string;
  address: string;
  state: string;
  country: string;
  phone: string;
  whatsapp: string;
  email: string;
  currency: string;
  currencySymbol: string;
  taxRate: number;
  licenseNumber: string;
  operatingHours: string;
  onlineOrderingActive: boolean;
  onlinePaymentActive: boolean; // Paystack integration ready
  allowNegativeStock: boolean;
}
