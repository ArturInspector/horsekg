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
};

export const blogPosts: BlogPost[] = [
  {
    slug: "gde-pokatatsya-na-loshadyah-v-bishkeke",
    title: "Где покататься на лошадях в Бишкеке",
    description:
      "Короткий гид по Чункурчаку и Аламедину: кому подходят маршруты, сколько ехать и с чего начать новичку.",
    h1: "Где покататься на лошадях в Бишкеке",
    date: "2026-09-07",
    readTime: "4 минуты",
    category: "Гид",
    image: `${assetPath}/karabulak-tour-horse-2.jpg`,
    imageAlt: "Конная прогулка рядом с Бишкеком",
    keywords: [
      "где покататься на лошадях в Бишкеке",
      "конные прогулки Бишкек",
      "лошади Бишкек"
    ],
    ctaSource: "blog_where_to_ride",
    sections: [
      {
        heading: "Начните с маршрута рядом с городом",
        paragraphs: [
          "Для первого выезда важнее понятная дорога, спокойный темп и инструктор, чем редкая точка на карте. Поэтому Чункурчак и Аламедин остаются самыми простыми направлениями рядом с Бишкеком.",
          "Если времени мало, берите короткий маршрут. Если хочется больше видов и фотографий, смотрите двухчасовой Чункурчак."
        ]
      },
      {
        heading: "Что сравнить перед поездкой",
        paragraphs: [
          "Смотрите длительность, дорогу от города, уровень маршрута и размер группы. Новичкам комфортнее начинать с часа или полутора часов.",
          "Для поездки с детьми заранее называйте возраст и опыт. Так проще выбрать спокойный формат без лишней нагрузки."
        ]
      }
    ]
  },
  {
    slug: "pervaya-progulka-na-loshadi-bishkek",
    title: "Первая прогулка на лошади: что знать",
    description:
      "Что надеть, какой маршрут выбрать и почему первый раз не обязан быть сложным.",
    h1: "Первая прогулка на лошади",
    date: "2026-09-07",
    readTime: "4 минуты",
    category: "Новичкам",
    image: `${assetPath}/instagram-chabandes-post-CZw0ktutO3s.jpg`,
    imageAlt: "Подготовка к конной прогулке",
    keywords: [
      "первая прогулка на лошади",
      "верховая езда Бишкек для новичков",
      "конные прогулки для новичков"
    ],
    ctaSource: "blog_first_ride",
    sections: [
      {
        heading: "Не берите самый длинный маршрут",
        paragraphs: [
          "Первый раз должен быть понятным. Один час часто лучше, чем длинная поездка, после которой вы устаете раньше, чем начинаете получать удовольствие.",
          "Короткая прогулка помогает спокойно привыкнуть к посадке, поводьям и движению лошади."
        ]
      },
      {
        heading: "Одежда и обувь",
        paragraphs: [
          "Нужны закрытая обувь, удобные брюки и верхний слой для горной погоды. Ветер и температура рядом с ущельем могут отличаться от центра города.",
          "Длинные свободные детали одежды лучше не надевать. Телефон держите так, чтобы он не мешал посадке."
        ]
      }
    ]
  },
  {
    slug: "horse-riding-bishkek-for-tourists",
    title: "Horse riding in Bishkek for tourists",
    description:
      "A practical guide to short guided rides near Bishkek: Chon-Kurchak, Alamedin, prices and beginner-friendly formats.",
    h1: "Horse riding in Bishkek",
    date: "2026-09-07",
    readTime: "4 minutes",
    category: "For tourists",
    image: `${assetPath}/karabulak-tour-horse-3.jpg`,
    imageAlt: "Horse riding route near Bishkek",
    keywords: ["horse riding Bishkek", "horseback riding Bishkek", "Chon Kurchak horse riding"],
    ctaSource: "blog_horse_riding_en",
    sections: [
      {
        heading: "Pick a short mountain ride",
        paragraphs: [
          "If you are visiting Bishkek, Chon-Kurchak and Alamedin are practical choices for a short outdoor plan. You get mountain scenery without turning the day into a long transfer.",
          "Beginners should start with a calm guided route. A one-hour ride is usually enough for a first experience."
        ]
      },
      {
        heading: "What to ask before you go",
        paragraphs: [
          "Ask about the meeting point, ride duration, group size and clothing. Closed shoes and comfortable trousers are the safest basic choice.",
          "For children or mixed-experience groups, choose the calmer route first."
        ]
      }
    ]
  }
];

export const featuredBlogPosts = blogPosts.slice(0, 3);

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
