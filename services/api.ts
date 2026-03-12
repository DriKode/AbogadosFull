
import { Cliente, Cita, Actuacion, CaseStatus } from '../types';

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';

export const api = {
  getClients: async (): Promise<Cliente[]> => {
    const res = await fetch(`${API_URL}/clients`);
    if (!res.ok) throw new Error("Error al obtener clientes");
    return res.json();
  },

  getClientById: async (id: string): Promise<Cliente | undefined> => {
    const res = await fetch(`${API_URL}/clients/${id}`);
    if (res.status === 404) return undefined;
    if (!res.ok) throw new Error("Error al obtener cliente");
    return res.json();
  },

  createClient: async (clientData: Partial<Cliente>): Promise<Cliente> => {
    const normalizedDni = clientData.dni?.toString().trim().toUpperCase();

    if (!normalizedDni) {
      throw new Error("El DNI es un campo obligatorio.");
    }

    const newClient: Cliente = {
      id: Math.random().toString(36).substr(2, 9),
      nombreCompleto: clientData.nombreCompleto?.trim() || '',
      dni: normalizedDni,
      whatsapp: clientData.whatsapp?.trim() || '',
      email: clientData.email?.trim() || '',
      tipoCausa: clientData.tipoCausa || '',
      descripcionCaso: clientData.descripcionCaso?.trim() || '',
      fechaRegistro: new Date().toISOString().split('T')[0],
      estadoActual: clientData.estadoActual || CaseStatus.ACTIVO,
      actuaciones: []
    };

    const res = await fetch(`${API_URL}/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newClient)
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Error al crear cliente");
    }

    return res.json();
  },

  updateClientStatus: async (clientId: string, newStatus: CaseStatus): Promise<void> => {
    await fetch(`${API_URL}/clients/${clientId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estadoActual: newStatus })
    });
  },

  createAppointment: async (citaData: Partial<Cita>): Promise<Cita> => {
    if (!citaData.clienteId || !citaData.fecha || !citaData.hora) {
      throw new Error("Datos de cita incompletos.");
    }

    const newCita: Cita = {
      id: Math.random().toString(36).substr(2, 9),
      clienteId: citaData.clienteId,
      clienteNombre: citaData.clienteNombre || 'Anónimo',
      fecha: citaData.fecha,
      hora: citaData.hora,
      tipoCausa: citaData.tipoCausa || '',
      confirmada: true,
      atendida: false
    };

    const res = await fetch(`${API_URL}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCita)
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Error al crear cita");
    }

    console.log(`[EvolutionAPI] Confirmación WhatsApp enviada a ${newCita.clienteNombre}`);
    return res.json();
  },

  getAppointments: async (): Promise<Cita[]> => {
    const res = await fetch(`${API_URL}/appointments`);
    if (!res.ok) throw new Error("Error al obtener citas");
    return res.json();
  },

  addActuacion: async (clientId: string, actuacion: Partial<Actuacion>): Promise<void> => {
    const newAct: Actuacion = {
      id: Math.random().toString(36).substr(2, 9),
      fecha: new Date().toISOString().split('T')[0],
      tipoProceso: actuacion.tipoProceso || '',
      estadoCaso: actuacion.estadoCaso || CaseStatus.ACTIVO,
      glosasJuridicas: actuacion.glosasJuridicas || '',
      observaciones: actuacion.observaciones || '',
      proximasAcciones: actuacion.proximasAcciones || '',
      documentos: actuacion.documentos || []
    };

    const res = await fetch(`${API_URL}/clients/${clientId}/actuaciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAct)
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Error al añadir actuación");
    }
  }
};
