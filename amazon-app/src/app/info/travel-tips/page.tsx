'use client';

import { useEffect } from 'react';
import {
  Shirt,
  BugOff,
  Mountain,
  Sun,
  Pill,
  Flashlight,
  Wallet,
  Leaf,
} from 'lucide-react';

export default function TravelTipsPage() {
  useEffect(() => {
    document.title = 'Travel Tips | Amazon Spirit Lodge';
  }, []);

  return (
    <div className="max-w-4xl pt-4 mx-auto px-6 py-20 text-gray-800">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-200">
        <h1 className="text-4xl font-bold text-[#002f61] mb-8 text-center tracking-tight">
          Travel Tips
        </h1>

        <p className="text-lg mb-8 text-center leading-relaxed">
          Before you travel to the Peruvian Amazon and enjoy your stay at{' '}
          <span className="font-semibold text-[#002f61]">Amazon Spirit Lodge</span>, please keep in mind the following recommendations:
        </p>

        <ul className="space-y-6 text-lg">
          <li className="flex items-start gap-3">
            <Shirt className="w-6 h-6 text-[#002f61] mt-1" />
            <span>
              <strong>Comfortable and lightweight clothing:</strong> Bring long-sleeved shirts, lightweight pants, quick-dry clothes, and a waterproof jacket.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <BugOff className="w-6 h-6 text-[#002f61] mt-1" />
            <span>
              <strong>Insect repellent:</strong> Essential to protect yourself from mosquitoes, especially during night walks.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Mountain className="w-6 h-6 text-[#002f61] mt-1" />
            <span>
              <strong>Water-resistant boots or shoes:</strong> Many trails are wet and muddy.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Sun className="w-6 h-6 text-[#002f61] mt-1" />
            <span>
              <strong>Sunscreen and hat:</strong> The Amazon sun can be strong, even on cloudy days.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Pill className="w-6 h-6 text-[#002f61] mt-1" />
            <span>
              <strong>Personal medications:</strong> Bring what you use regularly. It’s also recommended to ask about vaccines like yellow fever.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Flashlight className="w-6 h-6 text-[#002f61] mt-1" />
            <span>
              <strong>Headlamp or flashlight:</strong> Ideal for night walks or inside your room.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Wallet className="w-6 h-6 text-[#002f61] mt-1" />
            <span>
              <strong>Cash:</strong> There are no ATMs in the jungle. Bring Peruvian soles in small denominations.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Leaf className="w-6 h-6 text-[#002f61] mt-1" />
            <span>
              <strong>Respect for nature:</strong> Don’t leave trash, avoid touching animals, and always follow your guide’s instructions.
            </span>
          </li>
        </ul>

        <p className="text-center text-sm text-gray-500 mt-12 italic">
          Your safety and comfort are our top priority. We are ready to welcome you!
        </p>
      </div>
    </div>
  );
}
