import { useState, useEffect } from 'react';
import positionApi from '../../config/positionApi';
import departmentApi from '../../config/departmentApi';
import CrudTemplate from '../CrudTemplate';
import { useAuth } from '../../contexts/AuthContext';

const PositionCrud = () => {
    const { user } = useAuth();
    const [deptOptions, setDeptOptions] = useState([]);

    useEffect(() => {
        const fetchDepts = async () => {
            try {
                const res = await departmentApi.getAll();
                const depts = res.data?.data || [];
                setDeptOptions(depts.map(d => ({ value: String(d.id), label: d.name })));
            } catch (err) {
                console.error('Gagal fetch departemen:', err);
            }
        };
        fetchDepts();
    }, []);

    return (
        <CrudTemplate
            api={positionApi}
            title="Data Jabatan"
            subtitle="Kelola jabatan/posisi perusahaan"
            searchKeys={['name']}
            canDelete={user?.role === "SUPER_ADMIN"}  
            canEdit={true}
            canCreate={true}
            columns={[
                { key: 'name', label: 'Nama Jabatan' },
                { key: 'department', label: 'Departemen' },
                { key: 'employeeCount', label: 'Jumlah Karyawan' },
            ]}
            formFields={[
                { name: 'name', label: 'Nama Jabatan', required: true },
                { name: 'departmentId', label: 'Departemen', type: 'select', required: true, options: deptOptions },
            ]}
            detailConfig={{
                showAvatar: false,
                fields: [
                    { key: 'name', label: 'Nama Jabatan' },
                    { key: 'department', label: 'Departemen' },
                    { key: 'employeeCount', label: 'Total Karyawan' },
                ]
            }}
            transformRow={(pos) => ({
                id: pos.id,
                name: pos.name,
                department: pos.department?.name || '-',
                employeeCount: pos._count?.employees || 0,
                departmentId: pos.department?.id,
            })}
            transformDetail={(pos) => ({
                name: pos.name,
                department: pos.department?.name,
                employeeCount: pos._count?.employees || 0,
            })}
        />
    );
};

export default PositionCrud;