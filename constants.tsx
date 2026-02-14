
import { Category, Store, Deal } from './types';

export const MOCK_DEALS: Deal[] = [
  {
    id: '1',
    title: 'Apple iPhone 15 (128GB) - Blue',
    imageUrl: 'https://picsum.photos/seed/iphone15/400/400',
    originalPrice: 79900,
    dealPrice: 65999,
    discountPercentage: 17,
    category: Category.ELECTRONICS,
    store: Store.AMAZON,
    affiliateUrl: 'https://amazon.in',
    isLoot: true,
    expiryDate: new Date(Date.now() + 86400000).toISOString(),
    // Added createdAt to fix missing property type error
    createdAt: Date.now()
  },
  {
    id: '2',
    title: 'Samsung Galaxy Watch 6 Bluetooth 44mm',
    imageUrl: 'https://picsum.photos/seed/watch6/400/400',
    originalPrice: 33999,
    dealPrice: 19999,
    discountPercentage: 41,
    category: Category.ELECTRONICS,
    store: Store.FLIPKART,
    affiliateUrl: 'https://flipkart.com',
    isLoot: false,
    expiryDate: new Date(Date.now() + 172800000).toISOString(),
    // Added createdAt to fix missing property type error
    createdAt: Date.now()
  },
  {
    id: '3',
    title: 'Nike Air Max 270 React - Sneakers',
    imageUrl: 'https://picsum.photos/seed/nikeair/400/400',
    originalPrice: 12995,
    dealPrice: 6495,
    discountPercentage: 50,
    category: Category.FASHION,
    store: Store.MYNTRA,
    affiliateUrl: 'https://myntra.com',
    isLoot: true,
    expiryDate: new Date(Date.now() + 3600000).toISOString(),
    // Added createdAt to fix missing property type error
    createdAt: Date.now()
  },
  {
    id: '4',
    title: 'Sony WH-1000XM5 Noise Cancelling Headphones',
    imageUrl: 'https://picsum.photos/seed/sonyh/400/400',
    originalPrice: 34990,
    dealPrice: 26990,
    discountPercentage: 23,
    category: Category.ELECTRONICS,
    store: Store.AMAZON,
    affiliateUrl: 'https://amazon.in',
    isLoot: false,
    expiryDate: new Date(Date.now() + 259200000).toISOString(),
    // Added createdAt to fix missing property type error
    createdAt: Date.now()
  },
  {
    id: '5',
    title: 'Cotton Printed King Size Bedspread',
    imageUrl: 'https://picsum.photos/seed/bed/400/400',
    originalPrice: 2499,
    dealPrice: 799,
    discountPercentage: 68,
    category: Category.HOME,
    store: Store.AJIO,
    affiliateUrl: 'https://ajio.com',
    isLoot: true,
    expiryDate: new Date(Date.now() + 43200000).toISOString(),
    // Added createdAt to fix missing property type error
    createdAt: Date.now()
  },
  {
    id: '6',
    title: 'Levi\'s Men\'s Regular Fit Jeans',
    imageUrl: 'https://picsum.photos/seed/jeans/400/400',
    originalPrice: 3999,
    dealPrice: 1599,
    discountPercentage: 60,
    category: Category.FASHION,
    store: Store.AMAZON,
    affiliateUrl: 'https://amazon.in',
    isLoot: false,
    expiryDate: new Date(Date.now() + 900000).toISOString(),
    // Added createdAt to fix missing property type error
    createdAt: Date.now()
  },
  {
    id: '7',
    title: 'Organic Almonds (Value Pack) - 1kg',
    imageUrl: 'https://picsum.photos/seed/almonds/400/400',
    originalPrice: 1200,
    dealPrice: 850,
    discountPercentage: 29,
    category: Category.GROCERIES,
    store: Store.AMAZON,
    affiliateUrl: 'https://amazon.in',
    isLoot: false,
    expiryDate: new Date(Date.now() + 604800000).toISOString(),
    // Added createdAt to fix missing property type error
    createdAt: Date.now()
  },
  {
    id: '8',
    title: 'MacBook Air M2 Chip - Space Grey',
    imageUrl: 'https://picsum.photos/seed/macbook/400/400',
    originalPrice: 114900,
    dealPrice: 89900,
    discountPercentage: 22,
    category: Category.ELECTRONICS,
    store: Store.RELIANCE_DIGITAL,
    affiliateUrl: 'https://reliancedigital.in',
    isLoot: false,
    expiryDate: new Date(Date.now() + 500000000).toISOString(),
    // Added createdAt to fix missing property type error
    createdAt: Date.now()
  }
];
