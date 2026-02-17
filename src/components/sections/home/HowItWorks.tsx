import { Box, Card, CardContent, Typography } from '@mui/material';
import ContainerMax from '../../common/ContainerMax';
import Section from '../../common/Section';

const steps = [
  { title: 'Describe your job', desc: 'Tell us what you need and where.' },
  { title: 'Compare professionals', desc: 'Check profiles, ratings, and pricing.' },
  { title: 'Book & get it done', desc: 'Message, schedule, and pay securely.' },
];

export default function HowItWorks() {
  return (
    <Section>
      <ContainerMax>
        <Typography variant="h2" sx={{ mb: 3 }}>
          How it works
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          }}
        >
          {steps.map((s, idx) => (
            <Card key={s.title}>
              <CardContent>
                <Typography sx={{ fontWeight: 800, opacity: 0.7 }}>
                  0{idx + 1}
                </Typography>

                <Typography variant="h4" sx={{ mt: 1 }}>
                  {s.title}
                </Typography>

                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  {s.desc}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </ContainerMax>
    </Section>
  );
}
