'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  Menu,
  X,
  UserCircle,
  LogOut,
  User,
  ChevronDown,
  UserPlus,
  LogIn,
} from 'lucide-react';
import { useIsMobile } from './hooks/useIsMobile';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile('md');
  const isPerfilPage = pathname.startsWith('/perfil');

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ fullName: string; role?: string } | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileUserMenuOpen, setMobileUserMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isMobile && isPerfilPage) return null;

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavClick = (target: string) => {
    setMenuOpen(false);
    if (pathname !== '/') {
      router.push(`/#${target}`);
    } else {
      scrollToSection(target);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  const menu = [
    { name: 'Home', action: () => router.push('/') },
    { name: 'Gallery', action: () => handleNavClick('gallery') },
    { name: 'About', action: () => handleNavClick('about') },
    { name: 'Reviews', action: () => handleNavClick('resenas') },
    { name: 'Contact', action: () => handleNavClick('contacto') },
    { name: 'Book', action: () => router.push('/reservar') },
  ];

  return (
    <header className={`sticky top-0 z-50 transition ${scrolled ? 'bg-white shadow-md' : 'bg-white/30 backdrop-blur'}`}>
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 text-[#003580] font-bold text-xl">
          <img src="/galeria/logo.png" alt="Logo" className="h-10 w-10" />
          Amazon Spirit Lodge
        </Link>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-[#003580] focus:outline-none focus:ring-2 focus:ring-[#60a5fa] p-2 rounded"
          aria-label="Toggle Menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Menú escritorio */}
        <nav className="hidden md:flex items-center gap-6 text-base font-medium text-gray-900">
          {menu.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="relative inline-block after:block after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#003580] after:transition-all after:duration-300 after:w-0 hover:after:w-full focus:outline-none"
            >
              {item.name}
            </button>
          ))}

          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 text-[#003580]"
              >
                <UserCircle size={22} />
                <span className="text-base">{user.fullName}</span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white/90 backdrop-blur-md shadow-lg ring-1 ring-[#60a5fa] z-50">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      router.push(user?.role === 'admin' ? '/admin/perfil' : '/perfil');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#003580] hover:bg-[#60a5fa]/20 rounded-t-xl"
                  >
                    <User size={18} className="text-[#003580]" />
                    Mi Perfil
                  </button>
                  <div className="h-[1px] bg-[#60a5fa] mx-4" />
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-700 hover:bg-red-100 rounded-b-xl"
                  >
                    <LogOut size={18} className="text-red-500" />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <span className="mx-2 text-gray-400">|</span>
              <Link href="/register" className="flex items-center gap-1 text-base text-gray-800 group hover:text-[#003580]">
                <UserPlus size={16} className="transition-colors group-hover:text-[#003580]" />
                <span className="relative inline-block after:block after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#003580] after:transition-all after:duration-300 after:w-0 group-hover:after:w-full">
                  Register
                </span>
              </Link>

              <Link href="/login" className="flex items-center gap-1 text-base text-gray-800 group hover:text-[#003580]">
                <LogIn size={16} className="transition-colors group-hover:text-[#003580]" />
                <span className="relative inline-block after:block after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#003580] after:transition-all after:duration-300 after:w-0 group-hover:after:w-full">
                  Login
                </span>
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 bg-white/50 backdrop-blur-md text-base font-medium text-gray-700 shadow animate-fade-in">
          {menu.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="block px-2 py-1 rounded hover:bg-[#60a5fa]/30 text-left w-full"
            >
              {item.name}
            </button>
          ))}

          <hr className="my-2" />

          {user ? (
            <div className="space-y-1">
              <button
                onClick={() => setMobileUserMenuOpen(!mobileUserMenuOpen)}
                className="flex items-center justify-between w-full px-2 py-1 text-[#003580]"
              >
                <span className="flex items-center gap-2">
                  <UserCircle size={20} />
                  {user.fullName}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${mobileUserMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {mobileUserMenuOpen && (
                <div className="pl-6">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      router.push(user?.role === 'admin' ? '/admin/perfil' : '/perfil');
                    }}
                    className="block w-full text-left py-1 hover:bg-[#60a5fa]/30"
                  >
                    Mi Perfil
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="block w-full text-left py-1 text-red-700 hover:bg-red-100"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/register" className="block px-2 py-1 hover:bg-[#60a5fa]/30 flex items-center gap-2">
                <UserPlus size={16} />
                Register
              </Link>
              <Link href="/login" className="block px-2 py-1 hover:bg-[#60a5fa]/30 flex items-center gap-2">
                <LogIn size={16} />
                Login
              </Link>
            </>
          )}
        </div>
      )}

      {/* Animación fade-in para mobile */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </header>
  );
}
