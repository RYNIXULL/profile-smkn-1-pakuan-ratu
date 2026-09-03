import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { AuditLogItem } from '../../types';
import { ScrollText, Clock, User, Shield, Loader2 } from 'lucide-react';
import { formatDateTime } from '../../lib/utils';

export const AdminAuditLogsPage: React.FC = () => {
  const { data: logs, isLoading } = useQuery<AuditLogItem[]>({
    queryKey: ['adminAuditLogsList'],
    queryFn: () => api.get('/admin/audit-logs'),
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case 'LOGIN':
        return 'bg-emerald-100 text-emerald-800';
      case 'LOGOUT':
        return 'bg-slate-100 text-slate-800';
      case 'FAILED_LOGIN':
        return 'bg-rose-100 text-rose-800';
      case 'CREATE':
        return 'bg-blue-100 text-blue-800';
      case 'UPDATE':
        return 'bg-amber-100 text-amber-800';
      case 'DELETE':
        return 'bg-rose-100 text-rose-800';
      case 'UPLOAD':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Audit Log Aktivitas Sistem</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Rekam jejak seluruh tindakan sensitif administrator, riwayat login, dan perubahan data.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-forest-800">
            <Loader2 className="w-8 h-8 animate-spin text-forest-600" />
            <p className="text-xs font-medium text-gray-500 mt-3">Memuat riwayat audit...</p>
          </div>
        ) : !logs?.length ? (
          <div className="text-center py-16 text-gray-500 text-xs">Belum ada catatan log aktivitas.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-slate-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Waktu</th>
                  <th className="px-6 py-4">Pengguna</th>
                  <th className="px-6 py-4">Tindakan</th>
                  <th className="px-6 py-4">Modul / Resource</th>
                  <th className="px-6 py-4">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {formatDateTime(log.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {log.user?.name || 'Sistem Otomatis'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {log.resource}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-[11px] text-gray-500">
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
