'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react';
import Modal from '@/components/modal/page';

type TeamMember = {
  id: number;
  name: string;
  role: string;
  description?: string;
  imageUrl: string;
};

export default function AdminTeamPage() {
  const router = useRouter();

  const [team, setTeam] = useState<TeamMember[]>([]);
  const [form, setForm] = useState({
    name: '',
    role: '',
    description: '',
    imageUrl: '',
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [accion, setAccion] = useState<'crear' | 'actualizar' | 'eliminar' | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('access_token');

    if (!storedUser || !storedToken) {
      router.push('/');
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      if (user.role !== 'admin') {
        router.push('/');
        return;
      }

      setToken(storedToken);
      fetchTeam();
    } catch {
      router.push('/');
    }
  }, [router]);

  const fetchTeam = async () => {
    const res = await fetch('http://localhost:3000/team');
    const data = await res.json();
    setTeam(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const url = editId
      ? `http://localhost:3000/team/${editId}`
      : 'http://localhost:3000/team';
    const method = editId ? 'PATCH' : 'POST';

    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });

    await fetchTeam();
    setForm({ name: '', role: '', description: '', imageUrl: '' });
    setEditId(null);
    setAccion(editId ? 'actualizar' : 'crear');
    setShowModal(true);
    setLoading(false);
  };

  const confirmDelete = (id: number) => {
    setMemberToDelete(id);
    setShowConfirmDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!memberToDelete || !token) return;

    await fetch(`http://localhost:3000/team/${memberToDelete}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    await fetchTeam();
    setShowConfirmDeleteModal(false);
    setMemberToDelete(null);
    setAccion('eliminar');
    setShowModal(true);
  };

  const handleEdit = (member: TeamMember) => {
    setForm({
      name: member.name,
      role: member.role,
      description: member.description || '',
      imageUrl: member.imageUrl,
    });
    setEditId(member.id);
  };

  return (
    <div className="min-h-screen pt-4 px-6 pb-20 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-teal-800 mb-6">Equipo</h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 shadow p-6 rounded-xl space-y-4"
        >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nombre"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          <input
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="Rol"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Descripción"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            rows={3}
          />
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="https://imagen.com/foto.jpg"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-800 transition"
          >
            {editId ? 'Actualizar Miembro' : 'Agregar Miembro'}
          </button>
        </form>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-10">
          {team.map((member) => (
            <div key={member.id} className="text-center border rounded-xl p-4 shadow bg-white">
              <img
                src={member.imageUrl.startsWith('http') ? member.imageUrl : `http://localhost:3000${member.imageUrl}`}
                alt={member.name}
                className="w-24 h-24 mx-auto rounded-full object-cover mb-3"
              />
              <h4 className="font-bold text-teal-900">{member.name}</h4>
              <p className="text-sm text-gray-600">{member.role}</p>
              {member.description && (
                <p className="text-xs text-gray-500 italic mt-1">{member.description}</p>
              )}
              <div className="flex justify-center gap-3 mt-3">
                <button onClick={() => handleEdit(member)} className="text-blue-600 hover:text-blue-800">
                  <Pencil size={16} />
                </button>
                <button onClick={() => confirmDelete(member.id)} className="text-red-600 hover:text-red-800">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <Modal
          visible={showConfirmDeleteModal}
          title="¿Eliminar miembro?"
          message="Esta acción no se puede deshacer."
          confirmText="Sí, eliminar"
          cancelText="Cancelar"
          onConfirm={handleDelete}
          onCancel={() => {
            setShowConfirmDeleteModal(false);
            setMemberToDelete(null);
          }}
          icon={<XCircle size={40} className="text-red-500 mx-auto mb-3" />}
        />

        <Modal
          visible={showModal}
          title="Operación exitosa"
          message={
            accion === 'crear'
              ? 'Miembro agregado correctamente.'
              : accion === 'actualizar'
              ? 'Miembro actualizado correctamente.'
              : 'Miembro eliminado correctamente.'
          }
          confirmText="Cerrar"
          onConfirm={() => {
            setShowModal(false);
            setAccion(null);
          }}
          onCancel={() => {
            setShowModal(false);
            setAccion(null);
          }}
          icon={<CheckCircle size={40} className="text-green-500 mx-auto mb-3" />}
        />
      </div>
    </div>
  );
}
