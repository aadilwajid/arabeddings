export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  details: string[];
  image: string;
  rating: number;
  reviews: number;
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type Category = 'All' | 'Sheets' | 'Pillows' | 'Blankets' | 'Duvets' | 'Bath' | 'Decor';
