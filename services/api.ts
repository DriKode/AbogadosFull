
import { Cliente, Cita, Actuacion, CaseStatus } from '../types';
import { mockClientes, mockCitas } from './mockData';

// Claves para el almacenamiento local
const STORAGE_KEYS = {
  CLIENTES: 'bufete_clientes_db',
  CITAS: 'bufete_citas_db'
};

// Función auxiliar para cargar datos desde localStorage con fallback
const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Error cargando ${key} desde localStorage:`, error);
    return defaultValue;
  }
};

// Función auxiliar para persistir datos en localStorage
const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error guardando ${key} en localStorage:`, error);
  }
};

// Inicialización de la "base de datos" local
let db_clientes: Cliente[] = loadFromStorage(STORAGE_KEYS.CLIENTES, [...mockClientes]);
let db_citas: Cita[] = loadFromStorage(STORAGE_KEYS.CITAS, [...mockCitas]);

export const api = {
  getClients: async (): Promise<Cliente[]> => {
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
    saveToStorage(STORAGE_KEYS.CLIENTES, db_clientes);
    return newClient;
  },

  updateClientStatus: async (clientId: string, newStatus: CaseStatus): Promise<void> => {
    const index = db_clientes.findIndex(c => c.id === clientId);
    if (index !== -1) {
      db_clientes[index] = { ...db_clientes[index], estadoActual: newStatus };
      saveToStorage(STORAGE_KEYS.CLIENTES, db_clientes);
    }
  },

  createAppointment: async (citaData: Partial<Cita>): Promise<Cita> => {
    if (!citaData.clienteId || !citaData.fecha || !citaData.hora) {
      throw new Error("Datos de cita incompletos.");
    }

    const isDuplicate = db_citas.some(c => 
      c.clienteId === citaData.clienteId && 
      c.fecha === citaData.fecha && 
      c.hora === citaData.hora &&
      !c.atendida
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
    saveToStorage(STORAGE_KEYS.CITAS, db_citas);
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

      const pendingAppointment = db_citas.find(c => c.clienteId === clientId && !c.atendida);
      if (pendingAppointment) {
        pendingAppointment.atendida = true;
      }
      
      saveToStorage(STORAGE_KEYS.CLIENTES, db_clientes);
      saveToStorage(STORAGE_KEYS.CITAS, db_citas);
    }
  }
};
