import React from 'react';
import { Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="text-center pt-6 pb-8 px-4 max-w-3xl mx-auto">
      {/* Brand & Logo */}
      <div className="flex items-center justify-center gap-3.5 mb-5">
        <div className="w-14 h-14 rounded-2xl border border-gold/50 bg-gradient-to-br from-[#27231a] to-[#111111] flex items-center justify-center shadow-[0_8px_28px_rgba(0,0,0,0.5)]">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" aria-hidden="true">
            <path d="M58 12H28V52H58V88" stroke="#E4C47E" strokeWidth="9" strokeLinecap="square" />
            <path d="M18 52H78" stroke="#F4E4BD" strokeWidth="8" strokeLinecap="round" />
            <path d="M76 18V86" stroke="#E4C47E" strokeWidth="8" strokeLinecap="round" />
            <circle cx="76" cy="18" r="5" fill="#F4E4BD" />
          </svg>
        </div>

        <div className="text-left">
          <strong className="block font-display tracking-[2px] text-lg sm:text-xl text-white font-extrabold">
            FOUR DIGITAL STUDIO
          </strong>
          <span className="block text-[10px] tracking-[2.7px] text-gold-light font-semibold uppercase">
            DESIGN • PHOTO • VIDEO
          </span>
        </div>
      </div>

      {/* Eyebrow */}
      <div className="text-gold text-[11px] font-bold tracking-[3px] uppercase mb-2">
        Creative Service & Visual Production
      </div>

      {/* Main Title */}
      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight mb-3">
        Wujudkan Ide,<br />
        <span className="text-gold-light">Ciptakan Karya.</span>
      </h1>

      {/* Description */}
      <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
        Selamat datang di FourDigitalStudio. Pilih layanan yang Anda butuhkan, lalu lengkapi formulir pemesanan di bawah ini. Tim kami siap membantu kebutuhan visual dan branding Anda.
      </p>
    </header>
  );
}
