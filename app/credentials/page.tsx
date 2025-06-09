"use client";

import { useSelector } from "react-redux";
import { useState } from "react";
import "./credentials.css"; // Import the external CSS file

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

  return (
    <div className="page-container">
      <div className="grid gap-6">
        {/* API Keys Section */}
        <div className="card">
          <div className="card-header flex justify-between items-center gap-3">
            <h2 className="card-title">API Credentials</h2>

            {/* Toggle Switch */}
            <div className="flex items-center gap-2">
              <button
                className={`env-button ${!isProd ? "active" : ""}`}
                onClick={() => setIsProd(false)}
              >
                UAT
              </button>
              <label className="toggle-container">
                <input
                  type="checkbox"
                  checked={isProd}
                  onChange={() => setIsProd(!isProd)}
                  className="toggle-checkbox"
                />
                <div className="toggle-slider"></div>
              </label>
              <button
                className={`env-button ${isProd ? "active" : ""}`}
                onClick={() => setIsProd(true)}
              >
                Production
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {credentials.map((credential) => (
                <div key={credential.id} className="credential-item">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        <span>Auth Key :- </span>{credential.data?.jwtSecret}
                      </h3>
                      <p className="text-sm text-gray-500">{credential.data?.authKey}</p>
                      <div className="mt-2 flex items-center space-x-3 text-sm text-gray-500">
                        <span>Created: {credential.created}</span>
                        <span>Last used: {credential.lastUsed}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`status-badge ${
                          credential.status === "Active" ? "status-active" : "status-inactive"
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
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Security Settings</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <button className="enable-button">Enable</button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">API Rate Limiting</h3>
                  <p className="text-sm text-gray-500">Configure request limits for your API keys</p>
                </div>
                <button className="configure-button">Configure</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}