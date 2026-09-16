const assetPath = "/assets/landing/source-pending";

export const telegramBotUrl = "https://t.me/horsekgbot";

export function telegramStart(source: string) {
  return `${telegramBotUrl}?start=${source}`;
}

export const routes = [
  {
    slug: "chunkurchak-horse-riding",
    title: "Чункурчак - 1 час",
    shortTitle: "Чункурчак 1 час",
    summary: "Легкий маршрут для первого раза",
    description:
      "Спокойная прогулка недалеко от города: немного горного воздуха, понятный темп и инструктор рядом.",
    detail:
      "Этот маршрут выбирают для первого знакомства с верховой ездой, свиданий и коротких выездов из Бишкека. Темп остается спокойным, по дороге есть места для фото и паузы.",
    area: "Чункурчак",
    locationLine: "Чункурчак • 25-40 мин от Бишкека",
    price: "1 500 сом / человек",
    priceValue: 1500,
    duration: "1 час",
    travelTime: "25-40 мин от Бишкека",
    groupSize: "1-6 человек",
    level: "можно без опыта",
    image: `${assetPath}/karabulak-tour-horse-2.jpg`,
    alt: "Два всадника на конной прогулке в горах рядом с Бишкеком",
    gallery: [
      `${assetPath}/karabulak-tour-horse-2.jpg`,
      `${assetPath}/sxodim-kara-bulak-route-1.jpg`,
      `${assetPath}/sxodim-horse-club-kg-gallery-1.jpg`
    ],
    mapUrl:
      "https://2gis.kg/bishkek/search/%D0%A7%D1%83%D0%BD%D0%BA%D1%83%D1%80%D1%87%D0%B0%D0%BA%D1%81%D0%BA%D0%BE%D0%B5%20%D1%83%D1%89%D0%B5%D0%BB%D1%8C%D0%B5",
    highlights: ["Для первого раза", "Инструктор рядом", "Красивые точки для фото"],
    included: [
      "лошадь на выбранное время",
      "сопровождение инструктора",
      "помощь перед стартом",
      "спокойный маршрут в горах"
    ],
    goodFor: ["новички", "пара", "гости Бишкека", "короткий выезд на природу"],
    plan: [
      "встреча на точке старта",
      "короткий инструктаж",
      "прогулка в спокойном темпе",
      "остановка для фото по маршруту"
    ],
    needToKnow: [
      "лучше ехать в закрытой обуви",
      "в горах прохладнее, чем в городе",
      "детали по дате и встрече удобно согласовать в Telegram"
    ],
    relatedSlugs: ["chunkurchak-mountain-route", "alamedin-horse-riding"],
    analyticsTarget: "route_chunkurchak_1h"
  },
  {
    slug: "chunkurchak-mountain-route",
    title: "Чункурчак - 2 часа",
    shortTitle: "Чункурчак 2 часа",
    summary: "Горный маршрут и панорамные точки",
    description:
      "Больше времени в седле, выше виды и спокойные остановки для фотографий на фоне ущелья.",
    detail:
      "Двухчасовой маршрут лучше брать тем, кто хочет полноценную горную прогулку и готов провести в седле больше времени. Он остается туристическим, но требует чуть больше комфорта с посадкой.",
    area: "Чункурчак",
    locationLine: "Чункурчак • горный маршрут",
    price: "2 800 сом / человек",
    priceValue: 2800,
    duration: "2 часа",
    travelTime: "25-40 мин от Бишкека",
    groupSize: "1-5 человек",
    level: "лучше с базовым комфортом",
    image: `${assetPath}/karabulak-tour-horse-3.jpg`,
    alt: "Горный конный маршрут в Чункурчаке",
    gallery: [
      `${assetPath}/karabulak-tour-horse-3.jpg`,
      `${assetPath}/karabulak-tour-horse-2.jpg`,
      `${assetPath}/sxodim-horse-riding-bishkek-cover.jpg`
    ],
    mapUrl:
      "https://2gis.kg/bishkek/search/%D0%A7%D1%83%D0%BD%D0%BA%D1%83%D1%80%D1%87%D0%B0%D0%BA%D1%81%D0%BA%D0%BE%D0%B5%20%D1%83%D1%89%D0%B5%D0%BB%D1%8C%D0%B5",
    highlights: ["Панорамные виды", "Дольше в седле", "Подходит для фото-поездки"],
    included: [
      "лошадь на 2 часа",
      "сопровождение инструктора",
      "горный маршрут",
      "остановки для фото по дороге"
    ],
    goodFor: ["фото", "свидание", "туристы", "небольшая компания"],
    plan: [
      "встреча и посадка",
      "выход на горную часть маршрута",
      "паузы на видовых точках",
      "возвращение к старту"
    ],
    needToKnow: [
      "маршрут дольше, поэтому одежда должна быть удобной",
      "вечерние выезды зависят от сезона и света",
      "для совсем первого раза чаще комфортнее начать с 1 часа"
    ],
    relatedSlugs: ["chunkurchak-horse-riding", "alamedin-horse-riding"],
    analyticsTarget: "route_chunkurchak_2h"
  },
  {
    slug: "alamedin-horse-riding",
    title: "Аламедин - 1,5 часа",
    shortTitle: "Аламедин",
    summary: "Спокойная прогулка по ущелью",
    description:
      "Мягкий темп, ущелье рядом с городом и формат, который хорошо подходит новичкам.",
    detail:
      "Аламедин берут, когда хочется тихой прогулки без спортивной нагрузки. Это понятный формат для первого опыта, небольшой компании и тех, кто хочет провести время на природе рядом с Бишкеком.",
    area: "Аламедин",
    locationLine: "Аламедин • спокойный темп",
    price: "2 200 сом / человек",
    priceValue: 2200,
    duration: "1,5 часа",
    travelTime: "30-45 мин от Бишкека",
    groupSize: "1-6 человек",
    level: "можно без опыта",
    image: `${assetPath}/instagram-hydepark-post-CoJvZkhsdeY.jpg`,
    alt: "Конная прогулка в Аламединском ущелье",
    gallery: [
      `${assetPath}/instagram-hydepark-post-CoJvZkhsdeY.jpg`,
      `${assetPath}/instagram-chabandes-post-CZw0ktutO3s.jpg`,
      `${assetPath}/sxodim-horse-club-kg-gallery-1.jpg`
    ],
    mapUrl:
      "https://2gis.kg/bishkek/search/%D0%90%D0%BB%D0%B0%D0%BC%D0%B5%D0%B4%D0%B8%D0%BD%D1%81%D0%BA%D0%BE%D0%B5%20%D1%83%D1%89%D0%B5%D0%BB%D1%8C%D0%B5",
    highlights: ["Спокойное ущелье", "Хорошо новичкам", "Без спортивной нагрузки"],
    included: [
      "лошадь на 1,5 часа",
      "инструктор на маршруте",
      "помощь перед поездкой",
      "ровный туристический темп"
    ],
    goodFor: ["новички", "спокойная прогулка", "семья", "небольшая компания"],
    plan: [
      "встреча у старта",
      "посадка и объяснение основ",
      "прогулка по ущелью",
      "возвращение и фото у лошадей"
    ],
    needToKnow: [
      "для детей лучше заранее назвать возраст",
      "берите удобные брюки и закрытую обувь",
      "точку встречи отправим в Telegram"
    ],
    relatedSlugs: ["chunkurchak-horse-riding", "chunkurchak-mountain-route"],
    analyticsTarget: "route_alamedin"
  }
] as const;

