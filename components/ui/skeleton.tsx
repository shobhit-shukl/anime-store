"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-[length:200%_100%]",
        className
      )}
    />
  );
}

// Anime card skeleton
export function AnimeCardSkeleton() {
  return (
    <div className="group bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm rounded-[32px] overflow-hidden border border-slate-200 dark:border-white/5 transition-colors">
      <Skeleton className="h-80 w-full rounded-b-none" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-7 w-3/4" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}

// Anime row skeleton
export function AnimeRowSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-2 rounded-full" />
        <Skeleton className="h-10 w-48" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <AnimeCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// Hero skeleton
export function HeroSkeleton() {
  return (
    <div className="relative h-[70vh] bg-slate-200 dark:bg-slate-900 transition-colors">
      <Skeleton className="absolute inset-0 rounded-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-200 via-white/60 to-transparent dark:from-slate-950 dark:via-slate-950/60 dark:to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-3xl px-4">
          <Skeleton className="h-20 w-96 mx-auto" />
          <Skeleton className="h-6 w-72 mx-auto" />
          <Skeleton className="h-14 w-80 mx-auto rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

// Detail page skeleton
export function AnimeDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      {/* Banner */}
      <Skeleton className="h-[40vh] w-full rounded-none" />
      
      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <Skeleton className="w-64 h-96 rounded-3xl shrink-0" />
          
          {/* Info */}
          <div className="flex-1 space-y-6 pt-8">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-12 w-96" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
            <Skeleton className="h-32 w-full" />
            <div className="flex gap-4">
              <Skeleton className="h-14 w-48 rounded-2xl" />
              <Skeleton className="h-14 w-32 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Table row skeleton
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-white/5">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className={cn("h-6", i === 0 ? "w-48" : "w-24")} />
      ))}
    </div>
  );
}

// Search result skeleton
export function SearchResultSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4">
      <Skeleton className="w-16 h-20 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}
