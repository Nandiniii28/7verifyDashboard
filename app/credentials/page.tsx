"use client";

import { useSelector } from "react-redux";
import { useState } from "react";

export default function CredentialsPage() {
  const { admin } = useSelector((state) => state.admin);
  const [isProd, setIsProd] = useState(false);

  const environment = isProd ? admin?.production : admin?.credentials;

  const credentials = [
    {
      id: 1,
      data: environment,
      type: "API Key",
      status: environment?.isActive ? "Active" : "Inactive",
      created: admin?.createdAt?.slice(0, 10),
      lastUsed: admin?.updatedAt?.slice(0, 10),
    },
  ];
  console.log("sdfs", credentials);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="grid gap-6">
        {/* API Keys Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
            <h2 className="text-lg font-medium text-gray-900">API Credentials</h2>

            {/* Toggle Switch */}
            <div className="flex items-center gap-2">
              <button className="text-sm text-gray-600" onClick={() => setIsProd(false)}>UAT</button>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isProd}
                  onChange={() => setIsProd(!isProd)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-300 relative">
                  <div className="absolute top-0.5 left-0.5 h-5 w-5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                </div>
              </label>
              <button className="text-sm text-gray-600" onClick={() => setIsProd(true)}>Production</button>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {credentials.map((credential) => (
                <div key={credential.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900"><span>Auth Key :- </span>{credential.data?.jwtSecret}</h3>
                      <p className="text-sm text-gray-500">{credential.data?.authKey}</p>
                      <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                        <span>Created: {credential.created}</span>
                        <span>Last used: {credential.lastUsed}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${credential.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {credential.status}
                      </span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <i className="bi bi-three-dots-vertical" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Security Settings</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Enable
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">API Rate Limiting</h3>
                  <p className="text-sm text-gray-500">Configure request limits for your API keys</p>
                </div>
                <button className="text-blue-600 hover:text-blue-800">Configure</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
