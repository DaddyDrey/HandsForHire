import {
  Box,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import RuleRoundedIcon from "@mui/icons-material/RuleRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import ContainerMax from "../../components/common/ContainerMax";
import { useLanguage } from "../../translations/useLanguage";

const sections = [
  ["termsSection1Title", "termsSection1Text"],
  ["termsSection2Title", "termsSection2Text"],
  ["termsSection3Title", "termsSection3Text"],
  ["termsSection4Title", "termsSection4Text"],
  ["termsSection5Title", "termsSection5Text"],
  ["termsSection6Title", "termsSection6Text"],
  ["termsSection7Title", "termsSection7Text"],
  ["termsSection8Title", "termsSection8Text"],
  ["termsSection9Title", "termsSection9Text"],
  ["termsSection10Title", "termsSection10Text"],
  ["termsSection11Title", "termsSection11Text"],
  ["termsSection12Title", "termsSection12Text"],
] as const;

const behaviorRules = [
  "termsRule1",
  "termsRule2",
  "termsRule3",
  "termsRule4",
  "termsRule5",
  "termsRule6",
  "termsRule7",
] as const;

const enforcementRules = [
  "termsEnforcement1",
  "termsEnforcement2",
  "termsEnforcement3",
  "termsEnforcement4",
] as const;

export default function TermsPage() {
  const { t } = useLanguage();

  return (
    <Box
      component="section"
      sx={{
        minHeight: "calc(100vh - 80px)",
        py: { xs: 6, md: 9 },
        background:
          "linear-gradient(135deg, rgba(124,92,255,0.15), transparent 32%), linear-gradient(180deg, #080C16 0%, #0B1020 50%, #07130F 100%)",
      }}
    >
      <ContainerMax>
        <Stack spacing={{ xs: 4.5, md: 6 }}>
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
            <Typography
              component="h1"
              sx={{
                maxWidth: 820,
                fontSize: { xs: "2.15rem", md: "3.2rem" },
                fontWeight: 950,
                lineHeight: 1.05,
                color: "text.primary",
              }}
            >
              {t("termsHeroTitle")}
            </Typography>

            <Typography
              sx={{
                mt: 1,
                maxWidth: 790,
                lineHeight: 1.7,
                color: "text.secondary",
              }}
            >
              {t("termsHeroText")}
            </Typography>
          </Box>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "0.92fr 1.08fr" },
              gap: 2,
              alignItems: "stretch",
            }}
          >
            <Box
              sx={{
                p: { xs: 2.25, md: 3 },
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 4,
                bgcolor: "rgba(15,23,42,0.68)",
                boxShadow: "0 22px 70px rgba(0,0,0,0.28)",
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                <WarningAmberRoundedIcon color="primary" />
                <Typography component="h2" sx={{ fontSize: "1.35rem", fontWeight: 950 }}>
                  {t("termsBehaviorTitle")}
                </Typography>
              </Stack>
              <Typography sx={{ color: "text.secondary", lineHeight: 1.75, mb: 2.25 }}>
                {t("termsBehaviorText")}
              </Typography>
              <Stack spacing={1.1}>
                {behaviorRules.map((rule) => (
                  <Box
                    key={rule}
                    sx={{
                      p: 1.5,
                      border: "1px solid rgba(255,255,255,0.09)",
                      borderRadius: 2,
                      bgcolor: "rgba(255,255,255,0.045)",
                    }}
                  >
                    <Typography sx={{ fontWeight: 750, lineHeight: 1.55 }}>
                      {t(rule)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>

            <Box
              sx={{
                p: { xs: 2.25, md: 3 },
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 4,
                bgcolor: "rgba(7, 12, 24, 0.62)",
                boxShadow: "0 22px 70px rgba(0,0,0,0.28)",
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                <ShieldRoundedIcon color="primary" />
                <Typography component="h2" sx={{ fontSize: "1.35rem", fontWeight: 950 }}>
                  {t("termsEnforcementTitle")}
                </Typography>
              </Stack>
              <Typography sx={{ color: "text.secondary", lineHeight: 1.75, mb: 2.25 }}>
                {t("termsEnforcementText")}
              </Typography>
              <Stack spacing={1.1}>
                {enforcementRules.map((rule) => (
                  <Box
                    key={rule}
                    sx={{
                      p: 1.5,
                      border: "1px solid rgba(124,92,255,0.18)",
                      borderRadius: 2,
                      bgcolor: "rgba(124,92,255,0.08)",
                    }}
                  >
                    <Typography sx={{ fontWeight: 750, lineHeight: 1.55 }}>
                      {t(rule)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
              gap: 2,
            }}
          >
            {sections.map(([title, text], index) => (
              <Box
                key={title}
                sx={{
                  p: { xs: 2.25, md: 2.75 },
                  border: "1px solid rgba(255,255,255,0.11)",
                  borderRadius: 3,
                  bgcolor: "rgba(15,23,42,0.58)",
                  boxShadow: "0 18px 54px rgba(0,0,0,0.22)",
                }}
              >
                <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1.5 }}>
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 2,
                      color: "primary.main",
                      bgcolor: "rgba(124,92,255,0.14)",
                      fontWeight: 950,
                    }}
                  >
                    {index + 1}
                  </Box>
                  <RuleRoundedIcon color="primary" sx={{ fontSize: 20 }} />
                </Stack>
                <Typography component="h2" sx={{ fontSize: "1.12rem", fontWeight: 950 }}>
                  {t(title)}
                </Typography>
                <Typography sx={{ mt: 1, color: "text.secondary", lineHeight: 1.78 }}>
                  {t(text)}
                </Typography>
              </Box>
            ))}
          </Box>
        </Stack>
      </ContainerMax>
    </Box>
  );
}
