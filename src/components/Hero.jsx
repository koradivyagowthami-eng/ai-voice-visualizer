import { ArrowRight, Play, Shield, Sparkles, Utensils, Wifi } from "lucide-react";

const amenities = [
  { label: "Free WiFi", icon: Wifi },
  { label: "Meals", icon: Utensils },
  { label: "24/7 Security", icon: Shield },
];

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-[#fbfaf6] pt-[86px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_7%_45%,rgba(20,121,125,.1),transparent_24%),radial-gradient(circle_at_88%_20%,rgba(242,166,15,.14),transparent_28%)]" aria-hidden="true" />
      <div className="absolute inset-y-[86px] right-0 hidden w-1/2 bg-[url('https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1500&q=82')] bg-cover bg-center opacity-20 lg:block" aria-hidden="true" />

      <div className="relative mx-auto min-h-[820px] max-w-[1500px] px-5 py-24 sm:px-8 lg:px-16">
        <div className="max-w-[650px]">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-extrabold text-[#0b2438] shadow-[0_18px_45px_rgba(20,121,125,.12)]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#f2a60f]" />
            Trusted by 10,000+ guests
            <span className="text-[#f2a60f]">★★★★★</span>
          </div>

          <h1 className="display-serif mt-14 text-[58px] font-bold leading-[1.1] text-[#071c33] sm:text-[78px] lg:text-[86px]">
            Your Home Away<br />
            From <span className="text-[#f2a60f]">Home</span>
          </h1>

          <div className="mt-9 flex items-center gap-4 text-xl text-slate-500">
            <span className="h-px w-16 bg-[#14797d]" />
            <Sparkles className="h-5 w-5 text-[#14797d]" />
            <span>Experience Premium</span>
            <strong className="text-[#14797d]">Comfort</strong>
          </div>

          <p className="mt-8 max-w-[650px] text-[22px] leading-10 text-slate-500">
            Discover premium hostels and PGs with verified listings, transparent pricing, and a community that feels like family.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            {amenities.map(({ label, icon: Icon }) => (
              <span key={label} className="inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-extrabold text-[#0b2438] shadow-[0_15px_35px_rgba(20,121,125,.12)]">
                <Icon className="h-4 w-4 text-[#14797d]" aria-hidden="true" />
                {label}
              </span>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <a href="#listings" className="inline-flex items-center gap-2 rounded-xl bg-[#14797d] px-8 py-4 text-lg font-extrabold text-white shadow-[0_20px_35px_rgba(20,121,125,.25)] transition hover:-translate-y-1">
              Find Your Stay <ArrowRight className="h-5 w-5" />
            </a>
            <button type="button" className="inline-flex items-center gap-3 rounded-xl border border-[#14797d] px-8 py-4 text-lg font-extrabold text-[#14797d] transition hover:bg-[#14797d] hover:text-white">
              <Play className="h-5 w-5 fill-current" /> Watch Video
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
