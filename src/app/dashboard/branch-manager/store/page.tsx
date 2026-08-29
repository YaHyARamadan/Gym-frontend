"use client";

import { useState } from "react";
import { ShoppingBag, Plus, Search, Edit3, AlertTriangle } from "lucide-react";

export default function BranchStorePage() {
  const [products, setProducts] = useState([
    { id: "p1", name: "واي بروتين (Whey Gold Standard)", stock: 14, price: 2800, category: "مكملات" },
    { id: "p2", name: "كرياتين مونو هيدرات (Creatine 300g)", stock: 3, price: 950, category: "مكملات" },
    { id: "p3", name: "مشروب طاقة (Pre-Workout Energy)", stock: 25, price: 150, category: "مشروبات" },
    { id: "p4", name: "حزام رفع أثقال جلد (Weightlifting Belt)", stock: 2, price: 650, category: "معدات" },
  ]);

  const handleAdjustStock = (id: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, newStock) } : p))
    );
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto dir-rtl font-tajawal pb-10">
      <div className="flex items-center justify-between gap-4">
        <div className="text-right">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium justify-end">
            <span>المتجر والمخزون</span>
            <span>‹</span>
            <span>الرئيسية</span>
          </div>
          <h1 className="text-2xl font-black text-zinc-900 font-cairo tracking-wide mt-0.5">
            منتجات ومخزون الفرع
          </h1>
        </div>

        <button className="flex items-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-sm px-6 py-3 rounded-2xl shadow-[0_4px_16px_rgba(245,197,24,0.35)] transition-all cursor-pointer">
          <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
          <span>+ إضافة منتج جديد</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-xs space-y-5">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50 text-xs font-bold text-zinc-400 font-cairo">
                <th className="py-4 px-4">اسم المنتج</th>
                <th className="py-4 px-4">التصنيف</th>
                <th className="py-4 px-4">السعر</th>
                <th className="py-4 px-4 text-center">الكمية بالمخزون</th>
                <th className="py-4 px-4 text-center">تعديل سريع للمخزون</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs font-medium">
              {products.map((p) => (
                <tr
                  key={p.id}
                  className={`hover:bg-zinc-50/80 transition-colors ${
                    p.stock <= 5 ? "bg-red-50/30 border-r-4 border-rose-500" : ""
                  }`}
                >
                  <td className="py-3.5 px-4 font-bold text-zinc-900 font-cairo">
                    <div className="flex items-center gap-2">
                      {p.stock <= 5 && <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />}
                      <span>{p.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-600 font-bold">{p.category}</td>
                  <td className="py-3.5 px-4 font-bold text-amber-600 font-mono text-sm">
                    {p.price.toLocaleString("ar-EG")} ج.م
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-bold rounded-lg ${
                        p.stock <= 5
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : "bg-zinc-100 text-zinc-800"
                      }`}
                    >
                      {p.stock} قطعة {p.stock <= 5 ? "(منخفض)" : ""}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleAdjustStock(p.id, p.stock - 1)}
                        className="h-8 w-8 rounded-lg border border-zinc-200 bg-white font-bold text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold font-mono text-sm">{p.stock}</span>
                      <button
                        onClick={() => handleAdjustStock(p.id, p.stock + 1)}
                        className="h-8 w-8 rounded-lg border border-zinc-200 bg-white font-bold text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
