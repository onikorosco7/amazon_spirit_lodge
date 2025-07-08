'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, Trash2 } from 'lucide-react';
import Modal from '@/components/modal/page';

export default function GaleriaAdminPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    imageUrl: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imagenes, setImagenes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [imagenAEliminar, setImagenAEliminar] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // ✅ Protección de acceso
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
      fetchGaleria();
    } catch {
      router.push('/');
    }
  }, [router]);

  const fetchGaleria = async () => {
    const res = await fetch('http://localhost:3000/gallery');
    const data = await res.json();
    setImagenes(data);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setForm((prev) => ({ ...prev, imageUrl: '' }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('category', form.category);
    if (form.imageUrl) formData.append('image', form.imageUrl);
    if (file) formData.append('file', file);

    await fetch('http://localhost:3000/gallery', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    setForm({ title: '', description: '', category: '', imageUrl: '' });
    setFile(null);
    setPreview(null);
    fetchGaleria();
    setLoading(false);
    setShowAddModal(true);
  };

  const confirmarEliminacion = (id: number) => {
    setImagenAEliminar(id);
    setShowConfirmModal(true);
  };

  const eliminarImagen = async () => {
    if (!imagenAEliminar) return;
    await fetch(`http://localhost:3000/gallery/${imagenAEliminar}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    setShowConfirmModal(false);
    setImagenAEliminar(null);
    setShowDeleteModal(true);
    fetchGaleria();
  };

  return (
    <div className="min-h-screen pt-4 px-4 pb-20 bg-white text-gray-700">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-teal-800 mb-8 text-center">Galería de Imágenes</h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 shadow-lg p-6 rounded-xl mb-12 space-y-5"
        >
          <input
            type="text"
            name="title"
            placeholder="Título"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
          />

          <input
            type="text"
            name="category"
            placeholder="Categoría"
            value={form.category}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 outline-none"
          />

          <textarea
            name="description"
            placeholder="Descripción"
            value={form.description}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 outline-none resize-none"
            rows={3}
          />

          <div className="grid gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-teal-100 text-teal-800 hover:bg-teal-200 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
              >
                <UploadCloud size={16} /> Seleccionar imagen
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFile}
                accept="image/*"
                className="hidden"
              />

              <input
                type="url"
                name="imageUrl"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={form.imageUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 outline-none text-sm"
              />
            </div>

            {preview && (
              <img
                src={preview}
                alt="Vista previa"
                className="w-40 h-28 object-cover rounded-lg border mt-2"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-700 hover:bg-teal-800 text-white py-3 rounded-full font-semibold transition"
          >
            {loading ? 'Guardando...' : 'Subir Imagen'}
          </button>
        </form>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
          {imagenes.map((img) => (
            <div
              key={img.id}
              className="border rounded-xl overflow-hidden shadow-sm bg-white hover:shadow-md transition"
            >
              <img
                src={
                  img.imageUrl?.startsWith('http')
                    ? img.imageUrl
                    : `http://localhost:3000${img.imageUrl}`
                }
                alt={img.title}
                className="w-full h-40 object-cover bg-gray-100"
              />
              <div className="p-4">
                <h4 className="font-semibold text-gray-800 text-sm truncate">{img.title}</h4>
                <p className="text-xs text-gray-600 truncate">{img.description}</p>
                <p className="text-xs text-gray-500 italic mt-1">{img.category}</p>
                <button
                  onClick={() => confirmarEliminacion(img.id)}
                  className="mt-2 text-red-600 hover:text-red-800 text-xs flex items-center gap-1"
                >
                  <Trash2 size={14} /> Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        visible={showConfirmModal}
        title="¿Eliminar imagen?"
        message="Esta acción no se puede deshacer."
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        onConfirm={eliminarImagen}
        onCancel={() => {
          setShowConfirmModal(false);
          setImagenAEliminar(null);
        }}
      />

      <Modal
        visible={showDeleteModal}
        title="Imagen Eliminada"
        message="La imagen se ha eliminado correctamente."
        confirmText="Cerrar"
        onConfirm={() => setShowDeleteModal(false)}
        onCancel={() => setShowDeleteModal(false)}
      />

      <Modal
        visible={showAddModal}
        title="Imagen Agregada"
        message="La imagen se ha agregado correctamente."
        confirmText="Cerrar"
        onConfirm={() => setShowAddModal(false)}
        onCancel={() => setShowAddModal(false)}
      />
    </div>
  );
}
