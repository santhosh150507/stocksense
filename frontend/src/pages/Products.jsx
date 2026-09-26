import React, { useState } from 'react';
import ProductTable from '../components/products/ProductTable';
import FilterBar from '../components/dashboard/FilterBar';
import Modal from '../components/common/Modal';
import ProductForm from '../components/products/ProductForm';
import { Plus } from 'lucide-react';
import { productService } from '../services/productService';
import toast from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Compute filtered products based on search query and status dropdown
  const filteredProducts = React.useMemo(() => {
    return products.filter((product) => {
      // 1. Match search query against name, sku, category
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || (
        (product.name && product.name.toLowerCase().includes(q)) ||
        (product.sku && product.sku.toLowerCase().includes(q)) ||
        (product.category_name && product.category_name.toLowerCase().includes(q))
      );

      // 2. Match status filter
      let matchesStatus = true;
      if (statusFilter && statusFilter !== 'All Statuses') {
        const stock = product.current_stock || 0;
        const reorderPoint = product.reorder_point || 0;
        
        let status = 'In Stock';
        if (stock <= 0) status = 'Out of Stock';
        else if (stock <= reorderPoint) status = 'Low Stock';

        matchesStatus = (status === statusFilter);
      }

      return matchesSearch && matchesStatus;
    });
  }, [products, searchQuery, statusFilter]);

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (data) => {
    try {
      await productService.create({
        sku: data.sku,
        name: data.name,
        category_id: data.category_id,
        reorder_point: data.reorderLevel,
      });
      toast.success('Product created successfully');
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create product');
    }
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
          <FilterBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            statusOptions={["In Stock", "Low Stock", "Out of Stock"]}
          />
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading products...</div>
        ) : (
          <ProductTable products={filteredProducts} />
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Product">
        <ProductForm onSubmit={handleCreateProduct} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Products;
