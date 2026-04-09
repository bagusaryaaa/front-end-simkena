import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../utils/api';
import ConfirmModal from '../components/ConfirmModal';

const PegawaiList = () => {
    const [pegawai, setPegawai] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [filterJenis, setFilterJenis] = useState('');

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [pegawaiToDelete, setPegawaiToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetchPegawai();
    }, []);

    const fetchPegawai = async () => {
        try {
            const res = await api.get('/pegawai');
            setPegawai(res.data);
        } catch (err) {
            setError('Gagal mengambil data pegawai');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id, name) => {
        setPegawaiToDelete({ id, name });
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!pegawaiToDelete) return;

        setDeleteLoading(true);
        try {
            await api.delete(`/pegawai/${pegawaiToDelete.id}`);
            setIsDeleteModalOpen(false);
            setPegawaiToDelete(null);
            fetchPegawai(); // Refresh list
        } catch (err) {
            alert('Gagal menghapus data: ' + (err.response?.data?.error || err.message));
        } finally {
            setDeleteLoading(false);
        }
    };

    const filteredPegawai = pegawai.filter(p => {
        const matchesSearch = (p.nama?.toLowerCase().includes(search.toLowerCase()) || p.nip?.includes(search));
        const matchesJenis = filterJenis === '' || p.jenis_pegawai === filterJenis;

        return matchesSearch && matchesJenis;
    });

    const handleClearFilters = () => {
        setSearch('');
        setFilterJenis('');
    };

    const formatGolongan = (pangkatGolongan, jenisPegawai) => {
        if (!pangkatGolongan) return '-';

        const isPPPK = jenisPegawai && jenisPegawai.trim().toUpperCase() === 'PPPK';
        if (!isPPPK) return pangkatGolongan;

        const romanNumerals = [
            'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
            'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII'
        ];

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
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">Data Pegawai ASN</h1>
                <Link to="/pegawai/add" className="btn-primary flex items-center shadow-sm">
                    <Plus className="w-5 h-5 mr-2" />
                    Tambah Pegawai
                </Link>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>}

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Cari NIP atau Nama..."
                            className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 tracking-wider">Filter:</span>
                        <select
                            className="block w-48 pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer"
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
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIP</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jabatan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Golongan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TMT PNS</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Kerja</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">Memuat data...</td>
                                </tr>
                            ) : filteredPegawai.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">Data pegawai tidak ditemukan</td>
                                </tr>
                            ) : (
                                filteredPegawai.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-gray-900">{p.nip}</span>
                                                <span className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">
                                                    {p.jenis_pegawai || 'PNS'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.nama}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.jabatan_sekarang}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatGolongan(p.pangkat_golongan, p.jenis_pegawai)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {p.tmt_pns ? new Date(p.tmt_pns).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.unit_kerja}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                to={`/pegawai/edit/${p.id}`}
                                                className="text-primary-600 hover:text-primary-900 mr-4 transition-colors inline-block"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteClick(p.id, p.nama)}
                                                className="text-red-600 hover:text-red-900 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                                title="Hapus"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Hapus Data Pegawai?"
                message={`Apakah Anda yakin ingin menghapus data pegawai "${pegawaiToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
                confirmText="Ya, Hapus"
                loading={deleteLoading}
            />
        </div>
    );
};

export default PegawaiList;
