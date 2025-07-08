'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, CheckCircle, AlertTriangle } from 'lucide-react';
import Modal from '../../components/modal/page';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error'>('success');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('access_token');
    const isLoggedIn = !!token;

    const endpoint = isLoggedIn
      ? 'http://localhost:3000/contact/autenticado'
      : 'http://localhost:3000/contact';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (isLoggedIn) {
      headers.Authorization = `Bearer ${token}`;
    }

    const payload = isLoggedIn
      ? {
          message: form.message,
          phone: form.phone,
        }
      : form;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Error al enviar el mensaje');
      }

      setModalType('success');
      setModalMessage('Tu mensaje ha sido enviado correctamente. ¡Gracias por contactarnos!');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setModalType('error');
      setModalMessage('Ocurrió un error al enviar tu mensaje. Intenta nuevamente.');
    } finally {
      setShowModal(true);
    }
  };

  return (
    <section id="contacto" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <h2 className="text-3xl font-bold text-[#003580] mb-10 text-center">Contáctanos</h2>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Formulario */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5 bg-gray-50 p-6 rounded-xl shadow-md border"
          >
            <input
              type="text"
              name="name"
              placeholder="Tu nombre"
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-400"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-400"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Teléfono (opcional)"
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-400"
              value={form.phone}
              onChange={handleChange}
            />
            <textarea
              name="message"
              placeholder="Tu mensaje"
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-400"
              value={form.message}
              onChange={handleChange}
              required
            ></textarea>

            <button
              type="submit"
              className="bg-[#003580] text-white px-5 py-2 rounded-lg hover:bg-blue-400 transition w-full font-medium"
            >
              Enviar mensaje
            </button>
          </form>

          {/* Información de contacto */}
          <div className="space-y-6 text-gray-700">
            <div className="flex items-start gap-3">
              <MapPin size={24} className="text-[#003580] mt-1" />
              <p>
                <strong>Dirección:</strong> Selva Amazónica, Loreto, Perú
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={24} className="text-[#003580] mt-1" />
              <p>
                <strong>Teléfono:</strong> +51 987 654 321
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Mail size={24} className="text-[#003580] mt-1" />
              <p>
                <strong>Correo:</strong> contacto@amazonlodge.com
              </p>
            </div>

            <iframe
              title="Mapa"
              className="w-full h-64 rounded-xl shadow border"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3971.3131958657037!2d-73.24375368470747!3d-3.7491209972655045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91ea1c166a79d52f%3A0x1234567890abcdef!2sIquitos%2C%20Peru!5e0!3m2!1ses!2spe!4v1616581552000!5m2!1ses!2spe"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      <Modal
        visible={showModal}
        title={
          <div className="flex items-center gap-2">
            {modalType === 'success' ? (
              <CheckCircle size={20} className="text-green-600" />
            ) : (
              <AlertTriangle size={20} className="text-red-600" />
            )}
            <span>{modalType === 'success' ? 'Mensaje enviado' : 'Error al enviar'}</span>
          </div>
        }
        message={modalMessage}
        confirmText="Cerrar"
        onConfirm={() => setShowModal(false)}
        onCancel={() => setShowModal(false)}
      />
    </section>
  );
}