export const guidePages = [
  {
    slug: "prices",
    path: "/prices",
    source: "seo_prices",
    title: "Цены на конные прогулки в Бишкеке",
    description:
      "Сколько стоят конные прогулки рядом с Бишкеком: Чункурчак, Аламедин, длительность и что входит в цену.",
    h1: "Цены на прогулки",
    lead:
      "Три понятных варианта без скрытого конструктора: короткий Чункурчак, горный Чункурчак и спокойный Аламедин.",
    sections: [
      {
        title: "Что входит",
        text:
          "В цену входит лошадь на выбранное время, сопровождение инструктора и помощь перед стартом. Трансфер, если нужен, лучше обсудить отдельно."
      },
      {
        title: "Как выбрать",
        text:
          "Для первого раза берите 1 час. Для видов и фото - Чункурчак на 2 часа. Для спокойной прогулки в ущелье - Аламедин."
      }
    ]
  },
  {
    slug: "for-beginners",
    path: "/for-beginners",
    source: "seo_beginners",
    title: "Конные прогулки для новичков в Бишкеке",
    description:
      "Маршруты для первого раза: спокойная лошадь, инструктор рядом, что надеть и как подготовиться.",
    h1: "Впервые на лошади",
    lead:
      "Нормально, если опыта нет. Начните с короткого спокойного маршрута и скажите об этом перед поездкой.",
    sections: [
      {
        title: "Лучший первый маршрут",
        text:
          "Чункурчак на 1 час или Аламедин на 1,5 часа обычно комфортнее, чем длинная поездка сразу."
      },
      {
        title: "Что надеть",
        text:
          "Закрытая обувь, удобные брюки и слой теплее для гор. Специальная форма для первой прогулки не нужна."
      }
    ]
  },
  {
    slug: "with-kids",
    path: "/with-kids",
    source: "seo_kids",
    title: "Конные прогулки с детьми в Бишкеке",
    description:
      "Как выбрать спокойный формат прогулки с детьми рядом с Бишкеком и что уточнить заранее.",
    h1: "Прогулки с детьми",
    lead:
      "Для детей важны возраст, спокойный темп и понятное сопровождение. Лучше начинать с короткой прогулки.",
    sections: [
      {
        title: "Что уточнить",
        text:
          "Возраст ребенка, опыт, длительность маршрута, кто будет рядом и где находится точка встречи."
      },
      {
        title: "Какой формат выбрать",
        text:
          "Сначала смотрите спокойные маршруты без спортивной нагрузки. Большие компании лучше делить на удобные группы."
      }
    ]
  },
  {
    slug: "instagram",
    path: "/instagram",
    source: "seo_instagram",
    title: "Фото лошадей и маршрутов в Бишкеке",
    description:
      "Где посмотреть фото конных прогулок рядом с Бишкеком: Чункурчак, Аламедин, Instagram и 2GIS.",
    h1: "Фото маршрутов",
    lead:
      "Перед поездкой полезно увидеть реальные фотографии маршрута, лошадей и точки старта.",
    sections: [
      {
        title: "Что смотреть на фото",
        text:
          "Обращайте внимание на местность, посадку, экипировку, размер группы и свежесть публикаций."
      },
      {
        title: "Зачем 2GIS",
        text:
          "Карта помогает оценить дорогу до направления. Точную точку старта удобнее получить в переписке."
      }
    ]
  }
] as const;

