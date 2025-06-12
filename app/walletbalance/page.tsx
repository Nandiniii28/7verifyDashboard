"use client";

import { useEffect, useState } from "react";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";
import axiosInstance from "@/components/service/axiosInstance";
import Link from "next/link";
import { FaWallet } from "react-icons/fa";

export default function WalletBalanceReportPage() {
    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [search, setSearch] = useState("");
    const [role, setRole] = useState("all");
    const [minWallet, setMinWallet] = useState("");
    const [maxWallet, setMaxWallet] = useState("");

    const fetchData = async (exportType = "") => {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (role !== "all") params.append("role", role);
        if (minWallet) params.append("minWallet", minWallet);
        if (maxWallet) params.append("maxWallet", maxWallet);
        params.append("page", page.toString());
        params.append("limit", "10");
        if (exportType) params.append("export", exportType);

        try {
            const url = `/admin/wallet-balance?${params.toString()}`;
            const res = await axiosInstance.get(url);

            if (exportType === "csv") {
                const blob = new Blob([res.data], { type: "text/csv" });
                saveAs(blob, "wallet-report.csv");
            } else if (exportType === "excel") {
                const blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                saveAs(blob, "wallet-report.xlsx");
            } else {
                setUsers(res.data.users);
                setTotal(res.data.totalWalletBalance);
                setTotalUsers(res.data.totalUsers);
                setTotalPages(res.data.totalPages);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page]);

    return (
        <div className="p-6 font-sans bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex items-center text-blue-600 mb-6">
                <div className="flex items-center">
                    <FaWallet className="mr-2 text-lg text-blue-600" />
                    <h2 className="text-2xl font-semibold">Wallet Balance Report</h2>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => fetchData()}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            borderRadius: '6px',
                            backgroundColor: '#2563eb',
                            padding: '8px 12px',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: 'white',
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                            cursor: 'pointer',
                            border: 'none',
                            outline: 'none',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                        onFocus={(e) => {
                            e.currentTarget.style.backgroundColor = '#1d4ed8';
                            e.currentTarget.style.boxShadow = '0 0 0 2px rgba(37, 99, 235, 0.5)';
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.backgroundColor = '#2563eb';
                            e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                        }}
                    >
                        Apply Filter
                    </button>

                    <button
                        onClick={() => fetchData("csv")}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            borderRadius: '6px',
                            backgroundColor: '#eff6ff',
                            padding: '8px 12px',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#1d4ed8',
                            border: '1px solid rgba(29, 78, 216, 0.1)',
                            outline: 'none',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                        onFocus={(e) => {
                            e.currentTarget.style.backgroundColor = '#dbeafe';
                            e.currentTarget.style.boxShadow = '0 0 0 2px rgba(37, 99, 235, 0.5)';
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.backgroundColor = '#eff6ff';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        Expert CSV
                    </button>

                    <button
                        onClick={() => fetchData("excel")}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            borderRadius: '6px',
                            backgroundColor: '#eff6ff',
                            padding: '8px 12px',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#1d4ed8',
                            border: '1px solid rgba(29, 78, 216, 0.1)',
                            outline: 'none',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                        onFocus={(e) => {
                            e.currentTarget.style.backgroundColor = '#dbeafe';
                            e.currentTarget.style.boxShadow = '0 0 0 2px rgba(37, 99, 235, 0.5)';
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.backgroundColor = '#eff6ff';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        Expert Excel
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', width: '100%' }}>
                <Input
                    placeholder="Search by name or email"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ flex: 1, width: '100%' }}
                />

                <div style={{ flex: 1, width: '100%' }}>
                    <Select value={role} onValueChange={setRole}>
                        <SelectTrigger style={{ width: '100%' }}>
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Stats */}
            <div className="flex gap-2 justify-end mb-6">
                <div className="flex gap-2">
                    <Input
                        placeholder="Min ₹"
                        type="number"
                        value={minWallet}
                        onChange={(e) => setMinWallet(e.target.value)}
                        className="w-24"
                    />
                    <Input
                        placeholder="Max ₹"
                        type="number"
                        value={maxWallet}
                        onChange={(e) => setMaxWallet(e.target.value)}
                        className="w-24"
                    />
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    width: '100%',
                    gap: '16px',

                }}>
                    <span style={{
                        padding: '8px 12px',
                        fontSize: '14px',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db',
                        backgroundColor: 'white'
                    }}>
                        Total Users: {totalUsers}
                    </span>
                    <span style={{
                        padding: '8px 12px',
                        fontSize: '14px',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db',
                        backgroundColor: 'white'
                    }}>
                        Total: ₹{total}
                    </span>
                </div>
            </div>

            {/* Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white mb-6">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-blue-50 text-blue-800 text-sm font-semibold text-left">
                            <th className="p-3 border-b border-gray-200">S.NO.</th>
                            <th className="p-3 border-b border-gray-200">Name</th>
                            <th className="p-3 border-b border-gray-200">Email</th>
                            <th className="p-3 border-b border-gray-200">Role</th>
                            <th className="p-3 border-b border-gray-200">Wallet</th>
                            <th className="p-3 border-b border-gray-200">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-6 text-center text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            users.map((user, index) => (
                                <tr
                                    key={user._id}
                                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    <td className="p-3 text-sm text-gray-700">{index + 1}</td>
                                    <td className="p-3 text-sm text-gray-700">{user.name}</td>
                                    <td className="p-3 text-sm text-gray-700">{user.email}</td>
                                    <td className="p-3 text-sm text-gray-700 capitalize">{user.role}</td>
                                    <td className="p-3 text-sm font-semibold text-gray-700">₹ {!user?.documents?.isVerify ? user?.wallet?.mode?.credentials : user?.wallet?.mode?.production || 0}</td>
                                    <td className="p-3">
                                        <Link
                                            href={`userwalletreport/${user._id}`}
                                            className="bg-blue-500 text-black px-3 py-2 rounded text-xs font-medium inline-block hover:bg-green-600 transition-colors"
                                        >
                                            View Ledger
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center py-4">
                <Button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                    Previous
                </Button>
                <span className="text-sm text-gray-500">
                    Page {page} of {totalPages}
                </span>
                <Button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}