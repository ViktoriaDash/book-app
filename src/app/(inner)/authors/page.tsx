'use client';

import useSWR, { useSWRConfig } from 'swr';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AuthorsPage() {
  const { data: session } = useSession();
  const { mutate } = useSWRConfig();
  const { data: authors, error, isLoading } = useSWR('/api/authors', fetcher);

  const isAdmin = (session?.user as any)?.role === 'admin';

  const authorsList = Array.isArray(authors) ? authors : [];
  const sortedAuthors = [...authorsList].sort((a: any, b: any) => 
    (a.author || a.name || "").localeCompare(b.author || b.name || "", 'uk')
  );


  const handleDeleteAuthor = async (id: number) => {
    if (!confirm("Видалити цього автора з бази? 🗑️")) return;

    try {
      const res = await fetch(`/api/authors/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert("Автора видалено ✨");
        mutate('/api/authors');
      } else {
        alert("Помилка при видаленні");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (error) return <div className="p-20 text-center text-red-400 font-bold uppercase tracking-widest">Помилка завантаження списку</div>;
  if (isLoading) return <div className="p-20 text-center text-slate-400 animate-pulse uppercase font-black">Складаємо алфавітний список...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 font-sans">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-[#350846] mb-2 tracking-tight uppercase">
          Наші Автори
        </h1>
        <div className="h-1.5 w-20 bg-[#3b3a6e] rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sortedAuthors.map((item: any, index: number) => {
          const authorName = item.author || item.name;
          const authorId = item.id;

          return (
            <div key={index} className="group relative">
              <Link 
                href={`/articles?search=${encodeURIComponent(authorName)}`}
                className="flex bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#350846]/20 transition-all duration-300 items-center gap-5"
              >

                <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-[#350846] font-black text-2xl group-hover:bg-[#350846] group-hover:text-white transition-all duration-300 shadow-inner">
                  {authorName ? authorName[0] : '👤'}
                </div>
                
                <div>
                  <h2 className="text-xl font-black text-slate-900 group-hover:text-[#350846] transition-colors leading-tight uppercase">
                    {authorName}
                  </h2>
                </div>
              </Link>

              {isAdmin && authorId && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <Link 
                    href={`/authors/edit/${authorId}`}
                    className="bg-slate-100 text-slate-500 p-2 rounded-lg hover:bg-blue-500 hover:text-white transition-colors text-[10px] font-bold"
                  >
                    ✏️
                  </Link>
                  <button 
                    onClick={(e) => { e.preventDefault(); handleDeleteAuthor(authorId); }}
                    className="bg-slate-100 text-slate-500 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors text-[10px] font-bold"
                  >
                    🗑️
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {sortedAuthors.length === 0 && (
        <p className="text-center text-slate-400 font-bold uppercase py-10 tracking-widest">
          Авторів поки не знайдено
        </p>
      )}
    </div>
  );
}