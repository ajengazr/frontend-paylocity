import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import employeeApi from '../../config/employeeApi';
import departmentApi from '../../config/departmentApi';
import positionApi from '../../config/positionApi';
import CrudTemplate from '../CrudTemplate';
import { useAuth } from '../../contexts/AuthContext';

const EmployeeCrud = () => {
    const { isDark } = useTheme();
    const { user } = useAuth();
    const [deptOptions, setDeptOptions] = useState([]);
    const [posOptions, setPosOptions] = useState([]);

    // Fetch departments & positions untuk dropdown
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [deptRes, posRes] = await Promise.all([
                    departmentApi.getAll(),
                    positionApi.getAll()
                ]);

                const depts = deptRes.data?.data || [];
                const positions = posRes.data?.data || [];

                setDeptOptions(depts.map(d => ({ value: String(d.id), label: d.name })));
                setPosOptions(positions.map(p => ({ value: String(p.id), label: p.name })));
            } catch (err) {
                console.error('Gagal fetch dropdown:', err);
            }
        };

        fetchOptions();
    }, []);

    // Custom handler untuk update employee (hanya kirim field yang diizinkan)
    const handleUpdateEmployee = async (id, formData) => {
        // Filter hanya field yang boleh diupdate
        const updatePayload = {};
        
        if (formData.username !== undefined && formData.username !== '') {
            updatePayload.username = formData.username;
        }
        if (formData.departmentId !== undefined && formData.departmentId !== '') {
            updatePayload.departmentId = Number(formData.departmentId);
        }
        if (formData.positionId !== undefined && formData.positionId !== '') {
            updatePayload.positionId = Number(formData.positionId);
        }
        if (formData.basicSalary !== undefined && formData.basicSalary !== '') {
            updatePayload.basicSalary = Number(formData.basicSalary);
        }
        if (formData.taxStatus !== undefined && formData.taxStatus !== '') {
            updatePayload.taxStatus = formData.taxStatus;
        }
        if (formData.status !== undefined && formData.status !== '') {
            updatePayload.status = formData.status;
        }
        
        return employeeApi.update(id, updatePayload);
    };

    return (
        <CrudTemplate
            api={{
                ...employeeApi,
                update: handleUpdateEmployee 
            }}
            title="Data Karyawan"
            subtitle="Kelola data seluruh karyawan perusahaan"
            isDarkMode={isDark}
            searchKeys={['name', 'dept', 'email', 'nik']}
            canDelete={user?.role === "SUPER_ADMIN"}  
            canEdit={true}
            canCreate={true}
            columns={[
                { key: 'name', label: 'Nama', sortable: true },
                { key: 'email', label: 'Email', sortable: true },
                {
                    key: 'dept',
                    label: 'Departemen',
                    sortable: true,
                    render: (row) => (
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${row.dept === 'IT' ? 'bg-blue-100 text-blue-700' :
                            row.dept === 'HR' ? 'bg-purple-100 text-purple-700' :
                                'bg-emerald-100 text-emerald-700'
                            }`}>
                            {row.dept}
                        </span>
                    )
                },
                { key: 'position', label: 'Jabatan', sortable: true },
                {
                    key: 'status',
                    label: 'Status',
                    sortable: true,
                    render: (row) => (
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${row.status === 'Aktif' || row.status === 'ACTIVE' ? 'text-emerald-500' : 'text-amber-500'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${row.status === 'Aktif' || row.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                            {row.status === 'ACTIVE' ? 'Aktif' : row.status === 'INACTIVE' ? 'Tidak Aktif' : row.status}
                        </span>
                    )
                },
            ]}
            formFields={[
                // ============ CREATE MODE (Tambah Karyawan Baru) ============
                { 
                    name: 'username', 
                    label: 'Username', 
                    required: true,
                    showOnCreate: true,
                    showOnEdit: true
                },
                { 
                    name: 'email', 
                    label: 'Email', 
                    type: 'email', 
                    required: true, 
                    showOnCreate: true,
                    showOnEdit: false 
                },
                { 
                    name: 'password', 
                    label: 'Password', 
                    type: 'password', 
                    required: true, 
                    showOnCreate: true,
                    showOnEdit: false  
                },
                { 
                    name: 'nik', 
                    label: 'NIK', 
                    required: true,
                    showOnCreate: true,
                    showOnEdit: false  
                },
                { 
                    name: 'departmentId', 
                    label: 'Departemen', 
                    type: 'select', 
                    required: true,
                    showOnCreate: true,
                    showOnEdit: true,
                    options: deptOptions 
                },
                { 
                    name: 'positionId', 
                    label: 'Jabatan', 
                    type: 'select', 
                    required: true,
                    showOnCreate: true,
                    showOnEdit: true,
                    options: posOptions 
                },
                { 
                    name: 'basicSalary', 
                    label: 'Gaji Pokok', 
                    type: 'number', 
                    required: true,
                    showOnCreate: true,
                    showOnEdit: true
                },
                { 
                    name: 'taxStatus', 
                    label: 'Status Pajak', 
                    type: 'select', 
                    required: true,
                    showOnCreate: true,
                    showOnEdit: true,
                    options: [
                        { value: 'TK0', label: 'TK/0 — Tidak Kawin, 0 Tanggungan' },
                        { value: 'TK1', label: 'TK/1 — Tidak Kawin, 1 Tanggungan' },
                        { value: 'K0', label: 'K/0 — Kawin, 0 Tanggungan' },
                        { value: 'TK2', label: 'TK/2 — Tidak Kawin, 2 Tanggungan' },
                        { value: 'TK3', label: 'TK/3 — Tidak Kawin, 3 Tanggungan' },
                        { value: 'K1', label: 'K/1 — Kawin, 1 Tanggungan' },
                        { value: 'K2', label: 'K/2 — Kawin, 2 Tanggungan' },
                        { value: 'K3', label: 'K/3 — Kawin, 3 Tanggungan' },
                    ]
                },
                { 
                    name: 'status', 
                    label: 'Status Karyawan', 
                    type: 'select', 
                    required: true,
                    showOnCreate: true,
                    showOnEdit: true,
                    options: [
                        { value: 'ACTIVE', label: 'Aktif' },
                        { value: 'INACTIVE', label: 'Tidak Aktif' },
                    ]
                },
                { 
                    name: 'joinDate', 
                    label: 'Tanggal Masuk', 
                    type: 'date', 
                    required: true,
                    showOnCreate: true,
                    showOnEdit: false  
                },
            ]}
            detailConfig={{
                fields: [
                    { key: 'nik', label: 'NIK' },
                    { key: 'email', label: 'Email' },
                    { key: 'department', label: 'Departemen' },
                    { key: 'position', label: 'Jabatan' },
                    { key: 'taxStatus', label: 'Status Pajak' },
                    { key: 'basicSalary', label: 'Gaji Pokok', type: 'currency' },
                    { key: 'status', label: 'Status Karyawan' },
                    { key: 'joinDate', label: 'Tanggal Masuk', type: 'date', fullWidth: true },
                ]
            }}
            transformRow={(emp) => ({
                id: emp.id,
                name: emp.user?.username || '-',
                email: emp.user?.email || '-',
                role: emp.user?.role || '-',
                nik: emp.nik,
                dept: emp.department?.name || '-',
                position: emp.position?.name || '-',
                departmentId: emp.department?.id,
                positionId: emp.position?.id,
                status: emp.status || 'ACTIVE',
                joinDate: emp.joinDate ? new Date(emp.joinDate).toISOString().split('T')[0] : '',
                username: emp.user?.username,
                basicSalary: emp.basicSalary,
                taxStatus: emp.taxStatus,
            })}
            transformDetail={(emp) => ({
                name: emp.user?.username || emp.username,
                email: emp.user?.email || emp.email,
                role: emp.user?.role || emp.role,
                nik: emp.nik,
                department: emp.department?.name,
                position: emp.position?.name,
                basicSalary: emp.basicSalary,
                taxStatus: emp.taxStatus,
                status: emp.status === 'ACTIVE' ? 'Aktif' : 'Tidak Aktif',
                joinDate: emp.joinDate ? new Date(emp.joinDate).toLocaleDateString('id-ID') : '-',
            })}
        />
    );
};

export default EmployeeCrud;