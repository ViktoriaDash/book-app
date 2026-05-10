'use client';

import React, { useEffect } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ReadPage() {
  const { data: session, status } = useSession();
  const { mutate } = useSWRConfig();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  const { data: shelfBooks, isLoading, error } = useSWR(
    status === 'authenticated' ? '/api/shelf' : null, 
    fetcher,
    { revalidateOnMount: true } 
  );


  const readBooks = shelfBooks?.filter((book: any) => 
    book.status?.toString().trim().toLowerCase() === 'read'
  );

  const handleRemove = async (bookId: number) => {
    if (!confirm("Видалити цю книгу з історії прочитаного?")) return;
    
    const res = await fetch('/api/shelf', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId })
    });

    if (res.ok) {
      mutate('/api/shelf');
    }
  };

  if (isLoading || status === 'loading') {
    return <div className="p-20 text-center animate-pulse font-black uppercase text-slate-400 tracking-widest text-xs">Завантажуємо твої досягнення...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 font-sans text-slate-900">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-black text-[#350846] uppercase tracking-tighter">Прочитано</h1>
          <div className="h-1.5 w-16 bg-green-500 rounded-full mt-2"></div>
        </div>
        <button onClick={() => router.back()} className="flex items-center gap-2 text-[#350846] font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 py-2 px-6 rounded-full border border-slate-100 transition-all">
          <ArrowBackIosNewIcon sx={{ fontSize: 10 }} /> Назад
        </button>
      </div>

      {!readBooks || readBooks.length === 0 ? (
        <div className="py-32 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-bold uppercase mb-6 text-xs tracking-widest">
            Тут з'являться книги, які ти закінчила читати
          </p>
          <Link href="/shelf" className="bg-[#350846] text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:scale-105 transition-all inline-block">
            До моєї полиці
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {readBooks.map((book: any) => (
            <div key={book.id} className="group bg-white rounded-3xl border border-slate-100 overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-500">
              <div className="relative aspect-[3/4] grayscale hover:grayscale-0 transition-all duration-700 overflow-hidden">
                <Image src={book.image_url} alt={book.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" unoptimized />
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase shadow-lg">✓ Прочитано</div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-lg font-black uppercase mb-1 line-clamp-1">{book.title}</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">{book.author}</p>
                
                <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center gap-2">
                  <button 
                    onClick={() => handleRemove(book.id)}
                    className="text-red-400 hover:text-red-600 font-black uppercase text-[9px] tracking-widest transition-colors"
                  >
                    Видалити
                  </button>
                  <Link href={`/articles/${book.id}`} className="text-[#350846] font-black uppercase text-[10px] tracking-widest hover:underline">
                    Деталі →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}