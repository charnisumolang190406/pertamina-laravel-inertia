import React from 'react';
import { useForm, Head } from '@inertiajs/react';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
    });

    const [showPassword, setShowPassword] = React.useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative font-sans bg-slate-100">
            <Head title="Sign In - Pertamina Geothermal Energy" />

            {/* Background Image - Geothermal/Nature Theme */}
            <div 
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ 
                    backgroundImage: "url('/bg-lahendong.jpg')", 
                }}
            >
                {/* Efek lapisan tipis putih agar sedikit lebih transparan tanpa blur */}
                <div className="absolute inset-0 bg-white/30" />
            </div>

            {/* Login Card */}
            <div className="w-full max-w-[420px] p-8 sm:p-10 bg-white rounded-2xl shadow-2xl z-10">
                {/* Brand Header */}
                <div className="text-center mb-8 flex flex-col items-center">
                    <div className="inline-flex mb-4">
                        <img 
                            src="/logo-pertamina.jpg" 
                            alt="Pertamina Geothermal Energy" 
                            className="h-12 sm:h-14 w-auto object-contain" 
                        />
                    </div>

                    {/* Badge / Judul Aplikasi */}
                    <span className="inline-block px-3.5 py-1.5 mb-4 rounded-full text-[11px] font-extrabold tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase shadow-sm">
                        Portal MAPALUS
                    </span>
                    
                    <h2 className="text-xl sm:text-[22px] font-bold text-slate-800 tracking-tight">Selamat Datang! 👋</h2>
                    <p className="text-[12px] text-slate-500 mt-1 font-medium px-2">Management and Performance Analytic for Lahendong</p>
                    <div className="w-12 h-0.5 bg-slate-200 my-4"></div>
                    <p className="text-[12px] text-slate-500">Silakan masuk menggunakan kredensial IT Anda</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Username Input */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2" htmlFor="username">
                            Username / Email IT
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                <Mail className="w-4.5 h-4.5" />
                            </span>
                            <input
                                id="username"
                                type="text"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                                placeholder="name@lahendong.local"
                                required
                            />
                        </div>
                        {errors.username && (
                            <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.username}</p>
                        )}
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2" htmlFor="password">
                            Password
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                <Lock className="w-4.5 h-4.5" />
                            </span>
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                                placeholder="••••••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.password}</p>
                        )}
                    </div>

                    {errors.email && !errors.username && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2.5 font-medium mt-2">
                            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                            <span>{errors.email}</span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[13px] font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer mt-6 disabled:opacity-70 flex items-center justify-center gap-2 uppercase tracking-wider"
                    >
                        {processing ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Memverifikasi...</span>
                            </>
                        ) : (
                            'Masuk Dashboard'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
