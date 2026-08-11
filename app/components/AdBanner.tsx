interface AdBannerProps {
  variant?: "dark" | "blue";
}

export default function AdBanner({ variant = "dark" }: AdBannerProps) {
  if (variant === "blue") {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-blue-600 to-cyan-400 text-white p-6 flex items-center justify-between">
        <div className="text-right">
          <div className="text-xs font-bold bg-white/20 inline-block px-2 py-1 rounded">إعلان</div>
          <div className="mt-2 text-lg md:text-xl font-bold">حلول صحية توصلك أينما كنت</div>
        </div>
        <div className="text-2xl md:text-3xl font-extrabold shrink-0">خصم 15%</div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-dark text-white p-6 flex items-center justify-between">
      <div className="absolute -left-8 -top-8 w-32 h-32 bg-primary-light/30 rotate-45" />
      <div className="relative text-right">
        <div className="text-xs text-white/60">إعلان</div>
        <div className="mt-2 text-lg md:text-xl font-bold">أفضل خدمة صيدلية أونلاين</div>
      </div>
      <div className="relative text-sm text-white/70 shrink-0">01234567800</div>
    </div>
  );
}