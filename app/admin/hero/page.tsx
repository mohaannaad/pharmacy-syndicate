"use client";

import { useEffect, useState } from "react";
import { ImagePlus, Loader2, ArrowUp, ArrowDown, Eye, EyeOff, Pencil, Trash2, AlertCircle, Images } from "lucide-react";

interface Slide {
  id: string;
  imageUrl: string;
  title: string | null;
  subtitle: string | null;
  buttonText: string | null;
  link: string | null;
  active: boolean;
  order: number;
}

const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary";

// مفتاح تشغيل/إيقاف صغير
function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="flex items-center gap-3 text-sm font-medium text-gray-700">
      <span className={`relative w-10 h-6 rounded-full transition-colors ${checked ? "bg-primary" : "bg-gray-300"}`}>
        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${checked ? "right-1" : "right-5"}`} />
      </span>
      {label}
    </button>
  );
}

export default function AdminHeroPage() {
  const [slides, setSlides] = useState<Slide[]>([]);

  // النموذج (إضافة أو تعديل)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showText, setShowText] = useState(true);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [buttonText, setButtonText] = useState("");
  const [link, setLink] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadSlides() {
    const res = await fetch("/api/hero-slides");
    if (res.ok) setSlides(await res.json());
  }

  useEffect(() => {
    fetch("/api/hero-slides")
      .then((res) => (res.ok ? res.json() : []))
      .then(setSlides)
      .catch(() => {});
  }, []);

  function resetForm() {
    setEditingId(null);
    setImageUrl("");
    setShowText(true);
    setTitle("");
    setSubtitle("");
    setShowButton(false);
    setButtonText("");
    setLink("");
    setError("");
  }

  function startEdit(slide: Slide) {
    setEditingId(slide.id);
    setImageUrl(slide.imageUrl);
    setShowText(!!slide.title);
    setTitle(slide.title || "");
    setSubtitle(slide.subtitle || "");
    setShowButton(!!slide.buttonText);
    setButtonText(slide.buttonText || "");
    setLink(slide.link || "");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error();
      setImageUrl(data.url);
    } catch {
      setError("تعذّر رفع الصورة، يرجى المحاولة مرة أخرى");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      imageUrl,
      title: showText ? title : "",
      subtitle: showText ? subtitle : "",
      buttonText: showButton ? buttonText : "",
      link,
    };

    const res = await fetch(editingId ? `/api/hero-slides/${editingId}` : "/api/hero-slides", {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "تعذّر الحفظ");
      return;
    }
    resetForm();
    loadSlides();
  }

  async function toggleActive(slide: Slide) {
    await fetch(`/api/hero-slides/${slide.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !slide.active }),
    });
    loadSlides();
  }

  async function handleDelete(slide: Slide) {
    if (!window.confirm("هل تريد حذف هذه الشريحة؟ لا يمكن التراجع عن هذا الإجراء.")) return;
    await fetch(`/api/hero-slides/${slide.id}`, { method: "DELETE" });
    if (editingId === slide.id) resetForm();
    loadSlides();
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= slides.length) return;
    const reordered = [...slides];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setSlides(reordered);
    await fetch("/api/hero-slides/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds: reordered.map((s) => s.id) }),
    });
  }

  const activeCount = slides.filter((s) => s.active).length;
  const previewTitle = showText ? title : "";
  const previewSubtitle = showText ? subtitle : "";
  const previewButton = showButton ? buttonText : "";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ---------------- النموذج ---------------- */}
        <form onSubmit={handleSave} className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900">{editingId ? "تعديل الشريحة" : "إضافة شريحة جديدة"}</h2>
            {editingId && (
              <button type="button" onClick={resetForm} className="text-sm text-gray-500 hover:text-primary">
                إلغاء التعديل
              </button>
            )}
          </div>

          {/* الصورة + المعاينة */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الصورة</label>
            <div className="relative aspect-[5/2] rounded-2xl overflow-hidden bg-gray-100 border border-dashed border-gray-300">
              {imageUrl ? (
                <>
                  <img src={imageUrl} alt="معاينة الشريحة" className="absolute inset-0 w-full h-full object-cover" />
                  {previewTitle && <div className="absolute inset-0 bg-black/30" />}
                  {(previewTitle || previewButton) && (
                    <div className="absolute inset-0 flex items-center px-8">
                      <div className="max-w-sm text-right">
                        {previewTitle && <p className="text-lg font-bold text-white leading-relaxed">{previewTitle}</p>}
                        {previewSubtitle && <p className="mt-1 text-xs text-white/85">{previewSubtitle}</p>}
                        {previewButton && <span className="inline-block mt-3 bg-[#D1AA43] text-white px-4 py-1.5 rounded-pill text-xs font-medium">{previewButton}</span>}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 text-sm">
                  <ImagePlus className="w-8 h-8 mb-2" />
                  المقاس المناسب: 1600 × 640 بكسل تقريبًا
                </div>
              )}
              <label className="absolute bottom-3 left-3 flex items-center gap-2 bg-white/95 text-primary text-xs font-medium px-3 py-2 rounded-lg shadow cursor-pointer">
                {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImagePlus className="w-3.5 h-3.5" />}
                {uploading ? "جارٍ الرفع..." : imageUrl ? "تغيير الصورة" : "رفع صورة"}
                <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={handleUpload} />
              </label>
            </div>
          </div>

          {/* النص */}
          <div className="border-t border-gray-100 pt-4 space-y-3">
            <Toggle checked={showText} onChange={setShowText} label="إظهار نص على الصورة" />
            {showText ? (
              <div className="grid grid-cols-1 gap-3">
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="العنوان" className={inputClass} />
                <textarea value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="الوصف (اختياري)" rows={2} className={`${inputClass} resize-none`} />
              </div>
            ) : (
              <p className="text-xs text-gray-400">مناسب للصور التي تحتوي على نص مكتوب بالفعل؛ ستظهر الصورة كما هي دون تعتيم.</p>
            )}
          </div>

          {/* الزر والرابط */}
          <div className="border-t border-gray-100 pt-4 space-y-3">
            <Toggle checked={showButton} onChange={setShowButton} label="إظهار زر" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {showButton && <input value={buttonText} onChange={(e) => setButtonText(e.target.value)} placeholder="النص المكتوب على الزر، مثال: اقرأ المزيد" className={inputClass} />}
              <input value={link} onChange={(e) => setLink(e.target.value)} placeholder={showButton ? "الرابط، مثال: /services" : "رابط عند الضغط على الصورة (اختياري)"} className={`${inputClass} ${showButton ? "" : "md:col-span-2"}`} dir="ltr" />
            </div>
            <p className="text-xs text-gray-400">
              لصفحة داخل الموقع اكتب المسار مثل <span dir="ltr">/services</span>، ولموقع خارجي اكتب الرابط كاملًا مثل <span dir="ltr">https://...</span>
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <button type="submit" disabled={saving || uploading || !imageUrl} className="bg-primary text-white px-6 py-2.5 rounded-pill text-sm font-medium disabled:opacity-50">
            {saving ? "جارٍ الحفظ..." : editingId ? "حفظ التعديلات" : "إضافة الشريحة"}
          </button>
        </form>

        {/* ---------------- الإحصائيات ---------------- */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <p className="text-xs text-gray-400">إجمالي الشرائح</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{slides.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <p className="text-xs text-gray-400">الظاهرة في الصفحة الرئيسية</p>
            <p className="text-3xl font-bold text-primary mt-1">{activeCount}</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800 leading-relaxed">
            في حال عدم إضافة أي شريحة، تعرض الصفحة الرئيسية الصور الافتراضية. وبمجرد إضافة أول شريحة، تظهر الشرائح المضافة هنا فقط.
          </div>
        </div>
      </div>

      {/* ---------------- القائمة ---------------- */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-bold text-gray-900 mb-4">الشرائح الحالية (بترتيب الظهور)</h2>

        {slides.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Images className="w-8 h-8 mx-auto mb-2 opacity-40" />
            لم تتم إضافة أي شريحة بعد
          </div>
        ) : (
          <div className="space-y-3">
            {slides.map((slide, i) => (
              <div key={slide.id} className={`flex items-center gap-4 border rounded-xl p-3 ${slide.active ? "border-gray-100" : "border-dashed border-gray-300 opacity-60"} ${editingId === slide.id ? "ring-2 ring-primary" : ""}`}>
                <div className="flex flex-col gap-1">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="p-1 rounded text-gray-400 hover:bg-gray-100 disabled:opacity-30" aria-label="تحريك لأعلى">
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === slides.length - 1} className="p-1 rounded text-gray-400 hover:bg-gray-100 disabled:opacity-30" aria-label="تحريك لأسفل">
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                <img src={slide.imageUrl} alt="" className="w-40 h-16 object-cover rounded-lg shrink-0 bg-gray-100" />

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{slide.title || "بدون نص (الصورة فقط)"}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap text-xs">
                    {!slide.active && <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">مخفية</span>}
                    {slide.buttonText ? (
                      <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">زر: {slide.buttonText}</span>
                    ) : (
                      <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">بدون زر</span>
                    )}
                    {slide.link && <span className="text-gray-400 truncate" dir="ltr">{slide.link}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button type="button" onClick={() => toggleActive(slide)} title={slide.active ? "إخفاء" : "إظهار"} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100">
                    {slide.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button type="button" onClick={() => startEdit(slide)} title="تعديل" className="p-2 rounded-lg text-gray-500 hover:bg-gray-100">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => handleDelete(slide)} title="حذف" className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
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