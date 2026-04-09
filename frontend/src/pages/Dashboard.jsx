import { useState, useEffect } from 'react';
import { Users, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import api from '../utils/api';

const Dashboard = () => {
    const [data, setData] = useState({ stats: null, recent: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get('/dashboard');
                setData(res.data);
            } catch (err) {
                setError('Failed to fetch dashboard data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return <div className="p-6">Loading dashboard data...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;

    const stats = [
        { name: 'Total Pegawai', value: data.stats.total || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
        { name: 'Layak Naik Jabatan', value: data.stats.layak || 0, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
        { name: 'Akan Layak (<6 bln)', value: data.stats.akan_layak || 0, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
        { name: 'Belum Layak', value: data.stats.belum_layak || 0, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
    ];

    const getStatusBadge = (status) => {
        switch (status) {
            case 'LAYAK':
                return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">LAYAK</span>;
            case 'AKAN LAYAK':
                return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">AKAN LAYAK</span>;
            default:
                return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">BELUM LAYAK</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((item) => (
                    <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className={`flex-shrink-0 rounded-md p-3 ${item.bg}`}>
                                    <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                                        <dd className="text-2xl font-semibold text-gray-900">{item.value}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Eligible Section */}
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Mendekati Kenaikan Jabatan</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIP</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jabatan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Layak</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.recent.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Tidak ada data</td>
                                </tr>
                            ) : (
                                data.recent.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.pegawai.nama}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.pegawai.nip}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.pegawai.jabatan_sekarang}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(item.tanggal_layak_final).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(item.status_kelayakan)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
