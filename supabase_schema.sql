-- ========================================================
-- 롤링페이퍼 (Rolling Paper) Supabase 테이블 & 실시간(Realtime) 설정 스크립트
-- Supabase 대시보드 -> SQL Editor 에서 본 내용을 붙여넣고 [Run]을 누르세요!
-- ========================================================

-- 1. messages 테이블 생성
CREATE TABLE IF NOT EXISTS public.messages (
  id TEXT PRIMARY KEY,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  password TEXT NOT NULL,
  color TEXT DEFAULT '#fce7f3',
  font TEXT DEFAULT 'Gaegu',
  font_size INTEGER DEFAULT 18,
  sticker TEXT DEFAULT '🐱',
  x DOUBLE PRECISION DEFAULT 100,
  y DOUBLE PRECISION DEFAULT 100,
  width INTEGER DEFAULT 280,
  height INTEGER DEFAULT 220,
  rotation DOUBLE PRECISION DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. receiver_settings (롤링페이퍼 대상자 이름) 테이블 생성
CREATE TABLE IF NOT EXISTS public.receiver_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  receiver_name TEXT NOT NULL DEFAULT '김철수 팀장님',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 초기 수신자 이름 데이터 삽입
INSERT INTO public.receiver_settings (id, receiver_name)
VALUES (1, '김철수 팀장님')
ON CONFLICT (id) DO NOTHING;

-- 3. Row Level Security (RLS) 설정 (모든 사용자가 자유롭게 읽기/쓰기/수정/삭제 가능하도록 허용)
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receiver_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to messages" ON public.messages
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public access to receiver_settings" ON public.receiver_settings
  FOR ALL USING (true) WITH CHECK (true);

-- 4. Supabase Realtime (실시간 동기화) 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.receiver_settings;
