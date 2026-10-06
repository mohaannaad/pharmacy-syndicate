"use client";

import { useState } from "react";
import { AlertCircle, Eye, EyeOff, Info } from "lucide-react";
import PageHeader from "../components/PageHeader";
import RegisterSteps from "../components/RegisterSteps";

const steps = ["بياناتك", "التحقق وكلمة المرور"];
const inputClass = "mt-2 w-full bg-white rounded-xl px-4 py-3 text-sm outline-none text-right shadow-sm border border-transparent focus:border-primary";

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // الخطوة 1: نبعت البيانات ونطلب رمز التحقق
  async function requestCode() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, nationalId, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "حصلت مشكلة");
        return;
      }
      setDemoCode(data.demoCode);
      setStep(2);
    } catch {
      setError("حصلت مشكلة في الاتصال، حاول مرة تانية");
    } finally {
      setLoading(false);
    }
  }

  // الخطوة 2: نتأكد من الرمز ونعمل الحساب
  async function createAccount() {
    setError("");
    if (password.length < 8) return setError("كلمة المرور لازم تكون 8 حروف أو أرقام على الأقل");
    if (password !== confirm) return setError("كلمتين المرور مش متطابقين");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, nationalId, phone, code, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "حصلت مشكلة");
        return;
      }
      // الحساب اتعمل والمستخدم دخل → نوديه على طلب القيد
      window.location.href = "/register/new-graduate";
    } catch {
      setError("حصلت مشكلة في الاتصال، حاول مرة تانية");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <PageHeader title="إنشاء حساب خريج جديد" subtitle="أنشئ حسابك لتقديم طلب القيد بسجلات النقابة ومتابعته" />

      <section className="bg-surface-muted py-14">
        <div className="max-w-md mx-auto px-6">
          <RegisterSteps steps={steps} current={step} onStepClick={(s) => { setError(""); setStep(s); }} />

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="text-sm text-gray-700">الاسم بالكامل</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="الاسم رباعي كما في البطاقة" className={inputClass} />
              </div>
              <div>
                <label className="text-sm text-gray-700">الرقم القومي</label>
                <input type="text" inputMode="numeric" value={nationalId} onChange={(e) => setNationalId(e.target.value.replace(/\D/g, "").slice(0, 14))} placeholder="14 رقم" className={inputClass} dir="ltr" />
              </div>
              <div>
                <label className="text-sm text-gray-700">رقم الهاتف</label>
                <input type="tel" inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))} placeholder="01xxxxxxxxx" className={inputClass} dir="ltr" />
                <p className="mt-1 text-xs text-gray-400">هيوصلك رمز تحقق على الرقم ده</p>
              </div>
            </div>
          )}

          {step === 2 && (
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
                  اتبعت على <span dir="ltr">{phone}</span>
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
            </div>
          )}

          {error && (
            <div className="mt-6 flex items-center gap-2 bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <button type="button" onClick={step === 1 ? requestCode : createAccount} disabled={loading} className="mt-8 w-full bg-primary text-white py-3 rounded-pill font-medium disabled:opacity-60">
            {loading ? "جاري التنفيذ..." : step === 1 ? "إرسال رمز التحقق" : "إنشاء الحساب"}
          </button>

          {step === 2 && (
            <button type="button" onClick={requestCode} disabled={loading} className="mt-3 w-full text-sm text-primary">
              إعادة إرسال الرمز
            </button>
          )}

          <p className="mt-6 text-center text-sm text-gray-500">
            عضو مقيد بالنقابة؟ <a href="/register/existing-member" className="text-primary font-bold">سجّل كعضو حالي</a>
          </p>
        </div>
      </section>
    </main>
  );
}
