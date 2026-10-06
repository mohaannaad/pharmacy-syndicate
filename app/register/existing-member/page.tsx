"use client";

import { useState } from "react";
import { AlertCircle, Eye, EyeOff, Info, Smartphone, RefreshCw, CheckCircle2, Clock } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import RegisterSteps from "../../components/RegisterSteps";
import DocumentUploadRow from "../../components/DocumentUploadRow";

const steps = ["التحقق من العضوية", "رقم الهاتف", "التأكيد وكلمة المرور"];
const inputClass = "mt-2 w-full bg-white rounded-xl px-4 py-3 text-sm outline-none text-right shadow-sm border border-transparent focus:border-primary";

export default function ExistingMemberRegisterPage() {
  const [step, setStep] = useState(1);

  // الخطوة 1
  const [membershipNumber, setMembershipNumber] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [memberName, setMemberName] = useState("");
  const [maskedPhone, setMaskedPhone] = useState("");

  // الخطوة 2
  const [phoneChoice, setPhoneChoice] = useState<"same" | "changed">("same");
  const [newPhone, setNewPhone] = useState("");
  const [idFrontUrl, setIdFrontUrl] = useState<string | null>(null);
  const [idBackUrl, setIdBackUrl] = useState<string | null>(null);

  // الخطوة 3
  const [sentTo, setSentTo] = useState("");
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingDone, setPendingDone] = useState(false);

  const changingPhone = phoneChoice === "changed";

  async function post(url: string, payload: Record<string, unknown>) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "حصلت مشكلة");
    return data;
  }

  async function run(action: () => Promise<void>) {
    setError("");
    setLoading(true);
    try {
      await action();
    } catch (e) {
      const message = (e as Error).message;
      setError(message === "Failed to fetch" ? "حصلت مشكلة في الاتصال، حاول مرة تانية" : message);
    } finally {
      setLoading(false);
    }
  }

  // الخطوة 1: نسأل النقابة عن رقم القيد والرقم القومي
  function verifyMember() {
    run(async () => {
      const data = await post("/api/auth/member/verify", { membershipNumber, nationalId });
      setMemberName(data.fullName);
      setMaskedPhone(data.maskedPhone);
      setStep(2);
    });
  }

  // الخطوة 2: نبعت رمز التحقق (على الرقم القديم أو الجديد)
  function sendCode() {
    if (changingPhone && (!idFrontUrl || !idBackUrl)) {
      setError("ارفع صورة البطاقة من الوش والضهر");
      return;
    }
    run(async () => {
      const data = await post("/api/auth/member/otp", { membershipNumber, nationalId, newPhone: changingPhone ? newPhone : "" });
      setSentTo(data.sentTo);
      setDemoCode(data.demoCode);
      setStep(3);
    });
  }

  // الخطوة 3: إنشاء الحساب (أو إرسال الطلب للمراجعة)
  function submit() {
    if (password.length < 8) return setError("كلمة المرور لازم تكون 8 حروف أو أرقام على الأقل");
    if (password !== confirm) return setError("كلمتين المرور مش متطابقين");
    run(async () => {
      const data = await post("/api/auth/member/signup", {
        membershipNumber,
        nationalId,
        newPhone: changingPhone ? newPhone : "",
        idFrontUrl,
        idBackUrl,
        code,
        password,
      });
      if (data.mode === "created") {
        window.location.href = "/my-requests";
      } else {
        setPendingDone(true);
      }
    });
  }

  const buttonLabel = step === 1 ? "تحقق من البيانات" : step === 2 ? "إرسال رمز التحقق" : changingPhone ? "إرسال الطلب للمراجعة" : "إنشاء الحساب";
  const buttonAction = step === 1 ? verifyMember : step === 2 ? sendCode : submit;

  return (
    <main>
      <PageHeader title="تسجيل عضو حالي" subtitle="لو انت عضو مقيد بالنقابة، اعمل حسابك الإلكتروني برقم القيد والرقم القومي" />

      <section className="bg-surface-muted py-14">
        <div className="max-w-md mx-auto px-6">
          {pendingDone ? (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
              <Clock className="w-12 h-12 text-primary mx-auto" />
              <h2 className="mt-4 font-bold text-gray-900">طلبك اتبعت للمراجعة</h2>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                موظف النقابة هيراجع صورة البطاقة والرقم الجديد. أول ما الطلب يتقبل هيوصلك رسالة على <span dir="ltr">{newPhone}</span>، وتقدر تدخل برقم القيد وكلمة المرور اللي اخترتها.
              </p>
              <a href="/" className="mt-6 block w-full bg-primary text-white py-3 rounded-pill font-medium">
                الرجوع للرئيسية
              </a>
            </div>
          ) : (
            <>
              <RegisterSteps steps={steps} current={step} onStepClick={(s) => { setError(""); setStep(s); }} />

              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <label className="text-sm text-gray-700">رقم القيد</label>
                    <input type="text" inputMode="numeric" value={membershipNumber} onChange={(e) => setMembershipNumber(e.target.value.replace(/\D/g, ""))} placeholder="رقم القيد بالنقابة" className={inputClass} dir="ltr" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">الرقم القومي</label>
                    <input type="text" inputMode="numeric" value={nationalId} onChange={(e) => setNationalId(e.target.value.replace(/\D/g, "").slice(0, 14))} placeholder="14 رقم" className={inputClass} dir="ltr" />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">بياناتك موجودة في سجلات النقابة</p>
                      <p className="font-bold text-gray-900">{memberName}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700">هنبعت رمز التحقق على موبايلك:</p>

                  <button type="button" onClick={() => setPhoneChoice("same")} className={`w-full flex items-center gap-3 bg-white rounded-xl p-4 text-right border-2 ${phoneChoice === "same" ? "border-primary" : "border-transparent"}`}>
                    <Smartphone className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-gray-900">الرقم ده معايا</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        الرقم المسجل في النقابة: <span dir="ltr">{maskedPhone}</span>
                      </p>
                    </div>
                  </button>

                  <button type="button" onClick={() => setPhoneChoice("changed")} className={`w-full flex items-center gap-3 bg-white rounded-xl p-4 text-right border-2 ${phoneChoice === "changed" ? "border-primary" : "border-transparent"}`}>
                    <RefreshCw className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-gray-900">غيّرت رقمي</p>
                      <p className="text-xs text-gray-500 mt-0.5">هتكتب رقمك الجديد وترفع صورة البطاقة، والموظف هيراجع طلبك</p>
                    </div>
                  </button>

                  {changingPhone && (
                    <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
                      <div>
                        <label className="text-sm text-gray-700">رقم الموبايل الجديد</label>
                        <input type="tel" inputMode="numeric" value={newPhone} onChange={(e) => setNewPhone(e.target.value.replace(/\D/g, "").slice(0, 11))} placeholder="01xxxxxxxxx" className={`${inputClass} bg-surface-muted`} dir="ltr" />
                      </div>
                      <div>
                        <DocumentUploadRow label="صورة البطاقة (الوش)" uploaded={!!idFrontUrl} onUpload={setIdFrontUrl} />
                        <DocumentUploadRow label="صورة البطاقة (الضهر)" uploaded={!!idBackUrl} onUpload={setIdBackUrl} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  {demoCode && (
                    <div className="flex items-start gap-2 bg-yellow-50 text-yellow-800 text-sm rounded-xl px-4 py-3 border border-yellow-200">
                      <Info className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>
                        وضع تجريبي: الرسائل لسه مش متفعلة. رمز التحقق هو <b dir="ltr">{demoCode}</b>
                      </span>
                    </div>
                  )}
                  <div>
                    <label className="text-sm text-gray-700">رمز التحقق</label>
                    <input type="text" inputMode="numeric" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="الرمز المكون من 6 أرقام" className={`${inputClass} text-center tracking-widest`} dir="ltr" />
                    <p className="mt-1 text-xs text-gray-400">
                      اتبعت على <span dir="ltr">{sentTo}</span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">كلمة المرور</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8 حروف أو أرقام على الأقل" className={`${inputClass} pl-11`} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 translate-y-[-25%] text-gray-400">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">تأكيد كلمة المرور</label>
                    <input type={showPassword ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputClass} />
                  </div>
                  {changingPhone && (
                    <p className="text-xs text-gray-500 bg-white rounded-xl px-4 py-3">
                      حسابك هيتفعّل بعد ما موظف النقابة يراجع صورة البطاقة والرقم الجديد.
                    </p>
                  )}
                </div>
              )}

              {error && (
                <div className="mt-6 flex items-center gap-2 bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3 border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <button type="button" onClick={buttonAction} disabled={loading} className="mt-8 w-full bg-primary text-white py-3 rounded-pill font-medium disabled:opacity-60">
                {loading ? "جاري التنفيذ..." : buttonLabel}
              </button>

              {step === 3 && (
                <button type="button" onClick={sendCode} disabled={loading} className="mt-3 w-full text-sm text-primary">
                  إعادة إرسال الرمز
                </button>
              )}

              <p className="mt-6 text-center text-sm text-gray-500">
                خريج جديد ولسه ملكش رقم قيد؟ <a href="/signup" className="text-primary font-bold">اعمل حساب خريج</a>
              </p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}