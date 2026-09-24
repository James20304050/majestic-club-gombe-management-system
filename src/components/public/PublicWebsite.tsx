import React, { useState } from 'react';
import { 
  Wine, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Phone, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  Lock, 
  Send,
  MessageCircle,
  Trophy,
  Crown,
  Flame,
  CheckCircle,
  ShoppingBag,
  Plus,
  Minus,
  X,
  CreditCard,
  Eye,
  ExternalLink,
  Camera,
  Layers,
  Users,
  Hotel,
  BedDouble,
  Check,
  Star,
  Utensils,
  Maximize2
} from 'lucide-react';
import { Product, ProductCategory, SnookerTable, SnookerBooking, EventBooking, HotelRoom, HotelBooking } from '../../types';
import { formatNaira } from '../../utils/helpers';
import { CLUB_IMAGES, GALLERY_ITEMS } from '../../assets/clubImages';
import { MembershipPlans } from './MembershipPlans';

interface PublicWebsiteProps {
  products: Product[];
  snookerTables: SnookerTable[];
  hotelRooms: HotelRoom[];
  onOpenManagementLogin: () => void;
  onBookSnooker: (booking: Omit<SnookerBooking, 'id' | 'reference' | 'createdAt'>) => void;
  onBookEvent: (booking: Omit<EventBooking, 'id' | 'reference' | 'createdAt'>) => void;
  onBookHotel: (booking: Omit<HotelBooking, 'id' | 'reference' | 'createdAt'>) => void;
}

