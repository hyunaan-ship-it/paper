import { supabase, isSupabaseConfigured } from './supabaseClient';

const STORAGE_KEY_MESSAGES = 'rolling_paper_messages_v1';
const STORAGE_KEY_RECEIVER = 'rolling_paper_receiver_v1';
const STORAGE_KEY_PUBLISHED = 'rolling_paper_published_v1';
const STORAGE_KEY_PAGE_COUNT = 'rolling_paper_page_count_v1';

export const ADMIN_PASSWORD = 'a12345x';

const DEFAULT_RECEIVER = '김철수 팀장님';

const SAMPLE_MESSAGES = [
  {
    id: 'msg-sample-1',
    author: '이영희 차장',
    content: '팀장님! 그동안 함께 프로젝트 진행하면서 너무 많은 것을 배웠습니다. 새로운 지역에서도 멋진 활약 기대하겠습니다! 응원할게요 🌸',
    password: '1234',
    color: '#fce7f3',
    font: 'Gaegu',
    fontSize: 18,
    sticker: '🐱',
    x: 80,
    y: 90,
    width: 280,
    height: 220,
    rotation: -2,
    page: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'msg-sample-2',
    author: '박민수 대리',
    content: '늘 따뜻한 조언과 맛있는 커피 사주셔서 감사했습니다! 멀리 가시더라도 가끔 놀러오세요 ☕✈️',
    password: '5678',
    color: '#fef9c3',
    font: 'Nanum Pen Script',
    fontSize: 22,
    sticker: '📷',
    x: 400,
    y: 80,
    width: 290,
    height: 210,
    rotation: 3,
    page: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'msg-sample-3',
    author: '최지훈 과장',
    content: '인사이동 축하드립니다! 어디서든 팀장님의 리더십은 빛날 겁니다. 건강하시고 승승장구하세요!! 👍✨',
    password: '9012',
    color: '#e0f2fe',
    font: 'Gowun Batang',
    fontSize: 17,
    sticker: '🎉',
    x: 230,
    y: 330,
    width: 310,
    height: 230,
    rotation: -1,
    page: 1,
    createdAt: new Date().toISOString(),
  }
];

// Helper to map DB column names (font_size -> fontSize)
const mapDBMessageToApp = (dbMsg) => ({
  id: dbMsg.id,
  author: dbMsg.author,
  content: dbMsg.content,
  password: dbMsg.password,
  color: dbMsg.color,
  font: dbMsg.font,
  fontSize: dbMsg.font_size || dbMsg.fontSize || 18,
  sticker: dbMsg.sticker,
  x: dbMsg.x,
  y: dbMsg.y,
  width: dbMsg.width,
  height: dbMsg.height,
  rotation: dbMsg.rotation,
  page: dbMsg.page || 1,
  createdAt: dbMsg.created_at || dbMsg.createdAt,
});

const mapAppMessageToDB = (appMsg) => ({
  id: appMsg.id,
  author: appMsg.author,
  content: appMsg.content,
  password: appMsg.password,
  color: appMsg.color,
  font: appMsg.font,
  font_size: appMsg.fontSize,
  sticker: appMsg.sticker,
  x: appMsg.x,
  y: appMsg.y,
  width: appMsg.width,
  height: appMsg.height,
  rotation: appMsg.rotation,
  page: appMsg.page || 1,
  created_at: appMsg.createdAt || new Date().toISOString(),
});

export const fetchReceiverNameAsync = async () => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase
        .from('receiver_settings')
        .select('receiver_name')
        .eq('id', 1)
        .single();
      if (data && data.receiver_name) {
        localStorage.setItem(STORAGE_KEY_RECEIVER, data.receiver_name);
        return data.receiver_name;
      }
    } catch (e) {
      console.warn('Supabase receiver fetch failed, fallback to local', e);
    }
  }
  return localStorage.getItem(STORAGE_KEY_RECEIVER) || DEFAULT_RECEIVER;
};

export const getReceiverName = () => {
  return localStorage.getItem(STORAGE_KEY_RECEIVER) || DEFAULT_RECEIVER;
};

export const setReceiverName = async (name) => {
  localStorage.setItem(STORAGE_KEY_RECEIVER, name);
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('receiver_settings')
        .upsert({ id: 1, receiver_name: name, updated_at: new Date().toISOString() });
    } catch (e) {
      console.error('Failed to sync receiver to Supabase', e);
    }
  }
  window.dispatchEvent(new Event('storage-messages-updated'));
};

export const fetchBoardPublishedAsync = async () => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase
        .from('receiver_settings')
        .select('is_published')
        .eq('id', 1)
        .single();
      if (data && data.is_published !== undefined && data.is_published !== null) {
        localStorage.setItem(STORAGE_KEY_PUBLISHED, String(data.is_published));
        return Boolean(data.is_published);
      }
    } catch (e) {
      console.warn('Supabase is_published fetch failed, fallback to local', e);
    }
  }
  const val = localStorage.getItem(STORAGE_KEY_PUBLISHED);
  return val === null ? true : val === 'true';
};

export const getIsBoardPublished = () => {
  const val = localStorage.getItem(STORAGE_KEY_PUBLISHED);
  return val === null ? true : val === 'true';
};

export const setIsBoardPublished = async (published) => {
  localStorage.setItem(STORAGE_KEY_PUBLISHED, String(published));
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('receiver_settings')
        .upsert({ id: 1, is_published: published, updated_at: new Date().toISOString() });
    } catch (e) {
      console.error('Failed to sync is_published to Supabase', e);
    }
  }
  window.dispatchEvent(new Event('storage-messages-updated'));
};

