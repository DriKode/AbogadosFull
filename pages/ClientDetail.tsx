
import React, { useState, useRef } from 'react';
import { ArrowLeft, Clock, FileText, Plus, CheckCircle, AlertCircle, FilePlus, ChevronDown, Trash2 } from 'lucide-react';
import { Cliente, CaseStatus, Actuacion } from '../types';
import { api } from '../services/api';

interface ClientDetailProps {
  cliente: Cliente;
  onBack: () => void;
  onAddActuacion: (clientId: string, data: Partial<Actuacion>) => void;
  onUpdateStatus: (clientId: string, status: CaseStatus) => void;
  onDocumentUploaded?: () => void;
}

const ClientDetail: React.FC<ClientDetailProps> = ({ cliente, onBack, onAddActuacion, onUpdateStatus, onDocumentUploaded }) => {
  const [showAddLog, setShowAddLog] = useState(false);
  const [logForm, setLogForm] = useState<Partial<Actuacion>>({
    tipoProceso: '',
    estadoCaso: cliente.estadoActual,
    glosasJuridicas: '',
    observaciones: '',
    proximasAcciones: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar en frontend también
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert("Tipo de archivo no permitido. Solo PDF e Imágenes (JPG, PNG, WEBP).");
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsUploading(true);
    try {
      await api.uploadDocument(cliente.id, file);
      if (onDocumentUploaded) {
        onDocumentUploaded();
      }
    } catch (e: any) {
      alert(e.message || "Error al subir el documento");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteDocument = async (e: React.MouseEvent, doc: any) => {
    e.stopPropagation(); // Avoid triggering the row click

    // Confirmación de seguridad
    const isConfirmed = window.confirm("¿Desea eliminar este documento? Esta acción no se puede deshacer.");
    if (!isConfirmed) return;

    const docId = doc.id_documento || doc.id;
    const isActuacion = !doc.id_documento; // Si no tiene id_documento es del esquema antiguo (Actuaciones)

    setIsDeleting(docId);
    try {
      await api.deleteDocument(cliente.id, docId, isActuacion);
      if (onDocumentUploaded) {
        onDocumentUploaded(); // Refrescar UI (re-usa el prop de callback superior)
      }
    } catch (err: any) {
      alert(err.message || 'Error al eliminar el documento');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSubmitLog = (e: React.FormEvent) => {
    e.preventDefault();
    onAddActuacion(cliente.id, logForm);
    setShowAddLog(false);
    setLogForm({
      tipoProceso: '',
      estadoCaso: cliente.estadoActual,
      glosasJuridicas: '',
      observaciones: '',
      proximasAcciones: ''
    });
  };

  const allDocs = [
    ...cliente.actuaciones.flatMap(a => a.documentos),
    ...(cliente.documentosLegales || [])
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-[#002B5B] font-medium transition-colors"
        >
          <ArrowLeft size={20} />
          Volver al listado
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddLog(true)}
            className="bg-[#002B5B] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#003d82] shadow-sm"
          >
            <Plus size={16} />
            Nueva Actuación
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-[#002B5B] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <FileText size={160} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
          <div className="space-y-4">
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-wider border border-white/20">Expediente #{cliente.id}</span>
            <h1 className="text-4xl font-serif font-bold">{cliente.nombreCompleto}</h1>
            <div className="flex flex-wrap gap-4 text-white/80">
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <span className="font-bold text-white">DNI:</span> {cliente.dni}
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <span className="font-bold text-white">Email:</span> {cliente.email}
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <span className="font-bold text-white">WhatsApp:</span> {cliente.whatsapp}
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-end text-right space-y-2">
            <p className="text-white/60 text-sm font-medium">Estado Procesal</p>
            <div className="relative inline-block text-left">
              <select
                value={cliente.estadoActual}
                onChange={(e) => onUpdateStatus(cliente.id, e.target.value as CaseStatus)}
                className="bg-white/10 border border-white/20 text-white font-bold py-2 px-4 rounded-xl cursor-pointer hover:bg-white/20 transition-all outline-none appearance-none pr-10"
              >
                {Object.values(CaseStatus).map(status => (
                  <option key={status} value={status} className="bg-[#002B5B] text-white">{status}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white">
                <ChevronDown size={18} />
              </div>
            </div>
            <p className="text-white/60 text-sm">Registrado el {cliente.fechaRegistro}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Clock size={20} className="text-[#8E735B]" />
              Línea de Tiempo de Actuaciones
            </h2>
          </div>

          <div className="relative space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {cliente.actuaciones.length > 0 ? (
              cliente.actuaciones.map((act) => (
                <div key={act.id} className="relative pl-12">
                  <div className="absolute left-0 top-1 w-10 h-10 bg-white border-2 border-[#002B5B] rounded-full flex items-center justify-center z-10 shadow-sm">
                    <CheckCircle size={20} className="text-[#002B5B]" />
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-xs font-bold text-[#8E735B] uppercase tracking-widest">{act.fecha}</span>
                        <h4 className="text-lg font-bold text-slate-900">{act.tipoProceso}</h4>
                      </div>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-full uppercase">
                        {act.estadoCaso}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="p-3 bg-slate-50 rounded-xl border-l-4 border-[#002B5B]">
                        <p className="text-sm font-bold text-slate-700 mb-1">Glosas Jurídicas:</p>
                        <p className="text-sm text-slate-600 italic">"{act.glosasJuridicas}"</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase mb-2">Observaciones</p>
                          <p className="text-sm text-slate-600">{act.observaciones}</p>
                        </div>
                        <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                          <p className="text-xs font-bold text-amber-700 uppercase mb-2">Próximas Acciones</p>
                          <p className="text-sm text-amber-800 font-medium">{act.proximasAcciones}</p>
                        </div>
                      </div>
                      {act.documentos.length > 0 && (
                        <div className="pt-4 border-t border-slate-100">
                          <p className="text-xs font-bold text-slate-400 uppercase mb-3">Adjuntos ({act.documentos.length})</p>
                          <div className="flex flex-wrap gap-2">
                            {act.documentos.map(doc => (
                              <a key={doc.id} href={doc.url} className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                                <FileText size={16} className="text-slate-500" />
                                <span className="text-xs font-medium text-slate-700">{doc.nombre}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl p-12 border border-slate-100 text-center space-y-4">
                <div className="flex justify-center">
                  <AlertCircle size={48} className="text-slate-300" />
                </div>
                <p className="text-slate-500 font-medium">Aún no se han registrado actuaciones legales para este cliente.</p>
                <button
                  onClick={() => setShowAddLog(true)}
                  className="text-[#8E735B] font-bold underline"
                >
                  Registrar la primera atención
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Información del Caso</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Tipo de Causa</p>
                <p className="text-sm font-semibold text-[#002B5B]">{cliente.tipoCausa}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Descripción General</p>
                <p className="text-sm text-slate-600">{cliente.descripcionCaso}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">Repositorio Legal</h3>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="application/pdf,image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
              />
              <button
                onClick={handleUploadClick}
                disabled={isUploading}
                title="Subir documento"
                className="text-[#8E735B] hover:bg-slate-50 p-1 rounded-md transition-colors disabled:opacity-50"
              >
                {isUploading ? <div className="h-5 w-5 rounded-full border-2 border-[#8E735B] border-t-transparent animate-spin"></div> : <FilePlus size={20} />}
              </button>
            </div>
            <div className="space-y-3">
              {allDocs.length > 0 ? (
                allDocs.map((doc: any) => (
                  <div key={doc.id || doc.id_documento} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group"
                    onClick={() => {
                      if (doc.url || doc.ruta_archivo) window.open(doc.url || doc.ruta_archivo, '_blank');
                    }}
                  >
                    <div className="flex items-center gap-3 w-full pr-2">
                      <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-[#002B5B]/10 transition-colors shrink-0">
                        <FileText size={18} className="text-slate-500 group-hover:text-[#002B5B]" />
                      </div>
                      <div className="truncate flex-1">
                        <p className="text-xs font-bold text-slate-800 truncate" title={doc.nombre || doc.nombre_archivo}>{doc.nombre || doc.nombre_archivo}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-medium mt-0.5">{doc.fechaSubida || doc.fecha_subida} · {doc.tamanio || (doc.tipo_archivo && doc.tipo_archivo.split('/')[1].toUpperCase())}</p>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => handleDeleteDocument(e, doc)}
                      disabled={isDeleting === (doc.id_documento || doc.id)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50 shrink-0"
                      title="Eliminar documento"
                    >
                      {isDeleting === (doc.id_documento || doc.id) ? (
                        <div className="h-4 w-4 rounded-full border-2 border-red-500 border-t-transparent animate-spin"></div>
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400 italic text-center py-4">Sin documentos adjuntos</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showAddLog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300">
            <div className="bg-[#002B5B] p-6 text-white">
              <h3 className="text-xl font-serif font-bold">Nueva Actuación Jurídica</h3>
              <p className="text-white/70 text-sm">Registro cronológico de atención y documentos</p>
            </div>
            <form onSubmit={handleSubmitLog} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Tipo de Proceso</label>
                  <input required placeholder="Ej: Contestación de demanda" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={logForm.tipoProceso} onChange={(e) => setLogForm({ ...logForm, tipoProceso: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Estado del Caso</label>
                  <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={logForm.estadoCaso} onChange={(e) => setLogForm({ ...logForm, estadoCaso: e.target.value as CaseStatus })}>
                    {Object.values(CaseStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-slate-700">Glosas Jurídicas</label>
                  <textarea required rows={2} placeholder="Resumen jurídico técnico..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none" value={logForm.glosasJuridicas} onChange={(e) => setLogForm({ ...logForm, glosasJuridicas: e.target.value })} />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-slate-700">Observaciones Detalladas</label>
                  <textarea rows={3} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none" value={logForm.observaciones} onChange={(e) => setLogForm({ ...logForm, observaciones: e.target.value })} />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-slate-700">Próximas Acciones</label>
                  <input className="w-full px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl outline-none text-amber-900" placeholder="¿Cuál es el siguiente paso legal?" value={logForm.proximasAcciones} onChange={(e) => setLogForm({ ...logForm, proximasAcciones: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAddLog(false)} className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50">Cancelar</button>
                <button type="submit" className="flex-1 py-3 bg-[#002B5B] text-white font-bold rounded-xl hover:bg-[#003d82] shadow-lg transition-all">Registrar Actuación</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDetail;
