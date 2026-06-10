import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import { useNavigate } from "react-router-dom";

import { getUser, isSuspended } from "../../auth/auth";
import { prosApi, type ProApiDto, type ProStatus } from "../../api/prosApi";
import { announcementsApi, type AnnouncementApiDto, type AnnouncementStatus } from "../../api/announcementsApi";
import { messagesApi } from "../../api/messagesApi";
import ContainerMax from "../../components/common/ContainerMax";
import Section from "../../components/common/Section";
import paths from "../../routes/paths";
import { useLanguage } from "../../translations/useLanguage";
import type { TranslationKey } from "../../translations/translations";

const statusKey: Record<ProStatus, TranslationKey> = {
  Pending: "statusPending",
  Verified: "statusVerified",
  Suspended: "statusSuspended",
};

const requestStatusKey: Record<AnnouncementStatus, TranslationKey> = {
  Open: "statusOpen",
  InProgress: "statusInProgress",
  Completed: "statusCompleted",
  Cancelled: "statusCancelled",
  Paused: "statusPaused",
};

const requestCategories: Array<{ value: string; key: TranslationKey }> = [
  { value: "Plumbing", key: "catPlumbing" },
  { value: "Moving", key: "catMoving" },
  { value: "Cleaning", key: "catCleaning" },
  { value: "Electrical", key: "catElectrical" },
  { value: "Painting", key: "catPainting" },
  { value: "Assembly", key: "catAssembly" },
  { value: "HVAC", key: "catHvac" },
  { value: "Handyman", key: "catHandyman" },
  { value: "Other", key: "otherTrade" },
];

