import { Box, Card, CardContent, Typography } from '@mui/material';
import ContainerMax from '../../common/ContainerMax';
import Section from '../../common/Section';
import IconifyIcon from '../../base/IconifyIcon';
import { useLanguage } from '../../../i18n/LanguageContext';
import type { TranslationKey } from '../../../i18n/translations';

const items: { key: TranslationKey; icon: string }[] = [
  { key: 'electrician', icon: 'material-symbols:bolt' },
  { key: 'plumber', icon: 'material-symbols:water-drop' },
  { key: 'carpenter', icon: 'material-symbols:carpenter' },
  { key: 'painter', icon: 'material-symbols:format-paint' },
  { key: 'hvac', icon: 'material-symbols:mode-fan' },
  { key: 'handyman', icon: 'material-symbols:handyman' },
];

export default function Categories() {
  const { t } = useLanguage();

  return (
    <Section>
      <ContainerMax>
        <Typography variant="h2" sx={{ mb: 3 }}>
          {t('popularCategories')}
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
          }}
        >
          {items.map((it) => (
            <Card key={it.key}>
              <CardContent sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <IconifyIcon icon={it.icon} />
                <Typography sx={{ fontWeight: 650 }}>{t(it.key)}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </ContainerMax>
    </Section>
  );
}
