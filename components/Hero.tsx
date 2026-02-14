
import React, { useState, useEffect } from 'react';
import { Zap, Timer, Flame, ChevronRight } from 'lucide-react';
import { Deal } from '../types';

interface HeroProps {
  featuredDeal?: Deal;
}

const Hero: React.FC<HeroProps> = ({ featuredDeal }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      const diff = endOfDay.getTime() - now.getTime();
      
      setTimeLeft({
        hours: Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24)),
        minutes: Math.max(0, Math.floor((diff / 1000 / 60) % 60)),
        seconds: Math.max(0, Math.floor((diff / 1000) % 60))
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-slate-900 text-white py-12 px-4 md:py-20">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-slate-900 to-red-600/10"></div>
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[600px] h-[600px] bg-orange-600 rounded-full opacity-10 blur-[120px]"></div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
        <div className="flex-1 text-center md:text-left space-y-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs font-black tracking-widest uppercase">
            <Flame size={16} className="text-orange-500 fill-orange-500 animate-pulse" />
            Mega Loot Hour is Live!
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter">
            Grab Top <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Loot Deals</span> 
            <br />Today!
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 font-medium max-w-xl leading-relaxed">
            Exclusive price drops with up to <span className="text-white font-bold">90% discount</span>. Valid for a limited time! Join 50k+ shoppers saving money today.
          </p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <button 
              onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
              className="bg-orange-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-orange-500 hover:shadow-[0_0_30px_rgba(234,88,12,0.4)] transition-all transform hover:-translate-y-1 flex items-center gap-2"
            >
              <Zap size={22} className="fill-white" />
              Explore All Loots
            </button>
            
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/10">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest flex items-center gap-1">
                  <Timer size={12} /> Ends In
                </span>
                <div className="flex gap-2 font-mono text-2xl font-black">
                  <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="animate-pulse text-white/30">:</span>
                  <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="animate-pulse text-white/30">:</span>
                  <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Deal Card */}
        <div className="w-full md:w-5/12 max-w-md">
            <div className="relative group perspective">
                <div className="absolute -inset-2 bg-gradient-to-r from-orange-600 to-red-600 rounded-[2.5rem] opacity-20 blur-xl group-hover:opacity-40 transition-opacity"></div>
                <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden transition-all duration-500 hover:scale-[1.02]">
                    <div className="bg-orange-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full absolute top-6 right-6 z-10 shadow-lg">LOOT ALERT</div>
                    
                    <div className="relative aspect-square mb-6 overflow-hidden rounded-3xl bg-slate-50">
                        <img 
                          src={featuredDeal?.imageUrl || 'https://picsum.photos/seed/loot/600/600'} 
                          alt="Featured Deal" 
                          className="w-full h-full object-contain" 
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <span className="text-xs font-black text-orange-600 tracking-widest uppercase">{featuredDeal?.store || 'DEAL OF DAY'}</span>
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md uppercase">Verify Price</span>
                        </div>
                        <h3 className="text-slate-900 font-black text-2xl line-clamp-1">
                          {featuredDeal?.title || 'Loading Mega Deal...'}
                        </h3>
                        <div className="flex items-end justify-between">
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-slate-900">₹{featuredDeal?.dealPrice.toLocaleString('en-IN')}</span>
                                <span className="text-lg text-slate-300 line-through font-bold">₹{featuredDeal?.originalPrice.toLocaleString('en-IN')}</span>
                            </div>
                            <a 
                              href={featuredDeal?.affiliateUrl || '#'} 
                              target="_blank"
                              className="bg-slate-900 text-white p-3 rounded-2xl hover:bg-orange-600 transition-colors"
                            >
                              <ChevronRight />
                            </a>
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
