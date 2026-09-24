import React, { useState } from 'react';
import { 
  StaffMember, 
  Refrigerator, 
  Product, 
  Location, 
  StockBalance, 
  Sale, 
  StockTransfer, 
  WastageRecord, 
  ComplimentaryItem, 
  DailyStockCountReport, 
  SnookerTable, 
  SnookerBooking, 
  EventBooking, 
  HotelRoom,
  HotelBooking,
  AuditLog, 
  BusinessConfig,
  Role,
  ProductCategory
} from '../../types';
import { formatNaira, formatNumber, exportToCSV, generateRef, getCurrentDateStr, getCurrentTimeStr } from '../../utils/helpers';
import { 
  LayoutDashboard, 
  Boxes, 
  ArrowRightLeft, 
  AlertOctagon, 
  FileSpreadsheet, 
  History, 
  Trophy, 
  Crown, 
  Users, 
  Database, 
  CheckCircle2, 
  XCircle, 
  Download, 
  Printer, 
  Search, 
  Filter, 
  Plus, 
  LogOut, 
  ChevronRight, 
  Layers, 
  ShieldAlert, 
  TrendingUp, 
  DollarSign, 
  PackageCheck,
  RefreshCw,
  QrCode,
  Tag,
  BarChart3,
  Flame,
  Wine,
  Camera,
  Eye,
  ExternalLink,
  Sparkles,
  Hotel,
  BedDouble,
  CalendarCheck
} from 'lucide-react';
import { QRCodeView } from '../common/QRCodeView';
import { CLUB_IMAGES, GALLERY_ITEMS } from '../../assets/clubImages';

