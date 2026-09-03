const assetPath = "/assets/landing/source-pending";

export const siteCopy = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://horsekg.kg",
  botUrl: "https://t.me/horsekgbot?start=landing",
  brand: "HorseSharing",
  navigationLabel: "Главная навигация",
  brandAriaLabel: "HorseSharing Бишкек",
  nav: [
    { href: "#routes", label: "Маршруты" },
    { href: "#booking", label: "Запись" },
    { href: "#faq", label: "FAQ" }
  ],
  metadata: {
    title: "Конные прогулки в Бишкеке | Horse riding Bishkek",
    description:
      "Конные прогулки и horse riding рядом с Бишкеком: Чункурчак и Аламедин, маршруты от 1 часа, цены от 1 500 сом, запись через Telegram.",
    siteName: "HorseSharing Бишкек",
    openGraphTitle: "Конные прогулки в Бишкеке",
    openGraphDescription:
      "Horse riding near Bishkek: Чункурчак и Аламедин, маршруты для новичков и компаний, запись через Telegram."
  },
  hero: {
    eyebrow: "Бишкек • Чункурчак • Аламедин",
    title: "Конные прогулки в Бишкеке",
    text: "Маршруты рядом с городом для первого раза, пары или небольшой компании. Выберите направление и оставьте заявку в Telegram.",
    seoText:
      "Horse riding in Bishkek with guided routes in Chon-Kurchak and Alamedin.",
    primaryCta: "Записаться в Telegram",
    secondaryCta: "Посмотреть маршруты",
    statsLabel: "Коротко о прогулках",
    stats: [
      { value: "от 1 500 сом", label: "за человека" },
      { value: "1-2 часа", label: "основные маршруты" },
      { value: "до 6 человек", label: "в группе" }
    ],
    image: `${assetPath}/karabulak-tour-horse-2.jpg`
  },
  quickPicker: {
    label: "Быстрый выбор",
    fields: [
      { label: "Когда", value: "Сегодня, завтра или выходные" },
      { label: "Локация", value: "Чункурчак или Аламедин" },
      { label: "Участники", value: "1-6 человек" }
    ],
    cta: "Проверить время"
  },
  routesSection: {
    eyebrow: "Маршруты",
    title: "Прогулка на лошадях рядом с Бишкеком",
    text: "Сравните направления по длительности, цене и уровню. Свободное время, лошадей и инструктора подтверждает менеджер после заявки.",
    choosePrefix: "Выбрать"
  },
  routes: [
    {
      title: "Чункурчак, прогулка 1 час",
      area: "Чункурчакское ущелье",
      price: "1 500 сом/чел",
      duration: "60 минут",
      level: "Для новичков",
      description:
        "Короткий маршрут с инструктором недалеко от Бишкека. Подходит для первого знакомства с верховой ездой и спокойной прогулки в компании.",
      image: `${assetPath}/karabulak-tour-horse-2.jpg`,
      alt: "Конная прогулка на лошадях в Чункурчаке рядом с Бишкеком"
    },
    {
      title: "Чункурчак, горный маршрут",
      area: "Горы рядом с Бишкеком",
      price: "2 800 сом/чел",
      duration: "120 минут",
      level: "С инструктором",
      description:
        "Более длинная поездка с горными видами и остановками для фото. Лучше выбирать, если готовы провести в седле около двух часов.",
      image: `${assetPath}/karabulak-tour-horse-3.jpg`,
      alt: "Horse riding Bishkek, горный маршрут в Чункурчаке"
    },
    {
      title: "Аламедин для первого раза",
      area: "Аламединское ущелье",
      price: "2 200 сом/чел",
      duration: "90 минут",
      level: "Спокойный темп",
      description:
        "Прогулка на лошадях в ущелье для тех, кто хочет понятный темп, инструктора рядом и маршрут без спортивной нагрузки.",
      image: `${assetPath}/instagram-hydepark-post-CoJvZkhsdeY.jpg`,
      alt: "Прогулка на лошадях Бишкек, спокойный маршрут для новичков"
    }
  ],
  safety: {
    eyebrow: "Безопасность",
    title: "Перед поездкой уточняем опыт и состав группы",
    text: "Мы не обещаем универсальный маршрут для всех. Менеджер уточняет опыт, количество участников и подбирает подходящее время вместе с организатором прогулки.",
    image: `${assetPath}/instagram-chabandes-post-CZw0ktutO3s.jpg`,
    imageAlt: "Инструктор помогает подготовить лошадь перед прогулкой",
    items: [
      "Для первого раза выбирайте спокойный маршрут с инструктором.",
      "Для компании заранее подтверждаем свободных лошадей и места.",
      "Точку встречи, переносы и детали оплаты отправляем в Telegram."
    ]
  },
  locations: {
    eyebrow: "Локации",
    title: "Чункурчак и Аламедин на карте",
    text: "После подтверждения брони менеджер отправит точную геоточку старта и ссылку на 2GIS. До записи можно посмотреть направления и примерное расстояние от Бишкека.",
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
    title: "Фото маршрутов и лошадей",
    text: "Перед записью можно запросить актуальные фото лошадей, маршрута и страницы организатора в Instagram или 2GIS. Рейтинг и отзывы добавим на сайт только после проверки источников.",
    cta: "Спросить в Telegram"
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
