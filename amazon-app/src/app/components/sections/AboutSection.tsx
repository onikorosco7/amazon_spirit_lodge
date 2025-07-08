'use client';

import Image from 'next/image';

export default function AboutSection() {
  return (
    <section id="about" className="relative py-24 bg-white overflow-hidden">
      {/* Imagen de fondo con overlay degradado */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/galeria/selva.jpg"
          alt="Fondo Amazonía"
          fill
          className="object-cover object-center opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 to-blue-50 mix-blend-multiply" />
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 flex flex-col md:flex-row items-center gap-8 sm:gap-10 md:gap-12 relative z-10">
        {/* Texto */}
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-4xl font-bold text-[#003580] mb-6 tracking-tight leading-snug">
            Sobre Nosotros
          </h2>
          <p className="text-gray-800 mb-4 text-lg leading-relaxed">
            En <strong className="text-[#003580]">Amazon Spirit Lodge</strong>, ofrecemos una experiencia auténtica de <span className="font-semibold text-[#003580]">conexión con la naturaleza</span> en el corazón de la <span className="font-semibold text-[#003580]">Amazonía peruana</span>. Nuestro albergue ecológico está diseñado para brindar comodidad, tranquilidad y una inmersión completa en la biodiversidad de la selva.
          </p>
          <p className="text-gray-700 text-base leading-relaxed">
            Contamos con <span className="font-semibold text-[#003580]">guías locales</span>, <span className="font-semibold text-[#003580]">actividades sostenibles</span> y espacios únicos para descansar, meditar y reconectar. Nos esforzamos por conservar el entorno y apoyar a las comunidades amazónicas.
          </p>
        </div>

        {/* Imagen decorativa */}
        <div className="md:w-1/2">
          <div className="rounded-xl overflow-hidden shadow-xl hover:shadow-blue-200 transform hover:scale-105 transition-all ease-in-out duration-500 ring-1 ring-[#003580]/10">
            <Image
              src="/galeria/nosotros.jpg"
              alt="Amazon Spirit Lodge"
              width={600}
              height={400}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
