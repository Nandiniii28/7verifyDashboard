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

        const url = `/admin/wallet-balance?${params.toString()}`;
        const res = await axiosInstance.get(url);
        console.log(res);

        // if (!res.ok) return alert("Error fetching data");

        if (exportType === "csv") {
            const blob = await res.blob();
            saveAs(blob, "wallet-report.csv");
        } else if (exportType === "excel") {
            const blob = await res.blob();
            saveAs(blob, "wallet-report.xlsx");
        } else {
            setUsers(res.data.users);
            setTotal(res.data.totalWalletBalance);
            setTotalUsers(res.data.totalUsers);
            setTotalPages(res.data.totalPages);
        }
    };


    useEffect(() => {
        fetchData();
    }, [page]);

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-semibold">Wallet Balance Report</h2>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                    placeholder="Search by name or email"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Select value={role} onValueChange={setRole}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                </Select>
                <div className="flex gap-2">
                    <Input
                        placeholder="Min wallet"
                        type="number"
                        value={minWallet}
                        onChange={(e) => setMinWallet(e.target.value)}
                    />
                    <Input
                        placeholder="Max wallet"
                        type="number"
                        value={maxWallet}
                        onChange={(e) => setMaxWallet(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
                <Button onClick={() => fetchData()} variant="default">
                    Apply Filter
                </Button>

                <Button variant="outline" onClick={() => fetchData("csv")}>
                    Export CSV
                </Button>

                <Button variant="outline" onClick={() => fetchData("excel")}>
                    Export Excel
                </Button>

                <Button variant="secondary" disabled className="cursor-default bg-gray-400">
                    Total Users: {totalUsers}
                </Button>

                <Button variant="secondary" disabled className="cursor-default bg-gray-400">
                    Total Wallet Balance:- ₹{total}
                </Button>
            </div>



            {/* Table */}
            <div className="border rounded-md mt-4">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">S.NO.</th>
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Email</th>
                            <th className="p-2 border">Role</th>
                            <th className="p-2 border">Wallet</th>
                            <th className="p-2 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-4 text-center">
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            users.map((user, index) => (
                                <tr key={user._id}>
                                    <td className="p-2 border">{index + 1}</td>
                                    <td className="p-2 border">{user.name}</td>
                                    <td className="p-2 border">{user.email}</td>
                                    <td className="p-2 border capitalize">{user.role}</td>
                                    <td className="p-2 border">₹{user.wallet}</td>
                                    <td className="p-2 border">
                                        <Button
                                        >
                                            <Link href={`userwalletreport/${user._id}`}>
                                                view ladger
                                            </Link>
                                        </Button></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <Button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                    Previous
                </Button>
                <span>
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
