'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BedDouble,
  ClipboardList,
  Users,
  MessageCircle,
  Star,
  Image,
  ImagePlus,
  Newspaper,
  FileText,
  ShieldCheck,
  ScrollText,
  UserCircle2,
  Mail,
} from 'lucide-react';

export default function AdminPerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ fullName: string; email: string; avatar?: string; role?: string } | null>(null);

  const [stats, setStats] = useState({
    rooms: 0,
    bookings: 0,
    users: 0,
    reviews: 0,
    contact: 0,
    gallery: 0,
    hero: 0,
    blog: 0,
    downloads: 0,
    messages: 0,
    terms: 1,
    privacy: 1,
    team: 1,
  });

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      router.push('/login?redirect=/admin/perfil');
    } else {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.role !== 'admin') {
          router.push('/');
        } else {
          setUser(parsed);
        }
      } catch {
        router.push('/login');
      }
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    const fetchStats = async () => {
      try {
        const [
          rooms,
          bookings,
          users,
          reviews,
          contact,
          gallery,
          hero,
          blog,
          downloads,
          messages,
        ] = await Promise.all([
          fetch('http://localhost:3000/rooms').then((res) => res.json()),
          fetch('http://localhost:3000/bookings', {
            headers: { Authorization: `Bearer ${token}` },
          }).then((res) => res.json()),
          fetch('http://localhost:3000/users', {
            headers: { Authorization: `Bearer ${token}` },
          }).then((res) => res.json()),
          fetch('http://localhost:3000/reviews').then((res) => res.json()),
          fetch('http://localhost:3000/contact').then((res) => res.json()),
          fetch('http://localhost:3000/gallery').then((res) => res.json()),
          fetch('http://localhost:3000/hero').then((res) => res.json()),
          fetch('http://localhost:3000/blog').then((res) => res.json()),
          fetch('http://localhost:3000/downloads').then((res) => res.json()),
          fetch('http://localhost:3000/messages', {
            headers: { Authorization: `Bearer ${token}` },
          }).then((res) => res.json()),
        ]);

        setStats((prev) => ({
          ...prev,
          rooms: rooms.length,
          bookings: bookings.length,
          users: users.length,
          reviews: reviews.length,
          contact: contact.length,
          gallery: gallery.length,
          hero: hero.length,
          blog: blog.length,
          downloads: downloads.length,
          messages: messages.length,
        }));
      } catch (err) {
        console.error('Error al cargar estadísticas', err);
      }
    };

    fetchStats();
  }, []);

  if (!user) return null;

  const avatar = user.avatar || null;
  const initial = user.fullName.charAt(0).toUpperCase();

  const cards = [
    { title: 'Habitaciones', value: stats.rooms, icon: <BedDouble size={26} />, href: '/admin/habitaciones' },
    { title: 'Reservas', value: stats.bookings, icon: <ClipboardList size={26} />, href: '/admin/reservas' },
    { title: 'Usuarios', value: stats.users, icon: <Users size={26} />, href: '/admin/usuarios' },
    { title: 'Reseñas', value: stats.reviews, icon: <Star size={26} />, href: '/admin/resenas' },
    { title: 'Chats', value: stats.messages, icon: <MessageCircle size={26} />, href: '/admin/mensajes' },
    { title: 'Contactos', value: stats.contact, icon: <Mail size={26} />, href: '/admin/contactos' },
    { title: 'Galería', value: stats.gallery, icon: <Image size={26} />, href: '/admin/galeria' },
    { title: 'Portada (Hero)', value: stats.hero, icon: <ImagePlus size={26} />, href: '/admin/hero' },
    { title: 'Blog', value: stats.blog, icon: <Newspaper size={26} />, href: '/admin/blog' },
    { title: 'Descargas (tarifas)', value: stats.downloads, icon: <FileText size={26} />, href: '/admin/downloads' },
    { title: 'Términos y Condiciones', value: stats.terms, icon: <ScrollText size={26} />, href: '/admin/terminos' },
    { title: 'Política de Privacidad', value: stats.privacy, icon: <ShieldCheck size={26} />, href: '/admin/privacidad' },
    { title: 'Nuestro Equipo', value: stats.team, icon: <UserCircle2 size={26} />, href: '/admin/equipo' },
  ];

  return (
    <div className="min-h-screen pt-4 px-6 pb-20 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-6 mb-10">
          {avatar ? (
            <img src={avatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover border shadow" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-teal-700 text-white flex items-center justify-center text-3xl font-bold shadow">
              {initial}
            </div>
          )}
          <div>
            <h2 className="text-3xl font-bold text-teal-800">{user.fullName}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500">Rol: Admin</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <button
              key={card.title}
              onClick={() => router.push(card.href)}
              className="bg-white border rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col items-start text-left"
            >
              <div className="bg-teal-100 text-teal-800 rounded-full p-3 mb-4">{card.icon}</div>
              <p className="text-sm text-gray-500">{card.title}</p>
              <p className="text-xl font-bold text-gray-800">{card.value}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
