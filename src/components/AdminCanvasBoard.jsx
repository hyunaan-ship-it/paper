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
  Edit,
  Eye,
  EyeOff,
  Lock,
  Heart,
  Printer,
  FileText,
  LayoutGrid
} from 'lucide-react';
import MessageCard from './MessageCard';
import html2canvas from 'html2canvas';

export default function AdminCanvasBoard({
  messages,
  receiver,
  isAdmin,
  isBoardPublished = true,
  onToggleBoardPublished,
  onUpdateMessage,
  onDeleteMessage,
  onBatchUpdateMessages,
  onGoToWrite
}) {
  const [selectedId, setSelectedId] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showPaperGuide, setShowPaperGuide] = useState(true);
  const canvasRef = useRef(null);

  const selectedMsg = messages.find((m) => m.id === selectedId);

  // Position & Size updates during drag
  const handleUpdatePosition = (id, newX, newY) => {
    onUpdateMessage(id, { x: newX, y: newY });
  };

  const handleUpdateSize = (id, newWidth, newHeight) => {
    onUpdateMessage(id, { width: newWidth, height: newHeight });
  };

  // Auto Grid Align for 15+ People (A4 Format - 4 columns x 4 rows)
  const handleAlignA4 = () => {
    const colCount = 4;
    const itemWidth = 290;
    const itemHeight = 210;
    const gapX = 20;
    const gapY = 20;
    const startX = 45;
    const startY = 45;

    const updated = messages.map((msg, idx) => {
      const col = idx % colCount;
      const row = Math.floor(idx / colCount);
      return {
        ...msg,
        x: startX + col * (itemWidth + gapX),
        y: startY + row * (itemHeight + gapY),
        width: itemWidth,
        height: itemHeight,
        rotation: 0
      };
    });

    onBatchUpdateMessages(updated);
  };

  // Auto Grid Align for A3 Format (5 columns x 4 rows)
  const handleAlignA3 = () => {
    const colCount = 5;
    const itemWidth = 270;
    const itemHeight = 195;
    const gapX = 16;
    const gapY = 16;
    const startX = 35;
    const startY = 35;

    const updated = messages.map((msg, idx) => {
      const col = idx % colCount;
      const row = Math.floor(idx / colCount);
      return {
        ...msg,
        x: startX + col * (itemWidth + gapX),
        y: startY + row * (itemHeight + gapY),
        width: itemWidth,
        height: itemHeight,
        rotation: 0
      };
    });

    onBatchUpdateMessages(updated);
  };

  // Trigger Native Browser Print Dialog (A4 / A3 Print)
  const handlePrint = () => {
    window.print();
  };

  // High-Resolution PNG Export (scale: 3 for high-density physical printing)
  const handleExportPNG = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(canvasRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#faf8f5'
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `${receiver}_롤링페이퍼_인쇄용.png`;
      link.click();
    } catch (err) {
      console.error('Failed to export canvas image', err);
      alert('이미지 저장 중 오류가 발생했습니다.');
    } finally {
      setIsExporting(false);
    }
  };

  // Render Private Board Screen for normal users when board is not published
  if (!isAdmin && !isBoardPublished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] p-6 text-center">
        <div className="max-w-lg glass-panel p-8 sm:p-10 shadow-2xl relative border-2 border-purple-200 animate-fadeIn">
          <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-inner">
            <Lock className="w-10 h-10 animate-bounce" />
          </div>

          <span className="bg-purple-100 text-purple-700 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            Surprise Preparation 🌸
          </span>

          <h3 className="text-2xl font-black text-gray-800 mt-3 mb-2">
            {receiver}님을 위한 서프라이즈 준비 중! 🔒
          </h3>

          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            현재 롤링페이퍼 카드들은 수신자({receiver}님)에게 미리 스포일러되지 않도록 <b className="text-purple-600 font-bold">비공개 작성 기간</b>으로 설정되어 있습니다.<br /><br />
            관리자가 최종 전달 시 보드를 <b>'전체 공개'</b>로 변경하면 작성된 모든 메시지들이 한눈에 예쁘게 공개됩니다 💌
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onGoToWrite}
              className="btn-primary w-full sm:w-auto py-3 px-6 text-sm font-bold shadow-lg"
            >
              <Heart className="w-4 h-4 text-pink-300 fill-pink-300" />
              <span>나도 따뜻한 메시지 남기기 ✍️</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-100px)]">
      
      {/* Top Admin Control Bar (Visible when Admin is logged in) */}
      {isAdmin && (
        <div className="bg-purple-900 text-white px-4 py-3 shadow-md sticky top-16 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-purple-700">
          
          <div className="flex items-center gap-2">
            <span className="bg-purple-700 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              관리자 모드 (15명 이상 A4/A3 인쇄용)
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Public / Private Toggle Switch */}
            <button
              onClick={onToggleBoardPublished}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition ${
                isBoardPublished
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
              }`}
              title="일반 사용자가 롤링페이퍼 보드를 볼 수 있는지 설정합니다"
            >
              {isBoardPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{isBoardPublished ? '🌐 보드 공개 중' : '🔒 보드 비공개 모드'}</span>
            </button>

            {/* A4 Alignment */}
            <button
              onClick={handleAlignA4}
              className="px-3 py-1.5 bg-purple-700 hover:bg-purple-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              title="15~16명이 작성한 메시지를 가로 A4 용지에 딱 맞게 4x4 그리드로 정렬합니다"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-pink-300" />
              <span>📐 15인용 A4 정렬 (4x4)</span>
            </button>

            {/* A3 Alignment */}
            <button
              onClick={handleAlignA3}
              className="px-3 py-1.5 bg-purple-700 hover:bg-purple-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              title="20명 이상 메시지를 가로 A3 용지에 맞게 5x4 그리드로 정렬합니다"
            >
              <Grid className="w-3.5 h-3.5 text-amber-300" />
              <span>📐 A3 정렬 (5x4)</span>
            </button>

            {/* Print Direct */}
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition"
              title="A4 / A3 종이로 바로 인쇄하거나 PDF로 저장합니다"
            >
              <Printer className="w-3.5 h-3.5 text-blue-200" />
              <span>𖤓 A4/A3 인쇄 · PDF</span>
            </button>

            {/* High-Res PNG Export */}
            <button
              onClick={handleExportPNG}
              disabled={isExporting}
              className="px-3 py-1.5 bg-gradient-to-r from-pink-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{isExporting ? '고화질 생성 중...' : '고화질 PNG 저장'}</span>
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
        className="flex-1 board-pattern relative min-h-[1000px] min-w-[1320px] w-full p-8 overflow-auto border-t border-amber-200/50"
      >
        {/* A4 Paper Print Guideline Frame (Landscape) */}
        {isAdmin && (
          <div className="absolute top-4 left-4 w-[1280px] h-[920px] border-2 border-dashed border-purple-400/40 rounded-3xl pointer-events-none flex items-start justify-end p-4">
            <span className="bg-purple-100/90 text-purple-700 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm border border-purple-200 no-print">
              📄 가로 A4 인쇄 용지 영역 가이드 (4x4 16명 카드 보관함)
            </span>
          </div>
        )}

        {/* Background Cat Mascot Image Watermark */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-20 select-none">
          <img
            src="./cat_photographer.png"
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
              onUpdateSize={handleUpdateSize}
              onDelete={onDeleteMessage}
            />
          ))
        )}
      </div>

    </div>
  );
}
