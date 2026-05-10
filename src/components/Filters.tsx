'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

const genres = [
  'Трилер', 'Фантастика', 'Магічний реалізм', 
  'Есеїстика', 'Роман', 'Психологія', 
  'Філософія', 'Класика', 'Дитячі', 
  'Темне фентезі', 'Готичне фентезі', 'Фентезі'
];

const languages = [
  { label: 'Українська', value: 'Українська' }, 
  { label: 'Англійська', value: 'Англійська' }  
];

export default function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentCategory = searchParams.get('category');
  const currentLang = searchParams.get('lang');

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (params.get(key) === value) {
      params.delete(key); 
    } else {
      params.set(key, value);
    }
    
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-10">
      <div>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Жанри</h3>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => updateFilter('category', genre)}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border ${
                currentCategory === genre
                  ? 'bg-[#350846] text-white border-[#350846] shadow-lg scale-105'
                  : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300 hover:text-slate-700'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Мова видання</h3>
        <div className="space-y-2">
          {languages.map((lang) => (
            <div 
              key={lang.value}
              onClick={() => updateFilter('lang', lang.value)}
              className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border ${
                currentLang === lang.value 
                  ? 'bg-slate-50 border-slate-200' 
                  : 'border-transparent hover:bg-slate-50'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${currentLang === lang.value ? 'border-[#350846]' : 'border-slate-300'}`}>
                {currentLang === lang.value && <div className="w-1.5 h-1.5 bg-[#350846] rounded-full"></div>}
              </div>
              <span className={`text-[11px] font-black uppercase tracking-tight ${currentLang === lang.value ? 'text-slate-900' : 'text-slate-400'}`}>
                {lang.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {(currentCategory || currentLang) && (
        <button 
          onClick={() => router.push(pathname)}
          className="w-full py-3 text-[9px] font-black uppercase text-slate-300 hover:text-red-400 transition-colors tracking-[0.2em]"
        >
          ✕ Скинути всі фільтри
        </button>
      )}
    </div>
  );
}