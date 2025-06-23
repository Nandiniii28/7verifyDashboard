"use client";

import { useState } from "react";
import axiosInstance from "@/components/service/axiosInstance";
import { useRouter } from "next/navigation";

const walletModes = ["production", "credentials"];

export default function TopupRequestForm() {
    const router = useRouter();

    const [form, setForm] = useState({
        amount: "",
        mode: "UPI",
        walletMode: "production",
        description: "",
        vpa: "",
        accountName: "",
        accountNumber: "",
        ifscCode: "",
        bankName: "",
        branch: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                amount: parseFloat(form.amount),
                mode: form.mode,
                walletMode: form.walletMode,
                description: form.description,
                ...(form.mode === "UPI" && { upiDetails: { vpa: form.vpa } }),
                ...(form.mode === "Bank Transfer" && {
                    bankDetails: {
                        accountName: form.accountName,
                        accountNumber: form.accountNumber,
                        ifscCode: form.ifscCode,
                        bankName: form.bankName,
                        branch: form.branch,
                    },
                }),
            };

            const res = await axiosInstance.post("/topupReq/request-topup", payload);
            if (res.data.success) {
                setForm({
                    amount: "",
                    mode: "UPI",
                    walletMode: "production",
                    description: "",
                    vpa: "",
                    accountName: "",
                    accountNumber: "",
                    ifscCode: "",
                    bankName: "",
                    branch: "",
                });
            }


        } catch (err) {
            console.error("Top-up request failed:", err);
            alert("Failed to submit top-up request.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className=" card custom-card space-y-6 p-4"
        >
            <div className="card-header">
                <h2 className="card-title">Request Wallet Top-Up</h2>

            </div>
            <div className=" grid grid-cols-12">
                {/* Amount */}
                 <div className="col-span-12 lg:col-span-4" style={{
                    padding: '0.7rem',

                }}>
                    <label className="block font-medium text-gray-700 mb-1">Amount <span className="text-red-500">*</span></label>
                    <input
                        type="number"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter amount"
                    />
                </div>
                 {/* Wallet Mode */}
                 <div className="col-span-12 lg:col-span-4" style={{
                    padding: '0.7rem',

                }}>
                    <label className="block font-medium text-gray-700 mb-1">Wallet Mode <span className="text-red-500">*</span></label>
                    <select
                        name="walletMode"
                        value={form.walletMode}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        {walletModes.map((mode) => (
                            <option key={mode} value={mode}>
                                {mode.charAt(0).toUpperCase() + mode.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                
                {/* Payment Mode */}
                 <div className="col-span-12 lg:col-span-4" style={{
                    padding: '0.7rem',

                }}>
                    <label className="block font-medium text-gray-700 mb-1">Payment Mode <span className="text-red-500"  >*</span></label>
                    <select
                        name="mode"
                        value={form.mode}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required

                    >
                        <option value="UPI">UPI</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Cash">Cash</option>
                        <option value="Wallet">Wallet</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                 <div className="col-span-12 lg:col-span-4" style={{
                    padding: '0.7rem',

                }}>
                    <label className="block font-medium text-gray-700 mb-1">Account Type <span className="text-red-500">*</span></label>
                    <select
                        name="account type"
                        value={form.walletMode}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        {walletModes.map((mode) => (
                            <option key={mode} value={mode}>
                                {mode.charAt(0).toUpperCase() + mode.slice(1)}
                            </option>
                        ))}
                    </select>

                </div>
                 <div className="col-span-12 lg:col-span-4" style={{
                    padding: '0.7rem',

                }}>
                    <label className="block font-medium text-gray-700 mb-1">Account Number</label>
                    <input
                        type="text"
                        value={form.accountNumber || ""}
                        disabled
                        className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
                    />
                </div>
                 <div className="col-span-12 lg:col-span-4" style={{
                    padding: '0.7rem',

                }}>
                    <label className="block font-medium text-gray-700 mb-1">IFSC Code</label>
                    <input
                        type="text"
                        value={form.accountNumber || ""}
                        disabled
                        className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
                    />
                </div>

               


                {/* UPI Fields */}
                {form.mode === "UPI" && (
                     <div className="col-span-12 lg:col-span-4" style={{
                    padding: '0.7rem',

                }}>
                        <label className="block font-medium text-gray-700 mb-1">UPI VPA <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="vpa"
                            value={form.vpa}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. username@bank"
                        />
                    </div>
                )}

                {/* Bank Transfer Fields */}
                {form.mode === "Bank Transfer" && (
                    <>
                        <div style={{
                            padding: '0.7rem',

                        }}>
                            <label className="block font-medium text-gray-700 mb-1">Account Name</label>
                            <input
                                type="text"
                                name="accountName"
                                value={form.accountName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md"
                            />
                        </div>
                        <div style={{
                            padding: '0.7rem',

                        }}>
                            <label className="block font-medium text-gray-700 mb-1">Account Number</label>
                            <input
                                type="text"
                                name="accountNumber"
                                value={form.accountNumber}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md"
                            />
                        </div>
                        <div style={{
                            padding: '0.7rem',

                        }}>
                            <label className="block font-medium text-gray-700 mb-1">IFSC Code</label>
                            <input
                                type="text"
                                name="ifscCode"
                                value={form.ifscCode}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md uppercase"
                            />
                        </div>
                        <div style={{
                            padding: '0.7rem',

                        }}>
                            <label className="block font-medium text-gray-700 mb-1">Bank Name</label>
                            <input
                                type="text"
                                name="bankName"
                                value={form.bankName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md"
                            />
                        </div>
                        <div style={{
                            padding: '0.7rem',

                        }}>
                            <label className="block font-medium text-gray-700 mb-1">Branch</label>
                            <input
                                type="text"
                                name="branch"
                                value={form.branch}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md"
                            />
                        </div>
                    </>
                )}

                {/* Description */}
                 <div className="col-span-12 lg:col-span-4" style={{
                    padding: '0.7rem',

                }}>
                    <label className="block font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md"
                        placeholder="Add an optional note..."
                    />
                </div>

                {/* Submit */}
            
            </div>
                <div className="flex" style={{"justifyContent":"end"}}>
                    <button
                    type="submit"
                    className=" brandorange-bg-light brandorange-text py-2 px-3 rounded-md font-medium hover:bg-[#f9c4ad] transition"
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Submit Top-Up Request"}
                </button>
                </div>
        </form>
    );
}
