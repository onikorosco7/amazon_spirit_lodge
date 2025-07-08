'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, Trash2 } from 'lucide-react';
import Modal from '@/components/modal/page';

export default function AdminHeroPage() {
  const router = useRouter();

  const [imagenes, setImagenes] = useState<any[]>([]);
  const [nuevaImagen, setNuevaImagen] = useState('');
  const [msg, setMsg] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [imagenAEliminar, setImagenAEliminar] = useState<number | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // ✅ Protección de ruta
  useEffect(() => {
    const userData = localStorage.getItem('user');
    const accessToken = localStorage.getItem('access_token');

    if (!userData || !accessToken) {
      router.push('/');
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.role !== 'admin') {
        router.push('/');
        return;
      }

      setToken(accessToken);
      cargar();
    } catch {
      router.push('/');
    }
  }, [router]);

  const cargar = async () => {
    const res = await fetch('http://localhost:3000/hero');
    const data = await res.json();
    setImagenes(data);
  };

  const handleSubirDesdeDispositivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    const formData = new FormData();
    formData.append('file', archivo);
    formData.append('upload_preset', 'avatars');

    const res = await fetch('https://api.cloudinary.com/v1_1/djdygr0y7/image/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setNuevaImagen(data.secure_url);
  };

  const handleGuardar = async () => {
    if (!nuevaImagen || !token) return;

    const res = await fetch('http://localhost:3000/hero', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ imageUrl: nuevaImagen }),
    });

    if (res.ok) {
      setNuevaImagen('');
      setShowImageModal(true);
      cargar();
    }
  };

  const confirmarEliminacion = (id: number) => {
    setImagenAEliminar(id);
    setShowConfirmModal(true);
  };

  const eliminarImagen = async () => {
    if (!imagenAEliminar || !token) return;

    await fetch(`http://localhost:3000/hero/${imagenAEliminar}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    setShowConfirmModal(false);
    setImagenAEliminar(null);
    setShowDeleteModal(true);
    cargar();
  };

  return (
    <div className="min-h-screen bg-white px-6 pt-6 pb-20">
      <h2 className="text-3xl font-bold text-teal-800 mb-6">Imágenes del Hero</h2>

      <div className="space-y-4 max-w-xl">
        <input
          type="text"
          placeholder="Pega un enlace de imagen https://..."
          value={nuevaImagen}
          onChange={(e) => setNuevaImagen(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-sm text-gray-700 transition"
          >
            <UploadCloud size={16} /> Subir desde dispositivo
          </button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleSubirDesdeDispositivo}
          />
          <button
            onClick={handleGuardar}
            disabled={!nuevaImagen}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded text-sm transition disabled:opacity-50"
          >
            Guardar
          </button>
        </div>
      </div>

      {/* Modal para mostrar imagen agregada */}
      <Modal
        visible={showImageModal}
        title="Imagen Agregada"
        message="La imagen se ha subido correctamente."
        confirmText="Cerrar"
        onConfirm={() => setShowImageModal(false)}
        onCancel={() => setShowImageModal(false)}
      />

      {/* Modal para mostrar imagen eliminada */}
      <Modal
        visible={showDeleteModal}
        title="Imagen Eliminada"
        message="La imagen se ha eliminado correctamente."
        confirmText="Cerrar"
        onConfirm={() => setShowDeleteModal(false)}
        onCancel={() => setShowDeleteModal(false)}
      />

      <hr className="my-10 border-gray-300" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {imagenes.map((img) => (
          <div
            key={img.id}
            className="relative border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
          >
            <img src={img.imageUrl} alt="Hero" className="w-full h-48 object-cover" />
            <button
              onClick={() => confirmarEliminacion(img.id)}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow"
              title="Eliminar"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
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
    </div>
  );
}
