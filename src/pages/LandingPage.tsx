import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Zap, 
  Shield, 
  TrendingUp, 
  MapPin, 
  Play, 
  X, 
  Check, 
  Building2,
  Phone,
  MessageCircle,
  Award,
  Globe,
  Truck,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const LandingPage: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-[#F9FAFB] selection:bg-blue-600 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-2xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-12">
            <Link to="/" className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tighter flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-xl shadow-blue-500/20">
                <Zap size={20} className="text-white fill-white sm:hidden" />
                <Zap size={24} className="text-white fill-white hidden sm:block" />
              </div>
              NITRO
            </Link>
            <div className="hidden lg:flex items-center gap-8">
              <a href="#features" className="text-sm font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">{t.landing.features}</a>
              <a href="#b2b" className="text-sm font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">{t.landing.b2bSolutions}</a>
              <a href="#about" className="text-sm font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">{t.landing.about}</a>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitcher />
            <Link to="/login" className="text-xs sm:text-sm font-black text-gray-900 hover:text-blue-600 transition-colors uppercase tracking-widest px-2">
              {t.landing.login}
            </Link>
            <Link to="/login" className="bg-blue-600 text-white px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm shadow-xl shadow-blue-500/30 hover:bg-blue-700 hover:shadow-blue-500/40 hover:scale-105 transition-all active:scale-95 flex items-center gap-2">
              {t.landing.getStarted}
              <ArrowRight size={16} className="hidden sm:block" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-32 sm:pt-40 pb-20 sm:pb-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-6 sm:space-y-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest"
              >
                <Award size={14} />
                {t.landing.awardWinning}
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-gray-900 leading-[1] sm:leading-[0.9] tracking-tighter"
              >
                {t.landing.heroTitle} <br />
                <span className="text-blue-600">{t.landing.heroBatna}</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg sm:text-xl text-gray-500 font-medium max-w-lg leading-relaxed"
              >
                {t.landing.heroSubtitle}
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6"
              >
                <Link to="/login" className="group bg-blue-600 text-white px-8 sm:px-12 py-4 sm:py-6 rounded-2xl sm:rounded-[2rem] font-black text-lg sm:text-xl shadow-2xl shadow-blue-500/40 hover:bg-blue-700 hover:shadow-blue-500/60 hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-4">
                  {t.landing.getStarted}
                  <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
                </Link>
                <button 
                  onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white text-gray-900 px-8 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg shadow-xl shadow-gray-200/50 hover:bg-gray-50 transition-all active:scale-95 flex items-center justify-center gap-3 border border-gray-100"
                >
                  <Play size={24} className="fill-gray-900" />
                  {t.landing.watchDemo}
                </button>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-4 sm:gap-8 pt-10 border-t border-gray-100"
              >
                <div className="space-y-1">
                  <p className="text-2xl sm:text-3xl font-black text-gray-900">500+</p>
                  <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">{t.landing.activePartners}</p>
                </div>
                <div className="w-px h-10 bg-gray-100" />
                <div className="space-y-1">
                  <p className="text-2xl sm:text-3xl font-black text-gray-900">1M+</p>
                  <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">{t.landing.deliveries}</p>
                </div>
                <div className="w-px h-10 bg-gray-100" />
                <div className="space-y-1">
                  <p className="text-2xl sm:text-3xl font-black text-gray-900">99.9%</p>
                  <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">{t.landing.reliability}</p>
                </div>
              </motion.div>
            </div>

            <div className="relative hidden lg:block">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative z-10"
              >
                <div className="aspect-[4/5] bg-gray-900 rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white">
                  <img 
                    src="https://picsum.photos/seed/delivery/800/1000"
                    alt="Nitro Orders delivery in action"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-10 -right-10 bg-white p-6 rounded-[2rem] shadow-2xl border border-gray-100 z-20 flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                  <Check size={24} />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.landing.delivered}</p>
                  <p className="font-black text-gray-900">Package #2401</p>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute top-1/2 -left-20 bg-white p-6 rounded-[2rem] shadow-2xl border border-gray-100 z-20 flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.landing.liveTracking}</p>
                  <p className="font-black text-gray-900">{t.landing.batnaCenter}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50 -z-10 rounded-l-[10rem] hidden lg:block" />
      </header>

      {/* Demo Section */}
      <section id="demo" className="py-20 sm:py-32 bg-gray-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest border border-blue-500/20">
                <Play size={14} />
                {t.landing.demoSubtitle}
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
                {t.landing.demoTitle}
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 font-medium leading-relaxed">
                {t.landing.demoDesc}
              </p>
              
              <div className="space-y-6">
                {[
                  { title: t.landing.instantDispatch, desc: t.landing.instantDispatchDesc },
                  { title: t.landing.liveTrackingTitle, desc: t.landing.liveTrackingDesc },
                  { title: t.landing.smartRouting, desc: t.landing.smartRoutingDesc }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-blue-500 border border-white/10 shrink-0">
                      <Check size={20} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-white">{item.title}</h4>
                      <p className="text-gray-500 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex justify-center">
              {/* Mobile App Mockup */}
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                className="w-[280px] sm:w-[320px] h-[560px] sm:h-[640px] bg-black rounded-[2.5rem] sm:rounded-[3rem] border-[6px] sm:border-[8px] border-gray-800 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-5 sm:h-6 bg-gray-800 rounded-b-2xl z-20" />
                <div className="absolute inset-0 bg-white">
                  {/* Mock App UI */}
                  <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-lg" />
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-full" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 sm:h-4 bg-gray-100 rounded-full w-2/3" />
                      <div className="h-6 sm:h-8 bg-gray-900 rounded-lg sm:rounded-xl w-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <div className="h-20 sm:h-24 bg-blue-50 rounded-xl sm:rounded-2xl border border-blue-100" />
                      <div className="h-20 sm:h-24 bg-green-50 rounded-xl sm:rounded-2xl border border-green-100" />
                    </div>
                    <div className="h-32 sm:h-40 bg-gray-50 rounded-[1.5rem] sm:rounded-[2rem] border border-gray-100 relative overflow-hidden">
                      <div className="absolute inset-0 bg-blue-600/5" />
                      <motion.div 
                        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
                        transition={{ duration: 5, repeat: Infinity }}
                        className="absolute top-1/2 left-1/2 w-3 sm:w-4 h-3 sm:h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg" 
                      />
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      {[1, 2].map(i => (
                        <div key={i} className="h-12 sm:h-16 bg-white border border-gray-100 rounded-xl sm:rounded-2xl shadow-sm" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Decorative Glow */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-blue-600/20 rounded-full blur-[80px] sm:blur-[120px]" />
            </div>
          </div>
        </div>
      </section>

      {/* B2B Solutions / Features Section */}
      <section id="features" className="py-20 sm:py-32 bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-6 sm:space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest">
                <Building2 size={14} />
                {t.landing.b2bSolutions}
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight tracking-tight">
                {t.landing.b2bTitle}
              </h2>
              <p className="text-lg sm:text-xl text-gray-500 font-medium leading-relaxed">
                {t.landing.b2bDesc}
              </p>
              <div className="space-y-4">
                {[
                  t.landing.b2bFeature1,
                  t.landing.b2bFeature2,
                  t.landing.b2bFeature3,
                  t.landing.b2bFeature4
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                      <Check size={14} />
                    </div>
                    <span className="font-bold text-gray-700 text-sm sm:text-base">{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/login" className="inline-flex bg-blue-600 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95 items-center justify-center gap-3 w-full sm:w-auto">
                {t.landing.partnerWithUs}
                <ArrowRight size={24} />
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div className="aspect-square bg-blue-600 rounded-[2.5rem] sm:rounded-[4rem] overflow-hidden shadow-2xl shadow-blue-500/30">
                <img 
                  src="https://picsum.photos/seed/logistics/800/800"
                  alt="Business partners using Nitro Orders"
                  className="w-full h-full object-cover opacity-80 mix-blend-overlay"
                />
              </div>
              <div className="absolute -bottom-6 sm:-bottom-10 -left-6 sm:-left-10 bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-gray-100 space-y-4 max-w-[200px] sm:max-w-xs">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 sm:w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shrink-0">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.landing.efficiency}</p>
                    <p className="text-lg sm:text-xl font-black text-gray-900">+45%</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">{t.landing.efficiencyDesc}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Driver Section (About Our Courier Network) */}
      <section id="about" className="py-20 sm:py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="bg-gray-900 rounded-[2.5rem] sm:rounded-[4rem] p-8 sm:p-16 lg:p-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 shadow-2xl">
            <div className="flex-1 space-y-6 sm:space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest border border-blue-500/20">
                <Truck size={14} />
                {t.landing.joinAsDriver}
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
                {t.landing.driverTitle}
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 font-medium leading-relaxed">
                {t.landing.driverDesc}
              </p>
              <a 
                href="https://wa.me/213770388863" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex bg-blue-600 text-white px-8 sm:px-12 py-4 sm:py-6 rounded-xl sm:rounded-2xl font-black text-lg sm:text-xl shadow-2xl shadow-blue-500/40 hover:bg-blue-700 transition-all active:scale-95 items-center justify-center gap-4 w-full sm:w-auto group"
              >
                <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />
                {t.landing.whatsappJoin}
              </a>
            </div>
            <div className="w-full lg:w-1/3 aspect-[4/5] sm:aspect-square lg:aspect-[3/4] rounded-[2rem] sm:rounded-[3rem] overflow-hidden relative group">
              <img 
                src="https://picsum.photos/seed/courier/600/800"
                alt="Nitro Orders driver"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="bg-blue-600 rounded-[2.5rem] sm:rounded-[4rem] p-10 sm:p-20 text-center space-y-8 sm:space-y-10 relative overflow-hidden shadow-2xl shadow-blue-500/40">
            <div className="absolute top-0 left-0 w-full h-full bg-white/5 -z-10" />
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight max-w-3xl mx-auto leading-tight">
              {t.landing.readyToTransform}
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 font-medium max-w-2xl mx-auto">
              {t.landing.joinBusinesses}
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 sm:gap-6">
              <Link to="/login" className="bg-white text-blue-600 px-10 sm:px-12 py-4 sm:py-6 rounded-2xl sm:rounded-[2rem] font-black text-lg sm:text-xl shadow-2xl shadow-white/20 hover:bg-blue-50 hover:scale-105 transition-all active:scale-95">
                {t.landing.getStarted}
              </Link>
              <a 
                href="https://wa.me/213770388863" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-700 text-white px-10 sm:px-12 py-4 sm:py-6 rounded-xl sm:rounded-2xl font-black text-lg sm:text-xl shadow-2xl shadow-blue-800/20 hover:bg-blue-800 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <MessageCircle size={24} />
                {t.landing.talkToExpert}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Join as a Driver Section */}
      <section className="py-24 sm:py-32 bg-gray-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400 rounded-full blur-[120px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-black uppercase tracking-widest">
                <Users size={14} />
                {t.landing.joinAsDriver}
              </div>
              <h2 className="text-4xl sm:text-6xl font-black text-white leading-[1.1] tracking-tight">
                {t.landing.driverTitle}
              </h2>
              <p className="text-xl text-gray-400 font-medium leading-relaxed max-w-xl">
                {t.landing.driverDesc}
              </p>
              <div className="flex flex-wrap gap-6">
                <a 
                  href={`https://wa.me/213770388863?text=${encodeURIComponent(isRTL ? 'مرحباً نيترو، أود الانضمام كفريق توصيل.' : 'Hello Nitro, I would like to join as a delivery driver.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-2xl shadow-green-500/30 hover:bg-green-700 hover:scale-105 transition-all active:scale-95 flex items-center gap-3"
                >
                  <MessageCircle size={24} />
                  {t.landing.whatsappJoin}
                </a>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-blue-600 to-blue-400 rounded-[3rem] overflow-hidden shadow-2xl relative group">
                <img 
                  src="https://picsum.photos/seed/courier/800/800"
                  alt="Nitro Orders courier network" 
                  className="w-full h-full object-cover mix-blend-overlay opacity-50 group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl">
                    <Zap size={48} className="text-blue-600 fill-blue-600" />
                  </div>
                </div>
              </div>
              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 hidden sm:block">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Weekly Earnings</p>
                <p className="text-2xl font-black text-gray-900">Up to 15k DA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 sm:py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 sm:mb-20">
            <div className="space-y-6">
              <Link to="/" className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tighter flex items-center gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-xl shadow-blue-500/20">
                  <Zap size={20} className="text-white fill-white" />
                </div>
                NITRO
              </Link>
              <p className="text-gray-500 font-medium leading-relaxed">
                {t.landing.footerDesc}
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all">
                  <Globe size={20} />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all">
                  <MessageCircle size={20} />
                </a>
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">{t.landing.platform}</h4>
              <ul className="space-y-4">
                <li><a href="#features" className="text-gray-500 font-bold hover:text-blue-600 transition-colors">{t.landing.features}</a></li>
                <li><a href="#b2b" className="text-gray-500 font-bold hover:text-blue-600 transition-colors">{t.landing.b2bSolutions}</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">{t.landing.company}</h4>
              <ul className="space-y-4">
                <li><a href="#about" className="text-gray-500 font-bold hover:text-blue-600 transition-colors">{t.landing.about}</a></li>
                <li><a href="#" className="text-gray-500 font-bold hover:text-blue-600 transition-colors">{t.landing.contact}</a></li>
                <li><a href="#" className="text-gray-500 font-bold hover:text-blue-600 transition-colors">{t.landing.careers}</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">{t.landing.contact}</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-gray-500 font-bold">
                  <Phone size={18} className="text-blue-600 shrink-0" />
                  <a href={`tel:${t.landing.phone.replace(/\s/g, '')}`} dir="ltr" className="hover:text-blue-600 transition-colors inline-block">{t.landing.phone}</a>
                </li>
                <li className="flex items-center gap-3 text-gray-500 font-bold">
                  <Globe size={18} className="text-blue-600 shrink-0" />
                  <a href={`mailto:${t.landing.email}`} dir="ltr" className="hover:text-blue-600 transition-colors inline-block">{t.landing.email}</a>
                </li>
                <li className="flex items-center gap-3 text-gray-500 font-bold">
                  <MapPin size={18} className="text-blue-600 shrink-0" />
                  {t.landing.address}
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm font-bold text-gray-400">{t.landing.rights}</p>
            <div className="flex items-center gap-8">
              <a href="#" className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors">{t.landing.privacy}</a>
              <a href="#" className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors">{t.landing.terms}</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Demo Modal */}
      <AnimatePresence>
        {showDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-5xl aspect-video bg-gray-900 rounded-[3rem] overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={() => setShowDemo(false)}
                className="absolute top-6 right-6 z-10 bg-white/10 text-white p-3 rounded-2xl hover:bg-white/20 transition-all"
              >
                <X size={32} />
              </button>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                    <Play size={48} className="text-white fill-white ml-2" />
                  </div>
                  <h3 className="text-3xl font-black text-white">Nitro Platform Demo</h3>
                  <p className="text-gray-400 font-medium">Coming soon to your screens.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
