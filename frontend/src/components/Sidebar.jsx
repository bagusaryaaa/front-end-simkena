import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Activity, ShieldCheck, BarChart3, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
    const { user } = useAuth();
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, role: 'ADMIN' },
        { name: 'Data Pegawai', path: '/pegawai', icon: Users, role: 'ADMIN' },
        { name: 'Monitoring Jabatan', path: '/monitoring', icon: Activity },
        { name: 'Statistik', path: '/statistics', icon: BarChart3 },
        { name: 'Manajemen User', path: '/users', icon: ShieldCheck, role: 'ADMIN' },
        { name: 'Pengaturan', path: '/settings', icon: Settings, role: 'ADMIN' },

    ];

    const filteredNavItems = navItems.filter(item => !item.role || item.role === user?.role);


    return (
        <div className="w-64 bg-white shadow-xl flex flex-col border-r border-gray-100">
            <div>
                <nav className="p-4 space-y-1">
                    {filteredNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname.startsWith(item.path);

                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${isActive
                                    ? 'bg-primary-50 text-primary-700 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
