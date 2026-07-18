import { ChatsIcon, ContactsIcon, ServicesIcon, SettingsIcon } from './icons';

export const NAV_ITEMS = [
  {
    id: 'chats',
    label: 'Чаты',
    href: '/chats',
    icon: ChatsIcon,
  },
  {
    id: 'services',
    label: 'Сервисы',
    href: '/services',
    icon: ServicesIcon,
  },
  {
    id: 'contacts',
    label: 'Контакты',
    href: '/contacts',
    icon: ContactsIcon,
  },
  {
    id: 'settings',
    label: 'Настройки',
    href: '/settings',
    icon: SettingsIcon,
  },
] as const;
