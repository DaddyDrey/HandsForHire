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
  fetchConversations,
  fetchMessages,
  getConversation,
  getConversations,
  getMessagesTick,
  markRead,
  sendMessage,
  subscribeToMessages,
  type ChatMessage,
  type ConversationSummary,
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
}: {
  disabled: boolean;
  onSend: (body: string) => void;
}) {
  const { t } = useLanguage();
  const [value, setValue] = useState('');
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
        onChange={(e) => setValue(e.target.value)}
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

function MessageBubble({ message, proInitial }: { message: ChatMessage; proInitial: string }) {
  const mine = message.from === 'user';
  return (
    <Stack
      direction="row"
      spacing={0.75}
      alignItems="flex-end"
      sx={{ justifyContent: mine ? 'flex-end' : 'flex-start' }}
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
        </Typography>
      </Box>
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
  const preview = last ? (last.from === 'user' ? `${t('youLabel')}: ` : '') + last.body : '';

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
  const { isOpen, activeProId, closeDrawer, setActiveProId } = useMessagesDrawer();
  const user = getUser();
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useSyncExternalStore(subscribeToMessages, getMessagesTick, getMessagesTick);

  const conversations: ConversationSummary[] = user ? getConversations(user.email) : [];
  const active = user && activeProId ? getConversation(user.email, activeProId) : null;
  const activePro = active?.proMeta;
  const initial = activePro?.name?.trim()[0]?.toUpperCase() ?? '?';

  const userEmail = user?.email;

  useEffect(() => {
    if (userEmail && isOpen) fetchConversations(userEmail);
  }, [userEmail, isOpen]);

  useEffect(() => {
    if (userEmail && activeProId && isOpen) fetchMessages(userEmail, activeProId);
  }, [userEmail, activeProId, isOpen]);

  useEffect(() => {
    if (userEmail && activeProId && isOpen) markRead(userEmail, activeProId);
  }, [userEmail, activeProId, isOpen, active?.messages.length]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || !active) return;
    el.scrollTop = el.scrollHeight;
  }, [active, active?.messages.length]);

  const handleSend = (body: string) => {
    if (!user || !activeProId) return;
    sendMessage(user.email, activeProId, body);
  };

  const handleDelete = () => {
    if (!user || !activeProId) return;
    if (!window.confirm(t('confirmDelete'))) return;
    deleteConversation(user.email, activeProId);
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
                    key={c.proId}
                    summary={c}
                    active={false}
                    onClick={() => setActiveProId(c.proId)}
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
                  <MessageBubble key={m.id} message={m} proInitial={initial} />
                ))
              )}
            </Box>

            <Box sx={{ p: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
              <ThreadInput key={activeProId} disabled={!activePro} onSend={handleSend} />
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
}
