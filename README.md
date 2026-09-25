# Nazarii Mudryk — personal website

Персональный сайт на Vite, React и TypeScript. Тёмная адаптивная композиция, SVG-иконки, шесть направлений работы, стек, контакты и CV. Без backend и секретных ключей.

## Запуск

Требуется Node.js 22.12+ (проверено на 22.13.1).

```sh
npm ci
npm run dev
```

Откройте адрес, напечатанный Vite (обычно http://localhost:5173).

```sh
npm run build
npm run preview
```

Production-файлы находятся в `dist/`. Эту папку можно разместить на статическом HTTPS-хостинге. Переменные VITE подставляются при сборке; после их изменения выполните сборку снова. Для размещения в подпапке установите `base` в `vite.config.ts`.

## Где менять содержимое

- `src/config.ts` — все внешние ссылки, адрес почты и GitHub avatar.
- `src/App.tsx` — отдельные компоненты Hero, Capabilities, Connections, Stack, Consent; текст и списки компетенций.
- `src/style.css` — цвета, шрифты, адаптивность, анимации. Акцент задаётся через `--accent`.
- `index.html` — title, description и Open Graph.
- `public/favicon.svg` — собственная монограмма NM.

Фотография — локальный public/assets/nazarii-mudryk.webp (320×400, 11 690 байт), оптимизированная из предоставленного пользователем JPEG. При ошибке загружается локальный nm-avatar.svg, затем текстовый NM. Размеры аватара фиксированы. Шрифты имеют системный fallback. Анимации поддерживают prefers-reduced-motion; новых эффектов не добавлено.

## Google Analytics 4

Скопируйте `.env.example` в `.env.local` и укажите свой Measurement ID:

```dotenv
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Перезапустите dev server или повторите production build. ID не является секретом. Если ID отсутствует или имеет неверный формат, скрипт GA не загружается. До согласия посетителя не отправляется ни одного запроса GA. Выбор хранится в localStorage; настройки доступны через Analytics preferences в footer. При отзыве согласия сайт удаляет доступные ему GA cookies и перезагружает страницу, выгружая Google runtime. Если хранилище недоступно, выбор действует в текущей сессии страницы.

События в `src/analytics.ts`:

| Событие | Когда |
| --- | --- |
| page_view | Один раз при инициализации после согласия |
| social_click | GitHub, LinkedIn, Telegram, Instagram, Facebook, Upwork; параметры platform и destination |
| upwork_click | Клик по карточке Upwork |
| cv_open | Обе ссылки на CV |
| email_click | Ссылка email в нижнем CTA |
| contact_click | Let’s talk, email в нижнем CTA и Telegram |

События ставятся в очередь перед стандартным переходом по ссылке, без задержки навигации. При блокировке Google сайт и ссылки продолжают работать. UTM остаются в URL page_view и добавляются к событиям. При необходимости создайте в GA4 пользовательские определения для параметров событий. Для предотвращения дублирования page_view при подключении дополнительных тегов отключите их автоматическую отправку. Реальная доставка событий зависит от согласия, блокировщиков и сети; локальные тесты проверяют очередь, а не отчёты Google.

### Ссылки для профилей

Замените SITE_URL на итоговый HTTPS-адрес сайта:

- Instagram: `SITE_URL/?utm_source=instagram&utm_medium=social&utm_campaign=bio`
- Telegram: `SITE_URL/?utm_source=telegram&utm_medium=social&utm_campaign=profile`
- LinkedIn: `SITE_URL/?utm_source=linkedin&utm_medium=social&utm_campaign=profile`
- GitHub: `SITE_URL/?utm_source=github&utm_medium=profile&utm_campaign=portfolio`

### Альтернатива: Cloudflare Web Analytics

В панели Cloudflare откройте Web Analytics, добавьте домен и возьмите выданный JavaScript beacon. Для ручного подключения вставьте полученный snippet перед `</body>` в `index.html`; для поддерживаемого проксируемого домена доступно автоматическое добавление. Не включайте оба способа одновременно. Интеграция здесь не активирована.

Панель показывает page views и visits, источники переходов, страны, типы устройств и браузеры. Visits — оценка посещений, а не точный учёт уникальных людей (visitors). Cloudflare не использует cookies для этой статистики; этот способ не заменяет события cv_open/contact_click и не сохраняет UTM query strings. Если используете его вместо GA, оставьте VITE_GA_MEASUREMENT_ID пустым и адаптируйте текст настроек аналитики под фактически включённый инструмент.

Документация: [метрики](https://developers.cloudflare.com/web-analytics/data-metrics/high-level-metrics/), [измерения](https://developers.cloudflare.com/web-analytics/data-metrics/dimensions/), [FAQ](https://developers.cloudflare.com/web-analytics/faq/).

## Проверки

При работающем dev server на 127.0.0.1:5173 и установленном Google Chrome:

```sh
node tests/check.mjs
node tests/analytics.mjs
```

Первая проверка: 320×812, 375×812, 390×844, 768×1024 и 1440×1000, отсутствие горизонтального overflow, высота ссылок и кнопок от 44px, отсутствие runtime errors, сохранение consent, reduced motion, отсутствие GA без ID. Снимки сохраняются в `tests/viewport-*.png`.

Вторая проверка запускает изолированный Vite на 5174 с тестовым ID, перехватывает Google-запросы и проверяет согласие, пять типов событий, параметры, UTM и отзыв согласия. Реальные события Google не отправляются.

Ручная визуальная проверка выполнена по desktop/mobile screenshots. Production build проходит. Lighthouse score не измерялся.


## Production polish

Проверка production-сборки: `npm run build`, затем `npm run preview` (порт 4173) и `node tests/production.mjs`.

Скриншоты в `screenshots/`: mobile-hero-390x844.png, mobile-social-390x844.png, desktop-1440x900.png. Скрипт проверяет реальные размеры, клавиатурный focus, reduced motion, отсутствие GA без ID, href/target/rel, локальную фотографию и fallback. Отключение сети после загрузки не ломает аватар. Холодное открытие всего сайта без сети не предусмотрено: это обычный статический сайт без service worker.

Let’s talk ведёт в Telegram. Email сохранён как `mailto:asagammi@gmail.com` из исходного задания; неоднозначная запись `mailto@gmail.com` не использовалась.

## EN / UA, Facebook и Upwork

Переключатель сохраняет язык в localStorage (nm-language). По умолчанию — en, украинский — uk; html lang меняется без перезагрузки. Локальный типизированный словарь: src/i18n.ts. Бренды и названия технологий не переводятся. Facebook и Upwork: ссылки в src/config.ts, официальные иконки Simple Icons. Клики отправляют social_click; дополнительно используются facebook_click и upwork_click.

Проверка обеих версий: node tests/languages.mjs при production preview на 4173. Проверены 320, 390, 430, 1024 и 1440 px, сохранение языка, клавиатура, фото и оба уровня fallback. tests/analytics.mjs проверяет все социальные карточки и CTA в EN/UK с перехватом запросов Google.

Скриншоты: screenshots/en-mobile-390x844.png, screenshots/uk-mobile-390x844.png, screenshots/en-desktop-1440x900.png, screenshots/uk-desktop-1440x900.png.