export const fetchPageCountAsync = async () => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase
        .from('receiver_settings')
        .select('page_count')
        .eq('id', 1)
        .single();
      if (data && data.page_count) {
        localStorage.setItem(STORAGE_KEY_PAGE_COUNT, String(data.page_count));
        return data.page_count;
      }
    } catch (e) {
      console.warn('Supabase page_count fetch failed, fallback to local', e);
    }
  }
  const val = localStorage.getItem(STORAGE_KEY_PAGE_COUNT);
  return val ? parseInt(val) : 1;
};

export const getPageCount = () => {
  const val = localStorage.getItem(STORAGE_KEY_PAGE_COUNT);
  return val ? parseInt(val) : 1;
};

export const setPageCount = async (count) => {
  localStorage.setItem(STORAGE_KEY_PAGE_COUNT, String(count));
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('receiver_settings')
        .upsert({ id: 1, page_count: count, updated_at: new Date().toISOString() });
    } catch (e) {
      console.error('Failed to sync page_count to Supabase', e);
    }
  }
  window.dispatchEvent(new Event('storage-messages-updated'));
};

export const fetchMessagesAsync = async () => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        const mapped = data.map(mapDBMessageToApp);
        localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(mapped));
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase fetch failed, fallback to LocalStorage', e);
    }
  }
  return getMessages();
};

export const getMessages = () => {
  const data = localStorage.getItem(STORAGE_KEY_MESSAGES);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(SAMPLE_MESSAGES));
    return SAMPLE_MESSAGES;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return SAMPLE_MESSAGES;
  }
};

export const saveMessages = (messages) => {
  localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
  window.dispatchEvent(new Event('storage-messages-updated'));
};

export const addMessage = async (newMessage) => {
  const messageWithDefaults = {
    id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    x: 100 + Math.floor(Math.random() * 300),
    y: 120 + Math.floor(Math.random() * 200),
    width: 280,
    height: 220,
    fontSize: 18,
    rotation: parseFloat((Math.random() * 6 - 3).toFixed(1)),
    page: newMessage.page || 1,
    createdAt: new Date().toISOString(),
    ...newMessage,
  };

  const currentLocal = getMessages();
  saveMessages([messageWithDefaults, ...currentLocal]);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('messages').insert([mapAppMessageToDB(messageWithDefaults)]);
    } catch (e) {
      console.error('Supabase add message error', e);
    }
  }

  return messageWithDefaults;
};

export const updateMessage = async (id, updatedFields) => {
  const currentLocal = getMessages();
  const updated = currentLocal.map((msg) =>
    msg.id === id ? { ...msg, ...updatedFields } : msg
  );
  saveMessages(updated);

  if (isSupabaseConfigured && supabase) {
    try {
      const dbFields = {};
      if (updatedFields.author !== undefined) dbFields.author = updatedFields.author;
      if (updatedFields.content !== undefined) dbFields.content = updatedFields.content;
      if (updatedFields.color !== undefined) dbFields.color = updatedFields.color;
      if (updatedFields.font !== undefined) dbFields.font = updatedFields.font;
      if (updatedFields.fontSize !== undefined) dbFields.font_size = updatedFields.fontSize;
      if (updatedFields.sticker !== undefined) dbFields.sticker = updatedFields.sticker;
      if (updatedFields.x !== undefined) dbFields.x = updatedFields.x;
      if (updatedFields.y !== undefined) dbFields.y = updatedFields.y;
      if (updatedFields.width !== undefined) dbFields.width = updatedFields.width;
      if (updatedFields.height !== undefined) dbFields.height = updatedFields.height;
      if (updatedFields.rotation !== undefined) dbFields.rotation = updatedFields.rotation;
      if (updatedFields.page !== undefined) dbFields.page = updatedFields.page;

      await supabase.from('messages').update(dbFields).eq('id', id);
    } catch (e) {
      console.error('Supabase update message error', e);
    }
  }
};

export const deleteMessage = async (id) => {
  const currentLocal = getMessages();
  const updated = currentLocal.filter((msg) => msg.id !== id);
  saveMessages(updated);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('messages').delete().eq('id', id);
    } catch (e) {
      console.error('Supabase delete message error', e);
    }
  }
};

// Supabase Realtime Subscription Listener
export const subscribeToRealtimeChanges = (onUpdateCallback) => {
  if (!isSupabaseConfigured || !supabase) return () => {};

  try {
    const channel = supabase
      .channel('rolling-paper-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        async () => {
          const latest = await fetchMessagesAsync();
          onUpdateCallback(latest);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'receiver_settings' },
        async () => {
          await fetchReceiverNameAsync();
          onUpdateCallback(getMessages());
        }
      )
      .subscribe();

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch (err) {
        console.warn('Failed to remove channel:', err);
      }
    };
  } catch (err) {
    console.warn('Realtime subscription error:', err);
    return () => {};
  }
};

export const exportDataJSON = () => {
  const data = {
    receiver: getReceiverName(),
    messages: getMessages(),
    exportedAt: new Date().toISOString(),
  };
  const dataStr =
    'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute(
    'download',
    `rolling_paper_${getReceiverName()}_backup.json`
  );
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

export const importDataJSON = async (jsonString) => {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.receiver) await setReceiverName(parsed.receiver);
    if (Array.isArray(parsed.messages)) {
      saveMessages(parsed.messages);
      if (isSupabaseConfigured && supabase) {
        const dbMapped = parsed.messages.map(mapAppMessageToDB);
        await supabase.from('messages').upsert(dbMapped);
      }
    }
    return true;
  } catch (err) {
    console.error('Invalid JSON import file', err);
    return false;
  }
};
