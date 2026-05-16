'use client';

import React from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function EbooksPage() {
  const { data: session } = useSession();
  const { mutate } = useSWRConfig();
  const searchParams = useSearchParams();

  const isAdmin = (session?.user as any)?.role === 'admin';

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const lang = searchParams.get('lang') || '';

  const { data: books, error, isLoading } = useSWR(
    `/api/ebooks?search=${search}&category=${category}&lang=${lang}`, 
    fetcher
  );
  
  const { data: favorites } = useSWR(session ? '/api/favorites' : null, fetcher);
  const isFav = (id: number) => favorites?.some((f: any) => f.id === id);

  const handleDelete = async (id: number) => {
    if (!confirm("Видалити цю електронну книгу з бази? ")) return;
    try {
      const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
      if (res.ok) {
        mutate(`/api/ebooks?search=${search}&category=${category}&lang=${lang}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFavorite = async (bookId: number) => {
    if (!session) {
      alert("Увійдіть, щоб зберігати улюблені електронні книги ❤️");
      return;
    }
    const method = isFav(bookId) ? 'DELETE' : 'POST';
    try {
      const response = await fetch('/api/favorites', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId }),
      });
      if (response.ok) mutate('/api/favorites');
    } catch (err) { console.error(err); }
  };

  const handleAddToShelf = async (bookId: number) => {
    try {
      const response = await fetch('/api/shelf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId }),
      });
      if (response.status === 401) {
        alert("Увійдіть в акаунт, щоб додавати книги 📚");
        return;
      }
      const result = await response.json();
      if (response.ok) {
        alert(result.isRead ? "Ти вже прочитала цю книгу! ✨" : "Книгу додано на полицю! ");
      } else {
        alert(result.message || "Ця книга вже на полиці");
      }
    } catch (err) { alert("Помилка при додаванні"); }
  };

  if (error) return <div className="text-center py-20 text-red-400 font-bold uppercase">Помилка завантаження черги</div>;
  if (isLoading) return <div className="p-20 text-center animate-pulse font-black uppercase text-slate-400 tracking-widest">Завантажуємо байти...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 font-sans">
      <div className="mb-12">
        <h1 className="text-3xl font-black text-[#350846] mb-2 uppercase tracking-tighter">Цифрова бібліотека</h1>
        <div className="h-1.5 w-16 bg-green-500 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {books?.map((book: any) => (
          <div key={book.id} className="group flex flex-col bg-white rounded-3xl transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(34,197,94,0.15)] border border-slate-100 overflow-hidden">
            <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
              <Link href={`/articles/${book.id}`}>
                {book.image_url ? (
                  <Image 
                    src={book.image_url} 
                    alt={book.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700" 
                    unoptimized 
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-300 font-bold text-[10px] uppercase">No Cover</div>
                )}
              </Link>
              <button 
                onClick={() => toggleFavorite(book.id)}
                className="absolute top-3 right-3 bg-white/80 backdrop-blur-md p-2.5 rounded-full shadow-sm hover:scale-110 transition-transform z-10"
              >
                {isFav(book.id) ? (
                  <FavoriteIcon className="text-red-500" sx={{ fontSize: 18 }} />
                ) : (
                  <FavoriteBorderIcon className="text-[#350846]" sx={{ fontSize: 18 }} />
                )}
              </button>
              <div className="absolute top-3 left-3 bg-green-500/90 backdrop-blur-md px-2 py-1 rounded-lg text-[9px] font-black text-white uppercase shadow-sm">Digital</div>
            </div>
            
            <div className="p-5 flex flex-col flex-grow">
              <div className="flex items-center text-[10px] mb-2 text-yellow-500 font-bold">
                ★ {Number(book.average_rating).toFixed(1)} 
                <span className="text-slate-300 ml-1 font-medium italic">({book.reviews_count || 0})</span>
              </div>
              <Link href={`/articles/${book.id}`}>
                <h2 className="text-sm font-black text-slate-900 leading-tight mb-1 line-clamp-2 hover:text-green-600 transition-colors uppercase">{book.title}</h2>
              </Link>
              <p className="text-[10px] font-bold text-slate-400 mb-4 uppercase tracking-widest opacity-60">{book.author}</p>
              
              <div className="mt-auto pt-4 border-t border-slate-50 flex flex-col gap-2">
                <button 
                  onClick={() => handleAddToShelf(book.id)}
                  className="w-full bg-slate-900 hover:bg-green-600 text-white text-[10px] font-black uppercase py-3.5 rounded-xl tracking-widest transition-all shadow-md"
                >На полицю</button>

                {isAdmin && (
                  <div className="flex gap-2">
                    <Link href={`/articles/edit/${book.id}`} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-center text-[9px] font-black uppercase py-2.5 rounded-xl">Редагувати ✏️</Link>
                    <button onClick={() => handleDelete(book.id)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-500 text-[9px] font-black uppercase py-2.5 rounded-xl">Видалити 🗑️</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}