import { ShowroomItem, ShowroomId, ShowroomProduct } from '../types/salespilot';
import { SPORTS_SHOWROOM } from './showrooms/sports';
import { APPLIANCES_SHOWROOM } from './showrooms/appliances';

export const SHOWROOM_KEYS: ShowroomId[] = ['sports', 'appliances'];

export const SHOWROOMS_DATA: Record<ShowroomId, ShowroomItem> = {
  sports: SPORTS_SHOWROOM,
  appliances: APPLIANCES_SHOWROOM,
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