export default function MyListingsPage() {
  const { t } = useLanguage();
  const nav = useNavigate();
  const user = getUser();
  const userEmail = user?.email;
  const suspended = isSuspended(user);

  const [listings, setListings] = useState<ProApiDto[]>([]);
  const [requests, setRequests] = useState<AnnouncementApiDto[]>([]);
  const [backendUserId, setBackendUserId] = useState<number | null>(null);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");

  useEffect(() => {
    if (!userEmail) {
      setServicesLoading(false);
      return;
    }

    let cancelled = false;
    setServicesLoading(true);
    prosApi.getAllByEmail(userEmail)
      .then((data) => {
        if (!cancelled) setListings(data);
      })
      .catch(() => {
        if (!cancelled) {
          setSeverity("error");
          setMessage(t("couldNotLoadPros"));
          setListings([]);
        }
      })
      .finally(() => {
        if (!cancelled) setServicesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [t, userEmail]);

  useEffect(() => {
    if (!userEmail) {
      setRequestsLoading(false);
      return;
    }

    let cancelled = false;
    setRequestsLoading(true);
    messagesApi.getUserByEmail(userEmail)
      .then(async (backendUser) => {
        if (!backendUser) return [];
        if (!cancelled) setBackendUserId(backendUser.id);
        return announcementsApi.getForUser(backendUser.id);
      })
      .then((data) => {
        if (!cancelled) setRequests(data);
      })
      .catch(() => {
        if (!cancelled) {
          setSeverity("error");
          setMessage(t("couldNotLoadRequests"));
          setRequests([]);
        }
      })
      .finally(() => {
        if (!cancelled) setRequestsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [t, userEmail]);

  const activeListings = useMemo(
    () => listings.filter((listing) => listing.status !== "Suspended"),
    [listings]
  );

  const activeRequests = useMemo(
    () => requests.filter((request) => request.status !== "Completed" && request.status !== "Cancelled"),
    [requests]
  );

  const getRequestCategoryLabel = (category: string) => {
    const match = requestCategories.find((item) => item.value === category);
    return match ? t(match.key) : category;
  };

  const deleteListing = async (id: number) => {
    if (!window.confirm(t("deleteProProfileBtn"))) return;

    try {
      await prosApi.delete(id);
      setListings((current) => current.filter((listing) => listing.id !== id));
      setSeverity("success");
      setMessage(t("proProfileDeletedToast"));
    } catch {
      setSeverity("error");
      setMessage(t("couldNotDeleteProProfile"));
    }
  };

  const deleteRequest = async (id: number) => {
    if (!window.confirm(t("deleteRequestConfirm"))) return;

    try {
      if (backendUserId) await announcementsApi.deleteForUser(id, backendUserId);
      else await announcementsApi.delete(id);
      setRequests((current) => current.filter((request) => request.id !== id));
      setSeverity("success");
      setMessage(t("requestDeletedToast"));
    } catch {
      setSeverity("error");
      setMessage(t("couldNotDeleteRequest"));
    }
  };

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
                "linear-gradient(135deg, rgba(124,92,255,0.14) 0%, rgba(34,197,94,0.08) 58%, rgba(255,255,255,0.03) 100%)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.22)",
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems={{ xs: "stretch", md: "center" }}
              justifyContent="space-between"
            >
              <Box>
                <Typography
                  variant="h1"
                  sx={{ fontSize: { xs: "2.25rem", md: "3.1rem" }, lineHeight: 1.05 }}
                >
                  {t('MyListings')}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 680 }}>
                  {t('ListingsDescription')}
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddRoundedIcon />}
                onClick={() => nav(paths.becomeAPro)}
                disabled={suspended}
                sx={{ alignSelf: { xs: "stretch", md: "center" } }}
              >
                {t("createNewListing")}
              </Button>
            </Stack>
          </Box>

          {message && <Alert severity={severity}>{message}</Alert>}
          {suspended && <Alert severity="warning">{t("suspendedCreationBlocked")}</Alert>}

          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              borderColor: "rgba(255,255,255,0.10)",
              background:
                "linear-gradient(135deg, rgba(18,25,44,0.94) 0%, rgba(16,25,38,0.92) 55%, rgba(22,35,30,0.90) 100%)",
            }}
          >
            <CardContent sx={{ p: { xs: 2, md: 2.75 } }}>
              <Stack spacing={2.25}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "stretch", sm: "center" }}
                  spacing={1.5}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 850, fontSize: 18 }}>{t("activeServices")}</Typography>
                    <Typography color="text.secondary" variant="body2">
                      {activeListings.length} {t("listingsCountLabel")}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<AddRoundedIcon />}
                    onClick={() => nav(paths.becomeAPro)}
                    disabled={suspended}
                  >
                    {t("newBtn")}
                  </Button>
                </Stack>

                <Divider />

                {servicesLoading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : activeListings.length === 0 ? (
                  <Box
                    sx={{
                      py: 6,
                      px: 2,
                      textAlign: "center",
                      borderRadius: 2,
                      border: "1px dashed rgba(255,255,255,0.16)",
                      bgcolor: "rgba(255,255,255,0.025)",
                    }}
                  >
                    <WorkOutlineRoundedIcon sx={{ fontSize: 44, opacity: 0.6, mb: 1 }} />
                    <Typography sx={{ fontWeight: 850, fontSize: 18 }}>{t("noActiveListingsYet")}</Typography>
                    <Typography color="text.secondary" sx={{ mt: 0.75, mb: 2 }}>
                      {t("createFirstService")}
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddRoundedIcon />}
                      onClick={() => nav(paths.becomeAPro)}
                      disabled={suspended}
                    >
                      {t("createNewListing")}
                    </Button>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "grid",
                      gap: 2,
                      gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
                    }}
                  >
                    {activeListings.map((listing) => (
                      <Stack
                        key={listing.id}
                        spacing={1.75}
                        sx={{
                          p: { xs: 1.75, md: 2 },
                          minWidth: 0,
                          borderRadius: 2,
                          border: "1px solid rgba(255,255,255,0.10)",
                          bgcolor: "rgba(255,255,255,0.035)",
                          transition: "border-color 150ms ease, background-color 150ms ease, transform 150ms ease",
                          "&:hover": {
                            borderColor: "rgba(124,92,255,0.45)",
                            bgcolor: "rgba(124,92,255,0.08)",
                            transform: "translateY(-1px)",
                          },
                        }}
                      >
                        <Stack direction="row" spacing={1.5} alignItems="flex-start">
                          <Avatar
                            sx={{
                              width: 42,
                              height: 42,
                              bgcolor: "rgba(124,92,255,0.22)",
                              color: "primary.light",
                              border: "1px solid rgba(124,92,255,0.35)",
                            }}
                          >
                            {listing.trade[0]?.toUpperCase() ?? "L"}
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                              <Typography sx={{ fontWeight: 900, fontSize: 17 }} noWrap>
                                {listing.trade}
                              </Typography>
                              <Chip size="small" label={t(statusKey[listing.status])} variant="outlined" />
                            </Stack>
                            <Typography color="text.secondary" variant="body2" noWrap>
                              {listing.fullName}
                            </Typography>
                          </Box>
                          <Button
                            color="error"
                            variant="outlined"
                            size="small"
                            startIcon={<DeleteOutlineRoundedIcon />}
                            onClick={() => deleteListing(listing.id)}
                            sx={{ flexShrink: 0 }}
                          >
                            {t("deleteMenuItem")}
                          </Button>
                        </Stack>

                        <Typography
                          color="text.secondary"
                          variant="body2"
                          sx={{
                            minHeight: 40,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {listing.description || t("noDescriptionProvided")}
                        </Typography>

                        <Box
                          sx={{
                            display: "grid",
                            gap: 1,
                            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ minWidth: 0, color: "text.secondary" }}
                          >
                            <LocationOnOutlinedIcon sx={{ fontSize: 18 }} />
                            <Typography variant="body2" noWrap>
                              {listing.city}
                            </Typography>
                          </Stack>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ minWidth: 0, color: "text.secondary" }}
                          >
                            <PaymentsOutlinedIcon sx={{ fontSize: 18 }} />
                            <Typography variant="body2" noWrap>
                              {listing.hourlyRate} / h
                            </Typography>
                          </Stack>
                        </Box>
                      </Stack>
                    ))}
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>

          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              borderColor: "rgba(255,255,255,0.10)",
              background:
                "linear-gradient(135deg, rgba(18,25,44,0.94) 0%, rgba(28,25,48,0.91) 54%, rgba(35,30,20,0.88) 100%)",
            }}
          >
            <CardContent sx={{ p: { xs: 2, md: 2.75 } }}>
              <Stack spacing={2.25}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "stretch", sm: "center" }}
                  spacing={1.5}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 850, fontSize: 18 }}>{t("activeRequests")}</Typography>
                    <Typography color="text.secondary" variant="body2">
                      {activeRequests.length} {t("requestsCountLabel")}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<AddRoundedIcon />}
                    onClick={() => nav(paths.postJob)}
                    disabled={suspended}
                  >
                    {t("newBtn")}
                  </Button>
                </Stack>

                <Divider />

                {requestsLoading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : activeRequests.length === 0 ? (
                  <Box
                    sx={{
                      py: 6,
                      px: 2,
                      textAlign: "center",
                      borderRadius: 2,
                      border: "1px dashed rgba(255,255,255,0.16)",
                      bgcolor: "rgba(255,255,255,0.025)",
                    }}
                  >
                    <WorkOutlineRoundedIcon sx={{ fontSize: 44, opacity: 0.6, mb: 1 }} />
                    <Typography sx={{ fontWeight: 850, fontSize: 18 }}>{t("noActiveRequestsYet")}</Typography>
                    <Typography color="text.secondary" sx={{ mt: 0.75, mb: 2 }}>
                      {t("createFirstRequest")}
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddRoundedIcon />}
                      onClick={() => nav(paths.postJob)}
                      disabled={suspended}
                    >
                      {t("createNewRequest")}
                    </Button>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "grid",
                      gap: 2,
                      gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
                    }}
                  >
                    {activeRequests.map((request) => (
                      <Stack
                        key={request.id}
                        spacing={1.75}
                        sx={{
                          p: { xs: 1.75, md: 2 },
                          minWidth: 0,
                          borderRadius: 2,
                          border: "1px solid rgba(255,255,255,0.10)",
                          bgcolor: "rgba(255,255,255,0.035)",
                          transition: "border-color 150ms ease, background-color 150ms ease, transform 150ms ease",
                          "&:hover": {
                            borderColor: "rgba(245,158,11,0.45)",
                            bgcolor: "rgba(245,158,11,0.08)",
                            transform: "translateY(-1px)",
                          },
                        }}
                      >
                        <Stack direction="row" spacing={1.5} alignItems="flex-start">
                          <Avatar
                            sx={{
                              width: 42,
                              height: 42,
                              bgcolor: "rgba(245,158,11,0.18)",
                              color: "warning.light",
                              border: "1px solid rgba(245,158,11,0.30)",
                            }}
                          >
                            {request.title[0]?.toUpperCase() ?? "R"}
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                              <Typography sx={{ fontWeight: 900, fontSize: 17 }} noWrap>
                                {request.title}
                              </Typography>
                              <Chip size="small" label={t(requestStatusKey[request.status])} variant="outlined" />
                            </Stack>
                            <Typography color="text.secondary" variant="body2" noWrap>
                              {getRequestCategoryLabel(request.category)}
                            </Typography>
                          </Box>
                          <Button
                            color="error"
                            variant="outlined"
                            size="small"
                            startIcon={<DeleteOutlineRoundedIcon />}
                            onClick={() => deleteRequest(request.id)}
                            sx={{ flexShrink: 0 }}
                          >
                            {t("deleteMenuItem")}
                          </Button>
                        </Stack>

                        <Typography
                          color="text.secondary"
                          variant="body2"
                          sx={{
                            minHeight: 40,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {request.description || t("noDescriptionProvided")}
                        </Typography>

                        <Box
                          sx={{
                            display: "grid",
                            gap: 1,
                            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ minWidth: 0, color: "text.secondary" }}
                          >
                            <LocationOnOutlinedIcon sx={{ fontSize: 18 }} />
                            <Typography variant="body2" noWrap>
                              {request.city}
                            </Typography>
                          </Stack>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ minWidth: 0, color: "text.secondary" }}
                          >
                            <WorkOutlineRoundedIcon sx={{ fontSize: 18 }} />
                            <Typography variant="body2" noWrap>
                              {new Date(request.createdAt).toLocaleDateString()}
                            </Typography>
                          </Stack>
                        </Box>
                      </Stack>
                    ))}
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </ContainerMax>
    </Section>
  );
}
