import React from 'react';
import { Cliente } from '../types';
import { Printer, X } from 'lucide-react';

interface ClientReportModalProps {
    cliente: Cliente;
    onClose: () => void;
}

const ClientReportModal: React.FC<ClientReportModalProps> = ({ cliente, onClose }) => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-start justify-center p-4 sm:p-8 bg-black/60 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:block shadow-none">
            <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300 relative print:shadow-none print:w-full print:max-w-none print:rounded-none">

                {/* Acciones flotantes (Ocultas en impresión) */}
                <div className="sticky top-0 right-0 p-4 flex justify-between sm:justify-end gap-3 bg-slate-50 border-b border-slate-100 print:hidden z-10 w-full shadow-sm">
                    <p className="sm:hidden text-sm font-bold text-slate-700 flex items-center">Informe Legal</p>
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2 bg-[#002B5B] text-white rounded-lg font-bold text-sm hover:bg-[#003d82] transition-colors shadow-sm"
                            title="Abre la ventana del sistema operativo para Descargar a PDF o Imprimir"
                        >
                            <Printer size={16} />
                            <span className="hidden sm:inline">Imprimir / Guardar PDF</span>
                            <span className="sm:hidden">PDF</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm"
                        >
                            <X size={16} />
                            <span className="hidden sm:inline">Cerrar</span>
                        </button>
                    </div>
                </div>

                {/* Zona imprimible */}
                <div className="p-6 md:p-10 print:p-8 bg-slate-50 print:bg-slate-50 min-h-screen" id="print-area">
                    <div className="max-w-5xl mx-auto space-y-8">
                        {/* Encabezado Principal */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm print:break-inside-avoid gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#002B5B] to-[#001730] rounded-xl flex items-center justify-center text-white font-serif text-3xl font-bold shadow-inner borderborder-white/10 shrink-0">
                                    B
                                </div>
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">Informe Legal Individual</h1>
                                    <p className="text-xs font-bold text-[#8E735B] uppercase tracking-widest mt-1">Gestión Jurídica Profesional</p>
                                </div>
                            </div>
                            <div className="text-left sm:text-right bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 w-full sm:w-auto">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Fecha de Expedición</p>
                                <p className="text-base sm:text-lg font-bold text-[#002B5B]">{new Date().toLocaleDateString('es-ES')}</p>
                            </div>
                        </div>

                        {/* Cards de Información */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-6">
                            {/* Datos del Cliente */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 print:break-inside-avoid">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                                    <div className="w-1.5 h-6 bg-[#8E735B] rounded-full"></div>
                                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Datos del Patrocinado</h2>
                                </div>
                                <div className="space-y-5">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nombre Completo</p>
                                        <p className="text-lg font-bold text-slate-900">{cliente.nombreCompleto}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">DNI / Documento</p>
                                            <p className="text-sm font-semibold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 inline-block">{cliente.dni}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Celular</p>
                                            <p className="text-sm font-semibold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 inline-block">{cliente.whatsapp}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Correo Electrónico</p>
                                            <p className="text-sm font-semibold text-slate-700">{cliente.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Información del Caso */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 print:break-inside-avoid">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                                    <div className="w-1.5 h-6 bg-[#002B5B] rounded-full"></div>
                                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Estado Legal del Caso</h2>
                                </div>
                                <div className="space-y-5">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tipo de Causa</p>
                                            <span className="inline-block bg-blue-50 text-blue-700 text-sm font-bold px-3 py-1 rounded-lg border border-blue-100">
                                                {cliente.tipoCausa}
                                            </span>
                                        </div>
                                        <div className="sm:text-right">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Estado Procesal</p>
                                            <span className="inline-block bg-[#002B5B] text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider">
                                                {cliente.estadoActual}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Descripción General</p>
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <p className="text-sm font-medium text-slate-700 leading-relaxed">{cliente.descripcionCaso}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Fecha de Ingreso del Caso</p>
                                        <p className="text-sm font-semibold text-slate-800">{cliente.fechaRegistro}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Línea de Tiempo de Actuaciones (Modificado a Cards) */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 print:bg-transparent print:border-none print:shadow-none print:p-0">
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 print:mb-6 print:pb-3 print:border-b-2 print:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-6 bg-slate-800 rounded-full print:hidden"></div>
                                    <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest">
                                        Registro de Actuaciones
                                    </h2>
                                </div>
                                <span className="bg-slate-100 text-slate-600 font-bold px-3 py-1.5 rounded-lg text-sm">
                                    Total: {cliente.actuaciones.length}
                                </span>
                            </div>

                            {cliente.actuaciones.length > 0 ? (
                                <div className="space-y-6">
                                    {cliente.actuaciones.map((act) => (
                                        <div key={act.id} className="bg-slate-50 rounded-2xl border border-slate-200 p-5 sm:p-6 print:bg-white print:border-slate-300 print:break-inside-avoid shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                                            {/* Decorador de borde izquierdo */}
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#002B5B] to-[#8E735B]"></div>

                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-5 border-b border-slate-200/60">
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                                                    <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm w-fit">
                                                        <span className="text-sm font-bold text-[#8E735B] tracking-wide">{act.fecha}</span>
                                                    </div>
                                                    <h4 className="text-base font-bold text-slate-900 uppercase">{act.tipoProceso}</h4>
                                                </div>
                                                <span className="text-[10px] font-bold bg-[#002B5B]/5 text-[#002B5B] border border-[#002B5B]/10 px-3 py-1.5 rounded-full uppercase tracking-widest w-fit shrink-0">
                                                    {act.estadoCaso}
                                                </span>
                                            </div>

                                            {(act.nurej || act.juzgado || act.fechaInicioDemanda || act.demandante || act.demandado) && (
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5 bg-white p-4 sm:p-5 rounded-xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
                                                    {act.nurej && (
                                                        <div>
                                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">NUREJ</span>
                                                            <span className="text-sm font-bold text-slate-800 bg-slate-50 px-2.5 py-1 rounded border border-slate-100">{act.nurej}</span>
                                                        </div>
                                                    )}
                                                    {(act.juzgado || act.fechaInicioDemanda) && (
                                                        <div className="col-span-1 md:col-span-1">
                                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Juzgado e Inicio</span>
                                                            <span className="text-xs font-semibold text-slate-700 leading-tight block">
                                                                {act.juzgado || 'Sin Juzgado'}
                                                                {act.fechaInicioDemanda ? <span className="block mt-0.5 text-[#002B5B]">{act.fechaInicioDemanda}</span> : ''}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {act.demandante && (
                                                        <div>
                                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Demandante</span>
                                                            <span className="text-xs font-semibold text-slate-700">{act.demandante}</span>
                                                        </div>
                                                    )}
                                                    {act.demandado && (
                                                        <div>
                                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Demandado</span>
                                                            <span className="text-xs font-semibold text-slate-700">{act.demandado}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <div className="mb-5">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                    Glosas Jurídicas
                                                    <span className="h-px bg-slate-200 flex-1"></span>
                                                </p>
                                                <div className="bg-white border-l-4 border-[#002B5B] p-4 rounded-r-xl shadow-sm">
                                                    <p className="text-sm text-slate-700 italic leading-relaxed">"{act.glosasJuridicas}"</p>
                                                </div>
                                            </div>

                                            {(act.observaciones || act.proximasAcciones) && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                    {act.observaciones && (
                                                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden">
                                                            <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200/50"></div>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Observaciones</p>
                                                            <p className="text-xs font-medium text-slate-600 leading-relaxed">{act.observaciones}</p>
                                                        </div>
                                                    )}
                                                    {act.proximasAcciones && (
                                                        <div className="bg-[#8E735B]/5 p-4 rounded-xl border border-[#8E735B]/20 shadow-sm relative overflow-hidden">
                                                            <div className="absolute top-0 left-0 right-0 h-1 bg-[#8E735B]/20"></div>
                                                            <p className="text-[10px] font-bold text-[#8E735B] uppercase tracking-widest mb-1.5">Próximas Acciones</p>
                                                            <p className="text-xs font-bold text-slate-800 leading-relaxed">{act.proximasAcciones}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                                    <p className="text-sm text-slate-500 font-medium tracking-wide">No existen actuaciones registradas para este expediente.</p>
                                </div>
                            )}
                        </div>

                        {/* Footer (Firmas) */}
                        <div className="mt-12 pt-16 pb-8 flex flex-col items-center justify-center print:break-inside-avoid">
                            <div className="w-64 h-px bg-slate-300 mb-6 print:bg-slate-400"></div>
                            <p className="text-xs font-bold text-slate-800 uppercase tracking-widest">Firma del Profesional a Cargo</p>
                            <p className="text-[10px] font-medium text-slate-400 mt-3 uppercase tracking-wider bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">Documento generado por el sistema de Gestión Jurídica</p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @media print {
          /* Evitar que contenedores con desbordamiento oculten el reporte o lo colapsen */
          *, html, body {
            overflow: visible !important;
            height: auto !important;
            max-height: none !important;
          }

          body * {
            visibility: hidden;
          }

          #print-area, #print-area * {
            visibility: visible;
          }

          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background-color: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          @page {
            size: auto;
            margin: 15mm;
          }
        }
      `}</style>
        </div>
    );
};

export default ClientReportModal;
