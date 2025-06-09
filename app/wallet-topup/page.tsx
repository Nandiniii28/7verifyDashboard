"use client";

import { useState } from "react";
import axiosInstance from "@/components/service/axiosInstance";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminDetails } from "../redux/reducer/AdminSlice";
import { FaWallet } from "react-icons/fa";
import "./topup.css"; // Import the external CSS file

export default function WalletTopupForm() {
  const { admin } = useSelector((state: any) => state.admin);
  const dispatch = useDispatch();

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTopup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !description) {
      toast.error("Amount and description are required.");
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast.error("Amount must be greater than zero.");
      return;
    }

    try {
      setLoading(true);

      const res = await axiosInstance.post("admin/wallet-topup", {
        userId: admin?._id,
        amount: parseFloat(amount),
        description,
      });

      toast.success(res.data.message || "Top-up successful!");
      dispatch(fetchAdminDetails());

      setAmount("");
      setDescription("");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Top-up failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="card-title">
          <FaWallet size={20} color="#2f84c9" />
          Wallet Top-Up
        </h2>

        <form onSubmit={handleTopup} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label className="form-label">Amount (₹)</label>
            <input
              type="number"
              min="1"
              required
              className="form-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount e.g. 1000"
            />
          </div>

          <div>
            <label className="form-label">Description</label>
            <input
              type="text"
              required
              className="form-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g., Recharge, Bonus, Adjustment"
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="spinner" size={18} />
                Processing...
              </>
            ) : (
              "Top Up Now"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
