// Hitung hari kerja (skip Sabtu & Minggu)
export const calculateWorkingDays = (startDate, endDate) => {
    let count   = 0;
    const current = new Date(startDate);
    const end     = new Date(endDate);

    while (current <= end) {
        const day = current.getDay();
        if (day !== 0 && day !== 6) count++;
        current.setDate(current.getDate() + 1);
    }

    return count;
};
export const formatDate = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatShortDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
        day:   'numeric',
        month: 'short',
        year:  'numeric'
    });
};


export const getLeaveTypeLabel = (type) => {
    const labels = {
        TAHUNAN:    'Cuti Tahunan',
        SAKIT:      'Cuti Sakit',
        MELAHIRKAN: 'Cuti Melahirkan',
        PENTING:    'Cuti Penting'
    };
    return labels[type] || type;
};

export const getLeaveStatusBadge = (status) => {
    const badges = {
        PENDING:  {
            label:     'Menunggu',
            className: 'bg-amber-100 text-amber-800'
        },
        APPROVED: {
            label:     'Disetujui',
            className: 'bg-emerald-100 text-emerald-800'
        },
        REJECTED: {
            label:     'Ditolak',
            className: 'bg-red-100 text-red-800'
        }
    };
    return badges[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
};

