import type { PaletteOptions } from '@mui/material/styles';
import { paletteForMode, themeModes } from './themeModes';

const palette: PaletteOptions = paletteForMode(themeModes[0]);

export default palette;
