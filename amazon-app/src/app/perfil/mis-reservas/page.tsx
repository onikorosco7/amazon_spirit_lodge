'use client';

import { useEffect, useState } from 'react';
import { Calendar, XCircle, Pencil, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import Modal from '../../components/modal/page';

const estilosEstado: Record<string, { fondo: string; texto: string; badge: string; emoji: string; btnEditar: string }> = {
  pending: {
    fondo: 'bg-yellow-50',
    texto: 'text-yellow-800',
    badge: 'bg-yellow-100 text-yellow-800',
    emoji: '🟡',
    btnEditar: 'text-yellow-700 hover:text-yellow-900',
  },
  confirmed: {
    fondo: 'bg-green-50',
    texto: 'text-green-800',
    badge: 'bg-green-100 text-green-800',
    emoji: '🟢',
    btnEditar: 'text-green-700 hover:text-green-900',
  },
  cancelled: {
    fondo: 'bg-red-50',
    texto: 'text-red-800',
    badge: 'bg-red-100 text-red-800',
    emoji: '🔴',
    btnEditar: 'text-red-700 hover:text-red-900',
  },
};

export default function MisReservasPage() {
  const [reservas, setReservas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalSuccessVisible, setModalSuccessVisible] = useState(false);
  const [modalErrorVisible, setModalErrorVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);

  const [selectedReservaId, setSelectedReservaId] = useState<number | null>(null);
  const [selectedReserva, setSelectedReserva] = useState<any>(null);
  const [editCheckIn, setEditCheckIn] = useState('');
  const [editCheckOut, setEditCheckOut] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  const loadReservas = async () => {
    try {
      const res = await fetch('http://localhost:3000/bookings/mine', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setReservas(data);
      } else {
        setModalMessage('Error al cargar reservas.');
        setModalErrorVisible(true);
      }
    } catch (err) {
      setModalMessage('Error de conexión al servidor.');
      setModalErrorVisible(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadReservas();
  }, []);

  const confirmarCancelacion = (id: number) => {
    setSelectedReservaId(id);
    setModalConfirmVisible(true);
  };

  const cancelarReserva = async () => {
    if (!selectedReservaId) return;

    await fetch(`http://localhost:3000/bookings/${selectedReservaId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    setModalMessage('Reserva cancelada correctamente.');
    setModalSuccessVisible(true);
    setModalConfirmVisible(false);
    setSelectedReservaId(null);
    loadReservas();
  };

  const iniciarEdicion = (reserva: any) => {
    setSelectedReserva(reserva);
    setEditCheckIn(reserva.checkIn.slice(0, 10));
    setEditCheckOut(reserva.checkOut.slice(0, 10));
    setModalEditVisible(true);
  };

  const guardarEdicion = async () => {
    if (!selectedReserva) return;

    await fetch(`http://localhost:3000/bookings/${selectedReserva.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ checkIn: editCheckIn, checkOut: editCheckOut }),
    });

    setModalMessage('Reserva actualizada correctamente.');
    setModalSuccessVisible(true);
    setModalEditVisible(false);
    setSelectedReserva(null);
    loadReservas();
  };

  const hoy = new Date();
  const activas = reservas.filter((r) => r.status !== 'cancelled' && new Date(r.checkOut) >= hoy);
  const historico = reservas.filter((r) => r.status === 'cancelled' || new Date(r.checkOut) < hoy);

  return (
    <section className="pt-0 px-6 pb-12 bg-white min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-teal-800 mb-6 text-center">Mis Reservas</h2>

        {loading ? (
          <p className="text-center text-gray-600">Cargando reservas...</p>
        ) : (
          <>
            {activas.length > 0 && (
              <div className="grid gap-6 mb-10">
                <h3 className="text-xl font-semibold text-teal-900">Reservas activas</h3>
                {activas.map((r) => {
                  const estado = r.status ?? 'pending';
                  const estilo = estilosEstado[estado] ?? estilosEstado['pending'];

                  return (
                    <div
                      key={r.id}
                      className={`border rounded-lg p-4 shadow-sm transition ${estilo.fondo} ${estilo.texto}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">
                          {estilo.emoji} {r.room?.name}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${estilo.badge}`}>
                          {estado}
                        </span>
                      </div>

                      <p className="text-sm mb-2 flex items-center gap-1">
                        <Calendar className="text-current" size={16} />
                        {new Date(r.checkIn).toLocaleDateString()} → {new Date(r.checkOut).toLocaleDateString()}
                      </p>
                      <p className="text-sm mb-2">Huéspedes: {r.guests}</p>

                      <div className="flex gap-3">
                        <button
                          onClick={() => confirmarCancelacion(r.id)}
                          className="text-red-700 hover:text-red-900 flex items-center gap-1 text-sm"
                        >
                          <XCircle size={16} /> Cancelar
                        </button>
                        {estado === 'pending' && (
                          <button
                            onClick={() => iniciarEdicion(r)}
                            className={`${estilo.btnEditar} flex items-center gap-1 text-sm`}
                          >
                            <Pencil size={16} /> Editar
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {historico.length > 0 && (
              <div className="grid gap-6">
                <h3 className="text-xl font-semibold text-gray-900">Historial de reservas</h3>
                {historico.map((r) => (
                  <div
                    key={r.id}
                    className="border rounded-lg p-4 bg-gray-50 transition shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-gray-800">{r.room?.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${r.status === 'cancelled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-200 text-gray-700'
                        }`}>
                        {r.status === 'cancelled' ? 'Cancelada' : 'Finalizada'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <Calendar className="inline mr-1 text-teal-700" size={16} />
                      {new Date(r.checkIn).toLocaleDateString()} → {new Date(r.checkOut).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-700 mb-1">Huéspedes: {r.guests}</p>
                  </div>
                ))}
              </div>
            )}

            {activas.length === 0 && historico.length === 0 && (
              <div className="text-center text-gray-600 mt-10 text-base">
                <p>Aún no has hecho tu reserva.</p>
                <a href="/reservar" className="text-teal-700 hover:text-teal-800 font-semibold mt-4 inline-block">
                  Haz tu reserva aquí
                </a>
              </div>
            )}
          </>
        )}
      </div>

      {/* ✅ Modal Confirmación de Cancelación */}
      <Modal
        visible={modalConfirmVisible}
        title={<div className="flex items-center gap-2"><HelpCircle className="text-yellow-500" size={20} /> ¿Cancelar reserva?</div>}
        message="Esta acción no se puede deshacer."
        confirmText="Sí, cancelar"
        cancelText="No"
        onConfirm={cancelarReserva}
        onCancel={() => setModalConfirmVisible(false)}
      />

      {/* ✅ Modal Edición */}
      <Modal
        visible={modalEditVisible}
        title={<div className="flex items-center gap-2"><Pencil className="text-blue-600" size={20} /> Editar reserva</div>}
        confirmText="Guardar cambios"
        cancelText="Cancelar"
        onConfirm={guardarEdicion}
        onCancel={() => setModalEditVisible(false)}
      >
        <div className="space-y-3 mt-2">
          <label className="block text-sm">
            Check-in:
            <input
              type="date"
              className="mt-1 w-full border rounded px-3 py-2"
              value={editCheckIn}
              onChange={(e) => setEditCheckIn(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            Check-out:
            <input
              type="date"
              className="mt-1 w-full border rounded px-3 py-2"
              value={editCheckOut}
              onChange={(e) => setEditCheckOut(e.target.value)}
            />
          </label>
        </div>
      </Modal>

      {/* ✅ Modal Éxito */}
      <Modal
        visible={modalSuccessVisible}
        title={<div className="flex items-center gap-2"><CheckCircle className="text-green-600" size={20} /> Éxito</div>}
        message={modalMessage}
        confirmText="Cerrar"
        onConfirm={() => setModalSuccessVisible(false)}
      />

      {/* ❌ Modal Error */}
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
