'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/hero')
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) return;
        const urls = data
          .filter((img: any) => img.imageUrl && typeof img.imageUrl === 'string')
          .map((img: any) => img.imageUrl);
        if (urls.length) setImages(urls);
      })
      .catch(err => console.error('Error al cargar hero:', err));
  }, []);

  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % images.length);
      setLoaded(false);
    }, 5000);
    return () => clearInterval(interval);
  }, [images]);

  const currentImage = images[index] || '/galeria/portada.jpg';

  const handleScroll = () => {
    const target = document.getElementById('gallery');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-[90vh] w-full overflow-hidden flex items-center justify-center">
      {/* Imagen de fondo */}
      <img
        src={currentImage}
        alt="Hero"
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-all duration-[1200ms] ease-in-out ${
          loaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-105 blur-sm'
        }`}
        onLoad={() => setLoaded(true)}
        loading="lazy"
        decoding="async"
        style={{ imageRendering: 'auto', maxWidth: 'none' }}
      />

      {/* Capa oscura */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10" />

      {/* Contenido */}
      <div className="relative z-20 text-center text-white px-6 max-w-screen-xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4 drop-shadow-xl">
          Bienvenido a Amazon Spirit Lodge
        </h1>
        <p className="text-lg md:text-xl mb-8 text-gray-100 leading-relaxed drop-shadow">
          Conecta con la naturaleza en la selva amazónica del Perú 🌿
        </p>
        <button
          onClick={() => router.push('/habitaciones')}
          aria-label="Explorar más habitaciones"
          className="bg-[#003580] hover:bg-[#60a5fa] px-8 py-3 rounded-2xl text-white font-semibold shadow-md transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Ver habitaciones
        </button>

        {/* Flecha SVG animada */}
        <div
          onClick={handleScroll}
          aria-label="Ir a galería"
          className="mt-12 flex justify-center cursor-pointer animate-pulse-arrow p-2 focus:outline-none focus:ring-2 focus:ring-white/60"
        >
          <svg
            className="w-16 h-16 text-white hover:text-[#60a5fa] transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Indicadores */}
      {images.length > 1 && (
        <div className="absolute bottom-5 z-30 flex justify-center gap-2">
          {images.map((_, i) => (
            <span
              key={i}
              className={`w-3 h-3 rounded-full shadow-sm transition-transform duration-300 ${
                i === index
                  ? 'bg-white ring-2 ring-white scale-110'
                  : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      )}

      {/* Estilos internos */}
      <style jsx>{`
        @keyframes pulse-arrow {
          0%, 100% {
            transform: scale(1) translateY(0);
          }
          50% {
            transform: scale(1.1) translateY(5px);
          }
        }
        .animate-pulse-arrow {
          animation: pulse-arrow 1.8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
