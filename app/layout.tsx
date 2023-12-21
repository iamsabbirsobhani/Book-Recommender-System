import type { Metadata } from 'next';
import { Lexend } from 'next/font/google';
import './globals.css';

const lexend = Lexend({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Book Recommender System',
  description: 'Book Recommender System',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mindpad.vercel.app/',
    images: [
      {
        url: 'https://firebasestorage.googleapis.com/v0/b/general-eadd6.appspot.com/o/BookRecommendedSystem%2FBRS.png?alt=media&token=88de48a5-ceb0-4cfc-abbe-97c4ab979e6f',
        width: 1200,
        height: 630,
        alt: 'Book Recommender System',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={lexend.className}>{children}</body>
    </html>
  );
}
