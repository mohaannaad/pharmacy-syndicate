"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import RegisterSteps from "../../components/RegisterSteps";
import SuccessModal from "../../components/SuccessModal";

const steps = ["التحقق من الهوية", "رمز التحقق", "استكمال البيانات"];

export default function ExistingMemberRegisterPage() {
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main>
      <PageHeader
        title="تسجيل عضو حالي"
        subtitle="إذا كنت عضوا مسجلا بالنقابة، يمكنك إنشاء حساب إلكتروني باستخدام رقم القيد والرقم القومي للتحقق من بياناتك."
      />

      <section className="bg-surface-muted py-14">
        <div className="max-w-md mx-auto px-6">
          <RegisterSteps steps={steps} current={step} />

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="text-sm text-gray-700">رقم القيد</label>
                <input type="text" placeholder="أدخل رقم القيد" className="mt-2 w-full bg-white rounded-xl px-4 py-3 text-sm outline-none text-right shadow-sm" />
              </div>
              <div>
                <label className="text-sm text-gray-700">الرقم القومي</label>
                <input type="text" placeholder="أدخل الرقم القومي المكون من 14 رقم" className="mt-2 w-full bg-white rounded-xl px-4 py-3 text-sm outline-none text-right shadow-sm" />
              </div>
              <button onClick={() => setStep(2)} className="w-full bg-primary text-white py-3 rounded-pill font-medium">
                تحقق من البيانات
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 text-center">
              <p className="text-sm text-gray-600">تم إرسال رمز تحقق إلى رقم الهاتف المسجل لدى النقابة.</p>
              <div className="flex gap-3 justify-center" dir="ltr">
                {Array.from({ length: 4 }).map((_, i) => (
                  <input key={i} maxLength={1} className="w-14 h-14 text-center bg-white rounded-xl text-lg outline-none shadow-sm" />
                ))}
              </div>
              <button onClick={() => setStep(3)} className="w-full bg-primary text-white py-3 rounded-pill font-medium">
                تأكيد الرمز
              </button>
              <button className="text-sm text-primary">إعادة إرسال الرمز</button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="text-sm text-gray-700">الاسم بالكامل</label>
                <input type="text" disabled value="مهند محمد زكريا محمد" className="mt-2 w-full bg-gray-200 text-gray-500 rounded-xl px-4 py-3 text-sm outline-none text-right" />
              </div>
              <div>
                <label className="text-sm text-gray-700">البريد الإلكتروني</label>
                <input type="email" placeholder="أدخل البريد الإلكتروني الخاص بك" className="mt-2 w-full bg-white rounded-xl px-4 py-3 text-sm outline-none text-right shadow-sm" />
              </div>
              <div>
                <label className="text-sm text-gray-700">رقم الهاتف</label>
                <input type="text" defaultValue="+20 1122003340" className="mt-2 w-full bg-white rounded-xl px-4 py-3 text-sm outline-none text-right shadow-sm" />
              </div>
              <div>
                <label className="text-sm text-gray-700">كلمة المرور</label>
                <div className="mt-2 relative">
                  <input type={showPassword ? "text" : "password"} placeholder="ادخل كلمة المرور" className="w-full bg-white rounded-xl px-4 py-3 pl-11 text-sm outline-none text-right shadow-sm" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-700">تأكيد كلمة المرور</label>
                <input type="password" placeholder="ادخل كلمة المرور" className="mt-2 w-full bg-white rounded-xl px-4 py-3 text-sm outline-none text-right shadow-sm" />
              </div>
              <button onClick={() => setShowSuccess(true)} className="w-full bg-primary text-white py-3 rounded-pill font-medium">
                إنشاء الحساب
              </button>
            </div>
          )}
        </div>
      </section>

      {showSuccess && (
        <SuccessModal
          title="تم إنشاء الحساب بنجاح"
          message="يمكنك الآن تسجيل الدخول والاستفادة من الخدمات الإلكترونية."
          onClose={() => setShowSuccess(false)}
        />
      )}
    </main>
  );
}