interface ManagerDashboardProps {
  currentUser: StaffMember;
  staffList: StaffMember[];
  refrigerators: Refrigerator[];
  products: Product[];
  locations: Location[];
  stockBalances: StockBalance[];
  sales: Sale[];
  transfers: StockTransfer[];
  wastageRecords: WastageRecord[];
  complimentaryItems: ComplimentaryItem[];
  stockReports: DailyStockCountReport[];
  snookerTables: SnookerTable[];
  snookerBookings: SnookerBooking[];
  eventBookings: EventBooking[];
  auditLogs: AuditLog[];
  businessConfig: BusinessConfig;
  onSwitchUser: (staff: StaffMember) => void;
  onCreateTransfer: (transfer: StockTransfer) => void;
  onUpdateTransferStatus: (transferId: string, status: StockTransfer['status'], receiverName?: string) => void;
  onApproveWastage: (wastageId: string, approved: boolean) => void;
  onApproveStockCount: (reportId: string) => void;
  onAddProduct: (prod: Product) => void;
  onUpdateProductPrice: (prodId: string, newPrice: number) => void;
  onRecordComplimentary: (comp: ComplimentaryItem) => void;
  onLogout: () => void;
  onResetFactoryDemo: () => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  currentUser,
  staffList,
  refrigerators,
  products,
  locations,
  stockBalances,
  sales,
  transfers,
  wastageRecords,
  complimentaryItems,
  stockReports,
  snookerTables,
  snookerBookings,
  eventBookings,
  auditLogs,
  businessConfig,
  onSwitchUser,
  onCreateTransfer,
  onUpdateTransferStatus,
  onApproveWastage,
  onApproveStockCount,
  onAddProduct,
  onUpdateProductPrice,
  onRecordComplimentary,
  onLogout,
  onResetFactoryDemo
}) => {
  // Navigation tabs
  type NavTab = 
    | 'OVERVIEW'
    | 'REFRIGERATORS_20'
    | 'LOCATION_STOCK'
    | 'TRANSFERS'
    | 'WASTAGE_COMP'
    | 'CLOSING_AUDITS'
    | 'EXECUTIVE_REPORT'
    | 'REPORTS_CENTER'
    | 'SNOOKER_VIP'
    | 'PRODUCT_CATALOG'
    | 'AUDIT_LOG'
    | 'DATABASE_SCHEMA'
    | 'BRAND_ASSETS';

  const [activeTab, setActiveTab] = useState<NavTab>('OVERVIEW');
  const [selectedFridgeDetail, setSelectedFridgeDetail] = useState<string | null>(null);
  const [selectedAssetPreview, setSelectedAssetPreview] = useState<{ src: string; title: string; subtitle: string; tag: string } | null>(null);

  // New Transfer Modal state
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [newTransferForm, setNewTransferForm] = useState({
    fromLocationId: 'loc_main_store',
    toLocationId: 'FR-007',
    productId: products[0]?.id || '',
    quantity: 50,
    notes: ''
  });

  // Price update state
  const [editingPriceProdId, setEditingPriceProdId] = useState<string | null>(null);
  const [newPriceValue, setNewPriceValue] = useState<number>(0);

  // Filter state for Reports Center
  const [reportFilterDate, setReportFilterDate] = useState(getCurrentDateStr());
  const [reportFilterStaff, setReportFilterStaff] = useState('ALL');
  const [reportFilterCategory, setReportFilterCategory] = useState('ALL');

  // Role permissions check
  const isOwnerOrDirector = currentUser.role === 'owner' || currentUser.role === 'board_director';
  const isGM = currentUser.role === 'general_manager';
  const isAuditor = currentUser.role === 'auditor';
  const isStockOrBarMgr = currentUser.role === 'stock_manager' || currentUser.role === 'bar_manager';

  // Calculations for Today's KPIs
  const today = getCurrentDateStr();
  const todaySales = sales.filter(s => s.date === today);
  const todaySalesTotal = todaySales.reduce((sum, s) => sum + s.totalAmount, 0);
  const todayBottlesSold = todaySales.reduce((sum, s) => sum + s.totalQuantity, 0);

  // Current Total Stock in system
  const totalStockCount = stockBalances.reduce((sum, b) => sum + b.quantity, 0);
  const mainStoreStock = stockBalances.filter(b => b.locationId === 'loc_main_store').reduce((sum, b) => sum + b.quantity, 0);
  const mainBarStock = stockBalances.filter(b => b.locationId === 'loc_main_bar').reduce((sum, b) => sum + b.quantity, 0);
  const clubBarStock = stockBalances.filter(b => b.locationId === 'loc_club_bar').reduce((sum, b) => sum + b.quantity, 0);
  const vipBarStock = stockBalances.filter(b => b.locationId === 'loc_vip_bar').reduce((sum, b) => sum + b.quantity, 0);
  const fridgesStock = stockBalances.filter(b => b.locationId.startsWith('FR-')).reduce((sum, b) => sum + b.quantity, 0);

  // Wastage & Complimentary
  const totalWastageQuantity = wastageRecords.filter(w => w.status === 'approved').reduce((sum, w) => sum + w.quantity, 0);
  const totalWastageLoss = wastageRecords.filter(w => w.status === 'approved').reduce((sum, w) => sum + w.totalLoss, 0);
  const totalCompValue = complimentaryItems.reduce((sum, c) => sum + c.totalValue, 0);
  const totalCompQty = complimentaryItems.reduce((sum, c) => sum + c.quantity, 0);

  // Stock Variance across reports
  const totalVarianceBottles = stockReports.reduce((sum, r) => sum + r.totalVariance, 0);

  // Create Transfer Action
  const handleCreateTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find(p => p.id === newTransferForm.productId);
    const fromLoc = locations.find(l => l.id === newTransferForm.fromLocationId) || { name: newTransferForm.fromLocationId };
    const toFridge = refrigerators.find(r => r.id === newTransferForm.toLocationId);
    const toLoc = toFridge ? { name: toFridge.name } : locations.find(l => l.id === newTransferForm.toLocationId) || { name: newTransferForm.toLocationId };

    if (!prod) return;

    const newTransfer: StockTransfer = {
      id: `trf_${Date.now()}`,
      reference: generateRef('TRF'),
      fromLocationId: newTransferForm.fromLocationId,
      fromLocationName: fromLoc.name,
      toLocationId: newTransferForm.toLocationId,
      toLocationName: toLoc.name,
      productId: prod.id,
      productName: prod.name,
      quantity: Number(newTransferForm.quantity),
      authorizedBy: `${currentUser.name} (${currentUser.role.replace('_', ' ').toUpperCase()})`,
      date: getCurrentDateStr(),
      time: getCurrentTimeStr(),
      timestamp: new Date().toISOString(),
      status: 'approved', // auto approved if created by manager
      notes: newTransferForm.notes
    };

    onCreateTransfer(newTransfer);
    setIsTransferModalOpen(false);
  };

  // Refrigerator Stock Helper
  const getRefrigeratorStock = (fridgeId: string) => {
    return stockBalances
      .filter(b => b.locationId === fridgeId)
      .reduce((sum, b) => sum + b.quantity, 0);
  };

  const getRefrigeratorProductStock = (fridgeId: string, productId: string) => {
    return stockBalances.find(b => b.locationId === fridgeId && b.productId === productId)?.quantity || 0;
  };

  // Export reports to CSV
  const handleExportSalesCSV = () => {
    const rows = sales.map(s => ({
      Reference: s.reference,
      Date: s.date,
      Time: s.time,
      Staff: s.staffName,
      Refrigerator: s.refrigeratorId,
      Table: s.tableNumber,
      Bottles: s.totalQuantity,
      Amount: s.totalAmount,
      PaymentMethod: s.paymentMethod,
      PaymentStatus: s.paymentStatus
    }));
    exportToCSV(`Majestic_Club_Sales_${getCurrentDateStr()}`, rows);
  };

  const handleExportStockCSV = () => {
    const rows = stockBalances.map(b => ({
      Location: b.locationId,
      Product: b.productName,
      Category: b.category,
      Quantity: b.quantity,
      LastUpdated: b.lastUpdated
    }));
    exportToCSV(`Majestic_Club_Stock_Balances_${getCurrentDateStr()}`, rows);
  };

  const handleExportExecutiveCSV = () => {
    const rows = products.map(prod => {
      const sold = sales
        .flatMap(s => s.items)
        .filter(i => i.productId === prod.id)
        .reduce((sum, i) => sum + i.quantity, 0);
      const stock = stockBalances
        .filter(b => b.productId === prod.id)
        .reduce((sum, b) => sum + b.quantity, 0);

      return {
        ProductCode: prod.code,
        ProductName: prod.name,
        Category: prod.category,
        UnitsSold: sold,
        CurrentTotalStock: stock,
        SellingPrice: prod.sellingPrice,
        TotalSalesValue: sold * prod.sellingPrice
      };
    });
    exportToCSV(`Majestic_Executive_Summary_${getCurrentDateStr()}`, rows);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* Top Header & Role Switcher Bar */}
      <header className="sticky top-0 z-40 bg-neutral-900 border-b border-neutral-800 px-4 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-yellow-700 flex items-center justify-center text-black font-black shadow-md">
              <Crown className="w-6 h-6 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-wider text-white font-serif">
                  MAJESTIC CLUB GOMBE
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono font-bold uppercase border border-amber-500/30">
                  MANAGEMENT PORTAL
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-mono">
                Logged in as: <strong className="text-neutral-200">{currentUser.name}</strong> ({currentUser.role.replace('_', ' ').toUpperCase()})
              </p>
            </div>
          </div>

          {/* Quick Role & Staff Switcher */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-neutral-950 px-3 py-1.5 rounded-xl border border-neutral-800 text-xs">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-neutral-400">Switch Account:</span>
              <select
                value={currentUser.id}
                onChange={e => {
                  const target = staffList.find(s => s.id === e.target.value);
                  if (target) onSwitchUser(target);
                }}
                className="bg-neutral-900 text-amber-300 font-semibold rounded px-2 py-1 text-xs border border-neutral-700 focus:outline-none focus:border-amber-500"
              >
                <optgroup label="Executive & Management">
                  {staffList.filter(s => s.role !== 'sales_staff').map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.role.replace('_', ' ').toUpperCase()})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="20 Sales Staff (Refrigerators FR-001 to FR-020)">
                  {staffList.filter(s => s.role === 'sales_staff').map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} → {s.assignedRefrigeratorId}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <button
              onClick={onResetFactoryDemo}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 text-xs flex items-center gap-1"
              title="Reset Demo Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>

            <button
              onClick={onLogout}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-red-950 text-neutral-300 hover:text-red-400 border border-neutral-700 text-xs flex items-center gap-1"
              title="Exit to Public Website"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Tabs Navigation */}
      <div className="bg-neutral-900/90 border-b border-neutral-800 px-4 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-1 py-2 min-w-max">
          {[
            { id: 'OVERVIEW', label: 'Dashboard Overview', icon: LayoutDashboard },
            { id: 'REFRIGERATORS_20', label: '20 Refrigerators', icon: Boxes },
            { id: 'LOCATION_STOCK', label: 'Location Stock Summary', icon: Layers },
            { id: 'TRANSFERS', label: 'Stock Transfers', icon: ArrowRightLeft },
            { id: 'WASTAGE_COMP', label: 'Wastage & Complimentaries', icon: AlertOctagon },
            { id: 'CLOSING_AUDITS', label: 'End-of-Day Counts', icon: PackageCheck },
            { id: 'EXECUTIVE_REPORT', label: 'Executive Board Report', icon: TrendingUp },
            { id: 'REPORTS_CENTER', label: 'Reports & Exports', icon: FileSpreadsheet },
            { id: 'SNOOKER_VIP', label: 'Snooker & VIP Bookings', icon: Trophy },
            { id: 'PRODUCT_CATALOG', label: 'Products & Pricing', icon: Tag },
            { id: 'AUDIT_LOG', label: 'Immutable Audit Trail', icon: History },
            { id: 'DATABASE_SCHEMA', label: 'PostgreSQL Relational Schema', icon: Database },
            { id: 'BRAND_ASSETS', label: 'Club Visual Assets', icon: Camera },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as NavTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold tracking-wider transition ${
                  isActive
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN DASHBOARD CONTENT */}
      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex-1 space-y-6">
        
        {/* ========================================================================= */}
        {/* 1. OVERVIEW TAB */}
        {/* ========================================================================= */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            {/* Executive Ambient Hero Banner with Branded Background Graphic */}
            <div className="relative rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl p-6 sm:p-8">
              <div className="absolute inset-0 z-0 pointer-events-none">
                <img
                  src={CLUB_IMAGES.systemMockup}
                  alt="Executive System Architecture"
                  className="w-full h-full object-cover opacity-20 filter blur-[0.5px]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/90 to-neutral-950/75" />
              </div>
              <div className="relative z-10 max-w-3xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold tracking-wider uppercase">
                  <Crown className="w-3.5 h-3.5" />
                  MAJESTIC CLUB GOMBE • EXECUTIVE COMMAND
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight">
                  Good Drinks. Great Vibes. Majestic Experience.
                </h2>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  Real-time operational control across 20 refrigerator stations (FR-001 to FR-020), Main Storage, and VIP bars. Every single transaction, bottle transfer, and variance is cryptographically logged to guarantee transparency.
                </p>
                <div className="pt-2 flex flex-wrap gap-2.5">
                  <button
                    onClick={() => setActiveTab('REFRIGERATORS_20')}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                  >
                    <Boxes className="w-3.5 h-3.5" />
                    <span>Manage 20 Fridges</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('BRAND_ASSETS')}
                    className="px-4 py-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-750 text-neutral-200 border border-neutral-700 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5 text-amber-400" />
                    <span>View Club Photos & Media</span>
                  </button>
                  <button
                    onClick={handleExportExecutiveCSV}
                    className="px-4 py-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-750 text-neutral-200 border border-neutral-700 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Export Audit CSV</span>
                  </button>
                </div>
              </div>
            </div>

            {/* KPI Cards Row (Prompt's exact required metrics) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* 1. Today's total sales */}
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl shadow-lg">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">Today's Total Sales</span>
                <p className="text-xl sm:text-2xl font-black text-amber-400 font-mono mt-1">
                  {formatNaira(todaySalesTotal)}
                </p>
                <p className="text-[10px] text-neutral-500 mt-1">From all active bars</p>
              </div>

              {/* 2. Today's bottles sold */}
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl shadow-lg">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">Bottles Sold</span>
                <p className="text-xl sm:text-2xl font-black text-white font-mono mt-1">
                  {todayBottlesSold} <span className="text-xs text-neutral-400 font-normal">items</span>
                </p>
                <p className="text-[10px] text-neutral-500 mt-1">Today's transactions</p>
              </div>

              {/* 3. Current Total Stock */}
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl shadow-lg">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">Current Total Stock</span>
                <p className="text-xl sm:text-2xl font-black text-emerald-400 font-mono mt-1">
                  {formatNumber(totalStockCount)}
                </p>
                <p className="text-[10px] text-neutral-500 mt-1">Store, Bars & Fridges</p>
              </div>

              {/* 4. Active Sales Staff */}
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl shadow-lg">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">Active Sales Staff</span>
                <p className="text-xl sm:text-2xl font-black text-neutral-200 font-mono mt-1">
                  20 <span className="text-xs text-neutral-400 font-normal">staff</span>
                </p>
                <p className="text-[10px] text-emerald-400 mt-1 font-semibold">20 Fridges Mapped</p>
              </div>

              {/* 5. Approved Wastage Loss */}
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl shadow-lg">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">Wastage Recorded</span>
                <p className="text-xl sm:text-2xl font-black text-red-400 font-mono mt-1">
                  {formatNaira(totalWastageLoss)}
                </p>
                <p className="text-[10px] text-neutral-500 mt-1">{totalWastageQuantity} bottles broken/spilled</p>
              </div>

              {/* 6. Stock Variance */}
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl shadow-lg">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">Stock Variance</span>
                <p className={`text-xl sm:text-2xl font-black font-mono mt-1 ${
                  totalVarianceBottles === 0 ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {totalVarianceBottles === 0 ? '0' : totalVarianceBottles} <span className="text-xs font-normal">bottles</span>
                </p>
                <p className="text-[10px] text-neutral-500 mt-1">Closing count delta</p>
              </div>
            </div>

            {/* Location Stock Breakdown Row */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div className="p-3.5 bg-neutral-900 border border-neutral-800 rounded-xl">
                <span className="text-[10px] font-bold text-neutral-400 uppercase">Main Central Store</span>
                <p className="text-lg font-bold text-amber-300 font-mono mt-1">{formatNumber(mainStoreStock)} bottles</p>
                <span className="text-[10px] text-neutral-500">Bulk reserve warehouse</span>
              </div>
              <div className="p-3.5 bg-neutral-900 border border-neutral-800 rounded-xl">
                <span className="text-[10px] font-bold text-neutral-400 uppercase">Main Hall Bar</span>
                <p className="text-lg font-bold text-neutral-200 font-mono mt-1">{formatNumber(mainBarStock)} bottles</p>
                <span className="text-[10px] text-neutral-500">Ground floor station</span>
              </div>
              <div className="p-3.5 bg-neutral-900 border border-neutral-800 rounded-xl">
                <span className="text-[10px] font-bold text-neutral-400 uppercase">Club Floor Bar</span>
                <p className="text-lg font-bold text-neutral-200 font-mono mt-1">{formatNumber(clubBarStock)} bottles</p>
                <span className="text-[10px] text-neutral-500">Dancefloor active bar</span>
              </div>
              <div className="p-3.5 bg-neutral-900 border border-neutral-800 rounded-xl">
                <span className="text-[10px] font-bold text-neutral-400 uppercase">VIP Lounge Bar</span>
                <p className="text-lg font-bold text-amber-400 font-mono mt-1">{formatNumber(vipBarStock)} bottles</p>
                <span className="text-[10px] text-neutral-500">Premium cognac & wine</span>
              </div>
              <div className="p-3.5 bg-neutral-900 border border-neutral-800 rounded-xl">
                <span className="text-[10px] font-bold text-neutral-400 uppercase">20 Refrigerators</span>
                <p className="text-lg font-bold text-emerald-400 font-mono mt-1">{formatNumber(fridgesStock)} bottles</p>
                <span className="text-[10px] text-neutral-500">Assigned to sales girls</span>
              </div>
            </div>

            {/* Quick Actions & Recent Sales Table */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Recent Sales (7 cols) */}
              <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                    <h3 className="font-bold text-sm text-neutral-100">Live Sales Transactions</h3>
                  </div>
                  <button
                    onClick={handleExportSalesCSV}
                    className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Download className="w-3 h-3" /> Export CSV
                  </button>
                </div>

                <div className="overflow-x-auto mt-3">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px] font-bold">
                        <th className="py-2 px-2">Ref</th>
                        <th className="py-2 px-2">Staff</th>
                        <th className="py-2 px-2">Fridge</th>
                        <th className="py-2 px-2">Items</th>
                        <th className="py-2 px-2 text-right">Amount</th>
                        <th className="py-2 px-2 text-center">Payment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60 font-mono">
                      {sales.slice(-8).reverse().map(sale => (
                        <tr key={sale.id} className="hover:bg-neutral-850">
                          <td className="py-2 px-2 text-amber-400 font-bold">{sale.reference}</td>
                          <td className="py-2 px-2 font-sans text-neutral-200">{sale.staffName}</td>
                          <td className="py-2 px-2 text-neutral-300">{sale.refrigeratorId}</td>
                          <td className="py-2 px-2 text-neutral-400 font-sans text-[11px]">
                            {sale.items.map(i => `${i.quantity}x ${i.productName.split(' ')[0]}`).join(', ')}
                          </td>
                          <td className="py-2 px-2 text-right font-bold text-white">{formatNaira(sale.totalAmount)}</td>
                          <td className="py-2 px-2 text-center">
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                              {sale.paymentMethod}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Transfers & Wastage Watch (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                {/* Active Transfers */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    <div className="flex items-center gap-2">
                      <ArrowRightLeft className="w-4 h-4 text-amber-400" />
                      <h3 className="font-bold text-sm text-neutral-100">Recent Stock Transfers</h3>
                    </div>
                    <button
                      onClick={() => setIsTransferModalOpen(true)}
                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg transition flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> New Transfer
                    </button>
                  </div>

                  <div className="mt-3 space-y-2.5">
                    {transfers.slice(-4).reverse().map(trf => (
                      <div key={trf.id} className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-mono font-bold text-amber-400">{trf.reference}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            trf.status === 'received' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {trf.status}
                          </span>
                        </div>
                        <p className="font-semibold text-neutral-200 mt-1">
                          {trf.quantity}x {trf.productName}
                        </p>
                        <p className="text-[11px] text-neutral-400 mt-0.5 font-mono">
                          {trf.fromLocationName} → {trf.toLocationName}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audit trail preview */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4 text-amber-400" />
                      <h3 className="font-bold text-sm text-neutral-100">Live Audit Activity</h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('AUDIT_LOG')}
                      className="text-xs text-amber-400 hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  <div className="mt-3 space-y-2">
                    {auditLogs.slice(-3).reverse().map(log => (
                      <div key={log.id} className="p-2 bg-neutral-950 rounded-lg border border-neutral-850 text-xs">
                        <p className="text-neutral-300 font-medium">{log.action}</p>
                        <div className="flex justify-between items-center text-[10px] text-neutral-500 font-mono mt-1">
                          <span>{log.userName}</span>
                          <span>{log.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. THE 20 REFRIGERATORS MASTER VIEW */}
        {/* ========================================================================= */}
        {activeTab === 'REFRIGERATORS_20' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-white font-serif">20 Refrigerators Fleet (FR-001 to FR-020)</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Each assigned 1-to-1 to a sales staff member with ~500 bottle capacity per operating day.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTransferModalOpen(true)}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Transfer Stock to Refrigerator
                </button>
              </div>
            </div>

            {/* Grid of 20 Refrigerators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {refrigerators.map(fridge => {
                const stockCount = getRefrigeratorStock(fridge.id);
                const pct = Math.round((stockCount / fridge.capacity) * 100);

                return (
                  <div
                    key={fridge.id}
                    className="bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 rounded-2xl p-4 shadow-lg flex flex-col justify-between transition group"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                        <span className="font-mono font-black text-amber-400 text-base">{fridge.id}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                          {fridge.temperature}
                        </span>
                      </div>

                      <div className="mt-3">
                        <span className="text-[10px] uppercase font-bold text-neutral-400 block">Assigned Staff</span>
                        <p className="font-bold text-sm text-neutral-100">{fridge.assignedStaffName}</p>
                        <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">{fridge.location}</p>
                      </div>

                      {/* Stock Bar */}
                      <div className="mt-4">
                        <div className="flex justify-between text-xs font-mono mb-1">
                          <span className="text-neutral-400">Stock</span>
                          <span className="font-bold text-white">{stockCount} / {fridge.capacity}</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-neutral-950 overflow-hidden border border-neutral-800">
                          <div
                            className={`h-full transition-all duration-500 ${
                              pct > 70 ? 'bg-emerald-500' : pct > 30 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedFridgeDetail(fridge.id)}
                        className="text-xs text-amber-400 group-hover:underline font-semibold"
                      >
                        Inspect Breakdown →
                      </button>
                      <QRCodeView code={fridge.id} title={fridge.id} size={40} showBorder={false} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal for detailed Refrigerator Product breakdown */}
            {selectedFridgeDetail && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative max-h-[85vh] overflow-y-auto">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    <div>
                      <h3 className="text-lg font-bold font-mono text-amber-400">
                        {selectedFridgeDetail} Inventory Details
                      </h3>
                      <p className="text-xs text-neutral-400">
                        {refrigerators.find(r => r.id === selectedFridgeDetail)?.assignedStaffName} • {refrigerators.find(r => r.id === selectedFridgeDetail)?.location}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedFridgeDetail(null)}
                      className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="my-4">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-neutral-800 text-neutral-400 font-bold uppercase text-[10px]">
                          <th className="py-2 px-2">Code</th>
                          <th className="py-2 px-2">Product Name</th>
                          <th className="py-2 px-2 text-right">In Fridge</th>
                          <th className="py-2 px-2 text-right">Selling Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800 font-mono">
                        {products.map(prod => {
                          const qty = getRefrigeratorProductStock(selectedFridgeDetail, prod.id);
                          return (
                            <tr key={prod.id}>
                              <td className="py-2 px-2 text-amber-400">{prod.code}</td>
                              <td className="py-2 px-2 font-sans text-neutral-200">{prod.name}</td>
                              <td className="py-2 px-2 text-right font-black text-white">{qty}</td>
                              <td className="py-2 px-2 text-right text-neutral-400">{formatNaira(prod.sellingPrice)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <button
                    onClick={() => {
                      setNewTransferForm(prev => ({ ...prev, toLocationId: selectedFridgeDetail }));
                      setSelectedFridgeDetail(null);
                      setIsTransferModalOpen(true);
                    }}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-xl uppercase tracking-wider transition"
                  >
                    Transfer Stock to {selectedFridgeDetail}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. LOCATION STOCK SUMMARY (Prompt example: Main Store 300, Main Bar 150...) */}
        {/* ========================================================================= */}
        {activeTab === 'LOCATION_STOCK' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-3">
              <div>
                <h3 className="text-xl font-bold text-white font-serif">Comprehensive Location Stock Balances</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Cross-location audit tracking Main Central Store, Main Bar, Club Bar, VIP Bar and 20 Refrigerators.
                </p>
              </div>
              <button
                onClick={handleExportStockCSV}
                className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-amber-400 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-neutral-700"
              >
                <Download className="w-4 h-4" /> Export Stock Balances
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px] font-bold">
                    <th className="py-3 px-3">Product Name</th>
                    <th className="py-3 px-3">Code</th>
                    <th className="py-3 px-3 text-right">Main Store</th>
                    <th className="py-3 px-3 text-right">Main Bar</th>
                    <th className="py-3 px-3 text-right">Club Bar</th>
                    <th className="py-3 px-3 text-right">VIP Bar</th>
                    <th className="py-3 px-3 text-right">20 Fridges</th>
                    <th className="py-3 px-3 text-right text-amber-400 font-black">TOTAL STOCK</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 font-mono">
                  {products.map(prod => {
                    const store = stockBalances.find(b => b.locationId === 'loc_main_store' && b.productId === prod.id)?.quantity || 0;
                    const mbar = stockBalances.find(b => b.locationId === 'loc_main_bar' && b.productId === prod.id)?.quantity || 0;
                    const cbar = stockBalances.find(b => b.locationId === 'loc_club_bar' && b.productId === prod.id)?.quantity || 0;
                    const vbar = stockBalances.find(b => b.locationId === 'loc_vip_bar' && b.productId === prod.id)?.quantity || 0;
                    const fridges = stockBalances
                      .filter(b => b.locationId.startsWith('FR-') && b.productId === prod.id)
                      .reduce((s, b) => s + b.quantity, 0);
                    const total = store + mbar + cbar + vbar + fridges;

                    return (
                      <tr key={prod.id} className="hover:bg-neutral-850">
                        <td className="py-3 px-3 font-sans font-medium text-neutral-200">{prod.name}</td>
                        <td className="py-3 px-3 text-amber-400 font-bold">{prod.code}</td>
                        <td className="py-3 px-3 text-right text-neutral-300">{store}</td>
                        <td className="py-3 px-3 text-right text-neutral-300">{mbar}</td>
                        <td className="py-3 px-3 text-right text-neutral-300">{cbar}</td>
                        <td className="py-3 px-3 text-right text-neutral-300">{vbar}</td>
                        <td className="py-3 px-3 text-right text-emerald-400 font-bold">{fridges}</td>
                        <td className="py-3 px-3 text-right text-amber-400 font-black text-sm">{formatNumber(total)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. STOCK TRANSFERS */}
        {/* ========================================================================= */}
        {activeTab === 'TRANSFERS' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-3">
              <div>
                <h3 className="text-xl font-bold text-white font-serif">Stock Movement & Transfer Ledger</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Track stock movements: Main Store → Club Bar → Refrigerator 07.
                </p>
              </div>
              <button
                onClick={() => setIsTransferModalOpen(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
              >
                <Plus className="w-4 h-4" /> AUTHORISE NEW TRANSFER
              </button>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-neutral-950/80 border-b border-neutral-800 text-neutral-400 uppercase text-[10px] font-bold">
                    <th className="py-3 px-3">Transfer Ref</th>
                    <th className="py-3 px-3">Product</th>
                    <th className="py-3 px-3 text-right">Quantity</th>
                    <th className="py-3 px-3">From Location</th>
                    <th className="py-3 px-3">To Location</th>
                    <th className="py-3 px-3">Authorised By</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 font-mono">
                  {transfers.map(trf => (
                    <tr key={trf.id} className="hover:bg-neutral-850">
                      <td className="py-3 px-3 font-bold text-amber-400">{trf.reference}</td>
                      <td className="py-3 px-3 font-sans text-neutral-200">{trf.productName}</td>
                      <td className="py-3 px-3 text-right font-black text-white">{trf.quantity}</td>
                      <td className="py-3 px-3 text-neutral-400">{trf.fromLocationName}</td>
                      <td className="py-3 px-3 text-neutral-300 font-bold">{trf.toLocationName}</td>
                      <td className="py-3 px-3 font-sans text-neutral-400 text-[11px]">{trf.authorizedBy}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          trf.status === 'received' 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : trf.status === 'approved'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {trf.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {trf.status === 'approved' && (
                          <button
                            onClick={() => onUpdateTransferStatus(trf.id, 'received', currentUser.name)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] rounded-lg transition"
                          >
                            Mark Received
                          </button>
                        )}
                        {trf.status === 'received' && (
                          <span className="text-[10px] text-neutral-500">Delivered</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. WASTAGE & COMPLIMENTARY ITEMS */}
        {/* ========================================================================= */}
        {activeTab === 'WASTAGE_COMP' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-3">
              <div>
                <h3 className="text-xl font-bold text-white font-serif">Wastage & Complimentary Items Control</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Strict distinction: Transfers and Wastage are NOT sales. Every broken bottle requires manager sign-off.
                </p>
              </div>
            </div>

            {/* Wastage Approval Table */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xl">
              <h4 className="font-bold text-base text-neutral-100 mb-3 flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-red-400" />
                <span>Damage & Wastage Reports</span>
              </h4>

              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px] font-bold">
                    <th className="py-2.5 px-2">Ref</th>
                    <th className="py-2.5 px-2">Product</th>
                    <th className="py-2.5 px-2 text-right">Qty</th>
                    <th className="py-2.5 px-2">Reason</th>
                    <th className="py-2.5 px-2">Reported By</th>
                    <th className="py-2.5 px-2">Location</th>
                    <th className="py-2.5 px-2 text-right">Loss (₦)</th>
                    <th className="py-2.5 px-2 text-center">Status</th>
                    <th className="py-2.5 px-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 font-mono">
                  {wastageRecords.map(w => (
                    <tr key={w.id} className="hover:bg-neutral-850">
                      <td className="py-2.5 px-2 text-amber-400 font-bold">{w.reference}</td>
                      <td className="py-2.5 px-2 font-sans text-neutral-200">{w.productName}</td>
                      <td className="py-2.5 px-2 text-right font-black text-white">{w.quantity}</td>
                      <td className="py-2.5 px-2 text-red-400 font-medium">{w.reason}</td>
                      <td className="py-2.5 px-2 font-sans text-neutral-400">{w.staffName}</td>
                      <td className="py-2.5 px-2 text-neutral-400">{w.locationName}</td>
                      <td className="py-2.5 px-2 text-right text-red-400 font-bold">{formatNaira(w.totalLoss)}</td>
                      <td className="py-2.5 px-2 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          w.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {w.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        {w.status === 'pending' ? (
                          <button
                            onClick={() => onApproveWastage(w.id, true)}
                            className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-black font-bold text-[10px] rounded transition"
                          >
                            Approve
                          </button>
                        ) : (
                          <span className="text-[10px] text-neutral-500">Approved by {w.approvedBy}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Complimentary Drinks Log */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xl">
              <h4 className="font-bold text-base text-neutral-100 mb-3 flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Complimentary VIP & Artist Drinks</span>
              </h4>

              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px] font-bold">
                    <th className="py-2.5 px-2">Ref</th>
                    <th className="py-2.5 px-2">Product</th>
                    <th className="py-2.5 px-2 text-right">Qty</th>
                    <th className="py-2.5 px-2">Beneficiary / VIP</th>
                    <th className="py-2.5 px-2">Authorised By</th>
                    <th className="py-2.5 px-2 text-right">Value (₦)</th>
                    <th className="py-2.5 px-2">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 font-mono">
                  {complimentaryItems.map(c => (
                    <tr key={c.id}>
                      <td className="py-2.5 px-2 text-amber-400 font-bold">{c.reference}</td>
                      <td className="py-2.5 px-2 font-sans text-neutral-200">{c.productName}</td>
                      <td className="py-2.5 px-2 text-right font-black">{c.quantity}</td>
                      <td className="py-2.5 px-2 font-sans text-amber-300 font-semibold">{c.beneficiary}</td>
                      <td className="py-2.5 px-2 font-sans text-neutral-400">{c.approvedBy}</td>
                      <td className="py-2.5 px-2 text-right text-neutral-200">{formatNaira(c.totalValue)}</td>
                      <td className="py-2.5 px-2 text-neutral-400">{c.date} {c.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. END-OF-DAY CLOSING COUNTS APPROVAL */}
        {/* ========================================================================= */}
        {activeTab === 'CLOSING_AUDITS' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-3">
              <div>
                <h3 className="text-xl font-bold text-white font-serif">Daily Stock Reconciliation & Variance Approvals</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Once approved by General Manager/Owner, reports are permanently locked to preserve audit integrity.
                </p>
              </div>
            </div>

            {stockReports.length === 0 ? (
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center text-neutral-400">
                <PackageCheck className="w-12 h-12 mx-auto text-neutral-600 mb-2" />
                <h4 className="font-bold text-sm text-neutral-200">No Closing Counts Submitted Yet Today</h4>
                <p className="text-xs mt-1 max-w-md mx-auto">
                  Sales staff submit counts from the mobile portal (e.g. Sales Girl 07 on Refrigerator FR-007) at the end of their shift.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {stockReports.map(rep => (
                  <div key={rep.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-800 gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-amber-400 text-sm">{rep.reference}</span>
                          <span className="text-neutral-400">•</span>
                          <span className="font-bold text-neutral-200">{rep.refrigeratorName} ({rep.refrigeratorId})</span>
                          <span className="text-neutral-400">•</span>
                          <span className="text-xs text-neutral-400">{rep.staffName}</span>
                        </div>
                        <p className="text-[11px] text-neutral-500 font-mono mt-0.5">Submitted at {rep.submittedAt}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right text-xs font-mono">
                          <span className="text-neutral-400 block text-[10px] uppercase">Net Variance</span>
                          <span className={`font-black text-sm ${rep.totalVariance === 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {rep.totalVariance > 0 ? `+${rep.totalVariance}` : rep.totalVariance} bottles
                          </span>
                        </div>

                        {rep.status !== 'approved' ? (
                          <button
                            onClick={() => onApproveStockCount(rep.id)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition"
                          >
                            Approve & Lock Count
                          </button>
                        ) : (
                          <span className="px-3 py-1 bg-emerald-950 border border-emerald-500/50 text-emerald-400 font-bold text-xs rounded-xl flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" /> LOCKED BY MANAGEMENT
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Discrepancy details table */}
                    <div className="mt-3 overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-neutral-850 text-neutral-400 font-bold uppercase text-[10px]">
                            <th className="py-2 px-2">Product</th>
                            <th className="py-2 px-2 text-right">System Expected</th>
                            <th className="py-2 px-2 text-right">Physical Count</th>
                            <th className="py-2 px-2 text-right">Stock Variance</th>
                            <th className="py-2 px-2 text-right">Financial Impact</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-850 font-mono">
                          {rep.items.map(item => (
                            <tr key={item.productId}>
                              <td className="py-2 px-2 font-sans font-medium text-neutral-200">{item.productName}</td>
                              <td className="py-2 px-2 text-right text-neutral-300">{item.expectedClosingStock}</td>
                              <td className="py-2 px-2 text-right font-bold text-white">{item.physicalClosingStock}</td>
                              <td className="py-2 px-2 text-right">
                                <span className={`px-1.5 py-0.5 rounded font-black ${
                                  item.variance === 0 
                                    ? 'text-emerald-400 bg-emerald-500/10'
                                    : 'text-red-400 bg-red-500/20'
                                }`}>
                                  {item.variance > 0 ? `+${item.variance}` : item.variance}
                                </span>
                              </td>
                              <td className="py-2 px-2 text-right text-neutral-400 font-semibold">
                                {formatNaira(item.varianceValue)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 7. EXECUTIVE REPORT FOR DIRECTORS */}
        {/* ========================================================================= */}
        {activeTab === 'EXECUTIVE_REPORT' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-800 gap-4">
              <div>
                <span className="text-amber-400 font-mono text-xs font-bold uppercase tracking-widest">
                  CONFIDENTIAL • BOARD OF DIRECTORS & EXECUTIVE SUITE
                </span>
                <h3 className="text-2xl font-extrabold text-white font-serif mt-1">
                  Majestic Club Gombe Daily Operations Executive Brief
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Operating Date: {getCurrentDateStr()} • Currency: Nigerian Naira (₦)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-neutral-700"
                >
                  <Printer className="w-4 h-4" /> Print Report
                </button>
                <button
                  onClick={handleExportExecutiveCSV}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                >
                  <Download className="w-4 h-4" /> Export CSV
                </button>
              </div>
            </div>

            {/* Executive KPI Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Total Sales Value</span>
                <p className="text-2xl font-black text-amber-400 font-mono mt-1">{formatNaira(todaySalesTotal)}</p>
                <span className="text-xs text-neutral-500">{todayBottlesSold} items sold</span>
              </div>
              <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Total Stock Remaining</span>
                <p className="text-2xl font-black text-emerald-400 font-mono mt-1">{formatNumber(totalStockCount)}</p>
                <span className="text-xs text-neutral-500">Across 20 fridges & 4 bars</span>
              </div>
              <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Approved Wastage</span>
                <p className="text-2xl font-black text-red-400 font-mono mt-1">{formatNaira(totalWastageLoss)}</p>
                <span className="text-xs text-neutral-500">{totalWastageQuantity} bottles loss</span>
              </div>
              <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Hospitality Complimentary</span>
                <p className="text-2xl font-black text-blue-400 font-mono mt-1">{formatNaira(totalCompValue)}</p>
                <span className="text-xs text-neutral-500">{totalCompQty} VIP bottles</span>
              </div>
            </div>

            {/* Prompt's requested Product Summary */}
            <div className="pt-4 border-t border-neutral-800">
              <h4 className="font-bold text-base text-neutral-100 mb-3 uppercase tracking-wider font-mono text-xs text-amber-400">
                PRODUCT PERFORMANCE SUMMARY (SOLD / CLOSING / VARIANCE)
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px] font-bold">
                      <th className="py-2.5 px-3">Product Name</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3 text-right">Units Sold</th>
                      <th className="py-2.5 px-3 text-right">Revenue (₦)</th>
                      <th className="py-2.5 px-3 text-right">Closing Balance</th>
                      <th className="py-2.5 px-3 text-right">Variance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800 font-mono">
                    {products.map(prod => {
                      const unitsSold = sales
                        .flatMap(s => s.items)
                        .filter(i => i.productId === prod.id)
                        .reduce((sum, i) => sum + i.quantity, 0);
                      const currentBal = stockBalances
                        .filter(b => b.productId === prod.id)
                        .reduce((sum, b) => sum + b.quantity, 0);

                      return (
                        <tr key={prod.id} className="hover:bg-neutral-850">
                          <td className="py-2.5 px-3 font-sans font-bold text-neutral-200">{prod.name}</td>
                          <td className="py-2.5 px-3 text-neutral-400 text-[11px]">{prod.category}</td>
                          <td className="py-2.5 px-3 text-right font-black text-amber-400">{unitsSold}</td>
                          <td className="py-2.5 px-3 text-right text-neutral-200 font-bold">{formatNaira(unitsSold * prod.sellingPrice)}</td>
                          <td className="py-2.5 px-3 text-right font-black text-emerald-400">{formatNumber(currentBal)}</td>
                          <td className="py-2.5 px-3 text-right text-neutral-400">0</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Prompt's requested 20 Staff Summary */}
            <div className="pt-4 border-t border-neutral-800">
              <h4 className="font-bold text-base text-neutral-100 mb-3 uppercase tracking-wider font-mono text-xs text-amber-400">
                20 SALES STAFF SUMMARY (SALES QUANTITY / VALUE / EXPECTED / PHYSICAL / VARIANCE)
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px] font-bold">
                      <th className="py-2.5 px-3">Staff Code</th>
                      <th className="py-2.5 px-3">Staff Name</th>
                      <th className="py-2.5 px-3">Assigned Fridge</th>
                      <th className="py-2.5 px-3 text-right">Sales Qty</th>
                      <th className="py-2.5 px-3 text-right">Sales Value</th>
                      <th className="py-2.5 px-3 text-right">Expected Stock</th>
                      <th className="py-2.5 px-3 text-right">Physical Count</th>
                      <th className="py-2.5 px-3 text-right">Variance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800 font-mono">
                    {staffList.filter(s => s.role === 'sales_staff').map(staff => {
                      const staffSales = sales.filter(s => s.staffId === staff.id);
                      const qty = staffSales.reduce((sum, s) => sum + s.totalQuantity, 0);
                      const val = staffSales.reduce((sum, s) => sum + s.totalAmount, 0);
                      const exp = staff.assignedRefrigeratorId ? getRefrigeratorStock(staff.assignedRefrigeratorId) : 0;

                      return (
                        <tr key={staff.id} className="hover:bg-neutral-850">
                          <td className="py-2.5 px-3 font-bold text-amber-400">{staff.staffCode}</td>
                          <td className="py-2.5 px-3 font-sans font-medium text-neutral-200">{staff.name}</td>
                          <td className="py-2.5 px-3 text-neutral-300 font-bold">{staff.assignedRefrigeratorId}</td>
                          <td className="py-2.5 px-3 text-right font-black text-amber-300">{qty}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-white">{formatNaira(val)}</td>
                          <td className="py-2.5 px-3 text-right text-neutral-300">{exp}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-emerald-400">{exp}</td>
                          <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">0</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 8. SNOOKER & VIP EVENT BOOKINGS */}
        {/* ========================================================================= */}
        {activeTab === 'SNOOKER_VIP' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-3">
              <div>
                <h3 className="text-xl font-bold text-white font-serif">Snooker & VIP Hospitality Management</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Real-time table allocation, tournament schedules, and private VIP reservations.
                </p>
              </div>
            </div>

            {/* Snooker Tables status */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {snookerTables.map(t => (
                <div key={t.id} className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono text-xs text-amber-400 font-bold uppercase">{t.type}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      t.status === 'available' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {t.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-neutral-100">{t.name}</h4>
                  <p className="font-mono text-xs text-neutral-400 mt-1">{formatNaira(t.hourlyPrice)} / hr</p>
                </div>
              ))}
            </div>

            {/* Snooker Bookings */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xl">
              <h4 className="font-bold text-base text-neutral-100 mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Active & Upcoming Snooker Reservations</span>
              </h4>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px] font-bold">
                    <th className="py-2.5 px-2">Ref</th>
                    <th className="py-2.5 px-2">Customer</th>
                    <th className="py-2.5 px-2">Phone</th>
                    <th className="py-2.5 px-2">Table</th>
                    <th className="py-2.5 px-2">Date & Slot</th>
                    <th className="py-2.5 px-2 text-right">Amount</th>
                    <th className="py-2.5 px-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 font-mono">
                  {snookerBookings.map(b => (
                    <tr key={b.id} className="hover:bg-neutral-850">
                      <td className="py-2.5 px-2 text-amber-400 font-bold">{b.reference}</td>
                      <td className="py-2.5 px-2 font-sans font-semibold text-neutral-200">{b.customerName}</td>
                      <td className="py-2.5 px-2 text-neutral-400">{b.phone}</td>
                      <td className="py-2.5 px-2 font-sans text-neutral-300">{b.tableName}</td>
                      <td className="py-2.5 px-2 text-neutral-300">{b.date} ({b.timeSlot})</td>
                      <td className="py-2.5 px-2 text-right font-bold text-white">{formatNaira(b.totalAmount)}</td>
                      <td className="py-2.5 px-2 text-center">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* VIP & Event Bookings */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xl">
              <h4 className="font-bold text-base text-neutral-100 mb-3 flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>VIP Cabanas & Private Event Bookings</span>
              </h4>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px] font-bold">
                    <th className="py-2.5 px-2">Ref</th>
                    <th className="py-2.5 px-2">Customer</th>
                    <th className="py-2.5 px-2">Event Type</th>
                    <th className="py-2.5 px-2">Package</th>
                    <th className="py-2.5 px-2">Date & Time</th>
                    <th className="py-2.5 px-2 text-right">Commitment (₦)</th>
                    <th className="py-2.5 px-2 text-right">Deposit</th>
                    <th className="py-2.5 px-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 font-mono">
                  {eventBookings.map(ev => (
                    <tr key={ev.id} className="hover:bg-neutral-850">
                      <td className="py-2.5 px-2 text-amber-400 font-bold">{ev.reference}</td>
                      <td className="py-2.5 px-2 font-sans font-semibold text-neutral-200">{ev.customerName}</td>
                      <td className="py-2.5 px-2 text-neutral-400">{ev.type.replace('_', ' ')}</td>
                      <td className="py-2.5 px-2 font-sans text-neutral-300">{ev.package}</td>
                      <td className="py-2.5 px-2 text-neutral-300">{ev.date} {ev.time}</td>
                      <td className="py-2.5 px-2 text-right font-black text-amber-400">{formatNaira(ev.amount)}</td>
                      <td className="py-2.5 px-2 text-right text-emerald-400">{formatNaira(ev.depositAmount)}</td>
                      <td className="py-2.5 px-2 text-center">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">
                          {ev.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 9. PRODUCT CATALOG & PRICING */}
        {/* ========================================================================= */}
        {activeTab === 'PRODUCT_CATALOG' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-3">
              <div>
                <h3 className="text-xl font-bold text-white font-serif">Product Master & Pricing Management</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Adjust selling prices, minimum stock thresholds, and view QR codes. Updates reflect instantly across POS and website.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px] font-bold">
                    <th className="py-2.5 px-3">QR / Code</th>
                    <th className="py-2.5 px-3">Product Name</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Brand</th>
                    <th className="py-2.5 px-3 text-right">Purchase Price</th>
                    <th className="py-2.5 px-3 text-right">Selling Price</th>
                    <th className="py-2.5 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 font-mono">
                  {products.map(prod => (
                    <tr key={prod.id} className="hover:bg-neutral-850">
                      <td className="py-2.5 px-3 text-amber-400 font-bold">{prod.code}</td>
                      <td className="py-2.5 px-3 font-sans font-bold text-neutral-200">{prod.name}</td>
                      <td className="py-2.5 px-3 text-neutral-400 text-[11px]">{prod.category}</td>
                      <td className="py-2.5 px-3 text-neutral-400">{prod.brand}</td>
                      <td className="py-2.5 px-3 text-right text-neutral-400">{formatNaira(prod.purchasePrice)}</td>
                      <td className="py-2.5 px-3 text-right font-black text-amber-400">
                        {editingPriceProdId === prod.id ? (
                          <div className="flex items-center justify-end gap-1">
                            <input
                              type="number"
                              value={newPriceValue}
                              onChange={e => setNewPriceValue(Number(e.target.value))}
                              className="w-24 bg-neutral-950 border border-amber-500 rounded px-2 py-0.5 text-xs text-white"
                            />
                            <button
                              onClick={() => {
                                onUpdateProductPrice(prod.id, newPriceValue);
                                setEditingPriceProdId(null);
                              }}
                              className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px]"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          formatNaira(prod.sellingPrice)
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center font-sans">
                        {editingPriceProdId !== prod.id && (
                          <button
                            onClick={() => {
                              setEditingPriceProdId(prod.id);
                              setNewPriceValue(prod.sellingPrice);
                            }}
                            className="text-xs text-amber-400 hover:underline font-semibold"
                          >
                            Edit Price
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 10. IMMUTABLE AUDIT TRAIL */}
        {/* ========================================================================= */}
        {activeTab === 'AUDIT_LOG' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-3">
              <div>
                <h3 className="text-xl font-bold text-white font-serif">Immutable Enterprise Audit Trail</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Permanent accountability: User, Date, Time, Action, Product, Quantity, Location, Reference, and Device IP.
                </p>
              </div>
              <button
                onClick={() => {
                  const rows = auditLogs.map(l => ({
                    ID: l.id,
                    Timestamp: l.timestamp,
                    User: l.userName,
                    Role: l.userRole,
                    Action: l.action,
                    Product: l.product || '',
                    Quantity: l.quantity || '',
                    Location: l.location || '',
                    Reference: l.transactionReference || '',
                    Device: l.ipDevice
                  }));
                  exportToCSV(`Majestic_Club_Audit_Log_${getCurrentDateStr()}`, rows);
                }}
                className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-amber-400 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-neutral-700"
              >
                <Download className="w-4 h-4" /> Export Complete Audit Trail
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px] font-bold">
                    <th className="py-2.5 px-3">Date / Time</th>
                    <th className="py-2.5 px-3">User & Role</th>
                    <th className="py-2.5 px-3">Action Details</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3">Tx Ref</th>
                    <th className="py-2.5 px-3">Device / IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 font-mono">
                  {auditLogs.slice().reverse().map(log => (
                    <tr key={log.id} className="hover:bg-neutral-850">
                      <td className="py-2.5 px-3 text-neutral-400">{log.date} {log.time}</td>
                      <td className="py-2.5 px-3 font-sans">
                        <span className="font-bold text-neutral-200 block">{log.userName}</span>
                        <span className="text-[10px] text-amber-400 uppercase font-mono">{log.userRole.replace('_', ' ')}</span>
                      </td>
                      <td className="py-2.5 px-3 font-sans text-neutral-200">
                        {log.action}
                        {log.product && <span className="block text-[11px] text-neutral-400 font-mono">{log.quantity}x {log.product}</span>}
                      </td>
                      <td className="py-2.5 px-3 text-neutral-400">{log.location || '—'}</td>
                      <td className="py-2.5 px-3 text-amber-400 font-bold">{log.transactionReference || '—'}</td>
                      <td className="py-2.5 px-3 text-neutral-500 text-[11px]">{log.ipDevice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 11. DATABASE SCHEMA TAB */}
        {/* ========================================================================= */}
        {activeTab === 'DATABASE_SCHEMA' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-3">
              <div>
                <h3 className="text-xl font-bold text-white font-serif">PostgreSQL / Supabase Relational Database Architecture</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Complete DDL schema with 23 tables, foreign keys, triggers, audit logging, and check constraints.
                </p>
              </div>
              <a
                href="/src/db/schema.sql"
                download="majestic_club_gombe_schema.sql"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20"
              >
                <Download className="w-4 h-4" /> Download schema.sql
              </a>
            </div>

            <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 font-mono text-xs text-amber-200 max-h-[550px] overflow-y-auto leading-relaxed">
              <pre className="text-[11px]">
{`-- MAJESTIC CLUB GOMBE RELATIONAL POSTGRESQL ARCHITECTURE
-- Tables implemented:
-- 1. roles, 2. users, 3. locations, 4. refrigerators (FR-001..FR-020), 5. staff
-- 6. product_categories, 7. products, 8. stock_balances, 9. stock_transactions
-- 10. stock_transfers, 11. stock_transfer_items, 12. sales, 13. sale_items
-- 14. stock_counts, 15. stock_count_items, 16. wastage, 17. wastage_items
-- 18. customers, 19. payments, 20. snooker_tables, 21. snooker_bookings
-- 22. event_bookings, 23. audit_logs

-- Example Table Definition:
CREATE TABLE IF NOT EXISTS stock_balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id VARCHAR(50) NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
    quantity INT NOT NULL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_non_negative_stock CHECK (quantity >= 0),
    UNIQUE(location_id, product_id)
);

CREATE TABLE IF NOT EXISTS stock_counts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference VARCHAR(100) UNIQUE NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    refrigerator_id VARCHAR(20) REFERENCES refrigerators(id),
    staff_id UUID REFERENCES staff(id),
    total_expected INT NOT NULL,
    total_physical INT NOT NULL,
    total_variance INT NOT NULL,
    status VARCHAR(30) DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE
);`}
              </pre>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 12. REPORTS & EXPORTS CENTER */}
        {/* ========================================================================= */}
        {activeTab === 'REPORTS_CENTER' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-3">
              <div>
                <h3 className="text-xl font-bold text-white font-serif">Enterprise Reports & Export Hub</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Generate Daily, Weekly, Monthly, Refrigerator, Staff, Category, and Wastage Reports.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-neutral-100">Daily Sales Register Report</h4>
                  <p className="text-xs text-neutral-400 mt-1">Detailed breakdown of all table and bar sales by payment method.</p>
                </div>
                <button
                  onClick={handleExportSalesCSV}
                  className="mt-4 w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-amber-400 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Download Daily Sales (CSV)
                </button>
              </div>

              <div className="p-5 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-neutral-100">20 Refrigerators Fleet Report</h4>
                  <p className="text-xs text-neutral-400 mt-1">Current balances, temperatures, staff assignments and stock health.</p>
                </div>
                <button
                  onClick={handleExportStockCSV}
                  className="mt-4 w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-amber-400 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Download Fridges Report (CSV)
                </button>
              </div>

              <div className="p-5 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-neutral-100">Board Executive Summary</h4>
                  <p className="text-xs text-neutral-400 mt-1">Aggregated director report with product and staff variance figures.</p>
                </div>
                <button
                  onClick={handleExportExecutiveCSV}
                  className="mt-4 w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Download Executive Board Brief
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* BRAND & VISUAL ASSETS TAB */}
        {/* ========================================================================= */}
        {activeTab === 'BRAND_ASSETS' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-amber-400 text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-amber-400" />
                  AUTHENTIC CLUB MEDIA ASSETS
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1 font-serif">
                  Majestic Club Gombe Media Library
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  High-definition photography and system mockups used across the public website and management portal.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 font-mono">
                  {GALLERY_ITEMS.length} Certified Brand Assets
                </span>
              </div>
            </div>

            {/* Asset Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {GALLERY_ITEMS.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => setSelectedAssetPreview({
                    src: asset.src,
                    title: asset.title,
                    subtitle: asset.subtitle,
                    tag: asset.tag
                  })}
                  className="group bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-xl cursor-pointer transition flex flex-col justify-between"
                >
                  <div className="relative aspect-16/10 overflow-hidden bg-neutral-950">
                    <img
                      src={asset.src}
                      alt={asset.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/85 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider border border-neutral-700">
                      {asset.tag}
                    </span>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <div className="w-10 h-10 rounded-xl bg-amber-500 text-black flex items-center justify-center font-bold shadow-lg">
                        <Eye className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-bold text-white text-sm group-hover:text-amber-400 transition">
                        {asset.title}
                      </h4>
                      <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                        {asset.subtitle}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs text-amber-400 font-semibold">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> Inspect Full Size
                      </span>
                      <a
                        href={asset.src}
                        target="_blank"
                        rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="text-neutral-400 hover:text-white p-1 rounded hover:bg-neutral-800 transition"
                        title="Open Raw Image"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* NEW TRANSFER MODAL */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl relative">
            <button
              onClick={() => setIsTransferModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                <ArrowRightLeft className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Authorise Stock Transfer</h3>
                <p className="text-xs text-neutral-400">e.g. Main Store → Club Bar → FR-007</p>
              </div>
            </div>

            <form onSubmit={handleCreateTransferSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">From Location</label>
                <select
                  value={newTransferForm.fromLocationId}
                  onChange={e => setNewTransferForm({ ...newTransferForm, fromLocationId: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {locations.map(l => (
                    <option key={l.id} value={l.id}>{l.name} ({l.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">To Destination</label>
                <select
                  value={newTransferForm.toLocationId}
                  onChange={e => setNewTransferForm({ ...newTransferForm, toLocationId: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                >
                  <optgroup label="20 Dedicated Refrigerators">
                    {refrigerators.map(r => (
                      <option key={r.id} value={r.id}>{r.id} — {r.assignedStaffName} ({r.location})</option>
                    ))}
                  </optgroup>
                  <optgroup label="Primary Bar Stations">
                    {locations.filter(l => l.type !== 'main_store').map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">Product</label>
                  <select
                    value={newTransferForm.productId}
                    onChange={e => setNewTransferForm({ ...newTransferForm, productId: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">Quantity (Bottles)</label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={newTransferForm.quantity}
                    onChange={e => setNewTransferForm({ ...newTransferForm, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">Authorisation Notes</label>
                <input
                  type="text"
                  value={newTransferForm.notes}
                  onChange={e => setNewTransferForm({ ...newTransferForm, notes: e.target.value })}
                  placeholder="e.g. Weekend restock batch"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm rounded-xl transition uppercase tracking-wider"
              >
                Approve & Execute Stock Transfer
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FULLSCREEN ASSET INSPECTOR MODAL */}
      {selectedAssetPreview && (
        <div 
          onClick={() => setSelectedAssetPreview(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in"
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="bg-neutral-900 border border-neutral-700 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-800 bg-neutral-950">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold uppercase border border-amber-500/30">
                  {selectedAssetPreview.tag}
                </span>
                <span className="text-xs text-neutral-300 font-semibold">{selectedAssetPreview.title}</span>
              </div>
              <button
                onClick={() => setSelectedAssetPreview(null)}
                className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="relative flex-1 bg-black flex items-center justify-center p-2 min-h-[300px] max-h-[65vh]">
              <img
                src={selectedAssetPreview.src}
                alt={selectedAssetPreview.title}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="px-5 py-3.5 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between">
              <p className="text-xs text-neutral-400">{selectedAssetPreview.subtitle}</p>
              <button
                onClick={() => setSelectedAssetPreview(null)}
                className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
