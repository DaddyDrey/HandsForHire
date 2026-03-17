import { Icon } from '@iconify/react';

type Props = {
  icon: string;
  width?: number;
  height?: number;
};

export default function IconifyIcon({ icon, width = 20, height = 20 }: Props) {
  return <Icon icon={icon} width={width} height={height} />;
}
