// The list of words for one day, with your own word highlighted.
export default function WordList({ posts, userId, emptyText }) {
  if (!posts.length) return <p className="muted">{emptyText}</p>;
  return (
    <ul className="word-list">
      {posts.map((post) => (
        <li key={post.id} className={post.user_id === userId ? 'mine' : undefined}>
          <span className="word">{post.word}</span>
          <span className="who">{post.user_id === userId ? 'you' : post.users?.name}</span>
        </li>
      ))}
    </ul>
  );
}
