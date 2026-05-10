'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

const genres = ['Трилер', 'Фантастика', 'Магічний реалізм', 'Есеїстика', 'Роман', 'Психологія', 'Філософія', 'Класика', 'Дитячі', 'Темне фентезі', 'Готичне фентезі', 'Фентезі'];

export default function CreateArticlePage() {
  const router = useRouter();
  const { data: session } = useSession();
  
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Фентезі',
    language: 'Українська',
    description: '',
    is_ebook: false
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Оберіть обкладинку!");
    
    setLoading(true);

    try {
      const fileData = new FormData();
      fileData.append('file', file);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: fileData,
      });

      const { url: imageUrl } = await uploadRes.json();

      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, image_url: imageUrl }),
      });

      if (res.ok) {
        alert('Книгу успішно додано! ✨');
        router.push(formData.is_ebook ? '/ebooks' : '/articles');
      }
    } catch (err) {
      alert('Помилка при завантаженні');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 p-8 md:p-12">
        <h1 className="text-3xl font-black text-[#350846] mb-10 uppercase tracking-tighter">Нова книга</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[32px] p-8 bg-slate-50 transition-all hover:bg-slate-100/50">
            {preview ? (
              <div className="relative w-40 h-56 mb-4 shadow-2xl rounded-xl overflow-hidden">
                <Image src={preview} alt="Preview" fill className="object-cover" />
                <button 
                  type="button" 
                  onClick={() => {setFile(null); setPreview(null);}}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-[10px] font-bold"
                >✕</button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Обкладинка книги</p>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="hidden" 
                  id="file-upload" 
                />
                <label 
                  htmlFor="file-upload" 
                  className="cursor-pointer bg-[#3b3a6e] text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#350846] transition-all inline-block"
                >
                  Обрати файл
                </label>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input 
              required
              placeholder="Назва книги"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold"
            />
            <input 
              required
              placeholder="Автор"
              value={formData.author}
              onChange={(e) => setFormData({...formData, author: e.target.value})}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none cursor-pointer"
            >
              {genres.map(g => <option key={g} value={g}>{g}</option>)}
            </select>

            <select 
              value={formData.language}
              onChange={(e) => setFormData({...formData, language: e.target.value})}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none cursor-pointer"
            >
              <option value="Українська">Українська</option>
              <option value="Англійська">Англійська</option>
            </select>
          </div>

          <textarea 
            required
            placeholder="Опис книги..."
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none italic"
          />

          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={formData.is_ebook}
              onChange={(e) => setFormData({...formData, is_ebook: e.target.checked})}
              className="w-5 h-5 accent-[#3b3a6e]"
            />
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Це електронна книга</span>
          </label>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#3b3a6e] text-white py-5 rounded-[20px] font-black uppercase text-[10px] tracking-widest hover:bg-[#350846] transition-all shadow-xl active:scale-95"
          >
            {loading ? 'Завантаження...' : 'Додати книгу в каталог'}
          </button>
        </form>
      </div>
    </div>
  );
}