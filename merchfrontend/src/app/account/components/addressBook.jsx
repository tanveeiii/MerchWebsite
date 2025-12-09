"use client";
import React, { useState } from 'react';
import { Plus, MapPin } from 'lucide-react';

const AddressBook = ({ addresses, userEmail, onAddAddress }) => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        address_type: 'Home',
        street_address: '',
        apartment_suite: '',
        city: '',
        state_province: '',
        postal_code: '',
        is_default: true
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddAddress({ ...formData, email: userEmail }); // Email required by DTO
        setShowForm(false);
        setFormData({ address_type: 'Home', street_address: '', apartment_suite: '', city: '', state_province: '', postal_code: '', is_default: true });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg text-gray-800">Saved Addresses</h2>
                <button 
                    onClick={() => setShowForm(!showForm)} 
                    className="flex items-center gap-2 text-sm bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                >
                    <Plus size={16} /> Add New Address
                </button>
            </div>

            {/* Add Address Form */}
            {showForm && (
                <div className="bg-gray-50 border p-4 rounded-md mb-6 animate-in fade-in slide-in-from-top-4">
                    <h3 className="font-semibold mb-3">New Address Details</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="address_type" placeholder="Type (Home/Work)" value={formData.address_type} onChange={handleChange} className="border p-2 rounded" required />
                        <input name="street_address" placeholder="Street Address" value={formData.street_address} onChange={handleChange} className="border p-2 rounded" required />
                        <input name="apartment_suite" placeholder="Apartment / Suite" value={formData.apartment_suite} onChange={handleChange} className="border p-2 rounded" />
                        <input name="city" placeholder="City" value={formData.city} onChange={handleChange} className="border p-2 rounded" required />
                        <input name="state_province" placeholder="State" value={formData.state_province} onChange={handleChange} className="border p-2 rounded" required />
                        <input name="postal_code" placeholder="Postal Code" value={formData.postal_code} onChange={handleChange} className="border p-2 rounded" required />
                        <div className="md:col-span-2">
                            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full md:w-auto">Save Address</button>
                        </div>
                    </form>
                </div>
            )}

            {/* List Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.length > 0 ? addresses.map((addr) => (
                    <div key={addr.address_id} className="border rounded-md p-4 bg-white shadow-sm relative">
                        <div className="absolute top-4 right-4 bg-gray-100 text-xs px-2 py-1 rounded text-gray-600 uppercase">{addr.address_type}</div>
                        <div className="flex items-start gap-3">
                            <MapPin className="text-gray-400 mt-1" size={20} />
                            <div>
                                <p className="font-medium text-gray-900">{addr.street_address}</p>
                                {addr.apartment_suite && <p className="text-gray-600 text-sm">{addr.apartment_suite}</p>}
                                <p className="text-gray-600 text-sm">{addr.city}, {addr.state_province} {addr.postal_code}</p>
                                {addr.is_default && <span className="text-xs text-green-600 font-semibold mt-2 inline-block">Default Address</span>}
                            </div>
                        </div>
                    </div>
                )) : (
                    <p className="text-gray-500 col-span-2">No addresses found.</p>
                )}
            </div>
        </div>
    );
};

export default AddressBook;