import React, { useState } from 'react';
import Modal from '../components/common/Modal';

const mockWarehouses = [
  { id: 1, name: 'Main WH', location: 'New York, NY', capacity: 50000, active: true },
  { id: 2, name: 'Secondary WH', location: 'Newark, NJ', capacity: 20000, active: true },
  { id: 3, name: 'Store Front', location: 'Manhattan, NY', capacity: 5000, active: true },
];

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState(mockWarehouses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', location: '', capacity: 0 });

  const handleCreate = (e) => {
    e.preventDefault();
    const newWarehouse = { ...formData, id: Date.now(), active: true };
    setWarehouses([...warehouses, newWarehouse]);
    setIsModalOpen(false);
    setFormData({ name: '', location: '', capacity: 0 });
  };

  const toggleActive = (id) => {
    setWarehouses(warehouses.map(w => w.id === id ? { ...w, active: !w.active } : w));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Warehouses & Locations</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
          + Add Warehouse
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {warehouses.map(w => (
          <div key={w.id} className="bg-white rounded-lg shadow border border-gray-200 p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-bold text-gray-800">{w.name}</h2>
              <span className={`px-2 py-1 rounded text-xs font-medium ${w.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {w.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="text-sm text-gray-600 space-y-2 flex-1">
              <p><span className="font-medium">Location:</span> {w.location}</p>
              <p><span className="font-medium">Capacity:</span> {w.capacity.toLocaleString()} units</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => toggleActive(w.id)}
                className={`text-sm font-medium ${w.active ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
              >
                {w.active ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Warehouse">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (Units)</label>
            <input type="number" min="0" value={formData.capacity} onChange={e => setFormData({...formData, capacity: Number(e.target.value)})} className="w-full p-2 border rounded" required />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Add Warehouse</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Warehouses;
