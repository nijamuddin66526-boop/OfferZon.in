
import React, { useState, useEffect } from 'react';
import { Zap, Timer, Flame } from 'lucide-react';

const Hero: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      const diff = endOfDay.getTime() - now.getTime();
      
      setTimeLeft({
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-red-600 text-white py-12 px-4">
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-orange-400 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-red-400 rounded-full opacity-20 blur-3xl"></div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
        <div className="flex-1 text-center md:text-left space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/30 text-sm font-bold tracking-wide uppercase">
            <Flame size={16} className="text-orange-200 fill-orange-200" />
            Mega Loot Hour is Live!
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-[1.1] tracking-tight">
            Top Loot Deals of <br /> the <span className="text-orange-200 italic underline decoration-wavy underline-offset-8">Day!</span>
          </h1>
          <p className="text-lg md:text-xl text-orange-50 font-medium max-w-xl">
            Grab exclusive offers with up to 90% discount before they expire. Valid for limited time only!
          </p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <button className="bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center gap-2">
              <Zap size={20} className="fill-orange-600" />
              Explore Hot Deals
            </button>
            <div className="flex items-center gap-3 bg-black/30 backdrop-blur-md px-6 py-4 rounded-full border border-white/10">
              <Timer size={22} className="text-orange-200" />
              <div className="flex gap-2 font-mono text-2xl font-bold">
                <span className="bg-white/10 px-2 rounded">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span>:</span>
                <span className="bg-white/10 px-2 rounded">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span>:</span>
                <span className="bg-white/10 px-2 rounded">{String(timeLeft.seconds).padStart(2, '0')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/3 flex justify-center">
            <div className="relative group">
                <div className="absolute inset-0 bg-white rounded-2xl rotate-3 group-hover:rotate-6 transition-transform blur-sm opacity-10"></div>
                <div className="bg-white p-6 rounded-2xl shadow-2xl relative overflow-hidden max-w-sm">
                    <div className="bg-orange-600 text-white text-[10px] font-bold px-3 py-1 rounded absolute top-4 right-4 z-10">LOOT ALERT</div>
                    <img src="https://picsum.photos/seed/loot/400/400" alt="Featured Deal" className="w-full h-48 object-cover rounded-xl mb-4" />
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-orange-600">AMAZON</span>
                            <span className="text-xs text-gray-500">Expiring in 2h</span>
                        </div>
                        <h3 className="text-gray-900 font-bold text-lg line-clamp-1">Premium Wireless Audio Set</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-orange-600">₹999</span>
                            <span className="text-sm text-gray-400 line-through">₹4,999</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
