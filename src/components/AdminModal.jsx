import React, { useState } from 'react';
import { Shield, Lock, X, CheckCircle2 } from 'lucide-react';
import { ADMIN_PASSWORD } from '../utils/storage';

export default function AdminModal({ isOpen, onClose, onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onLoginSuccess();
      setPassword('');
      setError('');
      onClose();
    } else {
      setError('관리자 암호가 일치하지 않습니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-sm p-6 relative shadow-2xl border border-white/80">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">관리자 인증</h3>
          <p className="text-xs text-gray-500 mt-1">
            롤링페이퍼 배치, 글자 크기 수정 및 삭제 권한을 위해 비밀번호를 입력해 주세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1 flex items-center gap-1">
              <Lock className="w-3 h-3 text-purple-500" />
              관리자 비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="비밀번호 입력"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none text-sm"
              autoFocus
            />
            {error && <p className="text-xs text-red-500 mt-1 font-semibold">{error}</p>}
          </div>

          <button type="submit" className="btn-primary w-full justify-center py-2.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>관리자 로그인</span>
          </button>
        </form>
      </div>
    </div>
  );
}
