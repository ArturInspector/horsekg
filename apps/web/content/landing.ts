const assetPath = "/assets/landing/source-pending";

export const telegramBotUrl = "https://t.me/horsekgbot";

export function telegramStart(source: string) {
  return `${telegramBotUrl}?start=${source}`;
}

export const siteCopy = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://web-production-c05e3.up.railway.app",
  botUrls: {
    home: telegramStart("seo_home"),
    booking: telegramStart("seo_booking"),
    routes: telegramStart("seo_routes"),
    prices: telegramStart("seo_prices"),
    beginners: telegramStart("seo_beginners"),
    kids: telegramStart("seo_kids"),
    instagram: telegramStart("seo_instagram"),
    proof: telegramStart("seo_proof"),
    blog: telegramStart("seo_blog")
  },
  brand: "HorseSharing",
  domain: "web-production-c05e3.up.railway.app",
  telegramHandle: "@horsekgbot",
  navigationLabel: "Главная навигация",
  brandAriaLabel: "HorseSharing Бишкек",
  nav: [
    { href: "/routes", label: "Маршруты" },
    { href: "/prices", label: "Цены" },
    { href: "/for-beginners", label: "Новичкам" },
    { href: "/blog", label: "Блог" }
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
    text: "Выберите локацию, длительность и компанию. Менеджер проверит свободных лошадей, подтвердит время и отправит точку встречи в Telegram.",
    primarySource: "seo_home",
    primaryCta: "Записаться в Telegram",
    secondaryCta: "Сравнить маршруты",
    factsLabel: "Коротко о прогулках",
    facts: [
      { value: "от 1 500 сом", label: "за человека" },
      { value: "1-2 часа", label: "прогулка" },
      { value: "Чункурчак", label: "и Аламедин" },
      { value: "новичкам", label: "можно" }
    ],
    note:
      "Заявка занимает пару минут. Точную точку встречи, оплату и доступность маршрута менеджер подтверждает после обращения.",
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
        src: `${assetPath}/sxodim-horse-riding-bishkek-cover.jpg`,
        alt: "Лошадь на маршруте рядом с Бишкеком"
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
      "Это не мгновенная покупка: слот, лошадей, погоду и точку старта подтверждает менеджер.",
    availability: {
      title: "Доступность",
      status: "по запросу",
      mode: "подтверждает менеджер",
      apiState: "fallback_static",
      emptyState:
        "Если выбранный слот занят, менеджер предложит ближайшее время или похожий маршрут."
    },
    fields: [
      {
        label: "Когда",
        value: "Сегодня, завтра или выходные",
        options: ["Сегодня", "Завтра", "Выходные"]
      },
      {
        label: "Локация",
        value: "Чункурчак или Аламедин",
        options: ["Чункурчак", "Аламедин"]
      },
      {
        label: "Участники",
        value: "1-6 человек",
        options: ["1", "2", "3-6"]
      },
      {
        label: "Длительность",
        value: "1-2 часа",
        options: ["1 час", "1,5 часа", "2 часа"]
      }
    ],
    cta: "Подобрать время",
    source: "seo_booking"
  },
  routesSection: {
    eyebrow: "Маршруты",
    source: "seo_routes",
    title: "Сравните прогулки как активности",
    text: "Карточки показывают цену, длительность, локацию, уровень и что входит. Если выбранное время не подтвердится, менеджер предложит ближайший вариант.",
    choosePrefix: "Выбрать время",
    detailsPrefix: "Подробнее",
    note: "Время и наличие лошадей подтверждаются менеджером после заявки."
  },
  routes: [
    {
      slug: "chunkurchak-horse-riding",
      title: "Чункурчак, прогулка 1 час",
      shortTitle: "Чункурчак 1 час",
      analyticsTarget: "route_chunkurchak_1h",
      area: "Чункурчакское ущелье",
      locationLine: "Чункурчак • 25-40 мин от Бишкека",
      price: "от 1 500 сом/чел",
      duration: "1 час",
      groupSize: "до 6 человек",
      level: "для новичков",
      nearestTimes: ["10:00", "13:00", "16:00"],
      availability: {
        status: "request",
        statusLabel: "проверяем свободных лошадей",
        confirmationMode: "manager_confirmation",
        capacityMin: 1,
        capacityMax: 6,
        capacityLabel: "1-6 человек",
        dates: ["Сегодня", "Завтра", "Выходные"],
        slots: [
          { time: "10:00", state: "request", label: "по запросу" },
          { time: "13:00", state: "few", label: "мало мест" },
          { time: "16:00", state: "request", label: "по запросу" }
        ],
        fallbackAlternatives: [
          "Чункурчак, горный маршрут 2 часа",
          "Аламедин для новичков"
        ]
      },
      description:
        "Короткий маршрут с инструктором недалеко от Бишкека. Подходит для первого знакомства с верховой ездой и спокойной прогулки в компании.",
      image: `${assetPath}/karabulak-tour-horse-2.jpg`,
      alt: "Конная прогулка на лошадях в Чункурчаке рядом с Бишкеком",
      mapUrl:
        "https://2gis.kg/bishkek/search/%D0%A7%D1%83%D0%BD%D0%BA%D1%83%D1%80%D1%87%D0%B0%D0%BA%D1%81%D0%BA%D0%BE%D0%B5%20%D1%83%D1%89%D0%B5%D0%BB%D1%8C%D0%B5",
      highlights: ["Спокойный темп", "Инструктор рядом", "Хорошо для первого раза"],
      included: [
        "лошадь на выбранное время",
        "сопровождение инструктора",
        "помощь с посадкой и базовыми правилами",
        "маршрут в спокойном темпе"
      ],
      goodFor: [
        "первый опыт верховой езды",
        "пара или небольшая компания",
        "короткая прогулка без спортивной нагрузки"
      ],
      schedule: [
        "Ориентировочные старты: 10:00, 13:00, 16:00.",
        "Точное время зависит от свободных лошадей, погоды и группы.",
        "В выходные лучше оставлять заявку заранее."
      ],
      bring: [
        "закрытую обувь с плотной подошвой",
        "удобную одежду без длинных свободных деталей",
        "теплый слой для горной погоды"
      ],
      flow: [
        "Менеджер уточняет дату, участников и опыт.",
        "Организатор подтверждает лошадей и инструктора.",
        "После подтверждения вы получаете точку встречи и детали оплаты.",
        "На месте инструктор помогает с посадкой и ведет маршрут."
      ],
      weather:
        "При плохой погоде менеджер заранее предложит перенос или другой доступный слот.",
      caution: "Точное время и свободных лошадей нужно подтвердить в Telegram.",
      relatedSlugs: ["chunkurchak-mountain-route", "alamedin-horse-riding"]
    },
    {
      slug: "chunkurchak-mountain-route",
      title: "Чункурчак, горный маршрут 2 часа",
      shortTitle: "Чункурчак 2 часа",
      analyticsTarget: "route_chunkurchak_2h",
      area: "Горы рядом с Бишкеком",
      locationLine: "Чункурчак • горный маршрут",
      price: "от 2 800 сом/чел",
      duration: "2 часа",
      groupSize: "до 5 человек",
      level: "базовый комфорт в седле",
      nearestTimes: ["10:00", "13:00", "16:00"],
      availability: {
        status: "weather_check",
        statusLabel: "зависит от погоды и света",
        confirmationMode: "manager_confirmation",
        capacityMin: 1,
        capacityMax: 5,
        capacityLabel: "1-5 человек",
        dates: ["Завтра", "Выходные"],
        slots: [
          { time: "10:00", state: "request", label: "по запросу" },
          { time: "13:00", state: "weather_check", label: "погода" },
          { time: "16:00", state: "unavailable", label: "по сезону" }
        ],
        fallbackAlternatives: [
          "Чункурчак, прогулка 1 час",
          "Аламедин для новичков"
        ]
      },
      description:
        "Более длинная поездка с горными видами и остановками для фото. Лучше выбирать, если готовы провести в седле около двух часов.",
      image: `${assetPath}/karabulak-tour-horse-3.jpg`,
      alt: "Horse riding Bishkek, горный маршрут в Чункурчаке",
      mapUrl:
        "https://2gis.kg/bishkek/search/%D0%A7%D1%83%D0%BD%D0%BA%D1%83%D1%80%D1%87%D0%B0%D0%BA%D1%81%D0%BA%D0%BE%D0%B5%20%D1%83%D1%89%D0%B5%D0%BB%D1%8C%D0%B5",
      highlights: ["Горные виды", "Остановки для фото", "Больше времени в седле"],
      included: [
        "лошадь на 2 часа",
        "маршрут с инструктором",
        "остановки для фото по погоде и безопасности",
        "подтверждение точки встречи перед поездкой"
      ],
      goodFor: [
        "фото и Instagram-сценарий",
        "свидание или гости из другого города",
        "участники, готовые к двум часам в седле"
      ],
      schedule: [
        "Ориентировочные старты: 10:00, 13:00, 16:00.",
        "Маршрут дольше, поэтому вечерние слоты зависят от сезона и погоды.",
        "Группу больше 5 человек нужно согласовать отдельно."
      ],
      bring: [
        "закрытую обувь",
        "куртку или слой теплее",
        "заряженный телефон для связи и фото"
      ],
      flow: [
        "Вы оставляете заявку и указываете опыт группы.",
        "Менеджер проверяет, подходит ли маршрут по погоде и времени.",
        "После подтверждения вы получаете точку встречи.",
        "Инструктор ведет маршрут и выбирает безопасные места для остановок."
      ],
      weather:
        "Если погода ухудшится, длинный маршрут могут заменить коротким или перенести.",
      caution: "Не выбирайте этот маршрут, если совсем не готовы к двум часам езды.",
      relatedSlugs: ["chunkurchak-horse-riding", "alamedin-horse-riding"]
    },
    {
      slug: "alamedin-horse-riding",
      title: "Аламедин для новичков",
      shortTitle: "Аламедин",
      analyticsTarget: "route_alamedin_first_ride",
      area: "Аламединское ущелье",
      locationLine: "Аламедин • спокойный темп",
      price: "от 2 200 сом/чел",
      duration: "1,5 часа",
      groupSize: "до 6 человек",
      level: "для новичков",
      nearestTimes: ["10:00", "13:00", "16:00"],
      availability: {
        status: "request",
        statusLabel: "подходит после уточнения группы",
        confirmationMode: "manager_confirmation",
        capacityMin: 1,
        capacityMax: 6,
        capacityLabel: "1-6 человек",
        dates: ["Сегодня", "Завтра", "Выходные"],
        slots: [
          { time: "10:00", state: "request", label: "по запросу" },
          { time: "13:00", state: "request", label: "по запросу" },
          { time: "16:00", state: "few", label: "мало мест" }
        ],
        fallbackAlternatives: [
          "Чункурчак, прогулка 1 час",
          "Чункурчак, горный маршрут 2 часа"
        ]
      },
      description:
        "Прогулка на лошадях в ущелье для тех, кто хочет понятный темп, инструктора рядом и маршрут без спортивной нагрузки.",
      image: `${assetPath}/instagram-hydepark-post-CoJvZkhsdeY.jpg`,
      alt: "Прогулка на лошадях Бишкек, спокойный маршрут для новичков",
      mapUrl:
        "https://2gis.kg/bishkek/search/%D0%90%D0%BB%D0%B0%D0%BC%D0%B5%D0%B4%D0%B8%D0%BD%D1%81%D0%BA%D0%BE%D0%B5%20%D1%83%D1%89%D0%B5%D0%BB%D1%8C%D0%B5",
      highlights: ["Ущелье рядом с городом", "Для новичков", "Без спортивной нагрузки"],
      included: [
        "лошадь на 1,5 часа",
        "инструктор и спокойный маршрут",
        "уточнение опыта перед поездкой",
        "подтверждение точки встречи"
      ],
      goodFor: [
        "новички",
        "спокойная прогулка",
        "дети после отдельного подтверждения"
      ],
      schedule: [
        "Ориентировочные старты: 10:00, 13:00, 16:00.",
        "Возраст детей и состав группы согласуются до подтверждения.",
        "Если слот занят, менеджер предложит ближайшее время."
      ],
      bring: [
        "закрытую обувь",
        "удобные брюки",
        "ветровку или теплый слой по погоде"
      ],
      flow: [
        "В Telegram вы пишете дату, участников и опыт.",
        "Менеджер уточняет, подходит ли формат детям или новичкам.",
        "После подтверждения приходит точка встречи.",
        "Инструктор ведет прогулку в спокойном темпе."
      ],
      weather:
        "При дожде, сильном ветре или небезопасной дороге поездку переносят после согласования.",
      caution: "Возраст детей и формат поездки нужно согласовать заранее.",
      relatedSlugs: ["chunkurchak-horse-riding", "chunkurchak-mountain-route"]
    }
  ],
  howItWorks: {
    eyebrow: "Как записаться",
    title: "Бронь подтверждает менеджер",
    steps: [
      {
        title: "Выберите маршрут",
        text: "Сравните цену, длительность, локацию, уровень и ближайшие ориентировочные часы."
      },
      {
        title: "Перейдите в Telegram",
        text: "Бот передаст заявку менеджеру: дата, группа, маршрут и телефон для связи."
      },
      {
        title: "Получите подтверждение",
        text: "Менеджер проверит лошадей, инструктора, погоду и пришлет точку встречи."
      }
    ],
    note: "Если слот не подтвердится, менеджер предложит другое время или маршрут."
  },
  conditions: {
    eyebrow: "Доверие и условия",
    title: "Без неподтвержденных обещаний",
    text: "Сервис помогает быстро оставить заявку, но не обещает мгновенный checkout. Для конной прогулки важны свободные лошади, инструктор, погода и состав группы.",
    items: [
      {
        title: "Новичкам можно",
        text: "Сообщите, что опыта нет. Менеджер подберет спокойный маршрут и темп."
      },
      {
        title: "Детей согласуем отдельно",
        text: "Возраст, посадку и формат прогулки подтверждает организатор до поездки."
      },
      {
        title: "Оплата после подтверждения",
        text: "Условия оплаты отправляют в Telegram после проверки слота и маршрута."
      },
      {
        title: "Фото можно запросить",
        text: "Актуальные фото лошадей, маршрута, Instagram или 2GIS лучше проверить перед бронью."
      }
    ],
    image: `${assetPath}/instagram-chabandes-post-CZw0ktutO3s.jpg`,
    imageAlt: "Инструктор помогает подготовить лошадь перед прогулкой"
  },
  locations: {
    eyebrow: "Локации",
    title: "Чункурчак и Аламедин рядом с Бишкеком",
    text: "До заявки можно посмотреть направление. Точную точку старта менеджер отправит после подтверждения брони.",
    image: `${assetPath}/sxodim-horse-club-kg-gallery-1.jpg`,
    imageAlt: "Всадники на вечерней конной прогулке рядом с Бишкеком",
    links: [
      {
        label: "Маршруты в Чункурчаке",
        href: "/routes/chunkurchak-horse-riding"
      },
      {
        label: "Маршрут в Аламедине",
        href: "/routes/alamedin-horse-riding"
      },
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
    title: "Все детали фиксируются в Telegram",
    text: "Так проще не потерять заявку, уточнить маршрут и сохранить переписку с точкой встречи, оплатой и переносом, если погода поменяется.",
    cta: "Спросить в Telegram"
  },
  blogPreview: {
    eyebrow: "Гиды",
    title: "SEO-входы для реальных вопросов",
    text: "Блог ведет не в бесконечное чтение, а к выбору маршрута: где кататься, сколько стоит, как ехать новичку, что уточнить с детьми и как проверить Instagram.",
    cta: "Открыть блог"
  },
  footer: {
    text: "HorseSharing - конные прогулки рядом с Бишкеком с заявкой через Telegram.",
    links: [
      { href: "/routes", label: "Маршруты" },
      { href: "/prices", label: "Цены" },
      { href: "/for-beginners", label: "Новичкам" },
      { href: "/with-kids", label: "С детьми" },
      { href: "/instagram", label: "Instagram" },
      { href: "/blog", label: "Блог" }
    ]
  },
  faq: {
    eyebrow: "FAQ",
    title: "Частые вопросы",
    items: [
      {
        question: "Можно ли кататься без опыта?",
        answer:
          "Да. Для первого раза лучше выбирать спокойный маршрут с инструктором и заранее сказать менеджеру, что опыта нет."
      },
      {
        question: "Сколько стоит конная прогулка в Бишкеке?",
        answer:
          "Ориентир на текущих карточках - от 1 500 сом за человека. Точную цену по маршруту, группе и дате менеджер подтверждает в Telegram."
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

export const commercialPages = [
  {
    slug: "routes",
    path: "/routes",
    source: "seo_routes",
    title: "Маршруты конных прогулок в Бишкеке",
    description:
      "Каталог маршрутов HorseSharing: Чункурчак, Аламедин, цены, длительность, уровень и запись через Telegram.",
    h1: "Маршруты конных прогулок",
    lead:
      "Сравните прогулки по цене, длительности, локации и уровню. После выбора менеджер подтвердит слот, лошадей и точку встречи.",
    cta: "Выбрать маршрут в Telegram",
    blocks: [
      {
        title: "Как выбрать маршрут",
        text: "Для первого раза берите 1 час и спокойный темп. Для фото и гостей города чаще подходит Чункурчак на 2 часа. Если едете с детьми, сначала согласуйте возраст и формат."
      },
      {
        title: "Что подтверждается после заявки",
        text: "Свободное время, лошади, инструктор, точка встречи, оплата и перенос при плохой погоде."
      }
    ]
  },
  {
    slug: "prices",
    path: "/prices",
    source: "seo_prices",
    title: "Цены на конные прогулки в Бишкеке",
    description:
      "Сколько стоит прогулка на лошадях рядом с Бишкеком: цены от 1 500 сом, длительность, что входит и как подтвердить время.",
    h1: "Цены на прогулки",
    lead:
      "Показываем ориентиры до переписки: от 1 500 сом за короткую прогулку. Финальная цена зависит от маршрута, длительности, группы и подтверждения организатора.",
    cta: "Проверить цену и время",
    blocks: [
      {
        title: "Что входит в цену",
        text: "Лошадь на выбранное время, сопровождение инструктора, базовая помощь перед стартом и подтверждение точки встречи."
      },
      {
        title: "Что уточняется отдельно",
        text: "Трансфер, фотоформат, условия для детей, большая группа, оплата и перенос при погоде."
      }
    ]
  },
  {
    slug: "for-beginners",
    path: "/for-beginners",
    source: "seo_beginners",
    title: "Конные прогулки для новичков в Бишкеке",
    description:
      "Маршруты для первого раза: спокойный темп, инструктор, что сказать менеджеру и как подготовиться к прогулке.",
    h1: "Конные прогулки для новичков",
    lead:
      "Если вы впервые садитесь на лошадь, выбирайте спокойный маршрут на 1-1,5 часа и сразу скажите менеджеру об опыте группы.",
    cta: "Подобрать маршрут для первого раза",
    blocks: [
      {
        title: "Лучший старт",
        text: "Короткая прогулка с инструктором помогает понять посадку и темп без усталости и лишнего стресса."
      },
      {
        title: "Что написать в Telegram",
        text: "Укажите дату, количество участников, есть ли дети и что опыта нет. Так менеджер быстрее подберет формат."
      }
    ]
  },
  {
    slug: "with-kids",
    path: "/with-kids",
    source: "seo_kids",
    title: "Конные прогулки с детьми в Бишкеке",
    description:
      "Что уточнить перед прогулкой на лошадях с детьми: возраст, инструктор, маршрут, безопасность и подтверждение.",
    h1: "Прогулки с детьми",
    lead:
      "Для детей нельзя обещать маршрут до подтверждения организатора. Менеджер уточнит возраст, опыт, посадку и формат сопровождения.",
    cta: "Уточнить маршрут для ребенка",
    blocks: [
      {
        title: "Что важно для родителей",
        text: "Возраст ребенка, будет ли инструктор рядом, сколько детей в группе, какая точка встречи и что делать при плохой погоде."
      },
      {
        title: "Какие маршруты смотреть",
        text: "Начинайте со спокойных коротких прогулок. Длинные горные маршруты лучше рассматривать только после подтверждения."
      }
    ]
  },
  {
    slug: "instagram",
    path: "/instagram",
    source: "seo_instagram",
    title: "Лошади Бишкек Instagram и фото маршрутов",
    description:
      "Как проверить конные прогулки в Бишкеке через Instagram, 2GIS и актуальные фото перед записью в Telegram.",
    h1: "Лошади, фото и Instagram",
    lead:
      "Если вы ищете лошадей в Бишкеке через Instagram, используйте фото как проверку, но подтверждайте свободное время, маршрут и точку встречи в Telegram.",
    cta: "Запросить актуальные фото",
    blocks: [
      {
        title: "Что проверить в Instagram",
        text: "Свежесть публикаций, отмеченные места, комментарии, совпадение цены и маршрута с тем, что пишет менеджер."
      },
      {
        title: "Зачем нужен 2GIS",
        text: "2GIS помогает оценить дорогу и место, но точный старт маршрута лучше получать после подтверждения брони."
      }
    ]
  }
] as const;

export type LandingRoute = (typeof siteCopy.routes)[number];
export type CommercialPage = (typeof commercialPages)[number];

export function getRouteBySlug(slug: string) {
  return siteCopy.routes.find((route) => route.slug === slug);
}

export function getCommercialPageBySlug(slug: string) {
  return commercialPages.find((page) => page.slug === slug);
}

export function getRelatedRoutes(route: LandingRoute) {
  return route.relatedSlugs
    .map((slug) => getRouteBySlug(slug))
    .filter((relatedRoute): relatedRoute is LandingRoute => Boolean(relatedRoute));
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
