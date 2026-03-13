
import React, { useState } from 'react';
import { Home, Users, Calendar, FileText, PieChart, Menu, X, LogOut, Gavel } from 'lucide-react';
import { THEME } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: 'ABOGADO' | 'APOYO' | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, role, onLogout }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  let navItems = [
    { id: 'dashboard', label: 'Panel Principal', icon: Home },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'citas', label: 'Citas', icon: Calendar },
    { id: 'reportes', label: 'Informes', icon: PieChart },
  ];

  if (role === 'APOYO') {
    navItems = navItems.filter(item => item.id === 'clientes' || item.id === 'citas');
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#002B5B] text-white transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 flex items-center gap-3 border-b border-white/10">
            <div className="flex-shrink-0">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-10 h-10 object-contain"
              />
            </div>
            <h1 className="text-xl font-serif font-bold tracking-tight">BUFETE</h1>
          </div>

          {/* Nav */}
          <nav className="flex-1 py-6 px-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                    ${isActive
                      ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/20'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'}
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile Footer / Logout */}
          <div className="p-4 border-t border-white/10 mt-auto">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium">{role === 'APOYO' ? 'Apoyo Administrativo' : 'Abogado Principal'}</span>
                <span className="text-xs text-white/50 capitalize">{role?.toLowerCase()}</span>
              </div>
              <button
                onClick={onLogout}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-all"
                title="Cerrar Sesión"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8">
          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-lg font-semibold text-slate-800 capitalize">
              {navItems.find(i => i.id === activeTab)?.label || 'Detalles'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Estado del Sistema:</span>
              <span className="ml-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">En Línea</span>
            </div>
          </div>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
