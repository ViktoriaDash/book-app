'use client';

import React, { useEffect } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function MyShelfPage() {
  const { data: session, status } = useSession();
  const { mutate } = useSWRConfig();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const { data: shelfBooks, isLoading } = useSWR(status === 'authenticated' ? '/api/shelf' : null, fetcher);
  const { data: favoriteBooks } = useSWR(status === 'authenticated' ? '/api/favorites' : null, fetcher);

  
  const activeBooks = shelfBooks?.filter((book: any) => book.status !== 'read');

  const isFavorite = (id: number) => favoriteBooks?.some((f: any) => f.id === id);

  const toggleFavorite = async (bookId: number) => {
    const method = isFavorite(bookId) ? 'DELETE' : 'POST';
    await fetch('/api/favorites', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId })
    });
    mutate('/api/favorites');
  };

  const handleRemove = async (bookId: number) => {
    if (!confirm("Видалити з полиці?")) return;
    await fetch('/api/shelf', { 
      method: 'DELETE', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId }) 
    });
    mutate('/api/shelf');
  };

      const markAsRead = async (bookId: number) => {
      try {
        const res = await fetch('/api/shelf', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookId, status: 'read' })
        });

        if (res.ok) {
          await mutate('/api/shelf'); 
          
          router.push('/read'); 
        }
      } catch (error) {
        console.error("Помилка:", error);
      }
    };

  if (isLoading || status === 'loading') {
    return <div className="p-20 text-center font-black uppercase animate-pulse text-slate-400 tracking-widest text-xs">Завантаження полиці...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 font-sans text-slate-900">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-[#350846] uppercase tracking-tighter">Моя полиця</h1>
        <div className="h-1.5 w-16 bg-[#3b3a6e] rounded-full mt-2"></div>
      </div>
      
      {!activeBooks || activeBooks.length === 0 ? (
        <div className="py-32 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-bold uppercase mb-6 text-xs tracking-widest">Твоя полиця очікування порожня</p>
          <Link href="/articles" className="bg-[#350846] text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all inline-block shadow-lg">
            Додати нову книгу
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {activeBooks.map((book: any) => (
            <div key={book.id} className="group bg-white rounded-3xl border border-slate-100 overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-500">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Link href={`/articles/${book.id}`}>
                  <Image src={book.image_url} alt={book.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" unoptimized />
                </Link>
                
                <button 
                  onClick={(e) => { e.preventDefault(); toggleFavorite(book.id); }}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-md hover:scale-110 transition-transform z-10"
                >
                  {isFavorite(book.id) ? <FavoriteIcon className="text-red-500" /> : <FavoriteBorderIcon className="text-[#350846]" />}
                </button>

                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[9px] font-black uppercase text-[#350846] shadow-sm">
                  {book.is_ebook ? 'Digital' : 'Paper'}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <Link href={`/articles/${book.id}`}>
                  <h2 className="text-lg font-black uppercase mb-1 line-clamp-1 hover:text-[#350846] transition-colors">{book.title}</h2>
                </Link>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-6 tracking-widest">{book.author}</p>
                
                <div className="mt-auto pt-5 border-t border-slate-50 flex justify-between items-center gap-2">
                  <button 
                    onClick={() => handleRemove(book.id)} 
                    className="text-red-400 hover:text-red-600 font-black uppercase text-[9px] tracking-widest transition-colors"
                  >
                    Прибрати
                  </button>
                  
                  <button 
                    onClick={() => markAsRead(book.id)}
                    className="text-[#350846] font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-transform"
                  >
                    Прочитано ✓
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}