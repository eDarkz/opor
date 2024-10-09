import React from 'react';
import { OpportunityReport } from '../types';

interface ReportCardProps {
  report: OpportunityReport;
  onClick: () => void;
  isSelected: boolean;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onClick, isSelected }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'abierto':
        return 'bg-red-600';
      case 'en proceso':
        return 'bg-orange-500';
      case 'cerrado':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-lg transition-all duration-300 ease-in-out ${
        isSelected ? 'bg-blue-700' : 'bg-gray-800 hover:bg-gray-700'
      }`}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-white">{report.guestName}</h3>
          <p className="text-sm text-gray-300">Habitación: {report.roomNumber}</p>
        </div>
        <div className={`px-2 py-1 rounded ${getStatusColor(report.status)}`}>
          <span className="text-xs font-medium text-white">{report.status}</span>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2">Creado: {formatDate(report.createdAt)}</p>
    </button>
  );
};

export default ReportCard;