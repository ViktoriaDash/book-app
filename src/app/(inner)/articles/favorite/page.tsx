import { Suspense } from 'react';

async function FavoriteArticle({ id }: { id: number }) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  
  if (!res.ok) return <div>Помилка завантаження книги #{id}</div>;
  
  const post = await res.json();

  return (
    <div className="p-4 border rounded bg-white shadow-sm">
      <h3 className="font-bold text-blue-800 capitalize">{post.title}</h3>
      <p className="text-gray-600 mt-2">{post.body}</p>
    </div>
  );
}

export default function FavoritePage() {
  const ids = [1, 5, 9];  

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">❤️ Мої улюблені книги</h1>
      <div className="grid gap-4">
        {ids.map((id) => (
          <Suspense 
            key={id} 
            fallback={<div className="p-4 border rounded bg-gray-50 animate-pulse">Завантаження книги #{id}...</div>}
          >
            <FavoriteArticle id={id} />
          </Suspense>
        ))}
      </div>
    </div>
  );
}