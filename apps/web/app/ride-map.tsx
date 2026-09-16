"use client";

import L from "leaflet";
import { ArrowRight, Clock3, MapPin, Navigation } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { routes } from "../content/landing";

const mapLocations = [
  {
    slug: "chunkurchak",
    title: "Чункурчак",
    subtitle: "25–40 минут от Бишкека",
    latitude: 42.6619,
    longitude: 74.6002,
    image: routes[0].image,
    mapUrl: routes[0].mapUrl,
    price: 1500,
    durations: "1–2 часа",
    rideCount: 2
  },
  {
    slug: "alamedin",
    title: "Аламедин",
    subtitle: "30–45 минут от Бишкека",
    latitude: 42.6457,
    longitude: 74.7223,
    image: routes[2].image,
    mapUrl: routes[2].mapUrl,
    price: 2200,
    durations: "1,5 часа",
    rideCount: 1
  }
] as const;

type MapLocation = (typeof mapLocations)[number];

function formatMoney(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

function popupMarkup(location: MapLocation) {
  return `
    <div class="horseMapPopup">
      <img src="${location.image}" alt="" />
      <div class="horseMapPopupBody">
        <span>${location.subtitle}</span>
        <strong>${location.title}</strong>
        <small>${location.rideCount} ${location.rideCount === 1 ? "прогулка" : "прогулки"} · от ${formatMoney(location.price)} сом</small>
        <a href="${location.mapUrl}" target="_blank" rel="noreferrer">Открыть в 2GIS →</a>
      </div>
    </div>
  `;
}

export default function RideMap({
  onChooseLocation
}: {
  onChooseLocation: (location: "Чункурчак" | "Аламедин") => void;
}) {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const [activeSlug, setActiveSlug] = useState<MapLocation["slug"]>("chunkurchak");

  useEffect(() => {
    if (!mapElementRef.current || mapRef.current) return;

    const map = L.map(mapElementRef.current, {
      zoomControl: false,
      scrollWheelZoom: false,
      attributionControl: true
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    const icon = L.divIcon({
      className: "horseMapMarker",
      html: '<span aria-hidden="true"><b>🐎</b></span>',
      iconSize: [48, 48],
      iconAnchor: [24, 42],
      popupAnchor: [0, -40]
    });

    const bounds = L.latLngBounds([]);

    for (const location of mapLocations) {
      const position = L.latLng(location.latitude, location.longitude);
      bounds.extend(position);
      const marker = L.marker(position, {
        icon,
        title: `${location.title}: конные прогулки`
      })
        .addTo(map)
        .bindPopup(popupMarkup(location), {
          className: "horseMapPopupShell",
          maxWidth: 250,
          minWidth: 230
        });

      marker.on("click", () => setActiveSlug(location.slug));
      markersRef.current[location.slug] = marker;
    }

    map.fitBounds(bounds, { padding: [52, 52], maxZoom: 11 });
    mapRef.current = map;

    const resizeObserver = new ResizeObserver(() => map.invalidateSize());
    resizeObserver.observe(mapElementRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
  }, []);

  function focusLocation(location: MapLocation) {
    setActiveSlug(location.slug);
    mapRef.current?.flyTo([location.latitude, location.longitude], 12, {
      duration: 0.75
    });
    markersRef.current[location.slug]?.openPopup();
  }

  function chooseRides(location: MapLocation) {
    onChooseLocation(location.title);
    document.querySelector("#rides")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="mapSection" aria-labelledby="map-title">
      <div className="mapSectionHeading">
        <div>
          <span>03</span>
          <div>
            <p>Локации</p>
            <h2 id="map-title">Куда поедем?</h2>
          </div>
        </div>
        <p>Две проверенные точки рядом с Бишкеком. Точный пин встречи пришлём после подтверждения.</p>
      </div>

      <div className="rideMapLayout">
        <div className="mapLocationList" aria-label="Локации прогулок">
          {mapLocations.map((location) => (
            <article className={activeSlug === location.slug ? "active" : ""} key={location.slug}>
              <button className="mapLocationMain" type="button" onClick={() => focusLocation(location)}>
                <img src={location.image} alt="" />
                <div>
                  <span><MapPin size={13} /> {location.subtitle}</span>
                  <h3>{location.title}</h3>
                  <p><Clock3 size={13} /> {location.durations} · от {formatMoney(location.price)} сом</p>
                </div>
                <i aria-hidden="true">🐎</i>
              </button>
              <div className="mapLocationActions">
                <button type="button" onClick={() => chooseRides(location)}>
                  Смотреть прогулки <ArrowRight size={15} />
                </button>
                <a href={location.mapUrl} target="_blank" rel="noreferrer">
                  <Navigation size={14} /> 2GIS
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="rideMapFrame">
          <div className="rideMap" ref={mapElementRef} aria-label="Карта конных прогулок рядом с Бишкеком" />
          <div className="mapLegend"><span>🐎</span> Старт прогулки</div>
        </div>
      </div>
    </section>
  );
}
