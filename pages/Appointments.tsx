
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Users, Send, ArrowUpRight } from 'lucide-react';
import { Cita, Cliente } from '../types';
import { api } from '../services/api';

interface AppointmentsProps {
  citas: Cita[];
  clientes: Cliente[];
  onAddCita: (cita: Partial<Cita>) => Promise<void>;
  onSelectClient: (clientId: string) => void;
}

const Appointments: React.FC<AppointmentsProps> = ({ citas, clientes, onAddCita, onSelectClient }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Cita>>({
    clienteId: '',
    fecha: '',
    hora: '',
    tipoCausa: 'Consulta Inicial'
  });

  // Filtramos para mostrar solo las citas que NO han sido atendidas
  const citasPendientes = citas.filter(c => !c.atendida);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const client = clientes.find(c => c.id === formData.clienteId);
      await onAddCita({ ...formData, clienteNombre: client?.nombreCompleto });

      const mensaje = `*_Dra. KATHERINE nueva Cita Confirmada_*
*Cliente:* ${client?.nombreCompleto || 'No especificado'}
*Motivo:* ${formData.tipoCausa}
*Fecha:* ${formData.fecha}
*Hora:* ${formData.hora}`;
      const whatsappUrl = `https://wa.me/59169484232?text=${encodeURIComponent(mensaje)}`;
      window.open(whatsappUrl, '_blank');

      setShowModal(false);
      setFormData({ clienteId: '', fecha: '', hora: '', tipoCausa: 'Consulta Inicial' });
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Agenda de Citas</h1>
          <p className="text-slate-500">Gestión de tiempos y confirmaciones automáticas.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#002B5B] text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-[#003d82] shadow-sm transition-all"
        >
          <CalendarIcon size={20} />
          Nueva Cita
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {citasPendientes.map((cita) => (
          <div key={cita.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all animate-in fade-in duration-500 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="bg-[#002B5B]/10 p-2 rounded-xl">
                  <CalendarIcon size={20} className="text-[#002B5B]" />
                </div>
                {cita.confirmada && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-widest border border-emerald-100">
                    <Send size={10} /> WhatsApp OK
                  </span>
                )}
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-1">{cita.clienteNombre}</h4>
              <p className="text-sm text-slate-500 mb-4">{cita.tipoCausa}</p>

              <div className="space-y-2 pt-4 border-t border-slate-100 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock size={16} className="text-[#8E735B]" />
                  <span className="font-semibold">{cita.fecha}</span>
                  <span>a las</span>
                  <span className="font-bold text-[#002B5B]">{cita.hora}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectClient(cita.clienteId)}
              className="w-full py-2.5 bg-slate-50 border border-slate-200 text-[#002B5B] font-bold rounded-xl hover:bg-[#002B5B] hover:text-white transition-all flex items-center justify-center gap-2 group"
            >
              Realizar Atención
              <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        ))}

        {citasPendientes.length === 0 && (
          <div className="col-span-full py-20 bg-white rounded-3xl border border-dashed border-slate-300 text-center space-y-3">
            <CalendarIcon size={48} className="mx-auto text-slate-200" />
            <p className="text-slate-500 font-medium">No hay citas pendientes de atención.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-[#002B5B] p-6 text-white">
              <h3 className="text-xl font-serif font-bold">Agendar Nueva Cita</h3>
              <p className="text-white/70 text-sm">Se enviará una confirmación automática por WhatsApp</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Seleccionar Cliente</label>
                <select
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  value={formData.clienteId}
                  onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
                >
                  <option value="">Seleccione un cliente...</option>
                  {clientes.map(c => <option key={c.id} value={c.id}>{c.nombreCompleto}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Fecha</label>
                  <input
                    required
                    type="date"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Hora</label>
                  <input
                    required
                    type="time"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    value={formData.hora}
                    onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Motivo / Tipo de Causa</label>
                <input
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#002B5B]/20 outline-none"
                  placeholder="Ej: Revisión de contrato"
                  value={formData.tipoCausa}
                  onChange={(e) => setFormData({ ...formData, tipoCausa: e.target.value })}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-[#002B5B] text-white font-bold rounded-xl hover:bg-[#003d82] shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Validando...' : 'Confirmar Cita'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
