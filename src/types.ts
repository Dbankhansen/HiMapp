export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  categories: string[];
  image: string;
}

export interface SalesData {
  name: string;
  sales: number;
}