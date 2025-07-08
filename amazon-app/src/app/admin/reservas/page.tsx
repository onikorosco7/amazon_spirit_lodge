'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CalendarDays,
  Users,
  User,
  BedDouble,
  Loader,
  Trash,
  ChevronDown,
  Check,
  X,
} from 'lucide-react';
import Modal from '@/components/modal/page';

export default function AdminReservasPage() {
  const router = useRouter();
  const [reservas, setReservas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [reservaAEliminar, setReservaAEliminar] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);

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

  const fetchReservas = async () => {
    const res = await fetch('http://localhost:3000/bookings', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setReservas(data);
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchReservas();
  }, [token]);

  const handleDelete = async () => {
    if (!reservaAEliminar) return;

    await fetch(`http://localhost:3000/bookings/admin/${reservaAEliminar}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    setShowConfirmModal(false);
    setReservaAEliminar(null);
    setShowSuccessModal(true);
    fetchReservas();
  };

  const handleStatusChange = async (id: number, status: string) => {
    const res = await fetch(`http://localhost:3000/bookings/admin/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      setOpenDropdownId(null);
      setShowSuccessModal(true);
      fetchReservas();
    }
  };

  const calcularNoches = (checkIn: string, checkOut: string) => {
    const ingreso = new Date(checkIn);
    const salida = new Date(checkOut);
    const dif = salida.getTime() - ingreso.getTime();
    return Math.ceil(dif / (1000 * 3600 * 24));
  };

  return (
    <div className="min-h-screen pt-0 px-4 pb-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-teal-800 mb-6 text-center md:text-left">Reservas</h2>

        {loading ? (
          <div className="flex justify-center items-center h-40 text-teal-600">
            <Loader className="animate-spin mr-2" /> Cargando reservas...
          </div>
        ) : reservas.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay reservas registradas.</p>
        ) : (
          <div className="overflow-auto bg-white rounded-xl shadow border text-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">Usuario</th>
                  <th className="px-4 py-3 text-left">Habitación</th>
                  <th className="px-4 py-3 text-left">Ingreso</th>
                  <th className="px-4 py-3 text-left">Salida</th>
                  <th className="px-4 py-3 text-left">Noches</th>
                  <th className="px-4 py-3 text-left">Fecha</th>
                  <th className="px-4 py-3 text-left">Personas</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                  <th className="px-4 py-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reservas.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-teal-600" />
                        {r.user?.fullName || 'Desconocido'}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-800">
                      <div className="flex items-center gap-2">
                        <BedDouble size={16} className="text-indigo-600" />
                        {r.room?.name || 'Sin asignar'}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(r.checkIn).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(r.checkOut).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">
                      {calcularNoches(r.checkIn, r.checkOut)}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {new Date(r.createdAt).toLocaleDateString()}<br />
                      <span className="text-gray-400">
                        {new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Users size={16} /> {r.guests}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {r.status === 'cancelado' ? (
                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                          <X size={14} /> Cancelada
                        </span>
                      ) : (
                        <div className="relative inline-block">
                          <button
                            onClick={() => setOpenDropdownId(openDropdownId === r.id ? null : r.id)}
                            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-all duration-150 ${
                              r.status === 'confirmado'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {r.status}
                            <ChevronDown size={14} />
                          </button>
                          {openDropdownId === r.id && (
                            <div className="absolute left-0 mt-1 w-32 bg-white border shadow rounded z-20">
                              <button
                                onClick={() => handleStatusChange(r.id, 'confirmado')}
                                className="w-full text-left px-3 py-2 hover:bg-green-50 flex items-center gap-2"
                              >
                                <Check size={14} className="text-green-600" /> Confirmar
                              </button>
                              <button
                                onClick={() => handleStatusChange(r.id, 'cancelado')}
                                className="w-full text-left px-3 py-2 hover:bg-red-50 flex items-center gap-2"
                              >
                                <X size={14} className="text-red-600" /> Cancelar
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          setReservaAEliminar(r.id);
                          setShowConfirmModal(true);
                        }}
                        className="text-red-600 hover:text-red-800 transition"
                        title="Eliminar reserva"
                      >
                        <Trash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        visible={showConfirmModal}
        title="¿Eliminar reserva?"
        message="Esta acción no se puede deshacer."
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        onConfirm={handleDelete}
        onCancel={() => {
          setShowConfirmModal(false);
          setReservaAEliminar(null);
        }}
      />

      <Modal
        visible={showSuccessModal}
        title="Acción exitosa"
        message={
          reservaAEliminar
            ? 'La reserva ha sido eliminada correctamente.'
            : 'El estado de la reserva ha sido actualizado correctamente.'
        }
        confirmText="Cerrar"
        onConfirm={() => setShowSuccessModal(false)}
        onCancel={() => setShowSuccessModal(false)}
      />
    </div>
  );
}
