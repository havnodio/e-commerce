import { Product } from '@/types';

export const products: Product[] = [
  {
    id: 1,
    name: 'Pack Trio de Taralli Gusto Club',
    description: 'A special pack featuring three of our most popular taralli flavors.',
    price: 7.90,
    imageUrl: 'https://i.imgur.com/TtsqWAO.png',
    category: 'Special Pack',
  },
  {
    id: 2,
    name: 'TARALLI PEPERONCINO 140GR',
    description: 'Spicy Italian taralli with a fiery kick of chili pepper, perfect for those who love heat.',
    price: 2.50,
    imageUrl: 'https://i.imgur.com/d0aCWFL.png',
    category: 'Spicy',
  },
  {
    id: 3,
    name: 'TARALLI HUILE DOLIVE & SEL DE MER - 140G',
    description: 'Classic taralli made with premium olive oil and sea salt for an authentic Mediterranean taste.',
    price: 2.95,
    imageUrl: 'https://i.imgur.com/f0pP8nO.png',
    category: 'Classic',
  },
  {
    id: 4,
    name: 'Taralli Integrali',
    description: 'Wholesome whole wheat taralli for a healthier snack option, rich in fiber and nutrients.',
    price: 2.95,
    imageUrl: 'https://i.imgur.com/4wtK2ZE.png',
    category: 'Healthy',
  }
];