import { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
  TextField,
  Typography,
  Button,
  ToggleButton,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { useNavigate, useSearchParams } from 'react-router-dom';

import ContainerMax from '../../components/common/ContainerMax';
import Section from '../../components/common/Section';
import { useLanguage } from '../../i18n/LanguageContext';
import ViewProfileDialog from '../../components/findAPro/ViewProfileDialog';
import { useProService, type Pro } from '../../mock_data/pros';
import { getUser } from '../../auth/auth';
import paths from '../../routes/paths';

const TRADE_OPTIONS = ['All', 'Electrician', 'Plumber', 'Carpenter', 'Painter', 'HVAC', 'Handyman'] as const;
type TradeOption = (typeof TRADE_OPTIONS)[number];
type SortOption = 'relevance' | 'rating' | 'price_low' | 'price_high';

export default function FindAProPage() {
  const { t } = useLanguage();
  const nav = useNavigate();
  const { getAll } = useProService();

  const [pros, setPros] = useState<Pro[]>([]);
  const [search