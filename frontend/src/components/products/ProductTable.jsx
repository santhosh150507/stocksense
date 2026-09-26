import React from 'react';
import { MoreVertical, Edit2, Trash2, Eye } from 'lucide-react';

const ProductTable = ({ products }) => {
  const getStatusBadge = (stock, reorderPoint) => {
    if (stock <= 0) return <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-100">Out of Stock</span>;
    if (stock <= reorderPoint) return <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">Low Stock</span>;
    return <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">In Stock</span>;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50/50">
          <tr>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
            <th className="px-6 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Locations</th>
            <th className="px-6 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {products.length === 0 ? (
            <tr><td colSpan="7" className="px-6 py-8 text-center text-sm text-gray-500 font-medium">No products yet.</td></tr>
          ) : (
            products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50/80 transition-colors group">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors cursor-pointer">{product.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.category_name || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                {product.current_stock}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">-</td>
              <td className="px-6 py-4 whitespace-nowrap text-center">{getStatusBadge(product.current_stock, product.reorder_point)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <button className="text-gray-400 hover:text-indigo-600 transition-colors p-1"><Eye className="w-4 h-4" /></button>
                  <button className="text-gray-400 hover:text-gray-700 transition-colors p-1"><Edit2 className="w-4 h-4" /></button>
                  <button className="text-gray-400 hover:text-red-600 transition-colors p-1"><Trash2 className="w-4 h-4" /></button>
                </div>
              </td>
            </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
