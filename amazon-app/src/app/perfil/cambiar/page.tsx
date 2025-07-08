'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function CambiarContrasenaPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.newPassword !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login?redirect=/perfil/cambiar');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al cambiar contraseña');

      setSuccess('Contraseña actualizada con éxito');
      setTimeout(() => router.push('/perfil'), 2500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-4 px-4 pb-20 bg-gradient-to-br from-white to-teal-50">
      {/* Botón visible solo en móvil */}
      <div className="md:hidden max-w-xl mx-auto mb-4">
        <button
          onClick={() => router.push('/perfil')}
          className="flex items-center gap-2 text-sm text-teal-700 font-medium hover:underline"
        >
          <ArrowLeft size={18} /> Regresar al perfil
        </button>
      </div>

      <div className="max-w-xl mx-auto bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-10">
        <h2 className="text-4xl font-semibold text-teal-900 text-center mb-8 drop-shadow">
          Cambiar Contraseña
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5 text-gray-800">
          <input
            type="password"
            name="currentPassword"
            placeholder="Contraseña actual"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="newPassword"
            placeholder="Nueva contraseña"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar nueva contraseña"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
            onChange={handleChange}
            required
          />

          {error && (
            <p className="bg-red-100 text-red-700 p-2 rounded text-sm text-center">{error}</p>
          )}
          {success && (
            <p className="bg-green-100 text-green-700 p-2 rounded text-sm text-center">{success}</p>
          )}

          <button
            type="submit"
            className="w-full bg-teal-700 hover:bg-teal-800 text-white py-2 rounded-full font-semibold transition-all shadow-md"
            disabled={loading}
          >
            {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
}
