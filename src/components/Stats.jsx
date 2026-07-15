import { Award, Building2, MapPin, Users, Zap } from "lucide-react";
import { Badge, SectionHeading, SectionShell } from "./SectionShell";

const cards = [
  { icon: Building2, value: "500+", label: "Verified Hostels", copy: "Quality checked properties", color: "bg-[#16a7d5]" },
  { icon: Users, value: "9,999+", label: "Happy Guests", copy: "And counting every day", color: "bg-[#f2a60f]" },
  { icon: MapPin, value: "50+", label: "Cities Covered", copy: "Across India", color: "bg-[#18c6a1]" },
  { icon: Award, value: "98%", label: "Satisfaction Rate", copy: "Customer happiness score", color: "bg-[#8b48f6]" },
];

const marquee = ["Verified Listings", "Secure Payments", "24/7 Support", "Instant Booking", "Best Prices", "Quality Assured", "Verified Listings", "Secure Payments"];

export default function Stats() {
  return (
    <SectionShell className="bg-[#14797d] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,.13)_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
      <SectionHeading
        light
        badge={<Badge><Zap className="h-4 w-4 text-[#f2a60f]" /> Growing Every Day</Badge>}
        title="Trusted by Thousands"
        subtitle="Join our growing community of travelers finding their perfect accommodation"
      />

      <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ icon: Icon, value, label, copy, color }) => (
          <article key={label} className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/12 p-8 shadow-[0_24px_60px_rgba(0,0,0,.18)] backdrop-blur">
            <div className={`grid h-16 w-16 place-items-center rounded-xl ${color}`}>
              <Icon className="h-8 w-8 text-white" />
            </div>
            <p className="mt-8 text-5xl font-extrabold text-white">{value}</p>
            <h3 className="mt-3 text-xl font-extrabold text-white">{label}</h3>
            <p className="mt-2 text-white/80">{copy}</p>
            <span className="absolute -bottom-7 -right-6 h-24 w-24 rounded-tl-full bg-white/12" />
          </article>
        ))}
      </div>

      <div className="mt-16 flex overflow-hidden text-white/80">
        <div className="flex min-w-max animate-[slide_26s_linear_infinite] gap-9">
          {marquee.map((item, index) => (
            <span key={`${item}-${index}`} className="inline-flex items-center gap-2 font-extrabold">
              <Zap className="h-4 w-4 text-[#f2a60f]" /> {item}
            </span>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
