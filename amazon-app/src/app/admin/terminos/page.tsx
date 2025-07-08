'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, CheckCircle } from 'lucide-react';
import Modal from '@/components/modal/page';

export default function AdminTermsPage() {
  const router = useRouter();

  const [terms, setTerms] = useState('Cargando...');
  const [editing, setEditing] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // ✅ Protección de ruta: solo admin puede entrar
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
      fetchTerms();
    } catch {
      router.push('/');
    }
  }, [router]);

  const fetchTerms = async () => {
    try {
      const res = await fetch('http://localhost:3000/terms');
      const data = await res.json();
      setTerms(data.content);
      setNewContent(data.content);
    } catch {
      setTerms('No se pudo cargar el contenido.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/terms', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: newContent }),
    });
    if (res.ok) {
      fetchTerms();
      setEditing(false);
      setShowModal(true);
    }
  };

  return (
    <div className="min-h-screen pt-4 px-6 pb-20 bg-white text-gray-800">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-teal-800">Términos y Condiciones</h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <Pencil size={16} /> Editar
            </button>
          )}
        </div>

        {editing ? (
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 shadow rounded-xl p-6 space-y-4"
          >
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Contenido en HTML..."
              rows={18}
              className="w-full p-4 border border-gray-300 rounded-lg font-mono text-sm placeholder-gray-400 text-black focus:ring-2 focus:ring-teal-600 outline-none resize-none"
            />
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-teal-700 text-white hover:bg-teal-800 font-semibold shadow"
              >
                Guardar
              </button>
            </div>
          </form>
        ) : (
          <div className="prose prose-sm max-w-full text-gray-700 whitespace-pre-line border border-gray-200 p-6 rounded-lg bg-gray-50 shadow">
            {terms}
          </div>
        )}

        {/* Modal de confirmación */}
        <Modal
          visible={showModal}
          title={
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-6 h-6" />
              Términos actualizados
            </div>
          }
          message="Los términos fueron actualizados correctamente."
          confirmText="Cerrar"
          onConfirm={() => setShowModal(false)}
          onCancel={() => setShowModal(false)}
        />
      </div>
    </div>
  );
}
