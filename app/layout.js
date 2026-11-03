import './globals.css';
import InstallTip from './InstallTip';
import ServiceWorker from './ServiceWorker';

export const metadata = {
  title: 'Word of the Day',
  description: 'One word a day, shared with friends.',
  // app/manifest.js is linked automatically.
  icons: {
    icon: [
      { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
  },
  // iPhone home screen: open full-screen, with dark status bar text on our white background.
  appleWebApp: {
    capable: true,
    title: 'Word of Day',
    statusBarStyle: 'default',
  },
  formatDetection: { telephone: false },
  other: {
    // Next.js only writes the newer "mobile-web-app-capable" tag; older iPhones need this one.
    'apple-mobile-web-app-capable': 'yes',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover', // use the whole screen; globals.css keeps content clear of the notch and home bar
  themeColor: '#ffffff',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <InstallTip />
        <ServiceWorker />
      </body>
    </html>
  );
}
