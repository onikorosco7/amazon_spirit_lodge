'use client';

import { useEffect, useState } from 'react';

export default function DownloadsPage() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Download Rates / Guide | Amazon Spirit Lodge';

    const fetchLatestPdf = async () => {
      try {
        const res = await fetch('http://localhost:3000/downloads/latest');
        const data = await res.json();

        if (data?.url) {
          const fullUrl = data.url.startsWith('http')
            ? data.url
            : `http://localhost:3000${data.url}`;
          setPdfUrl(fullUrl);
        }
      } catch (error) {
        console.error('Error al cargar el PDF más reciente:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPdf();
  }, []);

  return (
    <div className="min-h-screen px-6 py-20 bg-gray-50 text-gray-800">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-3xl border border-gray-200 overflow-hidden">
        <h1 className="text-3xl font-bold text-[#002f61] text-center py-6">Rates & Travel Guide</h1>

        {loading ? (
          <p className="text-center py-10 text-gray-500 italic">Loading PDF...</p>
        ) : pdfUrl ? (
          <iframe
            src={pdfUrl}
            className="w-full h-[80vh] border-t"
            title="Rates and Guide PDF"
          />
        ) : (
          <p className="text-center py-10 text-gray-400 italic">No guide available.</p>
        )}
      </div>
    </div>
  );
}
