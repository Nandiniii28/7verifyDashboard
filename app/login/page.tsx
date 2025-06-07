'use client';
import axiosInstance from "@/components/service/axiosInstance";
import { useContext, useState } from "react";
import { MainContext } from "../context/context";
import { login } from "../redux/reducer/AdminSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const { tostymsg } = useContext(MainContext);
  const admin = useSelector(state => state.admin.token);
  const dispatch = useDispatch();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(0); // 0: login, 1: forgot, 2: otp
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [showLogin, setShowLogin] = useState(true);
  const [form, setForm] = useState({
    role: 'user',
    name: '',
    email: '',
    password: ''
  });

  const loginHandle = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/auth/login', { email, password });
      tostymsg(res.data.message, res.status);
      if (res.status === 200) {
        dispatch(login({ token: res.data.token }));
        router.push('/');
      }
    } catch (err) {
      tostymsg(err.response?.data?.message || "Login failed", 0);
    }
  };

  const RegisterHandle = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/auth/register', form);
      tostymsg(res.data.message, res.status);
      if (res.status === 201) {
        setShowLogin(true);
      }
    } catch (err) {
      tostymsg(err.response?.data?.message || "Register failed", 0);
    }
  };

  const otpSend = async () => {
    try {
      const res = await axiosInstance.post('/auth/request-reset', { email });
      tostymsg(res.data.message, res.status);
      setStep(2);
    } catch (err) {
      tostymsg(err.response?.data?.message || "OTP Send Failed", 0);
    }
  };

  const otpVerify = async () => {
    try {
      const res = await axiosInstance.post('/auth/reset-password', { email, otp, newPassword });
      tostymsg(res.data.message, res.status);
      if (res.status === 201) setStep(0);
    } catch (err) {
      tostymsg(err.response?.data?.message || "Reset Failed", 0);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Left Image */}
      <div className="w-full md:w-1/2 h-64 md:h-auto bg-cover bg-center bg-[url('/login-banner.jpg')]"></div>

      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-700">
            {showLogin ? "🔐 Login" : "📝 Register"}
          </h2>

          {/* LOGIN */}
          {showLogin && step === 0 && (
            <form onSubmit={loginHandle} className="space-y-4">
              <input type="email" placeholder="Email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field" required />
              <input type="password" placeholder="Password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field" required />

              <button type="submit" className="btn-primary">Login</button>

              <div className="text-sm flex justify-between text-gray-600">
                <span onClick={() => setStep(1)} className="cursor-pointer text-indigo-600 hover:underline">Forgot Password?</span>
                <span onClick={() => setShowLogin(false)} className="cursor-pointer text-indigo-600 hover:underline">Register</span>
              </div>
            </form>
          )}

          {/* FORGOT */}
          {showLogin && step === 1 && (
            <div className="space-y-4">
              <button onClick={() => setStep(0)} className="text-indigo-600 text-sm hover:underline">← Back to login</button>
              <input type="email" placeholder="Email" value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field" required />
              <button onClick={otpSend} className="btn-primary">Send OTP</button>
            </div>
          )}

          {/* OTP RESET */}
          {showLogin && step === 2 && (
            <div className="space-y-4">
              <input type="text" placeholder="Enter OTP" value={otp}
                onChange={e => setOtp(e.target.value)}
                className="input-field" required />
              <input type="password" placeholder="New Password" value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="input-field" required />
              <button onClick={otpVerify} className="btn-primary bg-green-600 hover:bg-green-700">Reset Password</button>
            </div>
          )}

          {/* REGISTER */}
          {!showLogin && (
            <form onSubmit={RegisterHandle} className="space-y-4">
              <select name="role" value={form.role} onChange={handleChange} className="input-field">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <input type="text" name="name" placeholder="Full Name"
                value={form.name} onChange={handleChange}
                className="input-field" required />
              <input type="email" name="email" placeholder="Email"
                value={form.email} onChange={handleChange}
                className="input-field" required />
              <input type="password" name="password" placeholder="Password"
                value={form.password} onChange={handleChange}
                className="input-field" required />
              <button type="submit" className="btn-primary">Register</button>
              <p className="text-sm text-center text-gray-600">
                Already have an account? <span onClick={() => setShowLogin(true)} className="cursor-pointer text-indigo-600 hover:underline">Login</span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
