# Зачем нужен shared

## 1. Переиспользование кода

- Типы TypeScript (User, ApiResponse).
- Утилиты (formatDate, logger).
- Константы (routes, config).
- Хуки/компоненты React (если фронты на Next.js и React Native).

## 2. Синхронизация между проектами

Изменения в shared сразу доступны в server и web без дублирования.

## 3. Безопасность типов

Один источник правды для TypeScript-типов.

## Структура папки

```text
packages/
└── shared/
    ├── src/
    │   ├── types/       # Общие типы
    │   ├── utils/       # Утилиты
    │   ├── constants/   # Константы
    │   └── index.ts     # Экспорт всего
    ├── package.json
    └── tsconfig.json
```

Могут быть общие зависимости в package.json, например, dayjs для утилит

В корневой package.json добавлен скрипт "build:shared": "yarn workspace @shared/core build"

##  Важные моменты

### Симплинки (Symlinks)

Yarn/PNPM создают симлинки node_modules/@shared → packages/shared.

### Обновление кода

После изменений в shared:
Перезапустите dev-сервер (next dev / nodemon).
Или запустите сборку (yarn build:shared).

### Circular Dependencies

Не допускайте циклов:
server → shared → server.