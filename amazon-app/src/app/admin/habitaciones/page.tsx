'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash, Pencil } from 'lucide-react';
import Modal from '@/components/modal/page';

export default function AdminHabitacionesPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    id: null as number | null,
    name: '',
    type: '',
    price: '',
    description: '',
    image: '',
  });

  const [habitaciones, setHabitaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [accion, setAccion] = useState<'crear' | 'actualizar' | 'eliminar' | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [habitacionAEliminar, setHabitacionAEliminar] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // ✅ Protección de ruta
  useEffect(() => {
    const userData = localStorage.getItem('user');
    const storedToken = localStorage.getItem('access_token');

    if (!userData || !storedToken) {
      router.push('/');
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.role !== 'admin') {
        router.push('/');
        return;
      }

      setToken(storedToken);
      loadRooms();
    } catch {
      router.push('/');
    }
  }, [router]);

  const loadRooms = async () => {
    const res = await fetch('http://localhost:3000/rooms');
    const data = await res.json();
    setHabitaciones(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: form.name,
        type: form.type,
        price: parseFloat(form.price),
        description: form.description,
        image: form.image,
      };

      const method = form.id ? 'PUT' : 'POST';
      const url = form.id
        ? `http://localhost:3000/rooms/${form.id}`
        : `http://localhost:3000/rooms`;

      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      setAccion(form.id ? 'actualizar' : 'crear');
      setForm({ id: null, name: '', type: '', price: '', description: '', image: '' });
      loadRooms();
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (room: any) => {
    setForm({
      id: room.id,
      name: room.name,
      type: room.type,
      price: room.price.toString(),
      description: room.description,
      image: room.image || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: number) => {
    setHabitacionAEliminar(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!habitacionAEliminar) return;

    await fetch(`http://localhost:3000/rooms/${habitacionAEliminar}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    setShowConfirmModal(false);
    setHabitacionAEliminar(null);
    loadRooms();
    setAccion('eliminar');
    setShowSuccessModal(true);
  };

  return (
    <div className="min-h-screen pt-0 px-4 md:px-6 pb-20 bg-gray-100 text-gray-800">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-teal-800 mb-6 text-center">
          {form.id ? 'Editar habitación' : 'Agregar habitación'}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow rounded-xl p-4 md:p-6 space-y-4 mb-10 border"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 border rounded"
              required
            />
            <input
              type="text"
              name="type"
              placeholder="Tipo"
              value={form.type}
              onChange={handleChange}
              className="w-full p-3 border rounded"
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Precio"
              value={form.price}
              onChange={handleChange}
              className="w-full p-3 border rounded"
              required
            />
            <input
              type="text"
              name="image"
              placeholder="URL de la imagen"
              value={form.image}
              onChange={handleChange}
              className="w-full p-3 border rounded"
              required
            />
            <textarea
              name="description"
              placeholder="Descripción"
              value={form.description}
              onChange={handleChange}
              className="w-full p-3 border rounded sm:col-span-2"
              rows={3}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-700 hover:bg-teal-800 text-white py-2 rounded font-medium transition"
          >
            {loading ? 'Guardando...' : form.id ? 'Actualizar' : 'Registrar'}
          </button>
        </form>

        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Habitaciones registradas</h3>

        {habitaciones.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay habitaciones registradas.</p>
        ) : (
          <div className="space-y-4">
            <div className="md:hidden space-y-4">
              {habitaciones.map((room) => (
                <div key={room.id} className="border rounded-xl p-4 bg-white shadow-sm">
                  <div className="flex items-center gap-4">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-20 h-16 object-cover rounded border"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{room.name}</h4>
                      <p className="text-sm text-gray-600 capitalize">{room.type}</p>
                      <p className="text-sm text-teal-700 font-semibold mt-1">
                        S/. {(Number(room.price) || 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(room)}
                        className="text-indigo-600 hover:text-indigo-800"
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(room.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Eliminar"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block overflow-auto border rounded-lg bg-white shadow">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 border-b text-gray-700">
                  <tr>
                    <th className="px-4 py-3">Imagen</th>
                    <th className="px-4 py-3">Nombre</th>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3">Precio</th>
                    <th className="px-4 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {habitaciones.map((room) => (
                    <tr key={room.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <img
                          src={room.image}
                          alt={room.name}
                          className="w-16 h-12 object-cover rounded"
                        />
                      </td>
                      <td className="px-4 py-3">{room.name}</td>
                      <td className="px-4 py-3 capitalize">{room.type}</td>
                      <td className="px-4 py-3">S/. {(Number(room.price) || 0).toFixed(2)}</td>
                      <td className="px-4 py-3 space-x-2">
                        <button
                          onClick={() => handleEdit(room)}
                          className="text-indigo-600 hover:text-indigo-800"
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(room.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Eliminar"
                        >
                          <Trash size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Modal
        visible={showConfirmModal}
        title="¿Eliminar habitación?"
        message="Esta acción no se puede deshacer."
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowConfirmModal(false);
          setHabitacionAEliminar(null);
        }}
      />

      <Modal
        visible={showSuccessModal}
        title="Acción exitosa"
        message={
          accion === 'crear'
            ? 'La habitación ha sido registrada correctamente.'
            : accion === 'actualizar'
            ? 'La habitación ha sido actualizada correctamente.'
            : 'La habitación ha sido eliminada correctamente.'
        }
        confirmText="Cerrar"
        onConfirm={() => {
          setShowSuccessModal(false);
          setAccion(null);
        }}
        onCancel={() => {
          setShowSuccessModal(false);
          setAccion(null);
        }}
      />
    </div>
  );
}
