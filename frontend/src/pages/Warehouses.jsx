import React, { useState, useEffect } from 'react';
import Modal from '../components/common/Modal';
import { Plus, MapPin, Package, Settings, ExternalLink, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { warehouseService } from '../services/warehouseService';

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', location: '', capacity: 0 });

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const data = await warehouseService.getAll();
      setWarehouses(data);
    } catch (err) {
      toast.error('Failed to fetch warehouses');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await warehouseService.create({
        name: formData.name,
        location: formData.location
      });
      setIsModalOpen(false);
      setFormData({ name: '', location: '', capacity: 0 });
      toast.success('Warehouse created successfully');
      fetchWarehouses();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create warehouse');
    }
  };

  const toggleActive = (id) => {
    setWarehouses(warehouses.map(w => w.id === id ? { ...w, active: !w.active } : w));
    const wh = warehouses.find(w => w.id === id);
    toast.success(`${wh.name} ${!wh.active ? 'activated' : 'deactivated'}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Warehouses & Locations</h1>
          <p className="text-sm text-gray-500 mt-1">Manage physical storage locations and capacities.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Warehouse
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {warehouses.map(w => (
          <div key={w.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow group">
            <div className="p-6 border-b border-gray-100 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg ${w.active ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{w.name}</h2>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border mt-1 ${w.active ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                      {w.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-indigo-600 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4 mt-6">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                  {w.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Package className="w-4 h-4 mr-3 text-gray-400" />
                  {w.products} Products Stored
                </div>
                
                <div className="pt-3">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-gray-500 font-medium">Capacity Usage</span>
                    <span className="text-gray-700 font-bold">N/A</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full transition-all duration-500" style={{ width: `0%` }}></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1.5 text-gray-400">
                    <span>-</span>
                    <span>-</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50/50 flex justify-between items-center">
              <button 
                onClick={() => toggleActive(w.id)}
                className={`text-sm font-medium transition-colors ${w.active ? 'text-gray-600 hover:text-red-600' : 'text-emerald-600 hover:text-emerald-700'}`}
              >
                {w.active ? 'Deactivate Location' : 'Activate Location'}
              </button>
              <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
                View Ledger <ExternalLink className="w-3 h-3 ml-1" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Warehouse">
        <form onSubmit={handleCreate} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g. Warehouse B" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location <span className="text-red-500">*</span></label>
            <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g. Chicago, IL" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Capacity (Units) <span className="text-red-500">*</span></label>
            <input type="number" min="0" value={formData.capacity} onChange={e => setFormData({...formData, capacity: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
          </div>
          <div className="flex justify-end gap-3 pt-5 border-t border-gray-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 border border-transparent text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">Add Warehouse</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Warehouses;
