import React from 'react';

export default function Footer() {
  return (
    <footer className="text-center py-10 px-4 mt-8 text-xs text-[#858b93] space-y-3">
      <div>
        <strong className="text-gold-light tracking-[1.4px] block">
          FOUR DIGITAL STUDIO
        </strong>
        <div className="mt-1">
          YOUR IDEAS, OUR CREATIVITY.
        </div>
        <div>
          Design • Photography • Videography
        </div>
      </div>

      <div className="pt-3 border-t border-[#30343a]/50 text-[11px] text-[#71767e]">
        Published & Business Partner by{' '}
        <a
          href="https://www.instagram.com/ence.dev/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold hover:text-gold-light hover:underline transition font-medium"
        >
          encedev
        </a>
      </div>
    </footer>
  );
}
