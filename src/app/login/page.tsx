'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError('Невірний email або пароль');
    } else {
      router.push('/'); 
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 font-sans">
      <div className="bg-[#1e293b] p-8 rounded-3xl shadow-2xl w-full max-w-md border border-slate-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Вхід у TrueLove</h1>
          <p className="text-slate-400 text-xs mt-2 uppercase font-bold tracking-widest">Твоя бібліотека чекає</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] uppercase font-bold p-3 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1 ml-1">Електронна пошта</label>
            <input 
              type="email" 
              required 
              className="w-full bg-white border border-slate-700 rounded-xl p-3 text-slate-900 font-bold focus:outline-none focus:border-blue-500 transition-all"
              placeholder="example@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1 ml-1">Пароль</label>
            <input 
              type="password" 
              required 
              className="w-full bg-white border border-slate-700 rounded-xl p-3 text-slate-900 font-bold focus:outline-none focus:border-blue-500 transition-all"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest p-4 rounded-xl mt-4 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
          >
            Увійти
          </button>
        </form>

        <div className="mt-8">
          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-slate-700 w-full"></div>
            <span className="bg-[#1e293b] px-3 text-slate-500 text-[10px] font-bold uppercase absolute">Або зайти через</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => signIn('github', { callbackUrl: '/' })}
              className="flex items-center justify-center gap-2 bg-[#0f172a] hover:bg-slate-900 text-white p-3 rounded-xl border border-slate-700 transition-all"
            >
              <span className="text-xs font-bold uppercase">GitHub</span>
            </button>
            <button 
              onClick={() => signIn('google', { callbackUrl: '/' })}
              className="flex items-center justify-center gap-2 bg-[#0f172a] hover:bg-slate-900 text-white p-3 rounded-xl border border-slate-700 transition-all"
            >
              <span className="text-xs font-bold uppercase">Google</span>
            </button>
          </div>
        </div>

        <p className="text-center text-slate-400 text-xs mt-8 font-medium">
          Ще немає акаунту?{' '}
          <Link href="/register" className="text-blue-400 font-bold hover:underline">
            Зареєструватися
          </Link>
        </p>
      </div>
    </div>
  );
}