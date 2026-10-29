import './globals.css';

export const metadata = {
  title: 'Word of the Day',
  description: 'One word a day, shared with friends.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