export const PublicWebsite: React.FC<PublicWebsiteProps> = ({
  products,
  snookerTables,
  hotelRooms,
  onOpenManagementLogin,
  onBookSnooker,
  onBookEvent,
  onBookHotel,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'ALL'>('ALL');
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'TABLE' | 'SNOOKER' | 'EVENT' | 'HOTEL' | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string; subtitle: string; tag: string } | null>(null);

  // Poster display mode toggle ('POSTER_HERO' | 'SPLIT_SHOWCASE' | 'FULL_AMBIENT')
  const [posterDisplayMode, setPosterDisplayMode] = useState<'POSTER_HERO' | 'SPLIT_SHOWCASE' | 'FULL_AMBIENT'>('POSTER_HERO');

  // Selected hotel room for details modal or direct booking
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<HotelRoom | null>(hotelRooms[1] || hotelRooms[0] || null);

  // Hotel booking form state
  const [hotelForm, setHotelForm] = useState({
    roomId: hotelRooms[0]?.id || '',
    customerName: '',
    phone: '',
    email: '',
    checkInDate: new Date().toISOString().slice(0, 10),
    checkOutDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    numberOfNights: 1,
    numberOfGuests: 2,
    specialRequests: ''
  });

  // Snooker form state
  const [snookerForm, setSnookerForm] = useState({
    customerName: '',
    phone: '',
    tableId: snookerTables[0]?.id || '',
    date: new Date().toISOString().slice(0, 10),
    timeSlot: '19:00 - 20:00',
    durationHours: 1,
    numberOfPlayers: 2
  });

  // Event & VIP booking form
  const [eventForm, setEventForm] = useState({
    type: 'VIP_TABLE' as EventBooking['type'],
    customerName: '',
    phone: '',
    email: '',
    date: new Date().toISOString().slice(0, 10),
    time: '21:00',
    package: 'Presidential Diamond VIP Cabana',
    numberOfPeople: 6,
    tableArea: 'VIP Balcony Mezzanine',
    amount: 150000,
    notes: ''
  });

  const [bookingSuccessMsg, setBookingSuccessMsg] = useState<string | null>(null);

  const categories: (ProductCategory | 'ALL')[] = ['ALL', 'BEER', 'SPIRITS', 'WINE', 'SOFT DRINKS', 'WATER', 'OTHER DRINKS'];

  const filteredProducts = selectedCategory === 'ALL'
    ? products.filter(p => p.isActive)
    : products.filter(p => p.isActive && p.category === selectedCategory);

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateCartQty = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as { product: Product; quantity: number }[]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.sellingPrice * item.quantity), 0);

  const handleSnookerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const table = snookerTables.find(t => t.id === snookerForm.tableId);
    if (!table) return;

    onBookSnooker({
      customerName: snookerForm.customerName,
      phone: snookerForm.phone,
      tableId: table.id,
      tableName: table.name,
      date: snookerForm.date,
      timeSlot: snookerForm.timeSlot,
      durationHours: snookerForm.durationHours,
      numberOfPlayers: snookerForm.numberOfPlayers,
      totalAmount: table.hourlyPrice * snookerForm.durationHours,
      paymentStatus: 'DEPOSIT_PAID',
      status: 'confirmed'
    });

    setBookingSuccessMsg(`Snooker booked successfully for ${snookerForm.customerName} on ${table.name}!`);
    setActiveModal(null);
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBookEvent({
      type: eventForm.type,
      customerName: eventForm.customerName,
      phone: eventForm.phone,
      email: eventForm.email,
      date: eventForm.date,
      time: eventForm.time,
      package: eventForm.package,
      numberOfPeople: eventForm.numberOfPeople,
      tableArea: eventForm.tableArea,
      amount: eventForm.amount,
      depositAmount: Math.round(eventForm.amount * 0.4),
      paymentStatus: 'DEPOSIT_PAID',
      status: 'confirmed',
      notes: eventForm.notes
    });

    setBookingSuccessMsg(`VIP / Event reservation confirmed for ${eventForm.customerName}! Our hospitality director will reach out immediately.`);
    setActiveModal(null);
  };

  const handleHotelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const room = hotelRooms.find(r => r.id === hotelForm.roomId) || selectedRoomForBooking || hotelRooms[0];
    if (!room) return;

    // Calculate nights
    const start = new Date(hotelForm.checkInDate).getTime();
    const end = new Date(hotelForm.checkOutDate).getTime();
    const nights = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
    const totalAmount = room.pricePerNight * nights;

    onBookHotel({
      roomId: room.id,
      roomName: room.name,
      roomCategory: room.category,
      customerName: hotelForm.customerName,
      phone: hotelForm.phone,
      email: hotelForm.email,
      checkInDate: hotelForm.checkInDate,
      checkOutDate: hotelForm.checkOutDate,
      numberOfNights: nights,
      numberOfGuests: hotelForm.numberOfGuests,
      pricePerNight: room.pricePerNight,
      totalAmount: totalAmount,
      paymentStatus: 'DEPOSIT_PAID',
      status: 'confirmed',
      specialRequests: hotelForm.specialRequests
    });

    setBookingSuccessMsg(`Hotel Room reservation confirmed for ${hotelForm.customerName} (${room.name})! Check-in: ${hotelForm.checkInDate}`);
    setActiveModal(null);
  };

  const handleWhatsAppChat = (message: string) => {
    const phone = '2348035557777';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-neutral-950/75 backdrop-blur-[1px] text-neutral-100 flex flex-col font-sans">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 py-1.5 px-4 text-center text-xs font-semibold text-black tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5" />
        <span>GOMBE STATE'S PREMIER LUXURY NIGHTCLUB, LOUNGE & SNOOKER ARENA • OPEN DAILY FROM 4:00 PM</span>
        <Sparkles className="w-3.5 h-3.5" />
      </div>

      {/* Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo Branding */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-yellow-700 flex items-center justify-center text-black font-black shadow-lg shadow-amber-500/20">
              <Crown className="w-6 h-6 text-black" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent font-serif">
                MAJESTIC CLUB
              </span>
              <p className="text-[10px] tracking-widest text-neutral-400 uppercase font-mono">
                GOMBE STATE • NIGERIA
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-neutral-300">
            <a href="#about" className="hover:text-amber-400 transition">About</a>
            <a href="#drinks" className="hover:text-amber-400 transition">Drinks Menu</a>
            <a href="#hotel" className="text-amber-400 hover:text-amber-300 transition font-semibold flex items-center gap-1.5">
              <Hotel className="w-4 h-4" />
              <span>Hotel Rooms</span>
            </a>
            <a href="#food" className="hover:text-amber-400 transition">Grill</a>
            <a href="#snooker" className="hover:text-amber-400 transition">Snooker</a>
            <a href="#vip" className="hover:text-amber-400 transition">VIP Cabanas</a>
            <a href="#membership" className="hover:text-amber-400 transition">Membership</a>
            <a href="#events" className="hover:text-amber-400 transition">Events</a>
            <a href="#gallery" className="hover:text-amber-400 transition">Gallery</a>
            <a href="#contact" className="hover:text-amber-400 transition">Location</a>
          </nav>

          {/* Action Area */}
          <div className="flex items-center gap-3">
            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 text-neutral-300 hover:text-amber-400 transition"
              title="View Order Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-black text-xs font-bold rounded-full flex items-center justify-center">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </button>

            {/* Staff / Management Login Button */}
            <button
              onClick={onOpenManagementLogin}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-neutral-800 to-neutral-900 hover:from-amber-600 hover:to-amber-500 border border-neutral-700 hover:border-amber-400 text-neutral-200 hover:text-black font-semibold text-xs transition duration-200 shadow-md group"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400 group-hover:text-black" />
              <span>STAFF & MANAGEMENT PORTAL</span>
            </button>
          </div>
        </div>
      </header>

      {/* Success Notification Alert */}
      {bookingSuccessMsg && (
        <div className="bg-emerald-950/90 border-b border-emerald-500/50 py-3 px-4 text-center text-sm font-semibold text-emerald-200 flex items-center justify-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span>{bookingSuccessMsg}</span>
          <button onClick={() => setBookingSuccessMsg(null)} className="ml-4 underline text-xs">Dismiss</button>
        </div>
      )}

      {/* HERO SECTION WITH MASTER WALLPAPER & MULTI-METHOD DISPLAY */}
      <section id="hero" className="relative min-h-[96vh] flex flex-col justify-center overflow-hidden px-4 sm:px-6 lg:px-8 py-16">
        {/* Authentic Master Artwork Wallpaper: High-Impact Background with Glow */}
        <div className="absolute inset-0 z-0">
          <img
            src={CLUB_IMAGES.masterPoster}
            alt="Majestic Club Gombe Official Grand Wall Artwork & Master Showcase"
            className={`w-full h-full object-cover transition-all duration-1000 ${
              posterDisplayMode === 'FULL_AMBIENT' 
                ? 'opacity-85 scale-100 filter brightness-105' 
                : posterDisplayMode === 'SPLIT_SHOWCASE'
                ? 'opacity-40 scale-105 filter blur-[1px]'
                : 'opacity-55 scale-100'
            }`}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/75 to-neutral-950/50" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.25),transparent_75%)]" />
        </div>

        {/* Wallpaper Display Method Selector Switcher */}
        <div className="relative z-20 max-w-5xl mx-auto w-full mb-6 flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/70 border border-amber-500/40 text-amber-400 text-xs font-mono font-semibold backdrop-blur-md shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>OFFICIAL WALLPAPER DISPLAY MODES</span>
          </div>

          <div className="inline-flex p-1 rounded-xl bg-neutral-900/90 border border-neutral-700 backdrop-blur-md shadow-xl">
            <button
              onClick={() => setPosterDisplayMode('POSTER_HERO')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                posterDisplayMode === 'POSTER_HERO'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>Grand Poster View</span>
            </button>
            <button
              onClick={() => setPosterDisplayMode('SPLIT_SHOWCASE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                posterDisplayMode === 'SPLIT_SHOWCASE'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>Split Showcase</span>
            </button>
            <button
              onClick={() => setPosterDisplayMode('FULL_AMBIENT')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                posterDisplayMode === 'FULL_AMBIENT'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>Immersive Ambient</span>
            </button>
          </div>
        </div>

        {/* Hero Content Dynamic Layout based on Display Method */}
        {posterDisplayMode === 'SPLIT_SHOWCASE' ? (
          /* Method 2: Split Showcase (Poster on right, booking actions on left) */
          <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6">
            <div className="lg:col-span-7 text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                <Crown className="w-4 h-4 text-amber-400" />
                GOMBE STATE'S PREMIER NIGHTLIFE & HOTEL DESTINATION
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight uppercase font-serif leading-none">
                MAJESTIC CLUB <br />
                <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                  & GRAND VILLE LOUNGE
                </span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-300 font-light max-w-xl leading-relaxed">
                Good Drinks • Great Vibes • Majestic Experience. Indulge in executive bottle service, tournament snooker arena, and executive hotel rooms in Gombe State, Nigeria.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setEventForm(prev => ({ ...prev, type: 'VIP_TABLE' }));
                    setActiveModal('EVENT');
                  }}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-xl shadow-amber-500/25 transition"
                >
                  Book VIP Table
                </button>
                <a
                  href="#hotel"
                  className="px-6 py-3.5 rounded-xl bg-neutral-900 border border-amber-500/50 hover:bg-amber-500 hover:text-black text-amber-300 font-extrabold text-xs sm:text-sm tracking-wider uppercase transition flex items-center gap-2"
                >
                  <Hotel className="w-4 h-4" />
                  <span>Hotel Rooms</span>
                </a>
                <button
                  onClick={() => setActiveModal('SNOOKER')}
                  className="px-6 py-3.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-bold text-xs sm:text-sm tracking-wider uppercase transition"
                >
                  Book Snooker
                </button>
              </div>
            </div>

            {/* Poster Card with zoom action */}
            <div className="lg:col-span-5 flex justify-center">
              <div 
                onClick={() => setLightboxImage({
                  src: CLUB_IMAGES.masterPoster,
                  title: 'Majestic Club Gombe Official Master Brand Poster',
                  subtitle: 'Good Drinks, Great Vibes, Majestic Experience — Full Official Artwork',
                  tag: 'Official Master Poster'
                })}
                className="group relative rounded-2xl overflow-hidden border-2 border-amber-500/70 shadow-2xl shadow-amber-500/20 max-w-sm cursor-pointer transform hover:scale-[1.02] transition duration-300"
              >
                <img
                  src={CLUB_IMAGES.masterPoster}
                  alt="Majestic Club Gombe Official Poster Artwork"
                  className="w-full h-auto object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 text-white font-bold text-sm bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                  <Maximize2 className="w-5 h-5 text-amber-400" />
                  <span>Click to Expand Full Poster</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Method 1 & 3: Grand Poster Centered View / Immersive Ambient */
          <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
            {/* Subtle Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-950/85 border border-amber-500/50 text-amber-400 text-xs font-semibold mb-6 tracking-widest uppercase shadow-xl backdrop-blur-md">
              <Flame className="w-4 h-4 text-amber-500" />
              THE PINNACLE OF LUXURY NIGHTLIFE & HOTEL IN GOMBE
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight uppercase font-serif mb-5 leading-none drop-shadow-2xl">
              WELCOME TO <br />
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-md">
                MAJESTIC CLUB GOMBE
              </span>
            </h1>

            {/* Subheading from the Official Poster */}
            <div className="inline-block px-5 py-2 rounded-xl bg-black/60 border border-amber-500/30 backdrop-blur-md mb-8">
              <p className="text-sm sm:text-lg text-amber-200 font-mono tracking-widest uppercase">
                Entertainment • Nightlife • Events • Snooker • VIP Experience
              </p>
              <p className="text-xs text-neutral-400 mt-1 italic font-serif">
                "Good Drinks • Great Vibes • Majestic Experience"
              </p>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-3xl mx-auto">
              <button
                onClick={() => {
                  setEventForm(prev => ({ ...prev, type: 'VIP_TABLE' }));
                  setActiveModal('EVENT');
                }}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-xl shadow-amber-500/25 transition transform hover:-translate-y-0.5"
              >
                BOOK A TABLE
              </button>

              <button
                onClick={() => setActiveModal('SNOOKER')}
                className="px-6 py-3.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border-2 border-amber-500/60 hover:border-amber-400 text-amber-300 font-extrabold text-xs sm:text-sm tracking-wider uppercase transition shadow-lg"
              >
                BOOK SNOOKER
              </button>

              <a
                href="#hotel"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-950/80 to-neutral-900 hover:from-amber-900 hover:to-neutral-850 border border-amber-500/70 text-amber-300 hover:text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase transition shadow-lg flex items-center gap-2"
              >
                <Hotel className="w-4 h-4 text-amber-400" />
                <span>BOOK HOTEL ROOM</span>
              </a>

              <a
                href="#drinks"
                className="px-6 py-3.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700 hover:border-neutral-500 text-neutral-200 font-bold text-xs sm:text-sm tracking-wider uppercase transition"
              >
                VIEW DRINKS
              </a>

              <button
                onClick={() => {
                  setEventForm(prev => ({ ...prev, type: 'PRIVATE_EVENT' }));
                  setActiveModal('EVENT');
                }}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-neutral-800 to-neutral-900 hover:from-amber-950 hover:to-neutral-800 border border-amber-500/30 text-amber-200 font-bold text-xs sm:text-sm tracking-wider uppercase transition"
              >
                BOOK AN EVENT
              </button>
            </div>
          </div>
        )}

        {/* POSTER RIBBON ICON HOTSPOTS (Directly matching the icons on the official artwork) */}
        <div className="relative z-10 max-w-5xl mx-auto w-full mt-12 pt-6 border-t border-neutral-800/80">
          <div className="text-center mb-3">
            <span className="text-[11px] font-mono tracking-widest text-amber-400 uppercase font-semibold">
              QUICK ACCESS NAVIGATION FROM OFFICIAL ARTWORK
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {[
              { label: 'BAR', icon: Wine, href: '#drinks', color: 'hover:border-amber-400' },
              { label: 'LOUNGE', icon: Crown, href: '#vip', color: 'hover:border-amber-400' },
              { label: 'HOTEL', icon: Hotel, href: '#hotel', color: 'hover:border-amber-400 text-amber-400' },
              { label: 'GRILL', icon: Utensils, href: '#food', color: 'hover:border-amber-400' },
              { label: 'VIP', icon: Star, href: '#vip', color: 'hover:border-amber-400' },
              { label: 'SNOOKER', icon: Trophy, href: '#snooker', color: 'hover:border-amber-400' },
              { label: 'EVENTS', icon: Calendar, href: '#events', color: 'hover:border-amber-400' },
              { label: 'LOCATION', icon: MapPin, href: '#contact', color: 'hover:border-amber-400' },
            ].map(item => {
              const IconComp = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl bg-neutral-950/80 hover:bg-neutral-900 border border-neutral-800 ${item.color} transition duration-200 group text-center backdrop-blur-md`}
                >
                  <IconComp className="w-4 h-4 text-amber-400 group-hover:scale-110 transition mb-1" />
                  <span className="text-[10px] font-bold font-mono tracking-wider text-neutral-300 group-hover:text-amber-300">
                    {item.label}
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="relative z-10 max-w-5xl mx-auto w-full mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          <div className="bg-neutral-950/80 backdrop-blur-md p-3.5 rounded-xl border border-neutral-800">
            <span className="text-amber-400 font-extrabold text-xl font-mono">20+</span>
            <p className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold mt-0.5">Refrigerators & Stations</p>
          </div>
          <div className="bg-neutral-950/80 backdrop-blur-md p-3.5 rounded-xl border border-neutral-800">
            <span className="text-amber-400 font-extrabold text-xl font-mono">10,000+</span>
            <p className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold mt-0.5">Ice-Cold Bottles Stocked</p>
          </div>
          <div className="bg-neutral-950/80 backdrop-blur-md p-3.5 rounded-xl border border-neutral-800">
            <span className="text-amber-400 font-extrabold text-xl font-mono">4 Tables</span>
            <p className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold mt-0.5">Pro Snooker & Billiards</p>
          </div>
          <div className="bg-neutral-950/80 backdrop-blur-md p-3.5 rounded-xl border border-neutral-800">
            <span className="text-amber-400 font-extrabold text-xl font-mono">Luxury</span>
            <p className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold mt-0.5">Hotel Rooms & Suites</p>
          </div>
        </div>
      </section>

      {/* SYSTEM SHOWCASE BANNER SECTION (Mapped directly from official management graphic) */}
      <section className="relative py-20 bg-neutral-950 border-y border-neutral-800/80 overflow-hidden">
        {/* Background Branded Graphic */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={CLUB_IMAGES.systemMockup}
            alt="Majestic Club Management System Architecture"
            className="w-full h-full object-cover opacity-20 filter blur-[0.5px]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/90 to-neutral-950/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold tracking-wider uppercase">
                <Crown className="w-3.5 h-3.5" />
                OFFICIAL MANAGEMENT ECOSYSTEM
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-serif leading-tight">
                Good Drinks. Great Vibes. <br />
                <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                  Majestic Experience.
                </span>
              </h2>

              <p className="text-neutral-300 text-base leading-relaxed">
                Powered by a high-precision multi-device operating infrastructure. From our 20 dedicated refrigerator stations to digital point-of-sale handhelds and real-time executive variance analytics, Majestic Club Gombe guarantees flawless service and zero stock leakage.
              </p>

              {/* Power Features Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {[
                  '20 Refrigerators Fleet',
                  'POS Sales Terminals',
                  'Stock Balances Matrix',
                  'QR / Barcode Tracking',
                  'End-of-Day Closing Count',
                  'Automatic Variance Detection',
                  'Wastage & Breakage Log',
                  'Snooker Hourly Booking',
                  'Manager & Board Dashboard'
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-neutral-900/80 backdrop-blur-md px-3 py-2 rounded-xl border border-neutral-800 text-xs text-neutral-200">
                    <CheckCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={onOpenManagementLogin}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-extrabold text-xs tracking-wider uppercase flex items-center gap-2 shadow-lg shadow-amber-500/20 transition"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Launch Staff & Management Portal</span>
                </button>

                <button
                  onClick={() => setLightboxImage({
                    src: CLUB_IMAGES.systemMockup,
                    title: 'Majestic Club Gombe Management Suite',
                    subtitle: 'Multi-screen architecture: Web, Tablet Dashboard, POS Handhelds & 20 Refrigerators',
                    tag: 'System Architecture'
                  })}
                  className="px-5 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-amber-400/50 text-neutral-200 text-xs font-bold transition flex items-center gap-2"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>Inspect System Architecture</span>
                </button>
              </div>
            </div>

            {/* Right Side Visual Showcase */}
            <div className="lg:col-span-5">
              <div 
                onClick={() => setLightboxImage({
                  src: CLUB_IMAGES.systemMockup,
                  title: 'Majestic Club Management System Mockup',
                  subtitle: 'Official high-resolution promotional device showcase',
                  tag: 'Official Mockup'
                })}
                className="relative group rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl bg-neutral-900 cursor-pointer"
              >
                <img
                  src={CLUB_IMAGES.systemMockup}
                  alt="Majestic Club Management Graphic"
                  className="w-full h-auto object-cover group-hover:scale-105 transition duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div className="flex items-center justify-between w-full text-white text-xs font-medium">
                    <span>Click to view full-resolution banner</span>
                    <Eye className="w-4 h-4 text-amber-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT MAJESTIC CLUB */}
      <section id="about" className="py-20 bg-neutral-900/60 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-amber-400 text-xs font-bold uppercase tracking-widest font-mono">ABOUT MAJESTIC CLUB GOMBE</span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2 mb-6 font-serif">
                Gombe State's Grand Hub of Sophistication & Nightlife
              </h2>
              <p className="text-neutral-300 leading-relaxed mb-4">
                Situated in the prime commercial heart of Gombe, <span className="text-amber-400 font-semibold">Majestic Club</span> brings world-class entertainment, hospitality, and sporting recreation to northern Nigeria. 
              </p>
              <p className="text-neutral-400 leading-relaxed mb-6">
                From our tournament-standard snooker championship arena to our high-energy dancefloor equipped with 20 precision-cooled drink refrigerators, we guarantee your drinks are always sub-zero and your experience is strictly five-star.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <ShieldCheck className="w-5 h-5 text-amber-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-neutral-200">Executive Security</h4>
                    <p className="text-xs text-neutral-400">Strict guest verification & armed 24/7 security perimeter.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                  <Wine className="w-5 h-5 text-amber-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-neutral-200">Sub-Zero Cold Storage</h4>
                    <p className="text-xs text-neutral-400">20 dedicated refrigerators delivering ice-cold lager & champagne.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div 
                onClick={() => setLightboxImage({
                  src: CLUB_IMAGES.staffTeam,
                  title: 'Grand Ville & Majestic Lounge Hospitality Team',
                  subtitle: 'Our welcoming hospitality team outside YOU ARE WELCOME Reception',
                  tag: 'Our Team'
                })}
                className="aspect-4/3 rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl relative group cursor-pointer"
              >
                <img
                  src={CLUB_IMAGES.staffTeam}
                  alt="Majestic Club Staff Team at Reception"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-xs text-amber-300 font-medium flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" /> Click to enlarge staff team photo
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-neutral-950 p-6 rounded-2xl border border-neutral-800 shadow-2xl hidden sm:block max-w-xs">
                <p className="text-amber-400 font-bold text-2xl font-mono">₦0 Surprises</p>
                <p className="text-xs text-neutral-400 mt-1">Transparent digital POS receipts and table management for every guest.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DRINKS MENU SECTION (Rich Background: Premium VIP Bottles Lineup) */}
      <section id="drinks" className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-neutral-800/80 overflow-hidden">
        {/* Background Image: Authentic VIP Bottle Lineup */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={CLUB_IMAGES.drinksVip}
            alt="VIP Bottle Service Background"
            className="w-full h-full object-cover opacity-20 filter blur-[1px]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-950/92 to-neutral-950" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-amber-400 text-xs font-bold uppercase tracking-widest font-mono">PREMIUM HOSPITALITY</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1 font-serif">Chilled Drinks & Bottle Service</h2>
              <p className="text-neutral-400 text-sm mt-1">
                All prices live and automatically synced with Majestic Club stock inventory.
              </p>
            </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wider transition ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition duration-300 flex flex-col group shadow-lg"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-neutral-950">
                <img
                  src={product.image || 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=500&auto=format&fit=crop&q=80'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-amber-400 text-[10px] font-bold font-mono border border-neutral-700">
                  {product.code}
                </span>
                {product.volume && (
                  <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-neutral-900/90 text-neutral-300 text-[10px] font-medium">
                    {product.volume}
                  </span>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-semibold text-amber-500 tracking-wider uppercase font-mono">
                    {product.category}
                  </span>
                  <h3 className="font-bold text-neutral-100 text-base mt-0.5 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">Brand: {product.brand}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Club Price</span>
                    <span className="text-lg font-black text-amber-400 font-mono">
                      {formatNaira(product.sellingPrice)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-amber-500 text-neutral-200 hover:text-black font-bold text-xs transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Order</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

      {/* HOTEL & SUITES LOUNGE ACCOMMODATION SECTION */}
      <section id="hotel" className="relative py-24 border-t border-neutral-800 bg-neutral-950/90 overflow-hidden">
        {/* Ambient Subtle Background with glow */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <img
            src={CLUB_IMAGES.masterPoster}
            alt="Majestic Club Hotel & Suites Ambiance"
            className="w-full h-full object-cover filter blur-[2px]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-neutral-950/85" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold tracking-wider uppercase mb-3">
                <Hotel className="w-3.5 h-3.5" />
                HOSPITALITY & LODGING
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-serif">
                Luxury Hotel Rooms & Suites
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                Lounge in comfort before or after your nightclub experience. Choose from Normal Deluxe, Executive, Royal Suites, or the Presidential Penthouse with discrete 24/7 security.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedRoomForBooking(hotelRooms[0]);
                  setHotelForm(prev => ({ ...prev, roomId: hotelRooms[0]?.id || '' }));
                  setActiveModal('HOTEL');
                }}
                className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-amber-500/20 transition flex items-center gap-2"
              >
                <BedDouble className="w-4 h-4" />
                <span>Reserve Room Now</span>
              </button>
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hotelRooms.map(room => (
              <div
                key={room.id}
                className="bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                {/* Room Image Container */}
                <div className="relative h-48 overflow-hidden bg-neutral-950">
                  <img
                    src={room.image || CLUB_IMAGES.masterPoster}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
                  
                  {/* Category Badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-amber-400 text-[10px] font-bold font-mono border border-amber-500/30 uppercase">
                    {room.category}
                  </span>

                  {/* Room Number & Status */}
                  <span className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    room.status === 'AVAILABLE' 
                      ? 'bg-emerald-500/90 text-white' 
                      : 'bg-amber-600/90 text-white'
                  }`}>
                    {room.status === 'AVAILABLE' ? 'Available' : 'Reserved'}
                  </span>

                  {/* Bed Type & Capacity */}
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs text-neutral-300 font-medium">
                    <span className="flex items-center gap-1">
                      <BedDouble className="w-3.5 h-3.5 text-amber-400" />
                      {room.bedType}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      {room.maxGuests} Guests
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition">
                      {room.name}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                      {room.description}
                    </p>

                    {/* Key Amenities */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {room.amenities.slice(0, 3).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-neutral-950 text-neutral-300 text-[10px] border border-neutral-800"
                        >
                          {amenity}
                        </span>
                      ))}
                      {room.amenities.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded bg-neutral-950 text-amber-400 text-[10px] border border-neutral-800 font-mono">
                          +{room.amenities.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price & Booking Trigger */}
                  <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-neutral-400 block uppercase font-mono">Rate per night</span>
                      <span className="text-lg font-black text-amber-400 font-mono">
                        {formatNaira(room.pricePerNight)}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedRoomForBooking(room);
                        setHotelForm(prev => ({ ...prev, roomId: room.id }));
                        setActiveModal('HOTEL');
                      }}
                      className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-extrabold text-xs rounded-xl shadow-md transition"
                    >
                      Book Room
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Complimentary Guest Services Bar */}
          <div className="mt-12 p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">24/7 Room Service & Reception</h4>
                <p className="text-xs text-neutral-400 mt-0.5">Late night chilled bottles & kitchen order to room</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Guaranteed Privacy & Armed Security</h4>
                <p className="text-xs text-neutral-400 mt-0.5">Secure parking courtyard & discreet guest access</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                <Wine className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">VIP Club Pass Included</h4>
                <p className="text-xs text-neutral-400 mt-0.5">Free entrance to nightclub & snooker lounge</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SNOOKER & POOL ARENA (Rich Background: Luxury Snooker Baize Arena) */}
      <section id="snooker" className="relative py-24 border-t border-neutral-800 overflow-hidden">
        {/* Background Image: Tournament Snooker Arena */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={CLUB_IMAGES.snookerVip}
            alt="Majestic Snooker Arena Background"
            className="w-full h-full object-cover opacity-20 filter blur-[1px]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-950/92 to-neutral-950" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              CHAMPIONSHIP SNOOKER & POOL CLUB
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2 font-serif">
              Master the Green Baize in Gombe
            </h2>
            <p className="text-neutral-300 mt-3 text-sm sm:text-base leading-relaxed">
              Majestic Club houses tournament-certified Riley and Star snooker tables equipped with professional directional lighting, premium Aramith tournament balls, and dedicated referee service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {snookerTables.map(table => (
              <div
                key={table.id}
                className="bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-mono text-[10px] font-bold uppercase">
                      {table.type}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      table.status === 'available'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : table.status === 'in_play'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}>
                      {table.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-100">{table.name}</h3>
                  <p className="text-xs text-neutral-400 mt-1">Professional slate bed & Strachan cloth.</p>

                  {table.status === 'in_play' && (
                    <div className="mt-3 p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300 font-mono">
                      In session since {table.currentSessionStart}
                      <br />
                      <span className="text-neutral-400">Player: {table.currentCustomer}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-850 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase">Rate</span>
                    <span className="text-base font-bold text-amber-400 font-mono">
                      {formatNaira(table.hourlyPrice)} / hr
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSnookerForm(prev => ({ ...prev, tableId: table.id }));
                      setActiveModal('SNOOKER');
                    }}
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl transition"
                  >
                    Reserve Table
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIP LOUNGES & CABANAS */}
      <section id="vip" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-widest font-mono">EXECUTIVE HOSPITALITY</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2 font-serif">
            VIP Cabanas & Presidential Lounges
          </h2>
          <p className="text-neutral-400 mt-3 text-sm">
            Experience discrete exclusivity, dedicated VIP hostess service, and customized bottle packages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider font-mono">SILVER MEZZANINE</span>
              <h3 className="text-xl font-bold text-neutral-100 mt-1">Balcony VIP Booth</h3>
              <p className="text-2xl font-black text-amber-400 font-mono mt-3">₦75,000</p>
              <p className="text-xs text-neutral-400 mb-6">Minimum spend credit</p>
              
              <ul className="space-y-2 text-xs text-neutral-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400" /> Up to 5 Guests
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400" /> Dedicated Hostess (Sales Girl Station)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400" /> 1 Bottle Premium Spirit or 2 Buckets Lager
                </li>
              </ul>
            </div>
            <button
              onClick={() => {
                setEventForm(prev => ({ ...prev, package: 'Balcony VIP Booth', amount: 75000, numberOfPeople: 5 }));
                setActiveModal('EVENT');
              }}
              className="mt-8 w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-amber-500 text-white hover:text-black font-bold text-xs transition"
            >
              Select Package
            </button>
          </div>

          {/* Card 2 (Featured) */}
          <div className="bg-gradient-to-b from-neutral-900 to-amber-950/40 border-2 border-amber-500 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between transform md:-translate-y-2">
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-amber-500 text-black text-[10px] font-black uppercase">
              MOST POPULAR
            </div>
            <div>
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider font-mono">GOLD CELEBRATION</span>
              <h3 className="text-xl font-bold text-neutral-100 mt-1">Presidential Diamond Cabana</h3>
              <p className="text-2xl font-black text-amber-400 font-mono mt-3">₦150,000</p>
              <p className="text-xs text-neutral-400 mb-6">Minimum spend credit</p>
              
              <ul className="space-y-2 text-xs text-neutral-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400" /> Up to 10 Guests
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400" /> Priority DJ Shoutouts & Sparklers
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400" /> Hennessy VS + Moët Impérial + Chilled Mixers
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400" /> VIP Suya & Pepper Soup Platter
                </li>
              </ul>
            </div>
            <button
              onClick={() => {
                setEventForm(prev => ({ ...prev, package: 'Presidential Diamond Cabana', amount: 150000, numberOfPeople: 10 }));
                setActiveModal('EVENT');
              }}
              className="mt-8 w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs tracking-wider uppercase transition shadow-lg shadow-amber-500/25"
            >
              Reserve Diamond Cabana
            </button>
          </div>

          {/* Card 3 */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider font-mono">ROYAL SUITE</span>
              <h3 className="text-xl font-bold text-neutral-100 mt-1">Full Private Lounge Buyout</h3>
              <p className="text-2xl font-black text-amber-400 font-mono mt-3">₦350,000+</p>
              <p className="text-xs text-neutral-400 mb-6">Custom event package</p>
              
              <ul className="space-y-2 text-xs text-neutral-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400" /> Up to 25 Guests
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400" /> Exclusive Private Bar & Security Guard
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400" /> Free Unlimited Tournament Snooker Table
                </li>
              </ul>
            </div>
            <button
              onClick={() => {
                setEventForm(prev => ({ ...prev, package: 'Full Private Lounge Buyout', amount: 350000, numberOfPeople: 25 }));
                setActiveModal('EVENT');
              }}
              className="mt-8 w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-amber-500 text-white hover:text-black font-bold text-xs transition"
            >
              Request Custom Event
            </button>
          </div>
        </div>
      </section>

      {/* FOOD & GRILL SECTION */}
      <section id="food" className="py-20 bg-neutral-900/50 border-y border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 grid grid-cols-2 gap-4">
              <div className="aspect-square rounded-2xl overflow-hidden border border-neutral-800 shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80"
                  alt="Majestic Suya & Pepper Soup"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden border border-neutral-800 shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80"
                  alt="Grilled Fish and Small Chops"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="text-amber-400 text-xs font-bold uppercase tracking-widest font-mono">NIGHTLIFE KITCHEN & GRILL</span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2 mb-4 font-serif">
                Authentic Nigerian Suya & Small Chops
              </h2>
              <p className="text-neutral-300 text-sm leading-relaxed mb-6">
                Pair your ice-cold lager and fine spirits with our fresh hot grill. Prepared by executive chefs throughout the night until dawn.
              </p>

              <div className="space-y-3">
                <div className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm text-neutral-200">Gombe Special Beef Suya Platter</h4>
                    <p className="text-xs text-neutral-400">Tender sirloin cuts with yaji spice, fresh onions & tomatoes.</p>
                  </div>
                  <span className="font-mono font-bold text-amber-400 text-sm">₦5,000</span>
                </div>

                <div className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm text-neutral-200">Catfish Pepper Soup (Point & Kill)</h4>
                    <p className="text-xs text-neutral-400">Fresh local catfish seasoned with fragrant herbs and peppers.</p>
                  </div>
                  <span className="font-mono font-bold text-amber-400 text-sm">₦7,500</span>
                </div>

                <div className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm text-neutral-200">Majestic VIP Asun & Small Chops Combo</h4>
                    <p className="text-xs text-neutral-400">Spicy roasted goat meat, samosa, spring rolls and puff-puff.</p>
                  </div>
                  <span className="font-mono font-bold text-amber-400 text-sm">₦8,500</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUTDOOR FOUNTAIN COURTYARD & SHISHA PATIO SECTION (Featuring Majestic Lounge Fountain) */}
      <section id="fountain" className="relative py-24 border-t border-neutral-800 overflow-hidden">
        {/* Background Image: Iconic Illuminated Fountain */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={CLUB_IMAGES.fountainNight}
            alt="Majestic Fountain Night Atmosphere"
            className="w-full h-full object-cover opacity-25 filter blur-[0.5px]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/85 to-neutral-950/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                OUTDOOR COURTYARD & FOUNTAIN LOUNGE
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-serif leading-tight">
                Under the Gombe Stars & Neon Waters
              </h2>

              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                Step into our open-air courtyard anchored by our iconic illuminated three-tier water fountain. Surrounded by lush royal landscaping, glowing neon rooflines, and live sports projection screens, it offers the ultimate setting for chilled craft mocktails, cold brews, and premium exotic shisha blends.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-neutral-200">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span><strong>Illuminated Multi-Tier Fountain:</strong> Breathtaking night ambiance with synchronized cyan lighting.</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-200">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <span><strong>Outdoor Shisha Lounge:</strong> Double Apple, Mint, Blueberry & Love 66 prepared with coconut charcoal.</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-200">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span><strong>Social Handles:</strong> Follow our daily video highlights & DJ schedules at <strong className="text-amber-400">@majestic.lounge.g</strong></span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setEventForm(prev => ({ ...prev, package: 'Outdoor Fountain Lounge Table', amount: 50000, numberOfPeople: 4 }));
                    setActiveModal('EVENT');
                  }}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-amber-500/20 transition"
                >
                  Reserve Fountain Courtyard Table
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div 
                onClick={() => setLightboxImage({
                  src: CLUB_IMAGES.fountainNight,
                  title: 'Majestic Lounge Gombe — Outdoor Fountain & Nightlife Courtyard',
                  subtitle: 'Illuminated 3-tier fountain, neon canopy & open-air shisha courtyard (@majestic.lounge.g)',
                  tag: 'Courtyard & Fountain'
                })}
                className="relative group rounded-2xl overflow-hidden border-2 border-amber-500/30 shadow-2xl bg-neutral-900 cursor-pointer aspect-4/3 sm:aspect-16/10"
              >
                <img
                  src={CLUB_IMAGES.fountainNight}
                  alt="Majestic Fountain Night"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">Iconic Feature</span>
                      <h4 className="text-white font-bold text-base">Outdoor Fountain & Courtyard</h4>
                      <p className="text-neutral-400 text-xs">Tap to view high-resolution photo</p>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR DEDICATED HOSPITALITY TEAM (Featuring Reception & Staff Team) */}
      <section id="team" className="relative py-24 bg-neutral-900/80 border-t border-neutral-800 overflow-hidden">
        {/* Subtle Background Watermark */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={CLUB_IMAGES.staffTeam}
            alt="Hospitality Team Background"
            className="w-full h-full object-cover opacity-15 filter blur-[2px]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/90 to-neutral-900" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div 
                onClick={() => setLightboxImage({
                  src: CLUB_IMAGES.staffTeam,
                  title: 'Majestic Club Hospitality & Service Team',
                  subtitle: 'Our dedicated staff in black & gold club attire outside YOU ARE WELCOME Reception',
                  tag: 'Our Team'
                })}
                className="relative group rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl bg-neutral-950 cursor-pointer aspect-4/3"
              >
                <img
                  src={CLUB_IMAGES.staffTeam}
                  alt="Majestic Club Staff Team"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">Welcoming Culture</span>
                      <h4 className="text-white font-bold text-base">Grand Ville & Majestic Staff</h4>
                      <p className="text-neutral-400 text-xs">Tap to view high-resolution photo</p>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold tracking-wider uppercase">
                <Users className="w-3.5 h-3.5" />
                EXECUTIVE HOSPITALITY CULTURE
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-serif leading-tight">
                Warm Welcome. Impeccable Service.
              </h2>

              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                Hospitality is at the heartbeat of everything we do. At Majestic Club Gombe and Grand Ville Hotel, our frontline staff, certified mixologists, table stewards, and security personnel undergo rigorous training to deliver courteous, rapid, and memorable guest experiences.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800">
                  <span className="font-mono font-bold text-lg text-amber-400">20 Refrigerator Leads</span>
                  <p className="text-xs text-neutral-300 mt-1">Dedicated sales personnel assigned to individual refrigerators for swift bottle delivery.</p>
                </div>
                <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800">
                  <span className="font-mono font-bold text-lg text-amber-400">Professional Floor Stewards</span>
                  <p className="text-xs text-neutral-300 mt-1">Attentive table service, sparkler celebrations, and ice bucket replenishment.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MEMBERSHIP PLANS (tiered club membership modeled on Vercel's plan structure) */}
      <MembershipPlans
        onSelectPlan={(planId) => {
          if (planId === 'GUEST') {
            const drinks = document.getElementById('drinks');
            if (drinks) drinks.scrollIntoView({ behavior: 'smooth' });
            return;
          }
          const label = planId === 'GOLD' ? 'Gold Membership' : 'Presidential Elite membership';
          handleWhatsAppChat(
            `Hello Majestic Club, I would like to enquire about joining the ${label}. Please share the details.`
          );
        }}
      />

      {/* GALLERY SHOWCASE (All Official Authentic Photos with Zoom Lightbox) */}
      <section id="gallery" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-amber-400" />
              AUTHENTIC VISUAL GALLERY
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1 font-serif">
              Explore Majestic Club Gombe
            </h2>
            <p className="text-neutral-400 text-sm mt-1">
              Click on any photograph to open the full-resolution inspector.
            </p>
          </div>
          <div className="text-xs text-neutral-400 font-mono">
            {GALLERY_ITEMS.length} Official Photographic Features
          </div>
        </div>

        {/* Responsive Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_ITEMS.map((item) => (
            <div
              key={item.id}
              onClick={() => setLightboxImage({
                src: item.src,
                title: item.title,
                subtitle: item.subtitle,
                tag: item.tag
              })}
              className="group bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-xl cursor-pointer transition duration-300 flex flex-col"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-neutral-950">
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition duration-700"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-amber-400 text-[10px] font-bold font-mono border border-neutral-700 uppercase">
                  {item.tag}
                </span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-amber-500/30 border border-amber-400 flex items-center justify-center text-amber-300 backdrop-blur-md scale-90 group-hover:scale-100 transition duration-300">
                    <Eye className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-neutral-100 text-sm group-hover:text-amber-400 transition">
                    {item.title}
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                    {item.subtitle}
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-neutral-800 flex items-center justify-between text-[11px] text-amber-500/80 font-medium">
                  <span>View High-Res Photo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LOCATION & CONTACT */}
      <section id="contact" className="py-20 bg-neutral-900 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <span className="text-amber-400 text-xs font-bold uppercase tracking-widest font-mono">LOCATION & HOURS</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-6 font-serif">
                Visit Us in Gombe City
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-neutral-300 text-sm">
                  <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <span>Plot 14, Commercial Boulevard, GRA Phase II, Gombe, Gombe State, Nigeria</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-300 text-sm">
                  <Clock className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <span>Tuesday - Sunday: 4:00 PM till Dawn (Closed Mondays for Maintenance)</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-300 text-sm">
                  <Phone className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <span>Reservations Desk: +234 803 555 7777 / +234 802 987 6543</span>
                </div>
              </div>

              {/* Direct WhatsApp Action */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => handleWhatsAppChat('Hello Majestic Club Gombe, I would like to book a VIP table for tonight.')}
                  className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </button>

                <button
                  onClick={() => handleWhatsAppChat('Hello Majestic Club Gombe, I would like to book a Snooker Table.')}
                  className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-sm border border-neutral-700 transition"
                >
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>WhatsApp Snooker Booking</span>
                </button>
              </div>
            </div>

            {/* Interactive Map Visual */}
            <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-base text-neutral-100 mb-2">Majestic Club Gombe Coordinates</h4>
                <p className="text-xs text-neutral-400 mb-4">
                  Easily accessible from Gombe Central Roundabout, GRA, and Airport Road. Secure valet parking available.
                </p>
                <div className="aspect-video w-full rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center p-4 text-center">
                  <div>
                    <MapPin className="w-10 h-10 text-amber-500 mx-auto mb-2 animate-bounce" />
                    <p className="font-mono text-xs text-amber-300">10.2897° N, 11.1673° E</p>
                    <p className="text-[11px] text-neutral-400 mt-1">GRA Phase II • Gombe Metropolis</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-850 flex items-center justify-between text-xs text-neutral-400">
                <span>Direct Taxi Drop-off Zone</span>
                <span className="text-emerald-400 font-semibold">● Open Tonight</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="bg-neutral-950/80 border-t border-neutral-850 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-black font-black">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm tracking-wide text-neutral-200">MAJESTIC CLUB GOMBE</p>
              <p className="text-[10px] text-neutral-400">© 2026 Majestic Club Ltd. All rights reserved. Gombe State, Nigeria.</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-neutral-400">
            <a href="#about" className="hover:text-amber-400">About</a>
            <a href="#drinks" className="hover:text-amber-400">Menu</a>
            <a href="#snooker" className="hover:text-amber-400">Snooker</a>
            <a href="#contact" className="hover:text-amber-400">Contact</a>
            <button
              onClick={onOpenManagementLogin}
              className="text-amber-400 hover:underline font-bold flex items-center gap-1"
            >
              <Lock className="w-3 h-3" /> Management Login
            </button>
          </div>
        </div>
      </footer>

      {/* CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-neutral-900 border-l border-neutral-800 h-full flex flex-col p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-neutral-100">Your Club Pre-Order</h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-16 text-neutral-400">
                  <ShoppingBag className="w-12 h-12 mx-auto text-neutral-600 mb-2" />
                  <p className="text-sm">Your order cart is empty.</p>
                  <p className="text-xs text-neutral-400 mt-1">Browse our chilled drinks menu to select bottles.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.product.id} className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-neutral-200">{item.product.name}</h4>
                      <p className="font-mono text-xs text-amber-400 mt-0.5">
                        {formatNaira(item.product.sellingPrice)} each
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateCartQty(item.product.id, -1)}
                        className="w-7 h-7 rounded bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono font-bold text-sm w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateCartQty(item.product.id, 1)}
                        className="w-7 h-7 rounded bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-neutral-800 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-400">Subtotal</span>
                  <span className="font-mono font-bold text-lg text-amber-400">{formatNaira(cartTotal)}</span>
                </div>
                <button
                  onClick={() => {
                    const summary = cart.map(i => `${i.quantity}x ${i.product.name}`).join(', ');
                    handleWhatsAppChat(`Hello Majestic Club, I would like to order: ${summary}. Total: ${formatNaira(cartTotal)}`);
                    setCart([]);
                    setIsCartOpen(false);
                  }}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Pre-Order to Bar via WhatsApp</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SNOOKER BOOKING MODAL */}
      {activeModal === 'SNOOKER' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Book a Snooker or Pool Table</h3>
                <p className="text-xs text-neutral-400">Double booking prevented automatically</p>
              </div>
            </div>

            <form onSubmit={handleSnookerSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={snookerForm.customerName}
                  onChange={e => setSnookerForm({ ...snookerForm, customerName: e.target.value })}
                  placeholder="e.g. Barrister Yakubu"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">Phone Number (WhatsApp)</label>
                <input
                  type="tel"
                  required
                  value={snookerForm.phone}
                  onChange={e => setSnookerForm({ ...snookerForm, phone: e.target.value })}
                  placeholder="e.g. +234 803 123 4567"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">Select Table</label>
                  <select
                    value={snookerForm.tableId}
                    onChange={e => setSnookerForm({ ...snookerForm, tableId: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {snookerTables.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({formatNaira(t.hourlyPrice)}/hr)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={snookerForm.date}
                    onChange={e => setSnookerForm({ ...snookerForm, date: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">Time Slot</label>
                  <select
                    value={snookerForm.timeSlot}
                    onChange={e => setSnookerForm({ ...snookerForm, timeSlot: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="16:00 - 17:00">16:00 - 17:00</option>
                    <option value="17:00 - 18:00">17:00 - 18:00</option>
                    <option value="18:00 - 19:00">18:00 - 19:00</option>
                    <option value="19:00 - 20:00">19:00 - 20:00</option>
                    <option value="20:00 - 21:00">20:00 - 21:00</option>
                    <option value="21:00 - 22:00">21:00 - 22:00</option>
                    <option value="22:00 - 23:00">22:00 - 23:00</option>
                    <option value="23:00 - 00:00">23:00 - 00:00</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">Players</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={snookerForm.numberOfPlayers}
                    onChange={e => setSnookerForm({ ...snookerForm, numberOfPlayers: parseInt(e.target.value) || 2 })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm rounded-xl transition"
              >
                Confirm Table Reservation
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EVENT & VIP BOOKING MODAL */}
      {activeModal === 'EVENT' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Book VIP Table or Event</h3>
                <p className="text-xs text-neutral-400">Majestic Club Gombe VIP Host Hospitality</p>
              </div>
            </div>

            <form onSubmit={handleEventSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={eventForm.customerName}
                  onChange={e => setEventForm({ ...eventForm, customerName: e.target.value })}
                  placeholder="e.g. Alh. Mustapha Jalo"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">Phone (WhatsApp)</label>
                  <input
                    type="tel"
                    required
                    value={eventForm.phone}
                    onChange={e => setEventForm({ ...eventForm, phone: e.target.value })}
                    placeholder="+234 803 000 0000"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    value={eventForm.email}
                    onChange={e => setEventForm({ ...eventForm, email: e.target.value })}
                    placeholder="guest@mail.com"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">Booking Type</label>
                  <select
                    value={eventForm.type}
                    onChange={e => setEventForm({ ...eventForm, type: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="VIP_TABLE">VIP Table</option>
                    <option value="BIRTHDAY_PARTY">Birthday Celebration</option>
                    <option value="PRIVATE_EVENT">Private Event</option>
                    <option value="CORPORATE_EVENT">Corporate Gathering</option>
                    <option value="CLUB_EVENT">Club Night Host</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">Number of Guests</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={eventForm.numberOfPeople}
                    onChange={e => setEventForm({ ...eventForm, numberOfPeople: parseInt(e.target.value) || 4 })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={eventForm.date}
                    onChange={e => setEventForm({ ...eventForm, date: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">Arrival Time</label>
                  <input
                    type="time"
                    required
                    value={eventForm.time}
                    onChange={e => setEventForm({ ...eventForm, time: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">Package Selection</label>
                <input
                  type="text"
                  value={eventForm.package}
                  onChange={e => setEventForm({ ...eventForm, package: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">Special Requests or Bottle Preferences</label>
                <textarea
                  rows={2}
                  value={eventForm.notes}
                  onChange={e => setEventForm({ ...eventForm, notes: e.target.value })}
                  placeholder="e.g. 2 Bottles of Hennessy on ice, celebration sparklers..."
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex justify-between items-center text-xs">
                <div>
                  <span className="text-neutral-400 block">Total Spend Commitment</span>
                  <span className="font-mono font-bold text-base text-amber-400">{formatNaira(eventForm.amount)}</span>
                </div>
                <div className="text-right">
                  <span className="text-neutral-400 block">40% Deposit</span>
                  <span className="font-mono font-bold text-neutral-200">{formatNaira(Math.round(eventForm.amount * 0.4))}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm rounded-xl transition"
              >
                Submit VIP Reservation
              </button>
            </form>
          </div>
        </div>
      )}

      {/* HOTEL ROOM RESERVATION MODAL */}
      {activeModal === 'HOTEL' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 text-white shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Hotel className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-serif">Reserve Hotel Room or Suite</h3>
                <p className="text-xs text-neutral-400">Majestic Club & Grand Ville Executive Hospitality</p>
              </div>
            </div>

            <form onSubmit={handleHotelSubmit} className="space-y-4">
              {/* Room Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1.5 font-mono">
                  Select Room Type
                </label>
                <select
                  value={hotelForm.roomId}
                  onChange={e => {
                    const r = hotelRooms.find(room => room.id === e.target.value);
                    if (r) {
                      setSelectedRoomForBooking(r);
                      setHotelForm({ ...hotelForm, roomId: r.id });
                    }
                  }}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  {hotelRooms.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.category}) — {formatNaira(r.pricePerNight)} / night
                    </option>
                  ))}
                </select>
              </div>

              {/* Guest Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1 font-mono">Guest Full Name</label>
                  <input
                    type="text"
                    required
                    value={hotelForm.customerName}
                    onChange={e => setHotelForm({ ...hotelForm, customerName: e.target.value })}
                    placeholder="e.g. Barrister Danjuma"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1 font-mono">Phone (WhatsApp)</label>
                  <input
                    type="tel"
                    required
                    value={hotelForm.phone}
                    onChange={e => setHotelForm({ ...hotelForm, phone: e.target.value })}
                    placeholder="+234 803 000 0000"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1 font-mono">Email Address (Optional for confirmation voucher)</label>
                <input
                  type="email"
                  value={hotelForm.email}
                  onChange={e => setHotelForm({ ...hotelForm, email: e.target.value })}
                  placeholder="guest@example.com"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Dates & Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1 font-mono">Check-in Date</label>
                  <input
                    type="date"
                    required
                    value={hotelForm.checkInDate}
                    onChange={e => setHotelForm({ ...hotelForm, checkInDate: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1 font-mono">Check-out Date</label>
                  <input
                    type="date"
                    required
                    value={hotelForm.checkOutDate}
                    onChange={e => setHotelForm({ ...hotelForm, checkOutDate: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1 font-mono">Guests</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedRoomForBooking?.maxGuests || 4}
                    value={hotelForm.numberOfGuests}
                    onChange={e => setHotelForm({ ...hotelForm, numberOfGuests: parseInt(e.target.value) || 1 })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1 font-mono">Special Requests / Late Arrival Notes</label>
                <textarea
                  rows={2}
                  value={hotelForm.specialRequests}
                  onChange={e => setHotelForm({ ...hotelForm, specialRequests: e.target.value })}
                  placeholder="e.g. Chilled Champagne upon arrival, quiet room, late check-in at 2 AM after club session..."
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Pricing summary calculation */}
              {(() => {
                const room = hotelRooms.find(r => r.id === hotelForm.roomId) || selectedRoomForBooking || hotelRooms[0];
                if (!room) return null;
                const start = new Date(hotelForm.checkInDate).getTime();
                const end = new Date(hotelForm.checkOutDate).getTime();
                const nights = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) || 1);
                const total = room.pricePerNight * nights;
                const deposit = Math.round(total * 0.5);

                return (
                  <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-neutral-400">Room Rate ({nights} night{nights > 1 ? 's' : ''} x {formatNaira(room.pricePerNight)})</span>
                      <span className="font-mono font-bold text-neutral-200">{formatNaira(total)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs pt-1 border-t border-neutral-850">
                      <div>
                        <span className="text-amber-400 font-bold block">50% Reservation Deposit</span>
                        <span className="text-[10px] text-neutral-500">Payable via POS, Transfer or Cash at Desk</span>
                      </div>
                      <span className="font-mono font-black text-lg text-amber-400">{formatNaira(deposit)}</span>
                    </div>
                  </div>
                );
              })()}

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-extrabold text-sm rounded-xl uppercase tracking-wider shadow-xl shadow-amber-500/25 transition"
              >
                Confirm Hotel Reservation
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FULLSCREEN VISUAL LIGHTBOX MODAL */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="bg-neutral-900 border border-neutral-700/80 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[92vh]"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-neutral-950/80">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-mono font-bold uppercase border border-amber-500/30">
                  {lightboxImage.tag}
                </span>
                <span className="text-xs text-neutral-400 hidden sm:inline">Majestic Visual Inspector</span>
              </div>
              <button
                onClick={() => setLightboxImage(null)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Body */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px] max-h-[68vh]">
              <img
                src={lightboxImage.src}
                alt={lightboxImage.title}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Modal Caption Footer */}
            <div className="px-5 py-4 bg-neutral-950/90 border-t border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-white font-bold text-base font-serif">{lightboxImage.title}</h3>
                <p className="text-xs text-neutral-400 mt-0.5">{lightboxImage.subtitle}</p>
              </div>
              <button
                onClick={() => setLightboxImage(null)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold rounded-xl transition self-end sm:self-center"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
