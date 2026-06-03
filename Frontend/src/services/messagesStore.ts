import {
  messagesApi,
  type ConversationApiDto,
  type MessageApiDto,
} from '../api/messagesApi';
import { prosApi } from '../api/prosApi';

export type InboxMode = 'client' | 'professional';

export type ChatMessage = {
  id: string;
  from: 'user' | 'pro';
  body: string;
  at: string;
  readAt?: string;
  pending?: boolean;
  failed?: boolean;
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
  mode: InboxMode;
};

const userIdCache = new Map<string, number>();
const proIdCache = new Map<string, number | null>();
const conversationsByInbox = new Map<string, ConversationSummary[]>();
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

function inboxKey(email: string, mode: InboxMode) {
  return `${normalize(email)}|${mode}`;
}

function convoKey(email: string, proId: string, mode: InboxMode) {
  return `${inboxKey(email, mode)}|${proId}`;
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

function convertSummary(c: ConversationApiDto, mode: InboxMode): ConversationSummary {
  const last: ChatMessage | null = c.lastMessageBody
    ? {
        id: `last-${c.id}`,
        from: mode === 'client' ? 'pro' : 'user',
        body: c.lastMessageBody,
        at: c.lastMessageAt,
      }
    : null;

  const clientName = c.userName || c.userEmail || 'Client';

  return {
    proId: mode === 'client' ? String(c.proId) : String(c.id),
    backendId: c.id,
    proMeta:
      mode === 'client'
        ? { name: c.proName, trade: c.proTrade, city: c.proCity }
        : { name: clientName, trade: 'Client', city: c.userEmail },
    lastMessage: last,
    unreadCount: c.unreadCount,
    total: 0,
    mode,
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

export async function resolveProId(email: string): Promise<number | null> {
  const e = normalize(email);
  if (proIdCache.has(e)) return proIdCache.get(e)!;
  const pro = await prosApi.getByEmail(e);
  const proId = pro?.status !== 'Suspended' ? pro?.id ?? null : null;
  proIdCache.set(e, proId);
  return proId;
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

function findSummary(email: string, proId: string, mode: InboxMode): ConversationSummary | undefined {
  return getConversations(email, mode).find((c) => c.proId === proId);
}

function getBackendId(email: string, proId: string, mode: InboxMode): number | undefined {
  return conversationByKey.get(convoKey(email, proId, mode))?.backendId ?? findSummary(email, proId, mode)?.backendId;
}

function upsertLocalConversation(
  email: string,
  proId: string,
  proMeta?: ProMeta,
  backendId?: number,
  mode: InboxMode = 'client'
) {
  const key = convoKey(email, proId, mode);
  const current = conversationByKey.get(key);
  conversationByKey.set(key, {
    proId,
    backendId: backendId ?? current?.backendId,
    proMeta: proMeta ?? current?.proMeta,
    messages: current?.messages ?? [],
  });
  bumpTick();
}

export function getConversations(email: string, mode: InboxMode = 'client'): ConversationSummary[] {
  return conversationsByInbox.get(inboxKey(email, mode)) ?? [];
}

export function getCombinedConversations(email: string): ConversationSummary[] {
  return [...getConversations(email, 'client'), ...getConversations(email, 'professional')].sort((a, b) => {
    const aTime = a.lastMessage?.at ?? '';
    const bTime = b.lastMessage?.at ?? '';
    return bTime.localeCompare(aTime);
  });
}

export function getConversation(
  email: string,
  proId: string,
  mode: InboxMode = 'client'
): Conversation {
  return (
    conversationByKey.get(convoKey(email, proId, mode)) ?? {
      proId,
      proMeta: findSummary(email, proId, mode)?.proMeta,
      backendId: findSummary(email, proId, mode)?.backendId,
      messages: [],
    }
  );
}

export function totalUnread(email: string): number {
  return (
    getConversations(email, 'client').reduce((acc, c) => acc + c.unreadCount, 0) +
    getConversations(email, 'professional').reduce((acc, c) => acc + c.unreadCount, 0)
  );
}

export async function fetchConversations(
  email: string,
  mode: InboxMode = 'client'
): Promise<void> {
  try {
    if (mode === 'client') {
      const userId = await resolveUserId(email);
      if (userId == null) return;
      const data = await messagesApi.getConversationsForUser(userId);
      conversationsByInbox.set(inboxKey(email, mode), data.map((c) => convertSummary(c, mode)));
      bumpTick();
      return;
    }

    const proId = await resolveProId(email);
    if (proId == null) return;
    const data = await messagesApi.getConversationsForPro(proId);
    conversationsByInbox.set(inboxKey(email, mode), data.map((c) => convertSummary(c, mode)));
    bumpTick();
  } catch {
    // Backend is unavailable; keep the local drawer state stable.
  }
}

export async function fetchAllConversations(email: string): Promise<void> {
  await Promise.all([
    fetchConversations(email, 'client'),
    resolveProId(email).then((proId) =>
      proId == null ? Promise.resolve() : fetchConversations(email, 'professional')
    ),
  ]);
}

export async function fetchMessages(
  email: string,
  proId: string,
  mode: InboxMode = 'client'
): Promise<void> {
  const backendId =
    mode === 'client' ? (await resolveBackendConvo(email, proId))?.id : getBackendId(email, proId, mode);
  if (!backendId) return;

  try {
    const messages = await messagesApi.getMessages(backendId);
    const summary = findSummary(email, proId, mode);
    const proMeta = summary?.proMeta;
    const current = conversationByKey.get(convoKey(email, proId, mode));
    const savedMessages = messages.map(convertMessage);
    const pendingMessages =
      current?.messages.filter(
        (message) =>
          message.pending &&
          !savedMessages.some((saved) => saved.body === message.body && saved.from === message.from)
      ) ?? [];
    conversationByKey.set(convoKey(email, proId, mode), {
      proId,
      backendId,
      proMeta,
      messages: [...savedMessages, ...pendingMessages],
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
  proMeta?: ProMeta,
  mode: InboxMode = 'client'
): Promise<void> {
  const text = body.trim();
  if (!text) return;

  const backendId =
    mode === 'client' ? (await resolveBackendConvo(email, proId))?.id : getBackendId(email, proId, mode);
  if (!backendId) return;

  try {
    upsertLocalConversation(email, proId, proMeta, backendId, mode);
    const key = convoKey(email, proId, mode);
    const current = conversationByKey.get(key);
    const optimistic: ChatMessage = {
      id: `pending-${Date.now()}`,
      from: mode === 'client' ? 'user' : 'pro',
      body: text,
      at: new Date().toISOString(),
      pending: true,
    };
    conversationByKey.set(key, {
      proId,
      backendId,
      proMeta: proMeta ?? current?.proMeta,
      messages: [...(current?.messages ?? []), optimistic],
    });
    bumpTick();
    await messagesApi.sendMessage(backendId, mode === 'client' ? 'User' : 'Pro', text);
    await fetchMessages(email, proId, mode);
    await fetchAllConversations(email);
  } catch {
    const key = convoKey(email, proId, mode);
    const current = conversationByKey.get(key);
    if (current) {
      conversationByKey.set(key, {
        ...current,
        messages: current.messages.map((message) =>
          message.pending && message.body === text ? { ...message, pending: false, failed: true } : message
        ),
      });
      bumpTick();
    }
  }
}

export async function markRead(
  email: string,
  proId: string,
  mode: InboxMode = 'client'
): Promise<void> {
  const backendId = getBackendId(email, proId, mode);
  if (!backendId) return;
  try {
    await messagesApi.markReadAs(backendId, mode === 'client' ? 'User' : 'Pro');
    await fetchMessages(email, proId, mode);
    await fetchAllConversations(email);
  } catch {
    // Backend is unavailable; keep the local drawer state stable.
  }
}

export async function setTyping(
  email: string,
  proId: string,
  mode: InboxMode = 'client'
): Promise<void> {
  const backendId = getBackendId(email, proId, mode);
  if (!backendId) return;
  try {
    await messagesApi.setTyping(backendId, mode === 'client' ? 'User' : 'Pro');
  } catch {
    // Backend is unavailable; typing can safely be skipped.
  }
}

export async function getOtherTyping(
  email: string,
  proId: string,
  mode: InboxMode = 'client'
): Promise<boolean> {
  const backendId = getBackendId(email, proId, mode);
  if (!backendId) return false;
  try {
    return await messagesApi.getOtherTyping(backendId, mode === 'client' ? 'User' : 'Pro');
  } catch {
    return false;
  }
}

export async function deleteConversation(
  email: string,
  proId: string,
  mode: InboxMode = 'client'
): Promise<void> {
  const backendId = getBackendId(email, proId, mode);
  if (!backendId) return;
  try {
    await messagesApi.deleteConversation(backendId);
    conversationByKey.delete(convoKey(email, proId, mode));
    await fetchConversations(email, mode);
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
