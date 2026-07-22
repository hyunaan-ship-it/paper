import React, { useState } from 'react';
import { Send, Lock, Palette, Type, Smile, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const PASTEL_COLORS = [
  { name: '파스텔 핑크', value: '#fce7f3', border: '#f472b6' },
  { name: '파스텔 옐로우', value: '#fef9c3', border: '#facc15' },
  { name: '파스텔 블루', value: '#e0f2fe', border: '#38bdf8' },
  { name: '파스텔 민트', value: '#dcfce7', border: '#4ade80' },
  { name: '파스텔 보라', value: '#f3e8ff', border: '#c084fc' },
  { name: '파스텔 피치', value: '#ffedd5', border: '#fb923c' },
];

const FONTS = [
  { name: '손글씨 개구체', value: 'Gaegu', class: 'font-handwriting' },
  { name: '명조 바탕체', value: 'Gowun Batang', class: 'font-classic' },
  { name: '붓글씨 펜체', value: 'Nanum Pen Script', class: 'font-brush' },
  { name: '고딕 기본체', value: 'Pretendard', class: 'font-primary' },
];

const STICKERS = ['📷', '🐱', '🌸', '🎉', '💖', '☕', '✈️', '🍀', '🎁', '⭐'];

export default function UserMessageForm({ receiver, onAddMessage, onSuccessRedirect }) {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [password, setPassword] = useState('');
  const [color, setColor] = useState(PASTEL_COLORS[0].value);
  const [font, setFont] = useState(FONTS[0].value);
  const [sticker, setSticker] = useState(STICKERS[0]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!author.trim() || !content.trim() || !password.trim()) {
      alert('작성자 이름, 메시지 내용, 본인 확인 비밀번호를 모두 입력해 주세요!');
      return;
    }

    onAddMessage({
      author: author.trim(),
      content: content.trim(),
      password: password.trim(),
      color,
      font,
      sticker,
    });

    setIsSubmitted(true);
    confetti({
      particleCount: 100,
      spread: 60,
      origin: { y: 0.7 }
    });

    setTimeout(() => {
      onSuccessRedirect('my-messages');
    }, 1800);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 glass-panel text-center animate-pulse-subtle">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">메시지가 전송되었습니다! 💌</h3>
        <p className="text-gray-600 text-sm mb-4">
          선물 같은 소중한 마음이 {receiver}님께 전달되도록 담겼습니다.<br />
          비밀번호로 등록하셨기 때문에 <b>'내가 쓴 글 확인'</b> 탭에서 언제든 수정하실 수 있습니다.
        </p>
        <div className="text-xs text-purple-600 font-semibold animate-pulse">
          페이지 이동 중... 🐾
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Warm Message
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mt-2">
          {receiver}님에게 전하는 마음의 한 마디
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          다른 사람들에게는 비밀로 유지되며, 본인 작성 글은 설정하신 비밀번호로 확인하실 수 있습니다 🔒
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Container */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 glass-panel p-6 sm:p-8 space-y-6">
          
          {/* Author & Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                작성자 이름 *
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="예: 이영희 차장"
                className="w-full px-4 py-2.5 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1 flex items-center gap-1">
                <Lock className="w-3 h-3 text-purple-500" />
                본인 확인 비밀번호 (4자리) *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="나중에 글 확인할 때 사용"
                maxLength={10}
                className="w-full px-4 py-2.5 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none text-sm"
                required
              />
            </div>
          </div>

          {/* Message Content */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              남길 메시지 내용 *
            </label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="이동하시는 소감이나 축하, 응원의 메시지를 자유롭게 남겨주세요 🌸"
              className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none text-sm leading-relaxed"
              required
            />
          </div>

          {/* Color Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-purple-500" />
              카드 배경 색상
            </label>
            <div className="flex flex-wrap gap-2">
              {PASTEL_COLORS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setColor(item.value)}
                  className={`w-9 h-9 rounded-full transition-transform border-2 ${
                    color === item.value ? 'scale-110 ring-2 ring-purple-500 shadow-md' : 'hover:scale-105 opacity-80'
                  }`}
                  style={{ backgroundColor: item.value, borderColor: item.border }}
                  title={item.name}
                />
              ))}
            </div>
          </div>

          {/* Font Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2 flex items-center gap-1">
              <Type className="w-3.5 h-3.5 text-purple-500" />
              글꼴 스타일
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {FONTS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFont(item.value)}
                  className={`py-2 px-3 rounded-xl border text-xs text-center transition ${
                    font === item.value
                      ? 'border-purple-500 bg-purple-50 text-purple-700 font-bold shadow-sm'
                      : 'border-gray-200 bg-white/80 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span style={{ fontFamily: item.value }}>{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sticker Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2 flex items-center gap-1">
              <Smile className="w-3.5 h-3.5 text-purple-500" />
              포인트 스티커
            </label>
            <div className="flex flex-wrap gap-2">
              {STICKERS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSticker(s)}
                  className={`text-xl p-2 rounded-xl border transition ${
                    sticker === s
                      ? 'border-purple-500 bg-purple-100 scale-110 shadow-sm'
                      : 'border-gray-100 bg-white/80 hover:scale-105'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-primary w-full justify-center py-3.5 text-base">
            <Send className="w-5 h-5" />
            <span>롤링페이퍼에 메시지 남기기</span>
          </button>

        </form>

        {/* Live Card Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full glass-panel p-4 mb-3 text-center">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              실시간 카드 미리보기
            </span>
          </div>

          {/* Preview Sticky Card */}
          <div
            className="w-full max-w-sm rounded-2xl p-6 shadow-xl relative transition-all duration-300 transform rotate-1 border border-white/60"
            style={{
              backgroundColor: color,
              fontFamily: font,
              minHeight: '260px',
            }}
          >
            {/* Sticker Top Right */}
            <div className="absolute top-4 right-4 text-3xl drop-shadow-sm animate-bounce">
              {sticker}
            </div>

            {/* Author */}
            <div className="mb-4">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">From</div>
              <div className="text-lg font-bold text-gray-800">
                {author || '작성자 이름'}
              </div>
            </div>

            {/* Content */}
            <div className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
              {content || '여기에 작성하신 따뜻한 롤링페이퍼 메시지 내용이 표시됩니다.'}
            </div>

            {/* Bottom Tag */}
            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-black/5">
              <span>To: {receiver}</span>
              <span>🔒 비밀번호 등록됨</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
