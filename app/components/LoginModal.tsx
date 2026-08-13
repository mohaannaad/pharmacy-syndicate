"use client";

import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";

interface LoginModalProps {
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export default function LoginModal({ onClose, onSwitchToRegister }: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-sm bg-white rounded-2xl p-6 text-right">
        <button onClick={onClose} className="absolute top-4 left-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
          <X className="w-4 h-4 text-gray-500" />
        </button>

        <h2 className="text-lg font-bold text-gray-900">تسجيل الدخول</h2>

        <form className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-gray-600">رقم القيد / الرقم القومي</label>
            <input
              type="text"
              placeholder="أدخل رقم القيد أو الرقم القومي"
              className="mt-2 w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none text-right"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">كلمة المرور</label>
            <div className="mt-2 relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="ادخل كلمة المرور"
                className="w-full bg-gray-100 rounded-xl px-4 py-3 pl-11 text-sm outline-none text-right"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <a href="#" className="text-xs text-primary mt-2 inline-block">نسيت كلمة المرور؟</a>
          </div>

          <button type="submit" className="w-full bg-primary text-white py-3 rounded-pill font-medium">
            تسجيل الدخول
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          ليس لدي حساب؟{" "}
          <button onClick={onSwitchToRegister} className="text-primary font-bold">
            تسجيل
          </button>
        </div>
      </div>
    </div>
  );
}