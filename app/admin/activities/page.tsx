"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, Trash2, MapPin, Users } from "lucide-react";

interface ActivityItem {
  id: string;
  category: string;
  title: string;
  description: string;
  imageUrl: string | null;
  date: string;
  location: string;
  bookingDeadline: string;
  price: number;
  capacity: number;
}

const CATEGORIES = [
  { value: "TRIP", label: "رحلة" },
  { value: "COURSE", label: "كورس تدريبي" },
  { value: "EVENT", label: "فعالية" },
  { value: "RAMADAN_IFTAR", label: "إفطار رمضان" },
  { value: "RAMADAN_SUHOOR", label: "سحور رمضان" },
  { value: "OTHER", label: "نشاط آخر" },
];

const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(CATEGORIES.map((c) => [c.value, c.label]));

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [bookingDeadline, setBookingDeadline] = useState("");
  const [price, setPrice] = useState("0");
  const [capacity, setCapacity] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  async function loadActivities() {
    const res = await fetch("/api/activities");
    const data = await res.json();
    setActivities(data);
  }

  useEffect(() => {
    loadActivities();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    let imageUrl: string | null = null;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      imageUrl = uploadData.url;
    }

    await fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category,
        title,
        description,
        imageUrl,
        date,
        location,
        bookingDeadline,
        price: Number(price),
        capacity: Number(capacity),
      }),
    });

    setTitle("");
    setDescription("");
    setDate("");
    setLocation("");
    setBookingDeadline("");
    setPrice("0");
    setCapacity("");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setLoading(false);
    loadActivities();
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("متأكد إنك عايز تحذف النشاط ده؟");
    if (!confirmed) return;
    await fetch(`/api/activities/${id}`, { method: "DELETE" });
    loadActivities();
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-bold text-gray-900 mb-4">إضافة نشاط جديد</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نوع النشاط</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">اسم النشاط</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ النشاط</label>
              <input value={date} onChange={(e) => setDate(e.target.value)} required type="datetime-local" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">موعد انتهاء الحجز</label>
              <input value={bookingDeadline} onChange={(e) => setBookingDeadline(e.target.value)} required type="datetime-local" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">المكان</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">السعر (0 = مجاني)</label>
              <input value={price} onChange={(e) => setPrice(e.target.value)} required type="number" min="0" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">عدد الأماكن</label>
              <input value={capacity} onChange={(e) => setCapacity(e.target.value)} required type="number" min="1" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">صورة النشاط</label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
              className="w-full text-sm text-gray-500 file:ml-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:text-sm file:font-medium file:cursor-pointer hover:file:bg-primary-dark"
            />
          </div>

          <button type="submit" disabled={loading} className="bg-primary text-white px-6 py-2 rounded-pill text-sm font-medium">
            {loading ? "جاري الإضافة..." : "إضافة النشاط"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-bold text-gray-900 mb-4">الأنشطة الحالية ({activities.length})</h2>

        {activities.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <CalendarDays className="w-8 h-8 mx-auto mb-2 opacity-40" />
            لا توجد أنشطة مضافة بعد
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((a) => (
              <div key={a.id} className="rounded-xl border border-gray-100 bg-surface-muted p-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-[240px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-500">
                        {CATEGORY_LABELS[a.category]}
                      </span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                        {a.price === 0 ? "مجاني" : `${a.price} جنيه`}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 mt-2">{a.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{a.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{new Date(a.date).toLocaleDateString("ar-EG")}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{a.location}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{a.capacity} مكان</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="flex items-center gap-1 text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}