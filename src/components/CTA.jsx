import { ArrowRight, Clock, CreditCard, Shield } from "lucide-react";

const proof = [
  { icon: Shield, label: "Verified property profiles" },
  { icon: Clock, label: "Live availability controls" },
  { icon: CreditCard, label: "Secure payout tracking" },
];

export default function CTA() {
  return (
    <section className="relative overflow-hidden border-y border-white/8 bg-[#081827] px-5 pb-24 pt-20 text-center sm:px-8 lg:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(16,200,246,.13),transparent_35%)]" aria-hidden="true" />
      <div className="relative mx-auto max-w-4xl">
        <h2 className="text-[48px] font-extrabold leading-[1.04] text-white sm:text-[68px]">
          Ready to Grow Your<br />
          <span className="text-[#10c8f6]">Hostel Bookings?</span>
        </h2>
        <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-400">
          Bring your hostel team onto <strong className="text-white">EasyFindHotels.</strong> Manage listings, update rooms, respond to guest requests, and track booking activity with less manual work.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a href="#listings" className="inline-flex items-center gap-3 rounded-full bg-[#10c8f6] px-9 py-4 font-extrabold text-[#062032] transition hover:-translate-y-1 hover:bg-[#38d7ff]">Add Your Hostel <ArrowRight className="h-4 w-4" /></a>
          <a href="#features" className="inline-flex items-center gap-3 rounded-full border-2 border-slate-500/80 px-9 py-4 font-extrabold text-white transition hover:border-[#10c8f6] hover:bg-white/5">Explore Dashboard <ArrowRight className="h-4 w-4" /></a>
        </div>
        <div className="mt-11 flex flex-wrap justify-center gap-6">
          {proof.map(({ icon: Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-3 rounded-full border border-white/7 bg-[#0c1f33]/80 px-6 py-3 text-sm font-extrabold text-white shadow-[0_14px_34px_rgba(0,0,0,.2)]">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#0d314d] text-[#10c8f6]"><Icon className="h-4 w-4" /></span>
              {label}
            </span>
          ))}
        </div>
        <div className="mx-auto mt-16 grid max-w-[650px] grid-cols-3 border-t border-white/8 pt-10">
          {[
            ["1,200+", "Partners"],
            ["150+", "Markets"],
            ["24/7", "Partner Support"],
          ].map(([value, label]) => (
            <div key={label}>
              <p className="mono-num text-3xl font-extrabold text-white">{value}</p>
              <p className="mt-2 text-sm text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <span className="absolute bottom-10 right-[7%] h-32 w-32 rounded-full border border-[#10c8f6]/20" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-[#10c8f6]" style={{ clipPath: "ellipse(58% 48% at 50% 100%)" }} aria-hidden="true" />
    </section>
  );
}
