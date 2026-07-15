import { Badge, SectionHeading, SectionShell } from "./SectionShell";
import { Star } from "lucide-react";

const testimonials = [
  { name: "Front Desk Manager, Pearl Grand", text: "Our team can update availability faster and respond to booking requests without juggling multiple spreadsheets." },
  { name: "Revenue Lead, Skyline Business Inn", text: "EasyFindHotels helped us keep rates, room counts, and guest inquiries visible in one operational view." },
  { name: "Partner Team, Gardenia Boutique", text: "The property profile feels premium, and our staff can keep amenities and policies current without extra support." },
];

export default function Testimonials() {
  return (
    <SectionShell id="testimonials" className="py-20">
      <SectionHeading
        badge={<Badge>Hostel Team Stories</Badge>}
        title="Built for Property Partners"
        subtitle="Hostel teams use EasyFindHotels to keep listings accurate, respond faster, and manage guest demand with confidence."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {testimonials.map((item) => (
          <figure key={item.name} className="rounded-2xl border border-white/8 bg-[#0c1f33] p-7 shadow-[0_18px_45px_rgba(0,0,0,.2)]">
            <div className="flex gap-1 text-[#10c8f6]" aria-label="Five star rating">
              {Array.from({ length: 5 }).map((_, index) => <Star key={index} className="h-4 w-4 fill-current" aria-hidden="true" />)}
            </div>
            <blockquote className="mt-5 leading-7 text-slate-300">"{item.text}"</blockquote>
            <figcaption className="mt-6 font-extrabold text-white">{item.name}</figcaption>
          </figure>
        ))}
      </div>
    </SectionShell>
  );
}
