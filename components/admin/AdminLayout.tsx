"use client";

import React, { useState, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Film,
  Tv,
  Plus,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Tags,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
}

const sidebarLinks = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Add Anime",
    href: "/admin/add",
    icon: Plus,
  },
  {
    label: "Manage Movies",
    href: "/admin/movies",
    icon: Film,
  },
  {
    label: "Manage Series",
    href: "/admin/series",
    icon: Tv,
  },
  {
    label: "Genres",
    href: "/admin/genres",
    icon: Tags,
  },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Use layout effect to avoid React linter warning
  React.useLayoutEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[--background] text-[--foreground] flex transition-colors">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-white/5 transform transition-transform duration-200 lg:translate-x-0 lg:static transition-colors",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-slate-200 dark:border-white/5 transition-colors">
            <Link href="/admin" className="flex items-center gap-2">
              <Image 
                src="/Slice Meow Final-log.png" 
                alt="Slice Meow" 
                width={120} 
                height={40} 
                className="h-8 w-auto object-contain"
              />
              <span className="text-[10px] px-2 py-0.5 bg-blue-600 rounded-full font-bold uppercase">
                Admin
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto transition-colors">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                  )}
                >
                  <link.icon size={20} />
                  <span>{link.label}</span>
                  {isActive && <ChevronRight size={16} className="ml-auto" />}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-slate-200 dark:border-white/5 transition-colors">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-white/5 transition-colors">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">Admin User</p>
                <p className="text-xs text-slate-500 dark:text-slate-500 truncate">admin@slicemeow.com</p>
              </div>
            </div>
            <button className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition-colors">
              <LogOut size={18} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 flex items-center px-4 lg:px-8 transition-colors">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition-colors mr-4"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex-1">
            <h1 className="text-lg font-bold capitalize">
              {pathname.split("/").pop() || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/UserPage"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              View Site →
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
