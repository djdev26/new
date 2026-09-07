import { ShowroomItem, ShowroomId, ShowroomProduct } from '../types/salespilot';
import { LAPTOPS_SHOWROOM } from './showrooms/laptops';
import { APPLIANCES_SHOWROOM } from './showrooms/appliances';
import { CARS_SHOWROOM } from './showrooms/cars';
import { PHONES_SHOWROOM } from './showrooms/phones';

export const SHOWROOM_KEYS: ShowroomId[] = ['laptops', 'appliances', 'cars', 'phones'];

export const SHOWROOMS_DATA: Record<ShowroomId, ShowroomItem> = {
  laptops: LAPTOPS_SHOWROOM,
  appliances: APPLIANCES_SHOWROOM,
  cars: CARS_SHOWROOM,
  phones: PHONES_SHOWROOM,
};

export function getAllProducts(): ShowroomProduct[] {
  const list: ShowroomProduct[] = [];
  SHOWROOM_KEYS.forEach((key) => {
    if (SHOWROOMS_DATA[key] && SHOWROOMS_DATA[key].products) {
      list.push(...SHOWROOMS_DATA[key].products);
    }
  });
  return list;
}

export function getProductById(id: string): ShowroomProduct | undefined {
  return getAllProducts().find((p) => p.id === id);
}

export function searchProducts(keyword: string): ShowroomProduct[] {
  const q = keyword.toLowerCase().trim();
  if (!q) return [];
  return getAllProducts().filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );
}
