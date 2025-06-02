"use client"

import { useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"

export default function UsagesPage() {
  const isMobile = useIsMobile()

  const usageStats = [
    { label: "Total Requests", value: "1,234,567", change: "+12.5%", trend: "up" },
    { label: "Avg Response Time", value: "245ms", change: "-8.2%", trend: "down" },
    { label: "Success Rate", value: "99.8%", change: "+0.3%", trend: "up" },
    { label: "Error Rate", value: "0.2%", change: "-0.1%", trend: "down" },
  ]

  const recentActivity = [
    { endpoint: "GET /api/users", status: 200, responseTime: "200ms", timestamp: "2 min ago" },
    { endpoint: "POST /api/orders", status: 201, responseTime: "156ms", timestamp: "5 min ago" },
    { endpoint: "GET /api/products", status: 404, responseTime: "--", timestamp: "8 min ago" },
    { endpoint: "PUT /api/users/123", status: 200, responseTime: "189ms", timestamp: "12 min ago" },
    { endpoint: "DELETE /api/orders/456", status: 204, responseTime: "98ms", timestamp: "15 min ago" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {usageStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className="flex items-center space-x-1">
                <span className={`text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {stat.change}
                </span>
                <i
                  className={`bi ${stat.trend === "up" ? "bi-arrow-up text-green-600" : "bi-arrow-down text-red-600"}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hit Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Charges
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentActivity.map((activity, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                    {activity.endpoint}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{activity.responseTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
