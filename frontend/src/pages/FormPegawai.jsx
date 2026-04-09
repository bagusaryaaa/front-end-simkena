import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';

const FormPegawai = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        nip: '',
        nama: '',
        tanggal_lahir: '',
        unit_kerja: '',
        jabatan_sekarang: '',
        pangkat_golongan: '',
        tmt_pns: '',
        jenis_pegawai: 'PNS'
    });

    useEffect(() => {
        if (isEdit) {
            fetchPegawaiData();
        }
    }, [id]);

    const fetchPegawaiData = async () => {
        try {
            const res = await api.get(`/pegawai/${id}`);
            const data = res.data;

            // Format dates (YYYY-MM-DD) for input[type="date"]
            const formatDate = (dateStr) => {
                if (!dateStr) return '';
                return new Date(dateStr).toISOString().split('T')[0];
            };

            setFormData({
                nip: data.nip || '',
                nama: data.nama || '',
                tanggal_lahir: formatDate(data.tanggal_lahir),
                unit_kerja: data.unit_kerja || '',
                jabatan_sekarang: data.jabatan_sekarang || '',
                pangkat_golongan: data.pangkat_golongan || '',
                tmt_pns: formatDate(data.tmt_pns),
                jenis_pegawai: data.jenis_pegawai || 'PNS'
            });
        } catch (err) {
            setError('Gagal mengambil data pegawai');
            console.error(err);
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEdit) {
                await api.put(`/pegawai/${id}`, formData);
            } else {
                await api.post('/pegawai', formData);
            }
            navigate('/pegawai');
        } catch (err) {
            setError(err.response?.data?.error || 'Gagal menyimpan data pegawai');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900">
                {isEdit ? 'Edit Data Pegawai' : 'Tambah Pegawai Baru'}
            </h1>

            <div className="bg-white shadow rounded-lg px-6 py-8">
                {error && <div className="mb-4 bg-red-50 text-red-600 p-3 rounded">{error}</div>}

                {fetching ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                        <p className="text-gray-500 font-medium">Memuat data pegawai...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">NIP</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field mt-1"
                                    value={formData.nip}
                                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field mt-1"
                                    value={formData.nama}
                                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
                                <input
                                    type="date"
                                    required
                                    className="input-field mt-1"
                                    value={formData.tanggal_lahir}
                                    onChange={(e) => setFormData({ ...formData, tanggal_lahir: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Unit Kerja</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field mt-1"
                                    value={formData.unit_kerja}
                                    onChange={(e) => setFormData({ ...formData, unit_kerja: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Jabatan Sekarang</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field mt-1"
                                    value={formData.jabatan_sekarang}
                                    onChange={(e) => setFormData({ ...formData, jabatan_sekarang: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Jenis Pegawai</label>
                                <select
                                    required
                                    className="input-field mt-1"
                                    value={formData.jenis_pegawai}
                                    onChange={(e) => setFormData({ ...formData, jenis_pegawai: e.target.value, pangkat_golongan: '' })}
                                >
                                    <option value="PNS">PNS</option>
                                    <option value="PPPK">PPPK</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Pangkat / Golongan</label>
                                <select
                                    required
                                    className="input-field mt-1"
                                    value={formData.pangkat_golongan}
                                    onChange={(e) => setFormData({ ...formData, pangkat_golongan: e.target.value })}
                                >
                                    <option value="">Pilih Golongan</option>
                                    {formData.jenis_pegawai === 'PNS' ? (
                                        <>
                                            <option value="Penata Muda / IIIa">Penata Muda / IIIa</option>
                                            <option value="Penata Muda Tk.I / IIIb">Penata Muda Tk.I / IIIb</option>
                                            <option value="Penata / IIIc">Penata / IIIc</option>
                                            <option value="Penata Tk.I / IIId">Penata Tk.I / IIId</option>
                                            <option value="Pembina / IVa">Pembina / IVa</option>
                                            <option value="Pembina Tk.I / IVb">Pembina Tk.I / IVb</option>
                                            <option value="Pembina Utama Muda / IVc">Pembina Utama Muda / IVc</option>
                                            <option value="Pembina Utama Madya / IVd">Pembina Utama Madya / IVd</option>
                                            <option value="Pembina Utama / IVe">Pembina Utama / IVe</option>
                                        </>
                                    ) : (
                                        <>
                                            {[...Array(17)].map((_, i) => (
                                                <option key={i + 1} value={`Golongan ${i + 1}`}>Golongan {i + 1}</option>
                                            ))}
                                        </>
                                    )}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    {formData.jenis_pegawai === 'PNS' ? 'TMT PNS' : 'TMT PPPK'}
                                </label>
                                <input
                                    type="date"
                                    required
                                    className="input-field mt-1"
                                    value={formData.tmt_pns}
                                    onChange={(e) => setFormData({ ...formData, tmt_pns: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => navigate('/pegawai')}
                                className="py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default FormPegawai;
