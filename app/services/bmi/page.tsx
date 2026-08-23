"use client";

import { useState } from "react";
import PageHeader from "../../components/PageHeader";

type Category = { label: string; color: string; range: string };

const categories: Category[] = [
  { label: "نقص وزن", color: "text-blue-500", range: "أقل من 18.5" },
  { label: "وزن طبيعي", color: "text-primary", range: "18.5 - 24.9" },
  { label: "زيادة وزن", color: "text-yellow-600", range: "25 - 29.9" },
  { label: "سمنة", color: "text-red-500", range: "30 فأكثر" },
];

function getCategory(bmi: number): Category {
  if (bmi < 18.5) return categories[0];
  if (bmi < 25) return categories[1];
  if (bmi < 30) return categories[2];
  return categories[3];
}

export default function BmiPage() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      setResult(Number((w / (h * h)).toFixed(1)));
    }
  };

  const category = result !== null ? getCategory(result) : null;

  return (
    <main>
      <PageHeader title="حاسبة كتلة الجسم" subtitle="احسب مؤشر كتلة جسمك بسهولة وسرعة" />

      <section className="bg-surface-muted py-14">
        <div className="max-w-md mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
            <div>
              <label className="text-sm text-gray-700">الطول (بالسنتيمتر)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="مثال: 175"
                className="mt-2 w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none text-right"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700">الوزن (بالكيلوجرام)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="مثال: 70"
                className="mt-2 w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none text-right"
              />
            </div>

            <button onClick={calculate} className="w-full bg-primary text-white py-3 rounded-pill font-medium">
              احسب
            </button>

            {result !== null && category && (
              <div className="pt-4 border-t border-gray-100 text-center">
                <div className="text-4xl font-bold text-gray-900">{result}</div>
                <div className={`mt-2 font-bold ${category.color}`}>{category.label}</div>
                <div className="text-xs text-gray-400 mt-1">النطاق: {category.range}</div>
              </div>
            )}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {categories.map((c) => (
              <div key={c.label} className="bg-white rounded-xl p-3 text-center shadow-sm">
                <div className={`text-sm font-bold ${c.color}`}>{c.label}</div>
                <div className="text-xs text-gray-400 mt-1">{c.range}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}