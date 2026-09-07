const assetPath = "/assets/landing/source-pending";

export const siteCopy = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://horsekg.kg",
  botUrls: {
    home: "https://t.me/horsekgbot?start=seo_home",
    booking: "https://t.me/horsekgbot?start=seo_booking",
    routes: "https://t.me/horsekgbot?start=seo_routes",
    proof: "https://t.me/horsekgbot?start=seo_proof",
    blog: "https://t.me/horsekgbot?start=seo_blog"
  },
  brand: "HorseSharing",
  navigationLabel: "Главная навигация",
  brandAriaLabel: "HorseSharing Бишкек",
  nav: [
    { href: "#routes", label: "Маршруты" },
    { href: "#how", label: "Как записаться" },
    { href: "/blog", label: "Блог" },
    { href: "#faq", label: "FAQ" }
  ],
  metadata: {
    title: "Конные прогулки в Бишкеке | Horse riding Bishkek",
    description:
      "Конные прогулки и horse riding рядом с Бишкеком: Чункурчак, Аламедин, маршруты от 1 часа, цены от 1 500 сом, запись через Telegram.",
    siteName: "HorseSharing Бишкек",
    openGraphTitle: "Конные прогулки в Бишкеке",
    openGraphDescription:
      "Horse riding near Bishkek: Чункурчак и Аламедин, маршруты для новичков и компаний, запись через Telegram."
  },
  hero: {
    eyebrow: "Бишкек • Чункурчак • Аламедин",
    title: "Конные прогулки в Бишкеке",
    text: "Выберите направление, время и количество участников. Менеджер проверит свободных лошадей и подтвердит запись в Telegram.",
    seoText:
      "Horse riding in Bishkek: guided rides near Chon-Kurchak, Alamedin and nearby mountain routes.",
    primarySource: "seo_home",
    primaryCta: "Записаться в Telegram",
    secondaryCta: "Сравнить маршруты",
    factsLabel: "Коротко о прогулках",
    facts: [
      { value: "от 1 500 сом", label: "за человека" },
      { value: "1-2 часа", label: "основные маршруты" },
      { value: "до 6 человек", label: "в группе" },
      { value: "Telegram", label: "быстрая запись" }
    ],
    gallery: [
      {
        src: `${assetPath}/karabulak-tour-horse-2.jpg`,
        alt: "Конная прогулка в горах рядом с Бишкеком"
      },
      {
        src: `${assetPath}/karabulak-tour-horse-3.jpg`,
        alt: "Horse riding Bishkek, маршрут в Чункурчаке"
      },
      {
        src: `${assetPath}/sxodim-horse-club-kg-gallery-1.jpg`,
        alt: "Всадники на прогулке рядом с Бишкеком"
      }
    ]
  },
  bookingPanel: {
    title: "Быстрый выбор",
    price: "от 1 500 сом/чел",
    note:
      "Это заявка, не автоматическая покупка. Менеджер подтвердит время, точку встречи и оплату.",
    fields: [
      {
        label: "Когда",
        value: "Сегодня, завтра или выходные",
        options: ["Сегодня", "Завтра", "Выходные"]
      },
      {
        label: "Куда",
        value: "Чункурчак или Аламедин",
        options: ["Чункурчак", "Аламедин", "Рядом с городом"]
      },
      {
        label: "Сколько вас",
        value: "1-6 человек",
        options: ["1", "2", "3-6"]
      }
    ],
    cta: "Проверить время",
    source: "seo_booking"
  },
  routesSection: {
    eyebrow: "Маршруты",
    source: "seo_routes",
    title: "Прогулка на лошадях рядом с Бишкеком",
    text: "Сравните направления по цене, времени и уровню. Если точный слот занят, менеджер предложит ближайший вариант.",
    choosePrefix: "Выбрать время",
    detailsPrefix: "Подробнее"
  },
  routes: [
    {
      slug: "chunkurchak-horse-riding",
      title: "Чункурчак, прогулка 1 час",
      shortTitle: "Чункурчак 1 час",
      analyticsTarget: "route_chunkurchak_1h",
      area: "Чункурчакское ущелье",
      price: "1 500 сом/чел",
      duration: "60 минут",
      groupSize: "до 6 человек",
      level: "Для новичков",
      description:
        "Короткий маршрут с инструктором недалеко от Бишкека. Подходит для первого знакомства с верховой ездой и спокойной прогулки в компании.",
      image: `${assetPath}/karabulak-tour-horse-2.jpg`,
      alt: "Конная прогулка на лошадях в Чункурчаке рядом с Бишкеком",
      mapUrl:
        "https://2gis.kg/bishkek/search/%D0%A7%D1%83%D0%BD%D0%BA%D1%83%D1%80%D1%87%D0%B0%D0%BA%D1%81%D0%BA%D0%BE%D0%B5%20%D1%83%D1%89%D0%B5%D0%BB%D1%8C%D0%B5",
      highlights: [
        "Спокойный темп",
        "Инструктор рядом",
        "Хорошо для первого раза"
      ],
      goodFor: "первый раз, пара, небольшая компания",
      caution: "Точное время и свободных лошадей нужно подтвердить в Telegram."
    },
    {
      slug: "chunkurchak-mountain-route",
      title: "Чункурчак, горный маршрут",
      shortTitle: "Чункурчак 2 часа",
      analyticsTarget: "route_chunkurchak_2h",
      area: "Горы рядом с Бишкеком",
      price: "2 800 сом/чел",
      duration: "120 минут",
      groupSize: "до 5 человек",
      level: "С инструктором",
      description:
        "Более длинная поездка с горными видами и остановками для фото. Лучше выбирать, если готовы провести в седле около двух часов.",
      image: `${assetPath}/karabulak-tour-horse-3.jpg`,
      alt: "Horse riding Bishkek, горный маршрут в Чункурчаке",
      mapUrl:
        "https://2gis.kg/bishkek/search/%D0%A7%D1%83%D0%BD%D0%BA%D1%83%D1%80%D1%87%D0%B0%D0%BA%D1%81%D0%BA%D0%BE%D0%B5%20%D1%83%D1%89%D0%B5%D0%BB%D1%8C%D0%B5",
      highlights: ["Горные виды", "Остановки для фото", "Больше времени в седле"],
      goodFor: "фото, свидание, гости из другого города",
      caution: "Не выбирайте этот маршрут, если совсем не готовы к двум часам езды."
    },
    {
      slug: "alamedin-horse-riding",
      title: "Аламедин для первого раза",
      shortTitle: "Аламедин",
      analyticsTarget: "route_alamedin_first_ride",
      area: "Аламединское ущелье",
      price: "2 200 сом/чел",
      duration: "90 минут",
      groupSize: "до 6 человек",
      level: "Спокойный темп",
      description:
        "Прогулка на лошадях в ущелье для тех, кто хочет понятный темп, инструктора рядом и маршрут без спортивной нагрузки.",
      image: `${assetPath}/instagram-hydepark-post-CoJvZkhsdeY.jpg`,
      alt: "Прогулка на лошадях Бишкек, спокойный маршрут для новичков",
      mapUrl:
        "https://2gis.kg/bishkek/search/%D0%90%D0%BB%D0%B0%D0%BC%D0%B5%D0%B4%D0%B8%D0%BD%D1%81%D0%BA%D0%BE%D0%B5%20%D1%83%D1%89%D0%B5%D0%BB%D1%8C%D0%B5",
      highlights: ["Ущелье рядом с городом", "Для новичков", "Без спортивной нагрузки"],
      goodFor: "новички, дети после подтверждения, спокойная прогулка",
      caution: "Возраст детей и формат поездки нужно согласовать заранее."
    }
  ],
  howItWorks: {
    eyebrow: "Как записаться",
    title: "Бронь занимает пару минут",
    steps: [
      {
        title: "Выберите маршрут",
        text: "На сайте видно цену, длительность, локацию и для кого подходит прогулка."
      },
      {
        title: "Оставьте телефон в Telegram",
        text: "Бот спросит локацию, время, количество участников и номер для связи."
      },
      {
        title: "Дождитесь подтверждения",
        text: "Менеджер проверит свободных лошадей, инструктора и отправит точку встречи."
      }
    ]
  },
  conditions: {
    eyebrow: "Перед поездкой",
    title: "Что важно знать заранее",
    text: "Конная прогулка зависит от погоды, группы и свободных лошадей. Поэтому мы не продаем слот вслепую - сначала подтверждаем детали.",
    items: [
      {
        title: "Новичкам можно",
        text: "Для первого раза выбирайте спокойный маршрут и скажите менеджеру, что опыта нет."
      },
      {
        title: "Детей согласуем отдельно",
        text: "Возраст, посадку и формат прогулки подтверждает организатор перед поездкой."
      },
      {
        title: "Оплата после подтверждения",
        text: "Менеджер напишет, как оплатить и что делать, если время не подойдет."
      },
      {
        title: "Фото и 2GIS можно запросить",
        text: "Перед бронью можно попросить актуальные фото лошадей, маршрута и страницы организатора."
      }
    ],
    image: `${assetPath}/instagram-chabandes-post-CZw0ktutO3s.jpg`,
    imageAlt: "Инструктор помогает подготовить лошадь перед прогулкой"
  },
  locations: {
    eyebrow: "Карта",
    title: "Чункурчак и Аламедин на карте",
    text: "До записи можно посмотреть направление. Точную точку старта менеджер отправит после подтверждения брони.",
    image: `${assetPath}/sxodim-horse-club-kg-gallery-1.jpg`,
    imageAlt: "Всадники на вечерней конной прогулке рядом с Бишкеком",
    links: [
      {
        label: "Чункурчак в 2GIS",
        href: "https://2gis.kg/bishkek/search/%D0%A7%D1%83%D0%BD%D0%BA%D1%83%D1%80%D1%87%D0%B0%D0%BA%D1%81%D0%BA%D0%BE%D0%B5%20%D1%83%D1%89%D0%B5%D0%BB%D1%8C%D0%B5"
      },
      {
        label: "Аламедин в 2GIS",
        href: "https://2gis.kg/bishkek/search/%D0%90%D0%BB%D0%B0%D0%BC%D0%B5%D0%B4%D0%B8%D0%BD%D1%81%D0%BA%D0%BE%D0%B5%20%D1%83%D1%89%D0%B5%D0%BB%D1%8C%D0%B5"
      }
    ]
  },
  proof: {
    source: "seo_proof",
    title: "Не скрываем, что сейчас все подтверждается вручную",
    text: "Это честнее для такого рынка. Лошади, инструктор, погода и группа должны совпасть. Зато менеджер может быстро предложить другое время, если слот занят.",
    cta: "Спросить в Telegram"
  },
  blogPreview: {
    eyebrow: "Блог",
    title: "Гиды для тех, кто ищет лошадей в Бишкеке",
    text: "Статьи нужны не для красоты. Они закрывают реальные вопросы из поиска: куда ехать, сколько стоит, можно ли новичкам и как выбрать маршрут.",
    cta: "Открыть блог"
  },
  faq: {
    eyebrow: "FAQ",
    title: "Частые вопросы",
    items: [
      {
        question: "Можно ли кататься без опыта?",
        answer:
          "Да. Для первого раза лучше выбирать спокойный маршрут с инструктором. Лошадь и темп подбирают под уровень группы."
      },
      {
        question: "Как забронировать прогулку на лошадях в Бишкеке?",
        answer:
          "Выберите маршрут на сайте, перейдите в Telegram и оставьте заявку. Менеджер проверит свободное время, лошадей и отправит детали."
      },
      {
        question: "Где проходят horse riding прогулки рядом с Bishkek?",
        answer:
          "Основные направления сейчас: Чункурчак и Аламедин. Точную точку старта отправляем после подтверждения брони."
      },
      {
        question: "Можно ли с детьми?",
        answer:
          "Можно для подходящих маршрутов и только после подтверждения организатора. Возраст и формат поездки нужно уточнить до брони."
      }
    ]
  }
} as const;

export type LandingRoute = (typeof siteCopy.routes)[number];

export function getRouteBySlug(slug: string) {
  return siteCopy.routes.find((route) => route.slug === slug);
}

export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteCopy.siteUrl}/#website`,
      name: siteCopy.brand,
      url: siteCopy.siteUrl,
      inLanguage: ["ru-KG", "en"]
    },
    {
      "@type": "TouristTrip",
      "@id": `${siteCopy.siteUrl}/#tourist-trip`,
      name: siteCopy.hero.title,
      description: siteCopy.metadata.description,
      image: `${siteCopy.siteUrl}${siteCopy.hero.gallery[0].src}`,
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
    },
    {
      "@type": "FAQPage",
      "@id": `${siteCopy.siteUrl}/#faq`,
      mainEntity: siteCopy.faq.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer
        }
      }))
    }
  ]
} as const;

export function jsonLdString(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
