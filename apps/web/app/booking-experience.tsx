"use client";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  CircleCheck,
  Clock3,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
  Sparkles,
  UsersRound,
  X
} from "lucide-react";
import { useMemo, useState } from "react";
import { routes, telegramBotUrl, type LandingRoute } from "../content/landing";

type DateChoice = "today" | "tomorrow" | "custom";
type LocationChoice = "all" | "Чункурчак" | "Аламедин";
type ContactChannel = "telegram" | "whatsapp";

const timeOptions: Record<LandingRoute["slug"], readonly string[]> = {
  "chunkurchak-horse-riding": ["10:00", "13:00", "17:00"],
  "chunkurchak-mountain-route": ["09:30", "15:30"],
  "alamedin-horse-riding": []
};

const packageSlugs: Record<LandingRoute["slug"], string> = {
  "chunkurchak-horse-riding": "chunkurchak-one-hour",
  "chunkurchak-mountain-route": "chunkurchak-two-hours",
  "alamedin-horse-riding": "alamedin-intro"
};

const fallbackApiUrl =
  process.env.NODE_ENV === "production"
    ? "https://api-production-a8255.up.railway.app"
    : undefined;

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? fallbackApiUrl;

function dateToIso(choice: DateChoice, customDate: string) {
  if (choice === "custom" && customDate) {
    return customDate;
  }

  const date = new Date();
  if (choice === "tomorrow") {
    date.setDate(date.getDate() + 1);
  }

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

function dateLabel(choice: DateChoice, customDate: string) {
  if (choice === "today") return "сегодня";
  if (choice === "tomorrow") return "завтра";
  if (!customDate) return "в выбранную дату";

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long"
  }).format(new Date(`${customDate}T12:00:00`));
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

type ApiLocation = { id: string; title: string };
type ApiPackage = { id: string; slug: string };
type ApiSlot = { id: string; startsAt: string };

async function createLiveBooking({
  route,
  date,
  time,
  participants,
  name,
  phone,
  notes
}: {
  route: LandingRoute;
  date: string;
  time: string;
  participants: number;
  name: string;
  phone: string;
  notes: string;
}) {
  if (!apiUrl) return undefined;

  const locationsResponse = await fetch(`${apiUrl}/api/locations`);
  if (!locationsResponse.ok) throw new Error("catalog");
  const locations = (await locationsResponse.json()) as ApiLocation[];
  const location = locations.find((item) => item.title === route.area);
  if (!location) return undefined;

  const packagesResponse = await fetch(
    `${apiUrl}/api/ride-packages?locationId=${encodeURIComponent(location.id)}`
  );
  if (!packagesResponse.ok) throw new Error("catalog");
  const packages = (await packagesResponse.json()) as ApiPackage[];
  const ridePackage = packages.find((item) => item.slug === packageSlugs[route.slug]);
  if (!ridePackage) return undefined;

  const from = `${date}T00:00:00+06:00`;
  const to = `${date}T23:59:59+06:00`;
  const slotsResponse = await fetch(
    `${apiUrl}/api/availability?locationId=${encodeURIComponent(location.id)}&packageId=${encodeURIComponent(ridePackage.id)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&limit=30`
  );
  if (!slotsResponse.ok) throw new Error("availability");
  const slots = (await slotsResponse.json()) as ApiSlot[];
  const slot = slots.find((item) => {
    const localTime = new Intl.DateTimeFormat("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Bishkek"
    }).format(new Date(item.startsAt));
    return localTime === time;
  });
  if (!slot) return undefined;

  const bookingResponse = await fetch(`${apiUrl}/api/bookings`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      slotId: slot.id,
      participants,
      contactPhone: phone,
      contactName: name,
      notes: notes || undefined
    })
  });

  if (!bookingResponse.ok) throw new Error("booking");
  return (await bookingResponse.json()) as { publicCode: string };
}

