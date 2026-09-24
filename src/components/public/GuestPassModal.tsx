import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, X, Check, Calendar, Users, Phone, User, Ticket, MessageCircle, ShieldCheck, ChevronRight, Copy } from 'lucide-react';

interface GuestPassModalProps {
  open: boolean;
  onClose: () => void;
  onConfirmViaWhatsApp: (message: string) => void;
}

interface GuestPassForm {
  fullName: string;
  phone: string;
  visitDate: string;
  partySize: number;
}

interface IssuedPass extends GuestPassForm {
  reference: string;
}

const TODAY = new Date().toISOString().slice(0, 10);

/** Human-friendly guest pass code, e.g. MCG-GP-4X8K2 */
const generateReference = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `MCG-GP-${code}`;
};

const formatDisplayDate = (iso: string): string => {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
};

export const GuestPassModal: React.FC<GuestPassModalProps> = ({ open, onClose, onConfirmViaWhatsApp }) => {
  const [form, setForm] = useState<GuestPassForm>({
    fullName: '',
    phone: '',
    visitDate: TODAY,
    partySize: 2,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof GuestPassForm, string>>>({});
  const [issuedPass, setIssuedPass] = useState<IssuedPass | null>(null);
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const resetAndClose = () => {
    setForm({ fullName: '', phone: '', visitDate: TODAY, partySize: 2 });
    setErrors({});
    setIssuedPass(null);
    setCopied(false);
    onClose();
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof GuestPassForm, string>> = {};
    if (!form.fullName.trim()) next.fullName = 'Please enter your full name';
    const digits = form.phone.replace(/\D/g, '');
    if (digits.length < 10) next.phone = 'Enter a valid phone number';
    if (!form.visitDate) next.visitDate = 'Choose your visit date';
    else if (form.visitDate < TODAY) next.visitDate = 'Visit date cannot be in the past';
    if (form.partySize < 1) next.partySize = 'At least one guest';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIssuedPass({ ...form, reference: generateReference() });
  };

  const handleCopy = async () => {
    if (!issuedPass) return;
    try {
      await navigator.clipboard.writeText(issuedPass.reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — code is still visible on screen */
    }
  };

  const handleConfirm = () => {
    if (!issuedPass) return;
    onConfirmViaWhatsApp(
      `Hello Majestic Club Gombe, I'd like to confirm my FREE Guest Pass.\n\n` +
        `Pass Ref: ${issuedPass.reference}\n` +
        `Name: ${issuedPass.fullName}\n` +
        `Phone: ${issuedPass.phone}\n` +
        `Visit Date: ${formatDisplayDate(issuedPass.visitDate)}\n` +
        `Party Size: ${issuedPass.partySize} guest(s)\n\n` +
        `Please reserve my walk-in access for the night.`
    );
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guest-pass-title"
      onClick={resetAndClose}
    >
      <div
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-amber-500/40 bg-neutral-900 shadow-2xl shadow-amber-500/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-6 py-4 border-b border-neutral-800 bg-gradient-to-r from-amber-500/10 to-neutral-900">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-amber-400 to-yellow-600 text-black">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h2 id="guest-pass-title" className="text-lg font-extrabold text-white font-serif leading-tight">
                Free Guest Pass
              </h2>
              <p className="text-[11px] text-amber-300/80 font-mono uppercase tracking-wide">No membership fee</p>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            aria-label="Close guest pass sign-up"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {issuedPass ? (
          /* ---------- Issued pass confirmation ---------- */
          <div className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center mb-4">
                <Check className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-extrabold text-white font-serif">You&apos;re on the list!</h3>
              <p className="mt-1.5 text-sm text-neutral-400 leading-relaxed">
                Show this pass at the entrance on your visit. Confirm via WhatsApp so our floor team can expect you.
              </p>
            </div>

            {/* Ticket-style pass */}
            <div className="mt-6 rounded-2xl overflow-hidden border border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-neutral-900 to-neutral-900">
              <div className="px-5 py-4 border-b border-dashed border-neutral-700 flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-300">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest font-mono">Majestic Club Gombe</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-black bg-gradient-to-r from-amber-400 to-yellow-500 px-2.5 py-1 rounded-full">
                  Guest
                </span>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] uppercase tracking-wide text-neutral-500 font-mono">Pass Reference</span>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 text-amber-300 hover:text-amber-200 transition"
                  >
                    <span className="text-base font-black tracking-wider">{issuedPass.reference}</span>
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <PassRow icon={<User className="w-4 h-4" />} label="Guest" value={issuedPass.fullName} />
                <PassRow icon={<Phone className="w-4 h-4" />} label="Phone" value={issuedPass.phone} />
                <PassRow icon={<Calendar className="w-4 h-4" />} label="Visit" value={formatDisplayDate(issuedPass.visitDate)} />
                <PassRow icon={<Users className="w-4 h-4" />} label="Party" value={`${issuedPass.partySize} guest(s)`} />
              </div>
            </div>

            <button
              onClick={handleConfirm}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-extrabold text-sm uppercase tracking-wider bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black shadow-xl shadow-amber-500/25 transition"
            >
              <MessageCircle className="w-4 h-4" />
              Confirm via WhatsApp
            </button>
            <button
              onClick={resetAndClose}
              className="mt-3 w-full px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white transition"
            >
              Done
            </button>
          </div>
        ) : (
          /* ---------- Sign-up form ---------- */
          <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Reserve your walk-in access for a single unforgettable night — general floor &amp; bar access, no
              membership fee. Just tell us who&apos;s coming.
            </p>

            <Field label="Full Name" error={errors.fullName} icon={<User className="w-4 h-4" />}>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                placeholder="e.g. Amina Bello"
                className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-500 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-neutral-600 outline-none transition"
              />
            </Field>

            <Field label="Phone Number" error={errors.phone} icon={<Phone className="w-4 h-4" />}>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="e.g. 0803 555 7777"
                className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-500 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-neutral-600 outline-none transition"
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Visit Date" error={errors.visitDate} icon={<Calendar className="w-4 h-4" />}>
                <input
                  type="date"
                  min={TODAY}
                  value={form.visitDate}
                  onChange={(e) => setForm((f) => ({ ...f, visitDate: e.target.value }))}
                  className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-500 rounded-lg pl-9 pr-2 py-2.5 text-sm text-white outline-none transition [color-scheme:dark]"
                />
              </Field>

              <Field label="Party Size" error={errors.partySize} icon={<Users className="w-4 h-4" />}>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={form.partySize}
                  onChange={(e) => setForm((f) => ({ ...f, partySize: Math.max(1, Number(e.target.value) || 1) }))}
                  className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-500 rounded-lg pl-9 pr-2 py-2.5 text-sm text-white outline-none transition"
                />
              </Field>
            </div>

            <button
              type="submit"
              className="mt-2 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-extrabold text-sm uppercase tracking-wider bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black shadow-xl shadow-amber-500/25 transition"
            >
              <span>Get My Guest Pass</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-center text-[11px] text-neutral-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Free to reserve. You only ever pay for what you order on the night.</span>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
};

const Field: React.FC<{
  label: string;
  error?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ label, error, icon, children }) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-1.5">{label}</label>
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">{icon}</span>
      {children}
    </div>
    {error && <p className="mt-1 text-[11px] text-red-400">{error}</p>}
  </div>
);

const PassRow: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center justify-between gap-3">
    <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wide text-neutral-500 font-mono">
      <span className="text-amber-400/70">{icon}</span>
      {label}
    </span>
    <span className="text-sm font-semibold text-white text-right">{value}</span>
  </div>
);
