import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { todayInToronto, formatDay } from '@/lib/day';
import LogoutButton from './LogoutButton';

// Always render fresh: the page depends on who's logged in and today's date.
export const dynamic = 'force-dynamic';

export default async function Home() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <main className="narrow">
      <h1 className="title">Word of the Day</h1>
      <p className="muted center">{formatDay(todayInToronto())}</p>
      <div className="card stack">
        <p>
          Hi <strong>{user.name}</strong> — you’re logged in. 🎉
        </p>
        <p className="muted">Posting words arrives in step 2.</p>
        <LogoutButton />
      </div>
    </main>
  );
}
