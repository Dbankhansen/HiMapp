import { Product } from '../types';

// Simulating a database with localStorage
const STORAGE_KEY = 'himapp_products';

const getStoredProducts = (): Product[] => {
  const storedProducts = localStorage.getItem(STORAGE_KEY);
  return storedProducts ? JSON.parse(storedProducts) : [];
};

const setStoredProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const getProducts = async (): Promise<Product[]> => {
  const products = getStoredProducts();
  return products.map(product => ({
    ...product,
    price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
    stock: typeof product.stock === 'string' ? parseInt(product.stock, 10) : product.stock
  }));
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  const products = await getProducts();
  return products.find(product => product.id === id);
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const products = getStoredProducts();
  const newProduct = { 
    ...product, 
    id: Date.now().toString(),
    price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
    stock: typeof product.stock === 'string' ? parseInt(product.stock, 10) : product.stock
  };
  products.push(newProduct);
  setStoredProducts(products);
  return newProduct;
};

export const updateProduct = async (id: string, updatedProduct: Partial<Product>): Promise<Product> => {
  const products = getStoredProducts();
  const index = products.findIndex(product => product.id === id);
  if (index !== -1) {
    products[index] = { 
      ...products[index], 
      ...updatedProduct,
      price: typeof updatedProduct.price === 'string' ? parseFloat(updatedProduct.price) : updatedProduct.price,
      stock: typeof updatedProduct.stock === 'string' ? parseInt(updatedProduct.stock, 10) : updatedProduct.stock
    };
    setStoredProducts(products);
    return products[index];
  }
  throw new Error('Product not found');
};

export const deleteProduct = async (id: string): Promise<void> => {
  const products = getStoredProducts();
  const updatedProducts = products.filter(product => product.id !== id);
  setStoredProducts(updatedProducts);
};