import { ChevronDown, CircleHelp, MessageCircle } from "lucide-react";

const faqs = [
  "How can our hostel team join EasyFindHotels?",
  "Can we manage rooms, rates, and availability?",
  "How are booking requests sent to our team?",
  "Can multiple staff members manage one property?",
  "How do payouts and invoices work?",
  "Can we update photos and hostel policies?",
  "What support is available for hostel partners?",
];

export default function FAQ() {
  return (
    <section id="faq" className="relative overflow-hidden bg-[#081827] px-5 py-24 sm:px-8 lg:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_6%_76%,rgba(16,200,246,.13),transparent_25%)]" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-[1110px] gap-12 lg:grid-cols-[.8fr_1.6fr]">
        <div className="self-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#0d314d] px-4 py-2 text-sm font-bold text-[#10c8f6]"><CircleHelp className="h-4 w-4" /> FAQ</span>
          <h2 className="mt-6 text-[44px] font-extrabold leading-tight text-white sm:text-[58px]">Hostel Team<br /><span className="text-[#10c8f6]">Questions</span><br />Answered</h2>
          <p className="mt-7 text-lg leading-8 text-slate-400">Need help with onboarding, listings, pricing, bookings, or payouts? Our partner team is ready 24/7.</p>
          <div className="mt-9 rounded-2xl border border-white/8 bg-[#0c1f33] p-6 shadow-[0_18px_45px_rgba(0,0,0,.2)]">
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[#0d314d] text-[#10c8f6]"><MessageCircle className="h-6 w-6" /></span>
              <div>
                <h3 className="font-extrabold text-white">Need partner support?</h3>
                <p className="text-sm text-slate-400">We're here for hostel teams</p>
              </div>
            </div>
            <a href="#contact" className="mt-5 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#10c8f6] px-6 py-3 text-sm font-extrabold text-[#062032]">Contact Partner Support <ChevronDown className="h-4 w-4 -rotate-90" /></a>
          </div>
        </div>

        <div className="space-y-4">
          {faqs.map((question, index) => (
            <details key={question} className="group rounded-2xl border border-white/8 bg-[#0c1f33] px-6 py-5 shadow-[0_16px_35px_rgba(0,0,0,.18)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-lg font-extrabold text-white">
                <span className="flex items-center gap-4"><span className="mono-num rounded-full bg-[#0d314d] px-2.5 py-1 text-xs text-[#10c8f6]">{String(index + 1).padStart(2, "0")}</span>{question}</span>
                <ChevronDown className="h-5 w-5 shrink-0 text-slate-300 transition group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="mt-4 pl-14 leading-7 text-slate-400">EasyFindHotels gives hostel teams tools to keep property details updated, receive verified booking requests, manage availability, and coordinate guest communication from one dashboard.</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
