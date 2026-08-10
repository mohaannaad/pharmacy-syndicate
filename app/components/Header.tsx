export default function Header() {
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-primary font-bold text-lg">
          النقابة العامة لصيادلة مصر
        </div>
        <nav className="flex gap-6 text-sm font-medium">
          <a href="#" className="text-primary border-b-2 border-primary-light pb-1">
            الرئيسية
          </a>
          <a href="#" className="text-gray-600 hover:text-primary">
            الشهادات
          </a>
          <a href="#" className="text-gray-600 hover:text-primary">
            الخدمات
          </a>
          <a href="#" className="text-gray-600 hover:text-primary">
            الفروع
          </a>
          <a href="#" className="text-gray-600 hover:text-primary">
            الصيدليات
          </a>
        </nav>
        <button className="bg-primary text-white px-5 py-2 rounded-pill text-sm font-medium">
          تسجيل دخول
        </button>
      </div>
    </header>
  );
}