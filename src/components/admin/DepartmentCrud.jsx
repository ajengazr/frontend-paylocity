import { useTheme } from '../../contexts/ThemeContext';
import { Building2 } from 'lucide-react';
import CrudTemplate from '../CrudTemplate';
import departmentApi from '../../config/departmentApi';
import { useAuth } from '../../contexts/AuthContext';

const DepartmentCrud = () => {
    const { isDark } = useTheme();
    const { user } = useAuth();

    return (
        <CrudTemplate
            api={departmentApi}
            title="Data Departemen"
            subtitle="Kelola departemen perusahaan"
            icon={Building2}
            isDarkMode={isDark}
            searchKeys={['name']}
            canDelete={user?.role === "SUPER_ADMIN"}  
            canEdit={true}
            canCreate={true}
            columns={[
                {
                    key: 'name',
                    label: 'Nama Departemen',
                    render: (row) => (
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[#ff6b00]/10 flex items-center justify-center text-[#ff6b00]">
                                <Building2 className="w-4 h-4" />
                            </div>
                            <span className="font-medium">{row.name}</span>
                        </div>
                    )
                },
                {
                    key: 'positionCount',
                    label: 'Jumlah Posisi',
                    render: (row) => (
                        <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
                            {row.positionCount} Posisi
                        </span>
                    )
                },
                {
                    key: 'employeeCount',
                    label: 'Jumlah Karyawan',
                    render: (row) => (
                        <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                            {row.employeeCount} Karyawan
                        </span>
                    )
                },
                { key: 'createdAt', label: 'Dibuat' },
            ]}
            formFields={[
                { name: 'name', label: 'Nama Departemen', required: true, gridCols: 2 },
            ]}
            detailConfig={{
                showAvatar: false,
                fields: [
                    { key: 'name', label: 'Nama Departemen' },
                    { key: 'positionCount', label: 'Total Posisi' },
                    { key: 'employeeCount', label: 'Total Karyawan' },
                    { key: 'createdAt', label: 'Dibuat', type: 'date' },
                    { key: 'updatedAt', label: 'Diperbarui', type: 'date' },
                ]
            }}
            transformRow={(dept) => ({
                id: dept.id,
                name: dept.name,
                positionCount: dept.positions?.length || 0,
                employeeCount: dept._count?.employees || 0,
                createdAt: dept.createdAt,   
                updatedAt: dept.updatedAt,
            })}
            transformDetail={(dept) => ({
                name: dept.name,
                positionCount: dept.positions?.length || 0,
                employeeCount: dept._count?.employees || 0,
                createdAt: dept.createdAt,  
                updatedAt: dept.updatedAt,
                positions: dept.positions,
            })}
        />
    );
};

export default DepartmentCrud;