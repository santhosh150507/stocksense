import React, { useState } from 'react';
import ProductTable from '../components/products/ProductTable';
import ProductForm from '../components/products/ProductForm';
import Modal from '../components/common/Modal';

const mockProducts = [
  { id: 1, sku: 'SKU-1001', name: 'Wireless Mouse', category: 'Electronics', price: '29.99', stock: 150 },
  { id: 2, sku: 'SKU-1002', name: 'Mechanical Keyboard', category: 'Electronics', price: '89.99', stock: 45 },
  { id: 3, sku: 'SKU-2001', name: 'Office Chair', category: 'Furniture', price: '199.99', stock: 12 },
];

const Products = () => {
  const [products, setProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const filteredProducts = products.filter(p => 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (id) => {
    if(window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSubmit = (formData) => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...formData, id: p.id } : p));
    } else {
      setProducts([...products, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <button onClick={handleAddProduct} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow">
          + Add Product
        </button>
      </div>

      <div className="mb-6 flex gap-4">
        <input 
          type="text" 
          placeholder="Search by SKU or Name..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
        />
      </div>

      <ProductTable 
        products={filteredProducts} 
        onEdit={handleEditProduct} 
        onDelete={handleDeleteProduct} 
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
      >
        <ProductForm 
          initialData={editingProduct} 
          onSubmit={handleSubmit} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
};

export default Products;
