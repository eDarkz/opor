import React, { useState, useEffect } from 'react';
import { OpportunityReport } from './types';
import Modal from './components/Modal';
import ReportForm from './components/ReportForm';
import ReportCard from './components/ReportCard';
import ReportDetails from './components/ReportDetails';
import { PlusCircle, Search } from 'lucide-react';
import { API_URL } from './config';

function App() {
  const [reports, setReports] = useState<OpportunityReport[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'todos' | 'abierto' | 'en proceso' | 'cerrado'>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch(`${API_URL}/api/reports`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setReports(data.map((report: any) => ({
        id: report.id.toString(),
        guestName: report.nombre,
        roomNumber: report.numero_habitacion.toString(),
        reservationNumber: report.folio,
        reportedBy: report.reportadopor,
        department: report.departamento,
        arrivalDate: report.fecha_entrada,
        departureDate: report.fecha_salida,
        incidentReport: report.descripcion_reporte,
        guestMood: report.estado_animo,
        updates: [],
        status: report.estado_oportunidad,
        agency: report.agencia,
        createdAt: report.fecha_creacion,
      })));
      setError(null);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Error al cargar los reportes. Por favor, intente de nuevo más tarde.');
    }
  };

  const fetchReportDetails = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/api/reports/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setReports(prevReports => prevReports.map(report => 
        report.id === id 
          ? {
              ...report,
              updates: data.updates.map((update: any) => ({
                id: update.id.toString(),
                text: update.actualizacion,
                timestamp: update.fecha_actualizacion
              }))
            }
          : report
      ));
    } catch (error) {
      console.error('Error fetching report details:', error);
      setError('Error al cargar los detalles del reporte. Por favor, intente de nuevo.');
    }
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'todos' || report.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-100">Registro de Reportes de Oportunidad</h1>
        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-4">
            {error}
          </div>
        )}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            {['todos', 'abierto', 'en proceso', 'cerrado'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nombre o habitación"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors duration-200"
            >
              <PlusCircle size={20} />
              <span>Agregar Reporte</span>
            </button>
          </div>
        </div>
        <div className="flex space-x-6">
          <div className="w-1/3 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            {filteredReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onClick={() => {
                  setSelectedReportId(report.id);
                  fetchReportDetails(report.id);
                }}
                isSelected={selectedReportId === report.id}
              />
            ))}
            {filteredReports.length === 0 && (
              <div className="text-white text-center mt-8">No se encontraron reportes.</div>
            )}
          </div>
          <div className="w-2/3">
            {selectedReportId ? (
              <ReportDetails
                report={reports.find((r) => r.id === selectedReportId)!}
                onUpdate={async (id, updatedReport) => {
                  try {
                    const response = await fetch(`${API_URL}/api/reports/${id}`, {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(updatedReport),
                    });
                    if (!response.ok) {
                      throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    await fetchReports();
                    await fetchReportDetails(id);
                  } catch (error) {
                    console.error('Error updating report:', error);
                    setError('Error al actualizar el reporte. Por favor, intente de nuevo.');
                  }
                }}
                onDelete={async (id) => {
                  try {
                    const response = await fetch(`${API_URL}/api/reports/${id}`, {
                      method: 'DELETE',
                    });
                    if (!response.ok) {
                      throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    await fetchReports();
                    setSelectedReportId(null);
                  } catch (error) {
                    console.error('Error deleting report:', error);
                    setError('Error al eliminar el reporte. Por favor, intente de nuevo.');
                  }
                }}
                onAddUpdate={async (id, update) => {
                  try {
                    const response = await fetch(`${API_URL}/api/reports/${id}/updates`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ actualizacion: update }),
                    });
                    if (!response.ok) {
                      throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    await fetchReportDetails(id);
                  } catch (error) {
                    console.error('Error adding update:', error);
                    setError('Error al añadir la actualización. Por favor, intente de nuevo.');
                  }
                }}
                onDeleteUpdate={async (reportId, updateId) => {
                  try {
                    const response = await fetch(`${API_URL}/api/reports/${reportId}/updates/${updateId}`, {
                      method: 'DELETE',
                    });
                    if (!response.ok) {
                      throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    await fetchReportDetails(reportId);
                  } catch (error) {
                    console.error('Error deleting update:', error);
                    setError('Error al eliminar la actualización. Por favor, intente de nuevo.');
                  }
                }}
              />
            ) : (
              <div className="text-white text-center mt-8">Seleccione un reporte para ver los detalles.</div>
            )}
          </div>
        </div>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ReportForm
            onSubmit={async (newReport) => {
              try {
                const response = await fetch(`${API_URL}/api/reports`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(newReport),
                });
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }
                await fetchReports();
                setIsModalOpen(false);
              } catch (error) {
                console.error('Error creating report:', error);
                setError('Error al crear el reporte. Por favor, intente de nuevo.');
              }
            }}
          />
        </Modal>
      </div>
    </div>
  );
}

export default App;