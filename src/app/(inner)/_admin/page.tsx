'use client';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import useSWR from 'swr';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AdminDashboard() {
  const { data: booksData, mutate } = useSWR('/api/books', fetcher);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const books = booksData?.books || (Array.isArray(booksData) ? booksData : []);

  const handleDelete = async (id: number) => {
    if (!confirm('Ти впевнена, що хочеш видалити цю книгу? 🗑️')) return;
    
    setDeletingId(id);
    const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
    
    if (res.ok) {
      mutate(); 
    } else {
      alert('Помилка при видаленні');
    }
    setDeletingId(null);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-[#350846] uppercase tracking-tighter">Керування книгами</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Всього в базі: {books.length}</p>
        </div>
        <Link href="/articles/create" className="bg-[#3b3a6e] text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#350846] transition-all shadow-lg">
          + Додати нову
        </Link>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Книга</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Жанр / Мова</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Дії</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {books.map((book: any) => (
              <tr key={book.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-16 rounded-lg overflow-hidden shadow-sm">
                      <Image src={book.image_url} alt="" fill className="object-cover" unoptimized />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-sm uppercase leading-tight">{book.title}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{book.author}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <span className="bg-purple-50 text-[#350846] px-3 py-1 rounded-full text-[9px] font-black uppercase mr-2">{book.category}</span>
                  <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[9px] font-black uppercase">{book.language}</span>
                </td>
                <td className="p-6 text-right space-x-2">
                  <Link 
                    href={`/articles/edit/${book.id}`}
                    className="inline-block p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                  >
                    ✏️
                  </Link>
                  <button 
                    onClick={() => handleDelete(book.id)}
                    disabled={deletingId === book.id}
                    className="p-3 bg-red-50 hover:bg-red-100 rounded-xl transition-all"
                  >
                    {deletingId === book.id ? '...' : '🗑️'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}