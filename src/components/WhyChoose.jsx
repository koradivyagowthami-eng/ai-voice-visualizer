import { ArrowRight, Sparkles } from "lucide-react";
import { Badge, SectionHeading, SectionShell } from "./SectionShell";

const reasons = [
  { title: "Verified Hostel Profiles", copy: "Keep photos, policies, rooms, and hostel details accurate for every guest inquiry." },
  { title: "Smarter Lead Discovery", copy: "Make rooms easier to find by city, price, amenities, availability, and stay type." },
  { title: "Booking Desk Support", copy: "Help your team manage requests, check-ins, cancellations, and guest questions faster." },
  { title: "Partner Operations Tools", copy: "Give hostel staff clear workflows for inventory, rates, booking status, and payouts." },
];

const pills = ["Property Recommendations", "Instant Booking Alerts", "Secure Payout Tracking", "Partner Success Support"];

export default function WhyChoose() {
  return (
    <SectionShell className="py-24">
      <SectionHeading
        badge={<Badge><Sparkles className="h-4 w-4" /> Our Promise</Badge>}
        title="Why Hostel Teams Choose"
        accent="EasyFind?"
        subtitle="We help hostel teams manage listings, capture demand, respond faster, and keep every booking workflow organized"
      />

      <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {reasons.map(({ title, copy }) => (
          <article key={title} className="rounded-2xl border border-white/8 bg-[#071523] p-8 text-center shadow-[0_20px_50px_rgba(0,0,0,.28)] transition hover:-translate-y-2 hover:border-[#10c8f6]/30">
            <h3 className="text-xl font-extrabold text-white">{title}</h3>
            <p className="mx-auto mt-4 max-w-[250px] text-sm leading-6 text-slate-400">{copy}</p>
          </article>
        ))}
      </div>

      <div className="mt-14 flex flex-wrap justify-center gap-4">
        {pills.map((label) => (
          <span key={label} className="inline-flex items-center rounded-full bg-[#132940] px-6 py-3 text-sm font-extrabold text-white shadow-[0_16px_30px_rgba(0,0,0,.2)]">
            {label}
          </span>
        ))}
      </div>

      <div className="mt-12 text-center">
        <a href="#listings" className="inline-flex items-center gap-4 rounded-full bg-[#10c8f6] px-8 py-4 text-sm font-extrabold text-[#062032] transition hover:-translate-y-1 hover:bg-[#38d7ff]">
          Manage Properties <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </SectionShell>
  );
}
