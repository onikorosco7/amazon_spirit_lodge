'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  id: number;
  fullName: string;
  email: string;
  role: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');


    if (!token) {
      router.push('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:3000/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Token inválido');

        const data = await res.json();
        setUser(data);
      } catch (err) {
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-teal-700 font-medium">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-white text-gray-800">
      <h1 className="text-2xl font-bold mb-4 text-teal-700">Bienvenido, {user?.fullName}</h1>
      <p className="text-sm text-gray-600">Correo: {user?.email}</p>
      <p className="text-sm text-gray-600">Rol: {user?.role}</p>
    </div>
  );
}
