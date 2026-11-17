import NewsManager from "./NewsManager";

// أخبار النقابة العامة (قسم «آخر الأخبار والفعاليات» في الرئيسية)
export default function AdminNewsPage() {
  return <NewsManager category="MAIN" />;
}
