"use client";

import { useState } from "react";
import axiosInstance from "@/components/service/axiosInstance";
import { FaUser, FaEnvelope, FaLock, FaUserShield } from "react-icons/fa";
import "./updateuser.css";

export default function CreateUserForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);

 

  return (
    <form className="form-container" >
      <h1 className="form-title"><FaUserShield className="icon" /> Edit New User</h1>

      <div className="form-grid">
        <div className="input-wrapper">
          <FaUser className="input-icon" />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
           
            className="form-input"
            required
          />
        </div>

        <div className="input-wrapper">
          <FaEnvelope className="input-icon" />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
     
            className="form-input"
            required
          />
        </div>

        <div className="input-wrapper">
          <FaLock className="input-icon" />
          <input
            type="password"
            name="password"
            placeholder="Password"
           
            className="form-input"
            required
          />
        </div>

        <div className="input-wrapper">
          <FaUserShield className="input-icon" />
          <select
            name="role"
            
            className="form-input"
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <button className="submit-button" type="submit" disabled={loading}>
        {loading ? "Creating..." : "Update User"}
      </button>
    </form>
  );
}
