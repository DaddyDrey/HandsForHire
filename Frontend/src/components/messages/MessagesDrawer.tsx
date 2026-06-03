import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import {
  Avatar,
  Badge,
  Box,
  Drawer,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';

import { useLanguage } from '../../translations/LanguageContext';
import { getUser } from '../../auth/auth';
import {
  deleteConversation,
  fetchAllConversations,
  fetchMessages,
  getCombinedConversations,
  getConversation,
  getMessagesTick,
  getOtherTyping,
  markRead,
  sendMessage,
  setTyping,
  subscribeToMessages,
  type ChatMessage,
  type ConversationSummary,
  type InboxMode,
} from '../../services/messagesStore';
import { useMessagesDrawer } from './MessagesDrawerContext';

function formatRelative(iso: string, t: (k: Parameters<ReturnType<typeof useLanguage>['t']>[0]) => string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return t('justNow');
  if (mins < 60) return t('minutesAgo').replace('{n}', String(mins));
  const hours = Math.floor(mins / 60);
  if (hours < 24) return t('hoursAgo').replace('{n}', String(hours));
  const days = Math.floor(hours / 24);
  if (days < 7) return t('daysAgo').replace('{n}', String(days));
  return iso.slice(0, 10);
}

function ThreadInput({
  disabled,
  onSend,
  onTyping,
}: {
  disabled: boolean;
  onSend: (body: string) => void;
  onTyping: () => void;
}) {
  const { t } = useLanguage();
  const [value, setValue] = useState('');
  const lastTypingAt = useRef(0);
  const submit = () => {
    const text = value.trim();
    if (!text) return;
    onSend(text);
    setValue('');
  };
  return (
    <Stack direction="row" spacing={1} alignItems="flex-end">
      <TextField
        fullWidth
        multiline
        maxRows={4}
        size="small"
        placeholder={t('messageInputPlaceholder')}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (e.target.value.trim() && Date.now() - lastTypingAt.current > 900) {
            lastTypingAt.current = Date.now();
            onTyping();
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        disabled={disabled}
      />
      <IconButton
        color="primary"
        onClick={submit}
        disabled={disabled || value.trim().length === 0}
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          '&:hover': { bgcolor: 'primary.dark' },
          '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)' },
        }}
      >
        <SendRoundedIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
}

function MessageBubble({
  message,
  proInitial,
  mode,
}: {
  message: ChatMessage;
  proInitial: string;
  mode: InboxMode;
}) {
  const mine = mode === 'client' ? message.from === 'user' : message.from === 'pro';
  return (
    <Stack
      direction="row"
      spacing={0.75}
      alignItems="flex-end"
      sx={{
        justifyContent: mine ? 'flex-end' : 'flex-start',
        '@keyframes hfhMessageIn': {
          from: { opacity: 0, transform: 'translateY(10px) scale(0.98)' },
          to: { opacity: 1, transform: 'translateY(0) scale(1)' },
        },
        animation: 'hfhMessageIn 220ms ease-out both',
      }}
    >
      {!mine && <Avatar sx={{ width: 26, height: 26, fontSize: 12 }}>{proInitial}</Avatar>}
      <Box
        sx={{
          maxWidth: '80%',
          px: 1.5,
          py: 1,
          borderRadius: '16px',
          borderBottomRightRadius: mine ? '4px' : '16px',
          borderBottomLeftRadius: mine ? '16px' : '4px',
          bgcolor: mine ? 'primary.main' : 'rgba(255,255,255,0.06)',
          color: mine ? 'primary.contrastText' : 'text.primary',
          border: mine ? 'none' : '1px solid rgba(255,255,255,0.08)',
          boxShadow: mine
            ? '0 2px 8px rgba(124,92,255,0.25)'
            : '0 1px 4px rgba(0,0,0,0.15)',
          opacity: message.pending ? 0.72 : 1,
          transition: 'opacity 160ms ease, transform 160ms ease, box-shadow 160ms ease',
        }}
      >
        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {message.body}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 0.25,
            fontSize: 10,
            color: mine ? 'rgba(255,255,255,0.78)' : 'text.secondary',
            textAlign: 'right',
          }}
        >
          {new Date(message.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {message.pending ? ' ...' : message.failed ? ' !' : ''}
        </Typography>
      </Box>
    </Stack>
  );
}

