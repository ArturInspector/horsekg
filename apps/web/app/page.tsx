import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Star,
  UsersRound
} from "lucide-react";

const botUrl = "https://t.me/horsekgbot?start=landing";

const routes = [
  {
    title: "Чункурчак, прогулка 1 час",
    area: "Чункурчакское ущелье",
    price: "1 500 сом/чел",
    duration: "60 минут",
    level: "Для новичков",
    image: "/assets/landing/source-pending/karabulak-tour-horse-2.jpg",
    alt: "Всадники на горном маршруте рядом с Бишкеком"
  },
  {
    title: "Чункурчак, горный маршрут",
    area: "Горы рядом с Бишкеком",
    price: "2 800 сом/чел",
    duration: "120 минут",
    level: "С инструктором",
    image: "/assets/landing/source-pending/karabulak-tour-horse-3.jpg",
    alt: "Лошади подготовлены к прогулке в горах"
  },
  {
    title: "Аламедин для первого раза",
    area: "Аламединское ущелье",
    price: "2 200 сом/чел",
    duration: "90 минут",
    level: "Спокойный темп",
    image: "/assets/landing/source-pending/instagram-hydepark-post-CoJvZkhsdeY.jpg",
    alt: "Зимняя прогулка верхом на лошади"
  }
];

