export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images?: string[];
  stock: number;
  weight: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  isAvailable: boolean;
  tags?: string[];
  created_at: string;
  updated_at: string;
}
