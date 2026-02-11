
import { Cliente, CaseStatus, Cita } from '../types';

export const mockClientes: Cliente[] = [
  {
    id: '1',
    nombreCompleto: 'Juan Pérez García',
    dni: '12345678A',
    whatsapp: '+34600112233',
    email: 'juan.perez@email.com',
    tipoCausa: 'Civil',
    descripcionCaso: 'Reclamación de cantidad por impago de alquiler.',
    fechaRegistro: '2024-01-15',
    estadoActual: CaseStatus.ACTIVO,
    actuaciones: [
      {
        id: 'act-1',
        fecha: '2024-01-20',
        tipoProceso: 'Demanda Inicial',
        estadoCaso: CaseStatus.ACTIVO,
        glosasJuridicas: 'Presentación de demanda en juzgado de 1ra instancia.',
        observaciones: 'El cliente aporta facturas pendientes.',
        proximasAcciones: 'Esperar notificación de admisión.',
        documentos: [
          { id: 'doc-1', nombre: 'Demanda_Firmada.pdf', tipo: 'pdf', fechaSubida: '2024-01-20', url: '#', tamanio: '1.2MB' }
        ]
      }
    ]
  },
  {
    id: '2',
    nombreCompleto: 'María López Sánchez',
    dni: '87654321B',
    whatsapp: '+34655443322',
    email: 'm.lopez@email.com',
    tipoCausa: 'Familia',
    descripcionCaso: 'Proceso de divorcio de mutuo acuerdo.',
    fechaRegistro: '2024-02-10',
    estadoActual: CaseStatus.EN_ESPERA,
    actuaciones: []
  }
];

export const mockCitas: Cita[] = [
  {
    id: 'c-1',
    clienteId: '1',
    clienteNombre: 'Juan Pérez García',
    fecha: '2024-05-20',
    hora: '10:30',
    tipoCausa: 'Civil',
    confirmada: true,
    atendida: false
  },
  {
    id: 'c-2',
    clienteId: '2',
    clienteNombre: 'María López Sánchez',
    fecha: '2024-05-20',
    hora: '12:00',
    tipoCausa: 'Familia',
    confirmada: false,
    atendida: false
  }
];
