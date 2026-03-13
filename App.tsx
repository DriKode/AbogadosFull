
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

const ProfessionalContactScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="fixed inset-0 z-[10000] bg-[#001f3f] overflow-x-hidden overflow-y-auto font-sans">
      {/* Fondo Premium */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#001f3f] via-[#002B5B] to-[#001f3f] pointer-events-none"></div>
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#C5A059]/5 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#C5A059]/10 rounded-full blur-[120px] animate-pulse delay-1000 pointer-events-none"></div>

      <div className="relative flex flex-col items-center justify-center min-h-full max-w-5xl w-full px-6 py-12 mx-auto text-center animate-in fade-in zoom-in duration-500 pb-24">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mb-10">
          {/* Columna Izquierda: Tarjetas de Contacto y Ubicación */}
          <div className="flex flex-col gap-4 md:gap-6 w-full h-full">

            {/* WhatsApp */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 md:p-6 text-left flex flex-col justify-center transition-all hover:bg-white/10">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059]">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-white/40 text-[10px] md:text-xs uppercase tracking-widest font-bold">WhatsApp</p>
                  <p className="text-white font-medium text-lg md:text-xl mt-1">65504849</p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 md:p-6 text-left flex flex-col justify-center transition-all hover:bg-white/10">
              <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059] flex-shrink-0">
                  <Mail size={20} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-white/40 text-[10px] md:text-xs uppercase tracking-widest font-bold">Email</p>
                  <p className="text-white font-medium text-sm md:text-base mt-1 truncate">katherinegallardoortiz@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Ubicación (Referencia) */}
            <a
              href="https://maps.app.goo.gl/Caf3kqDWgAziE1gP7"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 transition-all hover:bg-white/10 group text-left flex-1 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059]">
                    <MapPin size={20} />
                  </div>
                  <p className="text-white/40 text-[10px] md:text-xs uppercase tracking-widest font-bold">Ubicación</p>
                </div>
                <ExternalLink size={20} className="text-white/20 group-hover:text-[#C5A059] transition-colors" />
              </div>
              <p className="text-white text-sm md:text-base leading-relaxed">
                Av. Salamanca entre Antezana y Lanza<br />
                <span className="text-[#C5A059]">Edif. Sisteco Piso 7 Of. 7</span>
              </p>
            </a>
          </div>

          {/* Columna Derecha: Tarjeta de Mapa Embebido */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 md:p-6 text-left flex flex-col h-[400px] lg:h-full transition-all hover:bg-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059]">
                <MapPin size={20} />
              </div>
              <h2 className="text-[#C5A059] font-medium tracking-[0.2em] uppercase text-sm md:text-base">MAPA</h2>
            </div>
            <div className="flex-1 w-full rounded-xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/5">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3550.053531481179!2d-66.15695392482312!3d-17.385795983501255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x93e373f7c9e016ed%3A0xe5a3cabe5c71a396!2sAv.%20Salamanca%2C%20Cochabamba!5e1!3m2!1ses!2sbo!4v1709904252329!5m2!1ses!2sbo"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Edificio Sisteco"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Botón Volver */}
        <button
          onClick={onBack}
          className="w-full sm:w-48 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl py-3 px-6 text-white font-medium tracking-wide transition-all duration-300 hover:bg-[#C5A059]/20 hover:border-[#C5A059]/50 hover:shadow-[0_0_15px_rgba(197,160,89,0.3)] hover:-translate-y-1 active:translate-y-0 active:scale-95 mx-auto"
        >
          VOLVER
        </button>
      </div>

      {/* Barra Inferior */}
      <div className="relative bottom-0 pb-8 text-white/20 text-[10px] font-bold tracking-[0.2em] uppercase w-full text-center mt-auto">
        <p>Excelencia Jurídica & Profesionalismo</p>
        <p className="mt-1">ver. 1.1</p>
      </div>
    </div>
  );
};

