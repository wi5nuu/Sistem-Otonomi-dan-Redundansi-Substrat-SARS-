import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SARS Control Center',
  description: 'Global Infrastructure Command & Resilience Platform',
  authors: [{ name: 'SARS Engineering' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-sars-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
