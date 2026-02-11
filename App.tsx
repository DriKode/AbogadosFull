
import React, { useState, useEffect } from 'react';
import { Gavel } from 'lucide-react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ClientDetail from './pages/ClientDetail';
import Appointments from './pages/Appointments';
import Reports from './pages/Reports';
import { api } from './services/api';
import { Cliente, Cita, Actuacion, CaseStatus } from './types';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#002B5B] flex flex-col items-center justify-center overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#8E735B]/10 rounded-full blur-3xl animate-pulse delay-700"></div>

      <div className="relative flex flex-col items-center animate-in fade-in zoom-in duration-1000">
        <div className="mb-8 transform transition-transform duration-500 animate-float">
          <img
            src="/logo.png"
            alt="Logo Bufete"
            className="w-40 h-40 object-contain filter drop-shadow-[0_0_20px_rgba(142,115,91,0.3)]"
          />
        </div>

        <h1 className="text-5xl font-serif font-bold text-white tracking-tighter mb-4">
          BUFETE
        </h1>

        <div className="h-0.5 w-16 bg-[#8E735B] mb-6"></div>

        <p className="text-[#8E735B] font-medium tracking-[0.2em] uppercase text-sm animate-pulse">
          Justicia · Ética · Resultados
        </p>

        <div className="mt-12 flex gap-1.5">
          <div className="w-2 h-2 bg-white/20 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
        </div>
      </div>

      <div className="absolute bottom-12 flex flex-col items-center gap-2 text-white/30 text-[10px] font-bold tracking-widest uppercase text-center">
        <p>Sistema de Gestión Jurídica Integral V 1.0</p>
        <p>© Drix | Todos los derechos reservados 2026</p>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    try {
      const [clientsData, appointmentsData] = await Promise.all([
        api.getClients(),
        api.getAppointments()
      ]);
      setClientes(clientsData);
      setCitas(appointmentsData);
    } catch (error) {
      console.error("Error al sincronizar datos:", error);
    }
  };

  useEffect(() => {
    // Timer para el Splash Screen (5 segundos)
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 5000);

    const init = async () => {
      setLoading(true);
      await refreshData();
      setLoading(false);
    };
    init();

    return () => clearTimeout(splashTimer);
  }, []);

  const handleAddClient = async (data: Partial<Cliente>) => {
    await api.createClient(data);
    await refreshData();
  };

  const handleUpdateClientStatus = async (clientId: string, status: CaseStatus) => {
    await api.updateClientStatus(clientId, status);
    await refreshData();
  };

  const handleAddCita = async (data: Partial<Cita>) => {
    try {
      await api.createAppointment(data);
      await refreshData();
    } catch (error: any) {
      alert(error.message);
      throw error;
    }
  };

  const handleAddActuacion = async (clientId: string, data: Partial<Actuacion>) => {
    await api.addActuacion(clientId, data);
    await refreshData();
  };

  const handleSelectClientFromAppointment = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002B5B]"></div>
        </div>
      );
    }

    if (selectedClientId) {
      const client = clientes.find(c => c.id === selectedClientId);
      if (client) {
        return (
          <ClientDetail
            cliente={client}
            onBack={() => setSelectedClientId(null)}
            onAddActuacion={handleAddActuacion}
            onUpdateStatus={handleUpdateClientStatus}
          />
        );
      }
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            clientes={clientes}
            citas={citas.filter(c => !c.atendida).slice(0, 5)}
            onNavigateToClients={() => setActiveTab('clientes')}
            onNavigateToAppointments={() => setActiveTab('citas')}
          />
        );
      case 'clientes':
        return (
          <Clients
            clientes={clientes}
            onViewDetails={(id) => setSelectedClientId(id)}
            onAddClient={handleAddClient}
          />
        );
      case 'citas':
        return (
          <Appointments
            citas={citas}
            clientes={clientes}
            onAddCita={handleAddCita}
            onSelectClient={handleSelectClientFromAppointment}
          />
        );
      case 'reportes':
        return <Reports clientes={clientes} />;
      default:
        return <Dashboard clientes={clientes} citas={citas.filter(c => !c.atendida)} onNavigateToClients={() => setActiveTab('clientes')} onNavigateToAppointments={() => setActiveTab('citas')} />;
    }
  };

  return (
    <>
      {showSplash && <SplashScreen />}
      <Layout activeTab={activeTab} setActiveTab={(tab) => {
        setActiveTab(tab);
        setSelectedClientId(null);
      }}>
        {renderContent()}
      </Layout>
    </>
  );
};

export default App;
