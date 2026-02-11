
export enum UserRole {
  ADMIN = 'ADMIN',
  ABOGADO = 'ABOGADO'
}

export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: UserRole;
}

export enum CaseStatus {
  ACTIVO = 'ACTIVO',
  CERRADO = 'CERRADO',
  EN_ESPERA = 'EN_ESPERA',
  ARCHIVADO = 'ARCHIVADO'
}

export interface Documento {
  id: string;
  nombre: string;
  tipo: string; // PDF, Imagen, etc.
  fechaSubida: string;
  url: string;
  tamanio: string;
}

export interface Actuacion {
  id: string;
  fecha: string;
  tipoProceso: string;
  estadoCaso: CaseStatus;
  glosasJuridicas: string;
  observaciones: string;
  proximasAcciones: string;
  documentos: Documento[];
}

export interface Cliente {
  id: string;
  nombreCompleto: string;
  dni: string;
  whatsapp: string;
  email: string;
  tipoCausa: string;
  descripcionCaso: string;
  fechaRegistro: string;
  estadoActual: CaseStatus;
  actuaciones: Actuacion[];
}

export interface Cita {
  id: string;
  clienteId: string;
  clienteNombre: string;
  fecha: string;
  hora: string;
  tipoCausa: string;
  confirmada: boolean;
  atendida: boolean;
}
