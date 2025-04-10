import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from '@/components/Navigation';
import { Providers } from './providers';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VeggieQuiz - Test Your Plant Knowledge",
  description: "A fun and educational quiz platform about plants, vegetables, and sustainable living.",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
  manifest: '/site.webmanifest',
  other: {
    'content-language': 'en',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="content-language" content="en" />
      </head>
      <body className={`${inter.className} bg-gradient-to-br from-green-50 to-emerald-50 min-h-screen`}>
        <Providers>
          <Navigation />
          <main className="min-h-[calc(100vh-4rem)]">
            {children}
          </main>
          <footer className="bg-white shadow-lg mt-auto">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mr-2">
                    <span className="text-emerald-600 text-lg">🌱</span>
                  </div>
                  <span className="text-sm text-gray-600">© 2024 VeggieQuiz. All rights reserved.</span>
                </div>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-600 hover:text-emerald-600">
                    Terms
                  </a>
                  <a href="#" className="text-gray-600 hover:text-emerald-600">
                    Privacy
                  </a>
                  <a href="#" className="text-gray-600 hover:text-emerald-600">
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
