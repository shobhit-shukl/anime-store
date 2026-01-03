"use client";

import React from "react";
import { AdminLayout } from "@/components/admin";
import { Tags } from "lucide-react";

export default function GenresPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-pink-500/10 text-pink-400">
            <Tags size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black">Genres</h1>
            <p className="text-slate-500">Manage anime genres</p>
          </div>
        </div>
        
        <div className="p-8 rounded-2xl bg-slate-900 border border-white/5 text-center">
          <p className="text-slate-400">Genre management coming soon...</p>
        </div>
      </div>
    </AdminLayout>
  );
}
