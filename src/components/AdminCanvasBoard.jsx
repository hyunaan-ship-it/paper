import React, { useState, useRef } from 'react';
import {
  Move,
  Trash2,
  Type,
  Maximize2,
  Palette,
  Grid,
  Camera,
  Download,
  RotateCw,
  Sparkles,
  Shield,
  Edit
} from 'lucide-react';
import MessageCard from './MessageCard';
import html2canvas from 'html2canvas';

export default function AdminCanvasBoard({
  messages,
  receiver,
  isAdmin,
  onUpdateMessage,
  onDeleteMessage,
  onBatchUpdateMessages
}) {
  const [selectedId, setSelectedId] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const canvasRef = useRef(null);

  const selectedMsg = messages.find((m) => m.id === selectedId);

  // Position updates during drag
  const handleUpdatePosition = (id, newX, newY) => {
    onUpdateMessage(id, { x: newX, y: newY });
  };

  // Auto Grid Align tool for Admin
  const handleAutoGridAlign = () => {
    const colCount = 3;
    const itemWidth = 320;
    const itemHeight = 260;
    const gapX = 30;
    const gapY = 30;
    const startX = 40;
    const startY = 40;

    const updated = messages.map((msg, idx) => {
      const col = idx % colCount;
      const row = Math.floor(idx / colCount);
      return {
        ...msg,
        x: startX + col * (itemWidth + gapX),
        y: startY + row * (itemHeight + gapY),
        rotation: 0
      };
    });

    onBatchUpdateMessages(updated);
  };

  // Export Canvas to PNG Image
  const handleExportPNG = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(canvasRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#faf8f5'
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `${receiver}_롤링페이퍼.png`;
      link.click();
    } catch (err) {
      console.error('Failed to export canvas image', err);
      alert('이미지 저장 중 오류가 발생했습니다.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-100px)]">
      
      {/* Top Admin Control Bar (Visible when Admin is logged in) */}
      {isAdmin && (
        <div className="bg-purple-900 text-white px-4 py-3 shadow-md sticky top-16 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-purple-700">
          
          <div className="flex items-center gap-2">
            <span className="bg-purple-700 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              관리자 모드 활성화됨
            </span>
            <p className="text-xs text-purple-200 hidden md:inline">
              카드를 자유롭게 마우스로 끌어 이동하고, 아래 조작바로 글자 크기/카드 크기/삭제를 편집하세요.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAutoGridAlign}
              className="px-3 py-1.5 bg-purple-700 hover:bg-purple-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Grid className="w-3.5 h-3.5 text-pink-300" />
              <span>그리드 자동 정렬</span>
            </button>

            <button
              onClick={handleExportPNG}
              disabled={isExporting}
              className="px-3 py-1.5 bg-gradient-to-r from-pink-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{isExporting ? '이미지 생성 중...' : '전체 롤링페이퍼 이미지 저장'}</span>
            </button>
          </div>

        </div>
      )}

      {/* Selected Card Control Bar (Floating when a card is selected in Admin mode) */}
      {isAdmin && selectedMsg && (
        <div className="bg-white/90 backdrop-blur-md border border-purple-200 p-4 shadow-xl fixed bottom-6 left-1/2 -translate-x-1/2 z-40 rounded-2xl max-w-2xl w-[90%] animate-fadeIn space-y-3">
          
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                선택된 카드
              </span>
              <h4 className="font-bold text-gray-800 text-sm">From: {selectedMsg.author}</h4>
            </div>
            <button
              onClick={() => setSelectedId(null)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              닫기 ✖
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Font Size Slider */}
            <div>
              <label className="font-bold text-gray-700 flex items-center justify-between mb-1">
                <span className="flex items-center gap-1">
                  <Type className="w-3.5 h-3.5 text-purple-500" /> 글자 크기
                </span>
                <span className="text-purple-600 font-extrabold">{selectedMsg.fontSize || 18}px</span>
              </label>
              <input
                type="range"
                min={12}
                max={36}
                value={selectedMsg.fontSize || 18}
                onChange={(e) =>
                  onUpdateMessage(selectedMsg.id, { fontSize: parseInt(e.target.value) })
                }
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            {/* Card Width Slider */}
            <div>
              <label className="font-bold text-gray-700 flex items-center justify-between mb-1">
                <span className="flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5 text-purple-500" /> 카드 너비
                </span>
                <span className="text-purple-600 font-extrabold">{selectedMsg.width || 280}px</span>
              </label>
              <input
                type="range"
                min={200}
                max={500}
                value={selectedMsg.width || 280}
                onChange={(e) =>
                  onUpdateMessage(selectedMsg.id, { width: parseInt(e.target.value) })
                }
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            {/* Rotation Slider */}
            <div>
              <label className="font-bold text-gray-700 flex items-center justify-between mb-1">
                <span className="flex items-center gap-1">
                  <RotateCw className="w-3.5 h-3.5 text-purple-500" /> 카드 회전
                </span>
                <span className="text-purple-600 font-extrabold">{selectedMsg.rotation || 0}°</span>
              </label>
              <input
                type="range"
                min={-15}
                max={15}
                value={selectedMsg.rotation || 0}
                onChange={(e) =>
                  onUpdateMessage(selectedMsg.id, { rotation: parseInt(e.target.value) })
                }
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Color Palette & Delete Button */}
          <div className="flex items-center justify-between pt-1 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-gray-600 mr-1">색상:</span>
              {['#fce7f3', '#fef9c3', '#e0f2fe', '#dcfce7', '#f3e8ff', '#ffedd5'].map((c) => (
                <button
                  key={c}
                  onClick={() => onUpdateMessage(selectedMsg.id, { color: c })}
                  className={`w-6 h-6 rounded-full border ${
                    selectedMsg.color === c ? 'ring-2 ring-purple-600 scale-110' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            <button
              onClick={() => {
                if (window.confirm(`${selectedMsg.author}님의 메시지를 삭제하시겠습니까?`)) {
                  onDeleteMessage(selectedMsg.id);
                  setSelectedId(null);
                }
              }}
              className="btn-danger text-xs py-1.5 px-3 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>메시지 삭제</span>
            </button>
          </div>

        </div>
      )}

      {/* Main Canvas Board Area */}
      <div
        ref={canvasRef}
        onClick={(e) => {
          if (e.target === canvasRef.current) {
            setSelectedId(null);
          }
        }}
        className="flex-1 board-pattern relative min-h-[850px] w-full p-8 overflow-auto border-t border-amber-200/50"
      >
        {/* Background Cat Mascot Image Watermark */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-20 select-none">
          <img
            src="/cat_photographer.png"
            alt="보드 백그라운드 파스텔 고양이"
            className="w-[480px] h-[480px] object-contain drop-shadow-sm animate-pulse-subtle"
          />
        </div>

        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400">
            <Sparkles className="w-12 h-12 text-purple-300 mb-2 animate-bounce" />
            <p className="font-bold text-gray-600 text-lg">아직 작성된 메시지가 없습니다.</p>
            <p className="text-xs text-gray-400 mt-1">상단의 '메시지 작성하기' 탭에서 첫 번째 응원을 남겨보세요!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageCard
              key={msg.id}
              msg={msg}
              isAdmin={isAdmin}
              isSelected={selectedId === msg.id}
              onSelect={(id) => setSelectedId(id)}
              onUpdatePosition={handleUpdatePosition}
              onDelete={onDeleteMessage}
            />
          ))
        )}
      </div>

    </div>
  );
}
