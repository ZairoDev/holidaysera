
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import Providers from './providers';
import LayoutClient from './layout-client';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "HolidaySera - Find Your Perfect Holiday Home",
  description:
    "Discover unique properties and unforgettable experiences around the world. Book your dream vacation rental with HolidaySera.",
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <LayoutClient>
            <Navbar />
            <main className="pt-16">{children}</main>
            <Footer />
          </LayoutClient>
        </Providers>
      </body>
    </html>
  );
}
