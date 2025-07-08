'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import { ArrowRight } from 'lucide-react';

type GalleryItem = {
  id: number;
  imageUrl: string;
  title?: string;
};

export default function GallerySection() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [maxImages, setMaxImages] = useState(6);
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:3000/gallery')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setImages(data);
      })
      .catch((err) => console.error('Error al cargar galería:', err));
  }, []);

  useEffect(() => {
    const updateMaxImages = () => {
      setMaxImages(window.innerWidth < 768 ? 3 : 6);
    };
    updateMaxImages();
    window.addEventListener('resize', updateMaxImages);
    return () => window.removeEventListener('resize', updateMaxImages);
  }, []);

  const handleVerMas = () => router.push('/galeria');

  const previewImages = images.slice(0, maxImages);

  return (
    <section id="gallery" className="py-20 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-[#003580] mb-12">
          Nuestra Galería
        </h2>

        {previewImages.length === 0 ? (
          <p className="text-center text-gray-500">No hay imágenes disponibles.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {previewImages.map((item, i) => (
              <div
                key={item.id}
                className="relative group bg-white overflow-hidden rounded-2xl shadow-md ring-1 ring-[#003580]/10 hover:ring-2 hover:ring-[#60a5fa] transition-all duration-300 ease-out"
                style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title || `Imagen ${i + 1}`}
                  className="w-full h-[260px] sm:h-[280px] md:h-[300px] object-cover object-center transition-transform duration-500 group-hover:scale-105 group-hover:brightness-90 cursor-pointer aspect-[4/3]"
                  loading="lazy"
                  decoding="async"
                  onClick={() => i < maxImages - 1 && setOpenIndex(i)}
                />

                {i === maxImages - 1 && (
                  <div
                    onClick={handleVerMas}
                    onKeyDown={(e) => e.key === 'Enter' && handleVerMas()}
                    tabIndex={0}
                    role="button"
                    className="absolute inset-0 bg-black/50 backdrop-blur-lg flex flex-col items-center justify-center text-white text-lg font-semibold tracking-wide cursor-pointer transition duration-300 hover:bg-black/60 ring-inset ring-white/20 rounded-2xl"
                  >
                    <span>Ver más imágenes</span>
                    <ArrowRight className="mt-1 w-5 h-5 animate-bounce transition-transform hover:translate-x-1" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {openIndex !== null && (
          <Lightbox
            open
            index={openIndex}
            close={() => setOpenIndex(null)}
            slides={previewImages.slice(0, maxImages - 1).map((img) => ({ src: img.imageUrl }))}
            plugins={[Zoom]}
            zoom={{
              maxZoomPixelRatio: 3,
              scrollToZoom: true,
              doubleClickDelay: 300,
              doubleTapDelay: 300,
              zoomInMultiplier: 2,
            }}
          />
        )}
      </div>

      {/* Fade-up animation */}
      <style jsx>{`
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-up {
          animation: fade-up 0.6s ease-out;
        }
      `}</style>
    </section>
  );
}
