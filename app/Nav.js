import Link from 'next/link';

const LINKS = [
  { href: '/', label: 'Today' },
  { href: '/history', label: 'History' },
  { href: '/me', label: 'My words' },
];

// The row of links under the title. `current` is the href of the page you're on.
export default function Nav({ current }) {
  return (
    <nav className="nav">
      {LINKS.map(({ href, label }) => (
        <Link key={href} href={href} className={href === current ? 'active' : undefined}>
          {label}
        </Link>
      ))}
    </nav>
  );
}
