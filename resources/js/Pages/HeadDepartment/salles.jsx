import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Plus, Edit2, Trash2, MapPin, Users, Search, Filter } from 'lucide-react';

export default function Salles() {
    const { rooms, flash } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [formData, setFormData] = useState({
        room_name: '',
        room_capacity: '',
        room_type: '',
        availability: 'Available'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingRoom) {
            router.put(`/HeadDepartment/Salles/${editingRoom.id}`, formData, {
                onSuccess: () => {
                    setShowModal(false);
                    setEditingRoom(null);
                    resetForm();
                }
            });
        } else {
            router.post('/HeadDepartment/Salles', formData, {
                onSuccess: () => {
                    setShowModal(false);
                    resetForm();
                }
            });
        }
    };

    const handleEdit = (room) => {
        setEditingRoom(room);
        setFormData({
            room_name: room.room_name,
            room_capacity: room.room_capacity,
            room_type: room.room_type,
            availability: room.availability == 1 ? 'Available' : 'Unavailable'
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            room_name: '',
            room_capacity: '',
            room_type: '',
            availability: 'Available'
        });
    };

    // Filter rooms based on search and filters
    const filteredRooms = rooms.filter(room => {
        const matchesSearch = room.room_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = !filterType || room.room_type === filterType;
        const matchesStatus = !filterStatus || (filterStatus === 'available' && room.availability == 1) || 
                              (filterStatus === 'unavailable' && room.availability == 0);
        
        return matchesSearch && matchesType && matchesStatus;
    });

    const handleDelete = (roomId) => {
        if (confirm('Are you sure you want to delete this room?')) {
            router.delete(`/HeadDepartment/Salles/${roomId}`);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Room Management" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Room Management</h1>
                        <p className="text-gray-600">Manage available rooms for exams and courses</p>
                    </div>

                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-green-800">{flash.success}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Search and Filters */}
                    <div className="bg-white rounded-lg shadow mb-6 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search rooms..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Types</option>
                                <option value="amphitheatre">Amphitheatre</option>
                                <option value="salle">Classroom</option>
                                <option value="laboratoire">Laboratory</option>
                            </select>
                            
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Status</option>
                                <option value="available">Available</option>
                                <option value="unavailable">Unavailable</option>
                            </select>
                            
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Room
                            </button>
                        </div>
                    </div>

                    {/* Rooms Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Room Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Capacity
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredRooms?.length > 0 ? (
                                    filteredRooms.map((room) => (
                                        <tr key={room.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <MapPin className="text-gray-400 mr-2" size={16} />
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {room.room_name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Users className="text-gray-400 mr-2" size={16} />
                                                    <span className="text-sm text-gray-900">
                                                        {room.room_capacity} people
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-900">
                                                    {room.room_type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        room.status_color === 'green'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}
                                                >
                                                    {room.status_text}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-3">
                                                    <button
                                                        onClick={() => handleEdit(room)}
                                                        className="text-blue-600 hover:text-blue-900 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(room.id)}
                                                        className="text-red-600 hover:text-red-900 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center">
                                                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-500 text-lg font-medium">
                                                    No rooms found
                                                </p>
                                                <p className="text-gray-400 text-sm mt-2">
                                                    Start by adding a room
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Add/Edit Modal */}
                    {showModal && (
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {editingRoom ? 'Edit Room' : 'Add Room'}
                                    </h3>
                                    <button
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingRoom(null);
                                            resetForm();
                                        }}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Room Name
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.room_name}
                                            onChange={(e) => setFormData({...formData, room_name: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="ex: Amphi 1"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Capacity
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            value={formData.room_capacity}
                                            onChange={(e) => setFormData({...formData, room_capacity: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="ex: 200"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Type
                                        </label>
                                        <select
                                            required
                                            value={formData.room_type}
                                            onChange={(e) => setFormData({...formData, room_type: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Select a type</option>
                                            <option value="amphitheatre">Amphitheatre</option>
                                            <option value="salle">Classroom</option>
                                            <option value="laboratoire">Laboratory</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Availability
                                        </label>
                                        <select
                                            required
                                            value={formData.availability}
                                            onChange={(e) => setFormData({...formData, availability: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="Available">Available</option>
                                            <option value="Unavailable">Unavailable</option>
                                        </select>
                                    </div>

                                    <div className="flex justify-end space-x-3 pt-4 border-t">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowModal(false);
                                                setEditingRoom(null);
                                                resetForm();
                                            }}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                        >
                                            {editingRoom ? 'Update' : 'Add'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
