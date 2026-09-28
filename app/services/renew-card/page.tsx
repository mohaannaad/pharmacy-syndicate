"use client";

import { useEffect, useState } from "react";
import { IdCard, CheckCircle2, Clock3, AlertCircle, Truck, Building2, Camera, Loader2, User } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import { CARD_DELIVERY_FEE, RENEWAL_STATUS_LABELS, type RenewalYear } from "../../lib/renewal";

interface MemberData {
  member: {
    fullName: string;
    membershipNumber: string;
    phone: string;
    address: string;
    photoUrl: string | null;
    lastPaidYear: number;
  };
  renewal: {
    years: RenewalYear[];
    subscriptionTotal: number;
    lateTotal: number;
    total: number;
  };
  openRequest: { number: string; status: string; total: number; adminNote: string | null } | null;
    rejectedRequest: { number: string; adminNote: string | null } | null;
}

const money = (n: number) => `${n.toLocaleString("ar-EG")} جنيه`;

function Row({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 py-2 text-sm ${bold ? "font-bold text-gray-900 border-t border-gray-200 mt-1 pt-3" : "text-gray-600"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

export default function RenewCardPage() {
  const [data, setData] = useState<MemberData | null>(null);
  const [loadError, setLoadError] = useState(false);

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<"DELIVERY" | "PICKUP" | "">("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ number: string; total: number } | null>(null);

  // أول ما الصفحة تفتح: نجيب بيانات العضو
  useEffect(() => {
    fetch("/api/members/me")
      .then((res) => res.json())
      .then((json: MemberData) => {
        setData(json);
        setPhone(json.member.phone);
        setAddress(json.member.address);
        setDeliveryAddress(json.member.address);
      })
      .catch(() => setLoadError(true));
  }, []);

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok || !json.url) throw new Error();
      setPhotoUrl(json.url);
    } catch {
      setError("فشل رفع الصورة، حاول مرة تانية");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit() {
    setError("");
    if (!/^01\d{9}$/.test(phone)) return setError("رقم الهاتف لازم يكون 11 رقم ويبدأ بـ 01");
    if (!address.trim()) return setError("من فضلك اكتب العنوان");
    if (!deliveryMethod) return setError("اختر طريقة استلام الكارنيه");
    if (deliveryMethod === "DELIVERY" && !deliveryAddress.trim()) return setError("اكتب عنوان التوصيل");

    setSubmitting(true);
    try {
      const res = await fetch("/api/renewals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, address, photoUrl, deliveryMethod, deliveryAddress }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "حصلت مشكلة، حاول مرة تانية");
        return;
      }
      setResult({ number: json.number, total: json.total });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("حصلت مشكلة في الاتصال، حاول مرة تانية");
    } finally {
      setSubmitting(false);
    }
  }

  const header = <PageHeader title="تجديد الاشتراك وتجديد الكارنيه" subtitle="سداد الاشتراك السنوي وتجديد بطاقة العضوية" />;

  // ======================= تحميل / خطأ =======================
  if (!data) {
    return (
      <main>
        {header}
        <section className="bg-surface-muted py-20 text-center text-gray-500">
          {loadError ? (
            <p>حصلت مشكلة في تحميل بياناتك، حاول تحديث الصفحة.</p>
          ) : (
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          )}
        </section>
      </main>
    );
  }

    const { member, renewal, openRequest, rejectedRequest } = data;
  const deliveryFee = deliveryMethod === "DELIVERY" ? CARD_DELIVERY_FEE : 0;
  const total = renewal.total + deliveryFee;

  // ======================= بعد الإرسال =======================
  if (result) {
    return (
      <main>
        {header}
        <section className="bg-surface-muted py-14">
          <div className="max-w-md mx-auto px-6">
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
              <CheckCircle2 className="w-16 h-16 text-primary-light mx-auto" />
              <h2 className="mt-4 font-bold text-lg text-gray-900">تم تسجيل طلب التجديد</h2>
              <p className="mt-4 text-gray-500 text-sm">رقم الطلب</p>
              <p className="mt-1 text-2xl font-bold text-primary" dir="ltr">{result.number}</p>
              <div className="mt-6 bg-surface-muted rounded-xl p-4">
                <Row label="المبلغ المطلوب" value={money(result.total)} bold />
              </div>
              <div className="mt-4 flex items-center gap-2 bg-yellow-50 text-yellow-700 text-xs rounded-xl px-4 py-3 border border-yellow-200 text-right">
                <Clock3 className="w-4 h-4 shrink-0" />
                بوابة الدفع الإلكتروني قيد التفعيل حاليًا، وستكون متاحة قريبًا. بعد الدفع سيصدر إيصال إلكتروني ويبدأ تجهيز الكارنيه.
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      {header}
      <section className="bg-surface-muted py-14">
        <div className="max-w-2xl mx-auto px-6 space-y-5">
          {/* ---------- بيانات العضو ---------- */}
          <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
              {photoUrl || member.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoUrl || member.photoUrl || ""} alt="الصورة الشخصية" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-gray-900">{member.fullName}</h2>
              <p className="text-sm text-gray-500 mt-1">
                رقم القيد: <span dir="ltr">{member.membershipNumber}</span>
              </p>
            </div>
            <div className="text-center shrink-0">
              <p className="text-xs text-gray-400">آخر عام مسدد</p>
              <p className="font-bold text-primary text-lg">{member.lastPaidYear}</p>
            </div>
          </div>

                    {/* ---------- آخر طلب اترفض ---------- */}
          {!openRequest && rejectedRequest && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-5 text-sm text-red-800">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">
                  تم رفض طلبك السابق <span dir="ltr">{rejectedRequest.number}</span>
                </p>
                {rejectedRequest.adminNote && <p className="mt-1">السبب: {rejectedRequest.adminNote}</p>}
                <p className="mt-1 text-red-700">يمكنك تقديم طلب جديد بعد تصحيح السبب.</p>
              </div>
            </div>
          )}

          {/* ---------- عنده طلب مفتوح ---------- */}
          {openRequest && (
            <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
              <IdCard className="w-12 h-12 text-primary mx-auto" />
              <p className="mt-3 text-gray-700">لديك طلب تجديد جارٍ</p>
              <p className="mt-1 font-bold text-primary text-xl" dir="ltr">{openRequest.number}</p>
              <span className={`inline-block mt-3 text-xs px-3 py-1 rounded-full font-medium ${RENEWAL_STATUS_LABELS[openRequest.status]?.color}`}>
                {RENEWAL_STATUS_LABELS[openRequest.status]?.label}
              </span>
              <p className="mt-3 text-sm text-gray-500">الإجمالي: {money(openRequest.total)}</p>
              {openRequest.adminNote && <p className="mt-3 text-sm bg-surface-muted rounded-lg px-3 py-2 text-gray-600">{openRequest.adminNote}</p>}
            </div>
          )}

          {/* ---------- مسدد ---------- */}
          {!openRequest && renewal.years.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
              <CheckCircle2 className="w-12 h-12 text-primary-light mx-auto" />
              <p className="mt-3 font-bold text-gray-900">اشتراكك مسدد حتى عام {member.lastPaidYear}</p>
              <p className="mt-1 text-sm text-gray-500">لا توجد مستحقات عليك حاليًا.</p>
            </div>
          )}

          {/* ---------- فورم التجديد ---------- */}
          {!openRequest && renewal.years.length > 0 && (
            <>
              {/* السنوات المستحقة */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-3">السنوات المستحقة</h3>
                <div className="overflow-hidden rounded-xl border border-gray-100">
                  <table className="w-full text-sm">
                    <thead className="bg-surface-muted text-gray-500">
                      <tr>
                        <th className="text-right font-medium px-4 py-2">العام</th>
                        <th className="text-right font-medium px-4 py-2">الاشتراك</th>
                        <th className="text-right font-medium px-4 py-2">غرامة التأخير</th>
                      </tr>
                    </thead>
                    <tbody>
                      {renewal.years.map((y) => (
                        <tr key={y.year} className="border-t border-gray-100">
                          <td className="px-4 py-2 font-medium text-gray-900">{y.year}</td>
                          <td className="px-4 py-2 text-gray-600">{money(y.subscription)}</td>
                          <td className={`px-4 py-2 ${y.late ? "text-red-600" : "text-gray-400"}`}>{y.late ? money(y.late) : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* مراجعة البيانات */}
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                <h3 className="font-bold text-gray-900">راجع بياناتك</h3>
                <div>
                  <label className="text-sm text-gray-700">رقم الهاتف</label>
                  <input type="tel" inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))} className="mt-2 w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none text-right" dir="ltr" />
                </div>
                <div>
                  <label className="text-sm text-gray-700">العنوان</label>
                  <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} className="mt-2 w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none text-right resize-none" />
                </div>
                <div>
                  <label className="text-sm text-gray-700">تحديث الصورة الشخصية (اختياري)</label>
                  <label className="mt-2 flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-4 text-gray-500 text-sm cursor-pointer">
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : photoUrl ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <Camera className="w-4 h-4" />}
                    {uploading ? "جاري الرفع..." : photoUrl ? "تم رفع الصورة الجديدة" : "اضغط لرفع صورة حديثة"}
                    <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={handlePhotoChange} />
                  </label>
                </div>
              </div>

              {/* طريقة الاستلام */}
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                <h3 className="font-bold text-gray-900">استلام الكارنيه</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer ${deliveryMethod === "DELIVERY" ? "border-primary bg-primary/5" : "border-gray-200"}`}>
                    <input type="radio" className="hidden" checked={deliveryMethod === "DELIVERY"} onChange={() => setDeliveryMethod("DELIVERY")} />
                    <Truck className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">توصيل</p>
                      <p className="text-xs text-gray-500">+ {money(CARD_DELIVERY_FEE)}</p>
                    </div>
                  </label>
                  <label className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer ${deliveryMethod === "PICKUP" ? "border-primary bg-primary/5" : "border-gray-200"}`}>
                    <input type="radio" className="hidden" checked={deliveryMethod === "PICKUP"} onChange={() => setDeliveryMethod("PICKUP")} />
                    <Building2 className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">استلام من النقابة</p>
                      <p className="text-xs text-gray-500">بدون رسوم إضافية</p>
                    </div>
                  </label>
                </div>
                {deliveryMethod === "DELIVERY" && (
                  <div>
                    <label className="text-sm text-gray-700">عنوان التوصيل</label>
                    <textarea value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} rows={2} className="mt-2 w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none text-right resize-none" />
                  </div>
                )}
                <p className="text-xs text-gray-500 leading-relaxed">
                  إيصال الاشتراك يصدر إلكترونيًا بعد الدفع. الكارنيه منتج مادي، لذلك يتم توصيله أو استلامه من داخل النقابة فقط.
                </p>
              </div>

              {/* الإجمالي */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-2">الإجمالي</h3>
                <Row label={`الاشتراك (${renewal.years.length} ${renewal.years.length === 1 ? "سنة" : "سنوات"})`} value={money(renewal.subscriptionTotal)} />
                {renewal.lateTotal > 0 && <Row label="غرامات التأخير" value={money(renewal.lateTotal)} />}
                {deliveryFee > 0 && <Row label="رسوم التوصيل" value={money(deliveryFee)} />}
                <Row label="الإجمالي المطلوب" value={money(total)} bold />
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3 border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <button type="button" onClick={handleSubmit} disabled={submitting || uploading} className="w-full bg-primary text-white py-3 rounded-pill font-medium disabled:opacity-60">
                {submitting ? "جاري التسجيل..." : `تأكيد ومتابعة للدفع — ${money(total)}`}
              </button>
            </>
          )}
        </div>
      </section>
    </main>
  );
}