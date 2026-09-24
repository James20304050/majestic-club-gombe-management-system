import React, { useState, useEffect } from 'react';
import { 
  StaffMember, 
  Sale, 
  StockTransfer, 
  DailyStockCountReport, 
  SnookerBooking, 
  EventBooking, 
  HotelRoom,
  HotelBooking,
  Product, 
  WastageRecord, 
  ComplimentaryItem 
} from './types';
import { MajesticStore } from './services/store';
import { PublicWebsite } from './components/public/PublicWebsite';
import { LoginView } from './components/auth/LoginView';
import { SalesStaffPortal } from './components/dashboard/SalesStaffPortal';
import { ManagerDashboard } from './components/dashboard/ManagerDashboard';
import { PageLayout } from './components/layout/PageLayout';
import { Shield, Sparkles, UserCheck } from 'lucide-react';

export default function App() {
  // App views: 'PUBLIC_WEBSITE' | 'LOGIN' | 'PORTAL'
  const [view, setView] = useState<'PUBLIC_WEBSITE' | 'LOGIN' | 'PORTAL'>('PUBLIC_WEBSITE');

  // Load state from MajesticStore
  const [staffList, setStaffList] = useState<StaffMember[]>(() => MajesticStore.getStaff());
  const [currentUser, setCurrentUser] = useState<StaffMember | null>(() => staffList[0] || null);
  const [products, setProducts] = useState<Product[]>(() => MajesticStore.getProducts());
  const [locations, setLocations] = useState(() => MajesticStore.getLocations());
  const [refrigerators, setRefrigerators] = useState(() => MajesticStore.getRefrigerators());
  const [stockBalances, setStockBalances] = useState(() => MajesticStore.getStockBalances());
  const [sales, setSales] = useState<Sale[]>(() => MajesticStore.getSales());
  const [transfers, setTransfers] = useState<StockTransfer[]>(() => MajesticStore.getTransfers());
  const [wastageRecords, setWastageRecords] = useState<WastageRecord[]>(() => MajesticStore.getWastage());
  const [complimentaryItems, setComplimentaryItems] = useState<ComplimentaryItem[]>(() => MajesticStore.getComplimentary());
  const [stockReports, setStockReports] = useState<DailyStockCountReport[]>(() => MajesticStore.getStockReports());
  const [snookerTables, setSnookerTables] = useState(() => MajesticStore.getSnookerTables());
  const [snookerBookings, setSnookerBookings] = useState<SnookerBooking[]>(() => MajesticStore.getSnookerBookings());
  const [eventBookings, setEventBookings] = useState<EventBooking[]>(() => MajesticStore.getEventBookings());
  const [hotelRooms, setHotelRooms] = useState<HotelRoom[]>(() => MajesticStore.getHotelRooms());
  const [hotelBookings, setHotelBookings] = useState<HotelBooking[]>(() => MajesticStore.getHotelBookings());
  const [auditLogs, setAuditLogs] = useState(() => MajesticStore.getAuditLogs());
  const [businessConfig, setBusinessConfig] = useState(() => MajesticStore.getBusinessConfig());

  // Refresh all state from local storage or store
  const refreshStoreState = () => {
    setStaffList(MajesticStore.getStaff());
    setProducts(MajesticStore.getProducts());
    setLocations(MajesticStore.getLocations());
    setRefrigerators(MajesticStore.getRefrigerators());
    setStockBalances(MajesticStore.getStockBalances());
    setSales(MajesticStore.getSales());
    setTransfers(MajesticStore.getTransfers());
    setWastageRecords(MajesticStore.getWastage());
    setComplimentaryItems(MajesticStore.getComplimentary());
    setStockReports(MajesticStore.getStockReports());
    setSnookerTables(MajesticStore.getSnookerTables());
    setSnookerBookings(MajesticStore.getSnookerBookings());
    setEventBookings(MajesticStore.getEventBookings());
    setHotelRooms(MajesticStore.getHotelRooms());
    setHotelBookings(MajesticStore.getHotelBookings());
    setAuditLogs(MajesticStore.getAuditLogs());
    setBusinessConfig(MajesticStore.getBusinessConfig());
  };

  // Handlers for App Actions
  const handleLogin = (staff: StaffMember) => {
    setCurrentUser(staff);
    setView('PORTAL');
  };

  const handleLogout = () => {
    setView('PUBLIC_WEBSITE');
  };

  const handleSwitchUser = (staff: StaffMember) => {
    setCurrentUser(staff);
  };

  // Sales Staff & POS Sale
  const handleRecordSale = (newSale: Sale) => {
    MajesticStore.recordSale(newSale);
    refreshStoreState();
  };

  // Submit Closing Count
  const handleSubmitClosingCount = (report: DailyStockCountReport) => {
    MajesticStore.submitClosingCount(report);
    refreshStoreState();
  };

  // Create Stock Transfer
  const handleCreateTransfer = (transfer: StockTransfer) => {
    MajesticStore.createTransfer(transfer);
    refreshStoreState();
  };

  // Update Transfer status (e.g. received)
  const handleUpdateTransferStatus = (transferId: string, status: StockTransfer['status'], receiverName?: string) => {
    MajesticStore.updateTransferStatus(transferId, status, receiverName);
    refreshStoreState();
  };

  // Approve Wastage
  const handleApproveWastage = (wastageId: string, approved: boolean) => {
    if (currentUser) {
      MajesticStore.approveWastage(wastageId, currentUser.name);
      refreshStoreState();
    }
  };

  // Approve Closing Count
  const handleApproveStockCount = (reportId: string) => {
    if (currentUser) {
      MajesticStore.approveClosingCount(reportId, currentUser.name);
      refreshStoreState();
    }
  };

  // Product price update
  const handleUpdateProductPrice = (productId: string, newPrice: number) => {
    if (currentUser) {
      MajesticStore.updateProductPrice(productId, newPrice, currentUser.name);
      refreshStoreState();
    }
  };

  // Add Product
  const handleAddProduct = (prod: Product) => {
    // Add logic if needed
  };

  // Record Complimentary item
  const handleRecordComplimentary = (comp: ComplimentaryItem) => {
    // Comp logic
  };

  // Snooker booking from public website
  const handleSnookerBookingSubmit = (booking: SnookerBooking) => {
    MajesticStore.recordSnookerBooking(booking);
    refreshStoreState();
  };

  // Event / Table booking from public website
  const handleEventBookingSubmit = (booking: EventBooking) => {
    MajesticStore.recordEventBooking(booking);
    refreshStoreState();
  };

  // Hotel room booking from public website
  const handleHotelBookingSubmit = (booking: HotelBooking) => {
    MajesticStore.recordHotelBooking(booking);
    refreshStoreState();
  };

  // Factory demo reset
  const handleResetFactoryDemo = () => {
    if (window.confirm('Reset all demo stock, sales, and refrigerators to pristine initial state?')) {
      MajesticStore.resetToFactoryDemo();
      refreshStoreState();
      alert('Majestic Club demo data restored to factory defaults!');
    }
  };

  // Find assigned refrigerator for sales staff
  const assignedFridge = React.useMemo(() => {
    if (!currentUser || !currentUser.assignedRefrigeratorId) {
      return refrigerators[6] || refrigerators[0]; // default FR-007 for Sales Girl 07
    }
    return refrigerators.find(r => r.id === currentUser.assignedRefrigeratorId) || refrigerators[0];
  }, [currentUser, refrigerators]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Floating Demo Mode Switcher Bar */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-neutral-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-amber-500/40 shadow-2xl">
        {view === 'PUBLIC_WEBSITE' ? (
          <button
            onClick={() => setView('LOGIN')}
            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/25 transition active:scale-95"
          >
            <Shield className="w-4 h-4 text-black" />
            <span>STAFF & MANAGEMENT LOGIN</span>
          </button>
        ) : (
          <button
            onClick={() => setView('PUBLIC_WEBSITE')}
            className="flex items-center gap-2 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-bold text-xs rounded-xl border border-neutral-700 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>PUBLIC WEBSITE VIEW</span>
          </button>
        )}
      </div>

      {/* VIEW ROUTING */}
      {view === 'PUBLIC_WEBSITE' && (
        <PageLayout initialSection="hero" enableScrollSpy={true} showSectionBadge={true}>
          <PublicWebsite
            products={products}
            snookerTables={snookerTables}
            hotelRooms={hotelRooms}
            onOpenManagementLogin={() => setView('LOGIN')}
            onBookSnooker={(data) => {
              const booking: SnookerBooking = {
                ...data,
                id: `snk_${Date.now()}`,
                reference: `SNK-${Date.now().toString().slice(-6)}`,
                createdAt: new Date().toISOString()
              };
              handleSnookerBookingSubmit(booking);
            }}
            onBookEvent={(data) => {
              const booking: EventBooking = {
                ...data,
                id: `evt_${Date.now()}`,
                reference: `EVT-${Date.now().toString().slice(-6)}`,
                createdAt: new Date().toISOString()
              };
              handleEventBookingSubmit(booking);
            }}
            onBookHotel={(data) => {
              const booking: HotelBooking = {
                ...data,
                id: `htl_${Date.now()}`,
                reference: `HTL-${Date.now().toString().slice(-6)}`,
                createdAt: new Date().toISOString()
              };
              handleHotelBookingSubmit(booking);
            }}
          />
        </PageLayout>
      )}

      {view === 'LOGIN' && (
        <PageLayout initialSection="login" enableScrollSpy={false}>
          <LoginView
            staffList={staffList}
            onLogin={handleLogin}
            onBackToWebsite={() => setView('PUBLIC_WEBSITE')}
          />
        </PageLayout>
      )}

      {view === 'PORTAL' && currentUser && (
        currentUser.role === 'sales_staff' ? (
          <PageLayout initialSection="sales_portal" enableScrollSpy={false}>
            <SalesStaffPortal
              currentUser={currentUser}
              refrigerator={assignedFridge}
              products={products}
              stockBalances={stockBalances}
              sales={sales}
              dailyStockReports={stockReports}
              onRecordSale={handleRecordSale}
              onSubmitClosingCount={handleSubmitClosingCount}
              onLogout={handleLogout}
            />
          </PageLayout>
        ) : (
          <PageLayout initialSection="manager_dashboard" enableScrollSpy={false}>
            <ManagerDashboard
              currentUser={currentUser}
              staffList={staffList}
              refrigerators={refrigerators}
              products={products}
              locations={locations}
              stockBalances={stockBalances}
              sales={sales}
              transfers={transfers}
              wastageRecords={wastageRecords}
              complimentaryItems={complimentaryItems}
              stockReports={stockReports}
              snookerTables={snookerTables}
              snookerBookings={snookerBookings}
              eventBookings={eventBookings}
              hotelRooms={hotelRooms}
              hotelBookings={hotelBookings}
              auditLogs={auditLogs}
              businessConfig={businessConfig}
              onSwitchUser={handleSwitchUser}
              onCreateTransfer={handleCreateTransfer}
              onUpdateTransferStatus={handleUpdateTransferStatus}
              onApproveWastage={handleApproveWastage}
              onApproveStockCount={handleApproveStockCount}
              onAddProduct={handleAddProduct}
              onUpdateProductPrice={handleUpdateProductPrice}
              onRecordComplimentary={handleRecordComplimentary}
              onLogout={handleLogout}
              onResetFactoryDemo={handleResetFactoryDemo}
            />
          </PageLayout>
        )
      )}
    </div>
  );
}
