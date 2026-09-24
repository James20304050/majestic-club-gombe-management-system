import React, { useState } from 'react';
import { 
  StaffMember, 
  Refrigerator, 
  Product, 
  StockBalance, 
  Sale, 
  SaleItem, 
  PaymentMethod,
  DailyStockCountReport,
  StockCountItem
} from '../../types';
import { formatNaira, generateRef, getCurrentDateStr, getCurrentTimeStr } from '../../utils/helpers';
import { 
  ShoppingCart, 
  Package, 
  Receipt, 
  ClipboardCheck, 
  Plus, 
  Minus, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  QrCode, 
  RotateCcw,
  Sparkles,
  Search,
  Check,
  Wine,
  User,
  LogOut
} from 'lucide-react';
import { QRScannerModal } from '../common/QRScannerModal';
import { CLUB_IMAGES } from '../../assets/clubImages';

interface SalesStaffPortalProps {
  currentUser: StaffMember;
  refrigerator: Refrigerator;
  products: Product[];
  stockBalances: StockBalance[];
  sales: Sale[];
  dailyStockReports: DailyStockCountReport[];
  onRecordSale: (sale: Sale) => void;
  onSubmitClosingCount: (report: DailyStockCountReport) => void;
  onLogout: () => void;
}

export const SalesStaffPortal: React.FC<SalesStaffPortalProps> = ({
  currentUser,
  refrigerator,
  products,
  stockBalances,
  sales,
  dailyStockReports,
  onRecordSale,
  onSubmitClosingCount,
  onLogout
}) => {
  // Mobile navigation tabs: NEW_SALE | MY_STOCK | MY_SALES | CLOSING_COUNT
  const [activeTab, setActiveTab] = useState<'NEW_SALE' | 'MY_STOCK' | 'MY_SALES' | 'CLOSING_COUNT'>('NEW_SALE');

  // Scanner modal
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // New Sale POS State
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [tableNumber, setTableNumber] = useState('TABLE-001');
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('POS_TRANSFER');
  const [saleSearch, setSaleSearch] = useState('');
  const [saleSuccessMessage, setSaleSuccessMessage] = useState<string | null>(null);

  // Closing Count state (Physical Count map: productId -> count)
  const [physicalCounts, setPhysicalCounts] = useState<{ [productId: string]: number }>({});
  const [countSubmittedSuccess, setCountSubmittedSuccess] = useState<string | null>(null);

  // Get current stock in this assigned refrigerator
  const fridgeStockMap = React.useMemo(() => {
    const map = new Map<string, number>();
    stockBalances
      .filter(b => b.locationId === refrigerator.id)
      .forEach(b => map.set(b.productId, b.quantity));
    return map;
  }, [stockBalances, refrigerator.id]);

  // Today's sales by this staff member
  const myTodaySales = React.useMemo(() => {
    const today = getCurrentDateStr();
    return sales.filter(s => s.staffId === currentUser.id && s.date === today);
  }, [sales, currentUser.id]);

  const myTodaySalesTotal = myTodaySales.reduce((sum, s) => sum + s.totalAmount, 0);
  const myTodayItemsSold = myTodaySales.reduce((sum, s) => sum + s.totalQuantity, 0);

  // Check if today's count already submitted or approved
  const existingTodayReport = React.useMemo(() => {
    const today = getCurrentDateStr();
    return dailyStockReports.find(r => r.refrigeratorId === refrigerator.id && r.date === today);
  }, [dailyStockReports, refrigerator.id]);

  // Handle adding product to cart
  const handleAddToCart = (product: Product) => {
    const currentStock = fridgeStockMap.get(product.id) || 0;
    const existing = cart.find(i => i.productId === product.id);
    const existingQty = existing ? existing.quantity : 0;

    if (existingQty + 1 > currentStock) {
      alert(`Warning: Insufficient stock in ${refrigerator.id}. Current balance: ${currentStock} bottles.`);
      return;
    }

    if (existing) {
      setCart(cart.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1, totalPrice: (i.quantity + 1) * i.unitPrice } : i));
    } else {
      setCart([...cart, {
        productId: product.id,
        productCode: product.code,
        productName: product.name,
        category: product.category,
        quantity: 1,
        unitPrice: product.sellingPrice,
        totalPrice: product.sellingPrice
      }]);
    }
  };

  const handleUpdateCartQty = (productId: string, delta: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const currentStock = fridgeStockMap.get(productId) || 0;

    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQty = item.quantity + delta;
        if (newQty > currentStock) {
          alert(`Cannot exceed refrigerator stock (${currentStock} bottles).`);
          return item;
        }
        return newQty > 0 ? { ...item, quantity: newQty, totalPrice: newQty * item.unitPrice } : null;
      }
      return item;
    }).filter(Boolean) as SaleItem[]);
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter(i => i.productId !== productId));
  };

  const cartTotalAmount = cart.reduce((sum, i) => sum + i.totalPrice, 0);
  const cartTotalQuantity = cart.reduce((sum, i) => sum + i.quantity, 0);

  // Complete Sale
  const handleCompleteSale = () => {
    if (cart.length === 0) {
      alert('Please add at least one drink to the order.');
      return;
    }

    const saleRef = generateRef('SAL');
    const newSale: Sale = {
      id: `sale_${Date.now()}`,
      reference: saleRef,
      timestamp: new Date().toISOString(),
      date: getCurrentDateStr(),
      time: getCurrentTimeStr(),
      staffId: currentUser.id,
      staffName: currentUser.name,
      refrigeratorId: refrigerator.id,
      refrigeratorName: refrigerator.name,
      items: [...cart],
      totalQuantity: cartTotalQuantity,
      totalAmount: cartTotalAmount,
      tableNumber: tableNumber || 'BAR-COUNTER',
      customerName: customerName || undefined,
      paymentMethod,
      paymentReference: `PAY-${Date.now().toString().slice(-6)}`,
      paymentStatus: 'PAID',
      notes: `Sold from ${refrigerator.id} at ${tableNumber}`
    };

    onRecordSale(newSale);
    setSaleSuccessMessage(`Sale ${saleRef} of ${formatNaira(cartTotalAmount)} completed!`);
    setCart([]);
    setCustomerName('');

    setTimeout(() => {
      setSaleSuccessMessage(null);
    }, 4000);
  };

  // QR Scan Callback
  const handleQRResult = (scannedCode: string, type: string, meta: any) => {
    if (type === 'product' && meta) {
      handleAddToCart(meta as Product);
    } else if (type === 'table' && meta?.tableNumber) {
      setTableNumber(meta.tableNumber);
    } else {
      alert(`Scanned: ${scannedCode} (${type})`);
    }
  };

  // Submit physical closing count
  const handleSubmitClosingCount = () => {
    if (existingTodayReport && existingTodayReport.status === 'approved') {
      alert('This daily closing count has already been approved by management and is locked.');
      return;
    }

    const countItems: StockCountItem[] = products
      .filter(p => p.isActive)
      .map(prod => {
        const expectedStock = fridgeStockMap.get(prod.id) || 0;
        const physical = physicalCounts[prod.id] !== undefined ? physicalCounts[prod.id] : expectedStock;
        const variance = physical - expectedStock;

        return {
          productId: prod.id,
          productCode: prod.code,
          productName: prod.name,
          category: prod.category,
          openingStock: 50,
          stockReceived: 0,
          stockTransferred: 0,
          sales: 0,
          wastage: 0,
          complimentary: 0,
          expectedClosingStock: expectedStock,
          physicalClosingStock: physical,
          variance,
          unitPrice: prod.sellingPrice,
          varianceValue: variance * prod.sellingPrice
        };
      });

    const totalExpected = countItems.reduce((s, i) => s + i.expectedClosingStock, 0);
    const totalPhysical = countItems.reduce((s, i) => s + i.physicalClosingStock, 0);
    const totalVariance = totalPhysical - totalExpected;

    const report: DailyStockCountReport = {
      id: existingTodayReport ? existingTodayReport.id : `cnt_${Date.now()}`,
      reference: generateRef('CNT'),
      date: getCurrentDateStr(),
      refrigeratorId: refrigerator.id,
      refrigeratorName: refrigerator.name,
      staffId: currentUser.id,
      staffName: currentUser.name,
      submittedAt: `${getCurrentDateStr()} ${getCurrentTimeStr()}`,
      items: countItems,
      totalExpected,
      totalPhysical,
      totalVariance,
      status: 'submitted'
    };

    onSubmitClosingCount(report);
    setCountSubmittedSuccess('Closing count submitted to Manager for review & lock.');
    setTimeout(() => setCountSubmittedSuccess(null), 5000);
  };

  // Filter products for quick sale selection
  const filteredProducts = products.filter(p => 
    p.isActive && (p.name.toLowerCase().includes(saleSearch.toLowerCase()) || p.code.toLowerCase().includes(saleSearch.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans pb-16">
      {/* Sales Staff Top App Bar */}
      <header className="sticky top-0 z-30 bg-neutral-900 border-b border-neutral-800 px-4 py-3 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              {/* Requested exact welcome line */}
              <div className="text-sm font-black text-amber-400 tracking-wide uppercase font-mono">
                WELCOME, {currentUser.name.toUpperCase()}
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-300 font-semibold">
                <span>Refrigerator: <strong className="text-white bg-neutral-800 px-1.5 py-0.5 rounded font-mono">{refrigerator.id}</strong></span>
                <span className="text-neutral-500">•</span>
                <span className="text-emerald-400 font-mono text-[11px]">{refrigerator.temperature || '3.2°C'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsScannerOpen(true)}
              className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-neutral-700 transition"
              title="Scan QR Code"
            >
              <QrCode className="w-5 h-5" />
            </button>
            <button
              onClick={onLogout}
              className="p-2.5 rounded-xl bg-neutral-800 hover:bg-red-950 text-neutral-400 hover:text-red-400 border border-neutral-700 transition"
              title="Exit Portal"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Atmospheric Station Banner with Background Image */}
      <div className="relative overflow-hidden bg-neutral-900 border-b border-neutral-800/80 px-4 py-3">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={CLUB_IMAGES.drinksVip}
            alt="Majestic Bar Drinks"
            className="w-full h-full object-cover opacity-15 filter blur-[1px]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/90 to-neutral-950/70" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-neutral-300 font-medium">Terminal Station Active: <strong className="text-amber-400">{refrigerator.name}</strong></span>
          </div>
          <div className="text-neutral-400 text-[11px] font-mono">
            {refrigerator.location} • Majestic Club Gombe
          </div>
        </div>
      </div>

      {/* Main 4 Touch Buttons (Mobile First Navigation) */}
      <div className="bg-neutral-900/80 border-b border-neutral-800 px-4 py-2 sticky top-[61px] z-20 backdrop-blur-md">
        <div className="max-w-4xl mx-auto grid grid-cols-4 gap-2">
          <button
            onClick={() => setActiveTab('NEW_SALE')}
            className={`py-3 px-2 rounded-xl text-xs font-black tracking-wider uppercase transition flex flex-col items-center justify-center gap-1 ${
              activeTab === 'NEW_SALE'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>NEW SALE</span>
          </button>

          <button
            onClick={() => setActiveTab('MY_STOCK')}
            className={`py-3 px-2 rounded-xl text-xs font-black tracking-wider uppercase transition flex flex-col items-center justify-center gap-1 ${
              activeTab === 'MY_STOCK'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>MY STOCK</span>
          </button>

          <button
            onClick={() => setActiveTab('MY_SALES')}
            className={`py-3 px-2 rounded-xl text-xs font-black tracking-wider uppercase transition flex flex-col items-center justify-center gap-1 ${
              activeTab === 'MY_SALES'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>MY SALES</span>
          </button>

          <button
            onClick={() => setActiveTab('CLOSING_COUNT')}
            className={`py-3 px-2 rounded-xl text-xs font-black tracking-wider uppercase transition flex flex-col items-center justify-center gap-1 ${
              activeTab === 'CLOSING_COUNT'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>CLOSING COUNT</span>
          </button>
        </div>
      </div>

      {/* SUCCESS ALERTS */}
      {saleSuccessMessage && (
        <div className="max-w-4xl mx-auto w-full px-4 mt-3">
          <div className="p-3 bg-emerald-950 border border-emerald-500/60 rounded-xl text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>{saleSuccessMessage}</span>
          </div>
        </div>
      )}

      {countSubmittedSuccess && (
        <div className="max-w-4xl mx-auto w-full px-4 mt-3">
          <div className="p-3 bg-amber-950 border border-amber-500/60 rounded-xl text-amber-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <span>{countSubmittedSuccess}</span>
          </div>
        </div>
      )}

      {/* TAB CONTENT CONTAINER */}
      <main className="max-w-4xl mx-auto w-full p-4 flex-1">
        {/* 1. NEW SALE TAB */}
        {activeTab === 'NEW_SALE' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: Product Picker (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={saleSearch}
                    onChange={e => setSaleSearch(e.target.value)}
                    placeholder="Search drink (Life, Legend, Heineken...)"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  onClick={() => setIsScannerOpen(true)}
                  className="px-3.5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-amber-400 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-neutral-700"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Scan</span>
                </button>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[520px] overflow-y-auto pr-1">
                {filteredProducts.map(prod => {
                  const stock = fridgeStockMap.get(prod.id) || 0;
                  const isOutOfStock = stock <= 0;

                  return (
                    <button
                      key={prod.id}
                      onClick={() => !isOutOfStock && handleAddToCart(prod)}
                      disabled={isOutOfStock}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition group relative ${
                        isOutOfStock 
                          ? 'bg-neutral-900/40 border-neutral-900 opacity-50 cursor-not-allowed'
                          : 'bg-neutral-900 border-neutral-800 hover:border-amber-500/60 active:scale-95'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono text-amber-400 font-bold">{prod.code}</span>
                          <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                            stock > 10 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {stock} left
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-neutral-100 line-clamp-2 leading-tight group-hover:text-amber-300">
                          {prod.name}
                        </h4>
                      </div>

                      <div className="mt-3 pt-2 border-t border-neutral-800/80 flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-amber-400">
                          {formatNaira(prod.sellingPrice)}
                        </span>
                        <div className="w-6 h-6 rounded-lg bg-neutral-800 group-hover:bg-amber-500 group-hover:text-black flex items-center justify-center text-neutral-300 text-xs">
                          <Plus className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Active Order Cart & Fast Checkout (5 cols) */}
            <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-amber-400" />
                    <h3 className="font-bold text-sm text-neutral-100">Order Summary</h3>
                  </div>
                  <span className="text-xs text-neutral-400 font-mono">
                    {cartTotalQuantity} bottles
                  </span>
                </div>

                {/* Table & Customer Inputs */}
                <div className="grid grid-cols-2 gap-2 my-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Table / Order #</label>
                    <input
                      type="text"
                      value={tableNumber}
                      onChange={e => setTableNumber(e.target.value.toUpperCase())}
                      placeholder="e.g. TABLE-025"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono uppercase focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Customer (Opt)</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder="e.g. Chief Buba"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="mb-3">
                  <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Payment Method</label>
                  <div className="grid grid-cols-4 gap-1.5 text-[11px] font-bold">
                    {(['POS_TRANSFER', 'CASH', 'CARD', 'VIP_TAB'] as PaymentMethod[]).map(method => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`py-1.5 rounded-lg border text-center transition ${
                          paymentMethod === method
                            ? 'bg-amber-500 text-black border-amber-400 font-extrabold'
                            : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                        }`}
                      >
                        {method.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cart Items List */}
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1 my-2">
                  {cart.length === 0 ? (
                    <div className="text-center py-8 text-neutral-500 text-xs">
                      No drinks added yet. Tap a product from your refrigerator stock.
                    </div>
                  ) : (
                    cart.map(item => (
                      <div key={item.productId} className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between text-xs">
                        <div className="flex-1 pr-2">
                          <p className="font-bold text-neutral-200 line-clamp-1">{item.productName}</p>
                          <p className="font-mono text-amber-400 text-[11px]">{formatNaira(item.unitPrice)} ea</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleUpdateCartQty(item.productId, -1)}
                            className="w-6 h-6 rounded bg-neutral-800 flex items-center justify-center text-neutral-300"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono font-bold w-4 text-center text-neutral-100">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateCartQty(item.productId, 1)}
                            className="w-6 h-6 rounded bg-neutral-800 flex items-center justify-center text-neutral-300"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleRemoveFromCart(item.productId)}
                            className="w-6 h-6 rounded bg-neutral-900 text-red-400 hover:bg-red-950 flex items-center justify-center ml-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Total & Checkout Button */}
              <div className="pt-3 border-t border-neutral-800 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-400 font-semibold">Total Amount</span>
                  <span className="font-mono font-extrabold text-xl text-amber-400">
                    {formatNaira(cartTotalAmount)}
                  </span>
                </div>

                <button
                  onClick={handleCompleteSale}
                  disabled={cart.length === 0}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-extrabold text-sm rounded-xl transition uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-98"
                >
                  COMPLETE SALE ({formatNaira(cartTotalAmount)})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. MY STOCK TAB */}
        {activeTab === 'MY_STOCK' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-2 mb-4">
              <div>
                <h3 className="font-bold text-base text-neutral-100">
                  Refrigerator {refrigerator.id} Inventory
                </h3>
                <p className="text-xs text-neutral-400">
                  Location: {refrigerator.location} • Capacity: ~{refrigerator.capacity} bottles
                </p>
              </div>
              <div className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs flex items-center gap-3">
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold">Total Bottles</span>
                  <span className="text-base font-extrabold text-amber-400 font-mono">
                    {Array.from(fridgeStockMap.values()).reduce((a, b) => a + b, 0)}
                  </span>
                </div>
                <div className="border-l border-neutral-800 pl-3">
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold">Temperature</span>
                  <span className="text-base font-extrabold text-emerald-400 font-mono">
                    {refrigerator.temperature}
                  </span>
                </div>
              </div>
            </div>

            {/* Stock Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px] font-bold">
                    <th className="py-2.5 px-3">Code</th>
                    <th className="py-2.5 px-3">Product Name</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-right">Selling Price</th>
                    <th className="py-2.5 px-3 text-right">Current Bottles</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 font-mono">
                  {products.map(prod => {
                    const qty = fridgeStockMap.get(prod.id) || 0;
                    return (
                      <tr key={prod.id} className="hover:bg-neutral-850/50">
                        <td className="py-2.5 px-3 text-amber-400 font-bold">{prod.code}</td>
                        <td className="py-2.5 px-3 text-neutral-200 font-sans font-medium">{prod.name}</td>
                        <td className="py-2.5 px-3 text-neutral-400 text-[11px]">{prod.category}</td>
                        <td className="py-2.5 px-3 text-right text-neutral-300">{formatNaira(prod.sellingPrice)}</td>
                        <td className="py-2.5 px-3 text-right font-black text-sm text-neutral-100">{qty}</td>
                        <td className="py-2.5 px-3 text-center">
                          {qty > 10 ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">READY</span>
                          ) : qty > 0 ? (
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold">LOW</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-bold">EMPTY</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. MY SALES TAB */}
        {activeTab === 'MY_SALES' && (
          <div className="space-y-4">
            {/* KPI Cards for Today */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Today's Sales Value</span>
                <p className="text-2xl font-black text-amber-400 font-mono mt-1">
                  {formatNaira(myTodaySalesTotal)}
                </p>
                <p className="text-[10px] text-neutral-500 mt-1 font-mono">{currentUser.name}</p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Bottles Sold Today</span>
                <p className="text-2xl font-black text-neutral-100 font-mono mt-1">
                  {myTodayItemsSold}
                </p>
                <p className="text-[10px] text-neutral-500 mt-1 font-mono">From {refrigerator.id}</p>
              </div>
            </div>

            {/* Sales Transaction List */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xl">
              <h3 className="font-bold text-sm text-neutral-100 mb-3">Today's Sales Receipts</h3>
              {myTodaySales.length === 0 ? (
                <div className="text-center py-8 text-neutral-500 text-xs">
                  No sales recorded today yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {myTodaySales.map(sale => (
                    <div key={sale.id} className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-850">
                        <div>
                          <span className="font-mono font-bold text-amber-400">{sale.reference}</span>
                          <span className="text-neutral-500 text-[11px] ml-2 font-mono">{sale.time}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                          {sale.paymentMethod}
                        </span>
                      </div>

                      <div className="py-2 space-y-1">
                        {sale.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-neutral-300">
                            <span>{item.quantity}x {item.productName}</span>
                            <span className="font-mono text-neutral-400">{formatNaira(item.totalPrice)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-neutral-850 flex justify-between items-center text-xs">
                        <span className="text-neutral-400 font-mono">Table: {sale.tableNumber}</span>
                        <span className="font-mono font-bold text-amber-400 text-sm">
                          {formatNaira(sale.totalAmount)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. CLOSING COUNT TAB (END-OF-DAY PROCEDURE) */}
        {activeTab === 'CLOSING_COUNT' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-neutral-100">
                  End-of-Day Physical Closing Count
                </h3>
                {existingTodayReport && (
                  <span className={`px-2.5 py-1 rounded text-xs font-bold font-mono ${
                    existingTodayReport.status === 'approved' 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {existingTodayReport.status.toUpperCase()}
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Carefully count the physical bottles in {refrigerator.id}. Discrepancies generate instant alerts.
              </p>
            </div>

            {existingTodayReport?.status === 'approved' && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Today's count was approved by Management. This record is locked and cannot be altered.</span>
              </div>
            )}

            {/* Interactive Physical Count Form */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px] font-bold">
                    <th className="py-2.5 px-2">Product</th>
                    <th className="py-2.5 px-2 text-center">System Expected</th>
                    <th className="py-2.5 px-2 text-center">Physical Count</th>
                    <th className="py-2.5 px-2 text-right">Variance</th>
                    <th className="py-2.5 px-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 font-mono">
                  {products.map(prod => {
                    const expected = fridgeStockMap.get(prod.id) || 0;
                    const physical = physicalCounts[prod.id] !== undefined ? physicalCounts[prod.id] : expected;
                    const variance = physical - expected;

                    return (
                      <tr key={prod.id} className="hover:bg-neutral-850">
                        <td className="py-2.5 px-2">
                          <p className="font-bold text-neutral-200 font-sans">{prod.name}</p>
                          <span className="text-[10px] text-amber-400">{prod.code}</span>
                        </td>
                        <td className="py-2.5 px-2 text-center font-bold text-neutral-300">
                          {expected}
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <input
                            type="number"
                            min="0"
                            disabled={existingTodayReport?.status === 'approved'}
                            value={physical}
                            onChange={e => {
                              const val = parseInt(e.target.value) || 0;
                              setPhysicalCounts(prev => ({ ...prev, [prod.id]: val }));
                            }}
                            className="w-16 bg-neutral-950 border border-neutral-700 rounded-lg px-2 py-1 text-center font-bold text-sm text-white focus:outline-none focus:border-amber-500"
                          />
                        </td>
                        <td className="py-2.5 px-2 text-right">
                          <span className={`font-bold px-1.5 py-0.5 rounded text-xs ${
                            variance === 0 
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : variance < 0
                              ? 'text-red-400 bg-red-500/20 font-black'
                              : 'text-blue-400 bg-blue-500/20 font-black'
                          }`}>
                            {variance > 0 ? `+${variance}` : variance}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-right font-sans">
                          {variance === 0 ? (
                            <span className="text-emerald-400 font-semibold text-[11px]">Balanced</span>
                          ) : (
                            <span className="text-red-400 font-bold text-[11px] flex items-center justify-end gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              {variance < 0 ? `${Math.abs(variance)} Short` : `${variance} Excess`}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Prompt's exact warning display */}
            {products.some(p => {
              const exp = fridgeStockMap.get(p.id) || 0;
              const phys = physicalCounts[p.id] !== undefined ? physicalCounts[p.id] : exp;
              return phys !== exp;
            }) && (
              <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl space-y-1">
                <div className="flex items-center gap-2 text-red-300 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span>STOCK DISCREPANCY WARNING DETECTED</span>
                </div>
                {products.filter(p => {
                  const exp = fridgeStockMap.get(p.id) || 0;
                  const phys = physicalCounts[p.id] !== undefined ? physicalCounts[p.id] : exp;
                  return phys !== exp;
                }).map(p => {
                  const exp = fridgeStockMap.get(p.id) || 0;
                  const phys = physicalCounts[p.id] !== undefined ? physicalCounts[p.id] : exp;
                  const varVal = phys - exp;
                  return (
                    <p key={p.id} className="text-xs text-red-200 font-mono">
                      STOCK VARIANCE: {varVal > 0 ? `+${varVal}` : varVal} {p.name.toUpperCase()} BOTTLES
                    </p>
                  );
                })}
              </div>
            )}

            {/* Submit Button */}
            {existingTodayReport?.status !== 'approved' && (
              <button
                onClick={handleSubmitClosingCount}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm rounded-xl transition uppercase tracking-wider shadow-lg shadow-amber-500/20"
              >
                SUBMIT END-OF-DAY COUNT TO MANAGER
              </button>
            )}
          </div>
        )}
      </main>

      {/* QR & Barcode Scanner Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanResult={handleQRResult}
        products={products}
      />
    </div>
  );
};
