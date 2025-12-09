"use client";
import React, { useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';

const Overview = ({ userData, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        mobile: userData.mobile || '',
        dob: userData.dob ? userData.dob.split('T')[0] : '', // Format for date input
        gender: userData.gender || 'Other',
        email: userData.email // Read-only usually
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        onUpdate(formData);
        setIsEditing(false);
    };

    return (
        <div>
            <div className='flex justify-between items-center mb-4'>
                <div className='text-lg text-gray-800'>Personal Information</div>
                {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className='text-blue-600 flex items-center gap-1 text-sm hover:underline'>
                        <Edit2 size={14} /> Edit
                    </button>
                ) : (
                    <div className='flex gap-2'>
                        <button onClick={() => setIsEditing(false)} className='text-red-500 flex items-center gap-1 text-sm hover:underline'>
                            <X size={14} /> Cancel
                        </button>
                        <button onClick={handleSubmit} className='text-green-600 flex items-center gap-1 text-sm hover:underline'>
                            <Save size={14} /> Save
                        </button>
                    </div>
                )}
            </div>

            <div className='bg-white shadow-sm border rounded-md p-6 text-[Poppins] space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='flex flex-col gap-2'>
                        <div className='text-xs text-gray-500 uppercase tracking-wide'>First Name</div>
                        {isEditing ? (
                            <input name="first_name" value={formData.first_name} onChange={handleChange} className="border p-2 rounded" />
                        ) : (
                            <div className='font-medium text-gray-800'>{userData.first_name}</div>
                        )}
                    </div>
                    <div className='flex flex-col gap-2'>
                        <div className='text-xs text-gray-500 uppercase tracking-wide'>Last Name</div>
                        {isEditing ? (
                            <input name="last_name" value={formData.last_name} onChange={handleChange} className="border p-2 rounded" />
                        ) : (
                            <div className='font-medium text-gray-800'>{userData.last_name}</div>
                        )}
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='flex flex-col gap-2'>
                        <div className='text-xs text-gray-500 uppercase tracking-wide'>Phone Number</div>
                        {isEditing ? (
                            <input name="mobile" value={formData.mobile} onChange={handleChange} className="border p-2 rounded" />
                        ) : (
                            <div className='font-medium text-gray-800'>{userData.mobile}</div>
                        )}
                    </div>
                    <div className='flex flex-col gap-2'>
                        <div className='text-xs text-gray-500 uppercase tracking-wide'>Email Address</div>
                        <div className='font-medium text-gray-800 opacity-70'>{userData.email}</div>
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='flex flex-col gap-2'>
                        <div className='text-xs text-gray-500 uppercase tracking-wide'>Date of Birth</div>
                        {isEditing ? (
                            <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="border p-2 rounded" />
                        ) : (
                            <div className='font-medium text-gray-800'>{formData.dob}</div>
                        )}
                    </div>
                    <div className='flex flex-col gap-2'>
                        <div className='text-xs text-gray-500 uppercase tracking-wide'>Gender</div>
                        {isEditing ? (
                            <select name="gender" value={formData.gender} onChange={handleChange} className="border p-2 rounded">
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        ) : (
                            <div className='font-medium text-gray-800'>{userData.gender}</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;