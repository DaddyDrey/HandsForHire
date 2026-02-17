import { Box, Card, CardContent, Typography } from '@mui/material';
import ContainerMax from '../../common/ContainerMax';
import Section from '../../common/Section';

const quotes = [
  { text: 'Booked a plumber in 10 minutes. Super smooth.', author: 'Dana' },
  { text: 'Great quality work and fair price. Loved the reviews feature.', author: 'Vlad' },
  { text: 'Found a reliable electrician for my apartment renovation.', author: 'Elena' },
];

export default function Testimonials() {
  return (
    <Section>
      <ContainerMax>
        <Typography variant="h2" sx={{ mb: 3 }}>
          People love it
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          }}
        >
          {quotes.map((q) => (
            <Card key={q.author}>
              <CardContent>
                <Typography sx={{ mb: 2 }}>"{q.text}"</Typography>
                <Typography variant="body2" color="text.secondary">
                  — {q.author}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </ContainerMax>
    </Section>
  );
}
