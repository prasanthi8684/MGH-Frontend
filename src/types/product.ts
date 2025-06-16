export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  inStock: boolean;
  sku: string;
}

export interface SelectedProduct extends Product {
  quantity: number;
  customPrice?: number;
}

export interface Proposal {
  id: string;
  title: string;
  clientName: string;
  clientEmail: string;
  products: SelectedProduct[];
  totalAmount: number;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  createdAt: string;
  validUntil: string;
}