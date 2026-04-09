import { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import api from '../utils/api';
import { Save, Upload, Info } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_URL;

const Settings = () => {
    const { settings, fetchSettings, updateSettingsState } = useSettings();
    const [formData, setFormData] = useState({
        site_name: '',
        org_name_1: '',
        org_name_2: ''
    });
    const [logoFile, setLogoFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (settings) {
            setFormData({
                site_name: settings.site_name || '',
                org_name_1: settings.org_name_1 || '',
                org_name_2: settings.org_name_2 || ''
            });
            setPreviewUrl(settings.logo_url ? `${BASE_URL}${settings.logo_url}` : '');
        }
    }, [settings]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        const data = new FormData();
        data.append('site_name', formData.site_name);
        data.append('org_name_1', formData.org_name_1);
        data.append('org_name_2', formData.org_name_2);
        if (logoFile) {
            data.append('logo', logoFile);
        }

        try {
            await api.put('/settings', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage({ type: 'success', text: 'Pengaturan berhasil diperbarui!' });
            await fetchSettings();
        } catch (error) {
            setMessage({ type: 'error', text: 'Gagal memperbarui pengaturan.' });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Pengaturan Website</h1>
                    <p className="text-sm text-gray-500 mt-1">Sesuaikan identitas website Anda di sini.</p>
                </div>
            </div>

            {message.text && (
                <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    <Info className="w-5 h-5" />
                    <p className="text-sm font-medium">{message.text}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white shadow rounded-xl border border-gray-100 overflow-hidden">
                <div className="p-6 space-y-8">
                    {/* Appearance Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Logo dan Nama Website</h3>
                            <p className="text-sm text-gray-500 mt-1">Ubah logo dan nama website yang muncul di navbar.</p>
                        </div>
                        <div className="md:col-span-2 space-y-6">
                            {/* Logo Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Logo Website</label>
                                <div className="flex items-start gap-6">
                                    <div className="w-24 h-24 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                        ) : (
                                            <Upload className="w-8 h-8 text-gray-300" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            id="logo-upload"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                        <label
                                            htmlFor="logo-upload"
                                            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-all duration-200"
                                        >
                                            <Upload className="w-4 h-4 mr-2" />
                                            Pilih Berkas Logo
                                        </label>
                                        <p className="text-[11px] text-gray-400 mt-2">Format yang didukung: PNG, JPG, SVG. Maks 2MB.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Site Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Website</label>
                                <input
                                    type="text"
                                    name="site_name"
                                    value={formData.site_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                    placeholder="Contoh: SIMKENA"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Organization Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Informasi Tambahan</h3>
                            <p className="text-sm text-gray-500 mt-1">Teks yang muncul di bawah logo dan nama website.</p>
                        </div>
                        <div className="md:col-span-2 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Baris Teks 1</label>
                                <input
                                    type="text"
                                    name="org_name_1"
                                    value={formData.org_name_1}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                    placeholder="Contoh: Balai Guru dan Tenaga Kependidikan"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Baris Teks 2</label>
                                <input
                                    type="text"
                                    name="org_name_2"
                                    value={formData.org_name_2}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                    placeholder="Contoh: Provinsi Nusa Tenggara Barat"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center px-6 py-2 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-all duration-200 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Settings;
