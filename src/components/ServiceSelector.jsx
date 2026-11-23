import React from 'react';
import { Palette, Camera, Video, ShoppingBag } from 'lucide-react';
import { SERVICES } from '../data/services';

const iconMap = {
  Palette: Palette,
  Camera: Camera,
  Video: Video,
  ShoppingBag: ShoppingBag,
};

export default function ServiceSelector({ selectedService, onSelectService }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg sm:text-xl font-bold text-white mb-3">
        Pilih layanan yang ingin dipesan
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {SERVICES.map((service) => {
          const IconComponent = iconMap[service.icon] || Palette;
          const isSelected = selectedService === service.id;

          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onSelectService(service.id)}
              className={`text-left p-4 sm:p-5 rounded-2xl transition-all duration-200 border flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-b from-[#1c1f23] to-[#121416] border-gold shadow-[0_10px_30px_rgba(0,0,0,0.4)] translate-y-[-2px]'
                  : 'bg-gradient-to-b from-[#1c1f23]/70 to-[#121416]/70 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                  isSelected ? 'bg-gold/20 text-gold-light' : 'bg-slate-800/80 text-gold'
                }`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-white mb-1">
                  {service.title}
                </h3>
                <div className="text-gold-light font-extrabold text-base mb-2">
                  {service.price}
                </div>
                <small className="block text-[11px] text-slate-400 leading-normal">
                  {service.description}
                </small>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-slate-400 mt-3">
        *Harga merupakan harga mulai. Biaya akhir menyesuaikan kebutuhan, jumlah, lokasi, durasi, dan tingkat kesulitan pekerjaan.
      </p>
    </div>
  );
}
