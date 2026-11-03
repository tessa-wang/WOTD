// The web app manifest (served at /manifest.webmanifest). It tells phones the app's
// name, colours and icons, and to open full-screen without the browser bar.
export default function manifest() {
  return {
    id: '/',
    name: 'Word of the Day',
    short_name: 'Word of Day', // shown under the home screen icon; short so it isn't cut off
    description: 'One word a day, shared with friends.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff', // splash screen while the app opens
    theme_color: '#ffffff', // Android status bar / task switcher
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
