/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import overtimeApi from '../../config/overtimeApi';
import employeeApi from '../../config/employeeApi';
import CrudTemplate from '../CrudTemplate';
import { useAuth } from '../../contexts/AuthContext';
import { fadeIn } from '../../animations/variants';

const formatRupiah = (amount) => {
    if (!amount || amount === 0 || amount === null || amount === undefined) return 'Rp 0';
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(numAmount).replace(/\s/g, ' ');
};

const OvertimeCrud = ({ role }) => {
    const { addToast }                      = useToast();
    const { user }                          = useAuth();
    const [employees, setEmployees]         = useState([]);
    const [loadingEmployees, setLoadingEmployees] = useState(false);

    const isAdmin    = role === 'HR_ADMIN' || role === 'SUPER_ADMIN';
    const isEmployee = !isAdmin;

    // ✅ Fix 1: hapus addToast dari dependency
    useEffect(() => {
        if (!isAdmin) return;

        setLoadingEmployees(true);
        employeeApi.getAll()
            .then(res => setEmployees(res.data?.data || []))
            .catch(err => console.error('Gagal memuat karyawan:', err))
            .finally(() => setLoadingEmployees(false));
    }, [isAdmin]);

    // ✅ Fix 2: wrap api dengan useMemo supaya isAdmin tidak stale
    const api = useMemo(() => ({
        getAll:   ()         => isAdmin ? overtimeApi.getAll() : overtimeApi.getMyOvertime(),
        getById:  (id)       => overtimeApi.getById(id),
        create:   (data)     => isAdmin ? overtimeApi.createByAdmin(data) : overtimeApi.create(data),
        update:   (id, data) => isAdmin ? overtimeApi.updateByAdmin(id, data) : Promise.reject(new Error('Unauthorized')),
        delete:   (id)       => {
            if (user?.role === 'SUPER_ADMIN') return overtimeApi.delete(id);
            if (isEmployee)                   return overtimeApi.delete(id);
            return Promise.reject(new Error('Unauthorized'));
        },
    }), [isAdmin, isEmployee, user?.role]);

    const handleStatusUpdate = async (id, status, onDone) => {
        try {
            console.log("ID NYA: ", id);
            await overtimeApi.updateStatus(id, { status });
            addToast(
                `Pengajuan lembur ${status === 'APPROVED' ? 'disetujui' : 'ditolak'}!`,
                'success'
            );
            if (typeof onDone === 'function') onDone();
        } catch (err) {
            addToast(
                err.response?.data?.errors || 'Gagal memperbarui status',
                'error'
            );
        }
    };

    const canEdit = (row) => {
        if (isAdmin)    return row?.status === 'PENDING';
        return false;
    };

    const canDelete = (row) => {
        if (user?.role === 'SUPER_ADMIN') return true;
        if (user?.role === 'HR_ADMIN')    return false;
        return row?.status === 'PENDING';
    };

    const baseFormFields = [
        { name: 'date',      label: 'Tanggal',      type: 'date', required: true },
        { name: 'startTime', label: 'Jam Mulai',    type: 'time', required: true },
        { name: 'endTime',   label: 'Jam Selesai',  type: 'time', required: true },
        {
            name: 'dayType',
            label: 'Tipe Hari',
            type: 'select',
            required: true,
            options: [
                { value: 'WEEKDAY', label: 'Hari Kerja' },
                { value: 'WEEKEND', label: 'Hari Libur' },
            ]
        },
        { name: 'reason', label: 'Alasan Lembur', required: true, gridCols: 2 },
    ];

    const adminFormFields = [
        {
            name: 'employeeId',
            label: 'Karyawan',
            type: 'select',
            required: true,
            disabled: loadingEmployees || employees.length === 0,
            placeholder: loadingEmployees ? 'Memuat...' : 'Pilih Karyawan',
            options: employees.map(e => ({
                value: e.id,
                label: `${e.user?.username || e.username || 'Unknown'} (${e.nik || '-'})`
            })),
        },
        ...baseFormFields
    ];

    const formFields = isAdmin ? adminFormFields : baseFormFields;

    return (
        <motion.div {...fadeIn}>
            <CrudTemplate
                api={api}
                title="Data Lembur"
                subtitle="Kelola pengajuan lembur karyawan"
                searchKeys={['employeeName', 'date', 'status']}
                canCreate={true}
                canEdit={canEdit}
                canDelete={canDelete}
                formFields={formFields}
                columns={[
                    { key: 'date',         label: 'Tanggal',       sortable: true },
                    { key: 'employeeName', label: 'Nama Karyawan', sortable: true },
                    { key: 'startTime',    label: 'Mulai' },
                    { key: 'endTime',      label: 'Selesai' },
                    { key: 'totalHours',   label: 'Total Jam',     sortable: true },
                    {
                        key: 'status',
                        label: 'Status',
                        sortable: true,
                        render: (row) => (
                            <span className={`inline-flex px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium ${
                                row.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                                row.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                'bg-amber-100 text-amber-700'
                            }`}>
                                {row.status === 'APPROVED' ? 'Disetujui' :
                                 row.status === 'REJECTED' ? 'Ditolak' : 'Menunggu'}
                            </span>
                        )
                    },
                    {
                        key: 'overtimePay',
                        label: 'Bayaran',
                        sortable: true,
                        render: (row) => (
                            <span className="font-medium text-emerald-600">
                                {formatRupiah(row.overtimePay)}
                            </span>
                        )
                    },
                ]}
                detailConfig={{
                    showAvatar: false,
                    fields: [
                        { key: 'employeeName', label: 'Nama Karyawan' },
                        { key: 'nik',          label: 'NIK' },
                        { key: 'department',   label: 'Departemen' },
                        { key: 'position',     label: 'Jabatan' },
                        { key: 'date',         label: 'Tanggal',      type: 'date' },
                        { key: 'startTime',    label: 'Jam Mulai' },
                        { key: 'endTime',      label: 'Jam Selesai' },
                        { key: 'totalHours',   label: 'Total Jam' },
                        { key: 'dayType',      label: 'Tipe Hari' },
                        { key: 'reason',       label: 'Alasan',       fullWidth: true },
                        { key: 'status',       label: 'Status' },
                        { key: 'overtimePay',  label: 'Estimasi Bayaran', type: 'currency' },
                    ]
                }}
                rowActions={(row, refresh) => {
                    if (!isAdmin || row.status !== 'PENDING') return null;
                    console.log("ROW  : ",row);
                    console.log("ROW ID : ",row.id);
                    return (
                        <div className="flex items-center gap-1">
                            <motion.button
                                onClick={() => handleStatusUpdate(row.id, 'APPROVED', refresh)}
                                whileTap={{ scale: 0.9 }}
                                className="p-1 sm:p-1.5 bg-emerald-50 text-emerald-600 rounded-md hover:bg-emerald-100 transition-colors"
                                title="Setujui"
                            >
                                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </motion.button>
                            <motion.button
                                onClick={() => handleStatusUpdate(row.id, 'REJECTED', refresh)}
                                whileTap={{ scale: 0.9 }}
                                className="p-1 sm:p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                                title="Tolak"
                            >
                                <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </motion.button>
                        </div>
                    );
                }}
                detailActions={(item, onDone) => {
                    if (!isAdmin || item.status !== 'PENDING') return null;
                    return (
                        <div className="flex gap-2 w-full">
                            <motion.button
                                onClick={() => handleStatusUpdate(item.id, 'APPROVED', onDone)}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
                            >
                                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                Setujui
                            </motion.button>
                            <motion.button
                                onClick={() => handleStatusUpdate(item.id, 'REJECTED', onDone)}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
                            >
                                <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                Tolak
                            </motion.button>
                        </div>
                    );
                }}
                transformRow={(ot) => ({
                    id:           ot.id,
                    date:         ot.date ? new Date(ot.date).toLocaleDateString('id-ID') : '-',
                    employeeName: ot.employee?.user?.username || ot.employee?.username || '-',
                    nik:          ot.employee?.nik || '-',
                    department:   ot.employee?.department?.name || '-',
                    position:     ot.employee?.position?.name || '-',
                    startTime:    ot.startTime || '-',
                    endTime:      ot.endTime || '-',
                    totalHours:   ot.totalHours || 0,
                    status:       ot.status || 'PENDING',
                    dayType:      ot.dayType || 'WEEKDAY',
                    overtimePay:  ot.overtimePay || 0,
                    reason:       ot.reason || '-',
                })}
                transformDetail={(ot) => ({
                    id:           ot.id,
                    employeeName: ot.employee?.user?.username || ot.employee?.username || '-',
                    nik:          ot.employee?.nik || '-',
                    department:   ot.employee?.department?.name || '-',
                    position:     ot.employee?.position?.name || '-',
                    date:         ot.date ? new Date(ot.date).toLocaleDateString('id-ID') : '-',
                    startTime:    ot.startTime,
                    endTime:      ot.endTime,
                    totalHours:   ot.totalHours,
                    dayType:      ot.dayType === 'WEEKDAY' ? 'Hari Kerja' : 'Hari Libur',
                    reason:       ot.reason,
                    status:       ot.status === 'APPROVED' ? 'Disetujui' :
                                  ot.status === 'REJECTED' ? 'Ditolak' : 'Menunggu',
                    overtimePay:  ot.overtimePay || 0,
                })}
            />
        </motion.div>
    );
};

export default OvertimeCrud;