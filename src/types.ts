export interface OpportunityReport {
  id: string;
  guestName: string;
  roomNumber: string;
  reservationNumber: string;
  reportedBy: string;
  department: 'frontdesk' | 'concierge' | 'club preferred' | 'telefonos' | 'room service' | 'servicio de ayb' | 'otro';
  arrivalDate: string;
  departureDate: string;
  incidentReport: string;
  guestMood: 'tranquilo' | 'enojado';
  updates: Array<{ id: string; text: string; timestamp: string }>;
  status: 'abierto' | 'en proceso' | 'cerrado';
  agency: string;
  createdAt: string;
}