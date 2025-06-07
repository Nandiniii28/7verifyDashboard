"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/components/service/axiosInstance";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { toast } from "react-toastify";

export default function KycRequestPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        search: "",
        role: "all",
        startDate: "",
        endDate: "",
        sortBy: "createdAt",
        sortOrder: "desc",
    });
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchKycRequests();
    }, [filters, page]);

    const handleAction = async (isVerified, userId) => {

        try {
            setLoading(true);
            const res = await axiosInstance.post("/admin/verify-kyc", {

                userId,
                isVerified

            });
            setUsers(res.data.data);
            setTotalPages(res.data.totalPages);
        } catch (err: any) {
            toast.error("Failed to load KYC requests.");
        } finally {
            setLoading(false);
        }
    };
    const fetchKycRequests = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/admin/kyc-request", {
                params: {
                    ...filters,
                    role: filters.role === "all" ? "" : filters.role,
                    page,
                    limit,
                },
            });
            setUsers(res.data.data);
            setTotalPages(res.data.totalPages);
        } catch (err: any) {
            toast.error("Failed to load KYC requests.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-6 bg-gray-50">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">KYC Requests</h1>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Input
                    placeholder="Search name or email"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
                <Select
                    value={filters.role}
                    onValueChange={(value) =>
                        setFilters({ ...filters, role: value })
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                </Select>
                <Input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                />
                <Input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                />
                <Select
                    value={filters.sortOrder}
                    onValueChange={(value) =>
                        setFilters({ ...filters, sortOrder: value })
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Sort Order" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="desc">Newest First</SelectItem>
                        <SelectItem value="asc">Oldest First</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="bg-white shadow rounded overflow-x-auto">
                {loading ? (
                    <div className="text-center py-6">Loading...</div>
                ) : users?.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">No KYC requests found.</div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left font-medium">Name</th>
                                <th className="px-6 py-3 text-left font-medium">Email</th>
                                <th className="px-6 py-3 text-left font-medium">Role</th>
                                <th className="px-6 py-3 text-left font-medium">Date</th>
                                <th className="px-6 py-3 text-left font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users?.map((user: any) => (
                                <tr key={user._id}>
                                    <td className="px-6 py-4">{user.name}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4 capitalize">{user.role}</td>
                                    <td className="px-6 py-4">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <Button
                                                variant="default"
                                                // className="bg-green-600 hover:bg-green-700"
                                                onClick={() => handleAction(true, user._id)}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={() => handleAction(false, user._id)}
                                            >
                                                Reject
                                            </Button>
                                        </div>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
                <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>
                    Previous
                </Button>
                <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                </span>
                <Button variant="outline" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                    Next
                </Button>
            </div>
        </div>
    );
}
