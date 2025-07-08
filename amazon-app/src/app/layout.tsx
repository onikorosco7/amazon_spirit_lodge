import './globals.css';
import type { Metadata } from 'next';
import MainLayout from './components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'Amazon Spirit Lodge',
  description: 'Reserva tu experiencia en la Amazonía',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
