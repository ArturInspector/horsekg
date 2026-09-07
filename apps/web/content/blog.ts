const assetPath = "/assets/landing/source-pending";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  imageAlt: string;
  keywords: string[];
  ctaSource: string;
  sections: Array<{
    heading: string;
    paragraphs: string[];
  }>;
  faq: Array<{
    question: string;
    answer: string;
  }>;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "gde-pokatatsya-na-loshadyah-v-bishkeke",
    title: "Где покататься на лошадях в Бишкеке",
    description:
      "Короткий гид по конным прогулкам рядом с Бишкеком: Чункурчак, Аламедин, формат поездки, цены и запись через Telegram.",
    h1: "Где покататься на лошадях в Бишкеке",
    date: "2026-09-07",
    readTime: "5 минут",
    category: "Гид",
    image: `${assetPath}/karabulak-tour-horse-2.jpg`,
    imageAlt: "Конная прогулка рядом с Бишкеком",
    keywords: [
      "где покататься на лошадях в Бишкеке",
      "конные прогулки Бишкек",
      "прогулка на лошадях Бишкек"
    ],
    ctaSource: "seo_blog_where_to_ride",
    sections: [
      {
        heading: "Самый простой выбор - рядом с городом",
        paragraphs: [
          "Если нужен короткий выезд без сложной логистики, начинайте с направлений рядом с Бишкеком. Для первого раза важнее не редкость маршрута, а понятный темп, инструктор и нормальная точка встречи.",
          "В HorseSharing мы начинаем с Чункурчака и Аламедина, потому что эти направления уже понятны местному рынку и туристам. Точное место старта все равно нужно подтверждать перед поездкой."
        ]
      },
      {
        heading: "Что смотреть перед записью",
        paragraphs: [
          "Смотрите длительность, цену, ограничение по группе, опыт участников и условия для детей. Если вы едете впервые, честно скажите об этом менеджеру. Это помогает подобрать спокойный маршрут.",
          "Попросите актуальные фото лошадей, маршрута и ссылку на страницу организатора в Instagram или 2GIS. Это нормальный вопрос, особенно если вы едете компанией или с ребенком."
        ]
      },
      {
        heading: "Как записаться",
        paragraphs: [
          "Выберите маршрут на сайте, перейдите в Telegram и оставьте телефон. Менеджер проверит время, свободных лошадей и инструктора, после чего отправит точку встречи и детали оплаты.",
          "Если выбранный слот занят, лучше сразу просить ближайшие варианты. Для такого отдыха ручное подтверждение надежнее, чем слепая оплата без проверки."
        ]
      }
    ],
    faq: [
      {
        question: "Какая прогулка лучше для первого раза?",
        answer:
          "Обычно стоит начинать с маршрута на 1 час с инструктором и спокойным темпом."
      },
      {
        question: "Можно ли записаться в день поездки?",
        answer:
          "Иногда можно, но свободных лошадей и инструктора нужно подтвердить заранее."
      }
    ]
  },
  {
    slug: "horse-riding-bishkek-for-tourists",
    title: "Horse riding in Bishkek for tourists",
    description:
      "A simple guide to horse riding near Bishkek: routes, duration, prices, beginner safety and Telegram booking.",
    h1: "Horse riding in Bishkek for tourists",
    date: "2026-09-07",
    readTime: "4 minutes",
    category: "For tourists",
    image: `${assetPath}/karabulak-tour-horse-3.jpg`,
    imageAlt: "Horse riding route near Bishkek",
    keywords: ["horse riding Bishkek", "riding Bishkek", "horseback riding Bishkek"],
    ctaSource: "seo_blog_horse_riding_en",
    sections: [
      {
        heading: "What to book if you are in Bishkek",
        paragraphs: [
          "If you are visiting Bishkek and want a short mountain experience, choose a guided route near the city. Chon-Kurchak and Alamedin are practical options for a first ride or a small group.",
          "For tourists, the key questions are simple: how long the ride takes, whether beginners are accepted, where the meeting point is and how payment is confirmed."
        ]
      },
      {
        heading: "Beginner safety",
        paragraphs: [
          "Tell the manager if you have no riding experience. A calm pace and instructor support matter more than choosing the longest route.",
          "For children, the organizer should confirm age, route and format before the booking is treated as final."
        ]
      },
      {
        heading: "Booking through Telegram",
        paragraphs: [
          "The site sends you to Telegram because most local operators answer faster there. You leave your phone number, and the manager checks available horses, time and meeting details.",
          "This is not instant checkout. The final booking is confirmed after the route, weather and available horses are checked."
        ]
      }
    ],
    faq: [
      {
        question: "Can beginners ride near Bishkek?",
        answer:
          "Yes, but choose a calm guided route and tell the manager that it is your first time."
      },
      {
        question: "Do I pay online immediately?",
        answer:
          "No. The manager first confirms the slot, horses and meeting point in Telegram."
      }
    ]
  },
  {
    slug: "pervaya-progulka-na-loshadi-bishkek",
    title: "Первая прогулка на лошади: что знать новичку",
    description:
      "Как выбрать маршрут, что надеть и что сказать менеджеру, если вы впервые садитесь на лошадь в Бишкеке.",
    h1: "Первая прогулка на лошади в Бишкеке",
    date: "2026-09-07",
    readTime: "5 минут",
    category: "Новичкам",
    image: `${assetPath}/instagram-chabandes-post-CZw0ktutO3s.jpg`,
    imageAlt: "Подготовка лошади перед прогулкой",
    keywords: [
      "первая прогулка на лошади",
      "верховая езда Бишкек для новичков",
      "покататься на лошадях Бишкек"
    ],
    ctaSource: "seo_blog_first_ride",
    sections: [
      {
        heading: "Не выбирайте самый длинный маршрут",
        paragraphs: [
          "Для первого раза обычно достаточно одного часа. Так вы поймете, комфортно ли вам в седле, и не устанете раньше времени.",
          "Если хотите красивые виды и фото, лучше выбрать спокойный маршрут с остановками, а не пытаться сразу брать сложную поездку."
        ]
      },
      {
        heading: "Что сказать менеджеру",
        paragraphs: [
          "Напишите, что опыта нет, сколько человек едет, есть ли дети и какой формат нужен: спокойно, с фото, для свидания или для гостей из другого города.",
          "Так менеджер быстрее поймет, какую лошадь, инструктора и время нужно согласовать."
        ]
      },
      {
        heading: "Что взять с собой",
        paragraphs: [
          "Нужна удобная одежда, закрытая обувь и слой теплее, если едете в горы. Погода рядом с городом может отличаться от погоды в центре Бишкека.",
          "Перед поездкой попросите точку встречи, время приезда и контакт человека, который встретит вас на месте."
        ]
      }
    ],
    faq: [
      {
        question: "Страшно ли ехать первый раз?",
        answer:
          "Обычно нет, если выбрать спокойный маршрут и заранее сказать, что вы новичок."
      },
      {
        question: "Нужна специальная форма?",
        answer:
          "Нет, но лучше закрытая обувь и удобная одежда без длинных свободных деталей."
      }
    ]
  },
  {
    slug: "chunkurchak-horse-riding",
    title: "Конные прогулки в Чункурчаке",
    description:
      "Что ожидать от прогулки на лошадях в Чункурчаке: длительность, цена, уровень, кому подходит и как записаться.",
    h1: "Конные прогулки в Чункурчаке",
    date: "2026-09-07",
    readTime: "4 минуты",
    category: "Чункурчак",
    image: `${assetPath}/sxodim-kara-bulak-route-1.jpg`,
    imageAlt: "Маршрут на лошадях в Чункурчаке",
    keywords: [
      "Чункурчак конные прогулки",
      "Чункурчак лошади",
      "horse riding Chon Kurchak"
    ],
    ctaSource: "seo_blog_chunkurchak",
    sections: [
      {
        heading: "Кому подходит Чункурчак",
        paragraphs: [
          "Чункурчак подходит тем, кто хочет горный маршрут рядом с Бишкеком и не хочет уезжать далеко на целый день.",
          "Для первого раза лучше выбирать короткую прогулку. Для фото и более плотного впечатления можно рассмотреть маршрут на два часа."
        ]
      },
      {
        heading: "Что уточнить до поездки",
        paragraphs: [
          "Уточните точку встречи, длительность, количество участников, условия для детей и что будет при плохой погоде.",
          "Если едете в выходные, лучше оставить заявку заранее. Самые удобные часы могут быстро заняться."
        ]
      }
    ],
    faq: [
      {
        question: "Сколько ехать до Чункурчака?",
        answer:
          "Время зависит от точки старта и дороги. Точную точку встречи менеджер отправляет после подтверждения."
      },
      {
        question: "Есть маршруты для новичков?",
        answer:
          "Да, но доступность конкретного маршрута нужно подтвердить перед поездкой."
      }
    ]
  },
  {
    slug: "alamedin-horse-riding",
    title: "Конные прогулки в Аламедине",
    description:
      "Кому подойдет прогулка на лошадях в Аламединском ущелье и что нужно уточнить перед записью.",
    h1: "Конные прогулки в Аламедине",
    date: "2026-09-07",
    readTime: "4 минуты",
    category: "Аламедин",
    image: `${assetPath}/instagram-hydepark-post-CoJvZkhsdeY.jpg`,
    imageAlt: "Прогулка на лошадях в Аламединском ущелье",
    keywords: ["Аламедин лошади", "Аламедин конные прогулки", "лошади Бишкек ущелье"],
    ctaSource: "seo_blog_alamedin",
    sections: [
      {
        heading: "Почему выбирают Аламедин",
        paragraphs: [
          "Аламедин часто рассматривают для спокойной прогулки в ущелье. Это хороший формат, если хочется природы, но без спортивной нагрузки.",
          "Перед поездкой важно подтвердить точную точку встречи и доступность маршрута на выбранное время."
        ]
      },
      {
        heading: "Как понять, подходит ли вам маршрут",
        paragraphs: [
          "Если едете впервые, выбирайте спокойный темп и не берите большую группу без подтверждения. Инструктору проще вести маленькую группу, особенно если участники разного уровня.",
          "Если планируете поездку с детьми, сначала согласуйте возраст и формат. Не обещайте детям поездку, пока организатор не подтвердил условия."
        ]
      }
    ],
    faq: [
      {
        question: "Можно ли ехать в Аламедин без опыта?",
        answer:
          "Можно, если организатор подтвердит спокойный маршрут и инструктора."
      },
      {
        question: "Где точка старта?",
        answer:
          "Точную геоточку менеджер отправляет после подтверждения заявки."
      }
    ]
  },
  {
    slug: "chto-nadet-na-konnuyu-progulku",
    title: "Что надеть на конную прогулку",
    description:
      "Простая памятка по одежде и обуви для прогулки на лошадях рядом с Бишкеком.",
    h1: "Что надеть на конную прогулку",
    date: "2026-09-07",
    readTime: "3 минуты",
    category: "Подготовка",
    image: `${assetPath}/instagram-chabandes-post-CZw0ktutO3s.jpg`,
    imageAlt: "Лошади перед прогулкой рядом с Бишкеком",
    keywords: ["что надеть на конную прогулку", "верховая езда одежда", "лошади Бишкек"],
    ctaSource: "seo_blog_what_to_wear",
    sections: [
      {
        heading: "Обувь важнее красивой фотографии",
        paragraphs: [
          "Лучше закрытая обувь с плотной подошвой. Сандалии, скользкая обувь и длинные свободные детали в одежде - плохая идея.",
          "Если вы едете только ради фото, все равно сначала выбирайте безопасность и удобство."
        ]
      },
      {
        heading: "Погода в горах меняется",
        paragraphs: [
          "Даже если в Бишкеке тепло, рядом с ущельем может быть прохладнее или ветренее. Возьмите слой теплее, особенно на вечерние часы.",
          "Перед выездом уточните у менеджера, есть ли ограничения по погоде и не переносится ли прогулка."
        ]
      }
    ],
    faq: [
      {
        question: "Можно ли ехать в платье?",
        answer:
          "Лучше выбрать удобную одежду для посадки в седле. Если нужен фотосет, согласуйте формат заранее."
      },
      {
        question: "Нужен шлем?",
        answer:
          "Наличие снаряжения нужно уточнить у организатора перед подтверждением."
      }
    ]
  },
  {
    slug: "konnye-progulki-dlya-detej-bishkek",
    title: "Конные прогулки для детей в Бишкеке",
    description:
      "Что уточнить родителям перед прогулкой на лошадях: возраст, инструктор, маршрут, безопасность и подтверждение.",
    h1: "Конные прогулки для детей в Бишкеке",
    date: "2026-09-07",
    readTime: "4 минуты",
    category: "С детьми",
    image: `${assetPath}/sxodim-horse-club-kg-gallery-1.jpg`,
    imageAlt: "Лошади на площадке рядом с Бишкеком",
    keywords: ["лошади для детей Бишкек", "конные прогулки дети Бишкек", "пони Бишкек"],
    ctaSource: "seo_blog_children",
    sections: [
      {
        heading: "Главное - не цена, а формат",
        paragraphs: [
          "Для детей нужно заранее уточнить возраст, рост, опыт, кто будет вести лошадь и какой участок маршрута подходит.",
          "Если организатор не подтвердил условия для ребенка, считать бронь готовой нельзя."
        ]
      },
      {
        heading: "Что спросить до поездки",
        paragraphs: [
          "Спросите, есть ли инструктор рядом, сколько детей может быть в группе, какая точка встречи и что делать при плохой погоде.",
          "Лучше оставить заявку заранее и честно описать состав группы. Это быстрее, чем переписываться уже в день поездки."
        ]
      }
    ],
    faq: [
      {
        question: "С какого возраста можно детям?",
        answer:
          "Возраст зависит от организатора и маршрута. Его нужно подтвердить перед записью."
      },
      {
        question: "Можно ли родителю идти рядом?",
        answer:
          "Это нужно уточнить у организатора. Для разных маршрутов правила могут отличаться."
      }
    ]
  },
  {
    slug: "instagram-loshadi-bishkek",
    title: "Лошади в Бишкеке в Instagram: как проверять перед записью",
    description:
      "Как смотреть Instagram и 2GIS перед конной прогулкой, чтобы не ехать вслепую.",
    h1: "Лошади в Бишкеке в Instagram: что проверить",
    date: "2026-09-07",
    readTime: "4 минуты",
    category: "Проверка",
    image: `${assetPath}/sxodim-kara-bulak-route-1.jpg`,
    imageAlt: "Фото конной прогулки из Instagram",
    keywords: ["инстаграм лошади Бишкек", "лошади Бишкек Instagram", "конные прогулки 2GIS"],
    ctaSource: "seo_blog_instagram",
    sections: [
      {
        heading: "Instagram полезен, но не заменяет подтверждение",
        paragraphs: [
          "Фото помогают понять атмосферу и состояние страницы, но они не отвечают на главный вопрос: свободны ли лошади и инструктор на ваше время.",
          "Смотрите свежесть публикаций, отмеченные места, комментарии и совпадает ли информация с тем, что менеджер говорит в Telegram."
        ]
      },
      {
        heading: "2GIS нужен для доверия и дороги",
        paragraphs: [
          "2GIS помогает проверить место, отзывы, навигацию и примерное расстояние. Но точку старта лучше получать от менеджера после подтверждения.",
          "Если страница выглядит сомнительно, попросите дополнительные фото или выберите другой маршрут."
        ]
      }
    ],
    faq: [
      {
        question: "Можно ли бронировать только по Instagram?",
        answer:
          "Можно, если вы доверяете организатору, но лучше иметь подтверждение времени, точки встречи и условий в одном чате."
      },
      {
        question: "Почему точку встречи не всегда пишут на сайте?",
        answer:
          "Потому что старт может зависеть от маршрута, погоды и организатора."
      }
    ]
  }
];

export const featuredBlogPosts = blogPosts.slice(0, 3);

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
