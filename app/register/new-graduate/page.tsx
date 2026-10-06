"use client";
import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Printer, Info, Loader2, Lock, FileText } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import RegisterSteps from "../../components/RegisterSteps";
import DocumentUploadRow from "../../components/DocumentUploadRow";
import {
  GOVERNORATES,
  UNIVERSITY_TYPES,
  GOVERNMENT_UNIVERSITIES,
  PRIVATE_UNIVERSITIES,
  HIGH_SCHOOL_TYPES,
  GRADES,
  getRequiredDocuments,
  calculateFee,
  lateFee,
    NATIONALITIES,
  isNationalityAllowed,
  determinePrivateCategory,
  HIGH_SCHOOL_TOTAL,
  CATEGORY_LABELS,
    GRADUATE_STATUS_LABELS,
  type UniversityType,
  type Gender,
} from "../../lib/graduate";

const steps = ["البيانات الشخصية", "محل الإقامة", "البيانات الأكاديمية", "المستندات", "المراجعة"];

const THIS_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 20 }, (_, i) => THIS_YEAR - i);
const STUDY_YEARS = [5, 6, 7, 8, 9, 10];

// كل بيانات الفورم في object واحد
const emptyForm = {
  fullNameAr: "",
  fullNameEn: "",
  nationalId: "",
  phone: "",
  email: "",
  gender: "" as Gender | "",
  nationality: "مصري",
  religion: "",
  birthDate: "",
  birthGovernorate: "",
  idIssuer: "",

  governorate: "",
  city: "",
  district: "",
  street: "",
  buildingNo: "",
  apartment: "",
  landmark: "",

  universityType: "" as UniversityType | "",
  universityName: "",
  universityCountry: "",
  studyStartYear: "",
  graduationYear: "",
  studyYears: "",
  grade: "",
  highSchoolType: "",
  highSchoolYear: "",
    highSchoolScore: "",
  highSchoolPercent: "",
  hasPreviousQualification: false,
  previousQualification: "",
  previousRejection: false,
};

type GraduateForm = typeof emptyForm;

// الحقول الإجبارية في كل خطوة
const REQUIRED_BY_STEP: Record<number, (keyof GraduateForm)[]> = {
  1: ["fullNameAr", "fullNameEn", "nationalId", "phone", "email", "gender", "nationality", "religion", "birthDate", "birthGovernorate", "idIssuer"],
  2: ["governorate", "city", "district", "street", "buildingNo"],
    3: ["universityType", "universityName", "studyStartYear", "graduationYear", "studyYears", "grade", "highSchoolType", "highSchoolYear", "highSchoolPercent"],
};

// الرقم القومي المصري فيه تاريخ الميلاد والنوع:
// أول رقم = القرن (2 = 1900s، 3 = 2000s)، بعده 6 أرقام = السنة/الشهر/اليوم
// الرقم الـ 13 = فردي للذكر وزوجي للأنثى
function parseNationalId(id: string) {
  if (!/^[23]\d{13}$/.test(id)) return null;
  const century = id[0] === "2" ? 1900 : 2000;
  const year = century + Number(id.slice(1, 3));
  const month = id.slice(3, 5);
  const day = id.slice(5, 7);
  const gender: Gender = Number(id[12]) % 2 === 1 ? "MALE" : "FEMALE";
  return { birthDate: `${year}-${month}-${day}`, gender };
}

