'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CalendarCheck, CalendarDays, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import Modal from '../../components/modal/page'; // ajusta si está en otra ruta

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

export default function ReservarIdPage() {
  const { id } = useParams();
  const router = useRouter();

  const [room, setRoom] = useState<Room | null>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [rangosOcupados, setRangosOcupados] = useState<RangoOcupado[]>([]);

  const [modalSuccessVisible, setModalSuccessVisible] = useState(false);
  const [modalErrorVisible, setModalErrorVisible] = useState(false);
  const [modalErrorMessage, setModalErrorMessage] = useState('');

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:3000/rooms/${id}`)
      .then((res) => res.json())
      .then(setRoom);

    fetch(`http://localhost:3000/bookings/disponibilidad/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRangosOcupados(data);
        } else {
          console.warn('La respuesta no es un array:', data);
          setRangosOcupados([]);
        }
      })
      .catch((err) => {
        console.error('Error al cargar fechas ocupadas:', err);
        setRangosOcupados([]);
      });
  }, [id]);

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
      router.push('/login');
      return;
    }

    if (!checkIn || !checkOut) {
      setModalErrorMessage('Debes seleccionar ambas fechas.');
      setModalErrorVisible(true);
      return;
    }

    if (new Date(checkIn) < new Date(hoy)) {
      setModalErrorMessage('La fecha de check-in no puede ser anterior a hoy.');
      setModalErrorVisible(true);
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      setModalErrorMessage('La fecha de check-out debe ser posterior al check-in.');
      setModalErrorVisible(true);
      return;
    }

    if (fechasSolapadas(checkIn, checkOut)) {
      setModalErrorMessage('Las fechas seleccionadas ya están ocupadas. Elige otro rango.');
      setModalErrorVisible(true);
      return;
    }

    const max = room?.type ? capacidadPorTipo[room.type.toLowerCase()] || 1 : 1;
    if (guests > max) {
      setModalErrorMessage(`Esta habitación permite máximo ${max} huésped(es).`);
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
        roomId: Number(id),
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

    setCheckIn('');
    setCheckOut('');
    setGuests(1);
    setModalSuccessVisible(true);
  };

  if (!room) {
    return <div className="p-6 text-center text-gray-500">Cargando habitación...</div>;
  }

  return (
    <section className="py-16 pt-4 bg-white min-h-screen text-black">
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center flex flex-wrap justify-center items-center gap-2">
          <CalendarCheck size={28} className="text-teal-700" /> Reservar: {room.name}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-6 rounded-xl shadow-md border border-gray-200"
        >
          <div className="text-sm text-gray-700 space-y-1">
            <p className="capitalize">Tipo: <span className="font-medium">{room.type}</span></p>
            <p className="text-lg font-bold text-teal-800">S/. {room.price.toFixed(2)} por noche</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium">Check-in</label>
              <input
                type="date"
                min={hoy}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium">Check-out</label>
              <input
                type="date"
                min={minSalida}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500"
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
                className="w-full p-3 pr-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500"
              />
              <Users size={18} className="absolute top-3 right-3 text-teal-700" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-700 hover:bg-teal-800 text-white px-4 py-3 rounded-full font-semibold transition flex justify-center items-center gap-2"
          >
            <CheckCircle size={18} /> Confirmar Reserva
          </button>
        </form>

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

      {/* ✅ Modal éxito */}
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

      {/* ❌ Modal error */}
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
