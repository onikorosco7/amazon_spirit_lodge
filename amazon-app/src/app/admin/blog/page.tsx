'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Trash2, Plus, AlertTriangle, CheckCircle } from 'lucide-react';
import Modal from '@/components/modal/page';

interface Entry {
  id: number;
  titulo: string;
  contenido: string;
  createdAt: string;
}

export default function AdminBlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Entry[]>([]);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalDeleted, setModalDeleted] = useState(false);
  const [modalMsg, setModalMsg] = useState('');
  const [postAEliminar, setPostAEliminar] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // ✅ Protección de ruta: solo para admins
  useEffect(() => {
    document.title = 'Admin Blog | Amazon Spirit Lodge';

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
      fetchPosts(); // solo si pasa la verificación
    } catch {
      router.push('/');
    }
  }, [router]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:3000/blog');
      setPosts(res.data);
    } catch {
      setModalMsg('No se pudo cargar los posts del blog.');
      setModalError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!titulo || !contenido) {
      setModalMsg('Completa ambos campos.');
      setModalError(true);
      return;
    }

    try {
      await axios.post(
        'http://localhost:3000/blog',
        { titulo, contenido },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitulo('');
      setContenido('');
      setModalMsg('La entrada fue publicada exitosamente.');
      setModalSuccess(true);
      fetchPosts();
    } catch {
      setModalMsg('Error al crear el post. Verifica que seas administrador.');
      setModalError(true);
    }
  };

  const confirmarEliminacion = (id: number) => {
    setPostAEliminar(id);
    setModalConfirm(true);
  };

  const handleDelete = async () => {
    if (!postAEliminar) return;

    try {
      await axios.delete(`http://localhost:3000/blog/${postAEliminar}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setModalMsg('La entrada ha sido eliminada correctamente.');
      setModalDeleted(true);
      setPostAEliminar(null);
      fetchPosts();
    } catch {
      setModalMsg('Error al eliminar la entrada.');
      setModalError(true);
    } finally {
      setModalConfirm(false);
    }
  };

  return (
    <div className="min-h-screen pt-0 px-6 py-12 bg-gray-100 text-gray-800">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-teal-800 flex items-center gap-2">
          <Plus size={24} /> Administrar Blog
        </h1>

        <div className="bg-white p-6 rounded-xl shadow-md space-y-4 mb-12 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700">Nuevo post</h2>
          <input
            type="text"
            placeholder="Título del post"
            className="w-full border px-4 py-2 rounded text-sm focus:ring-2 focus:ring-teal-500"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <textarea
            placeholder="Contenido del post"
            className="w-full border px-4 py-2 rounded text-sm min-h-[120px] focus:ring-2 focus:ring-teal-500"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
          />
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 text-sm"
          >
            Publicar entrada
          </button>
        </div>

        <h2 className="text-xl font-semibold text-teal-800 mb-4">Entradas existentes</h2>

        {loading ? (
          <p className="text-gray-500">Cargando...</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-500 italic">No hay entradas aún.</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white p-5 rounded-xl shadow border border-gray-200 group"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-teal-800 transition">
                    {post.titulo}
                  </h3>
                  <button
                    onClick={() => confirmarEliminacion(post.id)}
                    className="text-red-600 hover:text-red-800 transition"
                    title="Eliminar post"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  Publicado el {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-700 text-sm whitespace-pre-line">{post.contenido}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        visible={modalConfirm}
        title="¿Eliminar entrada?"
        message="Esta acción no se puede deshacer."
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        onConfirm={handleDelete}
        onCancel={() => {
          setPostAEliminar(null);
          setModalConfirm(false);
        }}
      />

      <Modal
        visible={modalSuccess}
        title={
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-600" size={20} />
            Éxito
          </div>
        }
        message={modalMsg}
        confirmText="Cerrar"
        onConfirm={() => setModalSuccess(false)}
      />

      <Modal
        visible={modalDeleted}
        title={
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-600" size={20} />
            Eliminado
          </div>
        }
        message={modalMsg}
        confirmText="Cerrar"
        onConfirm={() => setModalDeleted(false)}
      />

      <Modal
        visible={modalError}
        title={
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-red-600" size={20} />
            Error
          </div>
        }
        message={modalMsg}
        confirmText="Cerrar"
        onConfirm={() => setModalError(false)}
        onCancel={() => setModalError(false)}
      />
    </div>
  );
}
