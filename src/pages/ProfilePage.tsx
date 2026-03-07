import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Phone, Mail, Building2, Save, CheckCircle2, Plus } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { t } = useLanguage();
  const { businessProfile, updateBusinessProfile, userRole } = useAuth();
  const [formData, setFormData] = useState({
    name: businessProfile.name,
    phone: businessProfile.phone,
    email: businessProfile.email,
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateBusinessProfile(formData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">{t.profile.title}</h1>
          <p className="text-gray-500 font-medium">{t.profile.subtitle}</p>
        </div>
        {userRole === 'business' && (
          <button onClick={() => window.dispatchEvent(new CustomEvent('open-create-delivery'))}
            className="flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95">
            <Plus size={20} />{t.nav.create}
          </button>
        )}
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-10 space-y-12">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative group">
              <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 border-gray-50 shadow-xl">
                <img src={businessProfile.photo_url || 'https://picsum.photos/seed/business/200/200'} alt="Business"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
              </div>
              <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-3 rounded-2xl shadow-xl hover:bg-blue-700 transition-all active:scale-95">
                <Camera size={20} />
              </button>
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t.profile.changePhoto}</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{t.profile.businessName}</label>
              <div className="relative group">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-50 border-2 border-gray-50 px-12 py-4 rounded-2xl focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-gray-900" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{t.profile.phone}</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input type="tel" value={formData.phone} dir="ltr" onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-gray-50 border-2 border-gray-50 px-12 py-4 rounded-2xl focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-gray-900 text-left" />
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{t.profile.email}</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input type="email" value={formData.email} readOnly
                  className="w-full bg-gray-50 border-2 border-gray-50 px-12 py-4 rounded-2xl outline-none font-bold text-gray-400 cursor-not-allowed" />
              </div>
              <p className="text-xs text-gray-400 font-medium ml-1">Email cannot be changed. Contact admin.</p>
            </div>
            <div className="md:col-span-2 pt-6">
              <button type="submit" disabled={isSaving}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-60">
                <Save size={24} />
                {isSaving ? 'Saving...' : t.profile.update}
              </button>
            </div>
          </form>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-black">
            <CheckCircle2 size={24} />{t.profile.success}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;
