'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  BedDouble,
  ClipboardList,
  Users,
  MessageCircle,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  Mail,
  Image,
  ImagePlus,
  Newspaper,
  FileText, 
  UserCircle2,
  FileSignature, 
  ShieldCheck,
  Star,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ fullName: string; avatar?: string; role?: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      router.push('/login');
    } else {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.role !== 'admin') {
          router.push('/');
        } else {
          setUser(parsed);
        }
      } catch {
        router.push('/login');
      }
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const nav = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/perfil' },
    { name: 'Habitaciones', icon: BedDouble, href: '/admin/habitaciones' },
    { name: 'Reservas', icon: ClipboardList, href: '/admin/reservas' },
    { name: 'Usuarios', icon: Users, href: '/admin/usuarios' },
    { name: 'Reseñas', icon: Star, href: '/admin/resenas' },
    { name: 'Mensajes', icon: MessageCircle, href: '/admin/mensajes' },
    { name: 'Contactos', icon: Mail, href: '/admin/contactos' },
    { name: 'Galería', icon: Image, href: '/admin/galeria' },
    { name: 'Portada (Hero)', icon: ImagePlus, href: '/admin/hero' },
    { name: 'Blog', icon: Newspaper, href: '/admin/blog' },
    { name: 'Descargas (tarifas)', icon: FileText, href: '/admin/downloads' },
    { name: 'Team', icon: UserCircle2, href: '/admin/team' },
    { name: 'Términos', icon: FileSignature, href: '/admin/terminos' },
    { name: 'Privacidad', icon: ShieldCheck , href: '/admin/privacidad' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Topbar móvil */}
      <div className="md:hidden flex items-center justify-between bg-teal-800 text-white px-4 py-3 shadow">
        <span className="font-bold text-lg">Admin Panel</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle sidebar">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-white shadow-md border-r w-full md:w-64 transition-all duration-300 ${
          sidebarOpen ? 'block' : 'hidden md:block'
        }`}
      >
        <div className="p-5 text-xl font-bold text-teal-800 border-b hidden md:block">Admin Panel</div>
        <nav className="flex flex-col p-4 gap-1">
          {nav.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition ${
                pathname === item.href
                  ? 'bg-teal-600 text-white'
                  : 'text-gray-700 hover:bg-teal-100'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          {user && (
            <div className="flex items-center gap-3 mb-3">
              {user.avatar ? (
                <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 bg-teal-700 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-teal-800">{user.fullName}</p>
                <p className="text-xs text-gray-500">Administrador</p>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-700 hover:bg-red-50 rounded-md transition"
          >
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
