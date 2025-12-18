import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ChevronRight, Shield, BookOpen, Eye, EyeOff } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useApi } from '../../../utils/api';

const RoleCard = ({ role, selected, onClick, icon: Icon, label }) => (
    <button
        onClick={() => onClick(role)}
        className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-3 ${selected
            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md shadow-indigo-100'
            : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200 hover:bg-slate-50'
            }`}
    >
        <div className={`p-3 rounded-full ${selected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
            <Icon size={24} />
        </div>
        <span className="font-bold text-sm uppercase tracking-wide">{label}</span>
    </button>
);

const Login = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('admin');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '' });
    // const [loading, setLoading] = useState(false);

    const api = useApi();

    const { mutate, isSuccess, isPending, data: apiData, isError, error } = useMutation({
        mutationFn: (formData) => api.post('/auth/login', formData),
    });

    const handleLogin = (e) => {
        e.preventDefault();
        mutate({ ...formData, role });
    };

    useEffect(() => {
        if (isSuccess && apiData) {
            const { data } = apiData;
            console.log(data);
            if (data.role === 'TEACHER' || data.role === 'ADMIN') {
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userRole', data.role);
                return navigate('/');
            } else {
                alert('Unauthorized role for admin portal.');
            }
        }
    }, [isSuccess, apiData, navigate]);

    useEffect(() => {
        if (isError && error) {
            alert(error.response?.data?.message || 'Login failed. Please try again.');
        }
    }, [isError, error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">

            {/* Main Card Container */}
            <div className="bg-white w-full max-w-5xl h-[600px] rounded-[32px] shadow-2xl overflow-hidden flex flex-row">

                {/* Left Side: Visual Branding (Hidden on mobile) */}
                <div className="hidden lg:flex w-1/2 bg-indigo-600 relative items-center justify-center p-12 overflow-hidden">
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-2xl -ml-10" />

                    <div className="relative z-10 text-center text-white">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/30 shadow-xl">
                            <span className="text-4xl font-black">E</span>
                        </div>
                        <h1 className="text-4xl font-black mb-4">EduMaster Portal</h1>
                        <p className="text-indigo-100 text-lg leading-relaxed max-w-sm mx-auto">
                            Manage students, track attendance, and grade exams with a powerful, centralized dashboard.
                        </p>
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">

                    <div className="max-w-md mx-auto w-full">
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-slate-900 mb-2">Welcome Back!</h2>
                            <p className="text-slate-500 text-sm">Please select your role to continue.</p>
                        </div>

                        {/* Role Switcher */}
                        <div className="flex gap-4 mb-8">
                            <RoleCard
                                role="admin"
                                label="Administrator"
                                icon={Shield}
                                selected={role === 'admin'}
                                onClick={setRole}
                            />
                            <RoleCard
                                role="teacher"
                                label="Teacher"
                                icon={BookOpen}
                                selected={role === 'teacher'}
                                onClick={setRole}
                            />
                        </div>

                        {/* Form */}
                        <form onSubmit={handleLogin} className="space-y-5">

                            {/* username Input */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">username Address</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                                    <input
                                        type="text"
                                        required
                                        placeholder={role === 'admin' ? "admin@college.edu" : "teacher@college.edu"}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        placeholder="••••••••"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-12 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <div className="flex justify-end">
                                    <button type="button" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Forgot Password?</button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center space-x-2"
                            >
                                {isPending ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Sign In as {role === 'admin' ? 'Admin' : 'Teacher'}</span>
                                        <ChevronRight size={20} />
                                    </>
                                )}
                            </button>

                        </form>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-slate-400 text-xs">
                            By signing in, you agree to our <span className="font-bold text-slate-600 cursor-pointer hover:underline">Terms</span> & <span className="font-bold text-slate-600 cursor-pointer hover:underline">Privacy Policy</span>.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;
