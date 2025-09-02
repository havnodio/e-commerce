export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

export interface Order {
  id: string;
  created_at: string;
  status: string;
  total: number;
}