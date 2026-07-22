import React, { useState, useEffect } from 'react';
import { Camera, Heart, Sparkles } from 'lucide-react';

const MESSAGES = [
  "찰칵! 📸 소중한 추억을 사진으로 담고 있어요!",
  "새로운 출발을 진심으로 축하드려요~ 🌸",
  "따뜻한 마음이 담긴 롤링페이퍼를 남겨보세요! 🐾",
  "관리자분은 보드 카드를 자유롭게 끌어 배치할 수 있어요 🎨",
  "소중한 한 마디가 큰 힘이 됩니다 ✨"
];

export default function CatMascot({ size = 'medium', className = '' }) {
  const [bubbleText, setBubbleText] = useState(MESSAGES[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBubbleText(prev => {
        const nextIdx = (MESSAGES.indexOf(prev) + 1) % MESSAGES.length;
        return MESSAGES[nextIdx];
      });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-36 h-36'
  };

  return (
    <div className={`relative flex items-center gap-3 ${className}`}>
      <div className="relative group cursor-pointer animate-float">
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
        <img
          src="./cat_photographer.png"
          alt="사진 찍는 파스텔 고양이"
          className={`${sizeClasses[size] || sizeClasses.medium} relative object-contain drop-shadow-md rounded-2xl bg-white/40 p-1 border border-white/60 transition-transform group-hover:scale-105`}
        />
        <div className="absolute -top-1 -right-1 bg-amber-300 text-amber-900 p-1 rounded-full text-xs shadow">
          <Camera className="w-3.5 h-3.5 animate-pulse" />
        </div>
      </div>

      <div className="relative glass-panel px-4 py-2.5 max-w-xs text-xs sm:text-sm text-gray-700 shadow-sm border border-white/70 rounded-2xl">
        <div className="flex items-center gap-1.5 font-bold text-purple-600 mb-0.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>파스텔 포토냥</span>
        </div>
        <p className="leading-snug text-gray-600 font-medium">{bubbleText}</p>
        <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-r-8 border-r-white/90"></div>
      </div>
    </div>
  );
}
