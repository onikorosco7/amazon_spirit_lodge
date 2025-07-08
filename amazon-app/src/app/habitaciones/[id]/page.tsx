'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Bed,
  Bath,
  ShowerHead,
  Toilet,
  Wifi,
  Utensils,
} from 'lucide-react';

type Room = {
  id: number;
  name: string;
  type: string;
  price: number;
  description: string;
  avaible: boolean;
  image: string | null;
};

export default function DetalleHabitacion() {
  const { id } = useParams();
  const router = useRouter();
  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    fetch(`http://localhost:3000/rooms/${id}`)
      .then((res) => res.json())
      .then(setRoom);
  }, [id]);

  const handleReserve = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push(`/login?redirect=/reservar/${id}`);
    } else {
      router.push(`/reservar/${id}`);
    }
  };

  if (!room) {
    return <div className="p-6 text-center text-gray-500">Cargando habitación...</div>;
  }

  return (
    <section className="px-6 pt-4 pb-16 max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-3xl font-bold text-teal-800">
          <Bed size={28} /> {room.name}
        </div>
        <p className="text-lg text-gray-600 mt-1 capitalize">{room.type}</p>
        <p className="text-xl font-semibold mt-2 text-teal-800">
          $/. {Number(room.price).toFixed(2)} por noche
        </p>
      </div>

      <img
        src={room.image || '/img/habitacion-placeholder.jpg'}
        alt={room.name}
        className="w-full h-64 object-cover rounded shadow mb-6"
      />

      <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">
        {room.description}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <div className="flex items-center gap-3 text-gray-700"><Toilet /><span>Baño privado</span></div>
        <div className="flex items-center gap-3 text-gray-700"><Bath /><span>Toalla incluida</span></div>
        <div className="flex items-center gap-3 text-gray-700"><ShowerHead /><span>Ducha con agua caliente</span></div>
        <div className="flex items-center gap-3 text-gray-700"><Bed /><span className="capitalize">{room.type}</span></div>
        <div className="flex items-center gap-3 text-gray-700"><Wifi /><span>Wi-Fi libre</span></div>
        <div className="flex items-center gap-3 text-gray-700"><Utensils /><span>Desayuno, almuerzo y cena</span></div>
      </div>

      <button
        onClick={handleReserve}
        className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-3 rounded-full text-lg font-medium transition"
      >
        Reservar esta habitación
      </button>
    </section>
  );
}
