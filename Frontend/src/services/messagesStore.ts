import {
  messagesApi,
  type ConversationApiDto,
  type MessageApiDto,
} from '../api/messagesApi';

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
  backendId?: number;
  proMeta?: ProMeta;
  messages: ChatMessage[];
};

export type ConversationSummary = {
  proId: string;
  backendId: number;
  proMeta?: ProMeta;
  lastMessage: ChatMessage | null;
  unreadCount: number;
  total: number;
};

const userIdCache = new Map<string, number>();
const conversationsByEmail = new Map<string, ConversationSummary[]>();
const conversationByKey = new Map<string, Conversation>();

let tick = 0;

function bumpTick() {
  tick++;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('hfh:messages-updated'));
  }
}

export function getMessagesTick(): number {
  return tick;
}

function normalize(email: string) {
  return email.trim().toLowerCase();
}

function convoKey(email: string, proId: string) {
  return `${normalize(email)}|${proId}`;
}

function convertMessage(m: MessageApiDto): ChatMessage {
  return {
    id: String(m.id),
    from: m.from === 'User' ? 'user' : 'pro',
    body: m.body,
    at: m.sentAt,
    readAt: m.readAt ?? undefined,
  };
}

function convertSummary(c: ConversationApiDto): ConversationSummary {
  const last: ChatMessage | null = c.lastMessageBody
    ? {
        id: `last-${c.id}`,
        from: 'pro',
        body: c.lastMessageBody,
        at: c.lastMessageAt,
      }
    : null;

  return {
    proId: String(c.proId),
    backendId: c.id,
    proMeta: { name: c.proName, trade: c.proTrade, city: c.proCity },
    lastMessage: last,
    unreadCount: c.unreadCount,
    total: 0,
  };
}

async function resolveUserId(email: string): Promise<number | null> {
  const e = normalize(email);
  if (userIdCache.has(e)) return userIdCache.get(e)!;
  let user = await messagesApi.getUserByEmail(e);
  if (!user) {
    user = await messagesApi.createUser(e, e);
  }
  if (user) {
    userIdCache.set(e, user.id);
    return user.id;
  }
  return null;
}

async function resolveBackendConvo(
  email: string,
  proId: string
): Promise<ConversationApiDto | null> {
  const userId = await resolveUserId(email);
  if (userId == null) return null;
  const pid = parseInt(proId, 10);
  if (Number.isNaN(pid)) return null;
  try {
    return await messagesApi.ensureConversation(userId, pid);
  } catch {
    return null;
  }
}

function upsertLocalConversation(email: string, proId: string, proMeta?: ProMeta, backendId?: number) {
  const key = convoKey(email, proId);
  const current = conversationByKey.get(key);
  conversationByKey.set(key, {
    proId,
    backendId: backendId ?? current?.backendId,
    proMeta: proMeta ?? current?.proMeta,
    messages: current?.messages ?? [],
  });
  bumpTick();
}

export function getConversations(email: string): ConversationSummary[] {
  return conversationsByEmail.get(normalize(email)) ?? [];
}

export function getConversation(email: string, proId: string): Conversation {
  return (
    conversationByKey.get(convoKey(email, proId)) ?? {
      proId,
      messages: [],
    }
  );
}

export function totalUnread(email: string): number {
  return getConversations(email).reduce((acc, c) => acc + c.unreadCount, 0);
}

export async function fetchConversations(email: string): Promise<void> {
  const userId = await resolveUserId(email);
  if (userId == null) return;
  try {
    const data = await messagesApi.getConversationsForUser(userId);
    conversationsByEmail.set(normalize(email), data.map(convertSummary));
    bumpTick();
  } catch {
    // Backend is unavailable; keep the local drawer state stable.
  }
}

export async function fetchMessages(email: string, proId: string): Promise<void> {
  const convo = await resolveBackendConvo(email, proId);
  if (!convo) return;
  try {
    const messages = await messagesApi.getMessages(convo.id);
    conversationByKey.set(convoKey(email, proId), {
      proId,
      backendId: convo.id,
      proMeta: { name: convo.proName, trade: convo.proTrade, city: convo.proCity },
      messages: messages.map(convertMessage),
    });
    bumpTick();
  } catch {
    // Backend is unavailable; keep the local drawer state stable.
  }
}

export async function ensureConversation(
  email: string,
  proId: string,
  proMeta?: ProMeta
): Promise<void> {
  upsertLocalConversation(email, proId, proMeta);
  const convo = await resolveBackendConvo(email, proId);
  if (convo) {
    upsertLocalConversation(email, proId, {
      name: convo.proName,
      trade: convo.proTrade,
      city: convo.proCity,
    }, convo.id);
  }
  await fetchConversations(email);
}

export async function sendMessage(
  email: string,
  proId: string,
  body: string,
  proMeta?: ProMeta
): Promise<void> {
  const text = body.trim();
  if (!text) return;
  upsertLocalConversation(email, proId, proMeta);
  const convo = await resolveBackendConvo(email, proId);
  if (!convo) return;

  try {
    await messagesApi.sendMessage(convo.id, 'User', text);
    await fetchMessages(email, proId);
    await fetchConversations(email);
  } catch {
    // Backend is unavailable; keep the local drawer state stable.
  }
}

export async function markRead(email: string, proId: string): Promise<void> {
  const existing = conversationByKey.get(convoKey(email, proId));
  const backendId = existing?.backendId;
  if (!backendId) return;
  try {
    await messagesApi.markRead(backendId);
    await fetchMessages(email, proId);
    await fetchConversations(email);
  } catch {
    // Backend is unavailable; keep the local drawer state stable.
  }
}

export async function deleteConversation(email: string, proId: string): Promise<void> {
  const existing = conversationByKey.get(convoKey(email, proId));
  const backendId = existing?.backendId;
  if (!backendId) return;
  try {
    await messagesApi.deleteConversation(backendId);
    conversationByKey.delete(convoKey(email, proId));
    await fetchConversations(email);
  } catch {
    // Backend is unavailable; keep the local drawer state stable.
  }
}

export function subscribeToMessages(listener: () => void): () => void {
  const handler = () => listener();
  window.addEventListener('hfh:messages-updated', handler);
  return () => {
    window.removeEventListener('hfh:messages-updated', handler);
  };
}
