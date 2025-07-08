'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarCheck, CalendarDays, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import Modal from '../components/modal/page';

interface Room {
  id: number;
  name: string;
  type: string;
  price: number;
}

interface RangoOcupado {
  checkIn: string;
  checkOut: string;
}

const capacidadPorTipo: Record<string, number> = {
  simple: 1,
  doble: 2,
  matrimonial: 2,
  triple: 3,
  familiar: 4,
  suite: 3,
};

export default function ReservarPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomId, setRoomId] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [tipoSeleccionado, setTipoSeleccionado] = useState('');
  const [rangosOcupados, setRangosOcupados] = useState<RangoOcupado[]>([]);

  const [modalSuccessVisible, setModalSuccessVisible] = useState(false);
  const [modalErrorVisible, setModalErrorVisible] = useState(false);
  const [modalErrorMessage, setModalErrorMessage] = useState('');

  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:3000/rooms')
      .then((res) => res.json())
      .then(setRooms);
  }, []);

  useEffect(() => {
    if (!roomId) return;

    fetch(`http://localhost:3000/bookings/disponibilidad/${roomId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRangosOcupados(data);
        } else {
          setRangosOcupados([]);
        }
      });

    const tipo = rooms.find((r) => r.id === Number(roomId))?.type || '';
    setTipoSeleccionado(tipo);
  }, [roomId, rooms]);

  const hoy = new Date().toISOString().split('T')[0];
  const minSalida = checkIn ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0] : '';

  const fechasSolapadas = (inicio: string, fin: string) => {
    const entrada = new Date(inicio);
    const salida = new Date(fin);
    return Array.isArray(rangosOcupados) && rangosOcupados.some(({ checkIn, checkOut }) => {
      const ocupadaDesde = new Date(checkIn);
      const ocupadaHasta = new Date(checkOut);
      return entrada < ocupadaHasta && salida > ocupadaDesde;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login?redirect=/reservar');
      return;
    }

    const maxHuespedes = capacidadPorTipo[tipoSeleccionado.toLowerCase()] || 0;
    if (guests > maxHuespedes) {
      setModalErrorMessage(`Esta habitación permite máximo ${maxHuespedes} huésped(es).`);
      setModalErrorVisible(true);
      return;
    }

    if (fechasSolapadas(checkIn, checkOut)) {
      setModalErrorMessage('Las fechas seleccionadas ya están ocupadas. Elige otro rango.');
      setModalErrorVisible(true);
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      setModalErrorMessage('La fecha de salida debe ser posterior a la fecha de entrada.');
      setModalErrorVisible(true);
      return;
    }

    const res = await fetch('http://localhost:3000/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        roomId: Number(roomId),
        checkIn,
        checkOut,
        guests,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setModalErrorMessage(data.message || 'Error al reservar');
      setModalErrorVisible(true);
      return;
    }

    setRoomId('');
    setCheckIn('');
    setCheckOut('');
    setGuests(1);
    setModalSuccessVisible(true);
  };

  return (
    <section className="py-16 pt-4 bg-white min-h-screen text-black">
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4 text-center flex items-center justify-center gap-2 flex-wrap">
          <CalendarCheck size={28} className="text-teal-700" />
          <span>Reservar tu estancia</span>
        </h2>

        {/* Botón de navegación a habitaciones */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => router.push('/habitaciones')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-semibold shadow transition hover:scale-[1.03] flex items-center gap-2"
          >
            <CalendarDays size={18} />
            Ver habitaciones disponibles
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-white p-6 rounded-xl shadow-md border border-gray-200"
        >
          <div>
            <label className="block mb-1 text-sm font-medium">Habitación</label>
            <select
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="appearance-none w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
              required
            >
              <option value="" disabled>Selecciona una habitación</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name} – S/. {room.price.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium">Check-in</label>
              <input
                type="date"
                min={hoy}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Check-out</label>
              <input
                type="date"
                min={minSalida}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Número de huéspedes</label>
            <div className="relative">
              <input
                type="number"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                min={1}
                required
                className="w-full p-3 border border-gray-300 rounded pr-10 focus:ring-2 focus:ring-teal-500"
              />
              <Users size={18} className="absolute top-3 right-3 text-teal-700" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-700 hover:bg-teal-800 text-white px-4 py-3 rounded-full font-semibold transition flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            <CheckCircle size={18} className="-mt-0.5" />
            Confirmar Reserva
          </button>
        </form>

        {/* Fechas ocupadas */}
        {rangosOcupados.length > 0 && (
          <div className="mt-10">
            <h3 className="text-base font-semibold text-gray-700 flex items-center gap-2 mb-2">
              <CalendarDays size={20} className="text-red-600" /> Fechas no disponibles
            </h3>
            <ul className="bg-gray-100 border border-gray-200 rounded-lg p-4 text-sm text-gray-800 space-y-1 max-h-48 overflow-y-auto">
              {rangosOcupados.map((rango, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CalendarCheck size={16} className="text-teal-600" />
                  {new Date(rango.checkIn).toLocaleDateString()} → {new Date(rango.checkOut).toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Modales */}
      <Modal
        visible={modalSuccessVisible}
        title={
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-600" size={20} />
            <span>Reserva exitosa</span>
          </div>
        }
        message="Tu reserva ha sido registrada correctamente."
        confirmText="Cerrar"
        onConfirm={() => setModalSuccessVisible(false)}
      />

      <Modal
        visible={modalErrorVisible}
        title={
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-red-600" size={20} />
            <span>Error</span>
          </div>
        }
        message={modalErrorMessage}
        confirmText="Cerrar"
        onConfirm={() => setModalErrorVisible(false)}
      />
    </section>
  );
}
