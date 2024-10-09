import React, { useState } from 'react';
import { OpportunityReport } from '../types';
import Modal from './Modal';
import ReportForm from './ReportForm';
import ConfirmationModal from './ConfirmationModal';
import { Edit, Trash, Plus, X, MessageCircle } from 'lucide-react';

interface ReportDetailsProps {
  report: OpportunityReport;
  onUpdate: (id: string, updatedReport: OpportunityReport) => void;
  onDelete: (id: string) => void;
  onAddUpdate: (id: string, update: string) => void;
  onDeleteUpdate: (reportId: string, updateId: string) => void;
}

const ReportDetails: React.FC<ReportDetailsProps> = ({
  report,
  onUpdate,
  onDelete,
  onAddUpdate,
  onDeleteUpdate
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newUpdate, setNewUpdate] = useState('');
  const [showAllUpdates, setShowAllUpdates] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteUpdateId, setDeleteUpdateId] = useState<string | null>(null);

  const handleAddUpdate = () => {
    if (newUpdate.trim()) {
      onAddUpdate(report.id, newUpdate.trim());
      setNewUpdate('');
    }
  };

  const handleStatusChange = (newStatus: OpportunityReport['status']) => {
    onUpdate(report.id, { ...report, status: newStatus });
  };

  const handleDeleteReport = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteUpdate = (updateId: string) => {
    setDeleteUpdateId(updateId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteUpdateId !== null) {
      onDeleteUpdate(report.id, deleteUpdateId);
      setDeleteUpdateId(null);
    } else {
      onDelete(report.id);
    }
    setIsDeleteModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">{report.guestName}</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <p><strong>Habitación:</strong> {report.roomNumber}</p>
        <p><strong>Reserva:</strong> {report.reservationNumber}</p>
        <p><strong>Agencia:</strong> {report.agency}</p>
        <p><strong>Reportado por:</strong> {report.reportedBy}</p>
        <p><strong>Departamento:</strong> {report.department}</p>
        <p><strong>Llegada:</strong> {report.arrivalDate}</p>
        <p><strong>Salida:</strong> {report.departureDate}</p>
        <p><strong>Estado de ánimo:</strong> {report.guestMood}</p>
        <p><strong>Creado el:</strong> {formatDate(report.createdAt)}</p>
      </div>
      
      <div className="mb-6">
        <h3 className="font-bold mb-2">Reporte de hechos:</h3>
        <p className="bg-gray-700 p-3 rounded">{report.incidentReport}</p>
      </div>
      
      <div className="mb-6">
        <h3 className="font-bold mb-2">Estado del ticket:</h3>
        <select
          value={report.status}
          onChange={(e) => handleStatusChange(e.target.value as OpportunityReport['status'])}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-100"
        >
          <option value="abierto">Abierto</option>
          <option value="en proceso">En proceso</option>
          <option value="cerrado">Cerrado</option>
        </select>
      </div>
      
      <div className="mb-6">
        <h3 className="font-bold mb-2">Actualizaciones:</h3>
        {report.updates && report.updates.length > 0 ? (
          <>
            <div className="bg-gray-700 p-3 rounded">
              <p>{report.updates[0].text}</p>
              <p className="text-xs text-gray-400 mt-1">{formatDate(report.updates[0].timestamp)}</p>
            </div>
            
            {report.updates.length > 1 && (
              <button
                onClick={() => setShowAllUpdates(!showAllUpdates)}
                className="mt-2 text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center"
              >
                <MessageCircle size={16} className="mr-1" />
                {showAllUpdates ? 'Ocultar actualizaciones' : 'Ver todas las actualizaciones'}
              </button>
            )}
            
            {showAllUpdates && (
              <ul className="space-y-2 mt-2">
                {report.updates.slice(1).map((update) => (
                  <li key={update.id} className="flex justify-between items-center bg-gray-700 p-3 rounded">
                    <div>
                      <p>{update.text}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(update.timestamp)}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteUpdate(update.id)}
                      className="text-red-400 hover:text-red-300 transition-colors duration-200"
                    >
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <p className="text-gray-400">No hay actualizaciones</p>
        )}
      </div>
      
      <div className="mb-6">
        <textarea
          value={newUpdate}
          onChange={(e) => setNewUpdate(e.target.value)}
          placeholder="Nueva actualización"
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-gray-100 h-24 resize-none"
        />
        <button
          onClick={handleAddUpdate}
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition-colors duration-200 w-full flex items-center justify-center"
        >
          <Plus size={20} className="mr-2" />
          Añadir actualización
        </button>
      </div>
      
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded transition-colors duration-200"
        >
          <Edit size={20} />
        </button>
        <button
          onClick={handleDeleteReport}
          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors duration-200"
        >
          <Trash size={20} />
        </button>
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <ReportForm
          initialData={report}
          onSubmit={(updatedReport) => {
            onUpdate(report.id, { ...report, ...updatedReport });
            setIsEditModalOpen(false);
          }}
        />
      </Modal>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteUpdateId(null);
        }}
        onConfirm={confirmDelete}
        message={
          deleteUpdateId !== null
            ? "¿Estás seguro de que quieres eliminar esta actualización?"
            : "¿Estás seguro de que quieres eliminar este reporte?"
        }
      />
    </div>
  );
};

export default ReportDetails;