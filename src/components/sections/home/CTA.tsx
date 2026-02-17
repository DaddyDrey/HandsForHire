import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import ContainerMax from '../../common/ContainerMax';
import Section from '../../common/Section';

export default function CTA() {
  return (
    <Section>
      <ContainerMax>
        <Card>
          <CardContent>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              alignItems={{ xs: 'stretch', md: 'center' }}
              justifyContent="space-between"
            >
              <Box>
                <Typography variant="h3">Ready to get work done?</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  Post a job or join as a professional — we’ll handle the matching.
                </Typography>
              </Box>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button variant="contained" size="large">Find a pro</Button>
                <Button variant="outlined" size="large">Become a pro</Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </ContainerMax>
    </Section>
  );
}
