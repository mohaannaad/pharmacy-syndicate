import Link from "next/link";
import { Newspaper, PlayCircle } from "lucide-react";

interface NewsCardProps {
  id: string;
  type: "YOUTUBE" | "ARTICLE";
  title: string;
  content: string | null;
  imageUrl: string | null;
  youtubeUrl: string | null;
  createdAt: string;
}

export default function NewsCard({ id, type, title, content, imageUrl, youtubeUrl, createdAt }: NewsCardProps) {
  const excerpt = content ? content.slice(0, 100) + (content.length > 100 ? "..." : "") : "";
  const date = new Date(createdAt).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });

  const cardContent = (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <Newspaper className="w-10 h-10 text-gray-400" />
        )}
        {type === "YOUTUBE" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <PlayCircle className="w-12 h-12 text-white drop-shadow-lg" />
          </div>
        )}
      </div>
      <div className="p-5 text-right">
        <h3 className="font-bold text-gray-900">{title}</h3>
        {excerpt && <p className="mt-2 text-sm text-gray-500 leading-relaxed">{excerpt}</p>}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
          <span className="text-primary font-medium">{type === "YOUTUBE" ? "فيديو" : "مقال"}</span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );

  if (type === "YOUTUBE" && youtubeUrl) {
    return (
      <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="block">
        {cardContent}
      </a>
    );
  }

  return (
    <Link href={`/news/${id}`} className="block">
      {cardContent}
    </Link>
  );
}