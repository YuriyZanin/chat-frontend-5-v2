export const SECTION_HEADER_CONFIG = {
  personal: {
    label: 'Контакты пользователей А-чата',
    showDelete: true,
  },
  globals: {
    label: 'Пользователи А-Чата',
    showDelete: false,
  },
} as const;

export type HeaderVariant = keyof typeof SECTION_HEADER_CONFIG;
