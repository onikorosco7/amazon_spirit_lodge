'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  UserCircle,
  CalendarDays,
  Star,
  Mail,
  LogOut,
  Menu,
  X,
  Home
} from 'lucide-react';

export default function PerfilLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<{ fullName: string; avatar?: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const navItems = [
    { label: 'Mi Perfil', icon: UserCircle, path: '/perfil' },
    { label: 'Mis Reservas', icon: CalendarDays, path: '/perfil/mis-reservas' },
    { label: 'Mis Reseñas', icon: Star, path: '/perfil/mis-resenas' },
    { label: 'Mis Mensajes', icon: Mail, path: '/perfil/mensajes' },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Menú móvil */}
      <div className="md:hidden flex flex-col gap-2 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                {user?.fullName?.charAt(0).toUpperCase() || '?'}
              </div>
            )}
            <div>
              <p className="text-sm text-teal-800 font-medium">Hola,</p>
              <p className="text-teal-900 font-semibold">{user?.fullName}</p>
            </div>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-teal-800">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <nav className="mt-2 space-y-2 border-t pt-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${pathname === item.path
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-700 hover:bg-teal-100'
                  }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-teal-800 hover:bg-teal-100 transition"
            >
              <Home size={18} />
              Regresar al inicio
            </Link>
            <button
              onClick={logout}
              className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-700 hover:bg-red-50 rounded-md transition"
            >
              <LogOut size={18} /> Cerrar sesión
            </button>
          </nav>
        )}
      </div>

      {/* Sidebar escritorio */}
      <aside className="hidden md:block md:w-64 border-r border-gray-200 bg-gray-50">

        <div className="p-4 hidden md:block border-b">
          <div className="flex items-center gap-3 mb-4">
            {user?.avatar ? (
              <img src={user.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                {user?.fullName?.charAt(0).toUpperCase() || '?'}
              </div>
            )}
            <div>
              <p className="font-medium text-teal-800 text-sm">Hola,</p>
              <p className="font-semibold text-teal-900 text-base">{user?.fullName}</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-col p-4 gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${pathname === item.path
                  ? 'bg-teal-600 text-white'
                  : 'text-gray-700 hover:bg-teal-100'
                }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
          <button
            onClick={logout}
            className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-700 hover:bg-red-50 rounded-md transition"
          >
            <LogOut size={18} /> Cerrar sesión
          </button>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
