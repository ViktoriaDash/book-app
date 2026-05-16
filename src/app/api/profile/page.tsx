'use client';
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState({ email: "", phone: "", name: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = session?.user;
    
    if (user) {
      const timer = setTimeout(() => {
        setFormData({
          name: user.name || "",
          email: user.email || "",
          phone: (user as any).phone || ""
        });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [session]);

  const handleSave = async () => {
    if (!session?.user) return;

    setErrors({ email: "", phone: "", name: "" });
    let hasError = false;

    if (!formData.name.trim()) {
      setErrors(prev => ({ ...prev, name: "Ім'я не може бути порожнім" }));
      hasError = true;
    }

    if (!formData.phone.trim()) {
      setErrors(prev => ({ ...prev, phone: "Номер телефону обов'язковий" }));
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    try {
      const res = await fetch("/api/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {

        await update({ ...session, user: { ...session.user, ...formData } });
        setIsEditing(false);
        alert("Профіль оновлено! ✨");
      } else {
        const data = await res.json();
        alert(data.error || "Помилка оновлення");
      }
    } catch (e) {
      alert("Сталася помилка");
    }
    setLoading(false);
  };

  if (status === "loading") return <div className="p-10 text-center uppercase font-black text-slate-400">Синхронізація...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-[40px] shadow-sm border border-slate-100 font-sans">
      <h1 className="text-3xl font-black text-[#350846] mb-10 uppercase tracking-tighter">Мій кабінет</h1>
      
      <div className="space-y-8">

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ваше ім'я</label>
          {isEditing ? (
            <input 
              type="text" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 ring-purple-100 outline-none transition-all"
            />
          ) : (
            <p className="p-4 bg-slate-50 rounded-2xl font-bold">{formData.name}</p>
          )}
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Електронна пошта</label>
          {isEditing ? (
            <input 
              type="email" 
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl"
            />
          ) : (
            <p className="p-4 bg-slate-50 rounded-2xl font-bold">{formData.email}</p>
          )}
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Контактний телефон *</label>
          {isEditing ? (
            <>
              <input 
                type="text" 
                placeholder="+380..." 
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                className={`w-full p-4 bg-slate-50 border rounded-2xl transition-all ${errors.phone ? 'border-red-400' : 'border-slate-100'}`}
              />
              {errors.phone && <p className="text-[9px] text-red-500 mt-2 font-black uppercase tracking-widest ml-2">{errors.phone}</p>}
            </>
          ) : (
            <p className="p-4 bg-slate-50 rounded-2xl font-bold">{formData.phone}</p>
          )}
        </div>

        <div className="pt-6 flex gap-4">
          {isEditing ? (
            <>
              <button onClick={handleSave} disabled={loading} className="bg-[#3b3a6e] text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#350846] transition-all shadow-lg active:scale-95">
                {loading ? "Зберігаємо..." : "Зберегти"}
              </button>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-600 transition-colors">Скасувати</button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="border-2 border-[#3b3a6e] text-[#3b3a6e] px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#3b3a6e] hover:text-white transition-all shadow-sm">
              Редагувати профіль
            </button>
          )}
        </div>
      </div>
    </div>
  );
}