export function SectionShell({ id, children, className = "" }) {
  return (
    <section id={id} className={`relative overflow-hidden px-5 py-24 sm:px-8 lg:px-16 ${className}`}>
      <div className="relative mx-auto max-w-[1400px]">{children}</div>
    </section>
  );
}

export function Badge({ children, tone = "teal" }) {
  const colors = tone === "gold" ? "bg-[#fff5df] text-[#f2a60f]" : "bg-[#e8f3f2] text-[#14797d]";
  return <span className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-extrabold ${colors}`}>{children}</span>;
}

export function SectionHeading({ badge, title, accent, subtitle, light = false }) {
  return (
    <div className="mx-auto max-w-4xl text-center">
      {badge}
      <h2 className={`display-serif mt-5 text-[44px] font-bold leading-tight sm:text-[60px] ${light ? "text-white" : "text-[#071c33]"}`}>
        {title} {accent && <span className="text-[#f2a60f]">{accent}</span>}
      </h2>
      {subtitle && <p className={`mx-auto mt-5 max-w-3xl text-xl leading-8 ${light ? "text-white/85" : "text-slate-500"}`}>{subtitle}</p>}
    </div>
  );
}
