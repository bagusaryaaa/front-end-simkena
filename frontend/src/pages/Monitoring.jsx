import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Search } from 'lucide-react';

const Monitoring = () => {
    const [monitoringData, setMonitoringData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [filterJenis, setFilterJenis] = useState('');

    useEffect(() => {
        const fetchMonitoring = async () => {
            try {
                const res = await api.get('/monitoring');
                setMonitoringData(res.data);
            } catch (err) {
                setError('Gagal mengambil data monitoring kelayakan');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMonitoring();
    }, []);

    const filteredData = monitoringData.filter(d => {
        const matchesSearch = d.pegawai.nama.toLowerCase().includes(search.toLowerCase()) ||
            d.pegawai.nip.includes(search);
        const matchesJenis = filterJenis === '' || d.pegawai.jenis_pegawai === filterJenis;
        return matchesSearch && matchesJenis;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'LAYAK':
                return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">LAYAK</span>;
            case 'AKAN LAYAK':
                return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">AKAN LAYAK</span>;
            default:
                return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-200">BELUM LAYAK</span>;
        }
    };

    const getIndicator = (status) => {
        return status === 'Memenuhi'
            ? <span className="text-green-600 font-medium whitespace-nowrap">✓ Memenuhi</span>
            : <span className="text-red-600 font-medium whitespace-nowrap">✗ Tidak</span>;
    }

    const formatGolongan = (pangkatGolongan, jenisPegawai) => {
        if (!pangkatGolongan) return '-';

        // Use loose check for PPPK (case-insensitive and trimmed)
        const isPPPK = jenisPegawai && jenisPegawai.trim().toUpperCase() === 'PPPK';
        if (!isPPPK) return pangkatGolongan;

        const romanNumerals = [
            'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
            'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII'
        ];

        // Extract number from "Golongan X" or just "X"
        const match = pangkatGolongan.match(/\d+/);
        if (match) {
            const num = parseInt(match[0], 10);
            if (num >= 1 && num <= romanNumerals.length) {
                return `Golongan ${romanNumerals[num - 1]}`;
            }
        }
        return pangkatGolongan;
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Monitoring Kelayakan Kenaikan Jabatan</h1>

            {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>}

            <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center">
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                        <div className="relative w-full max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Cari berdasarkan nama atau nip..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="w-full md:w-auto flex items-center gap-3">
                            <span className="text-sm text-gray-500 tracking-wider whitespace-nowrap">Filter:</span>
                            <select
                                className="block w-full md:w-48 pl-3 pr-10 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all appearance-none cursor-pointer"
                                value={filterJenis}
                                onChange={(e) => setFilterJenis(e.target.value)}
                                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                            >
                                <option value="">Semua Jenis</option>
                                <option value="PNS">PNS</option>
                                <option value="PPPK">PPPK</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pegawai</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKP (2th)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diklat (20JP)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disiplin</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estimasi Waktu</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Final</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">Memuat data monitoring...</td>
                                </tr>
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">Data tidak ditemukan</td>
                                </tr>
                            ) : (
                                filteredData.map((data, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <div className="text-sm font-medium text-gray-900">{data.pegawai.nama}</div>
                                                <div className="text-xs text-gray-500 font-mono mt-1">{data.pegawai.nip}</div>
                                                <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">
                                                    {data.pegawai.jenis_pegawai}
                                                </div>
                                                <div className="text-xs text-gray-400 mt-1">{data.pegawai.jabatan_sekarang}</div>
                                                <div className="text-[12px] text-gray-600 font-semibold mt-0.5">
                                                    {formatGolongan(data.pegawai.pangkat_golongan, data.pegawai.jenis_pegawai)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm bg-gray-50">{getIndicator(data.status_skp)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{getIndicator(data.status_diklat)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm bg-gray-50">{getIndicator(data.status_disiplin)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {data.tanggal_layak_final
                                                ? new Date(data.tanggal_layak_final).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })
                                                : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(data.status_kelayakan)}
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

export default Monitoring;
