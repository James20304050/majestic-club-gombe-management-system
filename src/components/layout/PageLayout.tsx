import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { CLUB_IMAGES } from '../../assets/clubImages';

export type PageSectionId = 
  | 'hero' 
  | 'about' 
  | 'drinks' 
  | 'snooker' 
  | 'vip' 
  | 'hotel'
  | 'events' 
  | 'fountain' 
  | 'team' 
  | 'gallery' 
  | 'contact' 
  | 'login' 
  | 'sales_portal' 
  | 'manager_dashboard'
  | 'custom';

export interface SectionBackgroundConfig {
  image: string;
  alt: string;
  overlayOpacity?: number; // 0 to 1
  accentGlow?: 'gold' | 'cyan' | 'emerald' | 'amber' | 'purple';
  blur?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  title?: string;
}

// Section to Image mappings with custom nightclub atmospheres
export const DEFAULT_SECTION_BACKGROUNDS: Record<PageSectionId, SectionBackgroundConfig> = {
  hero: {
    image: CLUB_IMAGES.masterPoster,
    alt: 'Majestic Club Gombe Official Grand Wall Artwork & Master Showcase',
    overlayOpacity: 0.65,
    accentGlow: 'gold',
    blur: 'none',
    title: 'Majestic Club Gombe • Official Grand Lounge'
  },
  about: {
    image: CLUB_IMAGES.staffTeam,
    alt: 'Majestic Club Hospitality Team at Reception',
    overlayOpacity: 0.82,
    accentGlow: 'amber',
    blur: 'md',
    title: 'Hospitality & Heritage'
  },
  drinks: {
    image: CLUB_IMAGES.drinksVip,
    alt: 'Luxury Bottle Service & Chilled Cellar Lineup',
    overlayOpacity: 0.78,
    accentGlow: 'gold',
    blur: 'sm',
    title: 'VIP Drinks & Bottle Service'
  },
  snooker: {
    image: CLUB_IMAGES.snookerVip,
    alt: 'Championship Snooker & Billiards Arena',
    overlayOpacity: 0.80,
    accentGlow: 'emerald',
    blur: 'sm',
    title: 'Snooker & Pool Arena'
  },
  vip: {
    image: CLUB_IMAGES.drinksVip,
    alt: 'Platinum & Gold VIP Lounges',
    overlayOpacity: 0.75,
    accentGlow: 'gold',
    blur: 'md',
    title: 'Exclusive VIP Experience'
  },
  hotel: {
    image: CLUB_IMAGES.staffTeam,
    alt: 'Grand Ville Hotel & Suites Reception',
    overlayOpacity: 0.80,
    accentGlow: 'amber',
    blur: 'sm',
    title: 'Hotel Rooms & Luxury Suites'
  },
  events: {
    image: CLUB_IMAGES.fountainNight,
    alt: 'Nightlife Events & Weekend Showcases',
    overlayOpacity: 0.75,
    accentGlow: 'cyan',
    blur: 'sm',
    title: 'Club Events & Nightlife'
  },
  fountain: {
    image: CLUB_IMAGES.fountainNight,
    alt: 'Illuminated 3-Tier Outdoor Water Fountain',
    overlayOpacity: 0.70,
    accentGlow: 'cyan',
    blur: 'none',
    title: 'Outdoor Fountain & Patio'
  },
  team: {
    image: CLUB_IMAGES.staffTeam,
    alt: 'Our Dedicated Management & Service Team',
    overlayOpacity: 0.80,
    accentGlow: 'amber',
    blur: 'md',
    title: 'Our Dedicated Team'
  },
  gallery: {
    image: CLUB_IMAGES.systemMockup,
    alt: 'Majestic Club Visual Showcase',
    overlayOpacity: 0.85,
    accentGlow: 'purple',
    blur: 'lg',
    title: 'Visual Gallery & Media'
  },
  contact: {
    image: CLUB_IMAGES.fountainNight,
    alt: 'Majestic Club Gombe Location & Entry',
    overlayOpacity: 0.85,
    accentGlow: 'gold',
    blur: 'md',
    title: 'Visit & Connect'
  },
  login: {
    image: CLUB_IMAGES.staffTeam,
    alt: 'Grand Ville & Majestic Security Gateway',
    overlayOpacity: 0.82,
    accentGlow: 'gold',
    blur: 'md',
    title: 'Management Security Access'
  },
  sales_portal: {
    image: CLUB_IMAGES.drinksVip,
    alt: 'POS Handheld & Refrigerator Station',
    overlayOpacity: 0.88,
    accentGlow: 'emerald',
    blur: 'lg',
    title: 'Sales Staff POS Terminal'
  },
  manager_dashboard: {
    image: CLUB_IMAGES.systemMockup,
    alt: 'Majestic Management & Fleet Operations',
    overlayOpacity: 0.90,
    accentGlow: 'gold',
    blur: 'xl',
    title: 'Executive Management Dashboard'
  },
  custom: {
    image: CLUB_IMAGES.fountainNight,
    alt: 'Majestic Experience Atmosphere',
    overlayOpacity: 0.80,
    accentGlow: 'gold',
    blur: 'md',
    title: 'Majestic Club Gombe'
  }
};

