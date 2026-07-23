import React, { useState } from 'react';
import { Shield, ShieldCheck, Heart, Sparkles, Download, Upload, Edit3, Check, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Header({
  receiver,
  setReceiver,
  isAdmin,
  onOpenAdminModal,
  onLogoutAdmin,
  activeTab,
  setActiveTab,
  onExport,
  onImport
}) {
  const [isEditingReceiver, setIsEditingReceiver] = useState(false);
  const [tempReceiver, setTempReceiver] = useState(receiver);

  const handleSaveReceiver = () => {
    if (tempReceiver.trim()) {
      setReceiver(tempReceiver.trim());
    }
    setIsEditingReceiver(false);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']
    });
  };

  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      onImport(event.target.result);
    };
    reader.readAsText(file);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-amber-100 shadow-sm px-4 sm:px-8 py-3 no-print">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Title */}
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              {isEditingReceiver ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={tempReceiver}
                    onChange={(e) => setTempReceiver(e.target.value)}
                    className="px-2 py-1 text-lg font-bold text-gray-800 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-500"
                    placeholder="수신자 이름 입력"
                  />
                  <button
                    onClick={handleSaveReceiver}
                    className="p-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditingReceiver(true)}>
                  <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 bg-clip-text text-transparent">
                    {receiver}
                  </h1>
                  <span className="text-sm font-semibold text-gray-600">을(를) 위한 롤링페이퍼 💌</span>
                  <Edit3 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition" />
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Center: Navigation Tabs */}
        <div className="flex items-center gap-1 bg-white/80 p-1.5 rounded-2xl border border-gray-200/80 shadow-inner">
          <button
            onClick={() => setActiveTab('board')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'board'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50/50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>롤링페이퍼 보드</span>
          </button>
          
          <button
            onClick={() => setActiveTab('write')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'write'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50/50'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>메시지 작성하기</span>
          </button>

          <button
            onClick={() => setActiveTab('my-messages')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'my-messages'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50/50'
            }`}
          >
            <span>내가 쓴 글 확인 🔒</span>
          </button>
        </div>

        {/* Right: Actions & Admin Status */}
        <div className="flex items-center gap-2">
          {/* Confetti Celebration Button */}
          <button
            onClick={triggerConfetti}
            className="btn-secondary text-xs sm:text-sm py-2 px-3 hover:border-pink-300 hover:text-pink-600"
            title="축하 폭죽 발사"
          >
            <Gift className="w-4 h-4 text-pink-500" />
            <span className="hidden sm:inline">축하 선물 모드</span>
          </button>

          {/* Backup / Export / Import */}
          <div className="flex items-center gap-1">
            <button
              onClick={onExport}
              className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition"
              title="롤링페이퍼 데이터 백업 (JSON 다운로드)"
            >
              <Download className="w-4 h-4" />
            </button>
            
            <label
              className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition cursor-pointer"
              title="롤링페이퍼 데이터 복구 (JSON 파일 선택)"
            >
              <Upload className="w-4 h-4" />
              <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
            </label>
          </div>

          {/* Admin Login Status */}
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <span className="badge-admin flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                관리자 로그인됨
              </span>
              <button
                onClick={onLogoutAdmin}
                className="text-xs text-gray-500 hover:text-red-500 underline ml-1"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAdminModal}
              className="btn-secondary text-xs sm:text-sm py-2 px-3 border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              <Shield className="w-4 h-4 text-purple-500" />
              <span>관리자 로그인</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
