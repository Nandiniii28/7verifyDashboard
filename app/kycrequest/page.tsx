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
import { FiUserCheck } from "react-icons/fi";
// React icons import
import { FiSearch, FiUser, FiCalendar, FiArrowUp, FiArrowDown } from "react-icons/fi";

// Import external CSS for filters form
import "./kycrequest.css";

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
                isVerified,
            });
            setUsers(res.data.data);
            setTotalPages(res.data.totalPages);
        } catch (err) {
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
        } catch (err) {
            toast.error("Failed to load KYC requests.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-6 bg-gray-50">
            <div className="mb-2 flex items-center gap-2">
                <FiUserCheck style={{ fontSize: "30px", color: "#2563eb" }} />
                <h1 style={{ color: "#2563eb" }} className="text-2xl font-bold">
                    KYC Requests
                </h1>
            </div>


            {/* Filters form with icons and layout */}
            <div className="filters">
                {/* Full row - search input */}
                <div className="filter-item full-row">
                    <label htmlFor="search">
                        <FiSearch className="icon" /> Name or Email
                    </label>
                    <Input
                        id="search"
                        placeholder="Search name or email"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                </div>

                {/* Half row - Role and Sort Order */}
                <div className="filter-row">
                    <div className="filter-item half-row">
                        <label htmlFor="role">
                            <FiUser className="icon" /> Role
                        </label>
                        <Select
                            id="role"
                            value={filters.role}
                            onValueChange={(value) => setFilters({ ...filters, role: value })}
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
                    </div>

                    <div className="filter-item half-row">
                        <label htmlFor="sortOrder">
                            <FiArrowUp className="icon" />
                            <FiArrowDown className="icon" /> Sort Order
                        </label>
                        <Select
                            id="sortOrder"
                            value={filters.sortOrder}
                            onValueChange={(value) => setFilters({ ...filters, sortOrder: value })}
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
                </div>

                {/* Half row - Start Date and End Date */}
                <div className="filter-row">
                    <div className="filter-item half-row">
                        <label htmlFor="startDate">
                            <FiCalendar className="icon" /> Start Date
                        </label>
                        <Input
                            type="date"
                            id="startDate"
                            value={filters.startDate}
                            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                        />
                    </div>

                    <div className="filter-item half-row">
                        <label htmlFor="endDate">
                            <FiCalendar className="icon" /> End Date
                        </label>
                        <Input
                            type="date"
                            id="endDate"
                            value={filters.endDate}
                            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                        />
                    </div>
                </div>
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
                            {users?.map((user) => (
                                <tr key={user._id}>
                                    <td className="px-6 py-4">{user.name}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4 capitalize">{user.role}</td>
                                    <td className="px-6 py-4">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <Button variant="default" onClick={() => handleAction(true, user._id)}>
                                                Approve
                                            </Button>
                                            <Button variant="destructive" onClick={() => handleAction(false, user._id)}>
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
