"use client";
import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import Header from "@/components/header";
import { useIsMobile } from "@/hooks/use-mobile";
import { th } from "date-fns/locale";
export default function WalletLedger() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();

  const walletData = [
  {
    walletType: "Main Wallet",
    amount: "₹1,500.00",
    description: "Recharge bonus credited",
    refId: "REF12345678",
    createdAt: "2025-05-31 10:45 AM",
  },
  {
    walletType: "Bonus Wallet",
    amount: "₹200.00",
    description: "Referral reward",
    refId: "REF98765432",
    createdAt: "2025-05-30 04:20 PM",
  },
  {
    walletType: "Main Wallet",
    amount: "₹750.00",
    description: "Withdrawal to bank",
    refId: "REF11223344",
    createdAt: "2025-05-29 11:00 AM",
  },
];

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={setSidebarOpen}
          onNavigate={undefined}
        />

        <div
          className={`transition-all duration-300 ${
            isMobile ? "ml-0" : sidebarOpen ? "ml-60" : "ml-28"
          }`}
        >
          <Header isOpen={sidebarOpen} onToggle={setSidebarOpen} />

          <main className="p-6">
            {/* <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Wallet Ledger
              </h1>
              <p className="text-gray-600 mt-1">
                View and manage your wallet ledger
              </p>
            </div> */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Wallet Ledger Summary
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Wallet Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ref Id
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Create At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {walletData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                          {item.walletType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.refId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.createdAt}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
