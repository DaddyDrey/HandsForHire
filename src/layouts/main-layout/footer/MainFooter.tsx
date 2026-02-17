import { Box, Divider, Typography } from '@mui/material';
import ContainerMax from '../../../components/common/ContainerMax';

export default function MainFooter() {
  return (
    <Box sx={{ py: 6 }}>
      <ContainerMax>
        <Divider sx={{ mb: 3 }} />
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} HandsForHire. Built with care.
        </Typography>
      </ContainerMax>
    </Box>
  );
}