const LoginScreen: React.FC<{
  onLoginSuccess: (role: 'ABOGADO' | 'APOYO') => void;
  onBackToSplash: () => void;
}> = ({ onLoginSuccess, onBackToSplash }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = username.trim().toUpperCase();

    if (user === 'ABOGADO' && password === '123456') {
      onLoginSuccess('ABOGADO');
    } else if (user === 'APOYO' && password === '123456') {
      onLoginSuccess('APOYO');
    } else {
      const currentAttempts = attempts + 1;
      if (currentAttempts >= 3) {
        onBackToSplash();
      } else {
        setAttempts(currentAttempts);
        setError('Credenciales incorrectas');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-[#001f3f] flex flex-col items-center justify-center overflow-x-hidden overflow-y-auto font-sans">
      <div className="fixed inset-0 bg-gradient-to-br from-[#001f3f] via-[#002B5B] to-[#001f3f] pointer-events-none"></div>
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#C5A059]/5 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#C5A059]/10 rounded-full blur-[120px] animate-pulse delay-1000 pointer-events-none"></div>

      <div className="relative flex flex-col items-center max-w-sm w-full px-6 py-12 text-center animate-in fade-in zoom-in duration-500 pb-24 h-full justify-center">

        <div className="mb-6 transform scale-90">
          <div className="relative">
            <div className="absolute inset-0 bg-[#C5A059] blur-2xl opacity-20 animate-pulse"></div>
            <img
              src="/logo.png"
              alt="Logo"
              className="w-24 h-24 object-contain relative z-10 filter brightness-110 drop-shadow-[0_0_15px_rgba(197,160,89,0.4)] animate-heartbeat"
            />
          </div>
        </div>

        <form onSubmit={handleLogin} className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col gap-4">
          <h2 className="text-[#C5A059] font-medium tracking-[0.2em] uppercase text-sm md:text-base mb-2">Acceso al Sistema</h2>

          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 outline-none focus:border-[#C5A059] focus:bg-white/10 transition-colors"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 outline-none focus:border-[#C5A059] focus:bg-white/10 transition-colors"
          />

          {error && <p className="text-[#C5A059] text-xs font-bold uppercase tracking-widest mt-1">{error}</p>}

          <button type="submit" className="w-full bg-[#C5A059] hover:bg-[#b08d4f] text-white font-medium tracking-wide py-3 rounded-xl mt-2 transition-all hover:-translate-y-1 active:scale-95 shadow-[0_0_15px_rgba(197,160,89,0.3)]">
            INGRESAR
          </button>

          <button type="button" onClick={onBackToSplash} className="w-full bg-transparent border border-white/10 hover:bg-white/5 text-white/70 font-medium py-3 rounded-xl transition-all">
            VOLVER
          </button>
        </form>
      </div>

      {/* Barra Inferior */}
      <div className="absolute bottom-8 text-white/20 text-[10px] font-bold tracking-[0.2em] uppercase w-full text-center">
        <p>Excelencia Jurídica & Profesionalismo</p>
        <p className="mt-1">ver. 1.1</p>
      </div>
    </div>
  );
};

const SplashScreen: React.FC<{ onClienteClick?: () => void; onAbogadoClick?: () => void }> = ({ onClienteClick, onAbogadoClick }) => {
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
              className="w-[99px] h-[99px] md:w-[131px] md:h-[131px] object-contain relative z-10 filter brightness-110 drop-shadow-[0_0_15px_rgba(197,160,89,0.4)] animate-heartbeat"
            />
          </div>
        </div>

        <div className="space-y-2 md:space-y-4 mb-8 md:mb-12">
          <h1 className="text-[20px] sm:text-[26px] md:text-[44px] font-serif font-bold text-white tracking-tight leading-tight">
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

        {/* Botones de Selección */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full mb-8 md:mb-12">
          <button
            onClick={onClienteClick}
            className="w-full sm:w-48 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl py-3 px-6 text-white font-medium tracking-wide transition-all duration-300 hover:bg-[#C5A059]/20 hover:border-[#C5A059]/50 hover:shadow-[0_0_15px_rgba(197,160,89,0.3)] hover:-translate-y-1 active:translate-y-0 active:scale-95"
          >
            CLIENTE
          </button>
          <button
            onClick={onAbogadoClick}
            className="w-full sm:w-48 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl py-3 px-6 text-white font-medium tracking-wide transition-all duration-300 hover:bg-[#C5A059]/20 hover:border-[#C5A059]/50 hover:shadow-[0_0_15px_rgba(197,160,89,0.3)] hover:-translate-y-1 active:translate-y-0 active:scale-95"
          >
            ABOGADO
          </button>
        </div>

        {/* Barra de progreso elegante */}
        <div className="w-64 h-[1px] bg-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#C5A059] animate-loading-bar"></div>
        </div>
      </div>

      <div className="absolute bottom-8 text-white/20 text-[10px] font-bold tracking-[0.2em] uppercase w-full text-center">
        <p>Excelencia Jurídica & Profesionalismo</p>
        <p className="mt-1">ver. 1.1</p>
      </div>

      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-bar {
          animation: loading-bar 7s linear forwards;
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-heartbeat {
          animation: heartbeat 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<'ABOGADO' | 'APOYO' | null>(null);
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
    const init = async () => {
      setLoading(true);
      await refreshData();
      setLoading(false);
    };
    init();
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

    if (currentUserRole === 'APOYO' && !['clientes', 'citas'].includes(activeTab)) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
          <div className="w-16 h-16 bg-[#002B5B]/10 rounded-full flex items-center justify-center text-[#002B5B]">
            <Gavel size={32} />
          </div>
          <h2 className="text-xl font-medium text-slate-800">Acceso Restringido</h2>
          <p className="text-slate-500 max-w-sm">
            Su cuenta no cuenta con los permisos necesarios para visualizar este módulo.
          </p>
        </div>
      );
    }

    if (selectedClientId && currentUserRole === 'APOYO' && !['clientes', 'citas'].includes(activeTab)) {
      setSelectedClientId(null);
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
            onDocumentUploaded={refreshData}
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
      {showContact && <ProfessionalContactScreen onBack={() => setShowContact(false)} />}
      {showLogin && (
        <LoginScreen
          onLoginSuccess={(role) => {
            setCurrentUserRole(role);
            setShowLogin(false);
            setShowSplash(false);
            if (role === 'APOYO') {
              setActiveTab('clientes');
            } else {
              setActiveTab('dashboard');
            }
          }}
          onBackToSplash={() => {
            setShowLogin(false);
          }}
        />
      )}
      {showSplash && !showContact && !showLogin && (
        <SplashScreen
          onClienteClick={() => setShowContact(true)}
          onAbogadoClick={() => setShowLogin(true)}
        />
      )}
      {(!showSplash && !showLogin) && (
        <Layout
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSelectedClientId(null);
          }}
          role={currentUserRole}
          onLogout={() => {
            setCurrentUserRole(null);
            setShowSplash(true);
            setShowLogin(false);
          }}
        >
          {renderContent()}
        </Layout>
      )}
    </>
  );
};

export default App;
