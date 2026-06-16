import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Plus, Pencil, Trash2, X, Loader2, Eye, AlertTriangle,
    ChevronLeft, ChevronRight, Filter, ArrowUpDown, ArrowUp, ArrowDown
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';
import { fadeInUp, staggerContainer, staggerItem } from '../animations/variants';

const CrudTemplate = ({
    api, title, subtitle, columns, formFields, detailConfig,
    searchKeys, transformRow, transformDetail, detailActions,
    rowActions, canCreate = true, canEdit = true, canDelete = true,
    filters = [], itemsPerPage: defaultItemsPerPage = 10, renderCreateForm,
    customActions, isDarkMode
}) => {
    const { isDark: themeDark } = useTheme();
    const isDark = isDarkMode !== undefined ? isDarkMode : themeDark;
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
    const [filterValues, setFilterValues] = useState({});
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const { addToast } = useToast();

    const cardBg = isDark ? 'bg-[#1e293b] border-[#2d3748]' : 'bg-white border-gray-100';
    const inputBg = isDark ? 'bg-[#151c27] border-[#334155] text-white' : 'bg-[#f9fafb] border-gray-200 text-[#111827]';

    const containerVariants = staggerContainer || {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } }
    };
    const itemVariants = staggerItem || {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.35 } }
    };
    const modalVariants = {
        hidden: { opacity: 0, scale: 0.85, y: 30, filter: "blur(4px)" },
        visible: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 350, damping: 13, mass: 0.8 } },
        exit: { opacity: 0, scale: 0.92, y: 15, filter: "blur(2px)", transition: { duration: 0.2, ease: [0.32, 0.72, 0, 1] } }
    };
    const fadeUpVariants = fadeInUp || {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }
    };

    const buildInitialForm = () => {
        const initial = {};
        formFields.forEach(f => { initial[f.name] = ''; });
        return initial;
    };

    const [form, setForm] = useState(buildInitialForm);

    const fetchItems = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.getAll();
            const data = res.data?.data || [];
            setItems(data);
        } catch (err) {
            addToast(err.response?.data?.errors || 'Gagal memuat data', 'error');
        } finally {
            setLoading(false);
        }
    }, [api, addToast]);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { fetchItems(); }, [fetchItems]);

    const fetchDetail = async (id) => {
        try {
            setDetailLoading(true);
            const res = await api.getById(id);
            const raw = res.data?.data || res.data;
            setSelectedItem(transformDetail ? transformDetail(raw) : raw);
            setIsDetailOpen(true);
        } catch (err) {
            addToast(err.response?.data?.errors || 'Gagal memuat detail', 'error');
        } finally {
            setDetailLoading(false);
        }
    };

    const isDateString = (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(v);

    const formatDate = (val) => {
        if (!val || val === '-' || val === 'Invalid Date') return '-';
        if (typeof val === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(val)) return val;
        const d = new Date(val);
        if (isNaN(d.getTime())) return String(val);
        return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const handleSort = (key) => {
        setSortConfig(prev => ({ key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' }));
        setCurrentPage(1);
    };

    const filtered = items.map(transformRow).filter((row) => {
        const matchesSearch = searchKeys.some(key => {
            const val = row[key];
            return val && String(val).toLowerCase().includes(search.toLowerCase());
        });
        const matchesFilters = Object.entries(filterValues).every(([key, val]) => {
            if (!val || val === '') return true;
            return String(row[key]).toLowerCase() === String(val).toLowerCase();
        });
        return matchesSearch && matchesFilters;
    });

    const sorted = [...filtered].sort((a, b) => {
        if (!sortConfig.key) return 0;
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (aVal == null) aVal = '';
        if (bVal == null) bVal = '';
        if (typeof aVal === 'number' && typeof bVal === 'number') {
            return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }
        if (isDateString(aVal) && isDateString(bVal)) {
            const aDate = new Date(aVal).getTime();
            const bDate = new Date(bVal).getTime();
            return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
        }
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const totalPages = Math.ceil(sorted.length / itemsPerPage) || 1;
    const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleFilterChange = (name, value) => {
        setFilterValues(prev => ({ ...prev, [name]: value }));
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilterValues({});
        setSearch('');
        setSortConfig({ key: null, direction: 'asc' });
        setCurrentPage(1);
    };

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const resetForm = () => {
        setForm(buildInitialForm());
        setEditingId(null);
    };

    const openCreate = () => { resetForm(); setIsModalOpen(true); };
    const openEdit = (row) => {
        setEditingId(row.id);
        const newForm = {};
        formFields.forEach(f => {
            let val = row[f.name];
            if (val === undefined || val === null) val = row[f.key];
            if (val === undefined || val === null) val = '';
            newForm[f.name] = String(val);
        });
        setForm(newForm);
        setIsModalOpen(true);
    };
    const openDelete = (id) => { setDeleteTargetId(id); setIsDeleteOpen(true); };
    const closeDelete = () => { setIsDeleteOpen(false); setDeleteTargetId(null); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {};
            formFields.forEach(f => {
                if (form[f.name] !== undefined && form[f.name] !== '') {
                    let val = form[f.name];
                    const isIdField = f.name.endsWith('Id') && !isNaN(val) && val !== '';
                    if (f.type === 'number' || isIdField) val = Number(val);
                    payload[f.name] = val;
                }
            });
            if (editingId) {
                await api.update(editingId, payload);
                addToast('Data berhasil diperbarui!', 'success');
            } else {
                await api.create(payload);
                addToast('Data berhasil ditambahkan!', 'success');
            }
            setIsModalOpen(false);
            resetForm();
            fetchItems();
        } catch (err) {
            addToast(err.response?.data?.errors || 'Terjadi kesalahan', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTargetId) return;
        try {
            setDeleteLoading(true);
            await api.delete(deleteTargetId);
            addToast('Data berhasil dihapus!', 'success');
            fetchItems();
            closeDelete();
        } catch (err) {
            addToast(err.response?.data?.errors || 'Gagal menghapus', 'error');
        } finally {
            setDeleteLoading(false);
        }
    };

    const formatRupiah = (val) => {
        if (!val) return '-';
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
    };

    const getFormatValue = (val, type) => {
        if (type === 'currency') return formatRupiah(val);
        if (type === 'date') return formatDate(val);
        return val || '-';
    };

    const renderFormField = (field) => {
        const isShown = editingId ? (field.showOnEdit !== false) : (field.showOnCreate !== false);
        if (!isShown) return null;
        const baseClass = `w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/20 ${inputBg}`;
        return (
            <div key={field.name} className={field.gridCols === 2 ? 'col-span-2' : ''}>
                <label className="text-xs font-semibold mb-1 block">{field.label}</label>
                {field.type === 'select' ? (
                    <select name={field.name} value={form[field.name]} onChange={handleChange}
                        required={field.required && !editingId} disabled={field.disabled}
                        className={`${baseClass} ${field.disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
                        <option value="">{field.placeholder || 'Pilih'}</option>
                        {field.options.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                ) : (
                    <input name={field.name} type={field.type || 'text'} value={form[field.name]}
                        onChange={handleChange} required={field.required && !editingId} className={baseClass} />
                )}
            </div>
        );
    };

    const checkBool = (val, row) => typeof val === 'function' ? val(row) : val;

    const SortIcon = ({ columnKey }) => {
        if (sortConfig.key !== columnKey) {
            return <ArrowUpDown className="w-3 h-3 ml-1 text-gray-400 opacity-0 group-hover:opacity-50 transition-opacity" />;
        }
        return sortConfig.direction === 'asc'
            ? <ArrowUp className="w-3 h-3 ml-1 text-[#ff6b00]" />
            : <ArrowDown className="w-3 h-3 ml-1 text-[#ff6b00]" />;
    };

    const getPageRange = () => {
        const range = [];
        const start = Math.max(1, currentPage - 2);
        const end = Math.min(totalPages, currentPage + 2);
        for (let i = start; i <= end; i++) range.push(i);
        return range;
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            <motion.div initial="hidden" animate="visible" variants={fadeUpVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <div>
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight">{title}</h2>
                    <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{subtitle}</p>
                </div>
                <div className="flex items-center gap-2">
                    {customActions}
                    {canCreate && !customActions && (
                        <motion.button onClick={openCreate} whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}
                            className="px-3 sm:px-4 py-2 sm:py-2.5 bg-[#ff6b00] hover:bg-[#e05e00] text-white font-medium rounded-lg shadow-sm flex items-center gap-2 transition-colors active:scale-95 text-xs sm:text-sm">
                            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Tambah {title.split(' ')[1] || 'Data'}</span>
                            <span className="sm:hidden">Tambah</span>
                        </motion.button>
                    )}
                </div>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fadeUpVariants} className={`p-3 sm:p-4 lg:p-5 rounded-xl border shadow-sm ${cardBg}`}>
                <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Cari..." value={search}
                            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                            className={`w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/20 transition-all ${inputBg}`} />
                    </div>
                    {filters.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-400" />
                            {filters.map(filter => (
                                <select key={filter.name} value={filterValues[filter.name] || ''}
                                    onChange={e => handleFilterChange(filter.name, e.target.value)}
                                    className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/20 ${inputBg}`}>
                                    <option value="">{filter.label}</option>
                                    {filter.options.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            ))}
                            {(Object.values(filterValues).some(v => v) || search || sortConfig.key) && (
                                <motion.button onClick={clearFilters} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                    className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                    Reset
                                </motion.button>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={containerVariants} className={`rounded-xl border shadow-sm overflow-hidden ${cardBg}`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className={`border-b text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase ${isDark ? 'border-[#2d3748] text-gray-400' : 'border-gray-200 text-gray-500'}`}>
                                {columns.map(col => (
                                    <th key={col.key} onClick={() => col.sortable !== false && handleSort(col.key)}
                                        className={`px-2 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4 select-none whitespace-nowrap ${col.sortable !== false ? 'group cursor-pointer hover:text-[#ff6b00] transition-colors' : ''}`}>
                                        <div className="flex items-center">{col.label}<SortIcon columnKey={col.key} /></div>
                                    </th>
                                ))}
                                <th className="px-2 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4 text-right whitespace-nowrap">Aksi</th>
                             </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100/10 text-xs sm:text-sm">
                            {loading ? (
                                <motion.tr variants={itemVariants}>
                                    <td colSpan={columns.length + 1} className="text-center py-8 sm:py-12">
                                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                                            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-[#ff6b00]" />
                                        </motion.div>
                                        <p className="mt-3 text-xs text-gray-400">Memuat data...</p>
                                     </td>
                                </motion.tr>
                            ) : paginated.length > 0 ? (
                                paginated.map((row) => (
                                    <motion.tr key={row.id} variants={itemVariants} initial="hidden" animate="visible"
                                        whileHover={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
                                        className="transition-colors">
                                        {columns.map(col => (
                                            <td key={col.key} className="px-2 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4 whitespace-nowrap">
                                                {col.render ? col.render(row, isDark) : (
                                                    isDateString(row[col.key]) ? formatDate(row[col.key]) : (row[col.key] || '-')
                                                )}
                                             </td>
                                        ))}
                                        <td className="px-2 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4">
                                            <div className="flex items-center justify-end gap-0.5 sm:gap-1">
                                                <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={() => fetchDetail(row.id)}
                                                    className="p-1 sm:p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-[#ff6b00]" title="Detail">
                                                    <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                </motion.button>
                                                {checkBool(canEdit, row) && (
                                                    <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={() => openEdit(row)}
                                                        className="p-1 sm:p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-blue-500" title="Edit">
                                                        <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                    </motion.button>
                                                )}
                                                {checkBool(canDelete, row) && (
                                                    <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={() => openDelete(row.id)}
                                                        className="p-1 sm:p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-red-500" title="Hapus">
                                                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                    </motion.button>
                                                )}
                                                {rowActions && (
                                                    <div className="flex items-center gap-1 ml-1 sm:ml-2 pl-1 sm:pl-2 border-l border-gray-200">
                                                        {rowActions(row, fetchItems)}
                                                    </div>
                                                )}
                                            </div>
                                         </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <motion.tr variants={itemVariants}>
                                    <td colSpan={columns.length + 1} className="text-center py-8 sm:py-12">
                                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                                                <Search className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                                            </div>
                                            <p className="text-gray-400 text-xs sm:text-sm">Tidak ada data</p>
                                        </motion.div>
                                     </td>
                                </motion.tr>
                            )}
                        </tbody>
                     </table>
                </div>

                <div className={`flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 border-t ${isDark ? 'border-[#2d3748]' : 'border-gray-200'}`}>
                    <div className="text-[10px] sm:text-xs text-gray-400">
                        Menampilkan {paginated.length} dari {sorted.length} data{totalPages > 1 && ` • Halaman ${currentPage} / ${totalPages}`}
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <select value={itemsPerPage} onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                            className={`px-2 py-1 sm:py-1.5 rounded-lg border text-[10px] sm:text-xs ${inputBg}`}>
                            <option value={5}>5 / hal</option>
                            <option value={10}>10 / hal</option>
                            <option value={25}>25 / hal</option>
                            <option value={50}>50 / hal</option>
                        </select>
                        <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1} className="p-1 sm:p-1.5 rounded-lg border transition-all disabled:opacity-40 hover:bg-gray-100 disabled:hover:bg-transparent">
                            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </motion.button>
                        {getPageRange().map(page => (
                            <motion.button key={page} whileHover={currentPage !== page ? { scale: 1.1 } : {}} whileTap={currentPage !== page ? { scale: 0.9 } : {}}
                                onClick={() => setCurrentPage(page)}
                                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[10px] sm:text-xs font-semibold transition-all ${currentPage === page ? 'bg-[#ff6b00] text-white shadow-md shadow-[#ff6b00]/20' : isDark ? 'hover:bg-[#2a3547] text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}>
                                {page}
                            </motion.button>
                        ))}
                        <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages} className="p-1 sm:p-1.5 rounded-lg border transition-all disabled:opacity-40 hover:bg-gray-100 disabled:hover:bg-transparent">
                            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Modal Form */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit"
                            className={`w-full max-w-[calc(100%-1rem)] sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl p-4 sm:p-6 ${isDark ? 'bg-[#1e293b] border-[#334155] text-white' : 'bg-white border-gray-100 text-[#151c27]'}`}>
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <h3 className="text-base sm:text-lg font-bold">{editingId ? 'Edit' : 'Tambah'} {title.split(' ')[1] || 'Data'}</h3>
                                <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} 
                                    onClick={() => { setIsModalOpen(false); resetForm(); }}
                                    className="p-1.5 rounded-md hover:bg-black/5 transition-colors">
                                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                </motion.button>
                            </div>
                            
                            {renderCreateForm && !editingId ? (
                                renderCreateForm({ 
                                    onClose: () => setIsModalOpen(false), 
                                    onSuccess: () => { setIsModalOpen(false); fetchItems(); } 
                                })
                            ) : (
                                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    {formFields.map(renderFormField)}
                                    <div className="col-span-2 flex justify-end gap-2 sm:gap-3 pt-3 sm:pt-4">
                                        <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                            onClick={() => { setIsModalOpen(false); resetForm(); }}
                                            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold border transition-all ${isDark ? 'border-[#334155] text-gray-300 hover:bg-[#2a3547]' : 'border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
                                            Batal
                                        </motion.button>
                                        <motion.button type="submit" disabled={submitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                            className="px-3 sm:px-4 py-2 sm:py-2.5 bg-[#ff6b00] hover:bg-[#e05e00] text-white font-semibold rounded-lg text-xs sm:text-sm transition-all disabled:opacity-60 flex items-center gap-2">
                                            {submitting && <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />}
                                            {editingId ? 'Simpan' : 'Tambah'}
                                        </motion.button>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal Delete */}
            <AnimatePresence>
                {isDeleteOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit"
                            className={`w-full max-w-[calc(100%-1rem)] sm:max-w-sm rounded-2xl border shadow-2xl p-4 sm:p-6 ${isDark ? 'bg-[#1e293b] border-[#334155] text-white' : 'bg-white border-gray-100 text-[#151c27]'}`}>
                            <div className="flex flex-col items-center text-center gap-3 sm:gap-4">
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-100 flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 text-red-500" />
                                </motion.div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-bold mb-1">Hapus Data?</h3>
                                    <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Tindakan ini tidak dapat dibatalkan.</p>
                                </div>
                                <div className="flex w-full gap-2 sm:gap-3 pt-2">
                                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={closeDelete} disabled={deleteLoading}
                                        className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold border transition-all ${isDark ? 'border-[#334155] text-gray-300 hover:bg-[#2a3547]' : 'border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
                                        Batal
                                    </motion.button>
                                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleDeleteConfirm} disabled={deleteLoading}
                                        className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg text-xs sm:text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                                        {deleteLoading && <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />}
                                        {deleteLoading ? 'Menghapus...' : 'Ya, Hapus'}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal Detail */}
            <AnimatePresence>
                {isDetailOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit"
                            className={`w-full max-w-[calc(100%-1rem)] sm:max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl p-4 sm:p-6 ${isDark ? 'bg-[#1e293b] border-[#334155] text-white' : 'bg-white border-gray-100 text-[#151c27]'}`}>
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <h3 className="text-base sm:text-lg font-bold">Detail {title.split(' ')[1] || 'Data'}</h3>
                                <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} 
                                    onClick={() => { setIsDetailOpen(false); setSelectedItem(null); }}
                                    className="p-1.5 rounded-md hover:bg-black/5 transition-colors">
                                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                </motion.button>
                            </div>
                            {detailLoading ? (
                                <div className="flex flex-col items-center justify-center py-12 gap-3">
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                                        <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-[#ff6b00]" />
                                    </motion.div>
                                    <p className="text-xs sm:text-sm text-gray-400">Memuat...</p>
                                </div>
                            ) : selectedItem ? (
                                <div className="space-y-4 sm:space-y-5">
                                    {detailConfig?.showAvatar !== false && (
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#ff6b00]/10 flex items-center justify-center text-[#ff6b00] font-bold text-lg sm:text-xl">
                                                {(selectedItem.name || selectedItem.username || '?')[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-base sm:text-lg">{selectedItem.name || selectedItem.username || '-'}</h4>
                                                {selectedItem.email && <p className="text-xs sm:text-sm text-gray-400">{selectedItem.email}</p>}
                                                {selectedItem.role && <span className="inline-flex mt-1 px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium bg-blue-100 text-blue-700">{selectedItem.role}</span>}
                                            </div>
                                        </div>
                                    )}
                                    <div className={`border-t ${isDark ? 'border-[#334155]' : 'border-gray-200'}`} />
                                    <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                                        {detailConfig?.fields?.map(field => (
                                            <div key={field.key} className={field.fullWidth ? 'col-span-2' : ''}>
                                                <p className={`text-[10px] sm:text-xs font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{field.label}</p>
                                                <p className="font-semibold">{getFormatValue(selectedItem[field.key], field.type)}</p>
                                            </div>
                                        ))}
                                    </div>
                                    {detailActions && selectedItem && (
                                        <div className={`flex gap-2 sm:gap-3 pt-3 sm:pt-4 border-t ${isDark ? 'border-[#334155]' : 'border-gray-200/20'}`}>
                                            {detailActions(selectedItem, () => { setIsDetailOpen(false); setSelectedItem(null); fetchItems(); })}
                                        </div>
                                    )}
                                    <div className="flex justify-end pt-3 sm:pt-4">
                                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} 
                                            onClick={() => { setIsDetailOpen(false); setSelectedItem(null); }}
                                            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold border transition-all ${isDark ? 'border-[#334155] text-gray-300 hover:bg-[#2a3547]' : 'border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
                                            Tutup
                                        </motion.button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-400 text-xs sm:text-sm">Data tidak ditemukan</div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CrudTemplate;