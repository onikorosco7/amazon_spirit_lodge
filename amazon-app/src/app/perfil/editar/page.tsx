'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditarPerfilPage() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      router.push('/login?redirect=/perfil/editar');
    } else {
      try {
        const user = JSON.parse(stored);
        setForm({ fullName: user.fullName, email: user.email });
      } catch {
        router.push('/login');
      }
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('access_token');
    if (!token || token === 'null') {
      setError('Sesión inválida. Inicia sesión nuevamente.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || 'Error al actualizar perfil');
        return;
      }

      localStorage.setItem('user', JSON.stringify(data));
      router.push('/perfil');
    } catch (err: any) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-8 px-4 pb-20 bg-gradient-to-br from-white to-teal-50">
      <div className="max-w-xl mx-auto bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-10">
        <h2 className="text-4xl font-semibold text-teal-900 text-center mb-8 drop-shadow">
          Editar Perfil
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5 text-gray-800">
          <input
            type="text"
            name="fullName"
            placeholder="Nombre completo"
            value={form.fullName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
            required
          />

          {error && (
            <p className="bg-red-100 text-red-700 p-2 rounded text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-teal-700 hover:bg-teal-800 text-white py-2 rounded-full font-semibold transition-all shadow-md"
            disabled={loading}
          >
            {loading ? 'Actualizando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  );
}
