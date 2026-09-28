"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronUp, ChevronDown, X, Plus, CheckCircle2, AlertCircle } from "lucide-react";
import { ALL_SERVICES, FEATURED_COUNT, servicesByKeys } from "../../lib/services";

export default function AdminHomeServicesPage() {
  const [savedKeys, setSavedKeys] = useState<string[]>([]);
  const [keys, setKeys] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/settings/featured-services")
      .then((res) => res.json())
      .then((data) => {
        setKeys(data.keys);
        setSavedKeys(data.keys);
      });
  }, []);

  const selected = servicesByKeys(keys);
  const available = ALL_SERVICES.filter((s) => !keys.includes(s.key));
  const isFull = keys.length >= FEATURED_COUNT;
  const changed = JSON.stringify(keys) !== JSON.stringify(savedKeys);

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= keys.length) return;
    const next = [...keys];
    [next[index], next[target]] = [next[target], next[index]];
    setKeys(next);
    setMessage(null);
  }

  function remove(key: string) {
    setKeys(keys.filter((k) => k !== key));
    setMessage(null);
  }

  function add(key: string) {
    if (isFull) return;
    setKeys([...keys, key]);
    setMessage(null);
  }

  async function save() {
    setSaving(true);
    const res = await fetch("/api/settings/featured-services", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keys }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setMessage({ type: "error", text: data.error || "حصلت مشكلة" });
      return;
    }
    setSavedKeys(data.keys);
    setMessage({ type: "success", text: "تم الحفظ، والتغيير ظاهر دلوقتي في الصفحة الرئيسية" });
  }

  return (
    <div className="space-y-6">
      {/* ---------- الخدمات الظاهرة ---------- */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
          <div>
            <h2 className="font-bold text-gray-900">الخدمات الظاهرة في الصفحة الرئيسية</h2>
            <p className="text-xs text-gray-400 mt-1">رتّبها بالأسهم — أول خدمة بتظهر على اليمين</p>
          </div>
          <span className={`text-sm font-bold px-3 py-1 rounded-full ${isFull ? "bg-primary/10 text-primary" : "bg-yellow-100 text-yellow-700"}`}>
            {keys.length} / {FEATURED_COUNT}
          </span>
        </div>

        <div className="space-y-2">
          {selected.map((service, index) => (
            <div key={service.key} className="flex items-center gap-3 border border-gray-100 bg-surface-muted rounded-xl px-4 py-3">
              <span className="w-6 text-center font-bold text-primary">{index + 1}</span>
              <Image src={service.icon} alt={service.title} width={32} height={32} className="w-8 h-8 object-contain" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm">{service.title}</p>
                <p className="text-xs text-gray-400 truncate">{service.desc}</p>
              </div>
              <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-500 disabled:opacity-30" title="لأعلى">
                <ChevronUp className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => move(index, 1)} disabled={index === selected.length - 1} className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-500 disabled:opacity-30" title="لأسفل">
                <ChevronDown className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => remove(service.key)} className="p-1.5 rounded-lg bg-white border border-gray-200 text-red-500 hover:bg-red-50" title="إزالة">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

          {Array.from({ length: FEATURED_COUNT - selected.length }).map((_, i) => (
            <div key={`empty-${i}`} className="border-2 border-dashed border-gray-200 rounded-xl px-4 py-4 text-center text-sm text-gray-400">
              مكان فاضي — اختار خدمة من تحت
            </div>
          ))}
        </div>

        {message && (
          <div className={`mt-4 flex items-center gap-2 text-sm rounded-xl px-4 py-3 border ${message.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
            {message.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            {message.text}
          </div>
        )}

        <button type="button" onClick={save} disabled={!changed || !isFull || saving} className="mt-5 w-full bg-primary text-white py-3 rounded-pill font-medium disabled:opacity-40">
          {saving ? "جاري الحفظ..." : !isFull ? `اختار ${FEATURED_COUNT - keys.length} خدمة كمان عشان تقدر تحفظ` : "حفظ التغييرات"}
        </button>
      </div>

      {/* ---------- باقي الخدمات ---------- */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-bold text-gray-900 mb-1">الخدمات المتاحة</h2>
        <p className="text-xs text-gray-400 mb-4">{isFull ? "عشان تضيف خدمة، شيل واحدة من اللي فوق الأول" : "دوس إضافة على الخدمة اللي عايزها تظهر"}</p>

        {available.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-6">كل الخدمات ظاهرة بالفعل</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {available.map((service) => (
              <div key={service.key} className="flex items-center gap-3 border border-gray-100 rounded-xl px-4 py-3">
                <Image src={service.icon} alt={service.title} width={32} height={32} className="w-8 h-8 object-contain" />
                <p className="flex-1 min-w-0 font-medium text-gray-900 text-sm">{service.title}</p>
                <button type="button" onClick={() => add(service.key)} disabled={isFull} className="flex items-center gap-1 text-xs bg-primary text-white px-3 py-1.5 rounded-lg font-medium disabled:opacity-30">
                  <Plus className="w-3.5 h-3.5" />
                  إضافة
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}