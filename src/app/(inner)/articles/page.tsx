'use client';
import React from 'react';
import useSWR from 'swr'; 

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ArticlesPage() {

  const { data: books, error, isLoading } = useSWR('/api/books', fetcher, {
    revalidateOnFocus: false,
  });

  const handleBuyClick = (title: string) => {
    const searchQuery = encodeURIComponent(`купити книгу ${title}`);
    window.open(`https://www.yakaboo.ua/search/catalog?q=${searchQuery}`, '_blank');
  };

  const sortedBooks = books ? [...books].sort((a, b) => a.id - b.id) : [];

  if (error) return <div className="text-center py-20 text-red-400">Помилка завантаження бази даних.</div>;
  if (isLoading) return <div className="text-center py-20 text-slate-400 animate-pulse uppercase tracking-widest">Завантаження бібліотеки SWR...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-[#350846] mb-2 tracking-tight uppercase font-sans">Паперові книги</h1>
          <div className="h-1.5 w-16 bg-[#3b3a6e] rounded-full"></div>
        </div>
        <p className="text-sm text-slate-400 font-medium tracking-wider">КАТАЛОГ TRUELOVE</p>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 gap-x-6 gap-y-10">
        {sortedBooks.map((book: any) => (
          <div key={book.id} className="group flex flex-col bg-white rounded-2xl transition-all duration-400 hover:shadow-[0_30px_60px_rgba(53,8,70,0.12)] p-2 border border-transparent hover:border-slate-100">
            <div className="relative aspect-[3/4] rounded-xl bg-slate-50 mb-4 overflow-hidden border border-slate-100 flex items-center justify-center">
              <span className="text-slate-200 font-black text-2xl uppercase tracking-widest group-hover:scale-105 transition-transform duration-700 select-none">TrueLove</span>
              <button className="absolute top-3 left-3 bg-white/90 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:text-[#350846]" title="Додати до обраного">➕</button>
            </div>
            
            <div className="flex flex-col flex-grow px-2 pb-2">
              <div className="flex text-[10px] text-yellow-500 mb-2">{"★".repeat(5)} <span className="text-slate-400 ml-1">(5.0)</span></div>
              <h2 className="text-sm font-bold text-slate-800 leading-snug mb-1 line-clamp-2 group-hover:text-[#350846] transition-colors uppercase">{book.title}</h2>
              <p className="text-[10px] font-bold text-[#3b3a6e] mb-3 uppercase tracking-wider opacity-70">{book.author}</p>
              <p className="text-xs text-slate-400 line-clamp-2 mb-6 leading-relaxed italic">
                {book.description || "Опис книги готується до публікації..."}
              </p>
              <div className="mt-auto pt-4 border-t border-slate-50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-0.5">Ціна</p>
                    <p className="text-lg font-black text-[#350846] tracking-tight">{book.price} <span className="text-xs font-bold">ГРН</span></p>
                  </div>
                  <button onClick={() => handleBuyClick(book.title)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#3b3a6e] text-white hover:bg-[#350846] shadow-lg shadow-[#3b3a6e]/10 transition-all active:scale-90">🛒</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}