import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToastContainer } from '@/components/ui/Toast';
import { QueryProvider } from '@/lib/providers/QueryProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AURA OSINT - Advanced Universal Recognition & Analysis',
  description: 'Moteur d\'intelligence forensique cross-plateforme pour l\'analyse OSINT, la corrélation d\'identités et l\'investigation numérique.',
  keywords: ['OSINT', 'TikTok', 'Analysis', 'Forensic', 'Intelligence'],
  authors: [{ name: 'Kaabache Soufiane' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#336AEA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50 antialiased`}>
        <QueryProvider>
          <div className="min-h-full">
            {children}
          </div>
          <ToastContainer />
        </QueryProvider>
      </body>
    </html>
  );
}