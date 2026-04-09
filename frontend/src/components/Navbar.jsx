import { Bell, UserCircle, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';

const BASE_URL = import.meta.env.VITE_API_URL;

const Navbar = () => {
    const { user, logout } = useAuth();
    const { settings } = useSettings();

    const logoSrc = settings.logo_url?.startsWith('/uploads/')
        ? `${BASE_URL}${settings.logo_url}`
        : settings.logo_url;

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                    <img src={logoSrc} alt="Logo" className="w-12 h-12 object-contain" />
                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold text-primary-600 tracking-tight leading-none">
                            {settings.site_name}
                        </h1>
                        <p className="text-[10px] text-gray-500 mt-1 font-medium uppercase tracking-wider leading-tight">
                            {settings.org_name_1}
                        </p>
                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider leading-tight">
                            {settings.org_name_2}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-6">
                    <Link to="/profile" className="flex items-center border-l border-gray-200 pl-4 hover:bg-gray-50 p-1 rounded-lg transition-colors duration-200">
                        {user?.avatar_url ? (
                            <img
                                src={`${BASE_URL}${user.avatar_url}`}
                                alt="Profile"
                                className="w-10 h-10 rounded-full object-cover border border-gray-200"
                            />
                        ) : (
                            <UserCircle className="w-8 h-8 text-gray-400" />
                        )}
                        <div className="ml-3 text-left">
                            <p className="text-sm font-medium text-gray-700">{user?.name || 'User'}</p>
                            <p className="text-xs text-gray-500 uppercase">{user?.role || 'ASN'}</p>
                        </div>
                    </Link>

                    <button
                        onClick={logout}
                        className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 border-l border-gray-200 ml-2"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm font-bold">Logout</span>
                    </button>
                </div>
            </div>

        </header>
    );
};

export default Navbar;
