import { Newspaper, PlayCircle, Link as LinkIcon } from "lucide-react";

interface NewsCardProps {
  title: string;
  desc: string;
  date: string;
  source: string;
  hasVideo?: boolean;
}

export default function NewsCard({ title, desc, date, source, hasVideo }: NewsCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      <div className="relative aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
        <Newspaper className="w-10 h-10 text-gray-400" />
        {hasVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayCircle className="w-12 h-12 text-white drop-shadow-lg" />
          </div>
        )}
      </div>
      <div className="p-5 text-right">
        <h3 className="font-bold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed">{desc}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1 text-primary font-medium">
            <LinkIcon className="w-3 h-3" />
            {source}
          </span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
}