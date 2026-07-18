import { Tab } from './info-uploads.props';

export const TABS = [
  {
    id: 'media',
    title: 'Медиа',
  },
  {
    id: 'files',
    title: 'Файлы',
  },
  {
    id: 'voices',
    title: 'Голосовые',
  },
  {
    id: 'links',
    title: 'Ссылки',
  },
] as Tab[];

export const GROUP_TABS = [
  {
    id: 'members',
    title: 'Участники',
  },
  ...TABS,
] as Tab[];

export const CHANNEL_TABS = [
  {
    id: 'subscribers',
    title: 'Подписчики',
  },
  ...TABS,
] as Tab[];
