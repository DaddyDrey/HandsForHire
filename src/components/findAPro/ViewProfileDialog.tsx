// src/components/findAPro/ViewProfileDialog.tsx
import { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import type { Pro } from '../../mock_data/pros';

type Props = {
  open: boolean;
  onClose: () => void;
  pro: Pro | null;
};

export default function ViewProfileDialog({ open, onClose, pro }: Props) {
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    if (!open) setShowAllReviews(false);
  }, [open]);

  const initials = useMemo(() => {
    if (!pro?.name) return '?';
    return pro.name.trim()[0].toUpperCase();
  }, [pro?.name]);

  const topReviews = useMemo(() => {
    if (!pro) return [];
    const sorted = [...pro.reviews].sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.date.localeCompare(a.date);
    });
    return sorted.slice(0, 3);
  }, [pro]);

  const remainingReviews = useMemo(() => {
    if (!pro) return [];
    const topIds = new Set(topReviews.map((r) => r.id));
    return pro.reviews.filter((r) => !topIds.has(r.id)).slice(0, 7);
  }, [pro, topReviews]);

  if (!pro) return null;

  return (
    <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        scroll="paper"
        slotProps={{
            paper: {
            sx: {
                borderRadius: 3,
                maxHeight: '90vh',
            },
            },
        }}
    >
      <Card elevation={0}>
        <CardContent
            sx={{
                p: { xs: 2, sm: 3 },
                maxHeight: '90vh',
                overflowY: 'auto',

                scrollbarGutter: 'stable',

                '&::-webkit-scrollbar': {
                width: 10,
                },
                '&::-webkit-scrollbar-track': {
                background: 'rgba(124,92,255,0.10)',
                borderRadius: 999,
                },
                '&::-webkit-scrollbar-thumb': {
                background: 'linear-gradient(180deg, rgba(124,92,255,0.85), rgba(34,197,94,0.85))',
                borderRadius: 999,
                border: '2px solid rgba(255,255,255,0.6)',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                background: 'linear-gradient(180deg, rgba(124,92,255,1), rgba(34,197,94,1))',
                },

                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(124,92,255,0.85) rgba(124,92,255,0.10)',
            }}
        >
            
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ width: 64, height: 64 }}>{initials}</Avatar>

            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography sx={{ fontWeight: 850, fontSize: 20 }} noWrap>
                {pro.name}
              </Typography>

              <Typography color="text.secondary" noWrap>
                {pro.trade} • {pro.city} • {pro.age} years
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.75, flexWrap: 'wrap' }}>
                <Chip
                  size="small"
                  variant="outlined"
                  label={
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <StarRoundedIcon fontSize="small" />
                      <span>
                        {pro.rating.toFixed(1)} ({pro.reviewsCount})
                      </span>
                    </Stack>
                  }
                />
                <Chip size="small" variant="outlined" label={`${pro.hourlyFrom}€/h`} />
                {pro.tags.slice(0, 3).map((t) => (
                  <Chip key={t} size="small" variant="outlined" label={t} />
                ))}
              </Stack>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 140 }}>
              <Button fullWidth variant="contained">
                Message
              </Button>
              <Button fullWidth variant="outlined" onClick={onClose}>
                Close
              </Button>
            </Box>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Typography sx={{ fontWeight: 750, mb: 0.5 }}>About</Typography>
          <Typography color="text.secondary">{pro.description}</Typography>

          <Divider sx={{ my: 2 }} />

          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Typography sx={{ fontWeight: 750 }}>Reviews</Typography>
            {pro.reviews.length > 3 && (
              <Button variant="text" onClick={() => setShowAllReviews((v) => !v)}>
                {showAllReviews ? 'Show less' : 'View more'}
              </Button>
            )}
          </Stack>

          <Stack spacing={1.25} sx={{ mt: 1.5 }}>
            {topReviews.map((r) => (
              <Card key={r.id} variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent sx={{ py: 1.25 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                    <Typography sx={{ fontWeight: 750 }}>{r.author}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {r.date}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.25 }}>
                    <StarRoundedIcon fontSize="small" />
                    <Typography variant="body2">{r.rating.toFixed(1)}</Typography>
                  </Stack>
                  <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                    {r.text}
                  </Typography>
                </CardContent>
              </Card>
            ))}

            {showAllReviews &&
              remainingReviews.map((r) => (
                <Card key={r.id} variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent sx={{ py: 1.25 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                      <Typography sx={{ fontWeight: 750 }}>{r.author}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {r.date}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.25 }}>
                      <StarRoundedIcon fontSize="small" />
                      <Typography variant="body2">{r.rating.toFixed(1)}</Typography>
                    </Stack>
                    <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                      {r.text}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
          </Stack>
        </CardContent>
      </Card>
    </Dialog>
  );
}