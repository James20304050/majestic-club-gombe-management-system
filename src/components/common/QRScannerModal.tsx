import React, { useState } from 'react';
import { QrCode, X, Sparkles, CheckCircle2, ScanLine } from 'lucide-react';
import { Product } from '../../types';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanResult: (code: string, parsedType: 'product' | 'refrigerator' | 'table' | 'location' | 'unknown', meta?: any) => void;
  products: Product[];
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onScanResult,
  products
}) => {
  const [manualCode, setManualCode] = useState('');
  const [scanStatus, setScanStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleProcessCode = (scanned: string) => {
    const raw = scanned.trim().toUpperCase();
    let type: 'product' | 'refrigerator' | 'table' | 'location' | 'unknown' = 'unknown';
    let meta: any = null;

    if (raw.startsWith('FR-') || raw.startsWith('FR0') || raw.startsWith('FR1') || raw.startsWith('FR2')) {
      type = 'refrigerator';
      const cleanFridge = raw.replace('FR', 'FR-').replace('FR--', 'FR-');
      meta = { refrigeratorId: cleanFridge };
    } else if (raw.startsWith('TABLE-') || raw.startsWith('TBL-') || raw.startsWith('T-')) {
      type = 'table';
      const num = raw.replace(/\D/g, '');
      meta = { tableNumber: `TABLE-${num.padStart(3, '0')}`, displayNum: num };
    } else if (raw.startsWith('LOC-')) {
      type = 'location';
      meta = { locationCode: raw };
    } else {
      // Check if product code
      const matchedProd = products.find(p => p.code.toUpperCase() === raw || p.qrCode.toUpperCase() === raw || p.barcode === raw);
      if (matchedProd) {
        type = 'product';
        meta = matchedProd;
      } else {
        type = 'unknown';
      }
    }

    setScanStatus(`Scanned: ${raw} (${type.toUpperCase()})`);
    setTimeout(() => {
      onScanResult(raw, type, meta);
      onClose();
    }, 600);
  };

  const sampleShortcuts = [
    { label: 'Life Beer (LIFE-001)', code: 'LIFE-001', type: 'Product' },
    { label: 'Heineken (HEIN-001)', code: 'HEIN-001', type: 'Product' },
    { label: 'Table Water (WATR-001)', code: 'WATR-001', type: 'Product' },
    { label: 'Table 25 (TABLE-025)', code: 'TABLE-025', type: 'Table' },
    { label: 'Table 12 (TABLE-012)', code: 'TABLE-012', type: 'Table' },
    { label: 'Fridge 07 (FR-007)', code: 'FR-007', type: 'Fridge' },
    { label: 'Fridge 01 (FR-001)', code: 'FR-001', type: 'Fridge' },
    { label: 'Main Store (LOC-STORE)', code: 'LOC-STORE', type: 'Location' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-100">QR / Barcode Scanner</h3>
            <p className="text-xs text-neutral-400">Scan Product, Refrigerator, or Table QR Code</p>
          </div>
        </div>

        {/* Viewfinder simulation */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-neutral-950 border-2 border-dashed border-amber-500/50 flex flex-col items-center justify-center p-4 my-4">
          <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)] animate-pulse" />
          <ScanLine className="w-16 h-16 text-amber-400/40 animate-bounce duration-1000 mb-2" />
          <p className="text-xs text-center text-neutral-400 font-mono">
            {scanStatus ? (
              <span className="text-emerald-400 font-bold flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> {scanStatus}
              </span>
            ) : (
              'Point camera at QR code or pick a test code below'
            )}
          </p>
        </div>

        {/* Manual Input */}
        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
            Or Type Code / Barcode Number
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="e.g. LIFE-001 or FR-007 or TABLE-025"
              className="flex-1 bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              onKeyDown={(e) => e.key === 'Enter' && manualCode && handleProcessCode(manualCode)}
            />
            <button
              onClick={() => manualCode && handleProcessCode(manualCode)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm rounded-xl transition"
            >
              Verify
            </button>
          </div>
        </div>

        {/* Quick Test QR Buttons */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Fast Hardware Scanner Simulation (Click to Trigger)</span>
          </div>
          <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
            {sampleShortcuts.map((item) => (
              <button
                key={item.code}
                onClick={() => handleProcessCode(item.code)}
                className="text-left px-3 py-2 bg-neutral-950/80 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500/50 rounded-xl text-xs transition group"
              >
                <div className="font-semibold text-neutral-200 group-hover:text-amber-400 flex items-center justify-between">
                  <span>{item.code}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                    {item.type}
                  </span>
                </div>
                <div className="text-[11px] text-neutral-400 truncate">{item.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