interface PageLayoutContextType {
  activeSection: PageSectionId;
  setActiveSection: (section: PageSectionId) => void;
  registerSection: (id: string, sectionKey: PageSectionId) => () => void;
  currentConfig: SectionBackgroundConfig;
}

const PageLayoutContext = createContext<PageLayoutContextType | null>(null);

export const usePageLayout = () => {
  const context = useContext(PageLayoutContext);
  if (!context) {
    throw new Error('usePageLayout must be used within a PageLayout');
  }
  return context;
};

export interface PageLayoutProps {
  children: React.ReactNode;
  /** Initial or fixed section type */
  initialSection?: PageSectionId;
  /** Override background image directly */
  customBgImage?: string;
  /** Enable dynamic automatic section tracking on scroll */
  enableScrollSpy?: boolean;
  /** Show subtle active section badge in corner */
  showSectionBadge?: boolean;
  /** Custom overlay opacity class e.g. 'bg-neutral-950/80' */
  overlayClassName?: string;
  /** Optional extra classes on outer container */
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  initialSection = 'hero',
  customBgImage,
  enableScrollSpy = true,
  showSectionBadge = false,
  overlayClassName,
  className = ''
}) => {
  const [activeSection, setActiveSection] = useState<PageSectionId>(initialSection);
  const sectionRegistryRef = useRef<Map<string, PageSectionId>>(new Map());

  // Allow custom override
  const currentConfig: SectionBackgroundConfig = customBgImage
    ? {
        image: customBgImage,
        alt: 'Majestic Club Atmosphere',
        overlayOpacity: 0.8,
        accentGlow: 'gold',
        blur: 'md'
      }
    : DEFAULT_SECTION_BACKGROUNDS[activeSection] || DEFAULT_SECTION_BACKGROUNDS.hero;

  // Register elements for scroll detection
  const registerSection = (elementId: string, sectionKey: PageSectionId) => {
    sectionRegistryRef.current.set(elementId, sectionKey);
    return () => {
      sectionRegistryRef.current.delete(elementId);
    };
  };

  // ScrollSpy with IntersectionObserver
  useEffect(() => {
    if (!enableScrollSpy) return;

    const registeredEntries = Array.from(sectionRegistryRef.current.entries());
    if (registeredEntries.length === 0) {
      // Default common section IDs fallback
      const commonSections: { id: string; key: PageSectionId }[] = [
        { id: 'hero', key: 'hero' },
        { id: 'about', key: 'about' },
        { id: 'drinks', key: 'drinks' },
        { id: 'snooker', key: 'snooker' },
        { id: 'vip', key: 'vip' },
        { id: 'hotel', key: 'hotel' },
        { id: 'events', key: 'events' },
        { id: 'fountain', key: 'fountain' },
        { id: 'team', key: 'team' },
        { id: 'gallery', key: 'gallery' },
        { id: 'contact', key: 'contact' }
      ];

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
              const matched = commonSections.find((s) => s.id === entry.target.id);
              if (matched) {
                setActiveSection(matched.key);
              }
            }
          });
        },
        {
          rootMargin: '-10% 0px -40% 0px',
          threshold: [0.25, 0.5]
        }
      );

      commonSections.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });

      return () => observer.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
            const mappedKey = sectionRegistryRef.current.get(entry.target.id);
            if (mappedKey) {
              setActiveSection(mappedKey);
            }
          }
        });
      },
      {
        rootMargin: '-15% 0px -35% 0px',
        threshold: [0.25, 0.5]
      }
    );

    registeredEntries.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [enableScrollSpy]);

  // Glow color helper
  const getGlowStyles = (glow?: string) => {
    switch (glow) {
      case 'cyan':
        return 'from-cyan-500/15 via-blue-600/5 to-transparent';
      case 'emerald':
        return 'from-emerald-500/15 via-teal-600/5 to-transparent';
      case 'purple':
        return 'from-purple-500/15 via-indigo-600/5 to-transparent';
      case 'amber':
        return 'from-amber-600/20 via-yellow-700/5 to-transparent';
      case 'gold':
      default:
        return 'from-amber-500/20 via-yellow-600/5 to-transparent';
    }
  };

  // Blur helper for backdrop
  const getBlurClass = (blur?: string) => {
    switch (blur) {
      case 'none':
        return 'backdrop-blur-none';
      case 'sm':
        return 'backdrop-blur-xs sm:backdrop-blur-sm';
      case 'md':
        return 'backdrop-blur-sm sm:backdrop-blur-md';
      case 'lg':
        return 'backdrop-blur-md sm:backdrop-blur-lg';
      case 'xl':
        return 'backdrop-blur-lg sm:backdrop-blur-xl';
      case '2xl':
      case '3xl':
        return 'backdrop-blur-xl sm:backdrop-blur-2xl';
      default:
        return 'backdrop-blur-sm';
    }
  };

  // Unique collection of distinct images for smooth cross-fading
  const availableImages = [
    CLUB_IMAGES.fountainNight,
    CLUB_IMAGES.drinksVip,
    CLUB_IMAGES.staffTeam,
    CLUB_IMAGES.snookerVip,
    CLUB_IMAGES.systemMockup
  ];

  return (
    <PageLayoutContext.Provider
      value={{
        activeSection,
        setActiveSection,
        registerSection,
        currentConfig
      }}
    >
      <div className={`relative min-h-screen bg-neutral-950 text-neutral-100 ${className}`}>
        {/* ========================================================================= */}
        {/* FIXED LUXURY NIGHTCLUB BACKGROUND ENGINE (Cross-fading with dark contrast) */}
        {/* ========================================================================= */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
          {/* Layer of cross-fading images */}
          {availableImages.map((imgSrc, idx) => {
            const isCurrent = currentConfig.image === imgSrc;
            return (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isCurrent ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={imgSrc}
                  alt={currentConfig.alt}
                  className="w-full h-full object-cover object-center scale-105 transform motion-safe:transition-transform motion-safe:duration-10000"
                  referrerPolicy="no-referrer"
                />
              </div>
            );
          })}

          {/* Deep Dark-Mode Contrast Vignette Layers */}
          <div 
            className={`absolute inset-0 bg-neutral-950 transition-opacity duration-1000 ${
              overlayClassName || ''
            }`}
            style={{
              opacity: overlayClassName ? undefined : currentConfig.overlayOpacity ?? 0.82
            }}
          />

          {/* Top & Bottom Cinematic Edge Gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-transparent to-neutral-950 pointer-events-none" />

          {/* Dynamic Radial Ambient Spotlight (changes with active section) */}
          <div 
            className={`absolute inset-0 bg-radial transition-all duration-1000 ${getGlowStyles(
              currentConfig.accentGlow
            )}`} 
          />

          {/* Tailwind Backdrop-Blur Glassmorphism Filter */}
          <div
            className={`absolute inset-0 transition-all duration-700 ${getBlurClass(
              currentConfig.blur
            )}`}
          />

          {/* Subtle Film Grain / Nightclub Texture Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
        </div>

        {/* Section Indicator Badge (Optional Floating Nightclub HUD) */}
        {showSectionBadge && (
          <div className="fixed bottom-4 left-4 z-40 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-700/80 backdrop-blur-md shadow-2xl text-[11px] font-mono text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="uppercase text-amber-400 font-bold">{activeSection}</span>
            <span className="text-neutral-500">•</span>
            <span className="truncate max-w-[140px] text-neutral-300">{currentConfig.title}</span>
          </div>
        )}

        {/* Main Content Layer (Rendered on top with pure dark mode contrast) */}
        <div className="relative z-10 w-full min-h-screen flex flex-col">
          {children}
        </div>
      </div>
    </PageLayoutContext.Provider>
  );
};

/**
 * Section Helper Component:
 * Wraps any section and automatically registers it with the PageLayout
 * so scrolling into this section smoothly transitions the background image!
 */
export interface PageSectionProps extends React.HTMLAttributes<HTMLElement> {
  id: string;
  sectionKey: PageSectionId;
  children: React.ReactNode;
  /** Extra glassmorphism or backdrop styling */
  backdrop?: boolean;
}

export const PageSection: React.FC<PageSectionProps> = ({
  id,
  sectionKey,
  children,
  backdrop = false,
  className = '',
  ...props
}) => {
  const { registerSection } = usePageLayout();

  useEffect(() => {
    const unregister = registerSection(id, sectionKey);
    return unregister;
  }, [id, sectionKey, registerSection]);

  return (
    <section
      id={id}
      className={`relative w-full ${
        backdrop ? 'backdrop-blur-md bg-neutral-950/40 border-y border-neutral-800/60' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </section>
  );
};
