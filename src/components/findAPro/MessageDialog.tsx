import { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { Pro } from '../../mock_data/pros';

type Props = {
  open: boolean;
  onClose: () => void;
  pro: Pro | null;
  onSend?: (payload: { proId: string; message: string }) => void;
};

export default function MessageDialog({ open, onClose, pro, onSend }: Props) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!open) setMessage('');
  }, [open]);

  const initials = useMemo(() => {
    if (!pro?.name) return '?';
    return pro.name.trim()[0].toUpperCase();
  }, [pro?.name]);

  const canSend = !!pro && message.trim().length >= 2;

  const handleSend = () => {
    if (!pro) return;
    const text = message.trim();
    if (text.length < 2) return;

    onSend?.({ proId: pro.id, message: text });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: { borderRadius: 3 },
        },
      }}
    >
      <DialogTitle sx={{ pb: 1.5 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar>{initials}</Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={{ fontWeight: 850 }} noWrap>
              {pro?.name ?? 'Message'}
            </Typography>
            {pro && (
              <Typography variant="body2" color="text.secondary" noWrap>
                {pro.trade} • {pro.city}
              </Typography>
            )}
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        <TextField
          autoFocus
          fullWidth
          multiline
          minRows={4}
          label="Your message"
          placeholder="Hi! I need help with..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" disabled={!canSend} onClick={handleSend}>
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
}