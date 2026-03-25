
import React, { useState } from 'react';
import { Search, UserPlus, Filter, MoreVertical, Eye } from 'lucide-react';
import { Cliente, CaseStatus } from '../types';
import { CAUSA_TYPES } from '../constants';

interface ClientsProps {
  clientes: Cliente[];
  onViewDetails: (id: string) => void;
  onAddClient: (data: Partial<Cliente>) => Promise<void> | void;
}

const Clients: React.FC<ClientsProps> = ({ clientes, onViewDetails, onAddClient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Cliente>>({
    nombreCompleto: '',
    dni: '',
    whatsapp: '',
    email: '',
    tipoCausa: CAUSA_TYPES[0],
    descripcionCaso: '',
    estadoActual: CaseStatus.ACTIVO
  });

  const filtered = clientes.filter(c =>
    c.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.dni.includes(searchTerm)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddClient(formData);
      setShowModal(false);
      setFormData({
        nombreCompleto: '',
        dni: '',
        whatsapp: '',
        email: '',
        tipoCausa: CAUSA_TYPES[0],
        descripcionCaso: '',
        estadoActual: CaseStatus.ACTIVO
      });
    } catch (error: any) {
      alert(error.message || 'Ocurrió un error al registrar el cliente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Expedientes de Clientes</h1>
          <p className="text-slate-500">Gestión de la base de datos de representados.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#002B5B] text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-[#003d82] shadow-sm transition-all"
        >
          <UserPlus size={20} />
          Nuevo Cliente
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre o identificación..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50">
            <Filter size={18} />
            Filtrar
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Identificación</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Cliente</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Tipo de Causa</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Estado</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{cliente.dni}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">{cliente.nombreCompleto}</span>
                      <span className="text-xs text-slate-500">{cliente.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{cliente.tipoCausa}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${cliente.estadoActual === CaseStatus.ACTIVO ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                      cliente.estadoActual === CaseStatus.CERRADO ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                      {cliente.estadoActual}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onViewDetails(cliente.id)}
                      className="text-[#8E735B] hover:text-[#002B5B] p-2 hover:bg-white rounded-lg transition-all"
                      title="Ver Detalles"
                    >
                      <Eye size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] flex flex-col">
            <div className="bg-[#002B5B] p-6 text-white flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-xl font-serif font-bold">Alta de Nuevo Cliente</h3>
                <p className="text-white/70 text-sm">Complete los datos legales obligatorios</p>
              </div>
              <button onClick={() => setShowModal(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                <MoreVertical size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto flex-1 min-h-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Nombre Completo</label>
                  <input required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={formData.nombreCompleto} onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">DNI / Identificación</label>
                  <input required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={formData.dni} onChange={(e) => setFormData({ ...formData, dni: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Teléfono (WhatsApp)</label>
                  <input type="tel" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={formData.whatsapp} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Correo Electrónico</label>
                  <input type="email" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Tipo de Causa</label>
                  <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={formData.tipoCausa} onChange={(e) => setFormData({ ...formData, tipoCausa: e.target.value })}>
                    {CAUSA_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Estado Inicial</label>
                  <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={formData.estadoActual} onChange={(e) => setFormData({ ...formData, estadoActual: e.target.value as CaseStatus })}>
                    {Object.values(CaseStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-slate-700">Breve descripción del caso</label>
                  <textarea rows={3} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none" value={formData.descripcionCaso} onChange={(e) => setFormData({ ...formData, descripcionCaso: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" disabled={isSubmitting} onClick={() => setShowModal(false)} className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-[#002B5B] text-white font-bold rounded-xl hover:bg-[#003d82] shadow-lg disabled:opacity-50">{isSubmitting ? 'Registrando...' : 'Registrar Cliente'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
