"use client";

import { useState } from "react";
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
        setError(data.error || "حصلت مشكلة");
        return;
      }
      // دخل بنجاح → نعيد تحميل الصفحة عشان الهيدر يتحدث
      window.location.reload();
    } catch {
      setError("حصلت مشكلة في الاتصال، حاول مرة تانية");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-sm bg-white rounded-2xl p-6 text-right">
        <button type="button" onClick={onClose} className="absolute top-4 left-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
          <X className="w-4 h-4 text-gray-500" />
        </button>

        <h2 className="text-lg font-bold text-gray-900">تسجيل الدخول</h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-gray-600">رقم القيد / الرقم القومي / رقم الهاتف</label>
            <input type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value.trim())} placeholder="أدخل أي واحد منهم" className="mt-2 w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none text-right" dir="ltr" />
          </div>

          <div>
            <label className="text-sm text-gray-600">كلمة المرور</label>
            <div className="mt-2 relative">
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="ادخل كلمة المرور" className="w-full bg-gray-100 rounded-xl px-4 py-3 pl-11 text-sm outline-none text-right" />
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
          ليس لدي حساب؟{" "}
          <button type="button" onClick={onSwitchToRegister} className="text-primary font-bold">
            إنشاء حساب
          </button>
        </div>
      </div>
    </div>
  );
}