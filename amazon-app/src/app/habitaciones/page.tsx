'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bed } from 'lucide-react';

type Room = {
  id: number;
  name: string;
  type: string;
  price: number;
  description: string;
  avaible: boolean;
  image: string | null;
};

export default function HabitacionesPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:3000/rooms')
      .then((res) => res.json())
      .then(setRooms);
  }, []);

  return (
    <section className="px-6 pt-4 pb-16 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-teal-800 mb-10">
        Nuestras Habitaciones
      </h1>

      {rooms.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No hay habitaciones disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={room.image || '/img/habitacion-placeholder.jpg'}
                alt={room.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex flex-col justify-between h-[220px]">
                <div>
                  <div className="flex items-center gap-2 text-xl font-bold text-teal-800">
                    <Bed size={20} /> {room.name}
                  </div>
                  <p className="text-sm text-gray-500 capitalize">{room.type}</p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">{room.description}</p>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-lg font-semibold text-teal-800">
                    $/. {Number(room.price).toFixed(2)} por noche
                  </p>
                  <button
                    onClick={() => router.push(`/habitaciones/${room.id}`)}
                    className="bg-teal-700 hover:bg-teal-800 text-white text-sm px-4 py-2 rounded transition font-medium"
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
