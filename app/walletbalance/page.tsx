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

    // CSS styles as JavaScript objects
    const styles = {
        container: {
            padding: "24px",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            backgroundColor: "#f8fafc",
            minHeight: "100vh"
        },
        header: {
            fontSize: "24px",
            fontWeight: 600,
            color: "#1e293b",
            marginBottom: "24px"
        },
        filterContainer: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "16px",
            marginBottom: "24px"
        },
        inputContainer: {
            display: "flex",
            gap: "12px"
        },
        buttonContainer: {
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "24px"
        },
        tableContainer: {
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
            marginBottom: "24px"
        },
        table: {
            width: "100%",
            borderCollapse: "collapse"
        },
        tableHeader: {
            backgroundColor:"#eff6ff",
            color: "#1d4ed8",
            fontSize: "14px",
            fontWeight: 600,
            textAlign: "left"
        },
        tableHeaderCell: {
            padding: "12px 16px",
            borderBottom: "1px solid #e2e8f0"
        },
        tableRow: {
            borderBottom: "1px solid #e2e8f0",
            transition: "background-color 0.2s ease"
        },
        tableRowHover: {
            backgroundColor: "#f3f4f6"
        },
        tableCell: {
            padding: "12px 16px",
            fontSize: "14px",
            color: "#334155"
        },
        emptyState: {
            padding: "24px",
            textAlign: "center",
            color: "#64748b"
        },
        pagination: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 0"
        },
        paginationInfo: {
            fontSize: "14px",
            color: "#64748b"
        },
        viewLedgerButton: {
            backgroundColor: "#10b981",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: "4px",
            fontSize: "13px",
            fontWeight: 500,
            textDecoration: "none",
            display: "inline-block"
        },
        walletAmount: {
            fontWeight: 600,
            color: "#16a34a"
        },
        secondaryButton: {
            backgroundColor: "#e2e8f0",
            color: "#334155",
            cursor: "default",
            padding: "10px 16px",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: 500,
            border: "none"
        }
    };

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
        <div style={styles.container}>
            <h2 style={styles.header}>Wallet Balance Report</h2>

            {/* Filters */}
            <div style={styles.filterContainer}>
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
                <div style={styles.inputContainer}>
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

            <div style={styles.buttonContainer}>
                <Button onClick={() => fetchData()}>
                    Apply Filter
                </Button>

                <Button variant="outline" onClick={() => fetchData("csv")}>
                    Export CSV
                </Button>

                <Button variant="outline" onClick={() => fetchData("excel")}>
                    Export Excel
                </Button>

                <button style={styles.secondaryButton}>
                    Total Users: {totalUsers}
                </button>

                <button style={styles.secondaryButton}>
                    Total Wallet Balance: ₹{total}
                </button>
            </div>

            {/* Table */}
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.tableHeader}>
                            <th style={styles.tableHeaderCell}>S.NO.</th>
                            <th style={styles.tableHeaderCell}>Name</th>
                            <th style={styles.tableHeaderCell}>Email</th>
                            <th style={styles.tableHeaderCell}>Role</th>
                            <th style={styles.tableHeaderCell}>Wallet</th>
                            <th style={styles.tableHeaderCell}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={styles.emptyState}>
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            users.map((user, index) => (
                                <tr 
                                    key={user._id}
                                    style={styles.tableRow}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = styles.tableRowHover.backgroundColor;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = "";
                                    }}
                                >
                                    <td style={styles.tableCell}>{index + 1}</td>
                                    <td style={styles.tableCell}>{user.name}</td>
                                    <td style={styles.tableCell}>{user.email}</td>
                                    <td style={{...styles.tableCell, textTransform: "capitalize"}}>{user.role}</td>
                                    <td style={{...styles.tableCell, ...styles.walletAmount}}>₹{user.wallet}</td>
                                    <td style={styles.tableCell}>
                                        <Link 
                                            href={`userwalletreport/${user._id}`}
                                            style={styles.viewLedgerButton}
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
            <div style={styles.pagination}>
                <Button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                    Previous
                </Button>
                <span style={styles.paginationInfo}>
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