"use client";

import React, { useState } from "react";
import { Edit, Trash2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface AdminTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  getItemId: (item: T) => string;
  getItemTitle: (item: T) => string;
}

export function AdminTable<T>({
  data,
  columns,
  onEdit,
  onDelete,
  onView,
  loading = false,
  emptyMessage = "No data found",
  getItemId,
  getItemTitle,
}: AdminTableProps<T>) {
  const [deleteItem, setDeleteItem] = useState<T | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteItem || !onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(deleteItem);
    } finally {
      setIsDeleting(false);
      setDeleteItem(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden transition-colors">
        <div className="animate-pulse">
          <div className="h-14 bg-white/5 border-b border-white/5" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 border-b border-white/5 flex items-center px-6 gap-4">
              <div className="w-12 h-16 rounded-lg bg-white/5" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 bg-white/5 rounded" />
                <div className="h-3 w-32 bg-white/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 p-12 text-center transition-colors">
        <p className="text-slate-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden transition-colors">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-white/5 border-b border-white/5 text-xs font-bold uppercase tracking-widest text-slate-400">
          {columns.map((col) => (
            <div key={col.key} className={cn("col-span-2", col.className)}>
              {col.label}
            </div>
          ))}
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-white/5">
          {data.map((item) => (
            <div
              key={getItemId(item)}
              className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/5 transition-colors group"
            >
              {columns.map((col) => (
                <div key={col.key} className={cn("col-span-2 truncate", col.className)}>
                  {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] || "-")}
                </div>
              ))}
              
              {/* Actions */}
              <div className="col-span-2 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {onView && (
                  <button
                    onClick={() => onView(item)}
                    className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    title="View"
                  >
                    <Eye size={16} />
                  </button>
                )}
                {onEdit && (
                  <button
                    onClick={() => onEdit(item)}
                    className="p-2 rounded-lg hover:bg-blue-500/10 text-slate-400 hover:text-blue-400 transition-colors"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => setDeleteItem(item)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Anime</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteItem ? getItemTitle(deleteItem) : ""}&quot;? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteItem(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Stats card component
interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
}

export function StatCard({ title, value, change, changeType = "neutral", icon }: StatCardProps) {
  return (
    <div className="bg-slate-900 rounded-2xl border border-white/5 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">{icon}</div>
        {change && (
          <span
            className={cn(
              "text-xs font-bold px-2 py-1 rounded-full",
              changeType === "positive" && "bg-green-500/10 text-green-400",
              changeType === "negative" && "bg-red-500/10 text-red-400",
              changeType === "neutral" && "bg-white/5 text-slate-400"
            )}
          >
            {change}
          </span>
        )}
      </div>
      <p className="text-3xl font-black mb-1">{value}</p>
      <p className="text-sm text-slate-500">{title}</p>
    </div>
  );
}

export default AdminTable;
