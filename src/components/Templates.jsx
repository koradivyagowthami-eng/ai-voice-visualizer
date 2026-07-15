import { Badge, SectionHeading, SectionShell } from "./SectionShell";

const templates = [
  { title: "Business Hostel Profile", copy: "Show rooms, meeting access, transport details, and corporate-friendly amenities." },
  { title: "Group Stay Profile", copy: "Promote shared rooms, private rooms, meal plans, activities, and seasonal packages." },
  { title: "Boutique Hostel Profile", copy: "Highlight unique rooms, local experiences, policies, and direct guest communication." },
];

export default function Templates() {
  return (
    <SectionShell id="templates" className="py-20">
      <SectionHeading
        badge={<Badge>Property Profiles</Badge>}
        title="Listing Formats for Every Hostel Team"
        subtitle="Reusable profile structures help your staff present each property clearly while keeping operations easy to update."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {templates.map(({ title, copy }) => (
          <article key={title} className="rounded-2xl border border-white/8 bg-[#0c1f33] p-8 shadow-[0_18px_45px_rgba(0,0,0,.2)] transition hover:-translate-y-1 hover:border-[#10c8f6]/30">
            <h3 className="text-xl font-extrabold text-white">{title}</h3>
            <p className="mt-3 leading-7 text-slate-400">{copy}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
