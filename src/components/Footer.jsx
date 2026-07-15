import { Camera, Mail, MapPin, Network, Phone, Send, ThumbsUp } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/#home" },
  { label: "About Us", href: "/#features" },
  { label: "Partner Listings", href: "/#listings" },
  { label: "Contact Us", href: "/#contact" },
];

const socials = [
  { label: "LinkedIn", icon: Network },
  { label: "Facebook", icon: ThumbsUp },
  { label: "Instagram", icon: Camera },
  { label: "Email", icon: Mail },
];

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#0b1c2e] px-5 py-16 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <a href="/#home" className="script-logo text-[32px] font-bold leading-none text-white">
              <span className="text-[#20c5f5]">EasyFind</span>Hotels
            </a>
            <p className="mt-8 max-w-[290px] text-lg leading-8 text-slate-400">Your trusted partner for hostel teams managing listings, bookings, and guest demand across India.</p>
            <p className="mt-7 flex items-center gap-4 text-slate-400"><MapPin className="h-5 w-5 text-[#10c8f6]" aria-hidden="true" /> Hyderabad, India</p>
            <p className="mt-5 flex items-center gap-4 text-slate-400"><Phone className="h-5 w-5 text-[#10c8f6]" aria-hidden="true" /> +91 98765 43210</p>
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-white">Quick Links</h2>
            <ul className="mt-8 space-y-4">
              {quickLinks.map((link) => (
                <li key={link.label}><a href={link.href} className="text-lg text-slate-400 transition hover:text-[#10c8f6]">- {link.label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-white">Social Media</h2>
            <ul className="mt-8 space-y-4">
              {socials.map(({ label, icon: Icon }) => (
                <li key={label}>
                  <a href="#contact" className="inline-flex items-center gap-4 text-lg text-slate-400 transition hover:text-[#10c8f6]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-white">Newsletter</h2>
            <p className="mt-8 text-lg leading-7 text-slate-400">Subscribe for partner updates and product news.</p>
            <form className="mt-6 flex gap-3" aria-label="Newsletter signup">
              <label className="sr-only" htmlFor="email">Email address</label>
              <input id="email" type="email" placeholder="Enter your email" className="min-w-0 flex-1 rounded-xl bg-[#182d45] px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#10c8f6]" />
              <button type="submit" aria-label="Subscribe" className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#10c8f6] text-[#062032] transition hover:bg-[#38d7ff]">
                <Send className="h-5 w-5" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-white/10 pt-9 text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>(c) 2025 EasyFindHotels. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#contact" className="hover:text-[#10c8f6]">Privacy</a>
            <a href="#contact" className="hover:text-[#10c8f6]">Terms</a>
            <a href="#contact" className="hover:text-[#10c8f6]">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
