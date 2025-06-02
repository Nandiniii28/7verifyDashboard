"use client"

import { useIsMobile } from "@/hooks/use-mobile"
import { useState } from "react"

export default function AllUserReportPage() {
  const isMobile = useIsMobile()

  const recentActivity = [
    { name: "Alice Johnson", partnerId: "P-001", status: 200, responseTime: "200ms", timestamp: "2 min ago" },
    { name: "Bob Smith", partnerId: "P-002", status: 200, responseTime: "156ms", timestamp: "5 min ago" },
    { name: "Charlie Kim", partnerId: "P-003", status: 404, responseTime: "--", timestamp: "8 min ago" },
    { name: "Dana White", partnerId: "P-004", status: 200, responseTime: "189ms", timestamp: "12 min ago" },
    { name: "Evan Thomas", partnerId: "P-005", status: 204, responseTime: "98ms", timestamp: "15 min ago" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">All User Report</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Partner Id</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hit Count</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Charges</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentActivity.map((activity, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-mono text-gray-900">{activity.name}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-mono text-gray-900">{activity.partnerId}</td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        activity.status >= 200 && activity.status < 300
                          ? "bg-green-100 text-green-800"
                          : activity.status >= 400
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {activity.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">{activity.responseTime}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{activity.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
