'use client';

import { useEffect, useState } from 'react';
import { Calendar, Trash2, Star, CheckCircle, AlertTriangle } from 'lucide-react';
import Modal from '../../components/modal/page';

export default function MisResenasPage() {
  const [resenas, setResenas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
  const [modalSuccessVisible, setModalSuccessVisible] = useState(false);
  const [modalErrorVisible, setModalErrorVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [resenaAEliminar, setResenaAEliminar] = useState<number | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  const loadResenas = async () => {
    try {
      const res = await fetch('http://localhost:3000/reviews/mine', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setResenas(data);
      } else {
        setError('Error al cargar reseñas.');
      }
    } catch (err) {
      setError('Error de conexión al servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadResenas();
  }, []);

  const abrirModalConfirmacion = (id: number) => {
    setResenaAEliminar(id);
    setModalConfirmVisible(true);
  };

  const confirmarEliminar = async () => {
    if (!resenaAEliminar) return;
    try {
      await fetch(`http://localhost:3000/reviews/${resenaAEliminar}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setModalMessage('La reseña ha sido eliminada correctamente.');
      setModalSuccessVisible(true);
      loadResenas();
    } catch (err) {
      setModalMessage('Error al eliminar la reseña.');
      setModalErrorVisible(true);
    } finally {
      setModalConfirmVisible(false);
      setResenaAEliminar(null);
    }
  };

  return (
    <section className="pt-0 px-6 pb-12 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-teal-800 mb-6 text-center">Mis Reseñas</h2>

        {loading ? (
          <p className="text-center text-gray-600">Cargando reseñas...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : resenas.length === 0 ? (
          <p className="text-center text-gray-500">Aún no has enviado ninguna reseña.</p>
        ) : (
          <div className="grid gap-4">
            {resenas.map((r) => (
              <div
                key={r.id}
                className="border rounded p-4 shadow-sm bg-gray-50 hover:bg-gray-100 transition"
              >
                <p className="text-gray-800 italic mb-2">"{r.message}"</p>
                <p className="text-yellow-500 text-sm mb-1">
                  {Array(r.rating)
                    .fill(0)
                    .map((_, i) => (
                      <Star key={i} size={16} className="inline-block mr-1" fill="#facc15" />
                    ))}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                  <Calendar size={12} />
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
                <button
                  onClick={() => abrirModalConfirmacion(r.id)}
                  className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                >
                  <Trash2 size={16} /> Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Confirmación de eliminación */}
      <Modal
        visible={modalConfirmVisible}
        title={<div className="flex items-center gap-2"><Trash2 className="text-red-600" size={20} /> ¿Eliminar reseña?</div>}
        message="Esta acción no se puede deshacer."
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        onConfirm={confirmarEliminar}
        onCancel={() => {
          setModalConfirmVisible(false);
          setResenaAEliminar(null);
        }}
      />

      {/* Modal Éxito */}
      <Modal
        visible={modalSuccessVisible}
        title={<div className="flex items-center gap-2"><CheckCircle className="text-green-600" size={20} /> Éxito</div>}
        message={modalMessage}
        confirmText="Cerrar"
        onConfirm={() => setModalSuccessVisible(false)}
      />

      {/* Modal Error */}
      <Modal
        visible={modalErrorVisible}
        title={<div className="flex items-center gap-2"><AlertTriangle className="text-red-600" size={20} /> Error</div>}
        message={modalMessage}
        confirmText="Cerrar"
        onConfirm={() => setModalErrorVisible(false)}
      />
    </section>
  );
}
