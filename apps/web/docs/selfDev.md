## Перенаправление запросов на сервер

Чтобы избежать CORS-ошибок и упростить запросы, можно настроить rewrites в Next.js, чтобы все запросы к /api/* перенаправлялись на Express-сервер.

Настройка rewrites в Next.js
Добавьте в next.config.js:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3001/api/:path*", // Express-сервер
      },
    ];
  },
};

module.exports = nextConfig;
```

Теперь:

- Запрос fetch('/api/users') в Next.js → перенаправится на http://localhost:3001/api/users.
- В режиме dev Next.js (по умолчанию на 3000), Express должен работать на другом порту (например, 3001).

## Современный вид FSD-структуры в Next.js 15

```text
src/
  app/
    (маршруты Next.js)
  entities/
    user/
      model/
      ui/
      api/
      lib/
    product/
      ...
  features/
    auth/
      model/
      ui/
      api/
    add-to-cart/
      ...
  widgets/
    header/
    sidebar/
    cart-panel/
  views/
  shared/
    ui/
      button/
      input/
      modal/
    lib/
      hooks/
      utils/
      config/
      constants/
    api/
      graphql/
      rest/
    types/
      global.d.ts
  processes/
    checkout/
    authentication/
```

### Кратко про каждую папку:

```text
Раздел	    Описание
app/	    Стандартный маршрутизатор Next.js 15 (providers, routes, layouts, global styles, types, templates, error, loading).
views/      Страницы приложения
entities/	Базовые бизнес-сущности, типа user, product, order. Их маленькие модули.
features/	Завершённые функциональные фичи, например "авторизация", "добавление в корзину".
widgets/	Крупные композиционные блоки из нескольких сущностей/фичей, типа "Хедер", "Сайдбар".
processes/	Большие бизнес-процессы, например "чекаут", "регистрация пользователя".
shared/	    Общие библиотеки, UI-компоненты, утилиты, константы, базовые хуки, общие типы.
```