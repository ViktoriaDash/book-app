'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

const genres = ['Трилер', 'Фантастика', 'Магічний реалізм', 'Есеїстика', 'Роман', 'Психологія', 'Філософія', 'Класика', 'Дитячі', 'Темне фентезі', 'Готичне фентезі', 'Фентезі'];

export default function EditBookPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    language: '',
    image_url: '',
    description: '',
    is_ebook: false
  });

  useEffect(() => {
  const fetchBook = async () => {
    try {
      const res = await fetch(`/api/books/${params.id}`);
      if (!res.ok) throw new Error('Не вдалося завантажити дані');
      
      const data = await res.json();
      setFormData(data);
    } catch (err) {
      console.error("Помилка завантаження:", err);
    }
  };

  if (params.id) {
    fetchBook();
  }
}, [params.id]);

  const isAdmin = (session?.user as any)?.role === 'admin';
  if (session && !isAdmin) {
    router.push('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/books/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('Дані книги оновлено! ✨');
        router.back();
      }
    } catch (err) {
      alert('Помилка при оновленні');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 p-8 md:p-12">
        <h1 className="text-3xl font-black text-[#350846] mb-10 uppercase tracking-tighter">Редагування книги</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <input 
                required
                value={formData.title || ''} 
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold"
                placeholder="Назва"
                />
                <input 
                required
                value={formData.image_url || ''} 
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold"
                placeholder="URL обкладинки"
                />
            <input 
              required
              value={formData.author}
              onChange={(e) => setFormData({...formData, author: e.target.value})}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold"
              placeholder="Автор"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none"
            >
              {genres.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <select 
              value={formData.language}
              onChange={(e) => setFormData({...formData, language: e.target.value})}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none"
            >
              <option value="Українська">Українська</option>
              <option value="Англійська">Англійська</option>
            </select>
          </div>

          <input 
            required
            value={formData.image_url}
            onChange={(e) => setFormData({...formData, image_url: e.target.value})}
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold"
            placeholder="URL обкладинки"
          />

          <textarea 
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none italic"
            placeholder="Опис..."
          />

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#3b3a6e] text-white py-5 rounded-[20px] font-black uppercase text-[10px] tracking-widest hover:bg-[#350846] transition-all shadow-xl"
          >
            {loading ? 'Збереження...' : 'Оновити інформацію'}
          </button>
        </form>
      </div>
    </div>
  );
}