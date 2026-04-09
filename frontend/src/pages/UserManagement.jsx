import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { UserPlus, Search, User, ShieldCheck, Loader2, AlertCircle, X, Trash2, Mail } from 'lucide-react';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        nip: '',
        role: 'USER'
    });
    const [successMessage, setSuccessMessage] = useState('');

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
            setLoading(false);
        } catch (err) {
            setError('Gagal mengambil data user.');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEditInputChange = (e) => {
        setSelectedUser({ ...selectedUser, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        setError(null);
        setSuccessMessage('');

        try {
            const response = await api.post('/users', formData);

            setSuccessMessage(response.data.message);
            setIsModalOpen(false);
            setFormData({ name: '', nip: '', role: 'USER' });
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.error || 'Gagal membuat user.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        setError(null);
        setSuccessMessage('');

        try {
            const response = await api.put(`/users/${selectedUser.id}`, {
                name: selectedUser.name,
                role: selectedUser.role
            });

            setSuccessMessage(response.data.message);
            setIsEditModalOpen(false);
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.error || 'Gagal memperbarui user.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDeleteClick = (id, name) => {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (id === currentUser?.id) {
            setError('Anda tidak dapat menghapus akun Anda sendiri.');
            return;
        }
        setUserToDelete({ id, name });
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;

        setSubmitLoading(true);
        try {
            await api.delete(`/users/${userToDelete.id}`);
            setSuccessMessage(`User "${userToDelete.name}" berhasil dihapus.`);
            setUserToDelete(null);
            setIsDeleteModalOpen(false);
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.error || 'Gagal menghapus user.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.nip.includes(searchTerm)
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Manajemen User</h1>
                    <p className="text-gray-500 mt-1">Kelola akun akses sistem monitoring pegawai</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-sm"
                >
                    <UserPlus className="w-5 h-5" />
                    Tambah User
                </button>
            </div>

            {successMessage && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                        <ShieldCheck className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-green-700">{successMessage}</span>
                    </div>
                    <button onClick={() => setSuccessMessage('')} className="text-green-500 hover:text-green-700">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                        <span className="text-red-700">{error}</span>
                    </div>
                    <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Cari nama atau NIP..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">NIP</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                                                <User className="w-6 h-6" />
                                            </div>
                                            <span className="font-medium text-gray-900">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 font-mono text-sm">{user.nip}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${user.role === 'ADMIN'
                                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                                            : 'bg-blue-50 text-blue-700 border-blue-200'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => openEditModal(user)}
                                                className="text-sm font-medium text-primary-600 hover:text-primary-700 p-2 hover:bg-primary-50 rounded-lg transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(user.id, user.name)}
                                                className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                                title="Hapus User"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredUsers.length === 0 && (
                        <div className="p-12 text-center">
                            <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">Tidak ada user ditemukan.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Reusable Modal for Add/Edit User */}
            <Modal
                isOpen={isModalOpen || isEditModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setIsEditModalOpen(false);
                    setSelectedUser(null);
                    setFormData({ name: '', nip: '', role: 'USER' });
                }}
                title={isEditModalOpen ? "Edit Informasi User" : "Tambah User Baru"}
            >
                <form onSubmit={isEditModalOpen ? handleUpdate : handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Lengkap</label>
                        <div className="relative">
                            <span className="absolute left-4 top-3.5 text-slate-400">
                                <User className="w-4 h-4" />
                            </span>
                            <input
                                type="text"
                                name="name"
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all text-sm"
                                placeholder="Masukkan nama lengkap..."
                                value={isEditModalOpen ? selectedUser?.name : formData.name}
                                onChange={isEditModalOpen ? handleEditInputChange : handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">NIP</label>
                        <div className="relative">
                            <span className="absolute left-4 top-3.5 text-slate-400">
                                <Mail className="w-4 h-4" />
                            </span>
                            <input
                                type="text"
                                name="nip"
                                className={`w-full pl-11 pr-4 py-3 border rounded-2xl outline-none transition-all text-sm ${isEditModalOpen
                                    ? 'bg-slate-100 border-slate-100 text-slate-500 cursor-not-allowed'
                                    : 'bg-slate-50 border-slate-100 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5'
                                    }`}
                                placeholder="Masukkan NIP..."
                                value={isEditModalOpen ? selectedUser?.nip : formData.nip}
                                onChange={handleInputChange}
                                readOnly={isEditModalOpen}
                                required
                            />
                        </div>
                        {!isEditModalOpen && <p className="text-[10px] text-slate-400 ml-1 italic mt-1">*Password default adalah NIP</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Role Akun</label>
                        <div className="relative">
                            <span className="absolute left-4 top-3.5 text-slate-400">
                                <ShieldCheck className="w-4 h-4" />
                            </span>
                            <select
                                name="role"
                                className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all text-sm appearance-none"
                                value={isEditModalOpen ? selectedUser?.role : formData.role}
                                onChange={isEditModalOpen ? handleEditInputChange : handleInputChange}
                            >
                                <option value="USER">USER</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                            <div className="absolute right-4 top-3.5 pointer-events-none text-slate-400">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setIsModalOpen(false);
                                setIsEditModalOpen(false);
                                setSelectedUser(null);
                                setFormData({ name: '', nip: '', role: 'USER' });
                            }}
                            className="flex-1 py-3 px-4 rounded-2xl border border-slate-100 font-bold text-sm text-slate-500 hover:bg-slate-50 transition-all active:scale-95"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={submitLoading}
                            className="flex-1 py-3 px-4 rounded-2xl bg-primary-600 text-white font-bold text-sm shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {submitLoading ? 'Menyimpan...' : (isEditModalOpen ? 'Update User' : 'Tambah User')}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Hapus User?"
                message={`Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin ingin menghapus user "${userToDelete?.name}"?`}
                confirmText="Hapus Sekarang"
                loading={submitLoading}
            />
        </div>
    );
};

export default UserManagement;