function TypingIndicator({ initial }: { initial: string }) {
  return (
    <Stack
      direction="row"
      spacing={0.75}
      alignItems="flex-end"
      sx={{
        '@keyframes hfhTypingDot': {
          '0%, 80%, 100%': { transform: 'translateY(0)', opacity: 0.45 },
          '40%': { transform: 'translateY(-4px)', opacity: 1 },
        },
        '@keyframes hfhTypingIn': {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        animation: 'hfhTypingIn 180ms ease-out both',
      }}
    >
      <Avatar sx={{ width: 26, height: 26, fontSize: 12 }}>{initial}</Avatar>
      <Stack
        direction="row"
        spacing={0.45}
        sx={{
          px: 1.25,
          py: 1.1,
          borderRadius: '16px',
          borderBottomLeftRadius: '4px',
          bgcolor: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {[0, 1, 2].map((dot) => (
          <Box
            key={dot}
            sx={{
              width: 6,
              height: 6,
              borderRadius: 999,
              bgcolor: 'text.secondary',
              animation: 'hfhTypingDot 1s ease-in-out infinite',
              animationDelay: `${dot * 120}ms`,
            }}
          />
        ))}
      </Stack>
    </Stack>
  );
}

function ConversationRow({
  summary,
  active,
  onClick,
}: {
  summary: ConversationSummary;
  active: boolean;
  onClick: () => void;
}) {
  const { t } = useLanguage();
  const pro = summary.proMeta;
  const initial = pro?.name?.trim()[0]?.toUpperCase() ?? '?';
  const last = summary.lastMessage;
  const lastIsMine = last && (summary.mode === 'client' ? last.from === 'user' : last.from === 'pro');
  const preview = last ? (lastIsMine ? `${t('youLabel')}: ` : '') + last.body : '';

  return (
    <Box
      onClick={onClick}
      sx={{
        p: 1.25,
        borderRadius: 2,
        cursor: 'pointer',
        bgcolor: active ? 'rgba(124,92,255,0.14)' : 'transparent',
        border: active ? '1px solid rgba(124,92,255,0.45)' : '1px solid transparent',
        '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' },
        transition: 'background-color 120ms ease',
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="center">
        <Badge color="primary" badgeContent={summary.unreadCount} overlap="circular">
          <Avatar sx={{ width: 40, height: 40 }}>{initial}</Avatar>
        </Badge>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" spacing={1}>
            <Typography sx={{ fontWeight: 750, fontSize: 14 }} noWrap>
              {pro?.name ?? t('newConversation')}
            </Typography>
            {last && (
              <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap', fontSize: 11 }}>
                {formatRelative(last.at, t)}
              </Typography>
            )}
          </Stack>
          <Typography variant="body2" color="text.secondary" noWrap sx={{ fontSize: 13 }}>
            {preview || (pro ? `${pro.trade} • ${pro.city}` : '')}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

export default function MessagesDrawer() {
  const { t } = useLanguage();
  const { isOpen, activeProId, modeRequest, closeDrawer, setActiveProId } = useMessagesDrawer();
  const user = getUser();
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<InboxMode>('client');
  const [otherTyping, setOtherTyping] = useState(false);

  useSyncExternalStore(subscribeToMessages, getMessagesTick, getMessagesTick);

  const conversations: ConversationSummary[] = user ? getCombinedConversations(user.email) : [];
  const active = user && activeProId ? getConversation(user.email, activeProId, mode) : null;
  const activePro = active?.proMeta;
  const initial = activePro?.name?.trim()[0]?.toUpperCase() ?? '?';

  const userEmail = user?.email;

  useEffect(() => {
    if (modeRequest) setMode(modeRequest.mode);
  }, [modeRequest?.id]);

  useEffect(() => {
    if (!userEmail || !isOpen) return;
    fetchAllConversations(userEmail);
    const id = window.setInterval(() => {
      fetchAllConversations(userEmail);
    }, 2500);
    return () => window.clearInterval(id);
  }, [userEmail, isOpen]);

  useEffect(() => {
    if (!userEmail || !activeProId || !isOpen) return;
    fetchMessages(userEmail, activeProId, mode);
    const id = window.setInterval(() => {
      fetchMessages(userEmail, activeProId, mode);
      markRead(userEmail, activeProId, mode);
    }, 1500);
    return () => window.clearInterval(id);
  }, [userEmail, activeProId, isOpen, mode]);

  useEffect(() => {
    if (userEmail && activeProId && isOpen) markRead(userEmail, activeProId, mode);
  }, [userEmail, activeProId, isOpen, active?.messages.length, mode]);

  useEffect(() => {
    if (!userEmail || !activeProId || !isOpen) {
      setOtherTyping(false);
      return;
    }

    let alive = true;
    const checkTyping = () => {
      getOtherTyping(userEmail, activeProId, mode).then((isTyping) => {
        if (alive) setOtherTyping(isTyping);
      });
    };
    checkTyping();
    const id = window.setInterval(checkTyping, 900);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, [userEmail, activeProId, isOpen, mode]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || !active) return;
    el.scrollTop = el.scrollHeight;
  }, [active, active?.messages.length]);

  const handleSend = (body: string) => {
    if (!user || !activeProId) return;
    sendMessage(user.email, activeProId, body, activePro, mode);
  };

  const handleTyping = () => {
    if (!user || !activeProId) return;
    setTyping(user.email, activeProId, mode);
  };

  const handleDelete = () => {
    if (!user || !activeProId) return;
    if (!window.confirm(t('confirmDelete'))) return;
    deleteConversation(user.email, activeProId, mode);
    setActiveProId(null);
  };

  const showThread = !!activeProId;

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={closeDrawer}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100vw', sm: 400 },
            maxWidth: '100vw',
            bgcolor: 'background.default',
            backgroundImage: 'none',
            borderLeft: '1px solid rgba(255,255,255,0.08)',
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}
        >
          {showThread ? (
            <IconButton size="small" onClick={() => setActiveProId(null)}>
              <ArrowBackRoundedIcon />
            </IconButton>
          ) : null}

          <Box sx={{ flex: 1, minWidth: 0 }}>
            {showThread && activePro ? (
              <Stack direction="row" spacing={1.25} alignItems="center">
                <Avatar sx={{ width: 36, height: 36 }}>{initial}</Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 15 }} noWrap>
                    {activePro.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {activePro.trade} • {activePro.city}
                  </Typography>
                </Box>
              </Stack>
            ) : (
              <Typography sx={{ fontWeight: 850, fontSize: 18, pl: 0.5 }}>
                {t('messagesTitle')}
              </Typography>
            )}
          </Box>

          {showThread && active && active.messages.length > 0 && (
            <IconButton size="small" color="error" onClick={handleDelete} title={t('deleteConversation')}>
              <DeleteOutlineRoundedIcon fontSize="small" />
            </IconButton>
          )}

          <IconButton size="small" onClick={closeDrawer}>
            <CloseRoundedIcon />
          </IconButton>
        </Stack>

        {!showThread ? (
          <Box sx={{ flex: 1, overflowY: 'auto', p: 1 }}>
            {conversations.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 44, opacity: 0.5, mb: 1 }} />
                <Typography sx={{ fontWeight: 750 }}>{t('noConversations')}</Typography>
                <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
                  {t('startFromPro')}
                </Typography>
              </Box>
            ) : (
              <Stack spacing={0.5}>
                {conversations.map((c) => (
                  <ConversationRow
                    key={`${c.mode}-${c.proId}`}
                    summary={c}
                    active={false}
                    onClick={() => {
                      setMode(c.mode);
                      setActiveProId(c.proId);
                    }}
                  />
                ))}
              </Stack>
            )}
          </Box>
        ) : (
          <>
            <Box
              ref={scrollerRef}
              sx={{
                flex: 1,
                overflowY: 'auto',
                p: 1.5,
                display: 'flex',
                flexDirection: 'column',
                gap: 0.75,
                '&::-webkit-scrollbar': { width: 6 },
                '&::-webkit-scrollbar-track': {
                  background: 'rgba(124,92,255,0.08)',
                  borderRadius: 999,
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'linear-gradient(180deg, rgba(124,92,255,0.85), rgba(34,197,94,0.85))',
                  borderRadius: 999,
                },
              }}
            >
              {!active || active.messages.length === 0 ? (
                <Box sx={{ m: 'auto', textAlign: 'center' }}>
                  <Typography color="text.secondary" variant="body2">
                    {t('noMessagesYet')}
                  </Typography>
                </Box>
              ) : (
                active.messages.map((m) => (
                  <MessageBubble key={m.id} message={m} proInitial={initial} mode={mode} />
                ))
              )}
              {otherTyping && <TypingIndicator initial={initial} />}
            </Box>

            <Box sx={{ p: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
              <ThreadInput key={`${mode}-${activeProId}`} disabled={!activePro} onSend={handleSend} onTyping={handleTyping} />
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
}
