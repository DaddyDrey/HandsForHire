import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import { professionsApi, type ProfessionDto } from "../../api/professionsApi";

export default function ProfessionsPage() {
  const theme = useTheme();
  const [professions, setProfessions] = useState<ProfessionDto[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadProfessions = async () => {
    try {
      setLoading(true);
      setProfessions(await professionsApi.getAll());
      setError("");
    } catch {
      setError("Failed to load professions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProfessions();
  }, []);

  const addProfession = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    try {
      setSaving(true);
      const created = await professionsApi.create(trimmed);
      setProfessions((current) => [...current, created].sort((a, b) => a.name.localeCompare(b.name)));
      setName("");
      setError("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not add profession.");
    } finally {
      setSaving(false);
    }
  };

  const removeProfession = async (profession: ProfessionDto) => {
    try {
      await professionsApi.remove(profession.id);
      setProfessions((current) => current.filter((item) => item.id !== profession.id));
      setError("");
    } catch {
      setError("Could not delete profession.");
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={500} gutterBottom>Approved professions</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Control which trades can be selected by professionals.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper elevation={0} sx={{ bgcolor: "background.paper", border: `1px solid ${theme.palette.divider}`, borderRadius: 2, p: 2 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mb: 2 }}>
          <TextField
            size="small"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void addProfession();
            }}
            placeholder="Profession name"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AddRoundedIcon sx={{ fontSize: 16, color: "text.disabled" }} />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1 }}
          />
          <Button variant="contained" onClick={() => void addProfession()} disabled={saving || !name.trim()}>
            Add
          </Button>
        </Stack>

        {loading ? (
          <Typography color="text.secondary" sx={{ py: 3, textAlign: "center" }}>Loading...</Typography>
        ) : professions.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 3, textAlign: "center" }}>No professions yet</Typography>
        ) : (
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
            {professions.map((profession) => (
              <Chip
                key={profession.id}
                label={profession.name}
                onDelete={() => void removeProfession(profession)}
                deleteIcon={<DeleteOutlineRoundedIcon />}
                variant="outlined"
              />
            ))}
          </Stack>
        )}
      </Paper>
    </Box>
  );
}
