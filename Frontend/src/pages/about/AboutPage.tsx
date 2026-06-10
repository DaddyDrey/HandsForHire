import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import HandshakeRoundedIcon from "@mui/icons-material/HandshakeRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import ContainerMax from "../../components/common/ContainerMax";
import { useLanguage } from "../../translations/useLanguage";

const steps = [
  {
    icon: <SearchRoundedIcon />,
    title: "aboutStep1Title",
    text: "aboutStep1Text",
  },
  {
    icon: <HandshakeRoundedIcon />,
    title: "aboutStep2Title",
    text: "aboutStep2Text",
  },
  {
    icon: <WorkRoundedIcon />,
    title: "aboutStep3Title",
    text: "aboutStep3Text",
  },
] as const;

const values = [
  "aboutValue1",
  "aboutValue2",
  "aboutValue3",
  "aboutValue4",
] as const;

const faqs = [
  ["aboutFaq1Question", "aboutFaq1Answer"],
  ["aboutFaq2Question", "aboutFaq2Answer"],
  ["aboutFaq3Question", "aboutFaq3Answer"],
  ["aboutFaq4Question", "aboutFaq4Answer"],
  ["aboutFaq5Question", "aboutFaq5Answer"],
] as const;

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <Box
      component="section"
      sx={{
        minHeight: "calc(100vh - 80px)",
        py: { xs: 6, md: 9 },
        background:
          "linear-gradient(135deg, rgba(124,92,255,0.16), transparent 30%), linear-gradient(180deg, #080C16 0%, #0B1020 48%, #07130F 100%)",
      }}
    >
      <ContainerMax>
        <Stack spacing={{ xs: 5, md: 7 }}>
          <Box sx={{ maxWidth: 920 }}>
            <Chip
              icon={<GroupsRoundedIcon />}
              label={t("aboutHeroChip")}
              sx={{
                mb: 2,
                border: "1px solid rgba(124,92,255,0.45)",
                bgcolor: "rgba(124,92,255,0.14)",
                color: "text.primary",
                fontWeight: 800,
              }}
            />

            <Typography
              component="h1"
              sx={{
                maxWidth: 820,
                fontSize: { xs: "2.45rem", md: "4.5rem" },
                fontWeight: 950,
                lineHeight: 1.03,
                color: "text.primary",
              }}
            >
              {t("aboutHeroTitle")}
            </Typography>

            <Typography
              sx={{
                mt: 2.5,
                maxWidth: 760,
                fontSize: { xs: "1rem", md: "1.18rem" },
                lineHeight: 1.8,
                color: "text.secondary",
              }}
            >
              {t("aboutHeroText")}
            </Typography>
          </Box>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 2,
            }}
          >
            {steps.map((item) => (
              <Box
                key={item.title}
                sx={{
                  minHeight: 220,
                  p: { xs: 2.5, md: 3 },
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 3,
                  bgcolor: "rgba(15,23,42,0.62)",
                  boxShadow: "0 18px 60px rgba(0,0,0,0.24)",
                }}
              >
                <Box
                  sx={{
                    width: 46,
                    height: 46,
                    display: "grid",
                    placeItems: "center",
                    mb: 2.25,
                    borderRadius: 2,
                    color: "primary.main",
                    bgcolor: "rgba(124,92,255,0.14)",
                  }}
                >
                  {item.icon}
                </Box>
                <Typography sx={{ fontSize: "1.12rem", fontWeight: 900 }}>
                  {t(item.title)}
                </Typography>
                <Typography sx={{ mt: 1, color: "text.secondary", lineHeight: 1.75 }}>
                  {t(item.text)}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "0.95fr 1.05fr" },
              gap: { xs: 3, md: 5 },
              alignItems: "center",
            }}
          >
            <Box>
              <Chip
                icon={<SecurityRoundedIcon />}
                label={t("aboutBuiltChip")}
                sx={{
                  mb: 2,
                  border: "1px solid rgba(45,212,191,0.35)",
                  bgcolor: "rgba(45,212,191,0.11)",
                  color: "text.primary",
                  fontWeight: 800,
                }}
              />
              <Typography
                component="h2"
                sx={{
                  fontSize: { xs: "2rem", md: "3rem" },
                  fontWeight: 950,
                  lineHeight: 1.08,
                }}
              >
                {t("aboutBuiltTitle")}
              </Typography>
              <Typography sx={{ mt: 2, color: "text.secondary", lineHeight: 1.8 }}>
                {t("aboutBuiltText")}
              </Typography>
            </Box>

            <Stack spacing={1.5}>
              {values.map((value) => (
                <Stack
                  key={value}
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{
                    p: 2,
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 2,
                    bgcolor: "rgba(255,255,255,0.045)",
                  }}
                >
                  <CheckCircleRoundedIcon color="primary" />
                  <Typography sx={{ fontWeight: 800 }}>{t(value)}</Typography>
                </Stack>
              ))}
            </Stack>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "0.8fr 1.2fr" },
              gap: { xs: 3, lg: 4 },
              alignItems: "start",
              p: { xs: 2, md: 3 },
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 4,
              bgcolor: "rgba(7, 12, 24, 0.58)",
              boxShadow: "0 24px 90px rgba(0,0,0,0.28)",
            }}
          >
            <Box
              sx={{
                zIndex: 1,
                position: { xs: "relative", lg: "sticky" },
                top: { lg: 96 },
                p: { xs: 0.5, md: 1 },
              }}
            >
              <Box
                sx={{
                  width: 54,
                  height: 54,
                  display: "grid",
                  placeItems: "center",
                  mb: 2,
                  borderRadius: 3,
                  color: "primary.main",
                  bgcolor: "rgba(124,92,255,0.16)",
                  border: "1px solid rgba(124,92,255,0.3)",
                }}
              >
                <HelpOutlineRoundedIcon />
              </Box>
              <Typography
                component="h2"
                sx={{
                  maxWidth: 420,
                  fontSize: { xs: "2.15rem", md: "3rem" },
                  fontWeight: 950,
                  lineHeight: 1.05,
                }}
              >
                {t("aboutFaqTitle")}
              </Typography>
              <Typography sx={{ maxWidth: 430, color: "text.secondary", lineHeight: 1.8, mt: 1.5 }}>
                {t("aboutFaqSubtitle")}
              </Typography>
            </Box>

            <Stack spacing={1.5}>
              {faqs.map(([question, answer], index) => (
                <Accordion
                  key={question}
                  disableGutters
                  defaultExpanded={index === 0}
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    overflow: "hidden",
                    border: "1px solid rgba(124,92,255,0.48)",
                    borderRadius: "28px !important",
                    bgcolor: "rgba(5,9,18,0.86)",
                    backdropFilter: "blur(22px) saturate(145%)",
                    color: "text.primary",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.16), 0 22px 58px rgba(0,0,0,0.36)",
                    transition: "border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease",
                    "&:before": { display: "none" },
                    "&:after": {
                      content: '""',
                      position: "absolute",
                      inset: "70px 0 0 0",
                      background:
                        "linear-gradient(105deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02) 42%, rgba(45,212,191,0.07))",
                      pointerEvents: "none",
                    },
                    "&:hover": {
                      borderColor: "rgba(255,255,255,0.26)",
                      transform: "translateY(-2px)",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.22), 0 24px 70px rgba(0,0,0,0.38)",
                    },
                    "&.Mui-expanded": {
                      borderColor: "rgba(124,92,255,0.48)",
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreRoundedIcon sx={{ color: "text.primary" }} />}
                    sx={{
                      minHeight: 68,
                      px: { xs: 2, md: 2.5 },
                      py: 0.75,
                      position: "relative",
                      zIndex: 1,
                      borderBottom: "1px solid rgba(255,255,255,0.12)",
                      bgcolor:
                        "linear-gradient(90deg, rgba(14,19,36,0.96), rgba(20,31,53,0.96) 55%, rgba(15,58,54,0.72))",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(0,0,0,0.38)",
                      "& .MuiAccordionSummary-content": {
                        alignItems: "center",
                        gap: 1.5,
                        my: 1,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 34,
                        height: 34,
                        flex: "0 0 auto",
                        display: "grid",
                        placeItems: "center",
                        borderRadius: 2,
                        color: "rgba(228,221,255,0.98)",
                        bgcolor: "rgba(124,92,255,0.28)",
                        border: "1px solid rgba(255,255,255,0.14)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.16)",
                        fontSize: "0.82rem",
                        fontWeight: 950,
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </Box>
                    <Typography
                      sx={{
                        fontSize: { xs: "0.98rem", md: "1.05rem" },
                        fontWeight: 850,
                        lineHeight: 1.35,
                        letterSpacing: 0,
                      }}
                    >
                      {t(question)}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      px: { xs: 2, md: 3 },
                      pt: 1.25,
                      pb: 1.25,
                      position: "relative",
                      zIndex: 1,
                      bgcolor: "rgba(6,11,22,0.52)",
                    }}
                  >
                    <Box
                      sx={{
                        mx: { xs: 0, md: 0.25 },
                        my: 0.25,
                        px: { xs: 2, md: 4.75 },
                        py: { xs: 1.75, md: 2 },
                        minHeight: 78,
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: 2.5,
                        bgcolor:
                          "linear-gradient(105deg, rgba(232,238,246,0.09), rgba(232,238,246,0.035) 48%, rgba(45,212,191,0.055))",
                        boxShadow:
                          "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.26)",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "rgba(219,226,242,0.78)",
                          fontSize: { xs: "1rem", md: "1.08rem" },
                          fontWeight: 650,
                          lineHeight: 1.85,
                        }}
                      >
                        {t(answer)}
                      </Typography>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>
          </Box>
        </Stack>
      </ContainerMax>
    </Box>
  );
}
