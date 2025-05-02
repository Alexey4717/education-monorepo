// eslint-disable-next-line @typescript-eslint/no-require-imports
const baseConfig = require('../../prettier.config');

module.exports = {
    ...baseConfig,
    importOrder: [
        "<THIRD_PARTY_MODULES>",
        "^@/components/(.*)$",
        "^@/ui/(.*)$",
        "^@/providers/(.*)$",
        "^@/constants/(.*)$",
        "^@/config/(.*)$",
        "^@/store/(.*)$",
        "^@/hooks/(.*)$",
        "^@/utils/(.*)$",
        "^@/api/(.*)$",
        "^@/server/(.*)$",
        "^(?!.*\\.scss$)(../.*)$",
        "^(?!.*\\.scss$)(./.*)$",
        ".*\\.scss$"
    ],
    "importOrderSeparation": false,
    "importOrderSortSpecifiers": true,
    plugins: ["@trivago/prettier-plugin-sort-imports"]
};