const inputClass = "mt-2 w-full bg-white rounded-xl px-4 py-3 text-sm outline-none text-right shadow-sm border border-transparent focus:border-primary";

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="text-sm text-gray-700">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-gray-100 last:border-0 text-sm">
      <span className="text-gray-500 shrink-0">{label}</span>
      <span className="text-gray-900 font-medium text-left">{value || "—"}</span>
    </div>
  );
}
// بيحوّل طلب محفوظ في قاعدة البيانات لشكل الفورم (عشان الاستكمال)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applicationToForm(a: any): GraduateForm {
  const text = (v: unknown) => (v === null || v === undefined ? "" : String(v));
  return {
    fullNameAr: text(a.fullNameAr),
    fullNameEn: text(a.fullNameEn),
    nationalId: text(a.nationalId),
    phone: text(a.phone),
    email: text(a.email),
    gender: a.gender,
    nationality: text(a.nationality),
    religion: text(a.religion),
    birthDate: text(a.birthDate).slice(0, 10),
    birthGovernorate: text(a.birthGovernorate),
    idIssuer: text(a.idIssuer),
    governorate: text(a.governorate),
    city: text(a.city),
    district: text(a.district),
    street: text(a.street),
    buildingNo: text(a.buildingNo),
    apartment: text(a.apartment),
    landmark: text(a.landmark),
    universityType: a.universityType,
    universityName: text(a.universityName),
    universityCountry: text(a.universityCountry),
    studyStartYear: text(a.studyStartYear),
    graduationYear: text(a.graduationYear),
    studyYears: text(a.studyYears),
    grade: text(a.grade),
    highSchoolType: text(a.highSchoolType),
    highSchoolYear: text(a.highSchoolYear),
    highSchoolScore: text(a.highSchoolScore),
    highSchoolPercent: text(a.highSchoolPercent),
    hasPreviousQualification: !!a.hasPreviousQualification,
    previousQualification: text(a.previousQualification),
    previousRejection: !!a.previousRejection,
  };
}

type PageState = "loading" | "guest" | "notGraduate" | "hasOpen" | "ready" | "error";

