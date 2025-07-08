'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/modal/page';
import { CheckCircle } from 'lucide-react';

export default function AdminPrivacyPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [showModal, setShowModal] = useState(false);

  // ✅ Protección de ruta: solo admin
  useEffect(() => {
    const userData = localStorage.getItem('user');
    const accessToken = localStorage.getItem('access_token');

    if (!userData || !accessToken) {
      router.push('/');
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.role !== 'admin') {
        router.push('/');
        return;
      }

      setToken(accessToken);
      fetchPrivacy();
    } catch {
      router.push('/');
    }
  }, [router]);

  const fetchPrivacy = async () => {
    try {
      const res = await fetch('http://localhost:3000/privacy');
      const data = await res.json();
      if (data?.content) setContent(data.content);
    } catch (err) {
      console.error('Error al cargar privacidad:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('http://localhost:3000/privacy', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });
    setShowModal(true);
  };

  return (
    <div className="min-h-screen pt-4 px-6 pb-20 bg-white text-gray-800">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-teal-800 mb-6 text-center">
          Política de Privacidad
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 shadow-xl rounded-xl p-6 space-y-5"
        >
          <label className="text-gray-700 font-semibold block">
            Contenido en HTML:
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe o edita aquí la política de privacidad en HTML..."
            rows={18}
            className="w-full p-4 border border-gray-300 rounded-lg font-mono text-sm placeholder-gray-400 text-black focus:ring-2 focus:ring-teal-600 outline-none resize-none"
          ></textarea>

          <button
            type="submit"
            className="w-full bg-teal-700 hover:bg-teal-800 text-white py-3 rounded-lg font-semibold shadow transition"
          >
            Guardar Cambios
          </button>
        </form>

        {/* Modal con ícono */}
        <Modal
          visible={showModal}
          title={
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-6 h-6" />
              Cambios guardados
            </div>
          }
          message="La Política de Privacidad se ha actualizado correctamente."
          confirmText="Cerrar"
          onConfirm={() => setShowModal(false)}
          onCancel={() => setShowModal(false)}
        />
      </div>
    </div>
  );
}
