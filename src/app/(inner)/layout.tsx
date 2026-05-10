'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import styles from './Navigation.module.css';

import SearchIcon from '@mui/icons-material/Search';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { Button } from '@mui/material';
import Filters from '@/components/Filters';

export default function InnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  const isAdmin = (session?.user as any)?.role === 'admin';
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/articles?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <header className={styles.headerContainer}>
        <div className={styles.topRow}>
          <Link href="/" className={styles.logo}>truelove</Link>
          
          <div className={styles.searchWrapper}>
            <input 
              type="text" 
              placeholder="Пошук книг..." 
              className={`${styles.searchInput} text-slate-900 placeholder-slate-400`} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button 
              variant="contained" 
              onClick={handleSearch}
              className="bg-[#3b3a6e] hover:bg-[#350846] rounded-none px-6 shadow-none normal-case"
              startIcon={<SearchIcon />}
            >
              Пошук
            </Button>
          </div>

          <div className="flex gap-6 items-center text-slate-700 font-medium text-sm">
            {status === "loading" ? (
              <div className="w-20 h-8 bg-slate-50 animate-pulse rounded-lg"></div>
            ) : session ? (
              <div className="flex items-center gap-3">
                <Link href="/profile" className="flex items-center gap-1 cursor-pointer hover:text-[#350846] transition-colors">
                  <PersonOutlineIcon />
                  <span className="hidden laptop:inline font-bold">{session.user?.name}</span>
                </Link>
                <button onClick={() => signOut()} className="text-[10px] text-red-400 hover:text-red-600 uppercase font-black tracking-tighter transition-colors">
                  Вихід
                </button>
              </div>
            ) : (
              <Button 
                variant="outlined" 
                onClick={() => router.push('/login')}
                className="border-[#3b3a6e] text-[#3b3a6e] hover:bg-[#3b3a6e] hover:text-white normal-case font-bold px-4 rounded-lg transition-all"
              >
                Увійти
              </Button>
            )}
          </div>
        </div>

        <nav className="w-full border-b border-slate-100 pb-4">
          <ul className={styles.categoryNav}>
            <li><Link href="/articles" className={pathname === '/articles' ? "font-bold text-[#350846]" : "hover:text-[#350846]"}>Паперові книги</Link></li>
            <li><Link href="/ebooks" className={pathname === '/ebooks' ? "font-bold text-[#350846]" : "hover:text-[#350846]"}>Електронні книги</Link></li>
            <li><Link href="/authors" className={pathname === '/authors' ? "font-bold text-[#350846]" : "hover:text-[#350846]"}>Автори</Link></li>
            
            {session && (
              <>
                <div className="w-px h-4 bg-slate-200 mx-2 hidden tablet:block"></div>
                <li><Link href="/shelf" className="text-slate-500 hover:text-[#350846]">Моя полиця</Link></li>
                <li><Link href="/read" className="text-slate-500 hover:text-[#350846]">Прочитано</Link></li>
              </>
            )}
          </ul>
        </nav>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 bg-white border-r border-slate-100 p-8 hidden md:block">
          {session && (
            <div className="mb-10">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Навігація</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/favorites" className={`flex items-center gap-2 text-sm transition-all ${pathname === '/favorites' ? 'text-red-500 font-bold' : 'text-slate-600 hover:text-red-400'}`}>
                    ❤️ Улюблені
                  </Link>
                </li>
                {/*{isAdmin && (
                  <li className="pt-4 border-t border-slate-100">
                    <Link href="/articles/create" className={`flex items-center gap-2 text-sm transition-all ${pathname === '/articles/create' ? 'text-[#350846] font-black' : 'text-slate-600 font-bold'}`}>
                      <span className="bg-green-100 text-green-600 w-6 h-6 rounded-full flex items-center justify-center font-black text-lg pb-0.5">+</span>
                      Додати книгу
                    </Link>
                  </li>
                )}*/}
              </ul>
            </div>
          )}

          <div className="mb-10">
            <Filters />
          </div>
        </aside>

        <main className="flex-1 bg-slate-50 p-4 tablet:p-8">{children}</main>
      </div>
    </div>
  );
}