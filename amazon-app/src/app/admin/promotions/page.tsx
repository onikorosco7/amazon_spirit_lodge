'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2, CheckCircle, XCircle, PlusCircle } from 'lucide-react';
import Modal from '@/components/modal/page';

interface Promotion {
  id: number;
  code: string;
  description: string;
  discount: number;
  active: boolean;
  expiresAt: string;
}

export default function AdminPromotionsPage() {
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [form, setForm] = useState({
    id: null as number | null,
    code: '',
    description: '',
    discount: '',
    expiresAt: '',
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [modal, setModal] = useState({ visible: false, message: '', success: true });
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [promoToDelete, setPromoToDelete] = useState<number | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    const res = await fetch('http://localhost:3000/promotions');
    const data = await res.json();
    setPromos(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { id, ...payload } = form;
    const url = id ? `http://localhost:3000/promotions/${id}` : 'http://localhost:3000/promotions';
    const method = id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...payload, discount: Number(payload.discount) }),
    });

    if (res.ok) {
      setModal({ visible: true, message: 'Guardado exitosamente', success: true });
      setForm({ id: null, code: '', description: '', discount: '', expiresAt: '' });
      setEditId(null);
      fetchPromos();
    } else {
      setModal({ visible: true, message: 'Error al guardar', success: false });
    }
  };

  const handleEdit = (p: Promotion) => {
    setForm({
      id: p.id,
      code: p.code,
      description: p.description,
      discount: p.discount.toString(),
      expiresAt: p.expiresAt.split('T')[0],
    });
    setEditId(p.id);
  };

  const confirmDelete = (id: number) => {
    setPromoToDelete(id);
    setShowConfirmDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!promoToDelete) return;
    await fetch(`http://localhost:3000/promotions/${promoToDelete}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setShowConfirmDeleteModal(false);
    setModal({ visible: true, message: 'Eliminado correctamente', success: true });
    fetchPromos();
  };

  return (
    <div className="min-h-screen p-6 bg-white">
      <h1 className="text-3xl font-bold text-teal-800 mb-6 flex items-center gap-2">
        <PlusCircle size={24} /> Administrar Promociones
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-50 border border-gray-200 rounded-xl shadow p-6 grid gap-4 mb-10"
      >
        <input name="code" value={form.code} onChange={handleChange} placeholder="Código" required className="p-2 border rounded" />
        <input name="description" value={form.description} onChange={handleChange} placeholder="Descripción" className="p-2 border rounded" />
        <input name="discount" value={form.discount} onChange={handleChange} type="number" placeholder="Descuento (%)" required className="p-2 border rounded" />
        <input name="expiresAt" value={form.expiresAt} onChange={handleChange} type="date" required className="p-2 border rounded" />
        <button type="submit" className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded">
          {editId ? 'Actualizar' : 'Crear promoción'}
        </button>
      </form>

      <div className="grid md:grid-cols-2 gap-4">
        {promos.map((p) => (
          <div key={p.id} className="p-4 border rounded shadow flex justify-between items-start">
            <div>
              <h4 className="font-bold text-gray-800">{p.code}</h4>
              <p className="text-sm text-gray-600">{p.description}</p>
              <p className="text-sm text-teal-700 font-semibold">Descuento: {p.discount}%</p>
              <p className="text-xs text-gray-500">Vence: {new Date(p.expiresAt).toLocaleDateString()}</p>
              <p className={`text-xs font-medium ${p.active ? 'text-green-600' : 'text-red-600'}`}>
                {p.active ? 'Activa' : 'Inactiva'}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-800">
                <Pencil size={16} />
              </button>
              <button onClick={() => confirmDelete(p.id)} className="text-red-600 hover:text-red-800">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmación eliminar */}
      <Modal
        visible={showConfirmDeleteModal}
        title="¿Eliminar promoción?"
        message="Esta acción no se puede deshacer."
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirmDeleteModal(false)}
      />

      {/* Modal éxito o error */}
      <Modal
        visible={modal.visible}
        title={modal.success ? 'Éxito' : 'Error'}
        message={modal.message}
        confirmText="Cerrar"
        onConfirm={() => setModal({ ...modal, visible: false })}
        onCancel={() => setModal({ ...modal, visible: false })}
        icon={modal.success ? <CheckCircle className="text-green-600" /> : <XCircle className="text-red-600" />}
      />
    </div>
  );
}
