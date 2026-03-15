import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, Plus, X, Edit2, Trash2, Phone, Mail, Car, Truck,
  CheckCircle2, Clock, AlertCircle, User as UserIcon, MapPin, Star
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Driver {
  id: string;
  name: string;
  phone: string;
  email?: string;
  vehicle_type: 'motorcycle' | 'car' | 'van' | 'bicycle';
  license_plate?: string;
  is_active: boolean;
  rating: number;
  total_deliveries: number;
  active_assignments?: number;
  completed_deliveries?: number;
  created_at: number;
}

interface Assignment {
  id: string;
  delivery_id: string;
  driver_id: string;
  assigned_at: number;
  status: 'assigned' | 'accepted' | 'rejected' | 'completed';
  notes?: string;
  client_name?: string;
  pickup_location?: string;
  delivery_status?: string;
  business_name?: string;
}

const VEHICLE_ICONS = {
  motorcycle: Truck,
  car: Car,
  van: Truck,
  bicycle: Car,
};

const VEHICLE_LABELS = {
  motorcycle: 'Motorcycle',
  car: 'Car',
  van: 'Van',
  bicycle: 'Bicycle',
};

const DriverManagement: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [showAssignments, setShowAssignments] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    vehicleType: 'motorcycle' as const,
    licensePlate: '',
  });

  useEffect(() => {
    loadDrivers();
    loadAssignments();
  }, []);

  const loadDrivers = async () => {
    try {
      const response = await fetch('/v1/drivers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('nitro_token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDrivers(data);
      }
    } catch (error) {
      console.error('Failed to load drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAssignments = async () => {
    try {
      const response = await fetch('/v1/drivers/assignments', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('nitro_token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAssignments(data);
      }
    } catch (error) {
      console.error('Failed to load assignments:', error);
    }
  };

  const handleCreateDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/v1/drivers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('nitro_token')}`
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email || undefined,
          vehicleType: formData.vehicleType,
          licensePlate: formData.licensePlate || undefined,
        })
      });

      if (response.ok) {
        setShowCreateModal(false);
        setFormData({ name: '', phone: '', email: '', vehicleType: 'motorcycle', licensePlate: '' });
        loadDrivers();
      }
    } catch (error) {
      console.error('Failed to create driver:', error);
    }
  };

  const handleUpdateDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDriver) return;

    try {
      const response = await fetch(`/v1/drivers/${selectedDriver.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('nitro_token')}`
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email || undefined,
          vehicleType: formData.vehicleType,
          licensePlate: formData.licensePlate || undefined,
        })
      });

      if (response.ok) {
        setShowEditModal(false);
        setSelectedDriver(null);
        setFormData({ name: '', phone: '', email: '', vehicleType: 'motorcycle', licensePlate: '' });
        loadDrivers();
      }
    } catch (error) {
      console.error('Failed to update driver:', error);
    }
  };

  const handleDeleteDriver = async (driverId: string) => {
    if (!confirm('Are you sure you want to delete this driver?')) return;

    try {
      const response = await fetch(`/v1/drivers/${driverId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('nitro_token')}`
        }
      });

      if (response.ok) {
        loadDrivers();
      }
    } catch (error) {
      console.error('Failed to delete driver:', error);
    }
  };

  const openEditModal = (driver: Driver) => {
    setSelectedDriver(driver);
    setFormData({
      name: driver.name,
      phone: driver.phone,
      email: driver.email || '',
      vehicleType: driver.vehicle_type,
      licensePlate: driver.license_plate || '',
    });
    setShowEditModal(true);
  };

  const formatDate = (ts: number) => {
    return new Date(ts * 1000).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'accepted': return 'text-purple-600 bg-purple-50 border-purple-100';
      case 'completed': return 'text-green-600 bg-green-50 border-green-100';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-black text-gray-900">Driver Management</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-black text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
        >
          <Plus size={16} /> Add Driver
        </button>
      </div>

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drivers.map((driver, idx) => {
          const VehicleIcon = VEHICLE_ICONS[driver.vehicle_type];
          return (
            <motion.div
              key={driver.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <VehicleIcon size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900">{driver.name}</h3>
                    <p className="text-xs text-gray-500">{VEHICLE_LABELS[driver.vehicle_type]}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(driver)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteDriver(driver.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone size={14} />
                  <span>{driver.phone}</span>
                </div>
                {driver.email && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={14} />
                    <span className="truncate">{driver.email}</span>
                  </div>
                )}
                {driver.license_plate && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Car size={14} />
                    <span>{driver.license_plate}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Star size={14} className="text-yellow-500" />
                  <span>{driver.rating.toFixed(1)} rating</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  <span>{driver.total_deliveries} deliveries</span>
                  {driver.active_assignments !== undefined && (
                    <span className="ml-2">• {driver.active_assignments} active</span>
                  )}
                </div>
                <div className={cn(
                  'px-2 py-1 rounded-full text-xs font-black border',
                  driver.is_active ? 'text-green-600 bg-green-50 border-green-100' : 'text-gray-400 bg-gray-50 border-gray-100'
                )}>
                  {driver.is_active ? 'Active' : 'Inactive'}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Assignments Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h3 className="text-xl font-black text-gray-900">Recent Assignments</h3>
          <button
            onClick={() => setShowAssignments(!showAssignments)}
            className="text-blue-600 font-black text-sm hover:text-blue-700 transition-colors"
          >
            {showAssignments ? 'Hide' : 'Show'} Assignments
          </button>
        </div>

        {showAssignments && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Driver</th>
                    <th className="px-4 py-3 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Delivery</th>
                    <th className="px-4 py-3 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Business</th>
                    <th className="px-4 py-3 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Client</th>
                    <th className="px-4 py-3 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Assigned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {assignments.map((assignment) => (
                    <tr key={assignment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <UserIcon size={16} className="text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">{assignment.driver_name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{assignment.delivery_id}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[200px]">{assignment.pickup_location}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{assignment.business_name || 'Unknown'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{assignment.client_name || 'Unknown'}</td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          'px-2 py-1 rounded-full text-xs font-black border',
                          getStatusColor(assignment.status)
                        )}>
                          {assignment.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{formatDate(assignment.assigned_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {assignments.length === 0 && (
                <div className="text-center py-8 text-gray-400 font-medium">No assignments found</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {(showCreateModal || showEditModal) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              setSelectedDriver(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6"
            >
              <h3 className="text-xl font-black text-gray-900 mb-6">
                {showCreateModal ? 'Add New Driver' : 'Edit Driver'}
              </h3>
              
              <form onSubmit={showCreateModal ? handleCreateDriver : handleUpdateDriver} className="space-y-4">
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-300"
                    placeholder="Enter driver name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-300"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-300"
                    placeholder="Enter email (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2">Vehicle Type *</label>
                  <select
                    required
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value as any })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-300"
                  >
                    <option value="motorcycle">Motorcycle</option>
                    <option value="car">Car</option>
                    <option value="van">Van</option>
                    <option value="bicycle">Bicycle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2">License Plate</label>
                  <input
                    type="text"
                    value={formData.licensePlate}
                    onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-300"
                    placeholder="Enter license plate (optional)"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                      setSelectedDriver(null);
                    }}
                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-black text-sm hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-black text-sm hover:bg-blue-700 transition-all"
                  >
                    {showCreateModal ? 'Create Driver' : 'Update Driver'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DriverManagement;
