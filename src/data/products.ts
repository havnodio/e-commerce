import type { Product } from '@/types';

export const products: Product[] = [
  {
    id: 1,
    name: 'Taralli Classici',
    description: 'Classic taralli with extra virgin olive oil.',
    price: 3.50,
    imageUrl: 'https://placehold.co/600x400/F7F3E3/333?text=Taralli+Classici',
    category: 'Classic',
  },
  {
    id: 2,
    name: 'Taralli al Finocchio',
    description: 'Crispy taralli with fennel seeds for a unique flavor.',
    price: 3.75,
    imageUrl: 'https://placehold.co/600x400/EAF2E3/333?text=Taralli+al+Finocchio',
    category: 'Flavored',
  },
  {
    id: 3,
    name: 'Taralli al Peperoncino',
    description: 'Spicy taralli with a hint of chili pepper.',
    price: 3.75,
    imageUrl: 'https://placehold.co/600x400/FCEBEA/333?text=Taralli+al+Peperoncino',
    category: 'Spicy',
  },
  {
    id: 4,
    name: 'Taralli Integrali',
    description: 'Wholesome whole wheat taralli for a healthier snack.',
    price: 4.00,
    imageUrl: 'https://placehold.co/600x400/E8DDCB/333?text=Taralli+Integrali',
    category: 'Healthy',
  },
];