"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IdCard, CheckCircle2, Clock3, AlertCircle, Truck, Building2, Upload, Loader2, User, Info } from "lucide-react";
import { CARD_DELIVERY_FEE, RENEWAL_STATUS_LABELS, type RenewalDues } from "../../lib/renewal";

interface MemberData {
  member: {
    fullName: string;
    membershipNumber: string;
    phone: string;
    address: string;
    photoUrl: string | null;
    lastPaidYear: number;
  };
  renewal: RenewalDues;
  openRequest: { number: string; status: string; total: number; adminNote: string | null } | null;
    rejectedRequest: { number: string; adminNote: string | null } | null;
}

const money = (n: number) => `${n.toLocaleString("ar-EG")} جنيه`;

// سطر في ملخص الطلب
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-[15px]">
      <span className="text-ink-muted">{label}</span>
      <b className="text-ink">{value}</b>
    </div>
  );
}

const card = "bg-white rounded-3xl border border-line shadow-card p-6 md:p-7";
const inputClass = "w-full h-[52px] bg-white border-[1.5px] border-[#DCE6E0] rounded-2xl px-4 text-base text-ink outline-none text-right focus:border-primary";

export default function RenewCardPage() {
  const [data, setData] = useState<MemberData | null>(null);
  const [loadError, setLoadError] = useState(false);
    const [access, setAccess] = useState<{ status: number; message: string } | null>(null);

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<"DELIVERY" | "PICKUP">("PICKUP");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ number: string; total: number } | null>(null);

  // أول ما الصفحة تفتح: نجيب بيانات العضو
  useEffect(() => {
        fetch("/api/members/me")
      .then(async (res) => {
        const json = await res.json();
        // مش داخل، أو داخل بس مش عضو
        if (!res.ok) {
          setAccess({ status: res.status, message: json.error });
          return;
        }
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
      setError("فشل رفع الصورة، يرجى المحاولة مرة أخرى");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit() {
    setError("");
    if (!/^01\d{9}$/.test(phone)) return setError("يجب أن يتكون رقم الهاتف من 11 رقمًا ويبدأ بـ 01");
    if (!address.trim()) return setError("يرجى إدخال العنوان");
    if (deliveryMethod === "DELIVERY" && !deliveryAddress.trim()) return setError("يرجى إدخال عنوان التوصيل");

    setSubmitting(true);
    try {
      const res = await fetch("/api/renewals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, address, photoUrl, deliveryMethod, deliveryAddress }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "حدث خطأ، يرجى المحاولة مرة أخرى");
        return;
      }
      setResult({ number: json.number, total: json.total });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("تعذّر الاتصال، يرجى المحاولة مرة أخرى");
    } finally {
      setSubmitting(false);
    }
  }

  // عنوان الصفحة: مسار التنقل + العنوان (بدل الشريط الأخضر)
  const header = (
    <section className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
      <nav className="text-sm text-ink-muted">
        <Link href="/" className="hover:text-primary">الرئيسية</Link>
        {" / "}
        <Link href="/services" className="hover:text-primary">الخدمات</Link>
        {" / "}
        <span className="text-ink">تجديد الاشتراك</span>
      </nav>
      <h1 className="mt-2.5 text-[28px] md:text-[38px] font-extrabold text-ink leading-tight">تجديد الاشتراك وتجديد الكارنيه</h1>
    </section>
  );

  // ======================= تحميل / خطأ =======================
  if (!data) {
    return (
      <main className="bg-surface-muted min-h-[60vh]">
        {header}
        <section className="max-w-md mx-auto px-4 py-16 text-center text-ink-muted">
          {access ? (
            <div className={card}>
              <User className="w-12 h-12 text-primary mx-auto" />
              <p className="mt-4 font-bold text-ink">{access.message}</p>
              {access.status === 401 && (
                <>
                  <p className="mt-2 text-sm">سجّل الدخول من زر «تسجيل الدخول» أعلى الصفحة، باستخدام رقم القيد وكلمة المرور.</p>
                  <a href="/register/existing-member" className="mt-6 block w-full bg-primary text-white py-3 rounded-pill font-bold">
                    ليس لديك حساب؟ سجّل كعضو حالي
                  </a>
                </>
              )}
              {access.status === 403 && (
                <a href="/register/new-graduate" className="mt-6 block w-full bg-primary text-white py-3 rounded-pill font-bold">
                  متابعة طلب القيد
                </a>
              )}
            </div>
          ) : loadError ? (
            <p>حدث خطأ أثناء تحميل بياناتك، يرجى تحديث الصفحة.</p>
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
  const currentYear = new Date().getFullYear();
  const showForm = !openRequest && renewal.canRenew && renewal.years.length > 0;
  const yearsCount = `${renewal.years.length} ${renewal.years.length === 1 ? "سنة" : renewal.years.length === 2 ? "سنتان" : "سنوات"}`;

  // ======================= بعد الإرسال =======================
  if (result) {
    return (
      <main className="bg-surface-muted min-h-[60vh]">
        {header}
        <section className="max-w-md mx-auto px-4 py-12">
          <div className={`${card} text-center`}>
            <CheckCircle2 className="w-16 h-16 text-primary-light mx-auto" />
            <h2 className="mt-4 font-extrabold text-xl text-ink">تم تسجيل طلب التجديد</h2>
            <p className="mt-4 text-ink-muted text-sm">رقم الطلب</p>
            <p className="mt-1 text-2xl font-extrabold text-primary" dir="ltr">{result.number}</p>
            <div className="mt-6 bg-surface-muted rounded-2xl p-4">
              <Row label="المبلغ المطلوب" value={money(result.total)} />
            </div>
            <div className="mt-4 flex items-start gap-2.5 bg-[#FFF8E8] border border-[#F1DFAE] text-[#7A5D0C] text-[13.5px] leading-relaxed rounded-2xl px-4 py-3 text-right">
              <Clock3 className="w-4 h-4 shrink-0 mt-1" />
              بوابة الدفع الإلكتروني قيد التفعيل حاليًا، وستكون متاحة قريبًا. بعد الدفع سيصدر إيصال إلكتروني ويبدأ تجهيز الكارنيه.
            </div>
            <a href="/my-requests" className="mt-6 block w-full bg-primary text-white py-3 rounded-pill font-bold">
              متابعة الطلب من «طلباتي»
            </a>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-surface-muted">
      {header}
      <section className={`max-w-7xl mx-auto px-4 md:px-8 pt-7 pb-20 grid grid-cols-1 gap-7 items-start ${showForm ? "lg:grid-cols-[minmax(0,1fr)_360px]" : ""}`}>
        {/* ===================== العمود الرئيسي ===================== */}
        <div className="flex flex-col gap-5 min-w-0">
          {/* ---------- بطاقة العضو ---------- */}
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-l from-primary-dark to-primary px-6 md:px-8 py-7 text-white flex items-center gap-5 flex-wrap">
            <span className="absolute -left-12 -top-12 w-[200px] h-[200px] rounded-full border-[34px] border-primary-light/15" />
            <span className="relative w-[72px] h-[72px] rounded-[22px] bg-white/15 flex items-center justify-center overflow-hidden shrink-0">
              {photoUrl || member.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoUrl || member.photoUrl || ""} alt="الصورة الشخصية" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8" />
              )}
            </span>
            <div className="relative flex-1 min-w-[180px]">
              <p className="text-xl md:text-[22px] font-extrabold">{member.fullName}</p>
              <p className="mt-1 text-[15px] text-[#CFE3D8]">
                رقم القيد <span dir="ltr">{member.membershipNumber}</span>
              </p>
            </div>
            <div className="relative bg-white/10 rounded-2xl px-6 py-3 text-center">
              <p className="text-[13px] text-[#CFE3D8]">آخر عام مسدد</p>
              <p className="text-[26px] font-extrabold text-[#F2D97E] leading-tight">{member.lastPaidYear}</p>
            </div>
          </div>

          {/* ---------- آخر طلب اترفض ---------- */}
          {!openRequest && rejectedRequest && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-3xl p-5 text-sm text-red-800">
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
            <div className={`${card} text-center`}>
              <IdCard className="w-12 h-12 text-primary mx-auto" />
              <p className="mt-3 text-ink">لديك طلب تجديد جارٍ</p>
              <p className="mt-1 font-extrabold text-primary text-xl" dir="ltr">{openRequest.number}</p>
              <span className={`inline-block mt-3 text-xs px-3 py-1 rounded-full font-bold ${RENEWAL_STATUS_LABELS[openRequest.status]?.color}`}>
                {RENEWAL_STATUS_LABELS[openRequest.status]?.label}
              </span>
              <p className="mt-3 text-sm text-ink-muted">الإجمالي: {money(openRequest.total)}</p>
              {openRequest.adminNote && <p className="mt-3 text-sm bg-surface-muted rounded-2xl px-4 py-3 text-ink">{openRequest.adminNote}</p>}
              <a href="/my-requests" className="mt-5 inline-block text-sm font-bold text-primary hover:text-primary-dark">
                متابعة الطلب من «طلباتي»
              </a>
            </div>
          )}

          {/* ---------- التجديد موقوف من النقابة ---------- */}
          {!openRequest && !renewal.canRenew && (
            <div className={`${card} text-center`}>
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
              <p className="mt-3 font-bold text-ink">لا يمكن تجديد الاشتراك إلكترونيًا حاليًا</p>
              {renewal.blockReason && <p className="mt-2 text-sm text-ink-muted">{renewal.blockReason}</p>}
              <p className="mt-2 text-sm text-ink-muted">يرجى التواصل مع النقابة لمزيد من التفاصيل.</p>
            </div>
          )}

          {/* ---------- مسدد ---------- */}
          {!openRequest && renewal.canRenew && renewal.years.length === 0 && (
            <div className={`${card} text-center`}>
              <CheckCircle2 className="w-12 h-12 text-primary-light mx-auto" />
              <p className="mt-3 font-bold text-ink">اشتراكك مسدد حتى عام {member.lastPaidYear}</p>
              <p className="mt-1 text-sm text-ink-muted">لا توجد مستحقات عليك حاليًا.</p>
            </div>
          )}

          {showForm && (
            <>
              {/* ---------- السنوات المستحقة ---------- */}
              <div className={card}>
                <h2 className="text-xl font-extrabold text-ink mb-4">السنوات المستحقة</h2>
                {renewal.detailed ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {renewal.years.map((y) => {
                      const isCurrent = y.year === currentYear;
                      return (
                        <div key={y.year} className={`rounded-2xl p-4 flex flex-col gap-1.5 ${isCurrent ? "border-[1.5px] border-primary bg-[#F3F9F5]" : "border border-line"}`}>
                          <b className="text-xl text-ink">{y.year}</b>
                          <span className="text-sm text-ink-muted">اشتراك {money(y.subscription ?? 0)}</span>
                          {y.late ? <span className="text-sm text-[#B45309]">غرامة تأخير {money(y.late)}</span> : <span className="text-sm text-[#2E6B1C]">{isCurrent ? "العام الحالي — بدون غرامة" : "بدون غرامة"}</span>}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div>
                    <div className="flex flex-wrap gap-2">
                      {renewal.years.map((y) => (
                        <span key={y.year} className={`text-base font-bold px-4 py-2 rounded-2xl ${y.year === currentYear ? "border-[1.5px] border-primary bg-[#F3F9F5] text-primary" : "border border-line text-ink"}`} dir="ltr">
                          {y.year}
                        </span>
                      ))}
                    </div>
                    <p className="mt-4 text-sm text-ink-muted">
                      المبلغ المستحق وفق سجلات النقابة (شامل غرامات التأخير): <b className="text-ink">{money(renewal.total)}</b>
                    </p>
                  </div>
                )}
              </div>

              {/* ---------- راجع بياناتك ---------- */}
              <div className={`${card} flex flex-col gap-5`}>
                <h2 className="text-xl font-extrabold text-ink">راجع بياناتك</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex flex-col gap-2 text-sm font-semibold text-[#3E4B44]">
                    رقم الهاتف
                    <input type="tel" inputMode="numeric" autoComplete="off" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))} className={inputClass} dir="ltr" />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-[#3E4B44]">
                    العنوان
                    <input type="text" autoComplete="off" value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} />
                  </label>
                </div>
                <label className="relative flex items-center gap-4 border-[1.5px] border-dashed border-[#BFDCCB] rounded-2xl p-4 cursor-pointer hover:bg-[#F7FBF8] transition-colors">
                  <span className="w-12 h-12 rounded-2xl bg-mint text-primary flex items-center justify-center shrink-0">
                    {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : photoUrl ? <CheckCircle2 className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                  </span>
                  <span className="flex flex-col">
                    <b className="text-[15px] text-ink">{uploading ? "جاري رفع الصورة..." : photoUrl ? "تم رفع الصورة الجديدة" : "تحديث الصورة الشخصية (اختياري)"}</b>
                    <span className="text-[13px] text-ink-muted">ستُطبع على الكارنيه الجديد</span>
                  </span>
                  <input type="file" accept="image/*" className="absolute w-px h-px opacity-0" disabled={uploading} onChange={handlePhotoChange} />
                </label>
              </div>

              {/* ---------- استلام الكارنيه ---------- */}
              <div className={`${card} flex flex-col gap-4`}>
                <h2 className="text-xl font-extrabold text-ink">استلام الكارنيه</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <label className={`flex items-center gap-3.5 rounded-2xl p-4 cursor-pointer transition-colors ${deliveryMethod === "PICKUP" ? "border-2 border-primary bg-[#F3F9F5]" : "border-[1.5px] border-[#DCE6E0] hover:border-primary/50"}`}>
                    <input type="radio" name="delivery" checked={deliveryMethod === "PICKUP"} onChange={() => setDeliveryMethod("PICKUP")} className="w-5 h-5 accent-primary" />
                    <Building2 className="w-5 h-5 text-primary shrink-0" />
                    <span className="flex flex-col">
                      <b className="text-base text-ink">استلام من النقابة</b>
                      <span className="text-[13.5px] text-ink-muted">بدون رسوم إضافية</span>
                    </span>
                  </label>
                  <label className={`flex items-center gap-3.5 rounded-2xl p-4 cursor-pointer transition-colors ${deliveryMethod === "DELIVERY" ? "border-2 border-primary bg-[#F3F9F5]" : "border-[1.5px] border-[#DCE6E0] hover:border-primary/50"}`}>
                    <input type="radio" name="delivery" checked={deliveryMethod === "DELIVERY"} onChange={() => setDeliveryMethod("DELIVERY")} className="w-5 h-5 accent-primary" />
                    <Truck className="w-5 h-5 text-primary shrink-0" />
                    <span className="flex flex-col">
                      <b className="text-base text-ink">توصيل</b>
                      <span className="text-[13.5px] text-ink-muted">+ {money(CARD_DELIVERY_FEE)} رسوم توصيل</span>
                    </span>
                  </label>
                </div>
                {deliveryMethod === "DELIVERY" && (
                  <label className="flex flex-col gap-2 text-sm font-semibold text-[#3E4B44]">
                    عنوان التوصيل
                    <input type="text" autoComplete="off" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} className={inputClass} />
                  </label>
                )}
                <p className="text-[13px] text-ink-muted leading-relaxed">إيصال الاشتراك يصدر إلكترونيًا بعد الدفع. الكارنيه منتج مادي، لذلك يتم توصيله أو استلامه من داخل النقابة فقط.</p>
              </div>
            </>
          )}
        </div>

        {/* ===================== ملخص الطلب ===================== */}
        {showForm && (
          <aside className="lg:sticky lg:top-28 bg-white border border-line rounded-[28px] p-6 md:p-7 flex flex-col gap-4 shadow-lift">
            <h2 className="text-xl font-extrabold text-ink">ملخص الطلب</h2>
            <Row label={`${renewal.detailed ? "الاشتراك" : "الاشتراكات والغرامات"} (${yearsCount})`} value={money(renewal.subscriptionTotal)} />
            {renewal.lateTotal > 0 && <Row label="غرامات التأخير" value={money(renewal.lateTotal)} />}
            <Row label="التوصيل" value={deliveryFee > 0 ? money(deliveryFee) : "—"} />
            <div className="h-px bg-line" />
            <div className="flex justify-between items-baseline">
              <span className="text-base font-bold text-ink">الإجمالي</span>
              <b className="text-[32px] font-extrabold text-primary leading-none">
                {total.toLocaleString("ar-EG")} <span className="text-base">جنيه</span>
              </b>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-50 text-red-700 text-sm rounded-2xl px-4 py-3 border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <button type="button" onClick={handleSubmit} disabled={submitting || uploading} className="h-14 rounded-pill bg-primary hover:bg-primary-dark text-white text-[17px] font-extrabold transition-colors disabled:opacity-60">
              {submitting ? "جاري التسجيل..." : "تأكيد طلب التجديد"}
            </button>
            <div className="flex gap-2.5 bg-[#FFF8E8] border border-[#F1DFAE] rounded-2xl p-3.5 text-[13.5px] text-[#7A5D0C] leading-relaxed">
              <Info className="w-4 h-4 shrink-0 mt-1" />
              <span>بوابة الدفع الإلكتروني قيد التفعيل، وبعد الدفع يُصدر إيصال إلكتروني ويبدأ تجهيز الكارنيه.</span>
            </div>
          </aside>
        )}
      </section>
    </main>
  );
}