export const siteCopy = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://web-production-c05e3.up.railway.app",
  brand: "HorseSharing",
  domain: "web-production-c05e3.up.railway.app",
  telegramHandle: "@horsekgbot",
  brandAriaLabel: "HorseSharing Бишкек",
  navigationLabel: "Главная навигация",
  botUrls: {
    home: telegramStart("home"),
    routes: telegramStart("routes"),
    prices: telegramStart("prices"),
    beginners: telegramStart("beginners"),
    kids: telegramStart("kids"),
    instagram: telegramStart("instagram"),
    blog: telegramStart("blog")
  },
  nav: [
    { href: "/routes", label: "Маршруты" },
    { href: "/#how", label: "Как это работает" }
  ],
  metadata: {
    title: "Конные прогулки в горах Кыргызстана | HorseSharing",
    description:
      "Конные прогулки рядом с Бишкеком: Чункурчак и Аламедин, маршруты от 1 часа, цены от 1 500 сом, можно без опыта.",
    siteName: "HorseSharing",
    openGraphTitle: "Конные прогулки в горах Кыргызстана",
    openGraphDescription:
      "Чункурчак и Аламедин рядом с Бишкеком: выберите маршрут и напишите в Telegram."
  },
  hero: {
    eyebrow: "Бишкек • Чункурчак • Аламедин",
    title: "Конные прогулки в горах Кыргызстана",
    lead:
      "Чункурчак и Аламедин рядом с Бишкеком. Маршруты от 1 часа, можно без опыта.",
    image: `${assetPath}/karabulak-tour-horse-2.jpg`,
    imageAlt: "Два всадника едут по горному маршруту рядом с Бишкеком",
    primaryCta: "Выбрать маршрут",
    facts: ["от 1 500 сом", "25-40 мин от Бишкека", "для новичков"]
  },
  routesIntro: {
    title: "Выберите прогулку",
    text: "Три маршрута, которые легко сравнить по месту, длительности и цене."
  },
  beginner: {
    title: "Впервые на лошади? Нормально.",
    text:
      "Маршрут подбирается под спокойный темп. Перед стартом объясняют посадку, повод и базовые правила.",
    image: `${assetPath}/instagram-chabandes-post-CZw0ktutO3s.jpg`,
    imageAlt: "Инструктор помогает подготовиться к конной прогулке",
    points: [
      "Подберем спокойную лошадь",
      "Инструктор будет рядом",
      "Перед поездкой объясним основы"
    ]
  },
  gallery: [
    {
      src: `${assetPath}/karabulak-tour-horse-3.jpg`,
      alt: "Всадники на горном маршруте в Чункурчаке"
    },
    {
      src: `${assetPath}/sxodim-kara-bulak-route-1.jpg`,
      alt: "Конная прогулка рядом с Бишкеком"
    },
    {
      src: `${assetPath}/sxodim-horse-club-kg-gallery-1.jpg`,
      alt: "Лошади и всадники на маршруте"
    }
  ],
  howItWorks: {
    title: "Как проходит прогулка",
    steps: [
      {
        title: "Выбираете маршрут",
        text: "Смотрите место, длительность, цену и уровень."
      },
      {
        title: "Пишете в Telegram",
        text: "Указываете дату, компанию и опыт участников."
      },
      {
        title: "Получаете детали",
        text: "Согласовываем время, точку встречи и формат поездки."
      }
    ]
  },
  faq: {
    title: "Частые вопросы",
    items: [
      {
        question: "Можно без опыта?",
        answer:
          "Да. Для первого раза лучше выбирать Чункурчак на 1 час или спокойный Аламедин."
      },
      {
        question: "Сколько стоит прогулка?",
        answer:
          "Короткий маршрут начинается от 1 500 сом за человека. На странице маршрутов есть все три цены."
      },
      {
        question: "Где проходят прогулки?",
        answer:
          "Сейчас основные направления - Чункурчак и Аламедин рядом с Бишкеком."
      },
      {
        question: "Как записаться?",
        answer:
          "Выберите маршрут и напишите в Telegram. Там удобно согласовать дату, компанию и точку встречи."
      }
    ]
  },
  footer: {
    text: "Конные прогулки рядом с Бишкеком: Чункурчак, Аламедин, маршруты для первого раза и поездок с друзьями.",
    links: [
      { href: "/routes", label: "Маршруты" },
      { href: "/prices", label: "Цены" },
      { href: "/for-beginners", label: "Новичкам" },
      { href: "/with-kids", label: "С детьми" },
      { href: "/instagram", label: "Фото" },
      { href: "/blog", label: "Блог" }
    ]
  },
  routes
} as const;

export type LandingRoute = (typeof routes)[number];
export type GuidePage = (typeof guidePages)[number];

export function getRouteBySlug(slug: string) {
  return routes.find((route) => route.slug === slug);
}

export function getRelatedRoutes(route: LandingRoute) {
  return route.relatedSlugs
    .map((slug) => getRouteBySlug(slug))
    .filter((relatedRoute): relatedRoute is LandingRoute => Boolean(relatedRoute));
}

export function getGuidePageBySlug(slug: string) {
  return guidePages.find((page) => page.slug === slug);
}

export function jsonLdString(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
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
      image: `${siteCopy.siteUrl}${siteCopy.hero.image}`,
      touristType: ["Новички", "Пары", "Компании", "Туристы"],
      areaServed: {
        "@type": "City",
        name: "Бишкек"
      },
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "KGS",
        lowPrice: "1500",
        highPrice: "2800"
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
