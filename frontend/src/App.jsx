import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PegawaiList from './pages/PegawaiList';
import FormPegawai from './pages/FormPegawai';
import Monitoring from './pages/Monitoring';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import UserManagement from './pages/UserManagement';
import Statistics from './pages/Statistics';
import Layout from './components/Layout';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/monitoring" replace />;
    }
    return children;
};

const AppRoutes = () => {
    const { user } = useAuth();
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            {/* Protected Routes inside Layout */}
            <Route path="/" element={
                <ProtectedRoute>
                    <Layout />
                </ProtectedRoute>
            }>
                <Route index element={
                    user?.role === 'ADMIN'
                        ? <Navigate to="/dashboard" replace />
                        : <Navigate to="/monitoring" replace />
                } />
                <Route path="dashboard" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path="pegawai" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <PegawaiList />
                    </ProtectedRoute>
                } />
                <Route path="pegawai/add" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <FormPegawai />
                    </ProtectedRoute>
                } />
                <Route path="pegawai/edit/:id" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <FormPegawai />
                    </ProtectedRoute>
                } />
                <Route path="monitoring" element={<Monitoring />} />
                <Route path="users" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <UserManagement />
                    </ProtectedRoute>
                } />
                <Route path="statistics" element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'USER']}>
                        <Statistics />
                    </ProtectedRoute>
                } />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <Settings />
                    </ProtectedRoute>
                } />
            </Route>
        </Routes>
    );
};

function App() {
    return (
        <AppRoutes />
    );
}

export default App;
