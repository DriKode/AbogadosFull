
import React, { useEffect, useState } from 'react';
// Added Clock to the imports from lucide-react
import { Download, PieChart as PieIcon, BarChart3, TrendingUp, Users, Clock } from 'lucide-react';
import { Cliente, CaseStatus } from '../types';
import { CAUSA_TYPES, THEME } from '../constants';

interface ReportsProps {
  clientes: Cliente[];
}

const Reports: React.FC<ReportsProps> = ({ clientes }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const exportIndividual = (c: Cliente) => {
    alert(`Generando Reporte Individual para ${c.nombreCompleto}...\nEstructura: Perfil + Historial de Actuaciones + Documentos.`);
  };

  // Procesamiento de datos para los gráficos
  const statusCounts = {
    [CaseStatus.ACTIVO]: clientes.filter(c => c.estadoActual === CaseStatus.ACTIVO).length,
    [CaseStatus.CERRADO]: clientes.filter(c => c.estadoActual === CaseStatus.CERRADO).length,
    [CaseStatus.EN_ESPERA]: clientes.filter(c => c.estadoActual === CaseStatus.EN_ESPERA).length,
    [CaseStatus.ARCHIVADO]: clientes.filter(c => c.estadoActual === CaseStatus.ARCHIVADO).length,
  };

  const causaCounts = CAUSA_TYPES.map(type => ({
    name: type,
    count: clientes.filter(c => c.tipoCausa === type).length
  })).filter(item => item.count > 0);

  const totalClients = clientes.length || 1;

  // Componente de Gráfico de Barras Animado (Estado)
  const StatusBarChart = () => (
    <div className="space-y-4">
      {Object.entries(statusCounts).map(([status, count], index) => {
        const percentage = (count / totalClients) * 100;
        const barColor = 
          status === CaseStatus.ACTIVO ? '#3B82F6' : 
          status === CaseStatus.CERRADO ? '#10B981' : 
          status === CaseStatus.EN_ESPERA ? '#F59E0B' : '#64748B';
        
        return (
          <div key={status} className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-600 uppercase">
              <span>{status}</span>
              <span>{count} ({Math.round(percentage)}%)</span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ 
                  width: animate ? `${percentage}%` : '0%',
                  backgroundColor: barColor,
                  transitionDelay: `${index * 150}ms`
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );

  // Componente de Gráfico Donut Animado (Causas)
  const CausesDonutChart = () => {
    let currentOffset = 0;
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const colors = ['#002B5B', '#8E735B', '#334155', '#475569', '#64748B', '#94A3B8'];

    return (
      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
            {causaCounts.map((item, i) => {
              const slicePercentage = (item.count / totalClients) * 100;
              const strokeDasharray = `${(slicePercentage * circumference) / 100} ${circumference}`;
              const strokeDashoffset = -currentOffset;
              currentOffset += (slicePercentage * circumference) / 100;

              return (
                <circle
                  key={item.name}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke={colors[i % colors.length]}
                  strokeWidth="12"
                  strokeDasharray={animate ? strokeDasharray : `0 ${circumference}`}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-in-out"
                  style={{ transitionDelay: `${i * 100}ms` }}
                />
              );
            })}
            <circle cx="50" cy="50" r="28" fill="white" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold text-slate-800 leading-none">{clientes.length}</span>
            <span className="text-[8px] text-slate-400 uppercase font-bold">Total</span>
          </div>
        </div>
        <div className="flex-1 space-y-1.5">
          {causaCounts.map((item, i) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
              <span className="text-[10px] font-bold text-slate-600 truncate">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Informes y Analítica</h1>
          <p className="text-slate-500">Inteligencia de datos para la optimización del despacho.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 shadow-sm transition-all">
            <Download size={16} />
            Exportar XLS
          </button>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 group hover:shadow-md transition-all">
           <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Efectividad</p>
              <TrendingUp size={16} className="text-emerald-500" />
           </div>
           <div className="flex items-baseline gap-2">
             <p className="text-3xl font-bold text-slate-900">92%</p>
             <span className="text-xs font-bold text-emerald-600">+4.1%</span>
           </div>
           <div className="mt-4 h-1.5 bg-slate-50 rounded-full overflow-hidden">
             <div 
               className="h-full bg-emerald-500 transition-all duration-1000" 
               style={{ width: animate ? '92%' : '0%' }}
             />
           </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 group hover:shadow-md transition-all">
           <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Atención Promedio</p>
              <Clock size={16} className="text-[#8E735B]" />
           </div>
           <p className="text-3xl font-bold text-slate-900">14 <span className="text-sm font-medium text-slate-400">días</span></p>
           <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">Ciclo de 1ra actuación legal</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 group hover:shadow-md transition-all">
           <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nuevos Clientes</p>
              <Users size={16} className="text-[#002B5B]" />
           </div>
           <p className="text-3xl font-bold text-slate-900">{clientes.length}</p>
           <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">Registros en el periodo actual</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 group hover:shadow-md transition-all">
           <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Casos Cerrados</p>
              <BarChart3 size={16} className="text-slate-400" />
           </div>
           <p className="text-3xl font-bold text-slate-900">{statusCounts[CaseStatus.CERRADO]}</p>
           <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">Finalizados con éxito</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tabla de Reportes Individuales */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Generar Informe Individual</h3>
          </div>
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Identificación / Cliente</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Estado Procesal</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Acción</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {clientes.map(c => (
                      <tr key={c.id} className="hover:bg-slate-50/50 group transition-all">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-800 group-hover:text-[#002B5B] transition-colors">{c.nombreCompleto}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{c.dni}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            c.estadoActual === CaseStatus.ACTIVO ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                            c.estadoActual === CaseStatus.CERRADO ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                            'bg-amber-50 text-amber-600 border border-amber-100'
                          }`}>
                            {c.estadoActual}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                              onClick={() => exportIndividual(c)}
                              className="p-2 text-[#8E735B] hover:bg-white rounded-xl shadow-none hover:shadow-sm border border-transparent hover:border-slate-100 transition-all"
                              title="Descargar PDF"
                            >
                            <Download size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Panel de Gráficos e Informes Grupales */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 size={20} className="text-[#002B5B]" />
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Distribución por Estado</h3>
            </div>
            <StatusBarChart />
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <PieIcon size={20} className="text-[#8E735B]" />
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Tipos de Causa</h3>
            </div>
            <CausesDonutChart />
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl shadow-xl text-white space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Exportar Reportes Consolidados</h3>
            <div className="space-y-2">
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-between px-4 transition-all group">
                <span className="text-sm font-bold">Estado de Cartera</span>
                <Download size={16} className="text-slate-400 group-hover:text-white transition-colors" />
              </button>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-between px-4 transition-all group">
                <span className="text-sm font-bold">Productividad Mensual</span>
                <Download size={16} className="text-slate-400 group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
