'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, LogIn, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed');
        setLoading(false);
        return;
      }

      localStorage.setItem('access_token', data.access_token);
      const userData = {
        id: data.user?.id || data.user?.userId || data.user?.sub,
        fullName: data.user?.fullName,
        email: data.user?.email,
        role: data.user?.role,
        avatar: data.user?.avatar || '',
      };
      localStorage.setItem('user', JSON.stringify(userData));

      setTimeout(() => {
        router.push(redirect);
      }, 2000);
    } catch (err) {
      setError('No se pudo conectar con el servidor');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-4">
        <div className="w-12 h-12 border-4 border-teal-700 border-t-transparent rounded-full animate-spin" />
        <p className="text-teal-700 text-lg font-medium">Iniciando sesión...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[rgba(0,47,97,0.1)] to-white px-4 pt-4">
      <form
        onSubmit={handleLogin}
        className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-md w-full space-y-6 mb-20 text-gray-800"
      >
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-bold text-teal-800 tracking-wide">
            Amazon Spirit Lodge
          </h2>
          <p className="text-gray-500 text-sm">Inicia sesión para continuar</p>
        </div>

        {error && (
          <p className="bg-red-100 text-red-700 p-2 rounded text-sm text-center">
            {error}
          </p>
        )}

        <div>
          <label className="block text-sm text-gray-600 mb-1">Email</label>
          <div className="relative">
            <Mail size={18} className="absolute top-3 left-3 text-gray-400" />
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full pl-10 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Contraseña</label>
          <div className="relative">
            <Lock size={18} className="absolute top-3 left-3 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Tu contraseña"
              className="w-full pl-10 pr-10 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-3 right-3 text-gray-500 hover:text-teal-700"
              title={showPassword ? 'Ocultar' : 'Mostrar'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2.5 rounded transition"
        >
          <LogIn size={18} />
          Iniciar sesión
        </button>

        <p className="text-sm text-center text-gray-600 mt-4">
          ¿No tienes una cuenta?
          <a
            href={`/register${redirect ? `?redirect=${redirect}` : ''}`}
            className="text-teal-700 hover:underline ml-1 font-medium"
          >
            Regístrate aquí
          </a>
        </p>
      </form>
    </div>
  );
}
