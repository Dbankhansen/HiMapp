import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { getProducts, updateProduct } from '../services/productService';

const SalesProcess: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const fetchedProducts = await getProducts();
    setProducts(fetchedProducts);
  };

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart(cart.map(item =>
      item.product.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const processSale = async () => {
    if (window.confirm('Are you sure you want to process this sale?')) {
      for (const item of cart) {
        const updatedProduct = {
          ...item.product,
          stock: item.product.stock - item.quantity
        };
        await updateProduct(item.product.id, updatedProduct);
      }
      setCart([]);
      loadProducts();
      alert('Sale processed successfully!');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">
      <div className="w-2/3 pr-4">
        <h2 className="text-xl font-bold mb-4">Products</h2>
        <input
          type="text"
          placeholder="Search products..."
          className="w-full p-2 border rounded mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="grid grid-cols-3 gap-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="border p-4 rounded">
              {product.image && (
                <img src={product.image} alt={product.name} className="h-32 w-full object-cover rounded mb-2" />
              )}
              <h3 className="font-bold">{product.name}</h3>
              <p>SKU: {product.sku}</p>
              <p>Price: {product.price.toFixed(2)} DKK</p>
              <p>Stock: {product.stock}</p>
              <button
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
                className="bg-blue-500 text-white px-2 py-1 rounded mt-2 disabled:bg-gray-400"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="w-1/3 pl-4">
        <h2 className="text-xl font-bold mb-4">Cart</h2>
        {cart.map(item => (
          <div key={item.product.id} className="flex justify-between items-center mb-2">
            <span>{item.product.name}</span>
            <div>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))}
                min="1"
                max={item.product.stock}
                className="w-16 p-1 border rounded mr-2"
              />
              <button
                onClick={() => removeFromCart(item.product.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <div className="mt-4">
          <p className="font-bold">Total: {calculateTotal().toFixed(2)} DKK</p>
          <p>({(calculateTotal() / 7.45).toFixed(2)} EUR)</p>
          <button
            onClick={processSale}
            disabled={cart.length === 0}
            className="bg-green-500 text-white px-4 py-2 rounded mt-2 w-full disabled:bg-gray-400"
          >
            Process Sale
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesProcess;