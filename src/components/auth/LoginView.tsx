import React, { useState } from 'react';
import { StaffMember } from '../../types';
import { Crown, Lock, ShieldCheck, User, Users, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';
import { CLUB_IMAGES } from '../../assets/clubImages';

interface LoginViewProps {
  staffList: StaffMember[];
  onLogin: (staff: StaffMember) => void;
  onBackToWebsite: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  staffList,
  onLogin,
  onBackToWebsite
}) => {
  const [selectedStaffId, setSelectedStaffId] = useState<string>(staffList[0]?.id || '');
  const [pinCode, setPinCode] = useState('1234');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Group staff members by management vs sales staff
  const executiveStaff = staffList.filter(s => s.role !== 'sales_staff');
  const salesGirls = staffList.filter(s => s.role === 'sales_staff');

  const handleQuickLogin = (staff: StaffMember) => {
    onLogin(staff);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const staff = staffList.find(s => s.id === selectedStaffId);
    if (!staff) {
      setErrorMsg('Please select an authorized user account.');
      return;
    }
    // In production, validates against hashed pin / Supabase auth
    onLogin(staff);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Authentic Background: Grand Ville & Majestic Staff Team */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={CLUB_IMAGES.staffTeam}
          alt="Majestic Staff Background"
          className="w-full h-full object-cover opacity-20 filter blur-[2px] scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/90 to-neutral-950/60" />
      </div>

      {/* Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-amber-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-xl w-full relative z-10 space-y-6">
        {/* Back link */}
        <button
          onClick={onBackToWebsite}
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-amber-400 transition mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Majestic Club Public Website</span>
        </button>

        {/* Card Header */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center space-y-2 mb-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 via-amber-600 to-yellow-700 flex items-center justify-center text-black shadow-lg shadow-amber-500/20">
              <Crown className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-2xl font-serif font-black tracking-wide text-white">
              MAJESTIC CLUB GOMBE
            </h1>
            <p className="text-xs uppercase font-mono tracking-widest text-amber-400 font-bold">
              Secure Staff & Management System
            </p>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Role-Based Access Control for Owners, General Managers, Bar Managers & 20 Sales Staff.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-200 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-bold text-neutral-400 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Select User Account</span>
              </label>
              <select
                value={selectedStaffId}
                onChange={e => setSelectedStaffId(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-3 text-sm text-amber-300 font-medium focus:outline-none focus:border-amber-500 transition"
              >
                <optgroup label="Executive & Management (Full Control)">
                  {executiveStaff.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {s.role.replace('_', ' ').toUpperCase()} ({s.staffCode})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="20 Sales Staff (Individual Refrigerator Portals)">
                  {salesGirls.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} → {s.assignedRefrigeratorId} ({s.staffCode})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-neutral-400 mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Access PIN / Password</span>
              </label>
              <input
                type="password"
                value={pinCode}
                onChange={e => setPinCode(e.target.value)}
                placeholder="Enter 4-digit PIN"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-3 text-sm text-white font-mono tracking-widest focus:outline-none focus:border-amber-500 transition"
              />
              <span className="text-[10px] text-neutral-500 mt-1 block">
                Demo environment: Any PIN is accepted for instant evaluation.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm rounded-xl uppercase tracking-wider transition shadow-lg shadow-amber-500/25 active:scale-98"
            >
              Sign In to Majestic Portal
            </button>
          </form>

          {/* 1-Click Fast Role Switcher */}
          <div className="mt-8 pt-6 border-t border-neutral-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-bold text-neutral-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>1-Click Instant Demo Login:</span>
              </span>
            </div>

            {/* Quick click pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin(staffList.find(s => s.role === 'owner') || staffList[0])}
                className="p-2 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-left transition group"
              >
                <div className="text-[10px] text-amber-400 font-bold uppercase font-mono">Owner</div>
                <div className="text-xs font-semibold text-neutral-200 group-hover:text-white line-clamp-1">Chief Buba</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin(staffList.find(s => s.role === 'general_manager') || staffList[0])}
                className="p-2 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-left transition group"
              >
                <div className="text-[10px] text-amber-400 font-bold uppercase font-mono">General Mgr</div>
                <div className="text-xs font-semibold text-neutral-200 group-hover:text-white line-clamp-1">Malam Aliyu</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin(staffList.find(s => s.role === 'stock_manager') || staffList[0])}
                className="p-2 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-left transition group"
              >
                <div className="text-[10px] text-amber-400 font-bold uppercase font-mono">Stock Mgr</div>
                <div className="text-xs font-semibold text-neutral-200 group-hover:text-white line-clamp-1">Danladi Hassan</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin(staffList.find(s => s.assignedRefrigeratorId === 'FR-007') || salesGirls[6] || salesGirls[0])}
                className="p-2 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-left transition group border-l-2 border-l-amber-500"
              >
                <div className="text-[10px] text-amber-400 font-bold uppercase font-mono">Sales Girl 07</div>
                <div className="text-xs font-semibold text-neutral-200 group-hover:text-white line-clamp-1">FR-007 Portal</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin(staffList.find(s => s.assignedRefrigeratorId === 'FR-001') || salesGirls[0])}
                className="p-2 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-left transition group border-l-2 border-l-amber-500"
              >
                <div className="text-[10px] text-amber-400 font-bold uppercase font-mono">Sales Girl 01</div>
                <div className="text-xs font-semibold text-neutral-200 group-hover:text-white line-clamp-1">FR-001 Portal</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin(staffList.find(s => s.role === 'auditor') || staffList[0])}
                className="p-2 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-left transition group"
              >
                <div className="text-[10px] text-amber-400 font-bold uppercase font-mono">Auditor</div>
                <div className="text-xs font-semibold text-neutral-200 group-hover:text-white line-clamp-1">Suleiman Garba</div>
              </button>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-3 bg-neutral-900/60 border border-neutral-800/80 rounded-2xl flex items-center justify-center gap-2 text-xs text-neutral-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Every transaction generates an immutable ledger hash and audit log entry.</span>
        </div>
      </div>
    </div>
  );
};