export default function NewGraduateRegisterPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<GraduateForm>(emptyForm);
  const [documents, setDocuments] = useState<Record<string, string>>({});
  const [declaration, setDeclaration] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ trackingNumber: string; fee: number | null } | null>(null);
  
  // حالة الصفحة: بنتأكد الأول إن الخريج داخل بحسابه، وإذا كان عنده طلب قبل كده
  const [pageState, setPageState] = useState<PageState>("loading");
  const [editingId, setEditingId] = useState<string | null>(null); // لو بيستكمل طلب قديم
  const [adminNote, setAdminNote] = useState<string | null>(null);
  const [openApp, setOpenApp] = useState<{ trackingNumber: string; status: string } | null>(null);

  useEffect(() => {
    fetch("/api/graduates/mine")
      .then(async (res) => {
        if (res.status === 401) {
          setPageState("guest");
          return;
        }
        const data = await res.json();
        if (data.user.role !== "GRADUATE") {
          setPageState("notGraduate");
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const open = data.applications.find((a: any) => a.status !== "REJECTED");

        if (open && open.status !== "NEEDS_COMPLETION") {
          // عنده طلب شغال → مينفعش يعمل طلب تاني
          setOpenApp({ trackingNumber: open.trackingNumber, status: open.status });
          setPageState("hasOpen");
          return;
        }

        if (open) {
          // "مطلوب استكمال" → نفتح نفس الطلب ببياناته عشان يعدّل
          setForm(applicationToForm(open));
          const docs: Record<string, string> = {};
          for (const d of open.documents || []) docs[d.key] = d.url;
          setDocuments(docs);
          setEditingId(open.id);
          setAdminNote(open.adminNote);
        } else {
          // طلب جديد → نملا البيانات اللي عندنا من الحساب
          const parsed = parseNationalId(data.user.nationalId);
          setForm((prev) => ({
            ...prev,
            fullNameAr: data.user.fullName,
            nationalId: data.user.nationalId,
            phone: data.user.phone,
            birthDate: parsed ? parsed.birthDate : prev.birthDate,
            gender: parsed ? parsed.gender : prev.gender,
          }));
        }
        setPageState("ready");
      })
      .catch(() => setPageState("error"));
  }, []);

  // دالة واحدة بتغيّر أي حقل في الفورم
  function update<K extends keyof GraduateForm>(key: K, value: GraduateForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

 

  // المستندات المطلوبة بتتحسب من الإجابات
  const requiredDocs = form.universityType
    ? getRequiredDocuments({
        universityType: form.universityType,
        universityName: form.universityName,
        gender: form.gender,
        nationality: form.nationality,
        studyYears: Number(form.studyYears),
        highSchoolType: form.highSchoolType,
        hasPreviousQualification: form.hasPreviousQualification,
        previousRejection: form.previousRejection,
      })
    : [];

    // فئة الجامعة الخاصة بتتحدد تلقائيًا من نسبة الثانوية
  const category =
    form.universityType === "PRIVATE" && form.highSchoolPercent
      ? determinePrivateCategory(form.universityName, Number(form.highSchoolYear), Number(form.highSchoolPercent))
      : null;

  const fee = form.universityType && form.graduationYear ? calculateFee(form.universityType, Number(form.graduationYear), category ?? undefined) : null;
  const late = form.graduationYear ? lateFee(Number(form.graduationYear)) : 0;

  function validateStep(current: number) {
    const missing = (REQUIRED_BY_STEP[current] || []).filter((key) => !String(form[key]).trim());
    if (missing.length > 0) return "من فضلك استكمل كل الحقول المطلوبة";

    if (current === 1) {
      if (!/^\d{14}$/.test(form.nationalId)) return "الرقم القومي لازم يكون 14 رقم";
      if (!/^01\d{9}$/.test(form.phone)) return "رقم الهاتف لازم يكون 11 رقم ويبدأ بـ 01";
      if (!/^\S+@\S+\.\S+$/.test(form.email)) return "البريد الإلكتروني غير صحيح";
            if (!isNationalityAllowed(form.nationality)) return "لا يتم قيد الجنسيات الأجنبية بالنقابة باستثناء الجنسيتين الفلسطينية والسودانية";
    }
    if (current === 3) {
      if (form.universityType === "FOREIGN" && !form.universityCountry.trim()) return "من فضلك اكتب دولة الجامعة";
      if (Number(form.graduationYear) < Number(form.studyStartYear)) return "سنة التخرج لازم تكون بعد سنة بداية الدراسة";
      if (form.hasPreviousQualification && !form.previousQualification.trim()) return "من فضلك اكتب بيانات المؤهل السابق";
            const percent = Number(form.highSchoolPercent);
      if (!(percent > 0 && percent <= 100)) return "نسبة الثانوية العامة غير صحيحة";
    }
    if (current === 4) {
      const missingDocs = requiredDocs.filter((d) => !documents[d.key]);
      if (missingDocs.length > 0) return `باقي ${missingDocs.length} مستند لازم يترفع`;
    }
    return "";
  }

  function goNext() {
    const message = validateStep(step);
    setError(message);
    if (!message) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function goToStep(target: number) {
    setError("");
    setStep(target);
  }

  async function handleSubmit() {
    if (!declaration) {
      setError("لازم توافق على إقرار صحة البيانات");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
           // طلب جديد → POST، استكمال طلب قديم → PUT على نفس الطلب
      const res = await fetch(editingId ? `/api/graduates/${editingId}` : "/api/graduates", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, documents, declarationAccepted: declaration }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "حصلت مشكلة، حاول مرة تانية");
        return;
      }
      setResult({ trackingNumber: data.trackingNumber, fee: data.fee });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("حصلت مشكلة في الاتصال، حاول مرة تانية");
    } finally {
      setSubmitting(false);
    }
  }

  const universityOptions = form.universityType === "GOVERNMENT" ? GOVERNMENT_UNIVERSITIES : form.universityType === "PRIVATE" ? PRIVATE_UNIVERSITIES : [];
  const universityTypeLabel = UNIVERSITY_TYPES.find((t) => t.value === form.universityType)?.label || "";
  // ======================= شاشات قبل الفورم =======================
  if (pageState !== "ready" && !result) {
    return (
      <main>
        <PageHeader title="طلب القيد بسجلات نقابة الصيادلة" subtitle="الخدمة متاحة لحسابات الخريجين الجدد" />
        <section className="bg-surface-muted py-16">
          <div className="max-w-md mx-auto px-6">
            {pageState === "loading" && <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />}

            {pageState === "error" && <p className="text-center text-gray-500">حصلت مشكلة في التحميل، حاول تحديث الصفحة.</p>}

            {pageState === "guest" && (
              <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                <Lock className="w-12 h-12 text-primary mx-auto" />
                <h2 className="mt-4 font-bold text-gray-900">لازم يكون عندك حساب الأول</h2>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">أنشئ حساب خريج برقم هاتفك ورقمك القومي، وبعدها تقدر تقدّم طلب القيد وتتابعه.</p>
                <a href="/signup" className="mt-6 block w-full bg-primary text-white py-3 rounded-pill font-medium">
                  إنشاء حساب خريج
                </a>
                <p className="mt-4 text-sm text-gray-500">عندك حساب؟ سجّل دخول من الزرار اللي فوق.</p>
              </div>
            )}

            {pageState === "notGraduate" && (
              <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                <Info className="w-12 h-12 text-primary mx-auto" />
                <h2 className="mt-4 font-bold text-gray-900">حسابك مقيد بالفعل</h2>
                <p className="mt-2 text-sm text-gray-500">خدمة طلب القيد متاحة لحسابات الخريجين الجدد فقط.</p>
                <a href="/services" className="mt-6 block w-full bg-primary text-white py-3 rounded-pill font-medium">
                  خدمات الأعضاء
                </a>
              </div>
            )}

            {pageState === "hasOpen" && openApp && (
              <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                <FileText className="w-12 h-12 text-primary mx-auto" />
                <h2 className="mt-4 font-bold text-gray-900">لديك طلب قيد بالفعل</h2>
                <p className="mt-3 font-bold text-primary text-xl" dir="ltr">{openApp.trackingNumber}</p>
                <span className={`inline-block mt-3 text-xs px-3 py-1 rounded-full font-medium ${GRADUATE_STATUS_LABELS[openApp.status]?.color}`}>
                  {GRADUATE_STATUS_LABELS[openApp.status]?.label}
                </span>
                <a href="/my-requests" className="mt-6 block w-full bg-primary text-white py-3 rounded-pill font-medium">
                  متابعة طلباتي
                </a>
              </div>
            )}
          </div>
        </section>
      </main>
    );
  }

  // ======================= شاشة النجاح =======================
  if (result) {
    return (
      <main>
                <PageHeader title={editingId ? "تم إعادة إرسال طلب القيد" : "تم إرسال طلب القيد"} subtitle="تقدر تتابع حالة طلبك في أي وقت من صفحة «طلباتي»" />
        <section className="bg-surface-muted py-14">
          <div className="max-w-2xl mx-auto px-6">
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
              <CheckCircle2 className="w-16 h-16 text-primary-light mx-auto" />
              <p className="mt-4 text-gray-500 text-sm">رقم المتابعة</p>
              <p className="mt-1 text-3xl font-bold text-primary" dir="ltr">{result.trackingNumber}</p>

              <div className="mt-6 bg-surface-muted rounded-xl p-4 text-sm text-gray-700">
                {result.fee !== null ? (
                  <p>
                    الرسوم المستحقة: <span className="font-bold text-gray-900">{result.fee.toLocaleString("ar-EG")} جنيه</span>
                  </p>
                ) : (
                  <p>سيتم تحديد فئة الجامعة والرسوم المستحقة بعد مراجعة النقابة لطلبك، وسيتم إخطارك بها.</p>
                )}
              </div>

              <div className="mt-6 text-right bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 leading-relaxed">
                <p className="font-bold mb-1">الخطوات التالية:</p>
                <p>١. سيقوم موظف النقابة بمراجعة طلبك، وفي حال وجود نقص سيتم إخطارك لاستكماله.</p>
                <p>٢. بعد الموافقة، سيتم إخطارك بموعد الحضور للنقابة لتسليم أصول المستندات المميزة بعلامة «أصل» وختم إيصال الدفع.</p>
              </div>

                           <a href="/my-requests" className="mt-6 block w-full bg-primary text-white py-3 rounded-pill font-medium">
                متابعة طلباتي
              </a>

              <button type="button" onClick={() => window.print()} className="mt-3 w-full border border-primary text-primary py-3 rounded-pill font-medium flex items-center justify-center gap-2">
                <Printer className="w-4 h-4" />
                طباعة الطلب
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ======================= الفورم =======================
  return (
    <main>
      <PageHeader title="طلب القيد بسجلات نقابة الصيادلة" subtitle="استكمل بياناتك وارفع المستندات المطلوبة لإرسال طلب القيد للمراجعة." />

      <section className="bg-surface-muted py-14">
        <div className="max-w-3xl mx-auto px-6">
          <RegisterSteps steps={steps} current={step} onStepClick={goToStep} />
          
          {editingId && (
            <div className="mb-6 flex items-start gap-2 bg-red-50 text-red-800 text-sm rounded-xl px-4 py-3 border border-red-200 leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">طلبك محتاج استكمال</p>
                {adminNote && <p className="mt-1">ملاحظة النقابة: {adminNote}</p>}
                <p className="mt-1 text-red-700">عدّل المطلوب وارفع المستندات من جديد، وبعدين ابعت الطلب تاني من خطوة المراجعة.</p>
              </div>
            </div>
          )}

          {/* ---------- الخطوة 1: البيانات الشخصية ---------- */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="الاسم بالكامل (عربي)">
                <input type="text" value={form.fullNameAr} onChange={(e) => update("fullNameAr", e.target.value)} placeholder="الاسم رباعي كما في البطاقة" className={inputClass} />
              </Field>
              <Field label="الاسم بالكامل (إنجليزي)">
                <input type="text" value={form.fullNameEn} onChange={(e) => update("fullNameEn", e.target.value)} placeholder="Full name as in passport" className={inputClass} dir="ltr" />
              </Field>
                            <Field label="الرقم القومي" hint="من حسابك — تاريخ الميلاد والنوع بيتملوا منه تلقائيًا">
                <input type="text" value={form.nationalId} readOnly className={`${inputClass} bg-gray-100 text-gray-500 cursor-not-allowed`} dir="ltr" />
              </Field>
              <Field label="جهة إصدار البطاقة">
                <input type="text" value={form.idIssuer} onChange={(e) => update("idIssuer", e.target.value)} placeholder="مثال: سجل مدني الدقي" className={inputClass} />
              </Field>
                           <Field label="رقم الهاتف" hint="من حسابك">
                <input type="tel" value={form.phone} readOnly className={`${inputClass} bg-gray-100 text-gray-500 cursor-not-allowed`} dir="ltr" />
              </Field>
              <Field label="البريد الإلكتروني">
                <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="name@example.com" className={inputClass} dir="ltr" />
              </Field>
              <Field label="النوع">
                <select value={form.gender} onChange={(e) => update("gender", e.target.value as Gender)} className={inputClass}>
                  <option value="">اختر</option>
                  <option value="MALE">ذكر</option>
                  <option value="FEMALE">أنثى</option>
                </select>
              </Field>
              <Field label="تاريخ الميلاد">
                <input type="date" value={form.birthDate} onChange={(e) => update("birthDate", e.target.value)} className={inputClass} />
              </Field>
                            <Field label="الجنسية">
                <select value={form.nationality} onChange={(e) => update("nationality", e.target.value)} className={inputClass}>
                  {NATIONALITIES.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </Field>
              <Field label="الديانة">
                <select value={form.religion} onChange={(e) => update("religion", e.target.value)} className={inputClass}>
                  <option value="">اختر</option>
                  <option value="مسلم">مسلم</option>
                  <option value="مسيحي">مسيحي</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </Field>
              <Field label="محافظة الميلاد">
                <select value={form.birthGovernorate} onChange={(e) => update("birthGovernorate", e.target.value)} className={inputClass}>
                  <option value="">اختر المحافظة</option>
                  {GOVERNORATES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                  <option value="خارج مصر">خارج مصر</option>
                </select>
              </Field>
            </div>
          )}

          {/* ---------- الخطوة 2: محل الإقامة ---------- */}
          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="المحافظة">
                <select value={form.governorate} onChange={(e) => update("governorate", e.target.value)} className={inputClass}>
                  <option value="">اختر المحافظة</option>
                  {GOVERNORATES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </Field>
              <Field label="المدينة / المركز">
                <input type="text" value={form.city} onChange={(e) => update("city", e.target.value)} className={inputClass} />
              </Field>
              <Field label="الحي / القرية">
                <input type="text" value={form.district} onChange={(e) => update("district", e.target.value)} className={inputClass} />
              </Field>
              <Field label="الشارع">
                <input type="text" value={form.street} onChange={(e) => update("street", e.target.value)} className={inputClass} />
              </Field>
              <Field label="رقم العقار">
                <input type="text" value={form.buildingNo} onChange={(e) => update("buildingNo", e.target.value)} className={inputClass} />
              </Field>
              <Field label="رقم الشقة (اختياري)">
                <input type="text" value={form.apartment} onChange={(e) => update("apartment", e.target.value)} className={inputClass} />
              </Field>
              <div className="md:col-span-2">
                <Field label="علامة مميزة (اختياري)">
                  <input type="text" value={form.landmark} onChange={(e) => update("landmark", e.target.value)} placeholder="مثال: بجوار مسجد ..." className={inputClass} />
                </Field>
              </div>
            </div>
          )}

          {/* ---------- الخطوة 3: البيانات الأكاديمية ---------- */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="text-sm text-gray-700">نوع الجامعة</label>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {UNIVERSITY_TYPES.map((t) => (
                    <label key={t.value} className={`text-center rounded-xl py-3 text-sm cursor-pointer border bg-white ${form.universityType === t.value ? "border-primary text-primary font-bold" : "border-transparent shadow-sm text-gray-600"}`}>
                      <input type="radio" className="hidden" checked={form.universityType === t.value} onChange={() => setForm((prev) => ({ ...prev, universityType: t.value, universityName: "", universityCountry: "" }))} />
                      {t.label}
                    </label>
                  ))}
                </div>
              </div>

              {form.universityType && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {form.universityType === "FOREIGN" ? (
                    <>
                      <Field label="دولة الجامعة">
                        <input type="text" value={form.universityCountry} onChange={(e) => update("universityCountry", e.target.value)} className={inputClass} />
                      </Field>
                      <Field label="اسم الجامعة">
                        <input type="text" value={form.universityName} onChange={(e) => update("universityName", e.target.value)} className={inputClass} />
                      </Field>
                    </>
                  ) : (
                    <div className="md:col-span-2">
                      <Field label="اسم الجامعة">
                        <select value={form.universityName} onChange={(e) => update("universityName", e.target.value)} className={inputClass}>
                          <option value="">اختر الجامعة</option>
                          {universityOptions.map((u) => (
                            <option key={u} value={u}>{u}</option>
                          ))}
                        </select>
                      </Field>
                    </div>
                  )}

                  <Field label="سنة بداية الدراسة">
                    <select value={form.studyStartYear} onChange={(e) => update("studyStartYear", e.target.value)} className={inputClass}>
                      <option value="">اختر السنة</option>
                      {YEARS.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="سنة التخرج">
                    <select value={form.graduationYear} onChange={(e) => update("graduationYear", e.target.value)} className={inputClass}>
                      <option value="">اختر السنة</option>
                      {YEARS.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="مدة الدراسة (بالسنوات)">
                    <select value={form.studyYears} onChange={(e) => update("studyYears", e.target.value)} className={inputClass}>
                      <option value="">اختر</option>
                      {STUDY_YEARS.map((y) => (
                        <option key={y} value={y}>{y} سنوات</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="التقدير العام">
                    <select value={form.grade} onChange={(e) => update("grade", e.target.value)} className={inputClass}>
                      <option value="">اختر</option>
                      {GRADES.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="نوع شهادة الثانوية">
                    <select value={form.highSchoolType} onChange={(e) => update("highSchoolType", e.target.value)} className={inputClass}>
                      <option value="">اختر</option>
                      {HIGH_SCHOOL_TYPES.map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="سنة الحصول على الثانوية">
                    <select value={form.highSchoolYear} onChange={(e) => update("highSchoolYear", e.target.value)} className={inputClass}>
                      <option value="">اختر السنة</option>
                      {YEARS.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </Field>
                  
                  {form.highSchoolType === "ثانوية عامة مصرية" ? (
                    <Field label={`مجموع الثانوية العامة (من ${HIGH_SCHOOL_TOTAL})`} hint={form.highSchoolPercent ? `النسبة: ${form.highSchoolPercent}%` : undefined}>
                      <input type="number" step="0.5" min="0" max={HIGH_SCHOOL_TOTAL} value={form.highSchoolScore} onChange={(e) => {
                        const score = e.target.value;
                        const percent = score ? ((Number(score) / HIGH_SCHOOL_TOTAL) * 100).toFixed(2) : "";
                        setForm((prev) => ({ ...prev, highSchoolScore: score, highSchoolPercent: percent }));
                      }} placeholder="مثال: 369" className={inputClass} dir="ltr" />
                    </Field>
                  ) : (
                    <Field label="النسبة المئوية للثانوية (%)" hint="كما هي مذكورة في إفادة النسبة المعادلة">
                      <input type="number" step="0.01" min="0" max="100" value={form.highSchoolPercent} onChange={(e) => setForm((prev) => ({ ...prev, highSchoolScore: "", highSchoolPercent: e.target.value }))} placeholder="مثال: 90" className={inputClass} dir="ltr" />
                    </Field>
                  )}
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
                <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={form.hasPreviousQualification} onChange={(e) => update("hasPreviousQualification", e.target.checked)} className="w-4 h-4 accent-primary" />
                  لدي مؤهل جامعي سابق
                </label>
                {form.hasPreviousQualification && (
                  <input type="text" value={form.previousQualification} onChange={(e) => update("previousQualification", e.target.value)} placeholder="اكتب المؤهل السابق والجهة وسنة الحصول عليه" className={`${inputClass} bg-surface-muted`} />
                )}
                {form.universityType === "FOREIGN" && (
                  <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={form.previousRejection} onChange={(e) => update("previousRejection", e.target.checked)} className="w-4 h-4 accent-primary" />
                    سبق رفض طلب قيدي من النقابة
                  </label>
                )}
              </div>
            </div>
          )}

          {/* ---------- الخطوة 4: المستندات ---------- */}
          {step === 4 && (
            <div>
              <div className="flex items-start gap-2 bg-yellow-50 text-yellow-800 text-sm rounded-xl px-4 py-3 border border-yellow-200 leading-relaxed">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>ارفع صورة واضحة من كل مستند (PDF أو JPG). المستندات المميزة بعلامة «أصل» هترفع صورتها دلوقتي، وتسلّم الأصل نفسه عند حضورك للنقابة.</span>
              </div>

              <div className="mt-6 bg-white rounded-2xl px-5 py-2 shadow-sm">
                {requiredDocs.map((doc) => (
                  <DocumentUploadRow key={doc.key} label={doc.label} original={doc.original} uploaded={!!documents[doc.key]} onUpload={(url) => setDocuments((prev) => {
                    const next = { ...prev };
                    if (url) next[doc.key] = url;
                    else delete next[doc.key];
                    return next;
                  })} />
                ))}
              </div>

              <p className="mt-3 text-xs text-gray-500">
                تم رفع {requiredDocs.filter((d) => documents[d.key]).length} من {requiredDocs.length} مستند
              </p>
            </div>
          )}

          {/* ---------- الخطوة 5: المراجعة والإقرار ---------- */}
          {step === 5 && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <h3 className="font-bold text-gray-900 mb-2">البيانات الشخصية</h3>
                <ReviewRow label="الاسم (عربي)" value={form.fullNameAr} />
                <ReviewRow label="الاسم (إنجليزي)" value={form.fullNameEn} />
                <ReviewRow label="الرقم القومي" value={form.nationalId} />
                <ReviewRow label="رقم الهاتف" value={form.phone} />
                <ReviewRow label="البريد الإلكتروني" value={form.email} />
                <ReviewRow label="تاريخ الميلاد" value={form.birthDate} />
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-5">
                <h3 className="font-bold text-gray-900 mb-2">محل الإقامة</h3>
                <ReviewRow label="العنوان" value={[form.buildingNo && `عقار ${form.buildingNo}`, form.street, form.district, form.city, form.governorate].filter(Boolean).join("، ")} />
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-5">
                <h3 className="font-bold text-gray-900 mb-2">البيانات الأكاديمية</h3>
                <ReviewRow label="الجامعة" value={`${form.universityName} (${universityTypeLabel})`} />
                <ReviewRow label="سنة التخرج" value={form.graduationYear} />
                <ReviewRow label="التقدير" value={form.grade} />
                                <ReviewRow label="نسبة الثانوية" value={form.highSchoolPercent ? `${form.highSchoolPercent}%` : ""} />
                {category && <ReviewRow label="الفئة" value={CATEGORY_LABELS[category]} />}
                <ReviewRow label="المستندات المرفوعة" value={`${requiredDocs.length} مستند`} />
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-5">
                <h3 className="font-bold text-gray-900 mb-2">الرسوم</h3>
                {fee !== null ? (
                  <>
                    <ReviewRow label="رسوم القيد" value={`${(fee - late).toLocaleString("ar-EG")} جنيه`} />
                    {late > 0 && <ReviewRow label="غرامة تأخير" value={`${late.toLocaleString("ar-EG")} جنيه`} />}
                    <ReviewRow label="الإجمالي" value={`${fee.toLocaleString("ar-EG")} جنيه`} />
                  </>
                ) : (
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>رسوم الجامعات الخاصة والخارجية بتتحدد حسب فئة الجامعة، وهيتم إخطارك بيها بعد مراجعة النقابة.</span>
                  </div>
                )}
              </div>

              <label className="flex items-start gap-3 bg-white rounded-2xl shadow-sm p-5 text-sm text-gray-700 cursor-pointer leading-relaxed">
                <input type="checkbox" checked={declaration} onChange={(e) => setDeclaration(e.target.checked)} className="w-4 h-4 mt-1 accent-primary shrink-0" />
                أقر بأن جميع البيانات والمستندات المقدمة صحيحة، وأتحمل المسؤولية القانونية الكاملة في حال ثبوت عدم صحة أي منها.
              </label>
            </div>
          )}

          {error && (
            <div className="mt-6 flex items-center gap-2 bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="mt-8 flex gap-3">
            {step > 1 && (
              <button type="button" onClick={() => goToStep(step - 1)} className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-pill font-medium">
                السابق
              </button>
            )}
            {step < 5 ? (
              <button type="button" onClick={goNext} className="flex-1 bg-primary text-white py-3 rounded-pill font-medium">
                التالي
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={submitting} className="flex-1 bg-primary text-white py-3 rounded-pill font-medium disabled:opacity-60">
                                {submitting ? "جاري الإرسال..." : editingId ? "إعادة إرسال الطلب" : "إرسال الطلب"}
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}