'use client'
import axiosInstance from "@/components/service/axiosInstance";
import { useContext, useEffect, useState } from "react";
import { MainContext } from "../context/context";

import { login } from "../redux/reducer/AdminSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";




function Login() {
    const { tostymsg } = useContext(MainContext);
    const admin = useSelector(state => state.admin.token);
    const dispatch = useDispatch();
    const router = useRouter()
    const [showLogin, setShowLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [step, setStep] = useState(0);
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState();
    const [form, setForm] = useState({
        role: 'user',
        name: '',
        email: '',
        password: ''
    });

    //  login part
    const loginHandle = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/auth/login', { email, password })

            tostymsg(response.data.message, response.status)
            if (response.status == 200) {
                dispatch(login({
                    token: response.data.token
                }))
                router.push('/')
            }
        } catch (error) {
            console.log(error);
            tostymsg(error.response.data.message, 0)
        }

    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

    };

    // Register part
    const RegisterHandle = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/auth/register', form)
            tostymsg(response.data.message, response.status)
            if (response.status == 201) {
                setShowLogin(false)
            }
        } catch (error) {
            tostymsg(error.response.data.message, 0)
        }

    };


    // otpSend part
    const otpSend = async () => {
        try {
            const response = await axiosInstance.post('/auth/request-reset', { email })
            tostymsg(response.data.message, response.status)
            setStep(2)
        } catch (error) {
            tostymsg(error.response.data.message, 0)
        }

    };

    // otpVerify part
    const otpVerify = async () => {
        try {
            const response = await axiosInstance.post('/auth/reset-password', { email, otp, newPassword })
            tostymsg(response.data.message, response.status)
            if (response.status == 201) {
                setStep(0)
            }
        } catch (error) {
            tostymsg(error.response.data.message, 0)
        }

    };
    // useEffect(
    //     () => {
    //         if (admin) {
    //             router.push('/')
    //         } 
    //     }, [admin]
    // )
    return (
        <>
            {
                showLogin ?
                    <div className="flex justify-center items-center min-h-screen">
                        <div className="bg-white shadow-md rounded-lg p-8 w-96">
                            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">🔐 Forgot Password</h2>

                            {step === 1 && (
                                <div className="space-y-5">
                                    <span className="text-blue-600 hover:underline cursor-pointer">← Back</span>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="you@example.com"
                                            required
                                        />
                                    </div>
                                    <button
                                        onClick={otpSend}
                                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                                    >
                                        Send OTP
                                    </button>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-5">
                                    <div>
                                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700">Enter OTP</label>
                                        <input
                                            type="text"
                                            id="otp"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter the OTP"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                                        <input
                                            type="password"
                                            id="newPassword"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="New password"
                                            required
                                        />
                                    </div>
                                    <button
                                        onClick={otpVerify}
                                        className="w-full bg-green-600 text-white  py-2 rounded-lg hover:bg-green-700 transition duration-300"
                                    >
                                        Reset Password
                                    </button>
                                </div>
                            )}

                            {
                                step === 0 && (

                                    <>
                                        <form onSubmit={loginHandle} className="space-y-5">
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="you@example.com"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                                <input
                                                    type="password"
                                                    id="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="••••••••"
                                                    required
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                                            >
                                                Login
                                            </button>
                                        </form>

                                        <p className="text-sm text-center text-gray-500 mt-4">
                                            <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => setStep(1)}>Forget Password</span>
                                        </p>
                                        <p className="text-sm text-center text-gray-500 mt-4">
                                            Don’t have an account? <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => setShowLogin(false)}>Register</span>
                                        </p></>
                                )
                            }


                        </div >
                    </div >
                    :
                    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                        <div className="bg-white rounded-xl shadow-md p-8">
                            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">📝 Register</h2>

                            <form className="space-y-5" onSubmit={RegisterHandle}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Role</label>
                                    <select
                                        name="role"
                                        value={form.role}
                                        onChange={handleChange}
                                        className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-blue-500 focus:outline-none"
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-blue-500 focus:outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-blue-500 focus:outline-none"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-blue-500 focus:outline-none"
                                        placeholder="********"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                                >
                                    Register
                                </button>
                            </form>

                            <p className="text-sm text-center text-gray-500 mt-4">
                                Already have an account? <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => setShowLogin(true)}>Login</span>
                            </p>
                        </div>
                    </div>
            }
        </>
    )
}

export default Login
