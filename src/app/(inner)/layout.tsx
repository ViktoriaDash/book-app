'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navigation.module.css';

// Іконки MUI
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import { Button } from '@mui/material';

export default function InnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className={styles.headerContainer}>
        {/* ВЕРХНІЙ РЯДОК: Лого, Пошук, Юзер */}
        <div className={styles.topRow}>
          <Link href="/" className={styles.logo}>
            truelove
          </Link>
          
          <div className={styles.searchWrapper}>
            <input 
              type="text" 
              placeholder="Пошук книг..." 
              className={styles.searchInput} 
            />
            <Button 
              variant="contained" 
              className="bg-[#3b3a6e] hover:bg-[#350846] rounded-none px-6 shadow-none normal-case"
              startIcon={<SearchIcon />}
            >
              Пошук
            </Button>
          </div>

          <div className="flex gap-6 items-center text-slate-700 font-medium text-sm">
             <div className="flex items-center gap-1 cursor-pointer hover:text-[#350846]">
                <PhoneInTalkIcon fontSize="small" />
                <span className="hidden laptop:inline">Зв'язатися</span>
             </div>
             <div className="cursor-pointer hover:text-[#350846]">
                <ShoppingCartOutlinedIcon />
             </div>
             <div className="flex items-center gap-1 cursor-pointer hover:text-[#350846]">
                <PersonOutlineIcon />
                <span className="hidden laptop:inline">Увійти</span>
             </div>
          </div>
        </div>

        <nav className="w-full">
          <ul className={styles.categoryNav}>
            <li>
              <Link href="/articles" className={pathname === '/articles' ? "font-bold text-[#350846]" : "hover:text-[#350846]"}>
                Паперові книги
              </Link>
            </li>
            <li><Link href="/ebooks" className="hover:text-[#350846]">Електронні книги</Link></li>
            <li><Link href="/authors" className="hover:text-[#350846]">Автори</Link></li>
            
           
            <div className="w-px h-4 bg-slate-200 mx-2 hidden tablet:block"></div>
            
            <li>
              <Link href="/my-shelf" className="text-slate-500 hover:text-[#350846] flex items-center gap-1">
                Моя полиця <span className="hidden xs:inline"></span>
              </Link>
            </li>
            <li>
              <Link href="/read" className="text-slate-500 hover:text-[#350846] flex items-center gap-1">
                Прочитано  <span className="hidden xs:inline"></span>
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <main className="flex-1 bg-slate-50 p-4 tablet:p-8">
        {children}
      </main>
    </div>
  );
}