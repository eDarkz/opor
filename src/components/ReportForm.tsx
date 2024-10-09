import React, { useState } from 'react';
import { OpportunityReport } from '../types';

interface ReportFormProps {
  onSubmit: (report: Omit<OpportunityReport, 'id' | 'updates' | 'status' | 'createdAt'>) => void;
  initialData?: Omit<OpportunityReport, 'id' | 'updates' | 'status' | 'createdAt'>;
}

const ReportForm: React.FC<ReportFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<Omit<OpportunityReport, 'id' | 'updates' | 'status' | 'createdAt'>>(
    initialData || {
      guestName: '',
      roomNumber: '',
      reservationNumber: '',
      reportedBy: '',
      department: 'frontdesk',
      arrivalDate: '',
      departureDate: '',
      incidentReport: '',
      guestMood: 'tranquilo',
      agency: '', // Nuevo campo
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClass = "input h-12 px-4";
  const textareaClass = "input h-32 px-4 py-3";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="guestName" className="label">Nombre del huésped</label>
        <input
          type="text"
          id="guestName"
          name="guestName"
          value={formData.guestName}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="roomNumber" className="label">Número de habitación</label>
        <input
          type="text"
          id="roomNumber"
          name="roomNumber"
          value={formData.roomNumber}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="reservationNumber" className="label">Número de reserva</label>
        <input
          type="text"
          id="reservationNumber"
          name="reservationNumber"
          value={formData.reservationNumber}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="agency" className="label">Agencia</label>
        <input
          type="text"
          id="agency"
          name="agency"
          value={formData.agency}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="reportedBy" className="label">Reportado por</label>
        <input
          type="text"
          id="reportedBy"
          name="reportedBy"
          value={formData.reportedBy}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="department" className="label">Departamento</label>
        <select
          id="department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
          className={inputClass}
        >
          <option value="frontdesk">Front Desk</option>
          <option value="concierge">Concierge</option>
          <option value="club preferred">Club Preferred</option>
          <option value="telefonos">Teléfonos</option>
          <option value="room service">Room Service</option>
          <option value="servicio de ayb">Servicio de A&B</option>
          <option value="otro">Otro</option>
        </select>
      </div>
      <div>
        <label htmlFor="arrivalDate" className="label">Fecha de llegada</label>
        <input
          type="date"
          id="arrivalDate"
          name="arrivalDate"
          value={formData.arrivalDate}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="departureDate" className="label">Fecha de salida</label>
        <input
          type="date"
          id="departureDate"
          name="departureDate"
          value={formData.departureDate}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="incidentReport" className="label">Reporte de hechos</label>
        <textarea
          id="incidentReport"
          name="incidentReport"
          value={formData.incidentReport}
          onChange={handleChange}
          required
          className={textareaClass}
        ></textarea>
      </div>
      <div>
        <label htmlFor="guestMood" className="label">Estado de ánimo del cliente</label>
        <select
          id="guestMood"
          name="guestMood"
          value={formData.guestMood}
          onChange={handleChange}
          required
          className={inputClass}
        >
          <option value="tranquilo">Tranquilo</option>
          <option value="enojado">Enojado</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
      >
        {initialData ? 'Actualizar Reporte' : 'Crear Reporte'}
      </button>
    </form>
  );
};

export default ReportForm;