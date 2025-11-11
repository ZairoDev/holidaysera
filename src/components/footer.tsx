'use client';

import Link from 'next/link';
import { Home, Facebook, Instagram, Twitter, Mail } from 'lucide-react';

export function Footer() {
  const footerSections = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Press', href: '/press' },
        { label: 'Blog', href: '/blog' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '/help' },
        { label: 'Safety', href: '/safety' },
        { label: 'Cancellation', href: '/cancellation' },
        { label: 'Contact Us', href: '/contact' },
      ],
    },
    {
      title: 'Hosting',
      links: [
        { label: 'List Your Property', href: '/host' },
        { label: 'Host Resources', href: '/host-resources' },
        { label: 'Community', href: '/community' },
        { label: 'Responsible Hosting', href: '/responsible' },
      ],
    },
  ];

  return (
    <footer className="border-t bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-lg">
                <Home className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                Stay<span className="text-sky-600">Haven</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Discover your perfect getaway. Book unique homes and experiences
              around the world.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-sky-600"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-sky-600"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-sky-600"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="mailto:contact@stayhaven.com"
                className="text-gray-400 transition-colors hover:text-sky-600"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-sm font-semibold text-gray-900">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 transition-colors hover:text-sky-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} StayHaven. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-600">
              <Link href="/privacy" className="hover:text-sky-600">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-sky-600">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-sky-600">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
