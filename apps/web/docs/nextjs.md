# Общие данные о Next.js

Это надстройка над React. Но react - это чистый веб-фреймворк.

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