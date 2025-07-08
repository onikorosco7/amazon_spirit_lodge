'use client';

import { useEffect, useState } from 'react';
import { Send, Users2 } from 'lucide-react';

export default function AdminMensajesPage() {
  const [token, setToken] = useState<string | null>(null);
  const [conversaciones, setConversaciones] = useState<any[]>([]);
  const [mensajes, setMensajes] = useState<any[]>([]);
  const [seleccionada, setSeleccionada] = useState<any>(null);
  const [vistos, setVistos] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem('access_token');
    const v = localStorage.getItem('vistos_chats');
    if (t) setToken(t);
    if (v) setVistos(JSON.parse(v));
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchConversaciones = async () => {
      try {
        const res = await fetch('http://localhost:3000/messages', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setConversaciones(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('❌ Error al cargar conversaciones', err);
        setConversaciones([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConversaciones();
  }, [token]);

  const fetchMensajes = async (convId: string) => {
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:3000/messages/${convId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMensajes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar mensajes', err);
    }
  };

  const handleSelect = (c: any) => {
    setSeleccionada(c);
    fetchMensajes(c.id);
    if (!vistos.includes(c.id)) {
      const updated = [...vistos, c.id];
      setVistos(updated);
      localStorage.setItem('vistos_chats', JSON.stringify(updated));
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !seleccionada || !token) return;

    await fetch(`http://localhost:3000/messages/${seleccionada.id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sender: 'admin', content: input }),
    });

    setInput('');
    fetchMensajes(seleccionada.id);
  };

  const formatLastMessageDate = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (fecha.toDateString() === today.toDateString()) return 'Hoy';
    if (fecha.toDateString() === yesterday.toDateString()) return 'Ayer';
    return fecha.toLocaleDateString();
  };

  const agruparMensajesPorFecha = (mensajes: any[]) => {
    const grupos: Record<string, any[]> = {};
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    mensajes.forEach((msg) => {
      const fecha = new Date(msg.createdAt);
      const fechaClave =
        fecha.toDateString() === today.toDateString()
          ? 'Hoy'
          : fecha.toDateString() === yesterday.toDateString()
          ? 'Ayer'
          : fecha.toLocaleDateString();

      if (!grupos[fechaClave]) grupos[fechaClave] = [];
      grupos[fechaClave].push(msg);
    });

    return grupos;
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-tr from-white to-gray-100 text-gray-800">
      {/* Panel izquierdo */}
      <aside className="w-80 border-r h-full p-4 bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-teal-700">
          <Users2 size={20} /> Conversaciones
        </h2>
        {loading ? (
          <p className="text-sm text-gray-500">Cargando conversaciones...</p>
        ) : conversaciones.length === 0 ? (
          <p className="text-sm text-gray-500">Sin conversaciones disponibles.</p>
        ) : (
          <ul className="space-y-2">
            {conversaciones.map((c) => {
              const ultimaFechaTexto = formatLastMessageDate(c.updatedAt);
              const noVisto = !vistos.includes(c.id);
              const totalMensajes = c.messages?.length || 0;

              return (
                <li
                  key={c.id}
                  onClick={() => handleSelect(c)}
                  className={`cursor-pointer p-3 rounded-lg flex items-center justify-between gap-3 transition-all duration-150 ${
                    seleccionada?.id === c.id
                      ? 'bg-teal-100 ring-2 ring-teal-600'
                      : noVisto
                      ? 'bg-yellow-50'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
                      {c.user?.fullName?.[0] || '?'}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{c.user?.fullName || 'Sin nombre'}</p>
                      <p className="text-xs text-gray-500">{c.user?.email}</p>
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-500 whitespace-nowrap">
                    <p>{ultimaFechaTexto}</p>
                    {noVisto && totalMensajes > 0 && (
                      <span className="text-teal-600 font-semibold text-sm">{totalMensajes}</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </aside>

      {/* Panel derecho */}
      <main className="flex-1 p-6 flex flex-col bg-white">
        {seleccionada ? (
          <>
            <div className="mb-4 border-b pb-3">
              <h3 className="text-lg font-bold text-teal-800">
                Chat con {seleccionada.user?.fullName}
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto px-2 space-y-4">
              {mensajes.length === 0 ? (
                <p className="text-sm text-gray-500">Sin mensajes todavía.</p>
              ) : (
                Object.entries(agruparMensajesPorFecha(mensajes)).map(([fecha, msgs]) => (
                  <div key={fecha} className="space-y-2">
                    <div className="text-center text-xs text-gray-500 font-medium py-1">
                      {fecha}
                    </div>
                    {msgs.map((msg) => (
                      <div
                        key={msg.id}
                        className={`max-w-[70%] p-3 rounded-xl shadow-sm text-sm transition-all ${
                          msg.sender === 'admin'
                            ? 'bg-teal-600 text-white ml-auto'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p className="text-[10px] text-right mt-1 opacity-70">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center gap-2 mt-6 border-t pt-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              />
              <button
                onClick={handleSend}
                className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-lg transition flex items-center gap-1"
              >
                <Send size={16} />
                Enviar
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            Selecciona una conversación para empezar
          </div>
        )}
      </main>
    </div>
  );
}
