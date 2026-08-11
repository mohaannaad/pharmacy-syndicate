interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-primary-dark to-primary-light py-14">
      <div
        className="absolute inset-0 opacity-[0.10] bg-repeat"
        style={{ backgroundImage: "url('/hero-pattern.png')", backgroundSize: "180px" }}
      />
      <div className="relative max-w-7xl mx-auto px-6 text-right text-white">
        <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
        <p className="mt-2 text-white/80">{subtitle}</p>
      </div>
    </section>
  );
}