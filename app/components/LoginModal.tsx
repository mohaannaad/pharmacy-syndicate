"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Eye, EyeOff, AlertCircle } from "lucide-react";

interface LoginModalProps {
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export default function LoginModal({ onClose, onSwitchToRegister }: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // الخانات بتبدأ "للقراءة فقط" لحد ما المستخدم يدوس عليها،
  // عشان المتصفح ما يملاهاش لوحده ببيانات حسابات قديمة (Autofill)
  const [unlocked, setUnlocked] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "حدث خطأ، يرجى المحاولة مرة أخرى");
        return;
      }
      // دخل بنجاح → نعيد تحميل الصفحة عشان الهيدر يتحدث
      window.location.reload();
    } catch {
      setError("تعذّر الاتصال، يرجى المحاولة مرة أخرى");
    } finally {
      setLoading(false);
    }
  }

  // createPortal: بنرسم النافذة في آخر الصفحة (body) مش جوه الهيدر،
  // عشان الهيدر عليه تأثير blur كان بيقص النافذة من فوق
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="relative w-full max-w-sm max-h-[calc(100vh-2rem)] overflow-y-auto bg-white rounded-3xl shadow-lift p-6 md:p-7 text-right" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={onClose} className="absolute top-4 left-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
          <X className="w-4 h-4 text-gray-500" />
        </button>

        <h2 className="text-lg font-bold text-gray-900">تسجيل الدخول</h2>

        <form onSubmit={handleSubmit} autoComplete="off" className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-gray-600">رقم القيد / الرقم القومي / رقم الهاتف</label>
            <input type="text" name="syndicate-login-id" autoComplete="off" readOnly={!unlocked} onPointerDown={() => setUnlocked(true)} onFocus={() => setUnlocked(true)} value={identifier} onChange={(e) => setIdentifier(e.target.value.trim())} placeholder="أدخل أيًّا منها" className="mt-2 w-full bg-surface-muted border border-line rounded-2xl px-4 py-3 text-sm outline-none text-right" dir="ltr" />
          </div>

          <div>
            <label className="text-sm text-gray-600">كلمة المرور</label>
            <div className="mt-2 relative">
              <input type={showPassword ? "text" : "password"} name="syndicate-login-pass" autoComplete="off" readOnly={!unlocked} onPointerDown={() => setUnlocked(true)} onFocus={() => setUnlocked(true)} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="أدخل كلمة المرور" className="w-full bg-surface-muted border border-line rounded-2xl px-4 py-3 pl-11 text-sm outline-none text-right" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 text-xs rounded-xl px-3 py-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded-pill font-medium disabled:opacity-60">
            {loading ? "جاري الدخول..." : "تسجيل الدخول"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          ليس لديك حساب؟{" "}
          <button type="button" onClick={onSwitchToRegister} className="text-primary font-bold">
            إنشاء حساب
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
