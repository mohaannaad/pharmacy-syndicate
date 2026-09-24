"use client";

import { useEffect, useState } from "react";
import { CircleDollarSign, Trash2, Pencil, Check, X } from "lucide-react";

interface FeeItem {
  id: string;
  name: string;
  price: number;
  note: string | null;
  order: number;
}

export default function AdminFeesPage() {
  const [fees, setFees] = useState<FeeItem[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editNote, setEditNote] = useState("");

  async function loadFees() {
    const res = await fetch("/api/fees");
    const data = await res.json();
    setFees(data);
  }

  useEffect(() => {
    loadFees();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/fees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price: Number(price), note, order: fees.length }),
    });

    setName("");
    setPrice("");
    setNote("");
    setLoading(false);
    loadFees();
  }

  function startEdit(fee: FeeItem) {
    setEditingId(fee.id);
    setEditName(fee.name);
    setEditPrice(String(fee.price));
    setEditNote(fee.note || "");
  }

  async function saveEdit(id: string) {
    await fetch(`/api/fees/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, price: Number(editPrice), note: editNote }),
    });
    setEditingId(null);
    loadFees();
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("متأكد إنك عايز تحذف الرسم ده؟");
    if (!confirmed) return;
    await fetch(`/api/fees/${id}`, { method: "DELETE" });
    loadFees();
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-bold text-gray-900 mb-4">إضافة رسم جديد</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">اسم الخدمة</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">السعر (جنيه)</label>
            <input value={price} onChange={(e) => setPrice(e.target.value)} required type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <button type="submit" disabled={loading} className="w-full bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium">
              {loading ? "جاري الإضافة..." : "إضافة"}
            </button>
          </div>
          <div className="md:col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظة (اختياري)</label>
            <input value={note} onChange={(e) => setNote(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="مثال: قابل للتغيير حسب المسافة" />
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-bold text-gray-900 mb-4">الرسوم الحالية ({fees.length})</h2>

        {fees.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <CircleDollarSign className="w-8 h-8 mx-auto mb-2 opacity-40" />
            لا توجد رسوم مضافة بعد
          </div>
        ) : (
          <div className="space-y-2">
            {fees.map((fee) => (
              <div key={fee.id} className="rounded-xl border border-gray-100 bg-surface-muted p-4">
                {editingId === fee.id ? (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                    <div className="md:col-span-2">
                      <input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white" />
                    </div>
                    <div>
                      <input value={editPrice} onChange={(e) => setEditPrice(e.target.value)} type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => saveEdit(fee.id)} className="flex items-center gap-1 text-green-700 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-lg text-xs font-medium">
                        <Check className="w-3.5 h-3.5" />
                        حفظ
                      </button>
                      <button onClick={() => setEditingId(null)} className="flex items-center gap-1 text-gray-500 bg-white border border-gray-200 px-3 py-2 rounded-lg text-xs font-medium">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="md:col-span-4">
                      <input value={editNote} onChange={(e) => setEditNote(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white" placeholder="ملاحظة" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <span className="font-bold text-gray-900">{fee.name}</span>
                      {fee.note && <p className="text-xs text-gray-400 mt-1">{fee.note}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-primary">{fee.price} جنيه</span>
                      <button onClick={() => startEdit(fee)} className="flex items-center gap-1 text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-medium">
                        <Pencil className="w-3.5 h-3.5" />
                        تعديل
                      </button>
                      <button onClick={() => handleDelete(fee.id)} className="flex items-center gap-1 text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-medium">
                        <Trash2 className="w-3.5 h-3.5" />
                        حذف
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}