import { Box, Card, CardContent, Typography } from '@mui/material';
import ContainerMax from '../../common/ContainerMax';
import Section from '../../common/Section';
import IconifyIcon from '../../base/IconifyIcon';

const items = [
  { title: 'Electrician', icon: 'material-symbols:bolt' },
  { title: 'Plumber', icon: 'material-symbols:water-drop' },
  { title: 'Carpenter', icon: 'material-symbols:carpenter' },
  { title: 'Painter', icon: 'material-symbols:format-paint' },
  { title: 'HVAC', icon: 'material-symbols:mode-fan' },
  { title: 'Handyman', icon: 'material-symbols:handyman' },
];

export default function Categories() {
  return (
    <Section>
      <ContainerMax>
        <Typography variant="h2" sx={{ mb: 3 }}>
          Popular categories
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
            <Card key={it.title}>
              <CardContent sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <IconifyIcon icon={it.icon} />
                <Typography sx={{ fontWeight: 650 }}>{it.title}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </ContainerMax>
    </Section>
  );
}
