'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '+380', age: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Сталася помилка при реєстрації');
    } else {
      alert("Реєстрація успішна! Тепер увійдіть.");
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 font-sans">
      <div className="bg-[#1e293b] p-8 rounded-3xl shadow-2xl w-full max-w-md border border-slate-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Реєстрація</h1>
          <p className="text-slate-400 text-xs mt-2 uppercase font-bold tracking-widest">Приєднуйся до TrueLove</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] uppercase font-bold p-3 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1 ml-1">Ім'я</label>
            <input 
              type="text" 
              required 
              className="w-full bg-white border border-slate-700 rounded-xl p-3 text-slate-900 font-bold focus:outline-none focus:border-blue-500 transition-all"
              placeholder="Твоє ім'я"
              onChange={(e) => setForm({...form, name: e.target.value})}
            />
          </div>

          <div>
            <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1 ml-1">Email</label>
            <input 
              type="email" 
              required 
              className="w-full bg-white border border-slate-700 rounded-xl p-3 text-slate-900 font-bold focus:outline-none focus:border-blue-500 transition-all"
              placeholder="example@gmail.com"
              onChange={(e) => setForm({...form, email: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1 ml-1">Телефон</label>
              <input 
                type="text" 
                required 
                value={form.phone}
                className="w-full bg-white border border-slate-700 rounded-xl p-3 text-slate-900 font-bold focus:outline-none focus:border-blue-500 transition-all"
                onChange={(e) => setForm({...form, phone: e.target.value})}
              />
            </div>
            <div>
              <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1 ml-1">Вік</label>
              <input 
                type="number" 
                required 
                className="w-full bg-white border border-slate-700 rounded-xl p-3 text-slate-900 font-bold focus:outline-none focus:border-blue-500 transition-all"
                placeholder="20"
                onChange={(e) => setForm({...form, age: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 text-[10px] uppercase font-bold block mb-1 ml-1">Пароль</label>
            <input 
              type="password" 
              required 
              className="w-full bg-white border border-slate-700 rounded-xl p-3 text-slate-900 font-bold focus:outline-none focus:border-blue-500 transition-all"
              placeholder="••••••••"
              onChange={(e) => setForm({...form, password: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-green-600 hover:bg-green-500 text-white font-black uppercase tracking-widest p-4 rounded-xl mt-4 transition-all active:scale-95 shadow-lg"
          >
            Зареєструватися
          </button>
        </form>

        <p className="text-center text-slate-400 text-xs mt-8 font-medium">
          Вже маєш акаунт?{' '}
          <Link href="/login" className="text-blue-400 font-bold hover:underline">
            Увійти
          </Link>
        </p>
      </div>
    </div>
  );
}