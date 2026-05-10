'use client';

import React, { useState, useEffect } from 'react';
import useSWR, { useSWRConfig } from 'swr'; 
import { useSearchParams } from 'next/navigation'; 
import Image from 'next/image'; 
import Link from 'next/link'; 
import { useSession } from 'next-auth/react';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ArticlesPage() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { mutate } = useSWRConfig();
  const [currentPage, setCurrentPage] = useState(1);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const lang = searchParams.get('lang') || '';

  const isAdmin = (session?.user as any)?.role === 'admin';

  const { data: booksData, isLoading, error } = useSWR(
    `/api/books?search=${search}&category=${category}&lang=${lang}&page=${currentPage}`, 
    fetcher
  );

  useEffect(() => {
    const timer = setTimeout(() => setCurrentPage(1), 0);
    return () => clearTimeout(timer);
  }, [search, category, lang]);

  const { data: favorites } = useSWR(session ? '/api/favorites' : null, fetcher);

  const booksArray = booksData?.books || (Array.isArray(booksData) ? booksData : []);
  const totalPages = booksData?.totalPages || 1;
  const sortedBooks = [...booksArray].sort((a: any, b: any) => a.id - b.id);

  const isFav = (id: number) => favorites?.some((f: any) => f.id === id);

  const handleDelete = async (bookId: number) => {
    if (!confirm("Віко, ти впевнена, що хочеш видалити цю книгу з бібліотеки?")) return;

    try {
      const res = await fetch(`/api/books/${bookId}`, { method: 'DELETE' });
      if (res.ok) {
        mutate(`/api/books?search=${search}&category=${category}&lang=${lang}&page=${currentPage}`);
      } else {
        alert("Помилка при видаленні книги");
      }
    } catch (err) {
      console.error("Помилка:", err);
    }
  };

  const toggleFavorite = async (bookId: number) => {
    if (!session) {
      alert("Увійдіть, щоб зберігати улюблені книги ❤️");
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
        alert("Увійдіть, щоб додавати книги на полицю");
        return;
      }
      const result = await response.json();
      if (response.ok) {
        alert(result.isRead ? "Ти вже прочитала цю книгу! ✨" : "Книгу додано на твою полицю! 📚");
      } else {
        alert(result.message || "Ця книга вже є на вашій полиці");
      }
    } catch (err) { alert("Помилка при додаванні"); }
  };

  if (error) return <div className="text-center py-20 text-red-400 font-black uppercase tracking-widest">Помилка завантаження бази</div>;
  if (isLoading) return <div className="text-center py-20 text-slate-400 animate-pulse font-black uppercase tracking-widest">Шукаємо на полицях...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 font-sans">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#350846] mb-2 tracking-tighter uppercase">
            {search ? `Пошук: ${search}` : "Паперові книги"}
          </h1>
          <div className="h-1.5 w-16 bg-[#3b3a6e] rounded-full"></div>
        </div>
        <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase bg-slate-50 px-3 py-1 rounded-full">
          Сторінка {currentPage} з {totalPages}
        </p>
      </div>

      {sortedBooks.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
          <p className="text-slate-400 text-lg font-medium uppercase">Нічого не знайдено</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedBooks.map((book: any) => (
              <div key={book.id} className="group flex flex-col bg-white rounded-3xl transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(53,8,70,0.15)] border border-slate-100 overflow-hidden">
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
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[9px] font-black text-[#350846] uppercase shadow-sm">
                    {book.is_ebook ? 'Digital' : 'Paper'}
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-center text-[10px] mb-2 text-yellow-500 font-bold">
                    ★ {Number(book.average_rating).toFixed(1)} 
                    <span className="text-slate-300 ml-1 font-medium italic">({book.reviews_count || 0})</span>
                  </div>
                  <Link href={`/articles/${book.id}`}>
                    <h2 className="text-sm font-black text-slate-900 leading-tight mb-1 line-clamp-2 hover:text-[#350846] transition-colors uppercase">{book.title}</h2>
                  </Link>
                  <p className="text-[10px] font-bold text-[#3b3a6e] mb-4 uppercase tracking-widest opacity-60">{book.author}</p>
                  <p className="text-[11px] text-slate-600 line-clamp-2 mb-6 leading-relaxed italic h-8">{book.description}</p>
                  
                  <div className="mt-auto pt-4 border-t border-slate-50 flex flex-col gap-2">
                    <button 
                      onClick={() => handleAddToShelf(book.id)}
                      className="w-full bg-[#3b3a6e] hover:bg-[#350846] text-white text-[10px] font-black uppercase py-3.5 rounded-xl tracking-widest transition-all active:scale-95 shadow-md"
                    >
                      На полицю
                    </button>

                    {isAdmin && (
                      <div className="flex gap-2">
                        <Link 
                          href={`/articles/edit/${book.id}`}
                          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-center text-[9px] font-black uppercase py-2.5 rounded-xl transition-all"
                        >
                          Редагувати ✏️
                        </Link>
                        <button 
                          onClick={() => handleDelete(book.id)}
                          className="flex-1 bg-red-50 hover:bg-red-100 text-red-500 text-[9px] font-black uppercase py-2.5 rounded-xl transition-all"
                        >
                          Видалити 🗑️
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-16 flex justify-center items-center gap-6">
              <button 
                onClick={() => { setCurrentPage(prev => prev - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                disabled={currentPage === 1}
                className="bg-white border border-slate-200 text-[#350846] px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest disabled:opacity-30 shadow-sm hover:bg-slate-50 transition-colors"
              >
                ← Назад
              </button>
              <div className="flex items-center gap-2">
                <span className="bg-[#350846] text-white w-8 h-8 flex items-center justify-center rounded-lg font-black text-xs">{currentPage}</span>
              </div>
              <button 
                onClick={() => { setCurrentPage(prev => prev + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                disabled={currentPage === totalPages}
                className="bg-white border border-slate-200 text-[#350846] px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest disabled:opacity-30 shadow-sm hover:bg-slate-50 transition-colors"
              >
                Далі →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}