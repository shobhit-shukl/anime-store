'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Lottie to reduce initial bundle size
const Lottie = dynamic(() => import('lottie-react').then(mod => mod.default), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black" />,
});

interface ComingSoonProps {
  webBannerUrl: string;
  mobileVideoUrl: string;
  desktopAnimationUrl: string;
  mobileAnimationUrl: string;
}

export default function ComingSoon({
  webBannerUrl,
  mobileVideoUrl,
  desktopAnimationUrl,
  mobileAnimationUrl,
}: ComingSoonProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [animationData, setAnimationData] = useState(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load animation data as fallback (use appropriate animation based on device)
  useEffect(() => {
    if (isMobile === null) return;

    const loadAnimation = async () => {
      try {
        const animationUrl = isMobile ? mobileAnimationUrl : desktopAnimationUrl;
        const response = await fetch(animationUrl);
        const data = await response.json();
        setAnimationData(data);
      } catch (error) {
        console.error('Failed to load animation:', error);
      }
    };

    loadAnimation();
  }, [isMobile, mobileAnimationUrl, desktopAnimationUrl]);

  // Set timeout for video loading - show fallback if takes too long
  useEffect(() => {
    loadingTimeoutRef.current = setTimeout(() => {
      if (!isVideoLoaded) {
        setShowFallback(true);
      }
    }, 3000); // 3 seconds timeout

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [isVideoLoaded]);

  const handleVideoLoaded = () => {
    setIsVideoLoaded(true);
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
  };

  const handleVideoError = () => {
    console.error('Video failed to load, showing fallback');
    setShowFallback(true);
  };

  const videoUrl = isMobile ? mobileVideoUrl : webBannerUrl;

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-black">
      {/* Video Layer */}
      {!showFallback && (
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 scale-[1.01] ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={handleVideoLoaded}
          onError={handleVideoError}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}

      {/* Fallback Animation Layer */}
      {(showFallback || !isVideoLoaded) && animationData && (
        <div
          className={`absolute inset-0 w-full h-full flex items-center justify-center transition-opacity duration-500 ${
            showFallback ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Lottie
            animationData={animationData}
            loop={true}
            className="w-full h-full"
          />
        </div>
      )}

      {/* Loading Spinner (shown while both video and animation are loading) */}
      {!isVideoLoaded && !showFallback && !animationData && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-purple-500/20 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Overlay Content */}
      <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
      
      {/* Coming Soon Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-4 tracking-wider animate-fade-in">
          <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-400 via-pink-500 to-red-500 animate-gradient">
            COMING SOON
          </span>
        </h1>
        <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-8 animate-fade-in-delay">
          Something amazing is on the way
        </p>
        
        {/* Animated dots */}
        <div className="flex gap-2 animate-fade-in-delay-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>

      {/* Performance optimization styles */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }

        .animate-fade-in-delay {
          opacity: 0;
          animation: fade-in 1s ease-out 0.3s forwards;
        }

        .animate-fade-in-delay-2 {
          opacity: 0;
          animation: fade-in 1s ease-out 0.6s forwards;
        }
      `}</style>
    </div>
  );
}
