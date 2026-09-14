# Slides SPA

Тестовое задание: SPA с имитацией аутентификации и каруселью слайдов (добавление, удаление, отметка) с сохранением в `localStorage`.

**Демо:** https://&lt;username&gt;.github.io/&lt;repo&gt;/

**Теория:** [THEORY.md](./THEORY.md)

## Вход в демо

Аутентификация имитационная, backend нет. Подходит **любой синтаксически корректный email** и **любой пароль от 3 символов**, например:

```
email:    test@example.com
password: 123
```

## Стек

| Задача        | Решение                                                                                      |
| ------------- | -------------------------------------------------------------------------------------------- |
| UI            | React 18, Mantine 7 (core, hooks, form, notifications)                                       |
| Карусель      | `@mantine/carousel` (Embla Carousel 8)                                                       |
| Состояние     | Zustand 5                                                                                    |
| Роутинг       | React Router 6.30 (`createBrowserRouter`)                                                    |
| Язык          | TypeScript 5.9, `strict` + `noUncheckedIndexedAccess`                                        |
| Сборка        | Vite 7                                                                                       |
| Качество кода | ESLint 9 (typescript-eslint type-checked, react-hooks, `eslint-plugin-boundaries`), Prettier |
| Деплой        | GitHub Actions → GitHub Pages                                                                |

## Запуск локально

Требуется Node.js 20.19+ или 22.12+.

```bash
npm install
npm run dev        # http://localhost:5173
```

| Скрипт              | Что делает                                              |
| ------------------- | ------------------------------------------------------- |
| `npm run dev`       | dev-сервер Vite                                         |
| `npm run build`     | проверка типов (`tsc -b`) и production-сборка в `dist/` |
| `npm run preview`   | локальный просмотр собранного `dist/`                   |
| `npm run typecheck` | только проверка типов                                   |
| `npm run lint`      | ESLint, включая проверку импортов между слоями FSD      |
| `npm run lint:fix`  | ESLint с автоисправлением                               |
| `npm run format`    | Prettier                                                |

Чтобы проверить сборку в том виде, в каком она работает на GitHub Pages (под подпутём `/<repo>/`):

```bash
VITE_BASE_PATH=/carousel/ npm run build && VITE_BASE_PATH=/carousel/ npx vite preview
# http://localhost:4173/carousel/
```

## Функциональность

- **Логин** (`/login`): форма на `@mantine/form`, валидация email и пароля (минимум 3 символа) с ошибками под полями и уведомлением при попытке отправить невалидную форму. При успехе создаётся фиктивный JWT-подобный токен (внутри email и срок жизни 24 часа), он сохраняется в `localStorage['auth_token']`.
- **Гарды роутов:** гость на `/` перенаправляется на `/login`, авторизованный пользователь на `/login` — на `/`. Неизвестные пути ведут на `/`.
- **Восстановление сессии:** при старте токен читается из `localStorage` и проверяется (формат и срок действия); битый или просроченный токен удаляется.
- **Выход:** кнопка в шапке очищает токен и стор, затем перенаправляет на `/login`.
- **Карусель:** стрелки Embla и точки пагинации под каруселью, синхронизированные через Embla API (`select` и `reInit`). Поддерживается навигация клавиатурой и свайпом.
- **Слайды:** добавление через модалку (обязательный `title`, необязательная `annotation`), удаление с подтверждением, переключение `isChecked` чекбоксом со статус-бейджем. Весь массив синхронизируется с `localStorage['slides']` при каждом изменении. При первом запуске подставляются 4 сид-слайда.

## Архитектура: Feature-Sliced Design 2.1

```
src/
├── app/                      # точка входа, провайдеры, роутер, гарды, тема
│   ├── main.tsx
│   ├── providers/AppProviders.tsx
│   ├── router/{router.tsx, guards.tsx}
│   └── styles/theme.ts
├── pages/
│   ├── login/                # LoginPage
│   └── home/                 # HomePage (AppShell: шапка + карусель)
├── widgets/
│   ├── app-header/           # заголовок, email пользователя, LogoutButton
│   └── slides-carousel/      # Carousel + пагинация + модалки add/delete
├── features/
│   ├── auth/
│   │   ├── login/            # LoginForm + useLoginForm
│   │   └── logout/           # LogoutButton + useLogout
│   └── slide/
│       ├── add-slide/        # AddSlideButton, AddSlideModal + useAddSlideForm
│       ├── delete-slide/     # DeleteSlideButton, DeleteSlideModal + useDeleteSlide
│       └── toggle-checked/   # ToggleSlideChecked + useToggleSlideChecked
├── entities/
│   ├── user/                 # модель сессии, стор, восстановление из storage
│   └── slide/                # модель Slide, стор (CRUD + persistence), SlideCard
└── shared/                   # без бизнес-логики, только сегменты
    ├── api/                  # мок loginRequest
    ├── config/               # ROUTES, STORAGE_KEYS, константы
    ├── hooks/                # useCarouselPagination (Embla)
    ├── lib/                  # storage<T>, fake-jwt, guards, notify, validation
    └── ui/                   # CarouselDots
```

Каждый слайс (и каждый сегмент `shared`) отдаёт наружу только публичный API через `index.ts`. Внутри слайса используются относительные импорты, снаружи — алиасы `@app`, `@pages`, `@widgets`, `@features`, `@entities`, `@shared`.

### Контроль направления импортов

Правило `boundaries/dependencies` в [eslint.config.js](./eslint.config.js) работает по принципу «запрещено всё, что не разрешено явно»:

- импорт разрешён только в нижележащие слои: `app → pages → widgets → features → entities → shared`;
- импорт из другого слайса того же слоя (например, `features/slide/add-slide` → `features/auth/logout`) запрещён;
- обращение к внутренностям чужого слайса в обход `index.ts` (например, `@entities/slide/model/seed`) запрещено;
- `shared` не импортирует ничего из верхних слоёв;
- правило `boundaries/no-unknown-files` запрещает файлы вне известных слоёв.

Правила проверены на специально созданных нарушениях всех перечисленных типов: линтер ловит каждое.

## Принятые решения

**Zustand, а не Context.** Состояние авторизации читают гарды, шапка и фичи на разной глубине дерева. Стор с селекторами перерисовывает только подписчиков и не требует провайдера. Один подход для `user` и `slide` делает код единообразным.

**Сессия восстанавливается синхронно при создании стора.** Первый рендер уже знает статус авторизации, поэтому после перезагрузки гарды не показывают на мгновение страницу логина.

**Persistence — одна подписка на стор.** `useSlideStore.subscribe` записывает слайды в `localStorage` при изменении массива, а экшены остаются чистыми переходами состояния. Данные из `localStorage` проверяются type guard-ом, битые данные заменяются сидами. Сохранённый пустой список остаётся пустым: сиды используются, только если данных нет.

**Ручная запись вместо `persist`-middleware.** Задание требует конкретный ключ `auth_token` с токеном. `persist` хранит обёртку `{ state, version }`, поэтому запись сделана через типизированный хелпер `shared/lib/storage.ts`.

**Валидация email.** `isEmail` из Mantine пропускает `a@b`, поэтому используется собственная проверка формата `local@domain.tld`.

**Пагинация через Embla API, а не `withIndicators`.** Точки вынесены под карусель и читают `selectedScrollSnap()` и `scrollSnapList()` через `useSyncExternalStore`. После добавления слайда карусель прокручивается к нему.
