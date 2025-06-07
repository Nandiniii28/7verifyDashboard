'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/components/service/axiosInstance';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AssignServicesPage() {
    const [users, setUsers] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedServices, setSelectedServices] = useState([]);

    useEffect(() => {
        fetchUsers();
        fetchServices();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axiosInstance.get('/admin/users');
            setUsers(res.data.users || []);
        } catch (err) {
            toast.error('Failed to fetch users');
        }
    };

    const fetchServices = async () => {
        try {
            const res = await axiosInstance.get('/admin/services');
            setServices(res.data.services || []);
        } catch (err) {
            toast.error('Failed to fetch services');
        }
    };

    const toggleService = (id) => {
        setSelectedServices((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    };

    const handleAssignSelectedServices = async () => {
        if (!selectedUserId || selectedServices.length === 0) {
            return toast.warn("Please select user and services");
        }

        try {
            const res = await axiosInstance.post('/admin/assign-services', {
                userId: selectedUserId,
                services: selectedServices
            });
            console.log(res);

            toast.success(res.data.message);
            setSelectedServices([]);
        } catch (err) {
            toast.error('Failed to assign services');
        }
    };

    const handleAssignAllServices = async () => {
        if (!selectedUserId) return toast.warn("Please select a user");

        try {
            await axiosInstance.post('/admin/assign-services-bulk', { userId: selectedUserId });
            toast.success('All services assigned to user');
        } catch (err) {
            toast.error('Failed to assign all services');
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">🛠 Assign Services</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Select User */}
                    <div>
                        <label className="block mb-1 font-medium">Select User</label>
                        <Select onValueChange={(val) => setSelectedUserId(val)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Choose a user" />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((user) => (
                                    <SelectItem key={user._id} value={user._id}>
                                        {user.name} ({user.email})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Services */}
                    <div>
                        <label className="block mb-1 font-medium">Select Services</label>
                        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto border p-2 rounded-md">
                            {services.map((service) => (
                                <label key={service._id} className="flex items-center space-x-2">
                                    <Checkbox
                                        checked={selectedServices.includes(service._id)}
                                        onCheckedChange={() => toggleService(service._id)}
                                    />
                                    <span className="text-sm">{service.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4">
                        <Button variant="outline" onClick={handleAssignAllServices}>
                            📦 Assign All Services
                        </Button>
                        <Button onClick={handleAssignSelectedServices} disabled={!selectedUserId || selectedServices.length === 0}>
                            ✅ Assign Selected Services
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
