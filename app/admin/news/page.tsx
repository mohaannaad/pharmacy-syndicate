"use client";

import { useEffect, useRef, useState } from "react";
import { Trash2, GripVertical, Newspaper as NewsIcon, Video, FileText } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

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

  async function handleDragEnd(result: DropResult) {
    if (!result.destination) return;

    const reordered = Array.from(newsList);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    setNewsList(reordered);

    await fetch("/api/news/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds: reordered.map((item) => item.id) }),
    });
  }

  const articleCount = newsList.filter((n) => n.type === "ARTICLE").length;
  const youtubeCount = newsList.filter((n) => n.type === "YOUTUBE").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-gray-900">إضافة خبر جديد</h2>

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
                <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={5} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
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

        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <p className="text-xs text-gray-400">إجمالي الأخبار</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{newsList.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-400">مقالات</p>
              <p className="font-bold text-gray-900">{articleCount}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center shrink-0">
              <Video className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">فيديوهات يوتيوب</p>
              <p className="font-bold text-gray-900">{youtubeCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-bold text-gray-900">الأخبار الحالية</h2>
          <span className="text-xs text-gray-400">اسحب من المقبض لإعادة الترتيب</span>
        </div>

        {newsList.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <NewsIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
            لا توجد أخبار مضافة بعد
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="news-list">
              {(provided) => (
                <div className="mt-3 space-y-2" ref={provided.innerRef} {...provided.droppableProps}>
                  {newsList.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 ${snapshot.isDragging ? "shadow-lg ring-2 ring-primary/30 bg-white" : "bg-surface-muted"}`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span {...provided.dragHandleProps} className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing shrink-0">
                              <GripVertical className="w-4 h-4" />
                            </span>
                            <span className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-500 shrink-0">
                              {item.type === "YOUTUBE" ? "يوتيوب" : "مقال"}
                            </span>
                            <span className="font-medium text-gray-900 truncate">{item.title}</span>
                          </div>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="flex items-center gap-1 text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            حذف
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </div>
  );
}