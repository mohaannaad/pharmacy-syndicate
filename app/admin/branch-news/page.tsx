import NewsManager from "../news/NewsManager";

// أخبار النقابات الفرعية (قسم «أخبار النقابات الفرعية» في الرئيسية)
export default function AdminBranchNewsPage() {
  return <NewsManager category="BRANCH" />;
}
