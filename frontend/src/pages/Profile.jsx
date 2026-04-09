import { useState, useRef, useCallback, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { User, Lock, Camera, Save, AlertCircle, CheckCircle2, X } from 'lucide-react';
import Cropper from 'react-easy-crop';
import Modal from '../components/Modal';

const BASE_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
    const { user, updateUser } = useAuth();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        nip: user?.nip || '',
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Avatar & Cropping States
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url ? `${BASE_URL}${user.avatar_url}` : null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    const [imageToCrop, setImageToCrop] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (message.text) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [message]);

    const onCropComplete = useCallback((_croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageToCrop(reader.result);
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const createObjectURL = (blob) => {
        return window.URL.createObjectURL(blob);
    };

    const getCroppedImg = async (imageSrc, pixelCrop) => {
        const image = new Image();
        image.src = imageSrc;

        return new Promise((resolve, reject) => {
            image.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = pixelCrop.width;
                canvas.height = pixelCrop.height;

                ctx.drawImage(
                    image,
                    pixelCrop.x,
                    pixelCrop.y,
                    pixelCrop.width,
                    pixelCrop.height,
                    0,
                    0,
                    pixelCrop.width,
                    pixelCrop.height
                );

                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error('Canvas is empty'));
                        return;
                    }
                    blob.name = 'avatar.jpeg';
                    resolve(blob);
                }, 'image/jpeg');
            };
            image.onerror = (e) => reject(e);
        });
    };

    const handleCropSave = async () => {
        try {
            const croppedImageBlob = await getCroppedImg(imageToCrop, croppedAreaPixels);
            setSelectedFile(croppedImageBlob);
            setAvatarPreview(createObjectURL(croppedImageBlob));
            setShowCropper(false);
        } catch (e) {
            console.error(e);
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('nip', formData.nip);
            if (selectedFile) {
                formDataToSend.append('avatar', selectedFile, 'avatar.jpg');
            }

            const response = await api.put('/auth/profile', formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            updateUser(response.data.user);
            setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.error || 'Gagal memperbarui profil' });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return setMessage({ type: 'error', text: 'Konfirmasi password baru tidak cocok' });
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await api.put('/auth/change-password', {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setShowSuccessModal(true);
            setMessage({ type: 'success', text: 'Password berhasil diubah!' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.error || 'Gagal mengubah password' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Pengaturan Profil</h1>
                <p className="text-gray-500 mt-1">Kelola informasi pribadi dan keamanan akun Anda.</p>
            </div>

            {message.text && (
                <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="text-sm font-medium">{message.text}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Photo Section */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-50 shadow-inner bg-gray-100 relative">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <User className="w-12 h-12 text-gray-300" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Camera className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        <h3 className="mt-4 font-bold text-gray-900">{user?.name}</h3>
                        <p className="text-sm text-gray-500">{user?.role}</p>
                        <p className="text-[10px] text-gray-400 mt-2 text-center uppercase tracking-widest leading-relaxed px-4">
                            Klik foto untuk mengubah foto profil
                        </p>
                    </div>
                </div>

                {/* Edit Information Section */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-6 text-primary-600">
                            <User className="w-5 h-5" />
                            <h2 className="text-lg font-bold">Informasi Pribadi</h2>
                        </div>

                        <form onSubmit={handleProfileSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 gap-5">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">NIP</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all"
                                        value={formData.nip}
                                        onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center justify-center gap-2 bg-primary-600 text-white rounded-xl px-6 py-3 font-bold text-sm shadow-lg shadow-primary-500/20 hover:bg-primary-700 active:scale-95 transition-all disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" /> Simpan Perubahan
                            </button>
                        </form>
                    </div>

                    {/* Change Password Section */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-6 text-primary-600">
                            <Lock className="w-5 h-5" />
                            <h2 className="text-lg font-bold">Ubah Password</h2>
                        </div>

                        <form onSubmit={handlePasswordSubmit} className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Password Lama</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all"
                                    value={passwordData.oldPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Password Baru</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Konfirmasi Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center justify-center gap-2 bg-gray-900 text-white rounded-xl px-6 py-3 font-bold text-sm shadow-lg shadow-gray-400/20 hover:bg-black active:scale-95 transition-all disabled:opacity-50"
                            >
                                <Lock className="w-4 h-4" /> Ubah Password
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Cropper Modal */}
            <Modal
                isOpen={showCropper}
                onClose={() => setShowCropper(false)}
                title="Sesuaikan Foto Profil"
                maxWidth="max-w-xl"
            >
                <div className="relative h-80 bg-slate-50 rounded-2xl overflow-hidden shadow-inner">
                    <Cropper
                        image={imageToCrop}
                        crop={crop}
                        zoom={zoom}
                        aspect={1 / 1}
                        cropShape="round"
                        showGrid={false}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                    />
                </div>

                <div className="space-y-6 mt-6">
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Zoom</label>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(e.target.value)}
                            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary-600"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={() => setShowCropper(false)}
                            className="flex-1 px-6 py-3 rounded-2xl border border-slate-100 font-bold text-sm text-slate-500 hover:bg-slate-50 transition-all active:scale-95"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleCropSave}
                            className="flex-1 px-6 py-3 rounded-2xl bg-primary-600 text-white font-bold text-sm shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all active:scale-95"
                        >
                            Terapkan
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Success Password Modal */}
            <Modal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                maxWidth="max-w-sm"
            >
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Password Diperbarui</h3>
                        <p className="text-sm text-gray-500 mt-1">Kata sandi Anda telah berhasil diubah secara aman.</p>
                    </div>
                    <button
                        onClick={() => setShowSuccessModal(false)}
                        className="w-full py-3 bg-primary-600 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all active:scale-95"
                    >
                        Tutup
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Profile;
