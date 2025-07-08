'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Eye,
  Trash2,
  UploadCloud,
  Link as LinkIcon,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Modal from '@/components/modal/page';

interface Download {
  id: number;
  filename: string;
  url: string;
  createdAt: string;
}

export default function AdminDownloadsPage() {
  const router = useRouter();
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [filenameFromUrl, setFilenameFromUrl] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [modal, setModal] = useState({ visible: false, title: '', message: '', success: true });
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  // ✅ Protección: solo admin
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
      fetchDownloads();
    } catch {
      router.push('/');
    }
  }, [router]);

  const fetchDownloads = async () => {
    try {
      const res = await fetch('http://localhost:3000/downloads');
      const data = await res.json();
      setDownloads(data);
    } catch {
      showModal('Error', 'No se pudo cargar los archivos.', false);
    }
  };

  const showModal = (title: string, message: string, success = true) => {
    setModal({ visible: true, title, message, success });
  };

  const handleUploadFile = async () => {
    if (!file || !token) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:3000/downloads', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        showModal('Subido correctamente', 'El archivo fue subido exitosamente.');
        setFile(null);
        fetchDownloads();
      } else {
        showModal('Error', data.message || 'Error al subir.', false);
      }
    } catch {
      showModal('Error', 'No se pudo subir el archivo.', false);
    }
  };

  const handleUploadUrl = async () => {
    if (!url || !filenameFromUrl || !token) return;
    let finalUrl = url.trim();
    const match = finalUrl.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      const fileId = match[1];
      finalUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    }

    try {
      const res = await fetch('http://localhost:3000/downloads/from-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` },
        body: JSON.stringify({ filename: filenameFromUrl, url: finalUrl }),
      });

      const data = await res.json();
      if (res.ok) {
        showModal('Guardado correctamente', 'El PDF fue guardado desde el enlace.');
        setUrl('');
        setFilenameFromUrl('');
        fetchDownloads();
      } else {
        showModal('Error', data.message || 'No se pudo guardar.', false);
      }
    } catch {
      showModal('Error', 'Ocurrió un problema al guardar desde el enlace.', false);
    }
  };

  const handleDelete = async () => {
    if (!token || confirmDelete === null) return;

    try {
      const res = await fetch(`http://localhost:3000/downloads/${confirmDelete}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        showModal('Eliminado', 'El archivo fue eliminado correctamente.');
        fetchDownloads();
      } else {
        showModal('Error', data.message || 'No se pudo eliminar.', false);
      }
    } catch {
      showModal('Error', 'Fallo al eliminar el archivo.', false);
    } finally {
      setConfirmDelete(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow mt-8 border">
      <h1 className="text-3xl font-bold text-[#016150] mb-6">Administrar Archivos PDF</h1>

      {downloads.length === 0 ? (
        <p className="text-gray-500 italic mb-6">No hay archivos aún.</p>
      ) : (
        <ul className="space-y-4 mb-10">
          {downloads.map((doc) => (
            <li
              key={doc.id}
              className="border p-4 rounded-lg bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div>
                <p className="font-semibold text-gray-800">📄 {doc.filename}</p>
                <p className="text-xs text-gray-500">URL: {doc.url}</p>
              </div>
              <div className="flex gap-3">
                <a
                  href={doc.url.startsWith('http') ? doc.url : `http://localhost:3000${doc.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#016150] hover:text-white border border-[#016150] hover:bg-[#016150] px-3 py-1.5 rounded flex items-center gap-1 transition"
                >
                  <Eye size={16} /> Ver
                </a>
                <button
                  onClick={() => setConfirmDelete(doc.id)}
                  className="text-sm text-red-700 hover:text-white border border-red-600 hover:bg-red-600 px-3 py-1.5 rounded flex items-center gap-1 transition"
                >
                  <Trash2 size={16} /> Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mb-6">
        <label className="block mb-1 font-semibold text-sm text-gray-700">Subir PDF desde tu PC:</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#016150]/10 file:text-[#016150] hover:file:bg-[#016150]/20"
        />
        <button
          onClick={handleUploadFile}
          disabled={!file}
          className="mt-2 bg-[#016150] text-white px-4 py-2 rounded hover:bg-[#014a3e] flex items-center gap-2 disabled:opacity-50"
        >
          <UploadCloud size={18} /> Subir PDF
        </button>
      </div>

      <div className="mt-8">
        <label className="block mb-1 font-semibold text-sm text-gray-700">Agregar PDF desde enlace:</label>
        <input
          type="text"
          placeholder="https://example.com/guia.pdf"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full mb-2 border rounded px-3 py-2 text-sm"
        />
        <input
          type="text"
          placeholder="Nombre para mostrar (ej. guia-selva.pdf)"
          value={filenameFromUrl}
          onChange={(e) => setFilenameFromUrl(e.target.value)}
          className="w-full mb-2 border rounded px-3 py-2 text-sm"
        />
        <button
          onClick={handleUploadUrl}
          disabled={!url || !filenameFromUrl}
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 flex items-center gap-2 disabled:opacity-50"
        >
          <LinkIcon size={18} /> Guardar desde URL
        </button>
      </div>

      <Modal
        visible={modal.visible}
        title={modal.title}
        message={modal.message}
        confirmText="Cerrar"
        onConfirm={() => setModal({ ...modal, visible: false })}
        onCancel={() => setModal({ ...modal, visible: false })}
        icon={
          modal.success
            ? <CheckCircle className="text-green-600" size={28} />
            : <XCircle className="text-red-600" size={28} />
        }
      />

      <Modal
        visible={confirmDelete !== null}
        title="¿Eliminar archivo?"
        message="Esta acción no se puede deshacer."
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
