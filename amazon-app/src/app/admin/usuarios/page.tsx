'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, ShieldCheck, UserCheck, Trash2, Repeat } from 'lucide-react';
import Modal from '../../components/modal/page';

export default function AdminUsuariosPage() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<number | null>(null);
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

  const fetchUsuarios = async () => {
    const res = await fetch('http://localhost:3000/users', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUsuarios(data);
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchUsuarios();
  }, [token]);

  const cambiarRol = async (id: number, nuevoRol: 'admin' | 'client') => {
    await fetch(`http://localhost:3000/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` },
      body: JSON.stringify({ role: nuevoRol }),
    });

    setShowSuccessModal(true);
    fetchUsuarios();
  };

  const handleEliminar = (id: number) => {
    setUsuarioAEliminar(id);
    setModalVisible(true);
  };

  const confirmarEliminar = async () => {
    if (!usuarioAEliminar) return;

    await fetch(`http://localhost:3000/users/${usuarioAEliminar}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    setModalVisible(false);
    setUsuarioAEliminar(null);
    setShowSuccessModal(true);
    fetchUsuarios();
  };

  return (
    <div className="min-h-screen pt-0 px-6 pb-20 bg-gray-100">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-teal-800 mb-6">Gestión de usuarios</h2>

        {loading ? (
          <p className="text-gray-600">Cargando usuarios...</p>
        ) : usuarios.length === 0 ? (
          <p className="text-gray-500">No hay usuarios registrados.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow border">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 border-b text-gray-700">
                <tr>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Correo</th>
                  <th className="px-4 py-3">Rol</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 flex items-center gap-2 text-gray-800">
                      <User size={16} className="text-teal-700" />
                      {u.fullName}
                    </td>
                    <td className="px-4 py-3 text-gray-700 flex items-center gap-2">
                      <Mail size={16} className="text-gray-500" />
                      {u.email}
                    </td>
                    <td className="px-4 py-3 capitalize font-medium text-teal-700">
                      {u.role === 'admin' ? (
                        <span className="flex items-center gap-1">
                          <ShieldCheck size={16} className="text-green-600" />
                          Admin
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <UserCheck size={16} className="text-blue-600" />
                          Cliente
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 space-x-2 flex items-center">
                      <button
                        onClick={() => cambiarRol(u.id, u.role === 'client' ? 'admin' : 'client')}
                        className={`flex items-center gap-1 text-sm px-3 py-1 rounded transition ${
                          u.role === 'client'
                            ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800'
                        }`}
                      >
                        <Repeat size={16} />
                        {u.role === 'client' ? 'Hacer admin' : 'Hacer cliente'}
                      </button>

                      <button
                        onClick={() => handleEliminar(u.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Eliminar usuario"
                      >
                        <Trash2 size={18} />
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
        visible={modalVisible}
        title="¿Eliminar usuario?"
        message="Esta acción no se puede deshacer."
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        onConfirm={confirmarEliminar}
        onCancel={() => {
          setModalVisible(false);
          setUsuarioAEliminar(null);
        }}
      />

      <Modal
        visible={showSuccessModal}
        title="Acción exitosa"
        message={
          usuarioAEliminar
            ? 'El usuario ha sido eliminado correctamente.'
            : 'El rol del usuario ha sido cambiado correctamente.'
        }
        confirmText="Cerrar"
        onConfirm={() => setShowSuccessModal(false)}
        onCancel={() => setShowSuccessModal(false)}
      />
    </div>
  );
}
