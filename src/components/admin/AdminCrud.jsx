import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import adminApi from "../../config/adminApi";
import CrudTemplate from "../CrudTemplate";
import RegisterForm from './RegisterForm';

const AdminCrud = () => {
    const { isDark } = useTheme();
    const [showModal, setShowModal] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <>
            <CrudTemplate
                key={refreshKey}
                api={adminApi}
                title="Data Admin"
                subtitle="Kelola akun admin perusahaan"
                isDarkMode={isDark}
                searchKeys={['username', 'email', 'role']}
                canCreate={false}
                canEdit={false}
                canDelete={true}
                columns={[
                    { key: 'username', label: 'Username', sortable: true },
                    { key: 'email', label: 'Email', sortable: true },
                    {
                        key: 'role',
                        label: 'Role',
                        render: (row) => (
                            <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                                row.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                                {row.role === 'SUPER_ADMIN' ? 'Super Admin' : 'HR Admin'}
                            </span>
                        )
                    },
                    { key: 'createdAt', label: 'Dibuat', render: (row) => new Date(row.createdAt).toLocaleDateString('id-ID') },
                ]}
                formFields={[]}
                detailConfig={{
                    showAvatar: false,
                    fields: [
                        { key: 'username', label: 'Username' },
                        { key: 'email', label: 'Email' },
                        { key: 'role', label: 'Role' },
                        { key: 'createdAt', label: 'Dibuat', type: 'date' },
                    ]
                }}
                transformRow={(admin) => ({
                    id: admin.id,
                    username: admin.username || '-',
                    email: admin.email || '-',
                    role: admin.role || '-',
                    createdAt: admin.createdAt,
                })}
                transformDetail={(admin) => ({
                    username: admin.username || '-',
                    email: admin.email || '-',
                    role: admin.role === 'SUPER_ADMIN' ? 'Super Admin' : 'HR Admin',
                    createdAt: admin.createdAt,
                })}
                customActions={
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-3 sm:px-4 py-2 sm:py-2.5 bg-[#ff6b00] hover:bg-[#e05e00] text-white font-medium rounded-lg shadow-sm flex items-center gap-2 transition-colors text-xs sm:text-sm"
                    >
                        + Tambah Admin
                    </button>
                }
            />
            
            <AnimatePresence>
                {showModal && (
                    <RegisterForm 
                        isModal={true}
                        onClose={() => setShowModal(false)}
                        onSuccess={() => {
                            setShowModal(false);
                            setRefreshKey(prev => prev + 1);
                        }}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default AdminCrud;