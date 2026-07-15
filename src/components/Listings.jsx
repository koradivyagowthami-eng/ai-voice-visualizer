import { useMemo, useState } from "react";
import { Bed, MapPin, Navigation, Search } from "lucide-react";
import { Badge, SectionHeading, SectionShell } from "./SectionShell";
import { hotels } from "../data/hotels";
import { distanceInKm } from "../utils/location";

function HotelCard({ hotel }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/9 bg-[#0c1f33] shadow-[0_20px_55px_rgba(0,0,0,.24)] transition hover:-translate-y-1 hover:border-[#10c8f6]/35">
      <div className="relative h-52 bg-cover bg-center" style={{ backgroundImage: `url(${hotel.image})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1f33]/35 via-transparent to-transparent" />
        <span className="absolute left-5 top-5 rounded-full bg-[#10c8f6] px-4 py-2 text-xs font-extrabold text-[#062032]">Available</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl font-extrabold leading-tight text-white">{hotel.name}</h3>
          <span className="shrink-0 rounded-full bg-white/7 px-3 py-1.5 text-xs font-extrabold text-white">{hotel.type}</span>
        </div>
        <p className="mt-2 flex items-center gap-2 text-sm text-slate-400">
          <MapPin className="h-4 w-4 text-[#10c8f6]" aria-hidden="true" />
          {hotel.location}
        </p>
        <div className="mt-6 flex items-end justify-between">
          <div>
            <p className="text-xs text-slate-400">Starting from</p>
            <p className="mono-num text-2xl font-extrabold text-[#10c8f6]">Rs. {hotel.price}<span className="text-base text-white">/day</span></p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Rooms</p>
            <p className="flex items-center gap-1 font-extrabold text-white"><Bed className="h-4 w-4" aria-hidden="true" /> {hotel.rooms} rooms</p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {hotel.amenities.map((item) => (
            <span key={item} className="rounded-lg bg-white/7 px-3 py-1.5 text-xs font-extrabold text-white">{item}</span>
          ))}
        </div>
        {typeof hotel.distance === "number" && (
          <p className="mt-4 text-xs font-bold text-[#10c8f6]">{hotel.distance.toFixed(1)} km from your location</p>
        )}
        <div className="mt-auto grid grid-cols-2 gap-2 pt-6">
          <a className="rounded-full border border-slate-500/70 px-3 py-2 text-center text-xs font-extrabold text-white transition hover:border-[#10c8f6] hover:text-[#10c8f6]" href={`/hotels/${hotel.slug}`}>View Details</a>
          <button className="rounded-full bg-[#10c8f6] px-3 py-2 text-xs font-extrabold text-[#062032] transition hover:bg-[#38d7ff]" type="button">Book Now</button>
        </div>
      </div>
    </article>
  );
}

export default function Listings() {
  const [query, setQuery] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("");

  const visibleHotels = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    let results = hotels.filter((hotel) => {
      if (!normalizedQuery) return true;
      return [hotel.name, hotel.location, hotel.address, hotel.type].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      );
    });

    if (userLocation) {
      results = results
        .map((hotel) => ({
          ...hotel,
          distance: distanceInKm(userLocation, hotel.coordinates),
        }))
        .sort((a, b) => a.distance - b.distance);
    }

    return results;
  }, [query, userLocation]);

  function handleUseLocation() {
    if (!navigator.geolocation) {
      setLocationStatus("Location is not supported in this browser.");
      return;
    }

    setLocationStatus("Requesting location permission...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationStatus("Nearby hostel results are sorted by distance.");
      },
      () => {
        setLocationStatus("Location permission was blocked. Please allow location access and try again.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }

  return (
    <SectionShell id="listings" className="py-24">
      <SectionHeading
        badge={<Badge>Partner Listings</Badge>}
        title="Manage Hostel Properties"
        subtitle="Review hostel profiles, room availability, team workflows, and guest demand from one responsive listing dashboard"
      />

      <form className="mt-12 rounded-2xl border border-white/8 bg-[#0c1f33] p-2 shadow-[0_24px_70px_rgba(0,0,0,.24)]" aria-label="Search hostel properties" onSubmit={(event) => event.preventDefault()}>
        <div className="flex flex-col gap-3 md:flex-row">
          <label className="relative flex min-h-16 flex-1 items-center rounded-xl bg-[#10263d] px-5">
            <Search className="mr-4 h-5 w-5 text-[#10c8f6]" aria-hidden="true" />
            <span className="sr-only">Search location or hostel</span>
            <input
              className="w-full bg-transparent text-sm font-medium text-white placeholder:text-slate-400 focus:outline-none"
              placeholder="Search hostel, location, or property type"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <button type="button" onClick={handleUseLocation} className="inline-flex min-h-14 items-center justify-center gap-3 rounded-xl border-2 border-[#10c8f6] px-7 text-sm font-extrabold text-[#10c8f6] transition hover:bg-[#10c8f6] hover:text-[#062032]">
            <Navigation className="h-5 w-5" aria-hidden="true" />
            Use My Location
          </button>
        </div>
      </form>

      {locationStatus && <p className="mt-4 rounded-xl bg-[#0c1f33] px-4 py-3 text-sm font-semibold text-slate-300">{locationStatus}</p>}

      <p className="mt-9 text-lg text-slate-400">Showing <strong className="text-white">{visibleHotels.length}</strong> of <strong className="text-white">{hotels.length}</strong> hostel properties</p>

      <div className="mt-8 grid items-stretch gap-7 md:grid-cols-2 xl:grid-cols-4">
        {visibleHotels.map((hotel) => <HotelCard key={hotel.name} hotel={hotel} />)}
      </div>
    </SectionShell>
  );
}
