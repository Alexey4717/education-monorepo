Подключили tailwind.config.ts в корне приложения.

Подключили его в global.scss как

```scss
@use 'tailwindcss';

@config "../../tailwind.config.ts";
```

Задание глобальных переменных для scss можно переопределять через media запросы, чтоб на разных экранах разные значения.

```scss
:root {
  --sidebar-width: 15rem;
}
```

Использование:

```scss
.class {
  width: var(--sidebar-width);
}

```

Использование классов/переменных из tailwind через директиву @apply

```scss
html,
body {
  @apply text-white bg-bg text-base;
}
```

В tailwind.config.ts задали theme.extend.padding.layout для глобального пэддинга

Использовали в компонентах как класс p-layout

У tailwindcss есть готовые классы, которые можно навешивать на элементы без импортов.
Типа w-60 (ширина 60px).
Например, на элемент можно повесить className="flex items-center gap-5"
и это будет flex-container с гэпами внутри и выравниванием align-items: center.

Сделали глобальное определение цветов через js константу, привязали её в глобальный конфиг и можно использовать в коде
для передачи цветов (в иконки, стили и т.п.).

----

Добавили stylelint-config-tailwindcss (правила для stylelint, добавили в .stylelintrc.cjs) и @tailwindcss/postcss для
интеграции с препроцессорами.

----

Скачали пакет clsx для функции нескольких классов, передаваемых в элементы.
Можно объединять классы, так же он понимает условные классы и т.п.

```tsx
<main
    className={cn(
        'flex min-h-screen',
        isShowedSidebar ? styles.showed - sidebar : styles.hided - sidebar,
        'different number of classes will merge'
    )}
/>
```

Если использовать чисто tailwind без посторонних стилей, то лучше использовать tailwind-merge.
При мердже, если есть дублирующиеся классы, он их сам удалить, перезапишет и т.д. (более оптимизированно).

