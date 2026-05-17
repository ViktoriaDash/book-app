'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

export default function BookClientView({ book, initialReviews, averageRating }: any) {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [status, setStatus] = useState<'none' | 'shelf' | 'read'>('none');
  const [isSaving, setIsSaving] = useState(false);
  const [reviews, setReviews] = useState(initialReviews);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentText, setCommentText] = useState('');


  const isAdmin = (session?.user as any)?.role === 'admin';

  useEffect(() => {
    if (session) {
      fetch('/api/shelf')
        .then(res => res.json())
        .then(data => {
          const userBook = data.find((item: any) => item.id === book.id);
          if (userBook) {
            setStatus(userBook.status === 'read' ? 'read' : 'shelf');
          }
        });
    }
  }, [session, book.id]);

  const handleAddToShelf = async () => {
    if (!session) return router.push('/login');
    if (status !== 'none') return; 

    setIsSaving(true);
    const res = await fetch('/api/shelf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId: book.id })
    });
    
    if (res.ok) {
      const result = await res.json();
      setStatus(result.isRead ? 'read' : 'shelf');
      if (result.isRead) {
        alert("Цю книгу ти вже прочитала! Вона в твоїй історії ✨");
      }
    } else {
      const error = await res.json();
      alert(error.message || "Сталася помилка");
    }
    setIsSaving(false);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newReview = { user_name: session?.user?.name, rating: userRating, comment: commentText, book_id: book.id };
    const res = await fetch('/api/reviews', { method: 'POST', body: JSON.stringify(newReview) });
    if (res.ok) {
      const savedReview = await res.json();
      setReviews([{ ...savedReview }, ...reviews]);
      setCommentText('');
      setUserRating(0);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!reviewId) return alert("Помилка: Немає ID коментаря");
    if (!confirm("Ти впевнена, що хочеш видалити цей коментар?")) return;

    try {
      const res = await fetch(`/api/reviews?id=${reviewId}`, { method: 'DELETE' });
      if (res.ok) {
        setReviews(reviews.filter((r: any) => r.id !== reviewId));
      } else {
        alert("Не вдалося видалити коментар");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 font-sans text-slate-900">
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-2 text-[10px] font-black uppercase text-slate-300 tracking-widest">
          <Link href="/">Головна</Link><span>/</span>
          <Link href={book.is_ebook ? "/ebooks" : "/articles"}>{book.is_ebook ? "Е-бібліотека" : "Каталог"}</Link>
        </div>
        <button onClick={() => router.back()} className="flex items-center gap-2 text-[#350846] font-black text-[10px] uppercase border px-4 py-2 rounded-full hover:bg-slate-50 transition-all">
          <ArrowBackIosNewIcon sx={{ fontSize: 10 }} /> Назад
        </button>
      </div>

      <div className="bg-white rounded-[40px] p-6 md:p-12 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-12">
        <div className="w-full md:w-1/3 relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
          <Image src={book.image_url} alt={book.title} fill className="object-cover" unoptimized />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex gap-3 mb-4">
            <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase text-white ${book.is_ebook ? 'bg-green-500' : 'bg-[#350846]'}`}>
              {book.is_ebook ? 'Digital' : 'Paper'}
            </span>
            <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
              <StarIcon fontSize="small" /> {averageRating}
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-2 uppercase tracking-tighter leading-none">{book.title}</h1>
          <p className="text-lg font-bold text-[#3b3a6e] uppercase tracking-widest mb-8 opacity-60">{book.author}</p>
          
          <p className="italic text-slate-600 mb-10 border-l-4 pl-6 leading-relaxed">{book.description}</p>

          <div className="mt-auto flex items-center justify-between border-t pt-8">
             <div>
                <p className="text-[10px] font-black text-slate-300 uppercase mb-1">Формат</p>
                <p className="text-xl font-black text-[#350846]">{book.is_ebook ? "PDF / EPUB" : "Папір"}</p>
             </div>
             
             <button 
               onClick={handleAddToShelf}
               disabled={status !== 'none' || isSaving}
               className={`
                 px-12 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all shadow-xl flex items-center gap-3
                 ${status === 'read'
                   ? 'bg-green-100 text-green-600 border border-green-200 cursor-default' 
                   : status === 'shelf'
                     ? 'bg-[#F3E8FF] text-[#A855F7] border border-[#E9D5FF] cursor-default' 
                     : book.is_ebook 
                       ? 'bg-green-600 hover:bg-green-700 text-white active:scale-95' 
                       : 'bg-[#3b3a6e] hover:bg-[#350846] text-white active:scale-95'
                 }
                 ${(status !== 'none' || isSaving) ? '' : 'hover:shadow-2xl hover:-translate-y-0.5'}
               `}
             >
               <span className="text-xl">
                 {isSaving ? "⏳" : status === 'read' ? "✅" : status === 'shelf' ? "📚" : (book.is_ebook ? "📖" : "➕")}
               </span>
               {isSaving ? "Зберігаємо..." : status === 'read' ? "Прочитано" : status === 'shelf' ? "На полиці" : "На полицю"}
             </button>
          </div>
        </div>
      </div>

      <div className="mt-20 max-w-3xl">
        <h2 className="text-2xl font-black uppercase mb-8">Відгуки</h2>
        {session ? (
          <form onSubmit={handleReviewSubmit} className="bg-slate-50 p-8 rounded-3xl mb-12 border border-slate-100">
            <div className="flex mb-4 cursor-pointer">
              {[1,2,3,4,5].map(s => (
                <div key={s} onClick={() => setUserRating(s)} onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)}>
                  {s <= (hoverRating || userRating) ? <StarIcon className="text-yellow-500" /> : <StarBorderIcon className="text-slate-300" />}
                </div>
              ))}
            </div>
            <textarea value={commentText} onChange={e => setCommentText(e.target.value)} className="w-full p-4 rounded-xl border-none shadow-inner mb-4 focus:ring-2 ring-[#350846] text-sm" rows={3} placeholder="Твій відгук..." />
            <button type="submit" disabled={!userRating} className="bg-[#350846] text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest disabled:opacity-50 transition-all hover:bg-[#250632]">Опублікувати</button>
          </form>
        ) : (
          <div className="p-12 border-2 border-dashed border-slate-200 rounded-[32px] text-center mb-12 bg-slate-50/50">
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-4">Увійдіть, щоб залишити відгук</p>
            <Link href="/login" className="inline-block text-[#350846] font-black uppercase text-[10px] tracking-widest border border-[#350846] px-6 py-2 rounded-lg hover:bg-[#350846] hover:text-white transition-all">Увійти</Link>
          </div>
        )}
        
        <div className="space-y-8">
          {reviews.map((r: any, i: number) => (
            <div key={r.id || i} className="border-b border-slate-100 pb-8 last:border-0 group">
              <div className="flex justify-between items-center font-black text-[10px] uppercase mb-3 tracking-widest">
                <div className="flex items-center gap-3">
                  <span className="text-slate-900">{r.user_name}</span>
                  <div className="flex items-center text-yellow-500 font-bold">
                    {r.rating}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-slate-300">{new Date(r.created_at).toLocaleDateString('uk-UA')}</span>
                  
                  {isAdmin && (
                    <button 
                      onClick={() => handleDeleteReview(r.id)} 
                      className="bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-black uppercase px-3 py-1.5 rounded-lg transition-all active:scale-95 cursor-pointer border border-red-100"
                      title="Видалити коментар"
                    >
                      Видалити
                    </button>
                  )}
                </div>
              </div>
              <p className="text-slate-700 bg-slate-50/50 p-5 rounded-2xl italic text-sm leading-relaxed border-l-2 border-[#350846]">
                {r.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}