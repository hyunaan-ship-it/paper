import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import UserMessageForm from './components/UserMessageForm';
import MyMessagesView from './components/MyMessagesView';
import AdminCanvasBoard from './components/AdminCanvasBoard';
import AdminModal from './components/AdminModal';
import {
  getMessages,
  saveMessages,
  addMessage,
  updateMessage,
  deleteMessage,
  getReceiverName,
  setReceiverName,
  getIsBoardPublished,
  setIsBoardPublished,
  fetchBoardPublishedAsync,
  fetchMessagesAsync,
  fetchReceiverNameAsync,
  subscribeToRealtimeChanges,
  exportDataJSON,
  importDataJSON
} from './utils/storage';
import { isSupabaseConfigured } from './utils/supabaseClient';

export default function App() {
  const [receiver, setReceiver] = useState(getReceiverName());
  const [messages, setMessages] = useState(getMessages());
  const [isBoardPublished, setIsBoardPublishedState] = useState(getIsBoardPublished());
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('board');

  // Initial fetch and Realtime sync
  useEffect(() => {
    const initData = async () => {
      const rec = await fetchReceiverNameAsync();
      setReceiver(rec);
      const pub = await fetchBoardPublishedAsync();
      setIsBoardPublishedState(pub);
      const msgs = await fetchMessagesAsync();
      setMessages(msgs);
    };

    initData();

    // Local Storage Listener
    const handleStorageUpdate = () => {
      setMessages(getMessages());
      setReceiver(getReceiverName());
      setIsBoardPublishedState(getIsBoardPublished());
    };
    window.addEventListener('storage-messages-updated', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);

    // Supabase Realtime Listener
    const unsubscribe = subscribeToRealtimeChanges((updatedMsgs) => {
      setMessages([...updatedMsgs]);
      setReceiver(getReceiverName());
      setIsBoardPublishedState(getIsBoardPublished());
    });

    return () => {
      window.removeEventListener('storage-messages-updated', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
      unsubscribe();
    };
  }, []);

  const handleToggleBoardPublished = async () => {
    const nextVal = !isBoardPublished;
    await setIsBoardPublished(nextVal);
    setIsBoardPublishedState(nextVal);
  };

  const handleSetReceiver = async (name) => {
    await setReceiverName(name);
    setReceiver(name);
  };

  const handleAddMessage = async (newMessageData) => {
    const created = await addMessage(newMessageData);
    setMessages(getMessages());
    return created;
  };

  const handleUpdateMessage = async (id, fields) => {
    await updateMessage(id, fields);
    setMessages(getMessages());
  };

  const handleDeleteMessage = async (id) => {
    await deleteMessage(id);
    setMessages(getMessages());
  };

  const handleBatchUpdateMessages = async (batchMessages) => {
    saveMessages(batchMessages);
    setMessages(batchMessages);
    for (const msg of batchMessages) {
      await updateMessage(msg.id, { x: msg.x, y: msg.y, rotation: msg.rotation });
    }
  };

  const handleImportJSON = async (jsonString) => {
    if (await importDataJSON(jsonString)) {
      setMessages(getMessages());
      setReceiver(getReceiverName());
      alert('롤링페이퍼 데이터를 성공적으로 불러왔습니다! 🎈');
    } else {
      alert('유효하지 않은 데이터 파일입니다.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-primary">
      {/* Top Status Banner if Supabase is active */}
      {isSupabaseConfigured && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[11px] font-bold py-1 px-4 text-center shadow-inner flex items-center justify-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-300 animate-ping"></span>
          <span>Supabase 실시간 클라우드 DB 연동 중 (모든 사람과 동기화됩니다)</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        receiver={receiver}
        setReceiver={handleSetReceiver}
        isAdmin={isAdmin}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onLogoutAdmin={() => setIsAdmin(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExport={exportDataJSON}
        onImport={handleImportJSON}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'board' && (
          <AdminCanvasBoard
            messages={messages}
            receiver={receiver}
            isAdmin={isAdmin}
            isBoardPublished={isBoardPublished}
            onToggleBoardPublished={handleToggleBoardPublished}
            onUpdateMessage={handleUpdateMessage}
            onDeleteMessage={handleDeleteMessage}
            onBatchUpdateMessages={handleBatchUpdateMessages}
            onGoToWrite={() => setActiveTab('write')}
          />
        )}

        {activeTab === 'write' && (
          <UserMessageForm
            receiver={receiver}
            onAddMessage={handleAddMessage}
            onSuccessRedirect={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'my-messages' && (
          <MyMessagesView
            messages={messages}
            receiver={receiver}
            onUpdateMessage={handleUpdateMessage}
            onDeleteMessage={handleDeleteMessage}
            onGoToWrite={() => setActiveTab('write')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-sm border-t border-gray-200/60 py-4 px-6 text-center text-xs text-gray-500">
        <p>© 2026 롤링페이퍼 맘 (Rolling Paper Studio) - 인사이동 구성원을 위한 따뜻한 축하 서비스 🌸</p>
      </footer>

      {/* Admin Authentication Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onLoginSuccess={() => {
          setIsAdmin(true);
          setActiveTab('board');
        }}
      />
    </div>
  );
}
