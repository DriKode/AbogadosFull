
import React, { useState, useEffect } from 'react';
import { Gavel, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';
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
    <div className="fixed inset-0 z-[9999] bg-[#001f3f] flex flex-col items-center justify-center overflow-hidden font-sans">
      {/* Fondo Premium */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#001f3f] via-[#002B5B] to-[#001f3f]"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#C5A059]/5 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#C5A059]/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>

      <div className="relative flex flex-col items-center max-w-2xl w-full px-6 text-center animate-in fade-in zoom-in duration-1000">
        {/* Logo y Nombre Principal */}
        <div className="mb-6 md:mb-10 transform scale-90 md:scale-110">
          <div className="relative">
            <div className="absolute inset-0 bg-[#C5A059] blur-2xl opacity-20 animate-pulse"></div>
            <img
              src="/logo.png"
              alt="Logo"
              className="w-24 h-24 md:w-32 md:h-32 object-contain relative z-10 filter brightness-110 drop-shadow-[0_0_15px_rgba(197,160,89,0.4)]"
            />
          </div>
        </div>

        <div className="space-y-2 md:space-y-4 mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
            KATHERINE GALLARDO ORTIZ
          </h1>
          <div className="flex items-center justify-center gap-2 md:gap-4">
            <div className="h-[1px] w-8 md:w-12 bg-gradient-to-r from-transparent to-[#C5A059]"></div>
            <p className="text-[#C5A059] font-medium tracking-[0.2em] md:tracking-[0.4em] uppercase text-xs md:text-base px-2">
              Abogada
            </p>
            <div className="h-[1px] w-8 md:w-12 bg-gradient-to-l from-transparent to-[#C5A059]"></div>
          </div>
        </div>

        {/* Tarjeta de Contacto y Ubicación */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full mb-8 md:mb-12">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 md:p-6 transition-all hover:bg-white/10 group">
            <div className="flex flex-col gap-3 md:gap-4 text-left">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059]">
                  <Phone size={16} className="md:w-[18px] md:h-[18px]" />
                </div>
                <div>
                  <p className="text-white/40 text-[10px] md:text-xs uppercase tracking-widest font-bold">WhatsApp</p>
                  <p className="text-white font-medium text-sm md:text-base">65504849</p>
                </div>
              </div>
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059]">
                  <Mail size={16} className="md:w-[18px] md:h-[18px]" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-white/40 text-[10px] md:text-xs uppercase tracking-widest font-bold">Email</p>
                  <p className="text-white font-medium truncate text-sm md:text-base">katherinegallardoortiz@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          <a
            href="https://www.google.com/maps/place//@-17.385796,-66.154379,17z/data=!4m6!1m5!3m4!2zMTfCsDIzJzA4LjkiUyA2NsKwMDknMTUuOCJX!8m2!3d-17.385796!4d-66.154379?entry=ttu&g_ep=EgoyMDI2MDMwOC4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 md:p-6 transition-all hover:bg-white/10 group"
          >
            <div className="h-full flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059]">
                    <MapPin size={18} />
                  </div>
                  <p className="text-white/40 text-xs uppercase tracking-widest font-bold">Ubicación</p>
                </div>
                <ExternalLink size={16} className="text-white/20 group-hover:text-[#C5A059] transition-colors" />
              </div>
              <p className="text-white text-sm leading-relaxed text-left flex-grow">
                Av. Salamanca entre Antezana y Lanza<br />
                <span className="text-[#C5A059]">Edif. Sisteco Piso 7 Of. 7</span>
              </p>
            </div>
          </a>
        </div>

        {/* Barra de progreso elegante */}
        <div className="w-64 h-[1px] bg-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#C5A059] animate-loading-bar"></div>
        </div>
      </div>

      <div className="absolute bottom-8 text-white/20 text-[10px] font-bold tracking-[0.2em] uppercase w-full text-center">
        <p>Excelencia Jurídica & Profesionalismo</p>
        <p className="mt-1">ver. 1.0</p>
      </div>

      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-bar {
          animation: loading-bar 7s linear forwards;
        }
      `}</style>
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
    // Timer para el Splash Screen (7 segundos por requerimiento)
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 7000);

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
