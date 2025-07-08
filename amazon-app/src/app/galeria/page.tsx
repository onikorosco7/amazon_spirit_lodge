'use client';

import { useEffect, useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

type Imagen = {
  id: number;
  imageUrl: string;
  title?: string;
};

export default function GaleriaPage() {
  const [imagenes, setImagenes] = useState<Imagen[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/gallery')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setImagenes(data);
        else setImagenes([]);
      })
      .catch(() => setImagenes([]));
  }, []);

  return (
    <section className="py-20 pt-4 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-[#003580] mb-12">
          Galería completa
        </h1>

        {imagenes.length === 0 ? (
          <p className="text-center text-gray-500">No hay imágenes para mostrar.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {imagenes.map((img, i) => (
              <div
                key={img.id}
                tabIndex={0}
                onClick={() => setOpenIndex(i)}
                onKeyDown={(e) => e.key === 'Enter' && setOpenIndex(i)}
                className="group cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transform hover:scale-[1.02] transition duration-300 overflow-hidden ring-1 ring-transparent hover:ring-[#60a5fa] focus:outline-none focus:ring-2 focus:ring-[#60a5fa]"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={img.imageUrl}
                    alt={img.title || `Imagen ${i + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 group-hover:brightness-90"
                  />
                </div>
                {img.title && (
                  <div className="p-3 text-sm font-medium text-center text-[#003580]">
                    {img.title}
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
            slides={imagenes.map((img) => ({ src: img.imageUrl }))}
            plugins={[Zoom]}
            zoom={{
              maxZoomPixelRatio: 3,
              scrollToZoom: true,
              doubleTapDelay: 300,
              doubleClickDelay: 300,
              zoomInMultiplier: 2,
            }}
          />
        )}
      </div>
    </section>
  );
}
