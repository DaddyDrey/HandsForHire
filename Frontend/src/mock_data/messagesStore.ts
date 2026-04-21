const STORAGE_KEY = 'handsforhire_messages';

export type ChatMessage = {
  id: string;
  from: 'user' | 'pro';
  body: string;
  at: string;
  readAt?: string;
};

export type ProMeta = {
  name: string;
  trade: string;
  city: string;
};

export type Conversation = {
  proId: string;
  proMeta?: ProMeta;
  messages: ChatMessage[];
};

type ConversationsMap = Record<string, Record<string, Conversation>>;

let tick = 0;

function bumpTick() {
  tick++;
}

if (typeof window !== 'undefined') {
  window.addEventListener('hfh:messages-updated', bumpTick);
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) bumpTick();
  });
}

export function getMessagesTick(): number {
  return tick;
}

const CANNED_REPLIES = [
  'Salut! Mulțumesc pentru mesaj, te contactez curând.',
  'Am primit, revin cu detalii imediat.',
  'Salut! Da, sunt disponibil. Când ai nevoie?',
  'Mulțumesc pentru interes. Pot veni și astăzi dacă e urgent.',
  'Salut! Sigur, trimite-mi adresa și vin să văd.',
  'Bună! Pot să îți dau o estimare după ce văd problema.',
];

function loadMap(): ConversationsMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed as ConversationsMap;
    return {};
  } catch {
    return {};
  }
}

function saveMap(map: ConversationsMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  window.dispatchEvent(new CustomEvent('hfh:messages-updated'));
}

function normalize(email: string) {
  return email.trim().toLowerCase();
}

function randomId() {
  return `m-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export type ConversationSummary = {
  proId: string;
  proMeta?: ProMeta;
  lastMessage: ChatMessage | null;
  unreadCount: number;
  total: number;
};

export function getConversations(email: string): ConversationSummary[] {
  const e = normalize(email);
  const map = loadMap();
  const forUser = map[e] ?? {};

  return Object.values(forUser)
    .map((c) => {
      const messages = c.messages;
      const last = messages.length > 0 ? messages[messages.length - 1] : null;
      const unreadCount = messages.filter((m) => m.from === 'pro' && !m.readAt).length;
      return {
        proId: c.proId,
        proMeta: c.proMeta,
        lastMessage: last,
        unreadCount,
        total: messages.length,
      };
    })
    .sort((a, b) => {
      const ta = a.lastMessage?.at ?? '';
      const tb = b.lastMessage?.at ?? '';
      return tb.localeCompare(ta);
    });
}

export function getConversation(email: string, proId: string): Conversation {
  const e = normalize(email);
  const map = loadMap();
  return map[e]?.[proId] ?? { proId, messages: [] };
}

export function totalUnread(email: string): number {
  return getConversations(email).reduce((acc, c) => acc + c.unreadCount, 0);
}

function scheduleAutoReply(email: string, proId: string) {
  const delay = 1200 + Math.floor(Math.random() * 2000);
  setTimeout(() => {
    const e = normalize(email);
    const map = loadMap();
    const convo = map[e]?.[proId];
    if (!convo) return;
    const reply: ChatMessage = {
      id: randomId(),
      from: 'pro',
      body: CANNED_REPLIES[Math.floor(Math.random() * CANNED_REPLIES.length)],
      at: new Date().toISOString(),
    };
    convo.messages.push(reply);
    map[e][proId] = convo;
    saveMap(map);
  }, delay);
}

export function ensureConversation(email: string, proId: string, proMeta?: ProMeta) {
  const e = normalize(email);
  const map = loadMap();
  if (!map[e]) map[e] = {};
  const existing = map[e][proId];
  if (!existing) {
    map[e][proId] = { proId, proMeta, messages: [] };
    saveMap(map);
  } else if (proMeta && !existing.proMeta) {
    existing.proMeta = proMeta;
    map[e][proId] = existing;
    saveMap(map);
  }
}

export function sendMessage(
  email: string,
  proId: string,
  body: string,
  proMeta?: ProMeta
): ChatMessage | null {
  const text = body.trim();
  if (!text) return null;

  const e = normalize(email);
  const map = loadMap();
  if (!map[e]) map[e] = {};
  const convo = map[e][proId] ?? { proId, proMeta, messages: [] };
  if (proMeta && !convo.proMeta) convo.proMeta = proMeta;

  const msg: ChatMessage = {
    id: randomId(),
    from: 'user',
    body: text,
    at: new Date().toISOString(),
    readAt: new Date().toISOString(),
  };
  convo.messages.push(msg);
  map[e][proId] = convo;
  saveMap(map);

  scheduleAutoReply(email, proId);
  return msg;
}

export function markRead(email: string, proId: string) {
  const e = normalize(email);
  const map = loadMap();
  const convo = map[e]?.[proId];
  if (!convo) return;
  let changed = false;
  const now = new Date().toISOString();
  for (const m of convo.messages) {
    if (m.from === 'pro' && !m.readAt) {
      m.readAt = now;
      changed = true;
    }
  }
  if (changed) {
    map[e][proId] = convo;
    saveMap(map);
  }
}

export function deleteConversation(email: string, proId: string) {
  const e = normalize(email);
  const map = loadMap();
  if (map[e]?.[proId]) {
    delete map[e][proId];
    if (Object.keys(map[e]).length === 0) delete map[e];
    saveMap(map);
  }
}

export function subscribeToMessages(listener: () => void): () => void {
  const handler = () => listener();
  window.addEventListener('hfh:messages-updated', handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener('hfh:messages-updated', handler);
    window.removeEventListener('storage', handler);
  };
}
