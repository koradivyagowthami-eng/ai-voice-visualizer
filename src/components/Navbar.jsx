import { useState } from "react";
import { Home, Info, Menu, Phone, X } from "lucide-react";

const navItems = [
  { label: "Home", href: "/#home", icon: Home },
  { label: "About", href: "/#features", icon: Info },
  { label: "Contact Us", href: "/#contact", icon: Phone },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[#14797d] shadow-[0_8px_24px_rgba(5,64,67,.18)]">
      <nav className="mx-auto flex h-[86px] max-w-[1500px] items-center justify-between px-5 sm:px-8 lg:px-16" aria-label="Primary navigation">
        <a href="/#home" className="script-logo rounded-none bg-[#0f7075] px-7 py-4 text-[31px] font-bold leading-none text-white shadow-sm">
          EasyFind Hostels
        </a>

        <div className="hidden items-center gap-5 md:flex">
          {navItems.map(({ label, href, icon: Icon }, index) => (
            <a
              key={label}
              href={href}
              className={`flex items-center gap-2 rounded-xl px-4 py-3 text-base font-extrabold text-white/90 transition hover:bg-white/15 ${index === 0 ? "bg-white/18" : ""}`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {label}
            </a>
          ))}
        </div>

        <a href="/#listings" className="hidden rounded-xl bg-white px-7 py-3.5 text-base font-extrabold text-[#14797d] shadow-[0_12px_30px_rgba(0,0,0,.12)] transition hover:-translate-y-0.5 hover:bg-[#fff8e8] sm:inline-flex">
          Get Started
        </a>

        <button className="rounded-xl bg-white/15 p-3 text-white md:hidden" aria-label="Toggle menu" onClick={() => setOpen((value) => !value)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-[#14797d] px-5 pb-5 md:hidden">
          <div className="grid gap-2">
            {navItems.map(({ label, href }) => (
              <a key={label} href={href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 font-bold text-white hover:bg-white/15">
                {label}
              </a>
            ))}
            <a href="/#listings" onClick={() => setOpen(false)} className="rounded-xl bg-white px-4 py-3 text-center font-extrabold text-[#14797d]">
              Get Started
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