const faq = [
  {
    question: "Можно ли без опыта?",
    answer:
      "Да, для первого раза лучше выбирать спокойный маршрут с инструктором. Лошадь подбирают под уровень и группу."
  },
  {
    question: "Как подтверждается бронь?",
    answer:
      "Вы выбираете локацию, маршрут, время и оставляете телефон. Менеджер подтверждает наличие и отправляет детали встречи в Telegram."
  },
  {
    question: "Где проходят прогулки?",
    answer:
      "В MVP доступны Чункурчак и Аламедин. Точную точку старта менеджер присылает после подтверждения."
  },
  {
    question: "Можно ли с детьми?",
    answer:
      "Можно для подходящих маршрутов и только после подтверждения организатора. Возрастные ограничения нужно уточнять при бронировании."
  }
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "TouristTrip",
  name: "Конные прогулки в Бишкеке",
  description:
    "Конные прогулки в Чункурчаке и Аламедине с бронированием через Telegram.",
  touristType: ["Новички", "Пары", "Компании", "Туристы"],
  areaServed: {
    "@type": "City",
    name: "Бишкек"
  },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "KGS",
    lowPrice: "1500",
    highPrice: "2800",
    availability: "https://schema.org/InStock"
  }
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="heroMedia" aria-hidden="true">
            <img
              src="/assets/landing/source-pending/karabulak-tour-horse-2.jpg"
              alt=""
            />
          </div>
          <div className="heroOverlay" />
          <header className="siteHeader">
            <a className="brand" href="#top" aria-label="HorseSharing Бишкек">
              HorseSharing
            </a>
            <nav aria-label="Главная навигация">
              <a href="#routes">Маршруты</a>
              <a href="#safety">Безопасность</a>
              <a href="#faq">FAQ</a>
            </nav>
          </header>
          <div className="heroContent">
            <p className="eyebrow">Бишкек • Чункурчак • Аламедин</p>
            <h1 id="hero-title">Конные прогулки в Бишкеке</h1>
            <p className="heroText">
              Выберите локацию, маршрут и свободное время. Бронь подтверждает
              менеджер в Telegram.
            </p>
            <div className="heroActions">
              <a className="button primary" href={botUrl}>
                Записаться в Telegram
                <ArrowRight size={18} strokeWidth={2.3} />
              </a>
              <a className="button secondary" href="#routes">
                Посмотреть маршруты
              </a>
            </div>
            <dl className="heroStats" aria-label="Коротко о прогулках">
              <div>
                <dt>от 1 500 сом</dt>
                <dd>за человека</dd>
              </div>
              <div>
                <dt>60-120 минут</dt>
                <dd>основные маршруты</dd>
              </div>
              <div>
                <dt>до 6 человек</dt>
                <dd>в группе</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="searchBand" aria-label="Быстрый выбор">
          <div className="container searchGrid">
            <div>
              <span className="fieldLabel">Дата</span>
              <strong>Ближайшие 7 дней</strong>
            </div>
            <div>
              <span className="fieldLabel">Локация</span>
              <strong>Чункурчак или Аламедин</strong>
            </div>
            <div>
              <span className="fieldLabel">Участники</span>
              <strong>1-6 человек</strong>
            </div>
            <a className="button dark" href={botUrl}>
              Проверить время
              <CalendarDays size={18} />
            </a>
          </div>
        </section>

        <section className="section" id="routes" aria-labelledby="routes-title">
          <div className="container sectionHeader">
            <p className="eyebrow">Маршруты</p>
            <h2 id="routes-title">Выберите прогулку по времени и уровню</h2>
            <p>
              Для MVP доступны демо-слоты на 10:00, 13:00 и 16:00. Перед выездом
              менеджер подтверждает наличие лошадей и точку встречи.
            </p>
          </div>
          <div className="container routeGrid">
            {routes.map((route) => (
              <article className="routeCard" key={route.title}>
                <img src={route.image} alt={route.alt} />
                <div className="routeBody">
                  <div className="routeMeta">
                    <span>
                      <MapPin size={15} />
                      {route.area}
                    </span>
                    <span>
                      <Clock3 size={15} />
                      {route.duration}
                    </span>
                  </div>
                  <h3>{route.title}</h3>
                  <div className="routeFooter">
                    <div>
                      <strong>{route.price}</strong>
                      <span>{route.level}</span>
                    </div>
                    <a href={botUrl} aria-label={`Выбрать ${route.title}`}>
                      Выбрать
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section split" id="safety" aria-labelledby="safety-title">
          <div className="container splitGrid">
            <div>
              <p className="eyebrow">Перед бронью</p>
              <h2 id="safety-title">Новичкам объясняем условия до выезда</h2>
              <p>
                Лендинг не обещает абсолютную безопасность. Он показывает, какие
                шаги помогают снизить риск: инструктор, подбор лошади, спокойный
                темп и понятные ограничения.
              </p>
              <ul className="checkList">
                <li>
                  <ShieldCheck size={20} />
                  Маршруты для первого раза проходят в спокойном темпе.
                </li>
                <li>
                  <UsersRound size={20} />
                  Для группы менеджер подтверждает свободные места.
                </li>
                <li>
                  <MessageCircle size={20} />
                  Детали встречи и переносы идут через Telegram.
                </li>
              </ul>
            </div>
            <div className="safetyImage">
              <img
                src="/assets/landing/source-pending/instagram-chabandes-post-CZw0ktutO3s.jpg"
                alt="Инструктор держит лошадь перед прогулкой"
              />
            </div>
          </div>
        </section>

        <section className="section locations" aria-labelledby="locations-title">
          <div className="container locationGrid">
            <div>
              <p className="eyebrow">Карта</p>
              <h2 id="locations-title">Локации рядом с Бишкеком</h2>
              <p>
                В Telegram бот отправляет точку на карте и ссылку на 2GIS.
                Полноценную карту с фильтрами логично вынести в Mini App после
                запуска первого спроса.
              </p>
              <div className="locationLinks">
                <a href="https://2gis.kg/bishkek/search/%D0%A7%D1%83%D0%BD%D0%BA%D1%83%D1%80%D1%87%D0%B0%D0%BA%D1%81%D0%BA%D0%BE%D0%B5%20%D1%83%D1%89%D0%B5%D0%BB%D1%8C%D0%B5">
                  Чункурчак в 2GIS
                </a>
                <a href="https://2gis.kg/bishkek/search/%D0%90%D0%BB%D0%B0%D0%BC%D0%B5%D0%B4%D0%B8%D0%BD%D1%81%D0%BA%D0%BE%D0%B5%20%D1%83%D1%89%D0%B5%D0%BB%D1%8C%D0%B5">
                  Аламедин в 2GIS
                </a>
              </div>
            </div>
            <img
              src="/assets/landing/source-pending/sxodim-horse-club-kg-gallery-1.jpg"
              alt="Всадники на вечерней прогулке"
            />
          </div>
        </section>

        <section className="section proof" aria-labelledby="proof-title">
          <div className="container proofGrid">
            <div>
              <Star size={21} />
              <h2 id="proof-title">Что важно показать перед оплатой</h2>
            </div>
            <p>
              Реальные фото, источник отзывов, точка встречи, цена за человека,
              длительность, условия отмены и честный статус брони. Рейтинг не
              ставим, пока нет подтвержденных отзывов.
            </p>
            <a className="button primary compact" href={botUrl}>
              Оставить бронь
              <ArrowRight size={18} />
            </a>
          </div>
        </section>

        <section className="section faq" id="faq" aria-labelledby="faq-title">
          <div className="container">
            <p className="eyebrow">FAQ</p>
            <h2 id="faq-title">Частые вопросы</h2>
            <div className="faqGrid">
              {faq.map((item) => (
                <article key={item.question}>
                  <CheckCircle2 size={20} />
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
