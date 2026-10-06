"use client";

import { useEffect, useState } from "react";
import { Loader2, Lock, FileText, AlertCircle, CheckCircle2, BadgeCheck } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { GRADUATE_STATUS_LABELS } from "../lib/graduate";

interface Application {
  id: string;
  trackingNumber: string;
  status: string;
  universityName: string;
  fee: number | null;
  adminNote: string | null;
  documents: { key: string }[];
  createdAt: string;
  updatedAt: string;
}

interface MineResponse {
  user: { fullName: string; role: string; membershipNumber: string | null };
  applications: Application[];
}

// مراحل طلب القيد بالترتيب (عشان نرسم شريط التقدم)
const STAGES = [
  { status: "AWAITING_PAYMENT", label: "الدفع" },
  { status: "UNDER_REVIEW", label: "المراجعة" },
  { status: "AWAITING_ORIGINALS", label: "تسليم الأصول" },
  { status: "LICENSING", label: "التراخيص" },
  { status: "REGISTERED", label: "تم القيد" },
];

function stageIndex(status: string) {
  if (status === "NEEDS_COMPLETION") return 1; // راجع لمرحلة المراجعة
  return STAGES.findIndex((s) => s.status === status);
}

function ProgressBar({ status }: { status: string }) {
  const current = stageIndex(status);
  if (status === "REJECTED") return null;
  return (
    <div className="mt-5 flex items-center gap-1">
      {STAGES.map((stage, i) => (
        <div key={stage.status} className="flex-1 text-center">
          <div className={`h-1.5 rounded-full ${i <= current ? "bg-primary" : "bg-gray-200"}`} />
          <p className={`mt-1.5 text-[10px] sm:text-xs ${i === current ? "text-primary font-bold" : "text-gray-400"}`}>{stage.label}</p>
        </div>
      ))}
    </div>
  );
}

export default function MyRequestsPage() {
  const [data, setData] = useState<MineResponse | null>(null);
  const [state, setState] = useState<"loading" | "guest" | "ready" | "error">("loading");

  useEffect(() => {
    fetch("/api/graduates/mine")
      .then(async (res) => {
        if (res.status === 401) {
          setState("guest");
          return;
        }
        setData(await res.json());
        setState("ready");
      })
      .catch(() => setState("error"));
  }, []);

  return (
    <main>
      <PageHeader title="طلباتي" subtitle="تابع حالة طلباتك لدى النقابة" />
      <section className="bg-surface-muted py-14">
        <div className="max-w-2xl mx-auto px-6 space-y-5">
          {state === "loading" && <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />}

          {state === "error" && <p className="text-center text-gray-500">حصلت مشكلة في التحميل، حاول تحديث الصفحة.</p>}

          {state === "guest" && (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
              <Lock className="w-12 h-12 text-primary mx-auto" />
              <h2 className="mt-4 font-bold text-gray-900">سجّل دخول عشان تشوف طلباتك</h2>
              <p className="mt-2 text-sm text-gray-500">دوس «تسجيل دخول» من فوق، أو أنشئ حساب جديد.</p>
              <a href="/signup" className="mt-6 block w-full bg-primary text-white py-3 rounded-pill font-medium">
                إنشاء حساب خريج
              </a>
            </div>
          )}

          {state === "ready" && data && (
            <>
              {/* عضو مقيد */}
              {data.user.membershipNumber && (
                <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
                  <BadgeCheck className="w-10 h-10 text-primary-light shrink-0" />
                  <div>
                    <p className="font-bold text-gray-900">أنت عضو مقيد بالنقابة</p>
                    <p className="text-sm text-gray-500 mt-1">
                      رقم القيد: <span className="font-bold text-primary" dir="ltr">{data.user.membershipNumber}</span>
                    </p>
                  </div>
                </div>
              )}

              {/* خريج لسه ما قدمش */}
              {data.applications.length === 0 && data.user.role === "GRADUATE" && (
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                  <FileText className="w-12 h-12 text-primary mx-auto" />
                  <h2 className="mt-4 font-bold text-gray-900">لسه ما قدمتش طلب القيد</h2>
                  <p className="mt-2 text-sm text-gray-500">قدّم طلبك وارفع المستندات المطلوبة.</p>
                  <a href="/register/new-graduate" className="mt-6 block w-full bg-primary text-white py-3 rounded-pill font-medium">
                    تقديم طلب القيد
                  </a>
                </div>
              )}

              {/* طلبات القيد */}
              {data.applications.map((app) => (
                <div key={app.id} className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="text-xs text-gray-400">طلب القيد بسجلات النقابة</p>
                      <p className="font-bold text-primary text-lg mt-0.5" dir="ltr">{app.trackingNumber}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${GRADUATE_STATUS_LABELS[app.status]?.color}`}>
                      {GRADUATE_STATUS_LABELS[app.status]?.label}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                    <span>{app.universityName}</span>
                    <span>{app.documents.length} مستند</span>
                    <span>{app.fee !== null ? `${app.fee.toLocaleString("ar-EG")} جنيه` : "الرسوم تُحدد بعد المراجعة"}</span>
                    <span>تاريخ التقديم: {new Date(app.createdAt).toLocaleDateString("ar-EG")}</span>
                  </div>

                  <ProgressBar status={app.status} />

                  {app.status === "NEEDS_COMPLETION" && (
                    <div className="mt-5 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800">
                      <p className="font-bold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        طلبك محتاج استكمال
                      </p>
                      {app.adminNote && <p className="mt-1">ملاحظة النقابة: {app.adminNote}</p>}
                      <a href="/register/new-graduate" className="mt-3 block w-full bg-primary text-white text-center py-2.5 rounded-pill font-medium">
                        استكمال الطلب
                      </a>
                    </div>
                  )}

                  {app.status === "REJECTED" && app.adminNote && (
                    <div className="mt-5 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700">
                      <span className="font-bold">سبب الرفض: </span>
                      {app.adminNote}
                    </div>
                  )}

                  {app.status === "AWAITING_ORIGINALS" && (
                    <div className="mt-5 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                      تم قبول طلبك مبدئيًا. برجاء الحضور للنقابة لتسليم أصول المستندات المميزة بكلمة «أصل» وختم إيصال الدفع.
                      {app.adminNote && <p className="mt-1">{app.adminNote}</p>}
                    </div>
                  )}

                  {app.status === "REGISTERED" && (
                    <div className="mt-5 bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      مبروك! تم قيدك بسجلات النقابة.
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </section>
    </main>
  );
}