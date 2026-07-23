import React, { useState } from 'react';
import { KeyRound, Lock, UserCheck, Trash2, Edit, Sparkles, Check, X, EyeOff } from 'lucide-react';

export default function MyMessagesView({
  messages,
  receiver,
  onUpdateMessage,
  onDeleteMessage,
  onGoToWrite
}) {
  const [authorInput, setAuthorInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authenticatedMessages, setAuthenticatedMessages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editColor, setEditColor] = useState('');
  const [editFontSize, setEditFontSize] = useState(18);
  const [hasSearched, setHasSearched] = useState(false);

  const handleAuthenticate = (e) => {
    e.preventDefault();
    setHasSearched(true);
    const matched = messages.filter(
      (m) =>
        m.author.trim().toLowerCase() === authorInput.trim().toLowerCase() &&
        m.password === passwordInput.trim()
    );
    setAuthenticatedMessages(matched);
  };

  const handleStartEdit = (msg) => {
    setEditingId(msg.id);
    setEditContent(msg.content);
    setEditColor(msg.color);
    setEditFontSize(msg.fontSize || 18);
  };

  const handleSaveEdit = (id) => {
    onUpdateMessage(id, { content: editContent, color: editColor, fontSize: editFontSize });
    setAuthenticatedMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, content: editContent, color: editColor, fontSize: editFontSize } : m))
    );
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('정말로 이 메시지를 삭제하시겠습니까?')) {
      onDeleteMessage(id);
      setAuthenticatedMessages((prev) => prev.filter((m) => m.id !== id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Info */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-100/80 text-amber-800 rounded-full text-xs font-bold mb-3 shadow-sm">
          <Lock className="w-3.5 h-3.5" />
          <span>개인 작성 메시지 보안 구역</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-800">
          내가 쓴 메시지 확인 및 관리 🔒
        </h2>
        <p className="text-gray-500 text-sm mt-1 max-w-xl mx-auto">
          롤링페이퍼 서프라이즈를 위해 타인의 글은 관리자 외에는 공개되지 않습니다.<br />
          작성 시 설정하신 <b>작성자 이름</b>과 <b>비밀번호</b>로 본인의 메시지만 확인해보세요.
        </p>
      </div>

      {/* Secret Message Counter Banner */}
      <div className="glass-panel p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-l-4 border-l-purple-500">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
            <EyeOff className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-sm sm:text-base">
              현재 {receiver}님을 위해 총 <span className="text-purple-600 font-extrabold text-lg">{messages.length}개</span>의 메시지가 모였습니다!
            </h4>
            <p className="text-xs text-gray-500">
              관리자가 감동적인 배치를 마친 후 최종 선물로 전달될 예정입니다 🎉
            </p>
          </div>
        </div>
        <button
          onClick={onGoToWrite}
          className="btn-primary text-xs py-2 px-4 whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>새 메시지 추가하기</span>
        </button>
      </div>

      {/* Auth Search Form */}
      <div className="glass-panel p-6 sm:p-8 mb-8 max-w-md mx-auto">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
          <KeyRound className="w-5 h-5 text-purple-500" />
          <span>본인 작성 메시지 조회</span>
        </h3>

        <form onSubmit={handleAuthenticate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              작성자 이름
            </label>
            <input
              type="text"
              value={authorInput}
              onChange={(e) => setAuthorInput(e.target.value)}
              placeholder="작성 시 입력한 이름"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              비밀번호
            </label>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="작성 시 설정한 비밀번호"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none text-sm"
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full justify-center py-2.5">
            <UserCheck className="w-4 h-4" />
            <span>내 메시지 검색하기</span>
          </button>
        </form>
      </div>

      {/* Search Results Area */}
      {hasSearched && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b border-gray-200/80 pb-2">
            <span>조회 결과 ({authenticatedMessages.length}건)</span>
          </h3>

          {authenticatedMessages.length === 0 ? (
            <div className="glass-panel p-8 text-center text-gray-500">
              <p className="font-semibold text-gray-700 mb-1">일치하는 메시지를 찾을 수 없습니다 😢</p>
              <p className="text-xs">작성자 이름과 비밀번호가 정확한지 다시 한번 확인해 주세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {authenticatedMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="rounded-2xl p-6 shadow-md relative border border-white/80 transition-all hover:shadow-lg"
                  style={{ backgroundColor: msg.color, fontFamily: msg.font }}
                >
                  <div className="absolute top-4 right-4 text-2xl">
                    {msg.sticker}
                  </div>

                  <div className="mb-3">
                    <span className="text-xs font-bold text-gray-500">From</span>
                    <h4 className="text-base font-bold text-gray-800">{msg.author}</h4>
                  </div>

                  {editingId === msg.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-3 bg-white/90 border border-gray-300 rounded-xl text-sm leading-relaxed"
                        rows={4}
                      />
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600 font-bold">카드 색상:</span>
                          {['#fce7f3', '#fef9c3', '#e0f2fe', '#dcfce7', '#f3e8ff'].map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setEditColor(c)}
                              className={`w-6 h-6 rounded-full border ${editColor === c ? 'ring-2 ring-purple-600 scale-110' : ''}`}
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-gray-600 font-bold">글자 크기:</span>
                          {[
                            { label: '작게', size: 15 },
                            { label: '보통', size: 18 },
                            { label: '크게', size: 22 },
                            { label: '아주크게', size: 26 },
                          ].map((item) => (
                            <button
                              key={item.size}
                              type="button"
                              onClick={() => setEditFontSize(item.size)}
                              className={`px-2 py-0.5 rounded text-xs border font-semibold ${
                                editFontSize === item.size
                                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                                  : 'bg-white/80 text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" /> 취소
                        </button>
                        <button
                          onClick={() => handleSaveEdit(msg.id)}
                          className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-purple-700"
                        >
                          <Check className="w-3.5 h-3.5" /> 저장
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p
                        className="text-gray-800 leading-relaxed whitespace-pre-wrap mb-4"
                        style={{ fontSize: `${msg.fontSize || 18}px` }}
                      >
                        {msg.content}
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-black/5 text-xs text-gray-500">
                        <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStartEdit(msg)}
                            className="p-1.5 text-purple-700 hover:bg-purple-100/50 rounded-lg flex items-center gap-1"
                          >
                            <Edit className="w-3.5 h-3.5" /> 수정
                          </button>
                          <button
                            onClick={() => handleDelete(msg.id)}
                            className="p-1.5 text-red-600 hover:bg-red-100/50 rounded-lg flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> 삭제
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
