import React, { useState, useEffect } from 'react';
import { locationService } from '../../services/locationService';

const LocationPicker = ({ value, onChange, className = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" }) => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    locationService.getAll().then(setLocations).catch(console.error);
  }, []);

  return (
    <select 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      className={className}
      required
    >
      <option value="" disabled>Select a location</option>
      {locations.map(loc => (
        <option key={loc.id} value={loc.id}>{loc.warehouse_name} - {loc.code}</option>
      ))}
    </select>
  );
};

export default LocationPicker;
