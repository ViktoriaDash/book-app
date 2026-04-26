'use client';
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const [formData, setFormData] = useState({ name: "", phone: "", age: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        phone: (session.user as any).phone || "",
        age: (session.user as any).age || ""
      });
    }
  }, [session]);

    const handleSave = async () => {
    setLoading(true);
    try {
        const res = await fetch("/api/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        });

        if (res.ok) {
        setIsEditing(false);
        alert("Дані успішно збережено!");
        window.location.reload(); 
        } else {
        const data = await res.json();
        alert("Помилка: " + data.error);
        }
    } catch (e) {
        alert("Сталася помилка при відправці запиту");
    }
    setLoading(false);
    };

  if (status === "loading") return <div className="p-10 text-center">Завантаження...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-sm border border-slate-100 font-sans">
      <h1 className="text-2xl font-black text-[#350846] mb-8 uppercase tracking-tight">Налаштування профілю</h1>
      
      <div className="space-y-5">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ім'я</label>
          {isEditing ? (
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl" />
          ) : (
            <p className="p-3 bg-slate-50 rounded-xl font-bold">{formData.name || "Не вказано"}</p>
          )}
        </div>

        <div>
          <label className="block text-[10px] font-red text-slate-400 uppercase tracking-widest mb-1">Телефон</label>
          {isEditing ? (
            <input type="text" placeholder="+380..." value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl" />
          ) : (
            <p className="p-3 bg-slate-50 rounded-xl font-bold">{formData.phone || "Додати номер"}</p>
          )}
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Вік</label>
          {isEditing ? (
            <input type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl" />
          ) : (
            <p className="p-3 bg-slate-50 rounded-xl font-bold">{formData.age || "Не вказано"}</p>
          )}
        </div>

        <div className="pt-6 flex gap-4">
          {isEditing ? (
            <>
              <button onClick={handleSave} disabled={loading} className="bg-[#3b3a6e] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#350846] transition-all">
                {loading ? "Збереження..." : "Зберегти"}
              </button>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 font-bold">Скасувати</button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="border-2 border-[#3b3a6e] text-[#3b3a6e] px-8 py-3 rounded-xl font-bold hover:bg-[#3b3a6e] hover:text-white transition-all">
              Редагувати профіль
            </button>
          )}
        </div>
      </div>
    </div>
  );
}