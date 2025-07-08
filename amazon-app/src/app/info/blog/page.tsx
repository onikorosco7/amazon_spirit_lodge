'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaLeaf, FaGlobeAmericas } from 'react-icons/fa';

interface Entry {
  _id: string;
  titulo: string;
  contenido: string;
  createdAt: string;
}

export default function BlogPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Adventure Blog | Amazon Spirit Lodge';

    axios
      .get('http://localhost:3000/blog')
      .then((res) => setEntries(res.data))
      .catch(() => setError('Failed to load the adventure blog.'));
  }, []);

  return (
    <section className="min-h-screen pt-4 px-4 py-16 bg-gradient-to-b from-[rgba(0,47,97,0.05)] via-white to-[rgba(0,47,97,0.1)] text-gray-800">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 border border-[rgba(0,47,97,0.08)]">
          <h1 className="text-xl sm:text-2xl font-semibold text-center text-[#002f61] mb-10 flex items-center justify-center gap-2">
            {/* <FaLeaf className="text-[#00785a] text-lg sm:text-xl" /> Hoja */}
            Adventure Blog
          </h1>

          {error && (
            <div className="text-center text-red-600 font-medium mb-6 animate-pulse">
              {error}
            </div>
          )}

          {entries.length === 0 ? (
            <p className="text-center text-gray-500 italic mt-8">
              No posts available yet.
            </p>
          ) : (
            <ul className="space-y-8">
              {entries.map((entry) => (
                <li
                  key={entry._id}
                  className="group bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition duration-200"
                >
                  <header className="mb-2">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 group-hover:text-[#00577d] transition-colors">
                      {entry.titulo}
                    </h2>
                    <time
                      className="text-sm text-gray-500 italic"
                      dateTime={entry.createdAt}
                    >
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </time>
                  </header>
                  <p className="text-sm sm:text-base leading-relaxed text-gray-700 whitespace-pre-line text-justify">
                    {entry.contenido}
                  </p>
                </li>
              ))}
            </ul>
          )}

          <footer className="mt-12 text-center text-xs sm:text-sm text-gray-500 italic flex items-center justify-center gap-2">
            <FaGlobeAmericas className="text-[rgba(0,47,97,0.4)] text-base" />
            Thanks for joining us on this journey!
          </footer>
        </div>
      </div>
    </section>
  );
}
