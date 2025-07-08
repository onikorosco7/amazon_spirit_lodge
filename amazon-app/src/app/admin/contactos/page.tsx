'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Trash2,
  Search,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Phone,
  MessageSquareText,
  UserRoundCheck,
} from 'lucide-react';
import Modal from '@/components/modal/page';

export default function ContactosAdminPage() {
  const router = useRouter();
  const [mensajes, setMensajes] = useState<any[]>([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(true);
  const [activo, setActivo] = useState<number | null>(null);

  const [mensajeAEliminar, setMensajeAEliminar] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [token, setToken] = useState<string | null>(null);

  // ✅ Proteger acceso: solo admins
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const accessToken = localStorage.getItem('access_token');

    if (!storedUser || !accessToken) {
      router.push('/');
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      if (user.role !== 'admin') {
        router.push('/');
        return;
      }
      setToken(accessToken);
    } catch {
      router.push('/');
    }
  }, [router]);

  const fetchMensajes = async () => {
    try {
      const res = await fetch('http://localhost:3000/contact', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMensajes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar mensajes de contacto', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = (id: number) => {
    setMensajeAEliminar(id);
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    if (!mensajeAEliminar) return;

    try {
      const res = await fetch(`http://localhost:3000/contact/${mensajeAEliminar}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('No se pudo eliminar el mensaje.');

      setMensajes((prev) => prev.filter((m) => m.id !== mensajeAEliminar));
      setShowConfirmModal(false);
      setShowSuccessModal(true);
    } catch (err: any) {
      console.error('Error al eliminar mensaje', err);
      setErrorMessage(err.message || 'Ocurrió un error inesperado.');
      setShowConfirmModal(false);
      setShowErrorModal(true);
    } finally {
      setMensajeAEliminar(null);
    }
  };

  useEffect(() => {
    if (token) fetchMensajes();
  }, [token]);

  const mensajesFiltrados = mensajes.filter((m) => {
    const texto = `${m.name} ${m.email}`.toLowerCase();
    return texto.includes(filtro.toLowerCase());
  });

  return (
    <div className="min-h-screen p-6 bg-white text-gray-800">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-teal-700">
        <Mail size={20} />
        Mensajes de Contacto
      </h1>

      <div className="mb-4 flex items-center gap-2">
        <Search size={18} className="text-gray-500" />
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full max-w-sm px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando mensajes...</p>
      ) : mensajesFiltrados.length === 0 ? (
        <p className="text-gray-500">No se encontraron mensajes.</p>
      ) : (
        <div className="space-y-4">
          {mensajesFiltrados.map((m) => (
            <div key={m.id} className="border border-gray-200 rounded-md p-4 bg-gray-50 shadow-sm">
              <div
                onClick={() => setActivo((prev) => (prev === m.id ? null : m.id))}
                className="flex justify-between items-center cursor-pointer"
              >
                <div>
                  <p className="font-semibold text-teal-800">{m.name}</p>
                  <p className="text-sm text-gray-600">{m.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-400">
                    {new Date(m.createdAt).toLocaleString()}
                  </p>
                  {activo === m.id ? (
                    <ChevronUp size={18} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-500" />
                  )}
                </div>
              </div>

              {activo === m.id && (
                <div className="mt-4 text-sm text-gray-800 space-y-2">
                  {m.phone && (
                    <p className="flex items-center gap-1 text-gray-700">
                      <Phone size={16} className="text-teal-600" />
                      <strong>Teléfono:</strong> {m.phone}
                    </p>
                  )}
                  <p className="flex items-start gap-1 text-gray-700">
                    <MessageSquareText size={16} className="text-teal-600 mt-0.5" />
                    <strong>Mensaje:</strong> {m.message}
                  </p>
                  {m.user && (
                    <p className="flex items-center gap-1 text-green-700">
                      <UserRoundCheck size={16} />
                      Usuario registrado: {m.user.fullName} ({m.user.email})
                    </p>
                  )}
                  <div className="pt-2">
                    <button
                      onClick={() => handleConfirmDelete(m.id)}
                      className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <Trash2 size={16} />
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal Confirmación */}
      <Modal
        visible={showConfirmModal}
        title={
          <span className="flex items-center gap-2 text-red-600 font-semibold">
            <XCircle size={20} />
            ¿Estás seguro de eliminar este mensaje?
          </span>
        }
        message="Esta acción no se puede deshacer."
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        onConfirm={handleDelete}
        onCancel={() => {
          setShowConfirmModal(false);
          setMensajeAEliminar(null);
        }}
      />

      {/* Modal Éxito */}
      <Modal
        visible={showSuccessModal}
        title={
          <span className="flex items-center gap-2 text-green-600 font-semibold">
            <CheckCircle size={20} />
            Mensaje eliminado exitosamente
          </span>
        }
        message="El mensaje ha sido eliminado correctamente."
        confirmText="Cerrar"
        onConfirm={() => setShowSuccessModal(false)}
      />

      {/* Modal Error */}
      <Modal
        visible={showErrorModal}
        title={
          <span className="flex items-center gap-2 text-red-600 font-semibold">
            <XCircle size={20} />
            Error al eliminar
          </span>
        }
        message={errorMessage}
        confirmText="Cerrar"
        onConfirm={() => {
          setShowErrorModal(false);
          setErrorMessage('');
        }}
      />
    </div>
  );
}
