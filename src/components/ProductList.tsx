import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus, Filter, ArrowUpDown } from 'lucide-react';
import { Product } from '../types';
import { getProducts, deleteProduct } from '../services/productService';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<keyof Product>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const fetchedProducts = await getProducts();
    setProducts(fetchedProducts);
    const allCategories = Array.from(new Set(fetchedProducts.flatMap(p => p.categories)));
    setCategories(['All', ...allCategories]);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
      loadProducts();
    }
  };

  const filteredProducts = products.filter(product =>
    (selectedCategory === '' || selectedCategory === 'All' || product.categories.includes(selectedCategory)) &&
    (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: keyof Product) => {
    setSortBy(key);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Product Inventory</h1>
        <Link to="/add-product" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          <Plus className="inline mr-1" size={18} /> Add Product
        </Link>
      </div>
      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          placeholder="Search products..."
          className="flex-grow p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-2 border rounded"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <table className="w-full bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Image</th>
            <th className="py-3 px-6 text-left cursor-pointer" onClick={() => handleSort('name')}>
              Name {sortBy === 'name' && <ArrowUpDown className="inline" size={14} />}
            </th>
            <th className="py-3 px-6 text-left cursor-pointer" onClick={() => handleSort('sku')}>
              SKU {sortBy === 'sku' && <ArrowUpDown className="inline" size={14} />}
            </th>
            <th className="py-3 px-6 text-left cursor-pointer" onClick={() => handleSort('price')}>
              Price (DKK) {sortBy === 'price' && <ArrowUpDown className="inline" size={14} />}
            </th>
            <th className="py-3 px-6 text-left cursor-pointer" onClick={() => handleSort('stock')}>
              Stock {sortBy === 'stock' && <ArrowUpDown className="inline" size={14} />}
            </th>
            <th className="py-3 px-6 text-left">Categories</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {sortedProducts.map(product => (
            <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left">
                {product.image && (
                  <img src={product.image} alt={product.name} className="h-10 w-10 object-cover rounded" />
                )}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">{product.name}</td>
              <td className="py-3 px-6 text-left">{product.sku}</td>
              <td className="py-3 px-6 text-left">{typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}</td>
              <td className="py-3 px-6 text-left">{product.stock}</td>
              <td className="py-3 px-6 text-left">{product.categories.join(', ')}</td>
              <td className="py-3 px-6 text-center">
                <div className="flex item-center justify-center">
                  <Link to={`/edit-product/${product.id}`} className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                    <Edit size={18} />
                  </Link>
                  <button onClick={() => handleDelete(product.id)} className="w-4 mr-2 transform hover:text-red-500 hover:scale-110">
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;