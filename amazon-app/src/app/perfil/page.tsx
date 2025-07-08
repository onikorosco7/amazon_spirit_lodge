'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, UserCircle, Star, LogOut, Pencil, ImageIcon, KeyRound, Mail } from 'lucide-react';

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ fullName: string; avatar?: string; email: string } | null>(null);

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

  return (
    <section className="min-h-screen pt-0 px-6 pb-20 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="Avatar"
              className="w-16 h-16 rounded-full object-cover border"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-teal-600 text-white flex items-center justify-center text-2xl font-bold">
              {user?.fullName?.charAt(0).toUpperCase() || '?'}
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-teal-800">{user?.fullName}</h2>
            <p className="text-sm text-gray-600">{user?.email}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <button
            onClick={() => router.push('/perfil/editar')}
            className="border rounded-xl p-5 bg-teal-50 hover:bg-teal-100 flex gap-4 items-center text-left"
          >
            <Pencil size={28} className="text-teal-700" />
            <div>
              <h3 className="text-base font-semibold text-teal-900">Editar Perfil</h3>
              <p className="text-sm text-teal-800">Nombre y correo</p>
            </div>
          </button>

          <button
            onClick={() => router.push('/perfil/cambiar')}
            className="border rounded-xl p-5 bg-teal-50 hover:bg-teal-100 flex gap-4 items-center text-left"
          >
            <KeyRound size={28} className="text-teal-700" />
            <div>
              <h3 className="text-base font-semibold text-teal-900">Cambiar Contraseña</h3>
              <p className="text-sm text-teal-800">Actualizar clave de acceso</p>
            </div>
          </button>

          <button
            onClick={() => router.push('/perfil/avatar')}
            className="border rounded-xl p-5 bg-teal-50 hover:bg-teal-100 flex gap-4 items-center text-left"
          >
            <ImageIcon size={28} className="text-teal-700" />
            <div>
              <h3 className="text-base font-semibold text-teal-900">Cambiar Imagen</h3>
              <p className="text-sm text-teal-800">Sube tu nueva foto de perfil</p>
            </div>
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div
            onClick={() => router.push('/perfil/mis-reservas')}
            className="cursor-pointer border rounded-xl p-6 bg-teal-50 hover:bg-teal-100 transition shadow group"
          >
            <div className="flex items-center gap-4">
              <CalendarDays size={32} className="text-teal-700 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="text-lg font-semibold text-teal-900">Mis Reservas</h3>
                <p className="text-sm text-teal-800">Ver historial y cancelar reservas</p>
              </div>
            </div>
          </div>
          <div
            onClick={() => router.push('/perfil/mis-resenas')}
            className="cursor-pointer border rounded-xl p-6 bg-teal-50 hover:bg-teal-100 transition shadow group"
          >
            <div className="flex items-center gap-4">
              <Star size={32} className="text-yellow-500 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="text-lg font-semibold text-teal-900">Mis Reseñas</h3>
                <p className="text-sm text-teal-800">Gestiona tus comentarios y valoraciones</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => router.push('/perfil/mensajes')}
            className="cursor-pointer border rounded-xl p-6 bg-teal-50 hover:bg-teal-100 transition shadow group"
          >
            <div className="flex items-center gap-4">
              <Mail size={32} className="text-green-500 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="text-lg font-semibold text-teal-900">Mis Mensajes</h3>
                <p className="text-sm text-teal-800">Ver lo que has enviado por contacto</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
