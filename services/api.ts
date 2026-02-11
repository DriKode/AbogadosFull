
import { Cliente, Cita, Actuacion, CaseStatus } from '../types';
import { mockClientes, mockCitas } from './mockData';

// Base de datos simulada en memoria (Persistente durante la sesión)
let db_clientes = [...mockClientes];
let db_citas = [...mockCitas];

export const api = {
  getClients: async (): Promise<Cliente[]> => {
    // Retornamos una copia para evitar mutaciones directas externas
    return new Promise((res) => setTimeout(() => res([...db_clientes]), 100));
  },

  getClientById: async (id: string): Promise<Cliente | undefined> => {
    return new Promise((res) => res(db_clientes.find(c => c.id === id)));
  },

  createClient: async (clientData: Partial<Cliente>): Promise<Cliente> => {
    const normalizedDni = clientData.dni?.toString().trim().toUpperCase();
    
    if (!normalizedDni) {
      throw new Error("El DNI es un campo obligatorio.");
    }

    // Verificación de duplicación por DNI (Case Insensitive + Trim)
    const exists = db_clientes.some(c => 
      c.dni.trim().toUpperCase() === normalizedDni
    );

    if (exists) {
      throw new Error(`Error: El cliente con identificación ${normalizedDni} ya se encuentra registrado.`);
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
    
    db_clientes.push(newClient);
    return newClient;
  },

  updateClientStatus: async (clientId: string, newStatus: CaseStatus): Promise<void> => {
    const index = db_clientes.findIndex(c => c.id === clientId);
    if (index !== -1) {
      db_clientes[index] = { ...db_clientes[index], estadoActual: newStatus };
    }
  },

  createAppointment: async (citaData: Partial<Cita>): Promise<Cita> => {
    if (!citaData.clienteId || !citaData.fecha || !citaData.hora) {
      throw new Error("Datos de cita incompletos.");
    }

    // Validación crítica para evitar duplicidad de citas (Mismo cliente en mismo bloque horario)
    const isDuplicate = db_citas.some(c => 
      c.clienteId === citaData.clienteId && 
      c.fecha === citaData.fecha && 
      c.hora === citaData.hora &&
      !c.atendida // Solo validamos duplicidad en citas pendientes
    );

    if (isDuplicate) {
      throw new Error(`El cliente ya tiene una cita programada para el ${citaData.fecha} a las ${citaData.hora}. No se permite duplicar el registro.`);
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
    
    db_citas.push(newCita);
    console.log(`[EvolutionAPI] Confirmación WhatsApp enviada a ${newCita.clienteNombre}`);
    
    return newCita;
  },

  getAppointments: async (): Promise<Cita[]> => {
    return new Promise((res) => res([...db_citas]));
  },

  addActuacion: async (clientId: string, actuacion: Partial<Actuacion>): Promise<void> => {
    const client = db_clientes.find(c => c.id === clientId);
    if (client) {
      const newAct: Actuacion = {
        id: Math.random().toString(36).substr(2, 9),
        fecha: new Date().toISOString().split('T')[0],
        tipoProceso: actuacion.tipoProceso || '',
        estadoCaso: actuacion.estadoCaso || client.estadoActual,
        glosasJuridicas: actuacion.glosasJuridicas || '',
        observaciones: actuacion.observaciones || '',
        proximasAcciones: actuacion.proximasAcciones || '',
        documentos: actuacion.documentos || []
      };
      client.actuaciones.unshift(newAct);
      client.estadoActual = newAct.estadoCaso;

      // AL REALIZAR LA ATENCIÓN: La tarjeta de cita desaparece y se marca como atendida
      const pendingAppointment = db_citas.find(c => c.clienteId === clientId && !c.atendida);
      if (pendingAppointment) {
        pendingAppointment.atendida = true;
      }
    }
  }
};
