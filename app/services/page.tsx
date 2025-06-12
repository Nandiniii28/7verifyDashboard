"use client";

import { useEffect, useState } from "react";
import { SignJWT } from "jose";
import { useSearchParams } from "next/navigation";
import axiosInstance from "@/components/service/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminDetails } from "../redux/reducer/AdminSlice";


// Function to sign JWT with jose
const generateToken = async (payload, secret) => {
    const secretKey = new TextEncoder().encode(secret);
    const jwt = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1h")
        .sign(secretKey);
    return jwt;
};

export default function ServiceDynamicPage() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const { admin } = useSelector((state) => state.admin);
    const dispatch = useDispatch()
    const [service, setService] = useState(null);
    const [formData, setFormData] = useState({});
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            axiosInstance
                .get(`/user/service/${id}`)
                .then((res) => setService(res.data.data))
                .catch((err) => console.error("Service fetch error:", err));
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, type, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === "file" ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log("🔄 Form submission started");

        try {
            const hasFile = service.fields.some((field) => field.type === "file");

            let requestData;
            let headers = {};

            // Step 1: Prepare request payload
            if (hasFile) {
                const formPayload = new FormData();
                service.fields.forEach((field) => {
                    formPayload.append(field.name, formData[field.name]);
                });
                requestData = formPayload;
                // ✅ DO NOT set Content-Type manually for FormData
            } else {
                const jsonPayload = {};
                service.fields.forEach((field) => {
                    jsonPayload[field.name] = formData[field.name];
                });
                requestData = JSON.stringify(jsonPayload);
                headers["Content-Type"] = "application/json"; // ✅ Only for JSON
            }

            // Step 2: Determine environment
            const isKycVerified = admin?.documents?.isVerified;
            const environment = isKycVerified ? "production" : "credentials";
            const envConfig = admin?.[environment];

            if (!envConfig?.jwtSecret || !envConfig?.authKey) {
                throw new Error("Missing JWT secret or auth key in environment config");
            }

            // Step 3: Generate JWT token
            const token = await generateToken({
                userId: admin._id,
                email: admin.email,
                role: admin.role,
            }, envConfig.jwtSecret);

            // Step 4: API call
            const res = await fetch(`http://localhost:5050/api/verify/${service.endpoint}`, {
                method: "POST",
                headers: {
                    ...headers,
                    "client-id": envConfig.authKey,
                    "authorization": `Bearer ${token}`,
                    "x-env": environment,
                    // ❌ DO NOT manually set Content-Type for FormData
                },
                body: requestData,
            });

            const result = await res.json();
            if (result.success) {
                dispatch(fetchAdminDetails());
            }

            console.log("✅ API response received:", result);
            setResponse(result);

        } catch (err) {
            console.error("❌ Submission error:", err);
            setResponse({ error: "Something went wrong", details: err.message });
        } finally {
            setLoading(false);
            console.log("⏹️ Form submission completed");
        }
    };





    if (!service) return <p className="text-center mt-10">Loading service details...</p>;

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-xl mt-10">
            <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
                {service.name} Verification
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {service.fields.map((field) => (
                    <div key={field.name}>
                        <label className="block text-gray-700 font-medium mb-2">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <input
                            type={field.type || "text"}
                            name={field.name}
                            required={field.required}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                ))}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                    {loading ? "Processing..." : "Submit"}
                </button>
            </form>

            {response && (
                <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Response</h2>
                    <pre className="whitespace-pre-wrap text-gray-700 text-sm">
                        {JSON.stringify(response, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}
