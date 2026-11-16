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
  // featured = الخبر الكبير، compact = خبر صغير جنبه، default = كارت عادي
  variant?: "featured" | "compact" | "default";
}

export default function NewsCard({ id, type, title, content, imageUrl, youtubeUrl, createdAt, variant = "default" }: NewsCardProps) {
  const excerpt = content ? content.slice(0, 100) + (content.length > 100 ? "..." : "") : "";
  const date = new Date(createdAt).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });
  const label = type === "YOUTUBE" ? "فيديو" : "مقال";

  const image = imageUrl ? (
    <img src={imageUrl} alt="" className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" />
  ) : (
    <div className="w-full h-full bg-mint flex items-center justify-center">
      <Newspaper className="w-10 h-10 text-primary/40" />
    </div>
  );

  let cardContent: React.ReactNode;

  if (variant === "featured") {
    cardContent = (
      <div className="group relative overflow-hidden rounded-[28px] h-full min-h-[360px] md:min-h-[460px] bg-primary-dark text-white">
        <div className="absolute inset-0">{image}</div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#081E14]/95 via-[#081E14]/40 to-transparent" />
        {type === "YOUTUBE" && <PlayCircle className="absolute top-6 left-6 w-12 h-12 text-white drop-shadow-lg" />}
        <div className="absolute inset-x-6 md:inset-x-8 bottom-6 md:bottom-8 flex flex-col gap-2.5 text-right">
          <span className="self-start bg-gold text-[#1B1A12] font-bold text-xs px-3 py-1 rounded-pill">{label}</span>
          <h3 className="text-2xl md:text-[28px] font-extrabold leading-snug">{title}</h3>
          {excerpt && <p className="text-[#D6E6DD] text-sm leading-relaxed line-clamp-2">{excerpt}</p>}
          <span className="text-sm text-[#B9D0C3]">{date}</span>
        </div>
      </div>
    );
  } else if (variant === "compact") {
    cardContent = (
      <div className="group flex gap-4 items-center bg-white border border-line rounded-[22px] p-3.5 hover:shadow-lift hover:border-[#BFDCCB] transition-all duration-300 h-full">
        <div className="relative shrink-0 w-28 h-24 rounded-2xl overflow-hidden">
          {image}
          {type === "YOUTUBE" && <PlayCircle className="absolute inset-0 m-auto w-8 h-8 text-white drop-shadow" />}
        </div>
        <div className="flex flex-col gap-1.5 text-right min-w-0">
          <span className="text-xs font-bold text-primary">{label}</span>
          <h3 className="font-bold text-ink leading-snug line-clamp-2">{title}</h3>
          <span className="text-xs text-ink-muted">{date}</span>
        </div>
      </div>
    );
  } else {
    cardContent = (
      <div className="group bg-white rounded-3xl overflow-hidden border border-line hover:shadow-lift hover:-translate-y-1 transition-all duration-300 ease-out h-full">
        <div className="relative aspect-video overflow-hidden">
          {image}
          {type === "YOUTUBE" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <PlayCircle className="w-12 h-12 text-white drop-shadow-lg" />
            </div>
          )}
        </div>
        <div className="p-5 text-right">
          <h3 className="font-bold text-ink">{title}</h3>
          {excerpt && <p className="mt-2 text-sm text-ink-muted leading-relaxed">{excerpt}</p>}
          <div className="mt-4 flex items-center justify-between text-xs text-ink-muted">
            <span className="text-primary font-bold">{label}</span>
            <span>{date}</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === "YOUTUBE" && youtubeUrl) {
    return (
      <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="block h-full">
        {cardContent}
      </a>
    );
  }

  return (
    <Link href={`/news/${id}`} className="block h-full">
      {cardContent}
    </Link>
  );
}
