'use client';

import React, { useEffect } from 'react'; 
import useSWR, { useSWRConfig } from 'swr';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const { mutate } = useSWRConfig();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const { data: books, isLoading } = useSWR(status === 'authenticated' ? '/api/favorites' : null, fetcher);


  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="p-20 text-center font-black uppercase text-slate-400 animate-pulse tracking-widest text-xs">
        Перевірка доступу...
      </div>
    );
  }

  const removeFavorite = async (bookId: number) => {
    await fetch('/api/favorites', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId })
    });
    mutate('/api/favorites');
  };

  if (isLoading) return <div className="p-20 text-center font-black uppercase text-slate-400 animate-pulse text-xs">Відкриваємо твій список улюблених...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 font-sans text-slate-900">
      <div className="flex justify-between items-end mb-12">
        <h1 className="text-4xl font-black text-[#350846] uppercase tracking-tighter">Улюблені</h1>
        <button onClick={() => router.back()} className="flex items-center gap-2 text-[#350846] font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 py-2 px-6 rounded-full border border-slate-100 transition-all">
          <ArrowBackIosNewIcon sx={{ fontSize: 10 }} /> Назад
        </button>
      </div>

      {!books || books.length === 0 ? (
        <div className="py-32 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-bold uppercase mb-6 text-xs tracking-widest">Тут поки порожньо</p>
          <Link href="/articles" className="bg-[#350846] text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg transition-transform hover:scale-105 inline-block">Шукати книги</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {books.map((book: any) => (
            <div key={book.id} className="group bg-white rounded-3xl border border-slate-100 overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-500">
              <Link href={`/articles/${book.id}`} className="relative aspect-[3/4] overflow-hidden">
                <Image src={book.image_url} alt={book.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" unoptimized />
                <div className={`absolute top-4 left-4 backdrop-blur-md px-2 py-1 rounded-lg text-[9px] font-black uppercase ${book.is_ebook ? 'bg-green-500 text-white' : 'bg-white/90 text-[#350846]'}`}>
                  {book.is_ebook ? 'Digital' : 'Paper'}
                </div>
              </Link>
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-lg font-black uppercase mb-1 line-clamp-1">{book.title}</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-6 tracking-widest">{book.author}</p>
                <div className="mt-auto pt-5 border-t border-slate-50 flex justify-between items-center">
                  <button onClick={() => removeFavorite(book.id)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                    <FavoriteIcon sx={{ fontSize: 20 }} />
                  </button>
                  <Link href={`/articles/${book.id}`} className="text-[#350846] font-black uppercase text-[10px] tracking-widest hover:underline">Детальніше →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}