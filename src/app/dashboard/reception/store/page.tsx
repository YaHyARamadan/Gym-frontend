"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ShoppingCart,
  RefreshCw,
  Search,
  Plus,
  Minus,
  Trash2,
  Tag,
  CreditCard,
  TrendingUp,
  Package,
  AlertTriangle,
  BarChart3,
  Boxes,
  Edit2,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";
import { useStoreProducts, useCreateStoreOrder } from "@/features/reception/hooks/useReception";
import { useMembers } from "@/features/owner/hooks/useMembers";
import { extractApiError } from "@/lib/utils";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function ReceptionStorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState("bestseller");

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([
    { id: "p1", name: "بروتين واي 2.2 كجم", price: 1250, quantity: 1 },
    { id: "p2", name: "شيكر رياضي", price: 120, quantity: 1 },
  ]);
  const [discount, setDiscount] = useState(0);
  const [isEditingDiscount, setIsEditingDiscount] = useState(false);

  // Modal State
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const { data: products, isLoading: isProductsLoading } = useStoreProducts();
  const { data: membersData } = useMembers();
  const createOrderMutation = useCreateStoreOrder();

  const members = membersData?.items || [];

  // Extended mock dataset matching the screenshot exactly
  const mockProductsList = [
    { id: "p1", name: "بروتين واي 2.2 كجم", price: 1250, stock: 18, status: "available", category: "مكملات" },
    { id: "p2", name: "شيكر رياضي", price: 120, stock: 45, status: "available", category: "إكسسوارات" },
    { id: "p3", name: "بروتين بار", price: 60, stock: 32, status: "available", category: "سناكس" },
    { id: "p4", name: "حزام رفع أثقال", price: 450, stock: 12, status: "available", category: "معدات" },
    { id: "p5", name: "قفاز تمرين", price: 180, stock: 20, status: "available", category: "إكسسوارات" },
    { id: "p6", name: "CLA 1000 مجم", price: 350, stock: 14, status: "available", category: "مكملات" },
    { id: "p7", name: "طقم مطاط مقاومة", price: 250, stock: 16, status: "available", category: "معدات" },
    { id: "p8", name: "شنطة رياضية", price: 420, stock: 5, status: "low", category: "إكسسوارات" },
    { id: "p9", name: "حبل قفز", price: 80, stock: 25, status: "available", category: "معدات" },
    { id: "p10", name: "زجاجة مياه 1 لتر", price: 70, stock: 30, status: "available", category: "مشروبات" },
  ];

  const rawProducts = Array.isArray(products)
    ? products
    : (products as unknown as { items?: Array<any> })?.items;

  const displayProducts = rawProducts && rawProducts.length > 0
    ? rawProducts.map((p, idx) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        stock: p.stockQuantity ?? 20,
        status: (p.stockQuantity ?? 20) < 10 ? "low" : "available",
        category: p.category || "منتجات عامة",
      }))
    : mockProductsList;

  const filteredProducts = displayProducts.filter((prod) => {
    const matchesSearch =
      !searchQuery.trim() || prod.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || prod.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Cart operations
  const addToCart = (product: { id: string; name: string; price: number }) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
  };

  // Totals calculations
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const finalTotalAmount = Math.max(0, subtotalAmount - discount);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setFeedback(null);
    createOrderMutation.mutate(
      {
        memberId: selectedMemberId || "general-member-id",
        items: cart.map((c) => ({ productId: c.id, quantity: c.quantity })),
      },
      {
        onSuccess: () => {
          setFeedback({ type: "success", message: "تمت إتمام عملية البيع وإصدار الفاتورة بنجاح!" });
          clearCart();
          setCheckoutModalOpen(false);
        },
        onError: (err) => {
          setFeedback({ type: "error", message: extractApiError(err) || "تعذر إتمام عملية البيع." });
        },
      }
    );
  };

  return (
    <div className="space-y-6 max-w-[1550px] mx-auto dir-rtl font-tajawal pb-12">
      {/* ── Top Header Section ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium font-cairo mb-1">
            <Link href="/dashboard/reception" className="hover:text-zinc-700">الرئيسية</Link>
            <span>›</span>
            <span className="text-zinc-800 font-bold">المتجر</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 stroke-[2.2]" />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 font-cairo">المتجر (Store)</h1>
          </div>
        </div>

        {/* Top Right Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => {
              if (cart.length > 0) setCheckoutModalOpen(true);
            }}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-extrabold text-sm px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer shrink-0 active:scale-[0.98]"
          >
            <ShoppingCart className="h-4 w-4 stroke-[2.5]" />
            <span>عملية بيع جديدة</span>
          </button>

          <Link
            href="/dashboard/reception/payments"
            className="flex items-center gap-2 bg-white hover:bg-zinc-50 text-zinc-700 font-cairo font-bold text-sm px-4 py-2.5 rounded-xl border border-zinc-200 shadow-xs transition-all cursor-pointer"
          >
            <FileText className="h-4 w-4 text-zinc-500" />
            <span>سجل المبيعات</span>
          </Link>
        </div>
      </div>

      {/* ── Feedback Toast Banner ───────────────────────────────────────────── */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between gap-3 animate-card-enter ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-3">
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-zinc-400 hover:text-zinc-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── 5 Operational Stat Cards Grid ───────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: إجمالي المبيعات اليوم */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-zinc-500 font-cairo">إجمالي المبيعات اليوم</span>
            <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <TrendingUp className="h-5 w-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-black text-zinc-900 font-cairo tracking-tight">
              2,350 <span className="text-xs font-bold text-zinc-500">ج.م</span>
            </p>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">5 عمليات بيع</p>
          </div>
        </div>

        {/* Card 2: عدد الطلبات اليوم */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-zinc-500 font-cairo">عدد الطلبات اليوم</span>
            <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
              <ShoppingCart className="h-5 w-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-zinc-900 font-cairo">16</p>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">عملية بيع</p>
          </div>
        </div>

        {/* Card 3: متوسط قيمة الطلب */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-zinc-500 font-cairo">متوسط قيمة الطلب</span>
            <div className="h-10 w-10 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
              <BarChart3 className="h-5 w-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-black text-zinc-900 font-cairo tracking-tight">
              147 <span className="text-xs font-bold text-zinc-500">ج.م</span>
            </p>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">اليوم</p>
          </div>
        </div>

        {/* Card 4: إجمالي المنتجات */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-zinc-500 font-cairo">إجمالي المنتجات</span>
            <div className="h-10 w-10 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
              <Boxes className="h-5 w-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-zinc-900 font-cairo">124</p>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">منتج</p>
          </div>
        </div>

        {/* Card 5: منتجات قليلة المخزون */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-zinc-500 font-cairo">منتجات قليلة المخزون</span>
            <div className="h-10 w-10 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-zinc-900 font-cairo">8</p>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">منتجات</p>
          </div>
        </div>
      </div>

      {/* ── Main POS Workspace Split Layout (Left: Grid | Right: Cart Sidebar) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── Left Column: Search Filters & Product Cards Grid (8 cols) ───── */}
        <div className="lg:col-span-8 space-y-4">
          {/* Search & Filters Controls Bar */}
          <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Search Input (6 cols) */}
            <div className="sm:col-span-6 relative">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="ابحث عن منتج بالاسم أو الكود..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pr-10 pl-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-900 font-medium placeholder:text-zinc-400 focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
              />
            </div>

            {/* Sort Dropdown (3 cols) */}
            <div className="sm:col-span-3">
              <select
                value={sortFilter}
                onChange={(e) => setSortFilter(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-700 font-bold font-cairo focus:outline-none focus:border-amber-400 focus:bg-white transition-all cursor-pointer"
              >
                <option value="bestseller">الترتيب: الأكثر مبيعاً</option>
                <option value="price_low">السعر: من الأقل للأعلى</option>
                <option value="price_high">السعر: من الأعلى للأقل</option>
              </select>
            </div>

            {/* Category Dropdown (3 cols) */}
            <div className="sm:col-span-3">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-700 font-bold font-cairo focus:outline-none focus:border-amber-400 focus:bg-white transition-all cursor-pointer"
              >
                <option value="all">كل الفئات</option>
                <option value="مكملات">مكملات غذائية</option>
                <option value="إكسسوارات">إكسسوارات</option>
                <option value="سناكس">سناكس وبروتين بار</option>
                <option value="معدات">معدات رياضية</option>
                <option value="مشروبات">مشروبات ومياه</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl p-3.5 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:border-amber-300 hover:shadow-md transition-all group"
              >
                {/* Product Image Placeholder Badge */}
                <div className="h-24 w-full rounded-xl bg-zinc-100 flex items-center justify-center relative overflow-hidden mb-2">
                  <Package className="h-8 w-8 text-zinc-300 group-hover:scale-110 transition-transform" />
                  <span
                    className={`absolute top-2 right-2 px-2 py-0.5 rounded-md text-[9px] font-bold font-cairo ${
                      prod.status === "low"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {prod.status === "low" ? `قليل: ${prod.stock}` : `متوفر: ${prod.stock}`}
                  </span>
                </div>

                <div className="space-y-1 text-right">
                  <h3 className="font-extrabold text-xs text-zinc-900 font-cairo line-clamp-1">
                    {prod.name}
                  </h3>
                  <p className="font-black text-sm text-zinc-900 font-cairo dir-ltr text-right">
                    {prod.price} <span className="text-[10px] font-bold text-zinc-500">ج.م</span>
                  </p>
                </div>

                <button
                  onClick={() => addToCart(prod)}
                  className="mt-3 w-full flex items-center justify-center gap-1.5 bg-zinc-50 hover:bg-amber-50 hover:border-amber-300 text-zinc-800 hover:text-amber-900 border border-zinc-200 font-cairo font-bold text-xs py-1.5 rounded-xl transition-all cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5 text-amber-600 stroke-[3]" />
                  <span>إضافة</span>
                </button>
              </div>
            ))}
          </div>

          {/* Pagination Footer */}
          <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-cairo">
            <span>عرض 1 - {filteredProducts.length} من 124 منتج</span>
            <div className="flex items-center gap-1">
              <button className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-400 hover:bg-zinc-100">
                <ChevronRight className="h-4 w-4" />
              </button>
              <button className="h-8 w-8 rounded-lg bg-gym-yellow text-gym-black font-black flex items-center justify-center">
                1
              </button>
              <button className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-700 hover:bg-zinc-100">
                2
              </button>
              <button className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-700 hover:bg-zinc-100">
                3
              </button>
              <span className="px-1 text-zinc-400">...</span>
              <button className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-700 hover:bg-zinc-100">
                13
              </button>
              <button className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-700 hover:bg-zinc-100">
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Right Column: Shopping Cart Sidebar POS (4 cols) ───────────── */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs space-y-5 sticky top-6">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-amber-500" />
              <h2 className="text-base font-extrabold text-zinc-900 font-cairo">
                سلة المشتروات ({totalItemsCount})
              </h2>
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 font-cairo cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>إفراغ السلة</span>
              </button>
            )}
          </div>

          {/* Cart Items List */}
          <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
            {cart.length === 0 ? (
              <div className="py-12 text-center text-zinc-400 space-y-2">
                <ShoppingCart className="h-10 w-10 mx-auto text-zinc-300 stroke-[1.5]" />
                <p className="text-xs font-bold font-cairo">سلة المبيعات فارغة</p>
                <p className="text-[11px] text-zinc-400">انقر على "+ إضافة" من قائمة المنتجات</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/50 flex items-center justify-between gap-3"
                >
                  <div className="h-12 w-12 rounded-lg bg-zinc-200 flex items-center justify-center shrink-0">
                    <Package className="h-6 w-6 text-zinc-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-zinc-900 font-cairo truncate">{item.name}</p>
                    <p className="text-xs font-black text-rose-600 font-cairo mt-0.5">
                      {item.price} <span className="text-[10px] font-bold text-zinc-500">ج.م</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center rounded-lg border border-zinc-200 bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="h-7 w-7 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 rounded-r-lg cursor-pointer"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-zinc-900 font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="h-7 w-7 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 rounded-l-lg cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="h-7 w-7 rounded-lg text-rose-500 hover:bg-rose-50 flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary Box */}
          <div className="border-t border-zinc-100 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-zinc-600">
              <span>إجمالي المنتجات:</span>
              <span className="font-bold font-mono text-zinc-900">{totalItemsCount}</span>
            </div>

            <div className="flex justify-between text-zinc-600">
              <span>إجمالي قبل الخصم:</span>
              <span className="font-bold font-mono text-zinc-900">{subtotalAmount} ج.م</span>
            </div>

            <div className="flex justify-between items-center text-zinc-600">
              <div className="flex items-center gap-1">
                <span>الخصم</span>
                <button
                  onClick={() => setIsEditingDiscount(!isEditingDiscount)}
                  className="text-emerald-600 hover:underline flex items-center gap-0.5 cursor-pointer font-bold"
                >
                  <Edit2 className="h-3 w-3" />
                </button>
              </div>
              {isEditingDiscount ? (
                <input
                  type="number"
                  min={0}
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  onBlur={() => setIsEditingDiscount(false)}
                  className="w-16 h-6 px-1 border rounded text-xs font-mono font-bold text-center"
                />
              ) : (
                <span className="font-bold font-mono text-emerald-600">{discount} ج.م</span>
              )}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-zinc-100 text-base font-black font-cairo text-zinc-900">
              <span>الإجمالي:</span>
              <span className="text-xl font-black text-emerald-700 font-cairo">
                {finalTotalAmount} <span className="text-xs text-zinc-500 font-bold">ج.م</span>
              </span>
            </div>
          </div>

          {/* Action Checkout Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                if (cart.length > 0) setCheckoutModalOpen(true);
              }}
              disabled={cart.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-sm py-3 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 active:scale-[0.98]"
            >
              <CreditCard className="h-4 w-4 stroke-[2.5]" />
              <span>إتمام عملية البيع</span>
            </button>

            <button
              disabled={cart.length === 0}
              className="w-full py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 text-xs font-bold font-cairo transition-colors text-center cursor-pointer disabled:opacity-50"
            >
              حفظ كطلب مفتوح
            </button>
          </div>
        </div>
      </div>

      {/* ── Checkout Confirmation Modal Dialog ─────────────────────────────── */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 dir-rtl font-tajawal">
          <form
            onSubmit={handleCheckout}
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-zinc-200 shadow-2xl animate-card-enter"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gym-yellow text-gym-black flex items-center justify-center">
                  <ShoppingCart className="h-4 w-4 stroke-[2.5]" />
                </div>
                <h3 className="text-base font-black text-zinc-900 font-cairo">إتمام الفاتورة</h3>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutModalOpen(false)}
                className="h-8 w-8 rounded-full bg-zinc-100 text-zinc-500 hover:text-zinc-800 flex items-center justify-center cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 font-cairo block">العضو المشترِي (اختياري)</label>
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs font-bold text-zinc-800 focus:outline-none focus:border-amber-400 focus:bg-white"
              >
                <option value="">عميل عام (مبيعات سريعة بدون ربط عضوية)</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} ({m.memberNumber})
                  </option>
                ))}
              </select>
            </div>

            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-600 font-medium">
                <span>عدد المنتجات:</span>
                <span className="font-bold text-zinc-900">{totalItemsCount}</span>
              </div>
              <div className="flex justify-between text-zinc-600 font-medium">
                <span>المبلغ المستحق:</span>
                <span className="font-black text-emerald-700 text-sm font-cairo">{finalTotalAmount} ج.م</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-zinc-100">
              <button
                type="submit"
                disabled={createOrderMutation.isPending}
                className="flex-1 py-2.5 rounded-xl bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {createOrderMutation.isPending && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                <span>حفظ وتأكيد الدفع</span>
              </button>
              <button
                type="button"
                onClick={() => setCheckoutModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 text-xs font-bold font-cairo transition-colors cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

