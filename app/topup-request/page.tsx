"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/components/service/axiosInstance";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

export default function PaymentRequestListPage() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({
        search: "",
        status: "Pending",
        mode: "",
        page: 1,
        limit: 10,
    });

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/topupReq", {
                params: filters,
            });
            setRequests(res.data.data);
            setTotal(res.data.total);
        } catch (err) {
            console.error("Error fetching payment requests:", err);
        } finally {
            setLoading(false);
        }
    };

    const statusChange = async (id, status) => {

        try {
            const res = await axiosInstance.patch(`/topupReq/${id}/status`, { status });

            fetchRequests()
            toast.success(res.data.message)
        } catch (err) {
            toast.error(err.response.data.message)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4">Top-Up Requests</h1>

            <div className="flex gap-4 mb-6">
                <input
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search..."
                />
                <select name="mode" value={filters.mode} onChange={handleFilterChange}>
                    <option value="">All Modes</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="Wallet">Wallet</option>
                </select>
                <select name="status" value={filters.status} onChange={handleFilterChange}>
                    <option value="">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                    <option value="Failed">Failed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>

            <div className="bg-white rounded-xl shadow overflow-x-auto">
                <table className="min-w-full table-auto text-sm">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            {/* <th className="p-3">Reference</th> */}
                            <th className="p-3">User</th>
                            <th className="p-3">Payment Mode</th>
                            <th className="p-3">Mode</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Amount</th>
                            <th className="p-3">Action</th>
                            <th className="p-3">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests?.map((req) => (
                            <tr key={req._id} className="border-b">
                                {/* <td className="p-3 font-medium">{req.reference}</td> */}
                                <td className="p-3">{req.userId?.name || "-"}</td>
                                <td className="p-3 text-center">{req.mode}</td>
                                <td className="p-3">{req.walletMode}</td>
                                <td className="p-3">{req.status}</td>
                                <td className="p-3">₹{req.amount}</td>
                                <td className="p-3">
                                    <select
                                        value={req.status}
                                        disabled={!(req.status === 'Pending' || req.status === 'Processing')}
                                        onChange={(e) => statusChange(req._id, e.target.value)}
                                        className={`px-3 py-1 rounded-full text-xs font-semibold appearance-none cursor-pointer
                                          ${req.status === "Pending"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : req.status === "Processing"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : req.status === "Completed"
                                                        ? "bg-green-100 text-green-800"
                                                        : req.status === "Failed"
                                                            ? "bg-red-100 text-red-800"
                                                            : req.status === "Cancelled"
                                                                ? "bg-gray-200 text-gray-600"
                                                                : ""
                                            }`}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Failed">Failed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>

                                <td className="p-3">{new Date(req.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                        {!requests.length && !loading && (
                            <tr>
                                <td colSpan="6" className="text-center py-6">
                                    No top-up requests found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-6">
                <p className="text-sm text-gray-600">
                    Showing page {filters.page} of {Math.ceil(total / filters.limit)}
                </p>
                <div className="space-x-2">
                    <Button
                        onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
                        disabled={filters.page <= 1}
                    >
                        Previous
                    </Button>
                    <Button
                        onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
                        disabled={filters.page >= Math.ceil(total / filters.limit)}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
