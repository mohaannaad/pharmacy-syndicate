"use client";

import { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";

type NewsType = "YOUTUBE" | "ARTICLE";

interface NewsItem {
  id: string;
  type: NewsType;
  title: string;
  content: string | null;
  imageUrl: string | null;
  youtubeUrl: string | null;
  order: number;
  createdAt: string;
}

export default function AdminNewsPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [newsType, setNewsType] = useState<NewsType>("ARTICLE");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  async function loadNews() {
    const res = await fetch("/api/news");
    const data = await res.json();
    setNewsList(data);
  }

  useEffect(() => {
    loadNews();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    let imageUrl: string | null = null;

    if (newsType === "ARTICLE" && file) {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      imageUrl = uploadData.url;
    }

    await fetch("/api/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: newsType,
        title,
        content: newsType === "ARTICLE" ? content : null,
        youtubeUrl: newsType === "YOUTUBE" ? youtubeUrl : null,
        imageUrl,
        order: newsList.length,
      }),
    });

       setTitle("");
    setContent("");
    setYoutubeUrl("");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setLoading(false);
    loadNews();
  }

    async function handleDelete(id: string) {
    const confirmed = window.confirm("هل تريد حذف الخبر ؟ هذا الاجراء لا يمكن التراجع عنه.");
    if (!confirmed) return;

    await fetch(`/api/news/${id}`, { method: "DELETE" });
    loadNews();
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-10" dir="rtl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">إدارة الأخبار</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-4 mb-10">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">نوع الخبر</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" checked={newsType === "ARTICLE"} onChange={() => setNewsType("ARTICLE")} />
              مقال كامل
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" checked={newsType === "YOUTUBE"} onChange={() => setNewsType("YOUTUBE")} />
              فيديو يوتيوب
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
        </div>

        {newsType === "ARTICLE" ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نص المقال</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={6} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>

                        <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">صورة الغلاف</label>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
                className="w-full text-sm text-gray-500 file:ml-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:text-sm file:font-medium file:cursor-pointer hover:file:bg-primary-dark"
              />
            </div>
          </>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رابط يوتيوب</label>
            <input value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" dir="ltr" />
          </div>
        )}

        <button type="submit" disabled={loading} className="bg-primary text-white px-6 py-2 rounded-pill text-sm font-medium">
          {loading ? "جاري الإضافة..." : "إضافة الخبر"}
        </button>
      </form>

      <h2 className="text-lg font-bold text-gray-900 mb-4">الأخبار الحالية ({newsList.length})</h2>

            <div className="space-y-3">
        {newsList.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">
                {item.type === "YOUTUBE" ? "يوتيوب" : "مقال"}
              </span>
              <span className="font-bold text-gray-900">{item.title}</span>
            </div>
            <button
              onClick={() => handleDelete(item.id)}
              className="flex items-center gap-1 text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              حذف
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}