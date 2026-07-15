import { ArrowLeft, Bed, CalendarCheck, Check, MapPin, ShieldCheck, Star, Wifi } from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { getHotelBySlug, hotels } from "../data/hotels";

export default function HotelDetails({ slug }) {
  const hotel = getHotelBySlug(slug) ?? hotels[0];

  return (
    <div className="min-h-screen bg-[#081827] text-white">
      <Navbar />
      <main className="px-5 pb-20 pt-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1180px]">
          <a href="/#listings" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0c1f33] px-5 py-3 text-sm font-extrabold text-slate-200 transition hover:border-[#10c8f6]/50 hover:text-[#10c8f6]">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Hostels
          </a>

          <section className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#0c1f33] shadow-[0_28px_80px_rgba(0,0,0,.28)]">
            <div className="grid lg:grid-cols-[1.2fr_.8fr]">
              <div className="min-h-[360px] bg-cover bg-center lg:min-h-[560px]" style={{ backgroundImage: `url(${hotel.image})` }} aria-label={`${hotel.name} hostel photo`} />
              <div className="p-7 sm:p-10">
                <span className="inline-flex rounded-full bg-[#10c8f6] px-4 py-2 text-xs font-extrabold text-[#062032]">{hotel.type}</span>
                <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl">{hotel.name}</h1>
                <p className="mt-4 flex items-center gap-2 text-lg text-slate-400">
                  <MapPin className="h-5 w-5 text-[#10c8f6]" aria-hidden="true" />
                  {hotel.address}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/7 px-4 py-2 font-bold text-white">
                    <Star className="h-4 w-4 fill-[#10c8f6] text-[#10c8f6]" aria-hidden="true" />
                    {hotel.rating} Rating
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/7 px-4 py-2 font-bold text-white">
                    <Bed className="h-4 w-4 text-[#10c8f6]" aria-hidden="true" />
                    {hotel.rooms} Rooms
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/7 px-4 py-2 font-bold text-white">
                    <ShieldCheck className="h-4 w-4 text-[#10c8f6]" aria-hidden="true" />
                    Verified
                  </span>
                </div>

                <p className="mt-8 text-lg leading-8 text-slate-300">{hotel.description}</p>

                <div className="mt-8 rounded-2xl border border-white/8 bg-[#081827] p-6">
                  <p className="text-sm text-slate-400">Starting from</p>
                  <p className="mono-num mt-1 text-4xl font-extrabold text-[#10c8f6]">Rs. {hotel.price}<span className="text-lg text-white">/day</span></p>
                  <button className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#10c8f6] px-6 py-4 font-extrabold text-[#062032] transition hover:bg-[#38d7ff]" type="button">
                    <CalendarCheck className="h-5 w-5" aria-hidden="true" />
                    Book This Hostel
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[.75fr_1fr]">
            <article className="rounded-2xl border border-white/8 bg-[#0c1f33] p-7">
              <h2 className="text-2xl font-extrabold text-white">Amenities</h2>
              <div className="mt-5 flex flex-wrap gap-3">
                {hotel.amenities.map((item) => (
                  <span key={item} className="inline-flex items-center gap-2 rounded-xl bg-white/7 px-4 py-3 font-bold text-white">
                    <Wifi className="h-4 w-4 text-[#10c8f6]" aria-hidden="true" />
                    {item}
                  </span>
                ))}
              </div>
            </article>

            <article className="rounded-2xl border border-white/8 bg-[#0c1f33] p-7">
              <h2 className="text-2xl font-extrabold text-white">Why guests choose this stay</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {["Transparent pricing", "Instant confirmation", "Verified property", "24/7 booking support"].map((item) => (
                  <p key={item} className="flex items-center gap-3 text-slate-300">
                    <Check className="h-5 w-5 text-[#10c8f6]" aria-hidden="true" />
                    {item}
                  </p>
                ))}
              </div>
            </article>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
