'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Mail, Lock, CheckCircle, Check, X } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    terms: false,
  });

  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false,
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  const isValidPassword = (pw: string) => pw.length >= 6;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.terms) {
      return setError('Debes aceptar los Términos y Condiciones.');
    }

    if (!isValidPassword(form.password)) {
      return setError('La contraseña debe tener al menos 6 caracteres.');
    }

    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al registrar');

      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setTimeout(() => {
        router.push(`/login${redirect ? `?redirect=${redirect}` : ''}`);
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-4">
        <div className="w-12 h-12 border-4 border-teal-700 border-t-transparent rounded-full animate-spin" />
        <p className="text-teal-700 text-lg font-medium">Registrando cuenta...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[rgba(0,47,97,0.1)] to-white px-4 pt-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-md w-full space-y-6 mb-20 text-gray-800"
      >
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-bold text-teal-800 tracking-wide">Amazon Spirit Lodge</h2>
          <p className="text-gray-500 text-sm">Crea tu cuenta para comenzar la aventura</p>
        </div>

        {error && (
          <p className="bg-red-100 text-red-700 p-2 rounded text-sm text-center">{error}</p>
        )}

        {/* Nombre */}
        <div className="relative">
          <User size={18} className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            name="fullName"
            placeholder="Nombre completo"
            className={`w-full pl-10 pr-10 p-3 border rounded focus:outline-none focus:ring-2 ${touched.fullName && !form.fullName
                ? 'border-red-400 focus:ring-red-300'
                : 'border-gray-300 focus:ring-teal-600'
              }`}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {touched.fullName && (
            <span className="absolute top-3 right-3">
              {form.fullName ? (
                <Check size={18} className="text-green-500" />
              ) : (
                <X size={18} className="text-red-500" />
              )}
            </span>
          )}
        </div>

        {/* Email */}
        <div className="relative">
          <Mail size={18} className="absolute top-3 left-3 text-gray-400" />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            className={`w-full pl-10 pr-10 p-3 border rounded focus:outline-none focus:ring-2 ${touched.email && !isValidEmail(form.email)
                ? 'border-red-400 focus:ring-red-300'
                : 'border-gray-300 focus:ring-teal-600'
              }`}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {touched.email && (
            <span className="absolute top-3 right-3">
              {isValidEmail(form.email) ? (
                <Check size={18} className="text-green-500" />
              ) : (
                <X size={18} className="text-red-500" />
              )}
            </span>
          )}
        </div>

        {/* Contraseña */}
        <div className="relative">
          <Lock size={18} className="absolute top-3 left-3 text-gray-400" />
          <input
            type="password"
            name="password"
            placeholder="Contraseña (mín. 6 caracteres)"
            className={`w-full pl-10 pr-10 p-3 border rounded focus:outline-none focus:ring-2 ${touched.password && !isValidPassword(form.password)
                ? 'border-red-400 focus:ring-red-300'
                : 'border-gray-300 focus:ring-teal-600'
              }`}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {touched.password && (
            <span className="absolute top-3 right-3">
              {isValidPassword(form.password) ? (
                <Check size={18} className="text-green-500" />
              ) : (
                <X size={18} className="text-red-500" />
              )}
            </span>
          )}
        </div>

        {/* Términos */}
        <label className="flex items-center text-sm mb-2 mt-1 text-gray-600">
          <input
            type="checkbox"
            name="terms"
            className="mr-2 accent-teal-700"
            checked={form.terms}
            onChange={handleChange}
          />
          Acepto los{' '}
          <a
            href="/info/terms"
            className="underline text-teal-700 ml-1"
            target="_blank"
          >
            Términos y Condiciones
          </a>
        </label>

        {/* Botón */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2.5 rounded transition"
        >
          <CheckCircle size={18} />
          Registrarse
        </button>

        {/* Login */}
        <p className="text-sm text-center text-gray-600 mt-4">
          ¿Ya tienes cuenta?
          <a
            href={`/login${redirect ? `?redirect=${redirect}` : ''}`}
            className="text-teal-700 hover:underline ml-1 font-medium"
          >
            Inicia sesión
          </a>
        </p>
      </form>
    </div>
  );
}
