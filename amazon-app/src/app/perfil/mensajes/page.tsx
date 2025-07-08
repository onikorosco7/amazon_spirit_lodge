'use client';

import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';

export default function MisMensajesPage() {
  const [conversationId, setConversationId] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const chatRef = useRef<HTMLDivElement>(null);

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  const fetchConversation = async () => {
    try {
      const res = await fetch('http://localhost:3000/messages/my-conversation', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.error('❌ Error al obtener conversación:', res.status);
        setConversationId('');
        return;
      }

      const data = await res.json();
      if (data?.id) {
        setConversationId(data.id);
      } else {
        console.warn('⚠️ Respuesta sin ID de conversación:', data);
        setConversationId('');
      }
    } catch (err) {
      console.error('❌ Error en fetchConversation:', err);
      setConversationId('');
    }
  };

  const fetchMessages = async (convId: string) => {
    try {
      const res = await fetch(`http://localhost:3000/messages/${convId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.error('❌ Error al obtener mensajes:', res.status);
        setMessages([]);
        return;
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        setMessages(data);
      } else {
        console.warn('⚠️ Respuesta inesperada:', data);
        setMessages([]);
      }
    } catch (err) {
      console.error('❌ Error al obtener mensajes:', err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    try {
      await fetch(`http://localhost:3000/messages/${conversationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sender: 'user', content: input }),
      });
      setInput('');
      fetchMessages(conversationId);
    } catch (err) {
      console.error('Error al enviar mensaje');
    }
  };

  const groupMessagesByDate = (msgs: any[]) => {
    const grouped: Record<string, any[]> = {};
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    msgs.forEach((msg) => {
      const date = new Date(msg.createdAt);
      let label = date.toLocaleDateString();

      if (date.toDateString() === today.toDateString()) label = 'Hoy';
      else if (date.toDateString() === yesterday.toDateString()) label = 'Ayer';

      if (!grouped[label]) grouped[label] = [];
      grouped[label].push(msg);
    });

    return grouped;
  };

  useEffect(() => {
    if (!token) return;
    (async () => {
      await fetchConversation();
    })();
  }, []);

  useEffect(() => {
    if (conversationId) fetchMessages(conversationId);
  }, [conversationId]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="min-h-screen pt-4 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-teal-800 mb-4 text-center">
          Chat con el Hotel
        </h2>

        <div
          ref={chatRef}
          className="bg-gray-50 border rounded-md p-4 h-[400px] overflow-y-auto space-y-4 mb-4"
        >
          {loading ? (
            <p className="text-gray-500 text-center">Cargando conversación...</p>
          ) : messages.length === 0 ? (
            <p className="text-gray-500 text-center">Aún no tienes mensajes.</p>
          ) : (
            Object.entries(groupedMessages).map(([fecha, msgs]) => (
              <div key={fecha} className="space-y-2">
                <div className="text-center text-xs text-gray-500 font-semibold">
                  {fecha}
                </div>
                {msgs.map((msg) => (
                  <div
                    key={msg.id}
                    className={`max-w-[80%] p-3 rounded-lg shadow text-sm ${
                      msg.sender === 'user'
                        ? 'bg-teal-100 text-teal-900 self-end ml-auto'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className="text-[10px] text-right text-gray-500 mt-1">
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

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Escribe tu mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-md 
                       placeholder:text-gray-400 text-black 
                       focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            onClick={handleSend}
            className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 flex items-center gap-1"
          >
            <Send size={16} />
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
