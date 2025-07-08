'use client';

import { useEffect, useState } from 'react';
import { Star, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from '@/components/modal/page';

type Review = {
  id: number;
  message: string;
  rating: number;
  createdAt: string;
  user: {
    fullName: string;
    avatar?: string;
  };
};

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(6);

  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalSuccessVisible, setModalSuccessVisible] = useState(false);
  const [modalErrorVisible, setModalErrorVisible] = useState(false);
  const [modalErrorMessage, setModalErrorMessage] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const isLoggedIn = Boolean(token);

  useEffect(() => {
    fetch('http://localhost:3000/reviews')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setReviews(data);
        } else {
          setReviews([]);
        }
      })
      .catch((err) => {
        console.error('Error:', err);
        setReviews([]);
      });
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) return setShowLoginModal(true);

    const res = await fetch('http://localhost:3000/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message, rating }),
    });

    if (!res.ok) {
      const data = await res.json();
      setModalErrorMessage(data.message || 'Error al enviar reseña');
      return setModalErrorVisible(true);
    }

    const data = await res.json();
    setReviews([data, ...reviews]);
    setMessage('');
    setRating(5);
    setModalSuccessVisible(true);
  };

  return (
    <section id="resenas" className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <h2 className="text-3xl font-bold text-[#003580] mb-10 text-center">Reseñas de nuestros visitantes</h2>

        {/* Modo móvil */}
        <div className="md:hidden relative">
          {reviews.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg px-10 py-6 transition-all duration-300 ease-in-out">
              <div className="flex items-center gap-3 mb-3">
                {reviews[currentIndex].user.avatar ? (
                  <img src={reviews[currentIndex].user.avatar} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#003580] text-white flex items-center justify-center font-bold">
                    {reviews[currentIndex].user.fullName.charAt(0).toUpperCase()}
                  </div>
                )}
                <p className="text-gray-800 font-semibold text-base">{reviews[currentIndex].user.fullName}</p>
              </div>
              <p className="text-gray-700 italic mb-3 border-l-4 border-[#003580] pl-4">"{reviews[currentIndex].message}"</p>
              <div className="flex gap-1 text-yellow-500 mb-2">
                {Array.from({ length: reviews[currentIndex].rating }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-xs text-gray-500">{new Date(reviews[currentIndex].createdAt).toLocaleString()}</p>
            </div>
          )}

          {reviews.length > 1 && (
            <>
              <button onClick={handlePrev} className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow">
                <ChevronLeft className="text-[#003580]" />
              </button>
              <button onClick={handleNext} className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow">
                <ChevronRight className="text-[#003580]" />
              </button>
            </>
          )}

          <div className="flex justify-center gap-2 mt-4">
            {reviews.map((_, i) => (
              <span
                key={i}
                className={`w-2.5 h-2.5 rounded-full ${i === currentIndex ? 'bg-[#003580] scale-110' : 'bg-blue-200'} transition-transform`}
              />
            ))}
          </div>
        </div>

        {/* Escritorio */}
        <div className="hidden md:grid grid-cols-3 gap-6 mb-10">
          {reviews.slice(0, visibleCount).map((r) => (
            <div key={r.id} className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition">
              <div className="flex items-center gap-3 mb-3">
                {r.user.avatar ? (
                  <img src={r.user.avatar} alt={r.user.fullName} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#003580] text-white flex items-center justify-center text-sm font-bold">
                    {r.user.fullName.charAt(0).toUpperCase()}
                  </div>
                )}
                <p className="text-gray-800 font-semibold text-base">{r.user.fullName}</p>
              </div>
              <p className="text-gray-700 italic mb-3 border-l-4 border-[#003580] pl-4">"{r.message}"</p>
              <div className="flex items-center gap-1 text-yellow-500 mb-2">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>

        {reviews.length > 6 && (
          <div className="text-center mb-12 hidden md:block">
            <button
              onClick={() => setVisibleCount((prev) => (prev >= reviews.length ? 6 : prev + 6))}
              className="px-6 py-2 text-[#003580] border border-[#003580] rounded-full hover:bg-blue-400 hover:text-white transition"
            >
              {visibleCount >= reviews.length ? 'Ver menos reseñas' : 'Ver más reseñas'}
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 max-w-xl mx-auto border">
          <h3 className="text-2xl font-semibold text-[#003580] mb-4">Escribe tu reseña</h3>

          <textarea
            maxLength={300}
            rows={4}
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 mb-2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!isLoggedIn}
            placeholder={isLoggedIn ? 'Tu mensaje...' : 'Debes iniciar sesión para dejar una reseña.'}
          />
          <p className="text-xs text-gray-500 text-right mb-3">{message.length}/300</p>

          <label className="block mb-1 text-sm font-medium text-gray-700">Calificación:</label>
          <select
            className="mb-4 p-2 border border-gray-300 rounded-lg text-gray-700"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            disabled={!isLoggedIn}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{n} estrella{n > 1 ? 's' : ''}</option>
            ))}
          </select>

          <button
            type="submit"
            disabled={!isLoggedIn}
            className="bg-[#003580] text-white px-5 py-2 rounded-lg w-full hover:bg-blue-400 transition disabled:opacity-60"
          >
            Enviar Reseña
          </button>
        </form>
      </div>

      {showLoginModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full text-center">
            <AlertTriangle size={36} className="mx-auto text-yellow-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Inicia sesión para opinar</h3>
            <p className="text-sm text-gray-600 mb-6">Para dejar una reseña necesitas tener una cuenta activa.</p>
            <button
              onClick={() => {
                setShowLoginModal(false);
                window.location.href = '/login';
              }}
              className="bg-[#003580] hover:bg-blue-400 text-white px-5 py-2 rounded font-medium"
            >
              Ir al login
            </button>
          </div>
        </div>
      )}

      <Modal
        visible={modalSuccessVisible}
        title={<div className="flex items-center gap-2"><CheckCircle className="text-green-600" size={20} /><span>¡Gracias por tu reseña!</span></div>}
        message="Tu mensaje se ha enviado correctamente y ya aparece en la lista de reseñas."
        confirmText="Cerrar"
        onConfirm={() => setModalSuccessVisible(false)}
      />

      <Modal
        visible={modalErrorVisible}
        title={<div className="flex items-center gap-2"><AlertTriangle className="text-red-600" size={20} /><span>Error al enviar</span></div>}
        message={modalErrorMessage}
        confirmText="Cerrar"
        onConfirm={() => setModalErrorVisible(false)}
      />
    </section>
  );
}
