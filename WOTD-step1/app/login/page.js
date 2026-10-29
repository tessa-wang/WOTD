import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import LoginForm from './LoginForm';

export const metadata = { title: 'Log in · Word of the Day' };

export default async function LoginPage() {
  if (await getCurrentUser()) redirect('/');
  return (
    <main className="narrow">
      <h1 className="title">Word of the Day</h1>
      <p className="muted center">One word. Every day. Together.</p>
      <LoginForm />
    </main>
  );
}
