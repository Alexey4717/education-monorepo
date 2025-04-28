import {dirname} from "path";
import {fileURLToPath} from "url";
import {FlatCompat} from "@eslint/eslintrc";
import baseConfig from "../../eslint.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...baseConfig,
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        plugins: ["tailwindcss"], // Подключаем плагин tailwindcss
        extends: ["plugin:tailwindcss/recommended"], // Используем рекомендованные правила
        rules: {
            "tailwindcss/classnames-order": "warn", // Проверка порядка классов
            "tailwindcss/no-custom-classname": "warn" // Предупреждения о кастомных классах
        },
    },
];

export default eslintConfig;
