import { Badge, SectionHeading, SectionShell } from "./SectionShell";
import { Check } from "lucide-react";

const plans = [
  { name: "Starter Team", price: "Free", features: ["Property profile", "Basic lead inbox", "Partner support"] },
  { name: "Growth Team", price: "Rs. 199", features: ["Priority visibility", "Booking alerts", "Rate and room tools"] },
  { name: "Hostel Group", price: "Custom", features: ["Multi-property dashboard", "Inventory controls", "Payout reports"] },
];

export default function Pricing() {
  return (
    <SectionShell id="pricing" className="py-20">
      <SectionHeading
        badge={<Badge>Partner Plans</Badge>}
        title="Simple Tools for Hostel Teams"
        subtitle="Choose the setup that fits your hostel team, from a single property profile to multi-property operations."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {plans.map((plan, index) => (
          <article key={plan.name} className={`rounded-2xl border p-7 shadow-[0_20px_50px_rgba(0,0,0,.22)] ${index === 1 ? "border-[#10c8f6]/50 bg-[#0d2a42]" : "border-white/8 bg-[#0c1f33]"}`}>
            <h3 className="text-xl font-extrabold text-white">{plan.name}</h3>
            <p className="mono-num mt-4 text-4xl font-extrabold text-[#10c8f6]">{plan.price}</p>
            <ul className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-slate-300">
                  <Check className="h-4 w-4 text-[#10c8f6]" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
