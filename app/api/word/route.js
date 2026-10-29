import { NextResponse } from 'next/server';
import { db, friendlyDbError } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { todayInToronto } from '@/lib/day';
import { normalizeWord, checkWord } from '@/lib/words';

// POST /api/word  { word } — post your word for today. You get one try: no changes after.
export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Please log in again.' }, { status: 401 });

    const { word: raw } = await request.json().catch(() => ({}));
    const word = normalizeWord(raw);
    const problem = checkWord(word);
    if (problem) return NextResponse.json({ error: problem }, { status: 400 });

    const { data, error } = await db()
      .from('posts')
      .insert({ user_id: user.id, day: todayInToronto(), word })
      .select('id, day, word')
      .single();
    // The database allows one post per person per day, so a second try lands here.
    if (error?.code === '23505') {
      return NextResponse.json({ error: 'You’ve already posted today — your word is locked in.' }, { status: 409 });
    }
    if (error) return NextResponse.json({ error: friendlyDbError(error) }, { status: 500 });
    return NextResponse.json({ post: data });
  } catch (error) {
    return NextResponse.json({ error: friendlyDbError(error) }, { status: 500 });
  }
}
