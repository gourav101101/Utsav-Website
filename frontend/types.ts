
export enum Category {
  DECOR = 'Decor & Event',
  GIFTS = 'Gifts',
  FOOD = 'Food & Sweets',
}

export interface RecommendedAddon {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

export interface ServiceItem {
  id: string;
  category: Category;
  title: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  images: string[];
  inclusions: string[];
  recommendedAddons?: RecommendedAddon[];
}
