"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SPRITES = void 0;
exports.SPRITES = {
    1: `
    <!-- Egg -->
    <defs>
      <radialGradient id="eggGrad" cx="30%" cy="30%" r="70%">
        <stop offset="0%" style="stop-color:#fce4ec" />
        <stop offset="100%" style="stop-color:#f06292" />
      </radialGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <g transform="translate(100, 100) scale(3)">
      <ellipse cx="0" cy="0" rx="25" ry="32" fill="url(#eggGrad)" stroke="#880e4f" stroke-width="1.5"/>
      <path d="M-15,-10 Q-5,0 -15,10" fill="none" stroke="#f8bbd0" stroke-width="2" opacity="0.6"/>
      <circle cx="10" cy="-15" r="3" fill="white" opacity="0.4"/>
    </g>
  `,
    2: `
    <!-- Baby Dragon -->
    <defs>
      <linearGradient id="babyBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#b388ff" /> <!-- Light Purple -->
        <stop offset="100%" style="stop-color:#651fff" /> <!-- Deep Purple -->
      </linearGradient>
    </defs>
    <g transform="translate(100, 100) scale(2.2)">
      <!-- Tail -->
      <path d="M-20,20 Q-40,30 -30,10" fill="none" stroke="#651fff" stroke-width="4" stroke-linecap="round"/>
      
      <!-- Body -->
      <circle cx="0" cy="10" r="20" fill="url(#babyBody)" stroke="#311b92" stroke-width="1.5"/>
      
      <!-- Head -->
      <circle cx="0" cy="-15" r="18" fill="url(#babyBody)" stroke="#311b92" stroke-width="1.5"/>
      
      <!-- Eyes -->
      <circle cx="-6" cy="-15" r="4" fill="white"/>
      <circle cx="-6" cy="-15" r="1.5" fill="black"/>
      <circle cx="6" cy="-15" r="4" fill="white"/>
      <circle cx="6" cy="-15" r="1.5" fill="black"/>
      
      <!-- Little Wings -->
      <path d="M20,10 Q35,-5 20,-10" fill="#b388ff" stroke="#311b92" stroke-width="1"/>
      <path d="M-20,10 Q-35,-5 -20,-10" fill="#b388ff" stroke="#311b92" stroke-width="1"/>
      
      <!-- Horns -->
      <path d="M-5,-30 L-8,-40 L-2,-32 Z" fill="#ede7f6" stroke="#311b92" stroke-width="1"/>
      <path d="M5,-30 L8,-40 L2,-32 Z" fill="#ede7f6" stroke="#311b92" stroke-width="1"/>
    </g>
  `,
    3: `
    <!-- Teen Dragon -->
    <defs>
      <linearGradient id="teenBody" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#64ffda" /> <!-- Teal -->
        <stop offset="100%" style="stop-color:#00bfa5" /> <!-- Darker Teal -->
      </linearGradient>
    </defs>
    <g transform="translate(100, 100) scale(1.8)">
      <!-- Body -->
      <path d="M-15,30 Q0,50 15,30 L10,-10 L-10,-10 Z" fill="url(#teenBody)" stroke="#004d40" stroke-width="1.5"/>
      
      <!-- Neck -->
      <path d="M-5,-10 Q0,-30 5,-10" fill="url(#teenBody)" stroke="#004d40" stroke-width="1.5"/>
      
      <!-- Head -->
      <path d="M-12,-35 Q0,-55 12,-35 Q15,-15 0,-10 Q-15,-15 -12,-35 Z" fill="url(#teenBody)" stroke="#004d40" stroke-width="1.5"/>
      
      <!-- Eyes (Bored look) -->
      <path d="M-8,-30 L-2,-30" stroke="black" stroke-width="2"/>
      <path d="M2,-30 L8,-30" stroke="black" stroke-width="2"/>
      
      <!-- Wings -->
      <path d="M10,0 Q40,-20 50,10 L30,20 Z" fill="#a7ffeb" stroke="#004d40" stroke-width="1.5"/>
      <path d="M-10,0 Q-40,-20 -50,10 L-30,20 Z" fill="#a7ffeb" stroke="#004d40" stroke-width="1.5"/>
      
      <!-- Spikes -->
      <path d="M0,-55 L-3,-65 L3,-65 Z" fill="#004d40"/>
      <path d="M0,50 L-3,65 L3,60 Z" fill="#004d40"/>
    </g>
  `,
    4: `
    <!-- Adult Dragon -->
    <defs>
      <linearGradient id="adultBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#ff5252" /> <!-- Red -->
        <stop offset="100%" style="stop-color:#b71c1c" /> <!-- Dark Red -->
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
        <feOffset dx="2" dy="2" result="offsetblur"/>
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.3"/>
        </feComponentTransfer>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <g transform="translate(100, 100) scale(1.5)" filter="url(#shadow)">
      <!-- Tail -->
      <path d="M-20,40 Q-60,60 -40,10" fill="none" stroke="#b71c1c" stroke-width="6" stroke-linecap="round"/>
      
      <!-- Wings (Majestic) -->
      <path d="M15,0 Q60,-40 90,0 Q70,40 20,20 Z" fill="#ff8a80" stroke="#b71c1c" stroke-width="2"/>
      <path d="M-15,0 Q-60,-40 -90,0 Q-70,40 -20,20 Z" fill="#ff8a80" stroke="#b71c1c" stroke-width="2"/>
      
      <!-- Body -->
      <path d="M-20,40 Q0,60 20,40 L15,-10 L-15,-10 Z" fill="url(#adultBody)" stroke="#b71c1c" stroke-width="2"/>
      
      <!-- Head -->
      <path d="M-15,-10 Q-20,-50 0,-60 Q20,-50 15,-10 Z" fill="url(#adultBody)" stroke="#b71c1c" stroke-width="2"/>
      
      <!-- Eyes (Fierce) -->
      <path d="M-10,-35 L-2,-30 L-10,-28 Z" fill="#ffeb3b"/>
      <path d="M10,-35 L2,-30 L10,-28 Z" fill="#ffeb3b"/>
      
      <!-- Horns -->
      <path d="M-10,-55 L-20,-80 L-5,-60 Z" fill="#212121"/>
      <path d="M10,-55 L20,-80 L5,-60 Z" fill="#212121"/>
      
      <!-- Belly Scales -->
      <path d="M-10,10 L10,10" stroke="#ffcdd2" stroke-width="2" opacity="0.5"/>
      <path d="M-12,20 L12,20" stroke="#ffcdd2" stroke-width="2" opacity="0.5"/>
      <path d="M-14,30 L14,30" stroke="#ffcdd2" stroke-width="2" opacity="0.5"/>
    </g>
  `,
    5: `
    <!-- Ghost -->
    <defs>
      <radialGradient id="ghostGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" style="stop-color:#ffffff" />
        <stop offset="100%" style="stop-color:#cfd8dc" />
      </radialGradient>
    </defs>
    <g transform="translate(100, 100) scale(2.0)" opacity="0.7">
      <!-- Body -->
      <path d="M-25,30 Q-25,-40 0,-40 Q25,-40 25,30 Q15,10 0,30 Q-15,10 -25,30" fill="url(#ghostGrad)" stroke="#90a4ae" stroke-width="1.5"/>
      
      <!-- Eyes -->
      <circle cx="-8" cy="-10" r="3" fill="#37474f"/>
      <circle cx="8" cy="-10" r="3" fill="#37474f"/>
      
      <!-- Mouth -->
      <circle cx="0" cy="5" r="4" fill="none" stroke="#37474f" stroke-width="1.5"/>
      
      <!-- Halo -->
      <ellipse cx="0" cy="-55" rx="15" ry="3" fill="none" stroke="#ffd700" stroke-width="2"/>
    </g>
  `
};
