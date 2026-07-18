export const MAX_PROFILE = {
  avatar_url: '/images/profile/avatar.png',
  first_name: 'Алексей',
  last_name: 'Смирнов',
  is_online: true,
  nickname: '@alex_alex',
  phoneNumber: '+7 000 000 00 00',
  birthDay: '20 августа 1998',
  about: 'Художник из Санкт-Петербурга, пишу картины на заказ',
  is_blocked: false,
  is_in_contact: false,
  has_uploads: true,
};

export const MIN_PROFILE = {
  avatar_url: undefined,
  first_name: 'Алексей',
  last_name: 'Смирнов',
  is_online: true,
  nickname: '@alex_alex',
  phoneNumber: undefined,
  birthDay: undefined,
  about: undefined,
  is_blocked: false,
  is_in_contact: true,
  has_uploads: false,
};

export const PHOTOS = [
  { id: 1, file: '1.png', url: '/images/profile/media/1.png', size: '1.1 МБ', type: 'PNG', created: '12.02.2025' },
  { id: 2, file: '2.png', url: '/images/profile/media/2.png', size: '1.1 МБ', type: 'PNG', created: '12.02.2025' },
  { id: 3, file: '3.png', url: '/images/profile/media/3.png', size: '1.1 МБ', type: 'PNG', created: '12.02.2025' },
  { id: 4, file: '4.png', url: '/images/profile/media/4.png', size: '1.1 МБ', type: 'PNG', created: '12.02.2025' },
  { id: 5, file: '5.png', url: '/images/profile/media/5.png', size: '1.1 МБ', type: 'PNG', created: '12.02.2025' },
  { id: 6, file: '6.png', url: '/images/profile/media/6.png', size: '1.1 МБ', type: 'PNG', created: '12.02.2025' },
  { id: 7, file: '7.png', url: '/images/profile/media/7.png', size: '1.1 МБ', type: 'PNG', created: '12.02.2025' },
  { id: 8, file: '8.png', url: '/images/profile/media/8.png', size: '1.1 МБ', type: 'PNG', created: '12.02.2025' },
  { id: 9, file: '9.png', url: '/images/profile/media/9.png', size: '1.1 МБ', type: 'PNG', created: '12.02.2025' },
  { id: 10, file: '10.png', url: '/images/profile/media/10.png', size: '1.1 МБ', type: 'PNG', created: '12.02.2025' },
  { id: 11, file: '11.png', url: '/images/profile/media/11.png', size: '1.1 МБ', type: 'PNG', created: '12.02.2025' },
];

export const FILES = [
  {
    id: 1,
    file: 'Дизайн простых вещей.pdf',
    url: '/images/profile/files/Дизайн простых вещей.pdf',
    size: '5.2 МБ',
    type: 'PDF',
    created: '12.02.2025',
  },
  {
    id: 2,
    file: 'Skolkovo_Отчёт_2023_screen.pdf',
    url: '/images/profile/files/Skolkovo_Отчёт_2023_screen.pdf',
    size: '15.8 МБ',
    type: 'PDF',
    created: '10.02.2025',
  },
  {
    id: 3,
    file: 'Современные методы...стирования аудитории.pdf',
    url: '/images/profile/files/Современные методы тестирования аудиофайлов.pdf',
    size: '902.3 Кб',
    type: 'PDF',
    created: '01.12.2024',
  },
  {
    id: 4,
    file: 'Современный дизайн интерьеров.pdf',
    url: '/images/profile/files/Современный дизайн интерьеров.pdf',
    size: '345 Кб',
    type: 'PDF',
    created: '25.05.2024',
  },
];

export const VOICES = [
  {
    id: 1,
    file: 'Алексей Смирнов',
    url: '/images/profile/voices/1.mp3',
    size: '0:10',
    type: 'MP3',
    created: '12.02.2025',
  },
  {
    id: 2,
    file: 'Алексей Смирнов',
    url: '/images/profile/voices/2.mp3',
    size: '0:12',
    type: 'MP3',
    created: '08.04.2024',
  },
];

export const LINKS = [
  { messageId: 1, url: 'http://yandex.ru', title: 'yandex.ru', fromUser: 'Антон Ивонецкий', created: '12.02.2025' },
  { messageId: 2, url: 'http://vk.ru', title: 'vk.ru', fromUser: 'Влад Ляшев', created: '04.11.2024' },
];
