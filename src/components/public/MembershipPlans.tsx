import React from 'react';
import { Crown, Check, Sparkles, Star, ShieldCheck, ChevronRight } from 'lucide-react';
import { formatNaira } from '../../utils/helpers';

interface MembershipPlan {
  id: 'GUEST' | 'GOLD' | 'PRESIDENTIAL';
  name: string;
  tagline: string;
  priceLabel: string;
  priceSub: string;
  highlight: boolean;
  icon: React.ReactNode;
  features: string[];
  cta: string;
}

/**
 * Club membership tiers modeled on Vercel's three-plan structure
 * (Hobby / Pro / Enterprise): a free base tier, a flexible paid tier
 * with enhanced perks, and a custom high-touch tier with dedicated support.
 */
const PLANS: MembershipPlan[] = [
  {
    id: 'GUEST',
    name: 'Guest Pass',
    tagline: 'For first-time visitors and casual nights out',
    priceLabel: 'Free',
    priceSub: 'No membership fee',
    highlight: false,
    icon: <Sparkles className="w-6 h-6" />,
    features: [
      'General floor & bar access',
      'Standard drinks menu ordering',
      'Walk-in snooker & pool (subject to availability)',
      'Access to public events',
      'Pay-as-you-go on all bookings',
    ],
    cta: 'Visit as a Guest',
  },
  {
    id: 'GOLD',
    name: 'Gold Membership',
    tagline: 'For regulars who want priority and better value',
    priceLabel: formatNaira(150000),
    priceSub: 'per year',
    highlight: true,
    icon: <Star className="w-6 h-6" />,
    features: [
      'Everything in Guest Pass',
      'Priority table & VIP cabana reservations',
      'Members credit wallet with 10% bonus value',
      '15% off drinks, grill & hotel rooms',
      'Skip-the-line entry on event nights',
      'Dedicated WhatsApp booking line',
    ],
    cta: 'Become a Gold Member',
  },
  {
    id: 'PRESIDENTIAL',
    name: 'Presidential Elite',
    tagline: 'For VIPs, corporates and dignitaries',
    priceLabel: 'Custom',
    priceSub: 'Tailored annual package',
    highlight: false,
    icon: <Crown className="w-6 h-6" />,
    features: [
      'Everything in Gold Membership',
      'Reserved Presidential Diamond VIP cabana',
      'Personal hospitality host & concierge',
      'Guaranteed hotel suite availability',
      'Bespoke event & corporate packages',
      'Priority support with response guarantees',
    ],
    cta: 'Talk to Our Concierge',
  },
];

interface MembershipPlansProps {
  onSelectPlan: (planId: MembershipPlan['id']) => void;
}

export const MembershipPlans: React.FC<MembershipPlansProps> = ({ onSelectPlan }) => {
  return (
    <section id="membership" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Section heading */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-amber-400 text-xs font-bold uppercase tracking-widest font-mono inline-flex items-center gap-1.5 justify-center">
          <Crown className="w-4 h-4 text-amber-400" />
          MEMBERSHIP PLANS
        </span>
        <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold text-white font-serif tracking-tight">
          Choose Your{' '}
          <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
            Majestic Tier
          </span>
        </h2>
        <p className="mt-4 text-neutral-300 text-base sm:text-lg font-light leading-relaxed">
          From a free guest pass for a single unforgettable night to a fully bespoke elite package with a
          dedicated host — every tier is designed to match how you enjoy the Majestic Club.
        </p>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative flex flex-col rounded-2xl border p-8 transition duration-300 ${
              plan.highlight
                ? 'border-amber-500/70 bg-gradient-to-b from-amber-500/10 to-neutral-900 shadow-2xl shadow-amber-500/20 lg:-translate-y-3'
                : 'border-neutral-800 bg-neutral-900/60 hover:border-amber-500/40'
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-[11px] font-extrabold uppercase tracking-wider shadow-lg">
                Most Popular
              </div>
            )}

            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                plan.highlight
                  ? 'bg-gradient-to-br from-amber-400 to-yellow-600 text-black'
                  : 'bg-neutral-800 text-amber-400 border border-neutral-700'
              }`}
            >
              {plan.icon}
            </div>

            <h3 className="text-2xl font-extrabold text-white font-serif">{plan.name}</h3>
            <p className="mt-2 text-sm text-neutral-400 leading-relaxed min-h-[2.5rem]">{plan.tagline}</p>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-4xl font-black text-white tracking-tight">{plan.priceLabel}</span>
            </div>
            <p className="text-xs text-neutral-500 mt-1 font-mono uppercase tracking-wide">{plan.priceSub}</p>

            <button
              onClick={() => onSelectPlan(plan.id)}
              className={`mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm uppercase tracking-wider transition ${
                plan.highlight
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black shadow-xl shadow-amber-500/25'
                  : 'bg-neutral-800 hover:bg-amber-500 hover:text-black text-amber-300 border border-neutral-700 hover:border-amber-400'
              }`}
            >
              <span>{plan.cta}</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <ul className="mt-8 space-y-3.5">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-neutral-300">
                  <Check
                    className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      plan.highlight ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Reassurance footnote, echoing the "always-on / no downtime" billing note */}
      <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 text-center text-sm text-neutral-400">
        <ShieldCheck className="w-5 h-5 text-amber-400" />
        <span>
          Upgrade, downgrade or pause your membership anytime. No hidden charges — you only ever pay for what
          you book.
        </span>
      </div>
    </section>
  );
};
