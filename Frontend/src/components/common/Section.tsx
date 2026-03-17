import { Box } from '@mui/material';
import type { BoxProps } from '@mui/material';

export default function Section(props: BoxProps) {
  return (
    <Box
      component="section"
      sx={{ py: { xs: 6, md: 10 }, ...props.sx }}
      {...props}
    />
  );
}
