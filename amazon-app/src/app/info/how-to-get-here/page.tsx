'use client';

import { useEffect } from 'react';
import { FaPlaneDeparture, FaTaxi, FaPhoneAlt } from 'react-icons/fa';
import { GiWoodCanoe } from 'react-icons/gi';

export default function HowToGetHerePage() {
  useEffect(() => {
    document.title = 'How to Get There | Amazon Spirit Lodge';
  }, []);

  return (
    <div className="max-w-4xl pt-4 mx-auto px-6 py-20 text-gray-800">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-200">
        <h1 className="text-4xl font-extrabold text-[#002f61] mb-8 text-center tracking-tight">
          How to Get There
        </h1>

        <p className="mb-6 text-lg leading-relaxed">
          Reaching <span className="font-semibold text-[#002f61]">Amazon Spirit Lodge</span> is an experience in itself.
          Here’s how you can get here from different starting points:
        </p>

        <div className="space-y-6 text-base leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-[#002f61] mb-2 flex items-center gap-2">
              <FaPlaneDeparture className="text-[#002f61]" /> From Lima
            </h2>
            <p>
              Fly from Lima’s Jorge Chávez Airport to Iquitos (approx. 1h 45min). There are daily flights available with LATAM, Sky, and other airlines.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#002f61] mb-2 flex items-center gap-2">
              <FaTaxi className="text-[#002f61]" /> From Iquitos Airport
            </h2>
            <p>
              A taxi will take you to the Bellavista-Nanay port (about 20 minutes). From there, we’ll coordinate river transport to the lodge (motorboat included with reservation).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#002f61] mb-2 flex items-center gap-2">
              <GiWoodCanoe className="text-[#002f61]" /> River Transport
            </h2>
            <p>
              The boat ride takes about 45 minutes to 1 hour, navigating through the river to our location deep in the Amazon rainforest.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#002f61] mb-2 flex items-center gap-2">
              <FaPhoneAlt className="text-[#002f61]" /> Coordination Contact
            </h2>
            <p>
              Once your reservation is confirmed, we will contact you to coordinate pickup. You can also message us via WhatsApp or email.
            </p>
          </section>
        </div>

        <p className="mt-10 text-sm text-gray-500 italic text-center">
          We recommend arriving before 3:00 p.m. for a smoother check-in experience.
        </p>
      </div>
    </div>
  );
}
