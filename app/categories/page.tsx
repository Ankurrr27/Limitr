"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Pencil, X, Check, Palette } from "lucide-react";
import { useStore } from "../../store/useStore";
import { cn } from "../../utils/cn";
import type { Category } from "../../types";

const COLOR_PRESETS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#10b981", "#14b8a6", "#06b6d4", "#3b82f6",
  "#6366f1", "#8b5cf6", "#a855f7", "#ec4899",
  "#f43f5e", "#475569", "#64748b", "#78716c",
];

export default function CategoriesPage() {
  const router = useRouter();
  const { categories, addCategory, updateCategory, deleteCategory } = useStore();

  // Add state
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState("📦");
  const [newColor, setNewColor] = useState(COLOR_PRESETS[0]);
  const [customHex, setCustomHex] = useState("");

  // Edit state
  const [editing, setEditing] = useState<Category | null>(null);
  const [editCustomHex, setEditCustomHex] = useState("");

  const handleAdd = () => {
    if (!newName.trim()) return;
    addCategory({ name: newName.trim(), emoji: newEmoji || "📦", color: newColor });
    setNewName("");
    setNewEmoji("📦");
    setNewColor(COLOR_PRESETS[0]);
    setCustomHex("");
  };

  const handleCustomHex = (hex: string) => {
    setCustomHex(hex);
    if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
      setNewColor(hex);
    }
  };

  const handleEditCustomHex = (hex: string) => {
    setEditCustomHex(hex);
    if (/^#[0-9a-fA-F]{6}$/.test(hex) && editing) {
      setEditing({ ...editing, color: hex });
    }
  };

  const handleSaveEdit = () => {
    if (!editing) return;
    updateCategory(editing.id, {
      name: editing.name,
      emoji: editing.emoji,
      color: editing.color,
    });
    setEditing(null);
    setEditCustomHex("");
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this category?")) {
      deleteCategory(id);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
      <header className="flex items-center gap-3">
        <button
          onClick={() => router.push("/profile")}
          className="h-10 w-10 flex items-center justify-center rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-secondary)] interactive-tap hover:bg-[var(--bg-primary)] transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-black text-[var(--text-primary)] tracking-tight">Categories</h1>
          <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mt-0.5">Custom Sectors & Colors</p>
        </div>
      </header>

      {/* Add New Category */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <Palette size={14} className="text-brand-500" />
          <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">New Category</h3>
        </div>

        <div className="flex gap-3">
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)] pl-1">Emoji</label>
            <input
              type="text"
              value={newEmoji}
              onChange={(e) => setNewEmoji(e.target.value)}
              className="w-16 h-14 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-[16px] text-center text-2xl outline-none focus:border-brand-500 transition-colors"
              maxLength={4}
            />
          </div>
          <div className="flex-1 space-y-1.5">
            <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)] pl-1">Name</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Education"
              className="w-full h-14 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-[16px] px-4 text-sm font-bold outline-none focus:border-brand-500 transition-colors"
            />
          </div>
        </div>

        {/* Color Picker */}
        <div className="space-y-2">
          <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)] pl-1">Color</label>
          <div className="grid grid-cols-8 gap-2">
            {COLOR_PRESETS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => { setNewColor(color); setCustomHex(""); }}
                className={cn(
                  "h-9 w-full rounded-xl transition-all interactive-tap border-2",
                  newColor === color ? "scale-110 border-white shadow-lg" : "border-transparent hover:scale-105"
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Custom:</span>
            <input
              type="text"
              value={customHex}
              onChange={(e) => handleCustomHex(e.target.value)}
              placeholder="#ff5733"
              className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-brand-500 transition-colors font-mono"
              maxLength={7}
            />
            <div
              className="h-8 w-8 rounded-lg border border-[var(--border-primary)] shrink-0"
              style={{ backgroundColor: newColor }}
            />
          </div>
        </div>

        <button
          onClick={handleAdd}
          disabled={!newName.trim()}
          className={cn(
            "w-full py-4 rounded-[20px] font-black text-xs uppercase tracking-widest transition-all interactive-tap flex items-center justify-center gap-2",
            newName.trim()
              ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20 hover:bg-brand-600"
              : "bg-[var(--bg-primary)] text-[var(--text-secondary)] opacity-40 cursor-not-allowed"
          )}
        >
          <Plus size={16} />
          Add Category
        </button>
      </section>

      {/* Category List */}
      <section className="space-y-2 mt-4">
        <h3 className="text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)] px-2">
          Your Categories ({categories.length})
        </h3>
        <div className="flex flex-col">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between py-3 border-b border-[var(--border-primary)] last:border-0 group -mx-2 px-2"
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-8 w-8 rounded-full flex items-center justify-center text-sm"
                  style={{ backgroundColor: cat.color + "20" }}
                >
                  {cat.emoji}
                </div>
                <div>
                  <p className="text-sm font-black text-[var(--text-primary)] tracking-tight leading-none mb-1">{cat.name}</p>
                  <p className="text-[8px] font-bold text-[var(--text-secondary)] font-mono uppercase leading-none">{cat.color}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-60">
                <button
                  onClick={() => { setEditing({ ...cat }); setEditCustomHex(""); }}
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-brand-500 transition-all"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-red-500 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/60 backdrop-blur-md p-3">
          <div className="w-full max-w-md bg-[var(--bg-primary)] rounded-[28px] p-6 animate-in slide-in-from-bottom-8 duration-300 shadow-2xl border border-[var(--border-primary)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black tracking-tight">Edit Category</h3>
              <button
                onClick={() => setEditing(null)}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--border-primary)] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex gap-3">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)] pl-1">Emoji</label>
                  <input
                    type="text"
                    value={editing.emoji}
                    onChange={(e) => setEditing({ ...editing, emoji: e.target.value })}
                    className="w-16 h-14 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[16px] text-center text-2xl outline-none focus:border-brand-500 transition-colors"
                    maxLength={4}
                  />
                </div>
                <div className="flex-1 space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)] pl-1">Name</label>
                  <input
                    type="text"
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    className="w-full h-14 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[16px] px-4 text-sm font-bold outline-none focus:border-brand-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)] pl-1">Color</label>
                <div className="grid grid-cols-8 gap-2">
                  {COLOR_PRESETS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => { setEditing({ ...editing, color }); setEditCustomHex(""); }}
                      className={cn(
                        "h-9 w-full rounded-xl transition-all interactive-tap border-2",
                        editing.color === color ? "scale-110 border-white shadow-lg" : "border-transparent hover:scale-105"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Custom:</span>
                  <input
                    type="text"
                    value={editCustomHex}
                    onChange={(e) => handleEditCustomHex(e.target.value)}
                    placeholder={editing.color}
                    className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-brand-500 transition-colors font-mono"
                    maxLength={7}
                  />
                  <div
                    className="h-8 w-8 rounded-lg border border-[var(--border-primary)] shrink-0"
                    style={{ backgroundColor: editing.color }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => setEditing(null)}
                  className="flex items-center justify-center gap-2 py-3 rounded-[16px] bg-[var(--bg-secondary)] text-[var(--text-secondary)] font-black text-[10px] uppercase tracking-widest hover:bg-[var(--border-primary)] transition-colors"
                >
                  <X size={14} /> Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex items-center justify-center gap-2 py-3 rounded-[16px] bg-brand-500 text-white font-black text-[10px] uppercase tracking-widest hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/20"
                >
                  <Check size={14} /> Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
