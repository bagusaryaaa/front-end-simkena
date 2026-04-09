import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Lock, User, ArrowRight } from 'lucide-react';
import logo from '../assets/Background copy.png';

const Login = () => {
    const [nip, setNip] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(nip, password);
        if (!result.success) {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 relative overflow-hidden">
            <div className="w-full max-w-[1100px] h-full min-h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 border">
                {/* Left Side: Branding & Info */}
                <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary-700 to-primary-900 p-12 text-white flex-col justify-between relative">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                    <circle cx="2" cy="2" r="1" fill="white" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#dots)" />
                        </svg>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="">
                                <img src={logo} alt="Logo" className="w-16 h-16 object-contain" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold tracking-tight leading-tight">Balai Guru dan Tenaga Kependidikan</span>
                                <span className="text-sm font-medium text-gray-300">Provinsi Nusa Tenggara Barat</span>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
                            Sistem<br />
                            <span className="text-white">Monitoring</span> <br />
                            Kenaikan Jabatan
                        </h1>
                        <p className="text-primary-100 text-lg max-w-md leading-relaxed">
                            Aplikasi monitoring kenaikan jabatan terintegrasi untuk mendukung manajemen SDM yang lebih profesional dan transparan.
                        </p>
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white">
                    <div className="max-w-md w-full mx-auto">
                        <div className="mb-10">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Selamat Datang</h2>
                            <p className="text-gray-500">Silakan masuk ke akun Anda untuk melanjutkan.</p>
                        </div>

                        <form className="space-y-6" onSubmit={handleLogin}>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <User className="w-4 h-4 text-primary-500" /> NIP
                                </label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        required
                                        placeholder="Masukkan NIP anda"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all duration-200 group-hover:border-gray-300"
                                        value={nip}
                                        onChange={(e) => setNip(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <Lock className="w-4 h-4 text-primary-500" /> Password
                                    </label>
                                    <a href="#" className="text-xs font-semibold text-primary-600 hover:text-primary-700">Lupa password?</a>
                                </div>
                                <div className="relative group">
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all duration-200 group-hover:border-gray-300"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-4 rounded-xl animate-shake">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-primary-500/20 active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:pointer-events-none group"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        Masuk Sekarang
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-12 text-center">
                            <p className="text-sm text-gray-500">
                                © 2026 Bagian Kepegawaian, Tata Laksana dan Kearsipan.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
