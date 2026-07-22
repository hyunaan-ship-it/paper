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

  return (
    <div
      onClick={() => isAdmin && onSelect(msg.id)}
      onMouseDown={handleMouseDown}
      className={`absolute rounded-2xl p-5 shadow-lg transition-shadow border select-none ${
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
        minHeight: `${cardHeight}px`,
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
        <div className="absolute -top-3 left-3 bg-purple-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow flex items-center gap-1 opacity-80 group-hover:opacity-100">
          <Move className="w-2.5 h-2.5" />
          <span>드래그 이동 가능</span>
        </div>
      )}

      {/* Author Header */}
      <div className="mb-2 pr-8">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
          From
        </span>
        <h4 className="text-base font-bold text-gray-900 leading-tight">
          {msg.author}
        </h4>
      </div>

      {/* Content */}
      <div
        className="text-gray-800 leading-relaxed whitespace-pre-wrap overflow-hidden"
        style={{ fontSize: `${fontSize}px` }}
      >
        {msg.content}
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
        <div className="absolute -bottom-2 -right-2 bg-purple-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold shadow">
          선택됨
        </div>
      )}
    </div>
  );
}
