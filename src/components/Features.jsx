import { Building2, CalendarDays, Layers, ShieldCheck, TrendingUp } from "lucide-react";
import { Badge, SectionHeading } from "./SectionShell";

const smallCards = [
  { icon: Building2, title: "Premium Hostels", copy: "Curated properties with clean rooms, great amenities, and a premium living experience.", color: "bg-[#f2a60f]" },
  { icon: CalendarDays, title: "Booking Management", copy: "Track bookings, approvals, availability, and payouts from one simple dashboard.", color: "bg-[#16a7d5]" },
  { icon: Layers, title: "Bulk Listings", copy: "Owners can add and manage multiple hostels and rooms quickly with scalable tools.", color: "bg-[#8b48f6]" },
];

const bars = [28, 38, 32, 50, 42, 53, 46, 58, 51, 66];

function Chart() {
  return (
    <div className="flex h-20 items-end gap-3">
      {bars.map((bar, index) => <span key={index} className="flex-1 rounded-t bg-[#68c8ba]" style={{ height: `${bar}px` }} />)}
    </div>
  );
}

export default function Features() {
  return (
    <section id="features" className="relative bg-[#fbfaf6] px-5 py-24 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          badge={<Badge>Why Choose Us</Badge>}
          title="Everything You Need"
          subtitle="A complete platform for finding, booking, and managing your perfect accommodation"
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-[1.15fr_.85fr_.85fr]">
          <article className="rounded-xl border border-slate-200 bg-white p-9 shadow-[0_24px_70px_rgba(20,121,125,.08)]">
            <div className="grid h-16 w-16 place-items-center rounded-xl bg-[#18c6a1]">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
            <h3 className="display-serif mt-7 text-3xl font-bold text-[#071c33]">Verified Listings</h3>
            <p className="mt-4 text-xl leading-8 text-slate-500">Stay confident with verified hostels and transparent details so you can book without stress.</p>
            <div className="mt-24 border-t border-slate-200 pt-7">
              <div className="flex justify-between">
                <div>
                  <p className="text-slate-500">Verified Properties</p>
                  <p className="mt-4 text-4xl font-extrabold text-[#071c33]">500+</p>
                </div>
                <span className="h-fit rounded-full bg-[#d9fbef] px-4 py-2 font-extrabold text-[#18a985]">+12%</span>
              </div>
              <div className="mt-8"><Chart /></div>
            </div>
          </article>

          {smallCards.slice(0, 2).map(({ icon: Icon, title, copy, color }) => (
            <article key={title} className="rounded-xl border border-slate-200 bg-white p-9 shadow-[0_24px_70px_rgba(20,121,125,.08)]">
              <div className={`grid h-16 w-16 place-items-center rounded-xl ${color}`}>
                <Icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="display-serif mt-7 text-3xl font-bold leading-tight text-[#071c33]">{title}</h3>
              <p className="mt-5 text-xl leading-9 text-slate-500">{copy}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[.68fr_1fr]">
          <div />
          <article className="rounded-xl border border-slate-200 bg-white p-9 shadow-[0_24px_70px_rgba(20,121,125,.08)]">
            <div className="grid h-16 w-16 place-items-center rounded-xl bg-[#8b48f6]">
              <Layers className="h-8 w-8 text-white" />
            </div>
            <h3 className="display-serif mt-7 text-3xl font-bold text-[#071c33]">Bulk Listings</h3>
            <p className="mt-4 text-xl leading-8 text-slate-500">Owners can add and manage multiple hostels and rooms quickly with smooth, scalable tools.</p>
            <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#eef7f6] px-4 py-2 font-bold text-[#14797d]"><TrendingUp className="h-4 w-4" /> Built for growth</span>
          </article>
        </div>
      </div>
    </section>
  );
}
