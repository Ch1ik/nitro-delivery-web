import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { motion } from 'motion/react';
import { ArrowRight, Lock, Mail, ShieldCheck, Sparkles, AlertCircle, MapPin, Globe, FileText } from 'lucide-react';
import { cn } from '../lib/utils';

const LoginPage: React.FC = () => {
  const { login, submitSignupRequest } = useAuth();
  const { t, language } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPasswordConfirm, setSignupPasswordConfirm] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      if (isLogin) {
        await login(email.trim(), password);
      } else {
        if (signupPassword.length < 6) {
          setError('Password must be at least 6 characters');
          return;
        }
        if (signupPassword !== signupPasswordConfirm) {
          setError('Passwords do not match');
          return;
        }
        await submitSignupRequest({ businessName, email, phone, password: signupPassword, address, description, website });
        setRequestSent(true);
        setTimeout(() => { setIsLogin(true); setRequestSent(false); setSignupPassword(''); setSignupPasswordConfirm(''); }, 4000);
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isRTL = language === 'ar';

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row overflow-hidden">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-blue-600 relative items-center justify-center p-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800" />
        <motion.div animate={{ scale: [1,1.2,1], rotate: [0,90,0] }} transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-1/4 -left-1/4 w-3/4 h-3/4 bg-white/5 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-10 max-w-md">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="space-y-5">
            <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center shadow-2xl">
              <span className="text-blue-600 font-black text-3xl italic">N</span>
            </div>
            <h1 className="text-5xl font-black text-white leading-tight tracking-tighter">
              {t.login.heroTitle}<br/><span className="text-blue-200">{t.login.heroSubtitle}</span>
            </h1>
            <p className="text-blue-100 text-lg font-medium leading-relaxed">{t.login.heroDesc}</p>
          </motion.div>
          <div className="grid grid-cols-2 gap-4">
            {[{ label: t.login.secure, icon: ShieldCheck }, { label: t.login.fast, icon: Sparkles }].map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl space-y-2">
                <item.icon className="text-blue-200" size={22} />
                <p className="text-white font-black uppercase text-[10px] tracking-widest">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 overflow-y-auto">
        <div className="absolute top-6 right-6"><LanguageSwitcher /></div>
        <motion.div initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} className="w-full max-w-md space-y-7">
          <div className="space-y-1 text-center lg:text-left">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              {isLogin ? t.login.title : t.login.requestAccess}
            </h2>
            <p className="text-gray-500 font-medium text-sm">
              {isLogin ? t.login.subtitle : 'Fill in your business details. We review every request.'}
            </p>
          </div>

          {requestSent ? (
            <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
              className="bg-green-50 border border-green-100 p-8 rounded-[2rem] text-center space-y-4">
              <div className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-black text-green-900">{t.login.requestSent}</h3>
              <p className="text-green-700 font-medium text-sm">{t.login.requestSentDesc}</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl font-bold text-sm">
                  <AlertCircle size={16} />{error}
                </div>
              )}

              {/* Signup fields */}
              {!isLogin && (
                <>
                  <Field label={t.login.businessName}>
                    <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} required
                      className="field-input" placeholder="Your business name" />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Phone *">
                      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required dir="ltr"
                        className="field-input" placeholder="0770 00 00 00" />
                    </Field>
                    <Field label="Website">
                      <input type="url" value={website} onChange={e => setWebsite(e.target.value)}
                        className="field-input" placeholder="https://..." />
                    </Field>
                  </div>
                  <Field label="Business Address">
                    <div className="relative">
                      <MapPin className={cn("absolute top-1/2 -translate-y-1/2 text-gray-400", isRTL ? "right-4" : "left-4")} size={16} />
                      <input type="text" value={address} onChange={e => setAddress(e.target.value)}
                        className={cn("field-input", isRTL ? "pr-10" : "pl-10")} placeholder="Rue 19 Mai, Batna..." />
                    </div>
                  </Field>
                  <Field label="About Your Business">
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
                      className="w-full bg-gray-50 border-2 border-gray-50 px-4 py-3 rounded-2xl focus:bg-white focus:border-blue-600 outline-none font-bold text-gray-900 text-sm resize-none"
                      placeholder="Describe your business, estimated daily deliveries, type of products..." />
                  </Field>
                  <Field label="Password (to log in after approval) *">
                    <div className="relative group">
                      <Lock className={cn("absolute top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors", isRTL ? "right-4" : "left-4")} size={16} />
                      <input type="password" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} required minLength={6}
                        className={cn("field-input", isRTL ? "pr-10 pl-4" : "pl-10 pr-4")}
                        placeholder="At least 6 characters" />
                    </div>
                  </Field>
                  <Field label="Confirm password *">
                    <div className="relative group">
                      <Lock className={cn("absolute top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors", isRTL ? "right-4" : "left-4")} size={16} />
                      <input type="password" value={signupPasswordConfirm} onChange={e => setSignupPasswordConfirm(e.target.value)} required minLength={6}
                        className={cn("field-input", isRTL ? "pr-10 pl-4" : "pl-10 pr-4")}
                        placeholder="Repeat password" />
                    </div>
                  </Field>
                </>
              )}

              {/* Email */}
              <Field label={t.login.email}>
                <div className="relative group">
                  <Mail className={cn("absolute top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors", isRTL ? "right-4" : "left-4")} size={16} />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required dir="ltr"
                    className={cn("w-full bg-gray-50 border-2 border-gray-50 py-4 rounded-2xl focus:bg-white focus:border-blue-600 outline-none font-bold text-gray-900 placeholder:text-gray-300", isRTL ? "pr-10 pl-4 text-right" : "pl-10 pr-4")}
                    placeholder="name@company.com" />
                </div>
              </Field>

              {/* Password (login only) */}
              {isLogin && (
                <Field label={t.login.password}>
                  <div className="relative group">
                    <Lock className={cn("absolute top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors", isRTL ? "right-4" : "left-4")} size={16} />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                      className={cn("w-full bg-gray-50 border-2 border-gray-50 py-4 rounded-2xl focus:bg-white focus:border-blue-600 outline-none font-bold text-gray-900 placeholder:text-gray-300", isRTL ? "pr-10 pl-4" : "pl-10 pr-4")}
                      placeholder="••••••••" />
                  </div>
                </Field>
              )}

              <button type="submit" disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-black py-4 rounded-2xl shadow-2xl shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 text-base group mt-2">
                {isSubmitting ? 'Please wait...' : (isLogin ? t.login.submit : t.login.submitRequest)}
                {!isSubmitting && <ArrowRight size={20} className={cn("transition-transform", isRTL ? "group-hover:-translate-x-1 rotate-180" : "group-hover:translate-x-1")} />}
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-gray-100 text-center">
            <p className="text-sm font-bold text-gray-400">
              {isLogin ? t.login.noAccount : t.login.hasAccount}
              <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-blue-600 hover:underline ml-1">
                {isLogin ? t.login.requestAccess : t.login.login}
              </button>
            </p>
          </div>
        </motion.div>
      </div>

      <style>{`
        .field-input { width:100%; background:#F9FAFB; border:2px solid #F9FAFB; padding:14px 16px; border-radius:16px; font-weight:700; color:#111827; outline:none; transition:all .2s; font-size:14px; }
        .field-input:focus { background:white; border-color:#2563EB; }
      `}</style>
    </div>
  );
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-0.5">{label}</label>
    {children}
  </div>
);

export default LoginPage;
