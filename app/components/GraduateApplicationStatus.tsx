import { AlertCircle, CheckCircle2 } from "lucide-react";
import { GRADUATE_STATUS_LABELS } from "../lib/graduate";

// =====================================================================
// كارت حالة طلب القيد (بيظهر للخريج في صفحة «طلب القيد»)
// =====================================================================

export interface GraduateApplicationView {
  id: string;
  trackingNumber: string;
  status: string;
  universityName: string;
  fee: number | null;
  adminNote: string | null;
  documents: { key: string }[];
  createdAt: string;
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
    <div className="mt-6 flex items-center gap-1.5">
      {STAGES.map((stage, i) => (
        <div key={stage.status} className="flex-1 text-center">
          <div className={`h-2 rounded-full ${i <= current ? "bg-primary" : "bg-[#E3ECE7]"}`} />
          <p className={`mt-2 text-[11px] sm:text-xs ${i === current ? "text-primary font-bold" : "text-ink-muted"}`}>{stage.label}</p>
        </div>
      ))}
    </div>
  );
}

export default function GraduateApplicationStatus({ app }: { app: GraduateApplicationView }) {
  return (
    <div className="bg-white rounded-3xl border border-line shadow-card p-6 md:p-7 text-right">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-xs text-ink-muted">رقم متابعة طلب القيد</p>
          <p className="font-extrabold text-primary text-xl mt-0.5" dir="ltr">{app.trackingNumber}</p>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full font-bold ${GRADUATE_STATUS_LABELS[app.status]?.color}`}>
          {GRADUATE_STATUS_LABELS[app.status]?.label}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-ink-muted flex-wrap">
        <span>{app.universityName}</span>
        <span>{app.documents.length} مستند</span>
        <span>{app.fee !== null ? `${app.fee.toLocaleString("ar-EG")} جنيه` : "الرسوم تُحدد بعد المراجعة"}</span>
        <span>تاريخ التقديم: {new Date(app.createdAt).toLocaleDateString("ar-EG")}</span>
      </div>

      <ProgressBar status={app.status} />

      {app.status === "REJECTED" && app.adminNote && (
        <div className="mt-5 bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-800">
          <span className="font-bold">سبب الرفض: </span>
          {app.adminNote}
        </div>
      )}

      {app.status === "AWAITING_ORIGINALS" && (
        <div className="mt-5 bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-800 leading-relaxed">
          تم قبول طلبك مبدئيًا. يرجى الحضور إلى النقابة لتسليم أصول المستندات المميزة بكلمة «أصل» وختم إيصال الدفع.
          {app.adminNote && <p className="mt-1">{app.adminNote}</p>}
        </div>
      )}

      {app.status !== "REJECTED" && app.status !== "AWAITING_ORIGINALS" && app.adminNote && (
        <div className="mt-5 bg-surface-muted border border-line rounded-2xl p-4 text-sm text-ink">
          <span className="font-bold flex items-center gap-1.5 mb-1">
            <AlertCircle className="w-4 h-4 text-primary" />
            ملاحظة النقابة
          </span>
          {app.adminNote}
        </div>
      )}

      {app.status === "REGISTERED" && (
        <div className="mt-5 bg-green-50 border border-green-200 rounded-2xl p-4 text-sm text-green-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          مبروك! تم قيدك بسجلات النقابة.
        </div>
      )}
    </div>
  );
}
