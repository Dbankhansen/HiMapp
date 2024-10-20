import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { createProduct, updateProduct, getProductById } from '../services/productService';

const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product>({
    id: '',
    name: '',
    sku: '',
    price: 0,
    stock: 0,
    categories: [],
    image: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (id) {
      loadProduct(id);
    }
  }, [id]);

  const loadProduct = async (productId: string) => {
    const fetchedProduct = await getProductById(productId);
    setProduct(fetchedProduct);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const categories = e.target.value.split(',').map(cat => cat.trim());
    setProduct(prev => ({ ...prev, categories }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageDataUrl = product.image;

    if (imageFile) {
      imageDataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(imageFile);
      });
    }

    const updatedProduct = { ...product, image: imageDataUrl };

    if (id) {
      await updateProduct(id, updatedProduct);
    } else {
      await createProduct(updatedProduct);
    }
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Product' : 'Add New Product'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">Product Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="sku" className="block mb-1">SKU</label>
          <input
            type="text"
            id="sku"
            name="sku"
            value={product.sku}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="price" className="block mb-1">Price (DKK)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="stock" className="block mb-1">Stock</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            required
            min="0"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="categories" className="block mb-1">Categories (comma-separated)</label>
          <input
            type="text"
            id="categories"
            name="categories"
            value={product.categories.join(', ')}
            onChange={handleCategoryChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="image" className="block mb-1">Product Image</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
          />
          {(product.image || imageFile) && (
            <img
              src={imageFile ? URL.createObjectURL(imageFile) : product.image}
              alt="Product preview"
              className="mt-2 h-32 object-contain"
            />
          )}
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          {id ? 'Update Product' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;