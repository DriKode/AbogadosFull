
import React, { useEffect, useState } from 'react';
// Added Clock to the imports from lucide-react
import { Download, PieChart as PieIcon, BarChart3, TrendingUp, Users, Clock } from 'lucide-react';
import { Cliente, CaseStatus } from '../types';
import { CAUSA_TYPES, THEME } from '../constants';

import ClientReportModal from '../components/ClientReportModal';

interface ReportsProps {
  clientes: Cliente[];
}

const Reports: React.FC<ReportsProps> = ({ clientes }) => {
  const [animate, setAnimate] = useState(false);
  const [selectedClientForReport, setSelectedClientForReport] = useState<Cliente | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const exportIndividual = (c: Cliente) => {
    setSelectedClientForReport(c);
  };

  // Funciones de utilidad para fechas
  const parseDate = (dateStr: string) => {
    if (!dateStr) return new Date();
    if (dateStr.includes('-')) {
      return new Date(dateStr); // YYYY-MM-DD
    } else if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        // DD/MM/YYYY
        return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      }
    }
    return new Date(dateStr);
  };

  // ---- CÁLCULOS DINÁMICOS PARA TARJETAS METRICAS ----

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
  const hasData = clientes.length > 0;

  // 1. Efectividad
  const closedCases = statusCounts[CaseStatus.CERRADO] || 0;
  const activeCases = statusCounts[CaseStatus.ACTIVO] || 0;
  const totalActionable = closedCases + activeCases;
  const effectiveness = totalActionable > 0 ? Math.round((closedCases / totalActionable) * 100) : 0;

  // 2. Atención Promedio (Ciclo de 1ra actuación)
  let totalDelayDays = 0;
  let casesWithActions = 0;

  clientes.forEach(cliente => {
    if (cliente.actuaciones && cliente.actuaciones.length > 0 && cliente.fechaRegistro) {
      const regDate = parseDate(cliente.fechaRegistro);

      const firstActionDate = cliente.actuaciones.reduce((earliest, act) => {
        const actDate = parseDate(act.fecha);
        return actDate < earliest ? actDate : earliest;
      }, parseDate(cliente.actuaciones[0].fecha));

      const diffTime = firstActionDate.getTime() - regDate.getTime();
      // Si la suma en días es >= 0 la tomamos
      if (diffTime >= 0) {
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        totalDelayDays += diffDays;
        casesWithActions++;
      }
    }
  });
  const avgAttentionTime = casesWithActions > 0 ? Math.round(totalDelayDays / casesWithActions) : 0;

  // 3. Nuevos Clientes (últimos 30 días)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const newClientsCount = clientes.filter(c => {
    if (!c.fechaRegistro) return false;
    const regDate = parseDate(c.fechaRegistro);
    return regDate >= thirtyDaysAgo;
  }).length;

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

      {/* Métricas Principales Dinámicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Efectividad Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 group hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Efectividad</p>
              <TrendingUp size={16} className={hasData ? (effectiveness >= 50 ? "text-emerald-500" : "text-amber-500") : "text-slate-300"} />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-slate-900">{hasData ? `${effectiveness}%` : '--'}</p>
              {hasData && (
                <span className={`text-xs font-bold ${effectiveness >= 50 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {effectiveness >= 50 ? 'Óptima' : 'Puede Mejorar'}
                </span>
              )}
            </div>
          </div>
          <div className="mt-5 h-1.5 bg-slate-50 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ease-out ${effectiveness >= 50 ? 'bg-emerald-500' : 'bg-amber-500'}`}
              style={{ width: animate && hasData ? `${effectiveness}%` : '0%' }}
            />
          </div>
        </div>

        {/* Atención Promedio Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 group hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Atención Promedio</p>
              <Clock size={16} className={hasData ? "text-[#8E735B]" : "text-slate-300"} />
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {hasData ? avgAttentionTime : '--'}
              {hasData && <span className="text-sm font-medium text-slate-400 ml-1">días</span>}
            </p>
          </div>
          <p className="text-[9px] text-slate-400 mt-4 font-bold uppercase tracking-widest">Ciclo desde registro a 1ra actuación</p>
        </div>

        {/* Nuevos Clientes Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 group hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nuevos Ingresos</p>
              <Users size={16} className={hasData ? "text-[#002B5B]" : "text-slate-300"} />
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {hasData ? newClientsCount : '--'}
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Registros últimos 30 días</p>
            {hasData && <span className="text-[10px] font-bold text-[#002B5B] bg-blue-50 px-2 py-0.5 rounded-md">Total: {clientes.length}</span>}
          </div>
        </div>

        {/* Casos Cerrados Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 group hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Casos Exitosos</p>
              <BarChart3 size={16} className={hasData ? "text-[#8E735B]" : "text-slate-300"} />
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {hasData ? closedCases : '--'}
            </p>
          </div>
          <p className="text-[9px] text-slate-400 mt-4 font-bold uppercase tracking-widest">Expedientes finalizados legalmente</p>
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
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${c.estadoActual === CaseStatus.ACTIVO ? 'bg-blue-50 text-blue-600 border border-blue-100' :
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
        </div>
      </div>

      {selectedClientForReport && (
        <ClientReportModal
          cliente={selectedClientForReport}
          onClose={() => setSelectedClientForReport(null)}
        />
      )}
    </div>
  );
};

export default Reports;
