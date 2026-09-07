# Landing V2 Reference Board

Дата: 2026-09-07

## Что меняем

Текущая главная должна быть не промо-лендингом, а страницей выбора прогулки:

- фото реальной поездки;
- цена и длительность рядом с выбором;
- маршруты как товары;
- понятные условия до записи;
- блог как вход из поиска;
- кнопки ведут в Telegram и сохраняют источник перехода.

## Mobbin refs

1. [Airbnb Experience product page](https://mobbin.com/screens/c9dd3b6d-0a04-4555-b0d7-41ed471df9ca)

Что берем: галерея, название, доверие, цена и главный booking action в первом экране. Для HorseSharing это лучше обычного hero, потому что человек выбирает конкретную поездку.

2. [Klook package booking](https://mobbin.com/screens/bb77a8bf-5aae-4375-823f-7dfe21dc1d68)

Что берем: дата, время, количество людей, цена, заметки про подтверждение. В v2 это пока визуальный быстрый выбор, который ведет в Telegram.

3. [Tripadvisor tour details](https://mobbin.com/screens/01baf735-1b5b-4337-99f9-3de253cf9e49)

Что берем: блоки "что входит", "что ожидать", "отмена", "помощь". Для конных прогулок это критично: безопасность и условия важнее красивого текста.

4. [Going articles section](https://mobbin.com/sites/sections/cb69eb8a-54eb-4938-8d04-117d4d992fd2)

Что берем: editorial-сетку статей с крупными фото. Блог нужен не как новости, а как SEO-страницы под вопросы людей.

5. [Dub analytics dashboard](https://mobbin.com/screens/866c0705-a481-47af-b2e3-dfeef153dd30)

Что берем: простые цифры, путь клиента и источники. В админке не нужны слова "атрибуция" и "воронка" для обычного менеджера.

## Что не берем

- SaaS hero с абстрактным обещанием.
- Огромные декоративные блоки без действия.
- Фейковые отзывы, рейтинги и "мгновенное подтверждение".
- Сложную CRM для владельца до доказанного спроса.
- Текст для таргетологов в админке. Пишем: "оставили телефон", "создали бронь", "источник".

## SEO refs рынка

Признаки спроса уже есть, но это не доказательство бизнеса:

- GetYourGuide показывает англоязычные horse riding активности вокруг Bishkek.
- Tripadvisor имеет раздел horseback riding tours по Bishkek.
- Sxodim собирает локальные подборки "где покататься на лошадях".
- 2GIS и Instagram используются как проверка места, фото и доверия.

Доказательство спроса начнется только после данных:

- показы и клики в Google Search Console;
- показы и запросы в Яндекс Вебмастер / Wordstat;
- переходы с сайта в Telegram;
- телефоны в боте;
- подтвержденные брони.

## V2 direction

Главная:

1. Product hero: H1, короткий текст, фото-галерея, цена, быстрый выбор, Telegram CTA.
2. Route cards: каждая прогулка как отдельный товар.
3. How booking works: 3 шага без сложных слов.
4. Conditions: новичкам, детям, оплата, фото/2GIS.
5. Blog preview: статьи под поисковые вопросы.
6. FAQ.

Блог:

- `/blog`
- `/blog/gde-pokatatsya-na-loshadyah-v-bishkeke`
- `/blog/horse-riding-bishkek-for-tourists`
- `/blog/pervaya-progulka-na-loshadi-bishkek`
- `/blog/chunkurchak-horse-riding`
- `/blog/alamedin-horse-riding`
- `/blog/chto-nadet-na-konnuyu-progulku`
- `/blog/konnye-progulki-dlya-detej-bishkek`
- `/blog/instagram-loshadi-bishkek`

Маршруты:

- `/routes/chunkurchak-horse-riding`
- `/routes/chunkurchak-mountain-route`
- `/routes/alamedin-horse-riding`
