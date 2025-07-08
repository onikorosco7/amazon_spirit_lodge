'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Star } from 'lucide-react';
import Modal from '@/components/modal/page';

export default function AdminResenasPage() {
  const router = useRouter();
  const [resenas, setResenas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resenaAEliminar, setResenaAEliminar] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // ✅ Protección: solo admins
  useEffect(() => {
    const stored = localStorage.getItem('user');
    const accessToken = localStorage.getItem('access_token');

    if (!stored || !accessToken) {
      router.push('/');
      return;
    }

    try {
      const user = JSON.parse(stored);
      if (user.role !== 'admin') {
        router.push('/');
        return;
      }
      setToken(accessToken);
    } catch {
      router.push('/');
    }
  }, [router]);

  const fetchResenas = async () => {
    const res = await fetch('http://localhost:3000/reviews', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setResenas(data);
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchResenas();
  }, [token]);

  const eliminarResena = async () => {
    if (!resenaAEliminar) return;

    await fetch(`http://localhost:3000/reviews/${resenaAEliminar}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    setShowConfirmModal(false);
    setResenaAEliminar(null);
    setShowDeleteModal(true);
    fetchResenas();
  };

  const confirmarEliminacion = (id: number) => {
    setResenaAEliminar(id);
    setShowConfirmModal(true);
  };

  const renderStars = (count: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < count ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
      />
    ));

  return (
    <div className="min-h-screen pt-0 px-6 pb-20 bg-gray-100 text-gray-800">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-teal-800 mb-6 text-center">Reseñas de clientes</h2>

        {loading ? (
          <p className="text-gray-600 text-center">Cargando reseñas...</p>
        ) : resenas.length === 0 ? (
          <p className="text-gray-500 text-center">No hay reseñas registradas.</p>
        ) : (
          <div className="grid gap-4">
            {resenas.map((r) => (
              <div
                key={r.id}
                className="bg-white border border-teal-600 rounded-lg shadow-sm p-5 hover:shadow transition"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-gray-700 italic">"{r.message}"</p>
                    <div className="flex gap-1 mt-1">{renderStars(r.rating)}</div>
                    <p className="text-sm text-gray-500">— {r.user?.fullName || 'Usuario'}</p>
                  </div>
                  <button
                    onClick={() => confirmarEliminacion(r.id)}
                    className="text-red-600 hover:text-red-800 transition"
                    title="Eliminar reseña"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmación */}
      <Modal
        visible={showConfirmModal}
        title="¿Eliminar reseña?"
        message="Esta acción no se puede deshacer."
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        onConfirm={eliminarResena}
        onCancel={() => {
          setShowConfirmModal(false);
          setResenaAEliminar(null);
        }}
      />

      {/* Modal de eliminación exitosa */}
      <Modal
        visible={showDeleteModal}
        title="Reseña Eliminada"
        message="La reseña se ha eliminado correctamente."
        confirmText="Cerrar"
        onConfirm={() => setShowDeleteModal(false)}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
