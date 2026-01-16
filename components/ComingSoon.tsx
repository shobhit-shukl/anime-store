'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Chakra_Petch, Outfit, Rajdhani } from 'next/font/google';
import { Youtube, Instagram, Twitter } from 'lucide-react';

/* ---------------- FONTS ---------------- */

const orcus = Chakra_Petch({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-orcus',
});

const sirukota = Outfit({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-sirukota',
});

const flare = Rajdhani({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-flare',
});

/* ---------------- LOTTIE ---------------- */

const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
});

/* ---------------- TYPES ---------------- */

interface ComingSoonProps {
  webBannerUrl: string;
  mobileVideoUrl: string;
  desktopAnimationUrl: string;
  mobileAnimationUrl: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/* ---------------- CONSTANTS ---------------- */

const TARGET_DATE = new Date('2026-02-14T06:00:00+05:30').getTime();

const calculateTimeLeft = (): TimeLeft => {
  const diff = TARGET_DATE - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

/* ================= COMPONENT ================= */

export default function ComingSoon({
  webBannerUrl,
  mobileVideoUrl,
  desktopAnimationUrl,
  mobileAnimationUrl,
}: ComingSoonProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [animationData, setAnimationData] = useState<any>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const [isLive, setIsLive] = useState(false);

  /* ---- Device detection ---- */
  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  /* ---- Load animation ---- */
  useEffect(() => {
    if (isMobile === null) return;

    (async () => {
      try {
        const url = isMobile ? mobileAnimationUrl : desktopAnimationUrl;
        const res = await fetch(url);
        setAnimationData(await res.json());
      } catch {
        setShowFallback(false);
      }
    })();
  }, [isMobile, mobileAnimationUrl, desktopAnimationUrl]);

  /* ---- Video fallback ---- */
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      if (!isVideoLoaded) setShowFallback(true);
    }, 3000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isVideoLoaded]);

  /* ---- Countdown ---- */
  useEffect(() => {
    const interval = setInterval(() => {
      const next = calculateTimeLeft();
      setTimeLeft(next);
      if (Date.now() >= TARGET_DATE) {
        setIsLive(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (isMobile === null) return <div className="h-dvh w-full bg-black" />;

  return (
    <div
      className={`relative h-dvh w-full overflow-hidden bg-black text-white
      ${orcus.variable} ${sirukota.variable} ${flare.variable}`}
    >
      {/* ---------------- BACKGROUND ---------------- */}

      <video
        className={`absolute inset-0 z-10 h-full w-full object-cover transition-opacity duration-700 ${
          isVideoLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        autoPlay
        muted
        loop
        playsInline
        onLoadedData={() => setIsVideoLoaded(true)}
        onError={() => setShowFallback(true)}
      >
        <source src={mobileVideoUrl} media="(max-width: 767px)" />
        <source src={webBannerUrl} />
      </video>

      {showFallback && animationData && (
        <div className="absolute inset-0 z-0">
          <Lottie animationData={animationData} loop className="h-full w-full" />
        </div>
      )}

      {!isVideoLoaded && !showFallback && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-[#ef6b24]/30 border-t-[#ef6b24]" />
        </div>
      )}

      {/* ---------------- OVERLAYS ---------------- */}

      <div className="absolute inset-0 z-10 bg-black/30 md:bg-linear-to-r md:from-black/95 md:via-black/40 md:to-transparent" />
      <div className="absolute inset-0 z-10 bg-linear-to-b from-black/50 via-transparent to-black/80" />

      {/* ---------------- LOGO ---------------- */}

      <div className="fixed left-3 top-3 z-50 md:right-12 md:left-auto md:top-8">
        <div className="">
        {/* <div className="rounded-lg bg-white/90 p-1.5 shadow-xl backdrop-blur-md"> */}
          <Image
            src="/logo.png"
            alt="Slice Meow"
            width={96}
            height={96}
            priority
            sizes="(min-width: 768px) 64px, 36px"
            className="w-9 md:w-16 h-auto"
          />
        </div>
      </div>

      {/* ---------------- CONTENT ---------------- */}

      <div className="relative z-30 flex min-h-screen flex-col items-center md:items-start justify-start md:justify-center px-5 md:px-24 lg:px-32 pt-28 md:pt-0 text-center md:text-left">
        <div className="max-w-4xl space-y-6 animate-fade-in-up">
          <h1 className="font-(family-name:--font-orcus) font-bold uppercase leading-tight text-[clamp(2.2rem,8vw,3.2rem)] md:text-8xl">
            ENTER THE NEXT ERA
            <br />
            <span className="text-[#ef6b24]">OF INDIAN ANIME</span>
          </h1>

          <p className="font-(family-name:--font-sirukota) max-w-2xl text-lg text-gray-200 md:text-3xl">
            A new generation of stories made to stand with the world.
          </p>

          {!isLive && (
            <>
              <div className="inline-block rounded-full border border-[#ef6b24]/30 bg-[#ef6b24]/10 px-6 py-2 backdrop-blur-md">
                <span className="tracking-[0.3em] text-sm uppercase">Launching Soon</span>
              </div>

              <div className="flex gap-4 md:gap-12 justify-center md:justify-start">
                <CountdownItem value={timeLeft.days} label="DAYS" />
                <CountdownItem value={timeLeft.hours} label="HOURS" />
                <CountdownItem value={timeLeft.minutes} label="MINUTES" />
                <CountdownItem value={timeLeft.seconds} label="SECONDS" highlight />
              </div>
                              <p
  className="
    font-(family-name:--font-flare)
    pt-2
    text-[10px] md:text-sm
    tracking-[0.4em]
    uppercase
    text-white/40
    text-center md:text-left
  "
>
  14 FEBRUARY • 6:00 AM IST
</p>
            </>
          )}
        </div>
      </div>
      {/* ---------------- SOCIAL ICONS ---------------- */}
<div
  className="
    fixed bottom-6 z-50
    flex w-full justify-center gap-5 px-6
    md:bottom-12 md:right-12 md:w-auto md:justify-end
  "
>
  <SocialLink
    href="https://x.com/SliceMeowHQ"
    label="X (Twitter)"
  >
    <Twitter className="h-5 w-5 md:h-7 md:w-7" />
  </SocialLink>

  <SocialLink
    href="https://www.youtube.com/@slicemeowmedia"
    label="YouTube"
  >
    <Youtube className="h-5 w-5 md:h-7 md:w-7" />
  </SocialLink>

  <SocialLink
    href="https://www.instagram.com/slicemeowmedia/"
    label="Instagram"
  >
    <Instagram className="h-5 w-5 md:h-7 md:w-7" />
  </SocialLink>
</div>

    </div>
  );
}

/* ---------------- HELPERS ---------------- */

function CountdownItem({
  value,
  label,
  highlight,
}: {
  value: number;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col items-center md:items-start">
      <span
        className={`font-(family-name:--font-flare) font-bold text-3xl md:text-7xl tabular-nums ${
          highlight ? 'text-[#ef6b24]' : 'text-white'
        }`}
      >
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 md:text-xs">
        {label}
      </span>
    </div>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-white/40 transition-all duration-300 hover:scale-110 hover:text-white"
    >
      {children}
    </a>
  );
}