function Stepper({
  label,
  hint,
  value,
  minimum,
  onChange
}: {
  label: string;
  hint: string;
  value: number;
  minimum: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="bookingStepper">
      <div>
        <strong>{label}</strong>
        <span>{hint}</span>
      </div>
      <div className="stepperControls">
        <button
          type="button"
          onClick={() => onChange(Math.max(minimum, value - 1))}
          disabled={value <= minimum}
          aria-label={`Уменьшить: ${label}`}
        >
          <Minus size={17} />
        </button>
        <output>{value}</output>
        <button
          type="button"
          onClick={() => onChange(Math.min(10, value + 1))}
          disabled={value >= 10}
          aria-label={`Увеличить: ${label}`}
        >
          <Plus size={17} />
        </button>
      </div>
    </div>
  );
}

function RideCard({
  route,
  selectedTime,
  onSelect,
  onDetails
}: {
  route: LandingRoute;
  selectedTime?: string;
  onSelect: (time: string) => void;
  onDetails: () => void;
}) {
  const times = timeOptions[route.slug];

  return (
    <article className={`rideResult ${selectedTime ? "isSelected" : ""}`}>
      <button className="rideImage" type="button" onClick={onDetails}>
        <img src={route.image} alt={route.alt} />
        <span className="rideDistance">
          <MapPin size={14} /> {route.travelTime}
        </span>
        {route.level === "можно без опыта" ? (
          <span className="rideBeginner">
            <Sparkles size={13} /> Первый раз — можно
          </span>
        ) : null}
      </button>

      <div className="rideResultBody">
        <div className="rideTitleRow">
          <div>
            <p>{route.area}</p>
            <h2>{route.shortTitle}</h2>
          </div>
          <strong>
            {formatMoney(route.priceValue)} <small>сом / чел.</small>
          </strong>
        </div>

        <div className="rideMeta">
          <span>
            <Clock3 size={15} /> {route.duration}
          </span>
          <span>
            <UsersRound size={15} /> до {route.groupSize.split("-")[1] ?? "6"}
          </span>
          <span>
            <ShieldCheck size={15} /> инструктор
          </span>
        </div>

        <p className="rideDescription">{route.description}</p>

        <div className="rideAvailability">
          <div className="availabilityHeading">
            <span>{times.length ? "Доступное время" : "Расписание уточним"}</span>
            <button type="button" onClick={onDetails}>
              Подробнее <ArrowRight size={14} />
            </button>
          </div>
          {times.length ? (
            <div className="timeChips">
              {times.map((time) => (
                <button
                  className={selectedTime === time ? "active" : ""}
                  type="button"
                  key={time}
                  onClick={() => onSelect(time)}
                >
                  {selectedTime === time ? <Check size={14} /> : null}
                  {time}
                </button>
              ))}
            </div>
          ) : (
            <button className="requestTime" type="button" onClick={() => onSelect("По запросу")}>
              Запросить время
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default function BookingExperience() {
  const [dateChoice, setDateChoice] = useState<DateChoice>("tomorrow");
  const [customDate, setCustomDate] = useState("");
  const [location, setLocation] = useState<LocationChoice>("all");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [guestPanelOpen, setGuestPanelOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<LandingRoute>();
  const [selectedTime, setSelectedTime] = useState("");
  const [detailRoute, setDetailRoute] = useState<LandingRoute>();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [channel, setChannel] = useState<ContactChannel>("telegram");
  const [submitting, setSubmitting] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [submitError, setSubmitError] = useState("");

  const participants = adults + children;
  const visibleRoutes = useMemo(
    () => routes.filter((route) => location === "all" || route.area === location),
    [location]
  );
  const total = selectedRoute ? selectedRoute.priceValue * participants : 0;
  const selectedDateLabel = dateLabel(dateChoice, customDate);

  function chooseTime(route: LandingRoute, time: string) {
    setSelectedRoute(route);
    setSelectedTime(time);
  }

  async function submitBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedRoute) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const liveBooking =
        selectedTime !== "По запросу"
          ? await createLiveBooking({
              route: selectedRoute,
              date: dateToIso(dateChoice, customDate),
              time: selectedTime,
              participants,
              name,
              phone,
              notes
            })
          : undefined;

      setConfirmationCode(liveBooking?.publicCode ?? "REQUEST");
    } catch {
      setSubmitError(
        "Не получилось сохранить заявку автоматически. Откройте Telegram — данные уже собраны."
      );
      setConfirmationCode("REQUEST");
    } finally {
      setSubmitting(false);
    }
  }

  const telegramMessage = selectedRoute
    ? [
        `Хочу записаться: ${selectedRoute.shortTitle}`,
        `Дата: ${selectedDateLabel}`,
        `Время: ${selectedTime}`,
        `Группа: ${participants}`,
        `Имя: ${name}`,
        `Телефон: ${phone}`,
        notes ? `Комментарий: ${notes}` : ""
      ]
        .filter(Boolean)
        .join("\n")
    : "";
  const contactLink =
    channel === "telegram"
      ? `${telegramBotUrl}?start=web_request`
      : `https://wa.me/?text=${encodeURIComponent(telegramMessage)}`;

  return (
    <main className="bookingApp">
      <header className="bookingHeader">
        <a className="bookingBrand" href="/" aria-label="HorseSharing — главная">
          <span aria-hidden="true">H</span>
          <strong>HorseSharing</strong>
        </a>
        <div className="headerTrust">
          <i />
          Отвечаем за 5–10 минут
        </div>
        <a className="headerChat" href={telegramBotUrl}>
          <MessageCircle size={18} />
          <span>Помощь</span>
        </a>
      </header>

      <section className="bookingHero">
        <img src="/assets/booking/ala-too-riders-hero.png" alt="Конная прогулка по горам Кыргызстана" />
        <div className="bookingHeroShade" />
        <div className="bookingHeroCopy">
          <p>Бишкек · выезд в горы</p>
          <h1>Выберите прогулку.<br />Остальное мы устроим.</h1>
          <div className="heroProof">
            <span><CircleCheck size={16} /> Можно без опыта</span>
            <span><CircleCheck size={16} /> Цена сразу за группу</span>
          </div>
        </div>
      </section>

      <section className="searchPanel" aria-label="Параметры прогулки">
        <div className="searchPanelIntro">
          <span>01</span>
          <div>
            <h2>Когда и с кем?</h2>
            <p>Покажем подходящие прогулки и итоговую цену.</p>
          </div>
        </div>

        <div className="searchControls">
          <div className="controlGroup dateGroup">
            <span className="controlLabel"><CalendarDays size={15} /> Когда</span>
            <div className="segmentedControl">
              <button
                className={dateChoice === "today" ? "active" : ""}
                type="button"
                onClick={() => setDateChoice("today")}
              >
                Сегодня
              </button>
              <button
                className={dateChoice === "tomorrow" ? "active" : ""}
                type="button"
                onClick={() => setDateChoice("tomorrow")}
              >
                Завтра
              </button>
              <label className={dateChoice === "custom" ? "active" : ""}>
                {customDate
                  ? new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" }).format(
                      new Date(`${customDate}T12:00:00`)
                    )
                  : "Дата"}
                <input
                  type="date"
                  value={customDate}
                  onChange={(event) => {
                    setCustomDate(event.target.value);
                    setDateChoice("custom");
                  }}
                  aria-label="Выбрать дату"
                />
              </label>
            </div>
          </div>

          <div className="controlGroup peopleControl">
            <span className="controlLabel"><UsersRound size={15} /> Компания</span>
            <button type="button" className="selectLike" onClick={() => setGuestPanelOpen(!guestPanelOpen)}>
              {participants} {participants === 1 ? "гость" : participants < 5 ? "гостя" : "гостей"}
              <ChevronDown size={17} />
            </button>
            {guestPanelOpen ? (
              <div className="guestPopover">
                <Stepper label="Взрослые" hint="от 13 лет" value={adults} minimum={1} onChange={setAdults} />
                <Stepper label="Дети" hint="до 12 лет" value={children} minimum={0} onChange={setChildren} />
                <button className="popoverDone" type="button" onClick={() => setGuestPanelOpen(false)}>Готово</button>
              </div>
            ) : null}
          </div>

          <div className="controlGroup locationControl">
            <span className="controlLabel"><MapPin size={15} /> Где</span>
            <select value={location} onChange={(event) => setLocation(event.target.value as LocationChoice)}>
              <option value="all">Любая локация</option>
              <option value="Чункурчак">Чункурчак</option>
              <option value="Аламедин">Аламедин</option>
            </select>
          </div>
        </div>
      </section>

      <section className="resultsSection" id="rides">
        <div className="resultsHeading">
          <div>
            <span>02</span>
            <div>
              <h2>Вот что подходит</h2>
              <p>{visibleRoutes.length} варианта · {selectedDateLabel} · {participants} гостя</p>
            </div>
          </div>
          <p className="pricePromise">Никаких доплат на месте</p>
        </div>

        <div className="rideResults">
          {visibleRoutes.map((route) => (
            <RideCard
              route={route}
              selectedTime={selectedRoute?.slug === route.slug ? selectedTime : undefined}
              onSelect={(time) => chooseTime(route, time)}
              onDetails={() => setDetailRoute(route)}
              key={route.slug}
            />
          ))}
        </div>
      </section>

      <section className="confidenceStrip">
        <div><strong>Не катались раньше?</strong><span>Инструктор объяснит всё перед стартом и будет рядом на маршруте.</span></div>
        <div><strong>Точная точка встречи</strong><span>Пришлём после подтверждения вместе с контактом инструктора.</span></div>
        <div><strong>Планы поменялись?</strong><span>Бесплатная отмена за 24 часа до прогулки.</span></div>
      </section>

      <footer className="bookingFooter">
        <strong>HorseSharing</strong>
        <span>Конные прогулки рядом с Бишкеком</span>
        <a href={telegramBotUrl}>Написать нам <ArrowRight size={15} /></a>
      </footer>

      {selectedRoute ? (
        <div className="selectionBar">
          <div className="selectionSummary">
            <img src={selectedRoute.image} alt="" />
            <div>
              <span>{selectedRoute.shortTitle} · {selectedDateLabel}, {selectedTime}</span>
              <strong>{formatMoney(total)} сом <small>за {participants} чел.</small></strong>
            </div>
          </div>
          <button type="button" onClick={() => setCheckoutOpen(true)}>
            Продолжить <ArrowRight size={18} />
          </button>
        </div>
      ) : null}

      {detailRoute ? (
        <div className="sheetBackdrop" role="presentation" onMouseDown={() => setDetailRoute(undefined)}>
          <section className="detailSheet" role="dialog" aria-modal="true" aria-label={detailRoute.title} onMouseDown={(event) => event.stopPropagation()}>
            <div className="sheetHandle" />
            <button className="sheetClose" type="button" onClick={() => setDetailRoute(undefined)} aria-label="Закрыть"><X size={20} /></button>
            <img className="detailSheetImage" src={detailRoute.image} alt={detailRoute.alt} />
            <div className="detailSheetBody">
              <p>{detailRoute.locationLine}</p>
              <h2>{detailRoute.shortTitle}</h2>
              <div className="detailPrice">{formatMoney(detailRoute.priceValue)} сом <span>за человека</span></div>
              <p className="detailLead">{detailRoute.detail}</p>
              <div className="detailFacts">
                <span><Clock3 size={18} />{detailRoute.duration}</span>
                <span><UsersRound size={18} />{detailRoute.groupSize}</span>
                <span><ShieldCheck size={18} />{detailRoute.level}</span>
              </div>
              <h3>Что входит</h3>
              <ul>{detailRoute.included.map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul>
              <button
                className="sheetPrimary"
                type="button"
                onClick={() => {
                  chooseTime(detailRoute, timeOptions[detailRoute.slug][0] ?? "По запросу");
                  setDetailRoute(undefined);
                }}
              >
                {timeOptions[detailRoute.slug].length ? "Выбрать время" : "Запросить время"}
                <ArrowRight size={17} />
              </button>
            </div>
          </section>
        </div>
      ) : null}

      {checkoutOpen && selectedRoute ? (
        <div className="checkoutBackdrop" role="presentation">
          <section className="checkoutSheet" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
            <div className="checkoutHeader">
              <button type="button" onClick={() => setCheckoutOpen(false)} aria-label="Назад"><ArrowLeft size={21} /></button>
              <strong id="checkout-title">Заявка на прогулку</strong>
              <button type="button" onClick={() => setCheckoutOpen(false)} aria-label="Закрыть"><X size={21} /></button>
            </div>

            {confirmationCode ? (
              <div className="confirmationView">
                <span className="confirmationIcon"><Check size={28} /></span>
                <p>{confirmationCode === "REQUEST" ? "Остался один шаг" : `Заявка ${confirmationCode}`}</p>
                <h2>{confirmationCode === "REQUEST" ? "Отправьте заявку менеджеру" : "Заявка принята"}</h2>
                <p>
                  {confirmationCode === "REQUEST"
                    ? "Мы не смогли подтвердить слот автоматически. Менеджер проверит время в переписке."
                    : "Проверим прогулку и пришлём подтверждение с точкой встречи."}
                </p>
                {submitError ? <div className="submitNotice">{submitError}</div> : null}
                <div className="confirmationCard">
                  <img src={selectedRoute.image} alt="" />
                  <div><strong>{selectedRoute.shortTitle}</strong><span>{selectedDateLabel}, {selectedTime} · {participants} чел.</span></div>
                  <b>{formatMoney(total)} сом</b>
                </div>
                <a className="confirmContact" href={contactLink} target="_blank" rel="noreferrer">
                  <MessageCircle size={19} />
                  {channel === "telegram" ? "Открыть Telegram" : "Открыть WhatsApp"}
                </a>
                <button className="confirmationDone" type="button" onClick={() => setCheckoutOpen(false)}>Вернуться к прогулкам</button>
              </div>
            ) : (
              <form className="checkoutForm" onSubmit={submitBooking}>
                <div className="checkoutRide">
                  <img src={selectedRoute.image} alt="" />
                  <div>
                    <strong>{selectedRoute.shortTitle}</strong>
                    <span>{selectedDateLabel}, {selectedTime} · {participants} чел.</span>
                  </div>
                  <b>{formatMoney(total)} сом</b>
                </div>

                <div className="checkoutSection">
                  <span className="checkoutStep">1</span>
                  <div><h2>Куда прислать подтверждение?</h2><p>Обычно отвечаем за 5–10 минут.</p></div>
                </div>

                <label className="formField">
                  <span>Ваше имя</span>
                  <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Например, Алина" required />
                </label>
                <label className="formField">
                  <span>Номер телефона</span>
                  <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+996 555 000 000" inputMode="tel" minLength={7} required />
                </label>
                <fieldset className="channelChoice">
                  <legend>Удобный канал</legend>
                  <label className={channel === "telegram" ? "active" : ""}><input type="radio" name="channel" checked={channel === "telegram"} onChange={() => setChannel("telegram")} />Telegram</label>
                  <label className={channel === "whatsapp" ? "active" : ""}><input type="radio" name="channel" checked={channel === "whatsapp"} onChange={() => setChannel("whatsapp")} />WhatsApp</label>
                </fieldset>
                <label className="formField">
                  <span>Комментарий <small>необязательно</small></span>
                  <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Возраст детей, пожелания или вопросы" rows={3} />
                </label>

                <div className="checkoutTotal"><span>Итого за группу</span><strong>{formatMoney(total)} сом</strong></div>
                <button className="checkoutSubmit" type="submit" disabled={submitting}>
                  {submitting ? "Сохраняем…" : "Отправить заявку"}
                  {!submitting ? <ArrowRight size={18} /> : null}
                </button>
                <p className="checkoutFinePrint">Оплата сейчас не нужна. Отправляя заявку, вы соглашаетесь на обработку контактных данных.</p>
              </form>
            )}
          </section>
        </div>
      ) : null}
    </main>
  );
}
