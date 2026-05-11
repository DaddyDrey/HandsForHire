import { useState, type FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../../api/axiosInstance";
import ContainerMax from "../../components/common/ContainerMax";
import Section from "../../components/common/Section";
import { getUser } from "../../auth/auth";
import { useAnnouncementService } from "../../mock_data/announcements";
import paths from "../../routes/paths";
import type { UserApiDto } from "../../api/messagesApi";

const CATEGORIES = ["Plumbing", "Moving", "Cleaning", "Electrical", "Painting", "Assembly", "HVAC", "Handyman", "Other"];

export default function PostJobPage() {
  const nav = useNavigate();
  const user = getUser();
  const { create } = useAnnouncementService();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const ensureBackendUser = async (): Promise<UserApiDto> => {
    const email = user?.email.trim().toLowerCase();
    if (!email) throw new Error("You need to be logged in to post a job.");

    try {
      const { data } = await axiosInstance.get<UserApiDto>(`/Users/by-email/${encodeURIComponent(email)}`);
      return data;
    } catch {
      const { data } = await axiosInstance.post<UserApiDto>("/Users", {
        fullName: email.split("@")[0],
        email,
      });
      return data;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setError("");

    if (!title.trim() || !description.trim() || !category || !city.trim()) return;

    try {
      setSaving(true);
      const backendUser = await ensureBackendUser();
      await create({
        userId: backendUser.id,
        title: title.trim(),
        description: description.trim(),
        category,
        city: city.trim(),
      });
      nav(paths.account, { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not post job.");
    } finally {
      setSaving(false);
    }
  };

  const hasError = (value: string) => submitted && !value.trim();

  return (
    <Section sx={{ py: { xs: 3, md: 5 } }}>
      <ContainerMax>
        <Stack spacing={3}>
          <Box
            sx={{
              px: { xs: 2.5, md: 4 },
              py: { xs: 3, md: 4 },
              borderRadius: 3,
              border: "1px solid rgba(255,255,255,0.08)",
              background:
                "linear-gradient(135deg, rgba(124,92,255,0.14) 0%, rgba(34,197,94,0.07) 55%, rgba(255,255,255,0.03) 100%)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.22)",
            }}
          >
            <Typography variant="h1" sx={{ fontSize: { xs: "2.3rem", md: "3.25rem" }, lineHeight: 1.05 }}>
              Post a job
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 680 }}>
              Tell professionals what you need, where it is, and what kind of help you are looking for.
            </Typography>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Stack spacing={2.5}>
                  <TextField
                    fullWidth
                    label="Job title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    error={hasError(title)}
                    helperText={hasError(title) ? "Title is required." : ""}
                  />

                  <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                    <FormControl fullWidth error={submitted && !category}>
                      <InputLabel>Category</InputLabel>
                      <Select value={category} label="Category" onChange={(e) => setCategory(e.target.value)}>
                        {CATEGORIES.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      fullWidth
                      label="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      error={hasError(city)}
                      helperText={hasError(city) ? "City is required." : ""}
                    />
                  </Stack>

                  <TextField
                    fullWidth
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    error={hasError(description)}
                    helperText={hasError(description) ? "Description is required." : ""}
                    multiline
                    rows={5}
                  />

                  <Button type="submit" variant="contained" size="large" disabled={saving} sx={{ alignSelf: "flex-start" }}>
                    {saving ? "Posting..." : "Post job"}
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Stack>
      </ContainerMax>
    </Section>
  );
}
