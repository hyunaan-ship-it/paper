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
  LayoutGrid,
  Plus
} from 'lucide-react';
import MessageCard from './MessageCard';
import html2canvas from 'html2canvas';

export default function AdminCanvasBoard({
  messages,
  receiver,
  isAdmin,
  isBoardPublished = true,
  onToggleBoardPublished,
  pageCount = 1,
  onSetPageCount,
  currentPage = 1,
  onChangePage,
  onUpdateMessage,
  onDeleteMessage,
  onBatchUpdateMessages,
  onGoToWrite
}) {
  const [selectedId, setSelectedId] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [paperSize, setPaperSize] = useState('A4'); // 'A4' or 'A3'
  const canvasRef = useRef(null);

  const selectedMsg = messages.find((m) => m.id === selectedId);

  // Calculate total pages and visible messages for current page
  const maxMsgPage = messages.reduce((max, m) => Math.max(max, m.page || 1), 1);
  const totalPages = Math.max(pageCount || 1, maxMsgPage);
  const visibleMessages = messages.filter((m) => (m.page || 1) === currentPage);

  const handleAddPage = () => {
    const nextCount = totalPages + 1;
    onSetPageCount(nextCount);
    onChangePage(nextCount);
  };

  const handleDeleteCurrentPage = () => {
    if (totalPages <= 1) return;
    if (window.confirm(`${currentPage}페이지를 삭제하고 페이지 내 메시지를 정리하시겠습니까?`)) {
      const pageMsgs = messages.filter((m) => (m.page || 1) === currentPage);
      pageMsgs.forEach((m) => onDeleteMessage(m.id));
      const nextCount = Math.max(1, totalPages - 1);
      onSetPageCount(nextCount);
      onChangePage(Math.min(currentPage, nextCount));
    }
  };

  // Position & Size updates during drag
  const handleUpdatePosition = (id, newX, newY) => {
    onUpdateMessage(id, { x: newX, y: newY });
  };

  const handleUpdateSize = (id, newWidth, newHeight) => {
    onUpdateMessage(id, { width: newWidth, height: newHeight });
  };

  // Auto Grid Align for 15+ People (A4 Format - 4 columns x 4 rows)
  const handleAlignA4 = () => {
    setPaperSize('A4');
    const colCount = 4;
    const itemWidth = 290;
    const itemHeight = 210;
    const gapX = 20;
    const gapY = 20;
    const startX = 45;
    const startY = 45;

    // Align messages on current page
    const updated = messages.map((msg) => {
      if ((msg.page || 1) !== currentPage) return msg;
      const idxOnPage = visibleMessages.findIndex((m) => m.id === msg.id);
      if (idxOnPage < 0) return msg;
      const col = idxOnPage % colCount;
      const row = Math.floor(idxOnPage / colCount);
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
    setPaperSize('A3');
    const colCount = 5;
    const itemWidth = 290;
    const itemHeight = 210;
    const gapX = 20;
    const gapY = 20;
    const startX = 40;
    const startY = 40;

    const updated = messages.map((msg) => {
      if ((msg.page || 1) !== currentPage) return msg;
      const idxOnPage = visibleMessages.findIndex((m) => m.id === msg.id);
      if (idxOnPage < 0) return msg;
      const col = idxOnPage % colCount;
      const row = Math.floor(idxOnPage / colCount);
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

  // Trigger Native Browser Print Dialog with dynamic A4/A3 paper size
  const handlePrint = () => {
    const existingStyle = document.getElementById('dynamic-print-paper-size');
    if (existingStyle) existingStyle.remove();

    const styleEl = document.createElement('style');
    styleEl.id = 'dynamic-print-paper-size';
    styleEl.innerHTML = `@media print { @page { size: ${paperSize === 'A3' ? 'A3' : 'A4'} landscape; margin: 6mm; } }`;
    document.head.appendChild(styleEl);

    window.print();
  };

  // High-Resolution PNG Export (Current Page)
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
      link.download = `${receiver}_롤링페이퍼_${currentPage}페이지_${paperSize}.png`;
      link.click();
    } catch (err) {
      console.error('Failed to export canvas image', err);
      alert('이미지 저장 중 오류가 발생했습니다.');
    } finally {
      setIsExporting(false);
    }
  };

  // High-Resolution PNG Export (ALL Pages at once)
  const handleExportAllPNG = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    const originalPage = currentPage;
    try {
      for (let p = 1; p <= totalPages; p++) {
        onChangePage(p);
        // Wait 350ms for React re-render of page p cards
        await new Promise((r) => setTimeout(r, 350));

        const canvas = await html2canvas(canvasRef.current, {
          scale: 3,
          useCORS: true,
          backgroundColor: '#faf8f5'
        });
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `${receiver}_롤링페이퍼_${p}페이지_${paperSize}.png`;
        link.click();

        // Delay between downloads so browser popup blocker doesn't block sequential downloads
        await new Promise((r) => setTimeout(r, 450));
      }
    } catch (err) {
      console.error('Failed to export all pages image', err);
      alert('전체 페이지 이미지 저장 중 오류가 발생했습니다.');
    } finally {
      onChangePage(originalPage);
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
        <div className="bg-purple-900 text-white px-4 py-3 shadow-md sticky top-16 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-purple-700 no-print">
          
          <div className="flex items-center gap-2">
            <span className="bg-purple-700 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              관리자 모드 ({paperSize} 규격 · {currentPage}/{totalPages}P)
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

            {/* Admin Multi-Page Selector & Page Creator */}
            <div className="flex items-center gap-1 bg-purple-950 p-1 rounded-lg border border-purple-700 text-xs">
              <span className="text-purple-300 font-bold px-1 text-[11px]">페이지:</span>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => onChangePage(p)}
                  className={`px-2.5 py-1 rounded-md font-bold transition flex items-center gap-1 ${
                    currentPage === p
                      ? 'bg-pink-500 text-white shadow'
                      : 'bg-purple-800 text-purple-200 hover:bg-purple-700'
                  }`}
                >
                  <span>{p}P</span>
                  <span className="opacity-75 text-[10px]">
                    ({messages.filter((m) => (m.page || 1) === p).length})
                  </span>
                </button>
              ))}

              <button
                onClick={handleAddPage}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-md flex items-center gap-1 transition text-xs ml-1 shadow"
                title="새로운 롤링페이퍼 페이지를 추가합니다"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ 새 페이지</span>
              </button>

              {totalPages > 1 && (
                <button
                  onClick={handleDeleteCurrentPage}
                  className="px-2 py-1 bg-red-600/80 hover:bg-red-600 text-white font-bold rounded-md transition text-xs"
                  title="현재 페이지 삭제"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Paper Size Switch Buttons */}
            <div className="flex items-center bg-purple-950 p-0.5 rounded-lg border border-purple-700 text-xs">
              <button
                onClick={() => setPaperSize('A4')}
                className={`px-2.5 py-1 rounded-md font-bold transition ${
                  paperSize === 'A4' ? 'bg-purple-600 text-white shadow' : 'text-purple-300 hover:text-white'
                }`}
              >
                📄 A4 규격
              </button>
              <button
                onClick={() => setPaperSize('A3')}
                className={`px-2.5 py-1 rounded-md font-bold transition ${
                  paperSize === 'A3' ? 'bg-purple-600 text-white shadow' : 'text-purple-300 hover:text-white'
                }`}
              >
                📄 A3 대형 규격
              </button>
            </div>

            {/* Grid Alignments */}
            <button
              onClick={handleAlignA4}
              className="px-3 py-1.5 bg-purple-700 hover:bg-purple-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              title="15~16명이 작성한 메시지를 가로 A4 용지에 맞게 4x4 그리드로 정렬합니다"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-pink-300" />
              <span>📐 A4 정렬</span>
            </button>

            <button
              onClick={handleAlignA3}
              className="px-3 py-1.5 bg-purple-700 hover:bg-purple-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              title="20명 이상 메시지를 가로 A3 용지에 맞게 5x4 그리드로 정렬합니다"
            >
              <Grid className="w-3.5 h-3.5 text-amber-300" />
              <span>📐 A3 정렬</span>
            </button>

            {/* Print Direct */}
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition"
              title={`${paperSize} 종이로 바로 인쇄하거나 PDF로 저장합니다`}
            >
              <Printer className="w-3.5 h-3.5 text-blue-200" />
              <span>𖤓 인쇄 · PDF</span>
            </button>

            {/* High-Res PNG Export (Single Page & All Pages) */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleExportPNG}
                disabled={isExporting}
                className="px-2.5 py-1.5 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition disabled:opacity-50"
                title="현재 보이고 있는 1개 페이지를 PNG 이미지로 저장합니다"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{isExporting ? '생성 중...' : `${currentPage}P PNG 저장`}</span>
              </button>

              {totalPages > 1 && (
                <button
                  onClick={handleExportAllPNG}
                  disabled={isExporting}
                  className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-600 hover:to-emerald-600 text-white rounded-lg text-xs font-black flex items-center gap-1.5 shadow-md transition disabled:opacity-50 animate-pulse-subtle"
                  title="모든 페이지(1P~전체)를 한 번에 이미지 파일로 일괄 저장합니다"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isExporting ? '전체 저장 중...' : `📸 전체(${totalPages}개) 페이지 한 번에 저장`}</span>
                </button>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Selected Card Control Bar (Floating when a card is selected in Admin mode) */}
      {isAdmin && selectedMsg && (
        <div className="bg-white/90 backdrop-blur-md border border-purple-200 p-4 shadow-xl fixed bottom-6 left-1/2 -translate-x-1/2 z-40 rounded-2xl max-w-4xl w-[94%] animate-fadeIn space-y-3 no-print">
          
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                선택된 카드
              </span>
              <h4 className="font-bold text-gray-800 text-sm">From: {selectedMsg.author} ({selectedMsg.page || 1}페이지)</h4>
            </div>
            <button
              onClick={() => setSelectedId(null)}
              className="text-xs text-gray-400 hover:text-gray-600 font-bold"
            >
              닫기 ✖
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            {/* Target Page Selector for Selected Card */}
            <div>
              <label className="font-bold text-gray-700 flex items-center justify-between mb-1">
                <span className="flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-purple-500" /> 위치 페이지
                </span>
                <span className="text-purple-600 font-extrabold">{selectedMsg.page || 1}P</span>
              </label>
              <select
                value={selectedMsg.page || 1}
                onChange={(e) => onUpdateMessage(selectedMsg.id, { page: parseInt(e.target.value) })}
                className="w-full px-2 py-1 bg-white border border-purple-300 rounded-lg text-xs accent-purple-600 font-bold focus:outline-none"
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <option key={p} value={p}>{p} 페이지로 이동</option>
                ))}
              </select>
            </div>

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
                max={550}
                value={selectedMsg.width || 280}
                onChange={(e) =>
                  onUpdateMessage(selectedMsg.id, { width: parseInt(e.target.value) })
                }
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            {/* Card Height Slider */}
            <div>
              <label className="font-bold text-gray-700 flex items-center justify-between mb-1">
                <span className="flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5 text-purple-500 rotate-90" /> 카드 높이
                </span>
                <span className="text-purple-600 font-extrabold">{selectedMsg.height || 220}px</span>
              </label>
              <input
                type="range"
                min={150}
                max={550}
                value={selectedMsg.height || 220}
                onChange={(e) =>
                  onUpdateMessage(selectedMsg.id, { height: parseInt(e.target.value) })
                }
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            {/* Rotation Slider */}
            <div>
              <label className="font-bold text-gray-700 flex items-center justify-between mb-1">
                <span className="flex items-center gap-1">
                  <RotateCw className="w-3.5 h-3.5 text-purple-500" /> 회전
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
        className={`flex-1 board-pattern relative w-full p-8 overflow-auto border-t border-amber-200/50 ${
          paperSize === 'A3' ? 'min-h-[1180px] min-w-[1640px]' : 'min-h-[1000px] min-w-[1320px]'
        }`}
      >
        {/* Paper Print Guideline Frame (Landscape) */}
        {isAdmin && (
          <div
            data-html2canvas-ignore="true"
            className={`absolute top-4 left-4 border-2 border-dashed border-purple-400/40 rounded-3xl pointer-events-none flex items-start justify-end p-4 no-print ${
              paperSize === 'A3' ? 'w-[1580px] h-[1100px]' : 'w-[1280px] h-[920px]'
            }`}
          >
            <span className="bg-purple-100/90 text-purple-700 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm border border-purple-200 no-print">
              {paperSize === 'A3'
                ? `📄 가로 A3 대형 용지 가이드 (${currentPage}/${totalPages} 페이지)`
                : `📄 가로 A4 용지 가이드 (${currentPage}/${totalPages} 페이지)`}
            </span>
          </div>
        )}

        {visibleMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400">
            <Sparkles className="w-12 h-12 text-purple-300 mb-2 animate-bounce" />
            <p className="font-bold text-gray-600 text-lg">
              {totalPages > 1 ? `${currentPage}페이지에 작성된 메시지가 없습니다.` : '아직 작성된 메시지가 없습니다.'}
            </p>
            <p className="text-xs text-gray-400 mt-1">상단의 '메시지 작성하기' 탭에서 따뜻한 마음을 남겨보세요!</p>
          </div>
        ) : (
          visibleMessages.map((msg) => (
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

      {/* Floating Multi-Page Pagination Bar (For all users when pageCount > 1) */}
      {totalPages > 1 && (
        <div className="fixed bottom-6 right-8 z-30 bg-white/95 backdrop-blur-md border-2 border-purple-300 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 no-print animate-fadeIn">
          <button
            disabled={currentPage <= 1}
            onClick={() => onChangePage(currentPage - 1)}
            className="px-3 py-1 bg-purple-100 text-purple-700 disabled:opacity-30 font-bold rounded-xl hover:bg-purple-200 transition text-xs"
          >
            ◀ 이전
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => onChangePage(p)}
                className={`w-8 h-8 rounded-xl text-xs font-black transition flex items-center justify-center ${
                  currentPage === p
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-purple-100'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage >= totalPages}
            onClick={() => onChangePage(currentPage + 1)}
            className="px-3 py-1 bg-purple-100 text-purple-700 disabled:opacity-30 font-bold rounded-xl hover:bg-purple-200 transition text-xs"
          >
            다음 ▶
          </button>
        </div>
      )}

    </div>
  );
}

