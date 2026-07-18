export const PLURALS = {
  minutes: ['минуту', 'минуты', 'минут'],
  hours: ['час', 'часа', 'часов'],
  contacts: ['контакт', 'контакта', 'контактов'],
} as const;

type PluralForms = readonly [string, string, string];
type PluralKey = keyof typeof PLURALS;

export const pluralize = (value: number, forms?: PluralKey | PluralForms): string => {
  const resolvedForms: PluralForms = typeof forms === 'string' ? PLURALS[forms] : (forms ?? PLURALS.contacts);

  const mod10 = value % 10;
  const mod100 = value % 100;

  if (mod100 >= 11 && mod100 <= 14) return resolvedForms[2];
  if (mod10 === 1) return resolvedForms[0];
  if (mod10 >= 2 && mod10 <= 4) return resolvedForms[1];
  return resolvedForms[2];
};
