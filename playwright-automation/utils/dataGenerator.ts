import { faker } from '@faker-js/faker';

export function randomEmployee() {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  };
}

export function randomUsername(prefix = 'user'): string {
  return `${prefix}_${faker.string.alphanumeric(8)}`;
}

/** Returns a date string N days from today, formatted as YYYY-MM-DD (OrangeHRM default). */
export function dateFromToday(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
