import React, { useState } from 'react';
import ProductTable from '../components/products/ProductTable';
import FilterBar from '../components/dashboard/FilterBar';
import Modal from '../components/common/Modal';
import ProductForm from '../components/products/ProductForm';
import { Plus } from 'lucide-react';

const mockProducts = [
  { id: 'PRD-001', name: 'Steel Rods', sku: 'SR001', category: 'Raw Materials', unit: 'KG', stock: 500, locations: 2, reorderLevel: 50, status: 'In Stock' },
  { id: 'PRD-002', name: 'Aluminum Sheets', sku: 'AS005', category: 'Raw Materials', unit: 'PCS', stock: 0, locations: 0, reorderLevel: 20, status: 'Out of Stock' },
  { id: 'PRD-003', name: 'Office Chairs', sku: 'CH001', category: 'Furniture', unit: 'PCS', stock: 15, locations: 1, reorderLevel: 20, status: 'Low Stock' },
];

const Products = () => {
  const [products, setProducts] = useState(mockProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateProduct = (data) => {
    const newProduct = {
      id: `PRD-00${products.length + 1}`,
      name: data.name,
      sku: data.sku,
      category: data.category,
      unit: data.unit,
      stock: data.initialStock,
      locations: 1,
      reorderLevel: data.reorderLevel,
      status: data.initialStock > 0 ? 'In Stock' : 'Out of Stock',
    };
    setProducts([...products, newProduct]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Products</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your inventory items and SKUs.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <FilterBar />
        </div>
        <ProductTable products={products} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Product">
        <ProductForm onSubmit={handleCreateProduct} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Products;
