import { Avatar, Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import ContainerMax from '../../common/ContainerMax';
import Section from '../../common/Section';

const pros = [
  { name: 'Alex M.', role: 'Electrician', rating: '4.9', tag: 'Verified' },
  { name: 'Irina P.', role: 'Plumber', rating: '4.8', tag: 'Top rated' },
  { name: 'Mihai C.', role: 'Carpenter', rating: '4.9', tag: 'Fast response' },
];

export default function FeaturedPros() {
  return (
    <Section>
      <ContainerMax>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'baseline' }}
          sx={{ mb: 3, gap: 1 }}
        >
          <Typography variant="h2">Featured professionals</Typography>
          <Typography color="text.secondary">Hand-picked based on reviews</Typography>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          }}
        >
          {pros.map((p) => (
            <Card key={p.name}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar>{p.name[0]}</Avatar>

                  <Stack spacing={0.5}>
                    <Typography sx={{ fontWeight: 750 }}>{p.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {p.role} • ⭐ {p.rating}
                    </Typography>
                  </Stack>

                  <Chip
                    label={p.tag}
                    size="small"
                    sx={{ ml: 'auto' }}
                    variant="outlined"
                  />
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      </ContainerMax>
    </Section>
  );
}
