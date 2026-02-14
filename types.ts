
export enum Category {
  ALL = 'All',
  ELECTRONICS = 'Electronics',
  FASHION = 'Fashion',
  HOME = 'Home',
  GROCERIES = 'Groceries'
}

export enum Store {
  AMAZON = 'Amazon',
  FLIPKART = 'Flipkart',
  MYNTRA = 'Myntra',
  AJIO = 'Ajio',
  RELIANCE_DIGITAL = 'Reliance Digital'
}

export interface Deal {
  id: string;
  title: string;
  imageUrl: string;
  originalPrice: number;
  dealPrice: number;
  discountPercentage: number;
  category: Category;
  store: Store;
  affiliateUrl: string;
  isLoot: boolean;
  expiryDate: string;
  createdAt: number;
}

export type SortOption = 'relevance' | 'priceLowToHigh' | 'priceHighToLow' | 'discount';
