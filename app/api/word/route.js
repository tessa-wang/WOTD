import { NextResponse } from 'next/server';
import { db, friendlyDbError } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { todayInToronto } from '@/lib/day';
import { normalizeWord, checkWord } from '@/lib/words';

// POST /api/word  { word } — post or change your word for today.
// Only today's word can ever be written, so yesterday's word is locked automatically.
export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Please log in again.' }, { status: 401 });

    const { word: raw } = await request.json().catch(() => ({}));
    const word = normalizeWord(raw);
    const problem = checkWord(word);
    if (problem) return NextResponse.json({ error: problem }, { status: 400 });

    const day = todayInToronto();
    const { data, error } = await db()
      .from('posts')
      .upsert(
        // A changed word gets a fresh meaning + mood (filled in from step 3 on).
        { user_id: user.id, day, word, embedding: null, mood: null, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,day' },
      )
      .select('id, day, word')
      .single();
    if (error) return NextResponse.json({ error: friendlyDbError(error) }, { status: 500 });

    return NextResponse.json({ post: data });
  } catch (error) {
    return NextResponse.json({ error: friendlyDbError(error) }, { status: 500 });
  }
}
