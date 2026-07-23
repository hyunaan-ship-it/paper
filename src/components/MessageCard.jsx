import React, { useState, useRef } from 'react';
import { Move, Trash2, Edit3, Type, Maximize2, Palette } from 'lucide-react';

export default function MessageCard({
  msg,
  isAdmin,
  isSelected,
  onSelect,
  onUpdatePosition,
  onUpdateSize,
  onDelete,
  onEditContent
}) {
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });

  const cardX = msg.x || 50;
  const cardY = msg.y || 50;
  const cardWidth = msg.width || 280;
  const cardHeight = msg.height || 220;
  const fontSize = msg.fontSize || 18;
  const rotation = msg.rotation || 0;

  // Handle Mouse Drag for positioning
  const handleMouseDown = (e) => {
    if (!isAdmin) return;
    // Don't drag if clicking buttons inside
    if (e.target.closest('button') || e.target.closest('input')) return;

    onSelect(msg.id);
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: cardX,
      initialY: cardY,
    };

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - dragRef.current.startX;
      const deltaY = moveEvent.clientY - dragRef.current.startY;
      const newX = Math.max(10, dragRef.current.initialX + deltaX);
      const newY = Math.max(10, dragRef.current.initialY + deltaY);
      onUpdatePosition(msg.id, newX, newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Handle Mouse Drag for resizing (width & height)
  const handleResizeMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (isAdmin && onSelect) onSelect(msg.id);

    const startX = e.clientX;
    const startY = e.clientY;
    const initialWidth = cardWidth;
    const initialHeight = cardHeight;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      const newWidth = Math.max(180, Math.min(650, initialWidth + deltaX));
      const newHeight = Math.max(140, Math.min(650, initialHeight + deltaY));
      if (onUpdateSize) {
        onUpdateSize(msg.id, newWidth, newHeight);
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      onClick={() => isAdmin && onSelect(msg.id)}
      onMouseDown={handleMouseDown}
      className={`absolute rounded-2xl p-5 shadow-lg transition-shadow border select-none flex flex-col justify-between ${
        isAdmin ? 'cursor-move' : ''
      } ${
        isSelected
          ? 'ring-4 ring-purple-500 ring-offset-2 z-30 shadow-2xl scale-102 border-purple-400'
          : 'border-white/60 hover:shadow-xl hover:z-20'
      }`}
      style={{
        left: `${cardX}px`,
        top: `${cardY}px`,
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
        backgroundColor: msg.color || '#fce7f3',
        fontFamily: msg.font || 'Gaegu',
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {/* Sticker */}
      <div className="absolute top-3 right-3 text-2xl pointer-events-none drop-shadow-sm">
        {msg.sticker}
      </div>

      {/* Admin Quick Handle Badge */}
      {isAdmin && (
        <div className="absolute -top-3 left-3 bg-purple-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow flex items-center gap-1 opacity-80 group-hover:opacity-100 no-print">
          <Move className="w-2.5 h-2.5" />
          <span>드래그 이동 가능</span>
        </div>
      )}

      {/* Main Content Wrap */}
      <div className="flex-1 flex flex-col justify-start overflow-hidden">
        {/* Author Header */}
        <div className="mb-1.5 pr-8 flex-shrink-0">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            From
          </span>
          <h4 className="text-base font-bold text-gray-900 leading-tight">
            {msg.author}
          </h4>
        </div>

        {/* Content */}
        <div
          className="text-gray-800 leading-relaxed whitespace-pre-wrap overflow-auto flex-1"
          style={{ fontSize: `${fontSize}px` }}
        >
          {msg.content}
        </div>
      </div>

      {/* Footer Date / Metadata */}
      <div className="mt-3 pt-2 border-t border-black/5 text-[11px] text-gray-400 flex items-center justify-between">
        <span>{msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : ''}</span>
        {isAdmin && isSelected && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(msg.id);
            }}
            className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            title="메시지 삭제"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Selection Border Glow */}
      {isSelected && isAdmin && (
        <div className="absolute -bottom-2 left-3 bg-purple-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold shadow no-print">
          선택됨
        </div>
      )}

      {/* Mouse Drag Resize Handle (Bottom-Right) */}
      {(isAdmin || isSelected) && (
        <div
          onMouseDown={handleResizeMouseDown}
          className="absolute -bottom-2.5 -right-2.5 w-7 h-7 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center cursor-se-resize shadow-lg z-40 transition-transform hover:scale-125 group/resize border-2 border-white no-print"
          title="마우스로 드래그하여 크기 조절"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="absolute -top-7 right-0 bg-gray-900 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover/resize:opacity-100 transition whitespace-nowrap pointer-events-none font-bold shadow">
            드래그 크기 조절 ↘
          </span>
        </div>
      )}
    </div>
  );
}
