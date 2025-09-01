export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

export const featuredProducts: Product[] = [
  {
    id: 1,
    name: "Taralli Classici",
    price: 4.50,
    imageUrl: "/placeholder.svg",
    category: "Savory",
  },
  {
    id: 2,
    name: "Taralli al Finocchio",
    price: 5.00,
    imageUrl: "/placeholder.svg",
    category: "Savory",
  },
  {
    id: 3,
    name: "Taralli al Peperoncino",
    price: 5.20,
    imageUrl: "/placeholder.svg",
    category: "Savory",
  },
  {
    id: 4,
    name: "Taralli Dolci al Zucchero",
    price: 6.00,
    imageUrl: "/placeholder.svg",
    category: "Sweet",
  },
];