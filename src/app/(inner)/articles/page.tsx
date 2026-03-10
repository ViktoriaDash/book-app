'use client';
import React, { useEffect, useState } from 'react';

export default function ArticlesPage() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((res) => res.json())
      .then((data) => setPosts(data.slice(0, 16)));
  }, []);

  const handleBuyClick = (title: string) => {
    const searchQuery = encodeURIComponent(`купити книгу ${title}`);
    window.open(`https://www.yakaboo.ua/search/catalog?q=${searchQuery}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-[#350846] mb-2 tracking-tight">Паперові книги</h1>
          <div className="h-1.5 w-16 bg-[#3b3a6e] rounded-full"></div>
        </div>
        <p className="text-sm text-slate-400 font-medium">Каталог TrueLove</p>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 gap-x-6 gap-y-10">
        {posts.map((post: any) => (
          <div key={post.id} className="group flex flex-col bg-white rounded-2xl transition-all duration-400 hover:shadow-[0_30px_60px_rgba(53,8,70,0.12)] p-2">
            
            <div className="relative aspect-[3/4] rounded-xl bg-slate-50 mb-4 overflow-hidden border border-slate-100 flex items-center justify-center">
              <span className="text-slate-200 font-black text-2xl uppercase tracking-widest group-hover:scale-105 transition-transform duration-700">TrueLove</span>
              
              {/* Швидка дія: Додати на полицю */}
              <button className="absolute top-3 left-3 bg-white/90 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:text-[#350846]" title="Додати на мою полицю">
                ➕
              </button>
              
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[10px] font-bold px-2 py-1 rounded shadow-sm text-[#3b3a6e]">ID: {post.id}</div>
            </div>
            
            <div className="flex flex-col flex-grow px-2 pb-2">
              {/* Рейтинг для любителів книг */}
              <div className="flex text-[10px] text-yellow-500 mb-2">
                {"★".repeat(4)}{"☆".repeat(1)} <span className="text-slate-400 ml-1">(4.0)</span>
              </div>

              <h2 className="text-sm font-bold text-slate-800 leading-snug mb-2 line-clamp-2 group-hover:text-[#350846] transition-colors">{post.title}</h2>
              <p className="text-xs text-slate-400 line-clamp-2 mb-6 leading-relaxed italic">"{post.body.substring(0, 50)}..."</p>

              <div className="mt-auto pt-4 border-t border-slate-50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Ціна від</p>
                    <p className="text-lg font-black text-[#350846]">{Math.floor(Math.random() * 150) + 180} грн</p>
                  </div>
                  
                  <button 
                    onClick={() => handleBuyClick(post.title)}
                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#3b3a6e] text-white hover:bg-[#350846] shadow-lg shadow-blue-100 transition-all active:scale-90"
                    title="Знайти в магазинах"
                  >
                    🛒
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}