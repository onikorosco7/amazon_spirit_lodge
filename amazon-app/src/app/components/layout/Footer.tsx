'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaTiktok,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaStar,
} from 'react-icons/fa';

export default function Footer() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return setLoading(false);

        const res = await fetch('http://localhost:3000/downloads/latest', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.warn('Error al cargar PDF:', res.status);
          setLoading(false);
          return;
        }

        const data = await res.json();
        if (data && data.url) {
          const finalUrl = data.url.startsWith('http')
            ? data.url
            : `http://localhost:3000${data.url}`;
          setPdfUrl(finalUrl);
        }
      } catch (error) {
        console.warn('Error al obtener el PDF más reciente:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPdf();
  }, []);

  return (
    <footer className="bg-white text-gray-800 border-t border-gray-200 shadow-md pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 text-sm">
        {/* Logo + redes */}
        <div>
          <h4 className="text-2xl font-bold mb-4 text-gray-900">Amazon Spirit Lodge</h4>
          <p className="text-gray-600 leading-relaxed">
            A natural retreat in the jungle of Iquitos. Experience comfort, culture and sustainability.
          </p>
          <p className="mt-5 mb-2 font-medium text-gray-800">Follow us:</p>
          <div className="flex gap-4 text-xl text-gray-600">
            <a aria-label="Facebook" href="https://facebook.com/amazonlodge" target="_blank" rel="noopener noreferrer"><FaFacebook className="hover:text-blue-600 transition" /></a>
            <a aria-label="Instagram" href="https://instagram.com/amazonlodge" target="_blank" rel="noopener noreferrer"><FaInstagram className="hover:text-pink-500 transition" /></a>
            <a aria-label="WhatsApp" href="https://wa.me/51987654321" target="_blank" rel="noopener noreferrer"><FaWhatsapp className="hover:text-green-500 transition" /></a>
            <a aria-label="TikTok" href="https://tiktok.com/@amazonlodge" target="_blank" rel="noopener noreferrer"><FaTiktok className="hover:text-black transition" /></a>
            <a aria-label="YouTube" href="https://youtube.com/@amazonlodge" target="_blank" rel="noopener noreferrer"><FaYoutube className="hover:text-red-600 transition" /></a>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h5 className="text-lg font-semibold mb-3 text-gray-900">Explore</h5>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:underline hover:text-green-700">Home</Link></li>
            <li><a href="#galeria" className="hover:underline hover:text-green-700">Gallery</a></li>
            <li><a href="#reservar" className="hover:underline hover:text-green-700">Book</a></li>
            <li><a href="#contacto" className="hover:underline hover:text-green-700">Contact</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h5 className="text-lg font-semibold mb-3 text-gray-900">Resources</h5>
          <ul className="space-y-2">
            <li><Link href="/info/blog" className="hover:underline hover:text-green-700">Adventure Blog</Link></li>
            <li><Link href="/info/faqs" className="hover:underline hover:text-green-700">FAQs</Link></li>
            <li><Link href="/info/how-to-get-here" className="hover:underline hover:text-green-700">How to Get Here</Link></li>
            <li><Link href="/info/travel-tips" className="hover:underline hover:text-green-700">Travel Tips</Link></li>
            <li>
              {!loading && pdfUrl ? (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-green-700"
                >
                  View Rates / Guide (PDF)
                </a>
              ) : !loading ? (
                <span className="text-gray-400 italic">No guide available</span>
              ) : (
                <span className="text-gray-400 italic">Loading guide...</span>
              )}
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h5 className="text-lg font-semibold mb-3 text-gray-900">Company</h5>
          <ul className="space-y-2">
            <li><Link href="/info/our-team" className="hover:underline hover:text-green-700">Our Team</Link></li>
            <li><Link href="/info/terms" className="hover:underline hover:text-green-700">Terms & Conditions</Link></li>
            <li><Link href="/info/privacy" className="hover:underline hover:text-green-700">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Contact + Recomendaciones */}
        <div>
          <h5 className="text-lg font-semibold mb-3 text-gray-900">Contact</h5>
          <p className="mb-2 text-gray-700 flex items-center gap-2"><FaMapMarkerAlt /> Iquitos, Peru</p>
          <p className="mb-2 text-gray-700 flex items-center gap-2"><FaPhoneAlt /> +51 987 654 321</p>
          <p className="mb-4 text-gray-700 flex items-center gap-2"><FaEnvelope /> contacto@amazonlodge.com</p>

          <h5 className="text-sm font-semibold text-gray-900 mb-2">Recommended on</h5>
          <div className="flex flex-wrap items-center gap-3">
            {['tripadvisor', 'airbnb', 'expedia', 'booking', 'hostelworld'].map((img) => (
              <a key={img} href={`https://www.${img}.com`} target="_blank" rel="noopener noreferrer">
                <Image
                  src={`/galeria/${img}.svg`}
                  alt={img}
                  width={80}
                  height={20}
                  className="h-5 w-auto hover:scale-105 transition-transform"
                />
              </a>
            ))}
          </div>

          <div className="mt-4">
            <a
              href="https://www.google.com/maps/place/Amazon+Spirit+Lodge/reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-800 hover:text-yellow-500 transition-colors"
            >
              <FaStar className="text-yellow-500" />
              <span>Google Reviews</span>
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-500 text-xs mt-12 border-t border-gray-300 pt-5">
        © {new Date().getFullYear()} Amazon Spirit Lodge. All rights reserved.
      </div>
    </footer>
  );
}
