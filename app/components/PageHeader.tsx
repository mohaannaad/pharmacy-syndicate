interface PageHeaderProps {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden bg-primary-dark">
      <span className="pointer-events-none absolute -left-28 -top-28 w-[420px] h-[420px] rounded-full border-[70px] border-primary-light/10" />
      <span className="pointer-events-none absolute right-1/3 -bottom-40 w-80 h-80 rounded-full bg-primary/40 blur-3xl" />
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16 flex items-end justify-between gap-6 flex-wrap">
        <div className="text-right text-white max-w-2xl">
          <h1 className="text-3xl md:text-[44px] font-extrabold leading-tight">{title}</h1>
          <p className="mt-3 text-[#CFE3D8] md:text-lg leading-relaxed">{subtitle}</p>
        </div>
        {action ? <div>{action}</div> : null}
      </div>
    </section>
  );
}
