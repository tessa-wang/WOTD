# Word of the Day

A tiny website for a group of friends. Once a day, everyone posts **one word** that describes their day, and everyone can see everyone else's words.

## How it works

- **Joining:** pick a nickname and you're in. Nicknames are unique (capital letters don't count, so "Sam" and "sam" are the same person). Your phone remembers you for a year.
- **Posting:** one word per person per day. Slang and made-up words are welcome; spaces and symbols aren't. Words are saved in lowercase.
- **One try:** once you post, your word is locked in for the day. No edits.
- **New day:** the day resets at **midnight Toronto time**.
- **Today:** see everyone's words, even before you post. Yours is highlighted.
- **History:** browse past days and open any day to see who posted what.
- **My words:** every word you've ever posted.

### Coming soon

- Mood colours (happy words warm, gloomy words cool)
- Rarity: "used in 2% of all posts", plus a ✨ for a word nobody has used before
- A word map where words with similar meanings sit close together
- Emoji reactions and comments

## What it's built with

All free tiers:

| Piece | What it does |
|---|---|
| [Next.js](https://nextjs.org) | The website: pages plus the small server code behind them |
| [Vercel](https://vercel.com) | Hosts the site and rebuilds it automatically on every change to this repo |
| [Supabase](https://supabase.com) | The database: nicknames and words |

## Where things are

| Path | What's in it |
|---|---|
| `app/page.js` | Today's screen |
| `app/history/`, `app/day/`, `app/me/` | History, a single past day, and My words |
| `app/login/` | The join screen |
| `app/api/` | Server code for joining, logging out and posting a word |
| `lib/words.js` | The rules for what counts as a word |
| `lib/day.js` | Dates and the Toronto midnight reset |
| `app/globals.css` | All the styling |
| `supabase/schema.sql` | Creates the database tables |

## Settings

These live in **Vercel → Settings → Environment Variables** (or in a `.env.local` file on your computer). They are never stored in this repo.

| Name | What it is |
|---|---|
| `SUPABASE_URL` | Your database address, like `https://xxxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | The Supabase **secret** key. Keep it private. |
| `SESSION_SECRET` | Any long random text. It's used to sign login cookies. |
| `GROUP_PASSCODE` | *Optional.* If set, people need this passcode to join. |

After changing a setting, redeploy: **Vercel → Deployments → ⋯ on the top deployment → Redeploy**.

## Set up your own copy

1. **Database:** create a free Supabase project. In **SQL Editor**, paste all of `supabase/schema.sql` and click **Run**.
2. **Website:** on Vercel, click **Add New → Project** and import this repo. Add the settings above, then click **Deploy**.
3. Share the link Vercel gives you, under **Overview → Domains**.

### Run it on your computer (optional)

1. Install Node.js (LTS) from https://nodejs.org.
2. In this folder, run `npm install`.
3. Create a file called `.env.local` with the settings above, one per line, like `SUPABASE_URL=https://xxxx.supabase.co`.
4. Run `npm run dev` and open http://localhost:3000.

## Common tasks

- **Change the site's text:** open the file on GitHub, click the ✏️ pencil, edit, and click **Commit changes**. Vercel updates the site in about 20 seconds.
- **Delete a word:** in Supabase, go to **Table Editor → posts**, tick the row, and click **Delete**. That person can then post again that day.
- **Remove a person:** in Supabase, go to **Table Editor → users** and delete their row. This also deletes all their words.
