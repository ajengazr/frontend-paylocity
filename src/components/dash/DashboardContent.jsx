import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { staggerContainer } from '../../animations/variants';
import StatCard from './StatCard';
import PayrollChart from './PayrollChart';
import EmployeeDistribution from './EmployeeDistribution';
import OvertimeTable from './OvertimeTable';
import ActivityLog from './ActivityLog';
import PayrollSummary from './PayrollSummary';
import EmployeeCrud from '../employee/EmployeeCrud';
import DepartmentCrud from '../admin/DepartmentCrud';
import PositionCrud from '../admin/PositionCrud';
import AdminCrud from '../admin/AdminCrud';
import OvertimeCrud from '../admin/OvertimeCrud';
import PayrollCrud from '../admin/PayrollCrud';
import MyPayslip from '../employee/MyPayslip';
import MyOvertime from '../employee/MyOvertime';
import Profile from '../employee/Profile';
import LaporanCrud from '../laporan/LaporanCrud';
import LeaveRequests from '../admin/LeaveRequests';
import MyLeaveRequests from '../employee/MyLeaveRequests';

const sectionVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
    }
};

// Wrapper untuk tab CRUD agar tetap animate saat switch
const TabWrapper = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 22, scale: 0.995 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.995 }}
        transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
    >
        {children}
    </motion.div>
);

const EmptySection = ({ title, message }) => {
    const { isDark } = useTheme();
    return (
        <div className={`p-4 sm:p-8 rounded-xl border shadow-sm flex flex-col items-center justify-center text-center min-h-40 sm:min-h-50 ${isDark ? 'bg-[#1e293b] border-[#2d3748]' : 'bg-white border-gray-100'}`}>
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-3 ${isDark ? 'bg-[#2a3547]' : 'bg-gray-50'}`}>
                <svg className={`w-5 h-5 sm:w-6 sm:h-6 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C3.75 18.098 7.444 20 12 20s8.25-1.847 8.25-4.125v-3.75m0 0h-16.5" />
                </svg>
            </div>
            <h4 className={`text-xs sm:text-sm font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{title}</h4>
            <p className={`text-[11px] sm:text-xs max-w-45 sm:max-w-50 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{message}</p>
        </div>
    );
};

const DashboardContent = ({
    activeTab,
    config,
    searchQuery,
    role,
    mergedStats,
    mergedDonutData,
    mergedTableData,
    mergedChartData,
    mergedActivityData,
    mergedPayrollSummary,
    hasDynamicData,
}) => {
    const { user } = useAuth();
    const { isDark } = useTheme();
    const [updatedAt] = useState(() => new Date());

    // ==================== TAB ROUTING (dengan animasi) ====================
    if (activeTab === 'Kelola Admin') return <TabWrapper><AdminCrud /></TabWrapper>;
    if (activeTab === 'Data Karyawan') return <TabWrapper><EmployeeCrud /></TabWrapper>;
    if (activeTab === 'Manajemen Cuti') return <TabWrapper><LeaveRequests /></TabWrapper>;
    if (activeTab === 'Departemen') return <TabWrapper><DepartmentCrud /></TabWrapper>;
    if (activeTab === 'Jabatan') return <TabWrapper><PositionCrud /></TabWrapper>;
    if (activeTab === 'Lembur') return <TabWrapper><OvertimeCrud role={role} /></TabWrapper>;
    if (activeTab === 'Penggajian') return <TabWrapper><PayrollCrud role={role} /></TabWrapper>;
    if (activeTab === 'Slip Gaji') return <TabWrapper><MyPayslip /></TabWrapper>;
    if (activeTab === 'Riwayat Lembur') return <TabWrapper><MyOvertime /></TabWrapper>;
    if (activeTab === 'Profil Saya') return <TabWrapper><Profile /></TabWrapper>;
    if (activeTab === 'Cuti Saya') return <TabWrapper><MyLeaveRequests /></TabWrapper>;
    if (activeTab === 'Laporan') return <TabWrapper><LaporanCrud role={role} /></TabWrapper>;

    // ==================== DASHBOARD OVERVIEW (dengan staggered animation) ====================
    return (
        <motion.div
            className="space-y-4 sm:space-y-6 lg:space-y-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <motion.div variants={sectionVariants} className={`relative flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4 overflow-hidden rounded-2xl border p-4 sm:p-5 lg:p-6 ${isDark ? 'bg-[#1e293b] border-[#2d3748]' : 'bg-white border-gray-100'}`}>
                <div className="relative">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight">
                        Selamat datang kembali,{' '}
                        <span className="text-gradient">{user?.name || 'User'}</span>
                    </h2>
                    <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · Berikut ringkasan untuk Anda.
                    </p>
                </div>
                {/* Indikator pembaruan */}
                <div className="relative hidden sm:flex items-center gap-2">
                    <span className="relative flex w-2 h-2">
                        <span className={`absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping ${isDark ? 'bg-[#ff9a5c]' : 'bg-[#ff6b00]'}`} />
                        <span className={`relative inline-flex w-2 h-2 rounded-full ${isDark ? 'bg-[#ff9a5c]' : 'bg-[#ff6b00]'}`} />
                    </span>
                    <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Terakhir diperbarui {updatedAt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div variants={sectionVariants}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-6">
                    {mergedStats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.08, ease: 'easeOut' }}
                        >
                            <StatCard {...stat} />
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Charts */}
            <motion.div variants={sectionVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                <div className="lg:col-span-2">
                    {hasDynamicData && mergedChartData.length === 0 ? (
                        <EmptySection
                            title="Riwayat Gaji Belum Tersedia"
                            message="Data gaji 6 bulan terakhir belum tersedia. Data akan muncul setelah payroll diproses."
                        />
                    ) : (
                        <PayrollChart
                            title={config.chartTitle}
                            subtitle={config.chartSubtitle}
                            data={mergedChartData}
                        />
                    )}
                </div>
                <div>
                    {hasDynamicData && mergedDonutData.length === 0 ? (
                        <EmptySection
                            title="Komposisi Gaji Belum Tersedia"
                            message="Data komposisi gaji belum tersedia untuk periode ini."
                        />
                    ) : (
                        <EmployeeDistribution
                            title={config.donutTitle}
                            data={mergedDonutData}
                            centerLabel={role === 'EMPLOYEE' ? undefined : 'Total Karyawan'} />
                    )}
                </div>
            </motion.div>

            {/* Table & Activity */}
            <motion.div variants={sectionVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                <div className="lg:col-span-2">
                    <OvertimeTable
                        title={config.tableTitle}
                        columns={config.tableColumns}
                        data={mergedTableData}
                        searchQuery={searchQuery}
                        role={role}
                    />
                </div>
                <div>
                    {hasDynamicData && mergedActivityData.length === 0 ? (
                        <EmptySection
                            title="Aktivitas Belum Tersedia"
                            message="Belum ada aktivitas terbaru untuk ditampilkan."
                        />
                    ) : (
                        <ActivityLog title={config.activityTitle} data={mergedActivityData} />
                    )}
                </div>
            </motion.div>

            {/* Payroll Summary */}
            <motion.div variants={sectionVariants}>
                <PayrollSummary
                    initialData={mergedPayrollSummary}
                    role={role}
                />
            </motion.div>
        </motion.div>
    );
};

export default DashboardContent;