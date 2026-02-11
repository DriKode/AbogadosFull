
import React from 'react';
import { Users, Briefcase, Calendar, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import { Cita, Cliente, CaseStatus } from '../types';

interface DashboardProps {
  clientes: Cliente[];
  citas: Cita[];
  onNavigateToClients: () => void;
  onNavigateToAppointments: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ clientes, citas, onNavigateToClients, onNavigateToAppointments }) => {
  const activos = clientes.filter(c => c.estadoActual === CaseStatus.ACTIVO).length;
  const cerrados = clientes.filter(c => c.estadoActual === CaseStatus.CERRADO).length;
  const citasHoy = citas.length;

  const stats = [
    { label: 'Casos Activos', value: activos, icon: Briefcase, color: 'bg-blue-50 text-blue-600' },
    { label: 'Casos Cerrados', value: cerrados, icon: CheckCircle, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Citas Pendientes', value: citasHoy, icon: Calendar, color: 'bg-amber-50 text-amber-600' },
    { label: 'Total Clientes', value: clientes.length, icon: Users, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section>
        <h1 className="text-2xl font-serif font-bold text-slate-900">Bienvenido al Portal de Gestión</h1>
        <p className="text-slate-500 mt-1">Resumen ejecutivo del estado actual del bufete.</p>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity / Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Citas para Hoy</h3>
            <button onClick={onNavigateToAppointments} className="text-sm text-[#8E735B] font-semibold hover:underline flex items-center gap-1">
              Ver todas <ChevronRight size={14} />
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {citas.length > 0 ? (
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Hora</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Cliente</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Asunto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {citas.map((cita) => (
                    <tr key={cita.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-[#002B5B]">{cita.hora}</td>
                      <td className="px-6 py-4 text-sm text-slate-700 font-medium">{cita.clienteNombre}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{cita.tipoCausa}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-slate-400">
                No hay citas programadas para hoy.
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 gap-3">
            <button 
              onClick={onNavigateToAppointments}
              className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center gap-4 hover:shadow-md hover:border-[#8E735B]/30 transition-all group"
            >
              <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-[#8E735B]/10 transition-colors">
                <Calendar size={20} className="text-slate-600 group-hover:text-[#8E735B]" />
              </div>
              <span className="font-medium text-slate-700">Agendar Nueva Cita</span>
            </button>
            <button 
              onClick={onNavigateToClients}
              className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center gap-4 hover:shadow-md hover:border-[#8E735B]/30 transition-all group"
            >
              <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-[#8E735B]/10 transition-colors">
                <Users size={20} className="text-slate-600 group-hover:text-[#8E735B]" />
              </div>
              <span className="font-medium text-slate-700">Registrar Cliente</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
