"use client";

import { CheckCircle2 } from "lucide-react";

interface SuccessModalProps {
  title: string;
  message: string;
  buttonLabel?: string;
  onClose: () => void;
}

export default function SuccessModal({ title, message, buttonLabel = "حسنًا", onClose }: SuccessModalProps) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-primary-light/20 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-9 h-9 text-primary-light" />
        </div>
        <h3 className="mt-5 font-bold text-lg text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed">{message}</p>
        <button onClick={onClose} className="mt-6 w-full bg-primary text-white py-3 rounded-pill font-medium">
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}