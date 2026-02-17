import { Container } from '@mui/material';
import type { ContainerProps } from '@mui/material';

export default function ContainerMax(props: ContainerProps) {
  return <Container maxWidth="lg" {...props} />;
}
