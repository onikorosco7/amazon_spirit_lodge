'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AvatarPage() {
  const router = useRouter();
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const [user, setUser] = useState<{ fullName: string; avatar?: string } | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      router.push('/login?redirect=/perfil/avatar');
    } else {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setPreview(parsed.avatar || null);
      } catch {
        router.push('/login');
      }
    }
  }, [router]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setError('');
    setSuccess('');
    setLoading(true);

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await fetch('http://localhost:3000/users/avatar', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Error al subir imagen');

      setSuccess('Avatar actualizado');
      setUser(data);
      setPreview(data.avatar);
      localStorage.setItem('user', JSON.stringify(data));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const avatarInitial = user?.fullName?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="min-h-screen pt-8 px-6 bg-white">
      <div className="max-w-lg mx-auto bg-white shadow-md rounded-2xl p-8 text-center">
        <h2 className="text-3xl font-bold text-teal-800 mb-6">Foto de Perfil</h2>

        <div className="flex justify-center mb-6">
          {preview ? (
            <img
              src={preview}
              alt="avatar"
              className="w-28 h-28 rounded-full object-cover border shadow"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-teal-700 text-white flex items-center justify-center text-3xl font-bold shadow">
              {avatarInitial}
            </div>
          )}
        </div>

        <input
          ref={inputFileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />

        <button
          onClick={() => inputFileRef.current?.click()}
          disabled={loading}
          className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-2 rounded font-medium transition"
        >
          {loading ? 'Subiendo...' : 'Cambiar imagen'}
        </button>

        {success && <p className="text-green-600 text-sm mt-4">{success}</p>}
        {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
      </div>
    </div>
  );
}
