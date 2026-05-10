'use client';
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function SecurityPage() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (formData.newPassword !== formData.confirmPassword) {
      return setMessage({ text: "Нові паролі не збігаються", type: "error" });
    }

    if (formData.newPassword.length < 6) {
      return setMessage({ text: "Пароль має бути не менше 6 символів", type: "error" });
    }

    setLoading(true);
    try {
      const res = await fetch("/api/profile/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: "Пароль успішно змінено! ✨", type: "success" });
        setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setMessage({ text: data.error, type: "error" });
      }
    } catch (e) {
      setMessage({ text: "Сталася помилка при оновленні", type: "error" });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-[40px] shadow-sm border border-slate-100 font-sans">
      <h1 className="text-3xl font-black text-[#350846] mb-2 uppercase tracking-tighter">Безпека</h1>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-10">Керування доступом до акаунту</p>

      <form onSubmit={handleUpdatePassword} className="space-y-6">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Поточний пароль</label>
          <input 
            type="password" 
            required
            value={formData.currentPassword}
            onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-purple-50 transition-all" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Новий пароль</label>
            <input 
              type="password" 
              required
              value={formData.newPassword}
              onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-purple-50 transition-all" 
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Підтвердження</label>
            <input 
              type="password" 
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-purple-50 transition-all" 
            />
          </div>
        </div>

        {message.text && (
          <div className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
            {message.text}
          </div>
        )}

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full md:w-auto bg-[#3b3a6e] text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#350846] shadow-lg transition-all active:scale-95"
          >
            {loading ? "Оновлюємо..." : "Оновити пароль"}
          </button>
        </div>
      </form>
    </div>
  );
}