"use client";

import axiosInstance from "@/components/service/axiosInstance";
import { use, useEffect, useState } from "react";

export default function WalletLedger({ params }) {
    const { id } = use(params)

    const [walletData, setWalletData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({ type: "", minAmount: "", maxAmount: "" });

    const fetchWalletLedger = async () => {
        setLoading(true);
        try {
            // const params = {
            //     userId: id
            // };
            const res = await axiosInstance.get(`/admin/ledger/${id}`,);
            console.log(res);

            setWalletData(res.data.ledger);
            setTotalPages(res.data.totalPages);
            console.log(res);

        } catch (error) {
            console.error("Failed to fetch wallet ledger:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWalletLedger();
    }, [page, limit, filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
        setPage(1); // Reset to first page on filter change
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Wallet Ledger Summary</h2>
                </div>

                <div className="p-4 flex flex-wrap gap-4 items-center">
                    <select
                        name="type"
                        value={filters.type}
                        onChange={handleFilterChange}
                        className="px-4 py-2 border rounded-md"
                    >
                        <option value="">All Types</option>
                        <option value="credit">Credit</option>
                        <option value="debit">Debit</option>
                    </select>

                    <input
                        type="number"
                        name="minAmount"
                        value={filters.minAmount}
                        onChange={handleFilterChange}
                        placeholder="Min Amount"
                        className="px-4 py-2 border rounded-md"
                    />

                    <input
                        type="number"
                        name="maxAmount"
                        value={filters.maxAmount}
                        onChange={handleFilterChange}
                        placeholder="Max Amount"
                        className="px-4 py-2 border rounded-md"
                    />
                </div>

                {loading ? (
                    <div className="p-6 text-gray-600">Loading...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.NO.</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {walletData.length > 0 ? (
                                    walletData.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-900 capitalize">{index + 1}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 capitalize">{item.type}</td>
                                            <td className={`px-6 py-4 text-sm font-semibold ${item.type === "credit" ? "text-green-600" : "text-red-600"}`}>₹{item.amount.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{item.description}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{item.referenceId || "N/A"}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{new Date(item.createdAt).toLocaleString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                            No wallet transactions found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <div className="flex justify-between items-center p-4">
                            <button
                                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                disabled={page === 1}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-gray-600">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={page === totalPages}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
