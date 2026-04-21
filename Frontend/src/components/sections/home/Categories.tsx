import { useMemo, useState } from 'react';
import { Box, Card, CardContent, Fade, Paper, Typography } from '@mui/material';
import Popper from '@mui/material/Popper';
import ContainerMax from '../../common/ContainerMax';
import Section from '../../common/Section';
import IconifyIcon from '../../base/IconifyIcon';
import { useLanguage } from '../../../i18n/useLanguage';
import type { TranslationKey } from '../../../i18n/translations';
import { Link as RouterLink } from 'react-router-dom';
import paths from '../../../routes/paths';

const items: {
  key: TranslationKey;
  icon: string;
  descKey: TranslationKey;
  trade: string;
  img: string;
  color: string;
}[] = [
  { key: 'electrician', icon: 'material-symbols:bolt', descKey: 'electricianDesc', trade: 'Electrician', img: '/public/images/categories/electrician.jpg', color: '#F59E0B' },
  { key: 'plumber', icon: 'material-symbols:water-drop', descKey: 'plumberDesc', trade: 'Plumber', img: '/public/images/categories/plumber.jpg', color: '#3B82F6' },
  { key: 'carpenter', icon: 'material-symbols:carpenter', descKey: 'carpenterDesc', trade: 'Carpenter', img: '/public/images/categories/carpenter.jpg', color: '#A16207' },
  { key: 'painter', icon: 'material-symbols:format-paint', descKey: 'painterDesc', trade: 'Painter', img: '/public/images/categories/painter.jpg', color: '#EC4899' },
  { key: 'hvac', icon: 'material-symbols:mode-fan', descKey: 'hvacDesc', trade: 'HVAC', img: '/public/images/categories/hvac.jpg', color: '#22C55E' },
  { key: 'handyman', icon: 'material-symbols:handyman', descKey: 'handymanDesc', trade: 'Handyman', img: '/public/images/categories/handyman.jpg', color: '#7C5CFF' },
];

export default function Categories() {
  const { t } = useLanguage();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [activeKey, setActiveKey] = useState<TranslationKey | null>(null);
  const activeItem = useMemo(() => items.find((x) => x.key === activeKey) ?? null, [activeKey]);
  const open = Boolean(anchorEl && activeItem);

  const handleEnter = (el: HTMLElement, key: TranslationKey) => {
    setAnchorEl(el);
    setActiveKey(key);
  };
  const handleLeave = () => {
    setAnchorEl(null);
    setActiveKey(null);
  };

  return (
    <Section>
      <ContainerMax>
        <Typography variant="h2" sx={{ mb: 1 }}>
          {t('popularCategories')}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3.5 }}>
          Browse by trade and find the right professional for the job.
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          }}
        >
          {items.map((it) => (
            <Card
              key={it.key}
              component={RouterLink}
              to={`${paths.findAPro}?trade=${encodeURIComponent(it.trade)}`}
              onMouseEnter={(e) => handleEnter(e.currentTarget as HTMLElement, it.key)}
              onMouseLeave={handleLeave}
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                cursor: 'pointer',
                borderRadius: 3,
                border: '1px solid rgba(255,255,255,0.07)',
                background: 'rgba(255,255,255,0.03)',
                transition: 'transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease, background 160ms ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: `0 8px 32px ${it.color}22`,
                  borderColor: `${it.color}55`,
                  background: `${it.color}0A`,
                },
              }}
            >
              <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center', py: 2.5 }}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 2,
                    background: `${it.color}1A`,
                    border: `1px solid ${it.color}33`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
<Box sx={{ color: it.color, fontSize: 22, display: 'flex', alignItems: 'center' }}>
  <IconifyIcon icon={it.icon} />
</Box>                </Box>
                <Typography sx={{ fontWeight: 650 }}>{t(it.key)}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Popper
          open={open}
          anchorEl={anchorEl}
          placement="bottom-start"
          transition
          modifiers={[
            { name: 'offset', options: { offset: [0, 10] } },
            { name: 'preventOverflow', options: { padding: 8 } },
          ]}
          sx={{ zIndex: 1400 }}
          onMouseEnter={() => { if (anchorEl && activeKey) { setAnchorEl(anchorEl); setActiveKey(activeKey); } }}
          onMouseLeave={handleLeave}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={160}>
              <Paper elevation={10} sx={{ width: { xs: 'min(92vw, 360px)', sm: 360 }, borderRadius: 3, overflow: 'hidden' }}>
                {activeItem && (
                  <Box>
                    <Box component="img" src={activeItem.img} alt={t(activeItem.key)} sx={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />
                    <Box sx={{ p: 2 }}>
                      <Typography sx={{ fontWeight: 850 }}>{t(activeItem.key)}</Typography>
                      <Typography color="text.secondary" sx={{ mt: 0.5 }}>{t(activeItem.descKey)}</Typography>
                    </Box>
                  </Box>
                )}
              </Paper>
            </Fade>
          )}
        </Popper>
      </ContainerMax>
    </Section>
  );
}
