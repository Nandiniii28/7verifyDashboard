'use client';

import { useState } from 'react';
import axiosInstance from '@/components/service/axiosInstance';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminDetails } from '../redux/reducer/AdminSlice';

export default function WalletTopupForm() {
  const { admin } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTopup = async (e) => {
    e.preventDefault();

    if (!amount || !description) {
      toast.error('⚠️ Amount and description are required.');
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast.error('⚠️ Amount must be greater than zero.');
      return;
    }

    try {
      setLoading(true);

      const res = await axiosInstance.post('admin/wallet-topup', {
        userId: admin?._id,
        amount: parseFloat(amount),
        description,
      });

      toast.success(`✅ ${res.data.message || 'Top-up successful!'}`);
      dispatch(fetchAdminDetails());

      // Reset form
      setAmount('');
      setDescription('');
    } catch (err) {
      toast.error(
        `❌ ${err?.response?.data?.message || 'Top-up failed. Please try again.'}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        💰 Wallet Top-Up
      </h2>

      <form onSubmit={handleTopup} className="space-y-5">
        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount (₹)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter amount e.g. 1000"
            required
            min="1"
          />
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="E.g., Recharge, Bonus, Adjustment"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center px-4 py-2 text-white font-medium bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Processing...
            </>
          ) : (
            'Top Up Now'
          )}
        </button>
      </form>
    </div>
  );
}
