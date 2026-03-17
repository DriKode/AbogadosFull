
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

export interface DocumentoLegal {
  id_documento: string;
  cliente_id: string;
  nombre_archivo: string;
  tipo_archivo: string;
  ruta_archivo: string;
  fecha_subida: string;
  usuario_que_subio?: string;
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
  nurej?: string;
  juzgado?: string;
  fechaInicioDemanda?: string;
  demandante?: string;
  demandado?: string;
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
  documentosLegales?: DocumentoLegal[];
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
