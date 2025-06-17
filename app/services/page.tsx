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
            // const isKycVerified = admin?.environment_mode;
            const environment = admin?.environment_mode ? "production" : "credentials";
            const envConfig = admin?.[environment];
            console.log(envConfig?.jwtSecret);

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
        <div style={{
            maxWidth: '80rem',  // Increased to accommodate side-by-side layout
            margin: '0 auto',
            padding: '2rem',
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            marginTop: '2.5rem',
            border: '1px solid #f0f0f0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'  // This will center the form horizontally
        }}>
            <h1 style={{
                fontSize: '1.875rem',
                fontWeight: '700',
                textAlign: 'center',
                color: '#1d4ed8',
                marginBottom: '1.5rem',
                position: 'relative'
            }}>
                {service.name} Verification
                <span style={{
                    position: 'absolute',
                    bottom: '-0.5rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '5rem',
                    height: '0.25rem',
                    backgroundColor: '#dbeafe',
                    borderRadius: '9999px'
                }}></span>
            </h1>

            <div style={{
                display: 'flex',
                width: '100%',
                gap: '2rem',
                justifyContent: 'center'
            }}>
                <form onSubmit={handleSubmit} style={{
                    marginTop: '1.5rem',
                    flex: '0 0 40rem',  // Fixed width for form
                    maxWidth: '40rem'
                }}>
                    {service.fields.map((field) => (
                        <div key={field.name} style={{
                            marginBottom: '1.5rem',
                            position: 'relative'
                        }}>
                            <label style={{
                                display: 'block',
                                color: '#374151',
                                fontWeight: '500',
                                marginBottom: '0.5rem',
                                transition: 'all 0.2s ease'
                            }}>
                                {field.label}
                                {field.required && <span style={{ color: '#ef4444', marginLeft: '0.25rem' }}>*</span>}
                            </label>
                            <input
                                type={field.type || "text"}
                                name={field.name}
                                required={field.required}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.5rem',
                                    padding: '0.75rem 1rem',
                                    outline: 'none',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#3b82f6';
                                    e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#d1d5db';
                                    e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                                }}
                                placeholder={`Enter ${field.label.toLowerCase()}`}
                            />
                        </div>
                    ))}

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button
                            type="submit"
                            style={{
                                width: '40%',
                                background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
                                color: 'white',
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                fontWeight: '600',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: loading ? 0.9 : 1
                            }}
                            onMouseOver={(e) => {
                                e.target.style.background = 'linear-gradient(to right, #1d4ed8, #1e40af)';
                                e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.background = 'linear-gradient(to right, #2563eb, #1d4ed8)';
                                e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                            }}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div style={{
                                        animation: 'spin 1s linear infinite',
                                        marginRight: '0.75rem',
                                        width: '1.25rem',
                                        height: '1.25rem',
                                        border: '2px solid rgba(255, 255, 255, 0.3)',
                                        borderTopColor: 'white',
                                        borderRadius: '50%'
                                    }}></div>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Submit
                                    <svg style={{ marginLeft: '0.5rem', width: '1.25rem', height: '1.25rem' }} fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {response && (
                    <div style={{
                        marginTop: '1.5rem',
                        padding: '1.5rem',
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        transition: 'all 0.3s ease',
                        transform: 'scale(1)',
                        flex: '0 0 30rem',  // Fixed width for response box
                        maxWidth: '30rem',
                        alignSelf: 'flex-start'  // Align to top of container
                    }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'scale(1.005)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '0.75rem'
                        }}>
                            <h2 style={{
                                fontSize: '1.125rem',
                                fontWeight: '600',
                                color: '#1f2937',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem', color: '#2563eb' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                Response
                            </h2>
                            <button
                                onClick={() => setResponse(null)}
                                style={{
                                    color: '#9ca3af',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'color 0.2s ease'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.color = '#4b5563';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.color = '#9ca3af';
                                }}
                            >
                                <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        <div style={{
                            overflow: 'auto',
                            maxHeight: '15rem',
                            backgroundColor: 'white',
                            padding: '1rem',
                            borderRadius: '0.25rem',
                            border: '1px solid #f3f4f6'
                        }}>
                            <pre style={{
                                whiteSpace: 'pre-wrap',
                                color: '#374151',
                                fontSize: '0.875rem',
                                margin: 0
                            }}>
                                {JSON.stringify(response.message, null, 2)}
                                {JSON.stringify(response.data, null, 2)}
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
